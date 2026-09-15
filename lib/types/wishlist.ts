/**
 * The wishlist as the backend renders it (WishlistViewDto, camelized by the
 * response interceptor). Like the cart it is session state, resolved from
 * `buyer_session` or the guest `wishlist_token` — never from a user id.
 */
export interface WishlistLine {
  id: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  /** null once the product stops being sellable. */
  priceBdt: number | null;
  priceCny: number | null;
  salesCount: number | null;
  /** Minimum order quantity; null when there is none. */
  moq: number | null;
  weightKg: number | null;
  available: boolean;
  addedAt: string;
}

export interface WishlistView {
  items: WishlistLine[];
  count: number;
}

export const EMPTY_WISHLIST: WishlistView = { items: [], count: 0 };

export type WishlistResult =
  | { ok: true; wishlist: WishlistView }
  | { ok: false; message: string; errorCode?: string };
