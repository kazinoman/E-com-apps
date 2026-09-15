"use server";

import { api } from "@/lib/api/axios";
import { cart as cartUrls } from "@/lib/api/apiUrls";
import { relaySessionCookie } from "@/lib/session-cookie";
import { EMPTY_CART, type CartResult, type CartView } from "@/lib/types/cart";

/**
 * The cart lives on the server, for guests as well as signed-in customers.
 *
 * There is no user id in any of these calls. The backend resolves the cart
 * from cookies alone — `buyer_session` if the shopper is signed in, otherwise
 * the httpOnly `cart_token` it mints on the first `POST /cart/items` and keeps
 * for 60 days (CartResolverService). On login the backend merges the guest
 * cart into the customer cart itself (`mergeGuestIntoCustomer`), so the client
 * must not merge anything of its own — doing both double-counts every line.
 *
 * Each mutation answers with the entire recomputed cart. Nothing here returns
 * a partial update and nothing on the client recomputes a total: the server
 * owns pricing, MOQ adjustment and the price-drift check.
 */

/** Copy any `cart_token` the backend minted onto the shopper's browser. */
async function relay(headers: unknown) {
  const setCookie = (headers as Record<string, unknown> | undefined)?.["set-cookie"];
  await relaySessionCookie(setCookie as string | string[] | undefined);
}

function toResult(res: { data?: { data?: CartView }; headers?: unknown }): CartView {
  return res.data?.data ?? EMPTY_CART;
}

function toFailure(error: unknown): CartResult {
  const res = (error as { response?: { data?: { message?: string; errorCode?: string } } })?.response;
  return {
    ok: false,
    message: res?.data?.message ?? "Could not reach the store. Try again.",
    errorCode: res?.data?.errorCode,
  };
}

/**
 * Read the cart. Never throws: a cart we cannot fetch renders as empty rather
 * than taking the page down, since this runs in the root layout on every
 * request.
 */
export async function fetchCart(): Promise<CartView> {
  try {
    const res = await api.get(cartUrls.get);
    return toResult(res);
  } catch (error) {
    console.error("cart: fetch failed", error);
    return EMPTY_CART;
  }
}

export async function addCartItem(input: {
  productId: string;
  skuExternalId?: string | null;
  quantity: number;
}): Promise<CartResult> {
  try {
    // The request interceptor snake_cases this body into the shape
    // AddItemDto expects (product_id, sku_external_id, quantity).
    const res = await api.post(cartUrls.add, {
      productId: input.productId,
      skuExternalId: input.skuExternalId ?? null,
      quantity: input.quantity,
    });
    // First add for a guest is where `cart_token` is born — relay it or the
    // next request starts a brand new cart.
    await relay(res.headers);
    return { ok: true, cart: toResult(res) };
  } catch (error) {
    return toFailure(error);
  }
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartResult> {
  try {
    const res = await api.patch(cartUrls.update(itemId), { quantity });
    await relay(res.headers);
    return { ok: true, cart: toResult(res) };
  } catch (error) {
    return toFailure(error);
  }
}

export async function removeCartItem(itemId: string): Promise<CartResult> {
  try {
    const res = await api.delete(cartUrls.remove(itemId));
    await relay(res.headers);
    return { ok: true, cart: toResult(res) };
  } catch (error) {
    return toFailure(error);
  }
}

/** `DELETE /cart` answers 204 with no body, so the emptied cart is synthesised. */
export async function clearCart(): Promise<CartResult> {
  try {
    const res = await api.delete(cartUrls.clear);
    await relay(res.headers);
    return { ok: true, cart: EMPTY_CART };
  } catch (error) {
    return toFailure(error);
  }
}
