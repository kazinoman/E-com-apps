/**
 * In-memory state for the mock API.
 *
 * Carts and wishlists live in module-level Maps and reset when the dev server
 * restarts. That is intentional: the mock exists so the storefront can be
 * developed with the backend down, not to be a second implementation of it.
 *
 * Identity here mirrors the real backend exactly:
 *   - a guest is the `cart_token` cookie, issued on the first add to cart
 *   - a signed-in customer is the `buyer_session` cookie
 * Neither is ever accepted from a query parameter or a request body. The real
 * API works this way so a shopper cannot read another shopper's cart by
 * changing an id, and the mock must not teach the frontend a laxer habit.
 */
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export interface CartItem {
  id: string;
  productId: string;
  skuExternalId: string | null;
  title: string;
  imageUrl: string;
  attributes: Record<string, string>;
  quantity: number;
  unitPriceBdt: number;
  lineTotalBdt: number;
  moq: number;
  activeTierMinQty: number | null;
  belowMoq: boolean;
  unavailable: boolean;
  priceChanged: { fromBdt: number; toBdt: number } | null;
}

export interface Cart {
  items: CartItem[];
  subtotalBdt: number;
  shippingBdt: number;
  totalBdt: number;
  notice: string | null;
}

export interface WishlistItem {
  productId: string;
  title: string;
  imageUrl: string;
  priceBdt: number;
}

export interface Wishlist {
  items: WishlistItem[];
  count: number;
}

/** Matches merchant_config.shipping_flat_bdt on the real backend. */
export const SHIPPING_FLAT_BDT = 120;

const carts = new Map<string, Cart>();
const wishlists = new Map<string, Wishlist>();

export const emptyCart = (): Cart => ({
  items: [],
  subtotalBdt: 0,
  shippingBdt: 0,
  totalBdt: 0,
  notice: null,
});

/**
 * Recompute the cart's money from its lines.
 *
 * On the real backend the unit price is SNAPSHOT at add time and the line
 * total is unit x quantity with no second rounding, so the arithmetic lives
 * server-side and the client never computes a total. Same here.
 */
export function recalculate(cart: Cart): Cart {
  for (const item of cart.items) {
    item.lineTotalBdt = item.unitPriceBdt * item.quantity;
    item.belowMoq = item.quantity < item.moq;
  }
  cart.subtotalBdt = cart.items.reduce((sum, i) => sum + i.lineTotalBdt, 0);
  cart.shippingBdt = cart.items.length > 0 ? SHIPPING_FLAT_BDT : 0;
  cart.totalBdt = cart.subtotalBdt + cart.shippingBdt;
  return cart;
}

/** The caller's cart_token, or null if they have never added anything. */
export async function readCartToken(): Promise<string | null> {
  return (await cookies()).get("cart_token")?.value ?? null;
}

/** The caller's buyer_session, or null when signed out. */
export async function readSession(): Promise<string | null> {
  return (await cookies()).get("buyer_session")?.value ?? null;
}

export const newToken = () => randomUUID();

export function getCart(token: string | null): Cart {
  if (!token) return emptyCart();
  return carts.get(token) ?? emptyCart();
}

export function saveCart(token: string, cart: Cart): Cart {
  carts.set(token, recalculate(cart));
  return carts.get(token)!;
}

/**
 * Wishlists key on the session when signed in and fall back to the cart token
 * for guests, mirroring the real backend's guest wishlist.
 */
export function getWishlist(key: string | null): Wishlist {
  if (!key) return { items: [], count: 0 };
  return wishlists.get(key) ?? { items: [], count: 0 };
}

export function saveWishlist(key: string, wishlist: Wishlist): Wishlist {
  wishlist.count = wishlist.items.length;
  wishlists.set(key, wishlist);
  return wishlist;
}

/** Cookie attributes copied from the real backend's Set-Cookie headers. */
export const CART_COOKIE = {
  name: "cart_token",
  maxAge: 5_184_000, // 60 days
} as const;

export const SESSION_COOKIE = {
  name: "buyer_session",
  maxAge: 2_592_000, // 30 days
} as const;
