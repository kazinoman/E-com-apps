"use server";

import { api } from "@/lib/api/axios";
import { wishlist as wishlistUrls } from "@/lib/api/apiUrls";
import { relaySessionCookie } from "@/lib/session-cookie";
import { EMPTY_WISHLIST, type WishlistResult, type WishlistView } from "@/lib/types/wishlist";

/**
 * Session-scoped wishlist — the same contract as the cart.
 *
 * No user id crosses the wire: the backend resolves the wishlist from
 * `buyer_session`, else the httpOnly `wishlist_token` it mints on the first
 * write. Removal is keyed by *product* id, not by the wishlist row id, and
 * every mutation answers with the whole recomputed list, so the client stores
 * what the server sent and never patches its own copy.
 *
 * Guests get a wishlist too. A read never mints a cookie (an anonymous GET is
 * an empty wishlist, not a new row) — only add and remove do.
 */

async function relay(headers: unknown) {
  const setCookie = (headers as Record<string, unknown> | undefined)?.["set-cookie"];
  await relaySessionCookie(setCookie as string | string[] | undefined);
}

function toView(res: { data?: { data?: WishlistView } }): WishlistView {
  return res.data?.data ?? EMPTY_WISHLIST;
}

function toFailure(error: unknown): WishlistResult {
  const res = (error as { response?: { data?: { message?: string; errorCode?: string } } })?.response;
  return {
    ok: false,
    message: res?.data?.message ?? "Could not reach the store. Try again.",
    errorCode: res?.data?.errorCode,
  };
}

/** Never throws — a wishlist we cannot read renders as empty. */
export async function fetchWishlist(): Promise<WishlistView> {
  try {
    return toView(await api.get(wishlistUrls.get));
  } catch (error) {
    console.error("wishlist: fetch failed", error);
    return EMPTY_WISHLIST;
  }
}

export async function addToWishlist(productId: string): Promise<WishlistResult> {
  try {
    // Snake-cased to `product_id` by the request interceptor.
    const res = await api.post(wishlistUrls.add, { productId });
    // First add for a guest is where `wishlist_token` is born.
    await relay(res.headers);
    return { ok: true, wishlist: toView(res) };
  } catch (error) {
    return toFailure(error);
  }
}

export async function removeFromWishlist(productId: string): Promise<WishlistResult> {
  try {
    const res = await api.delete(wishlistUrls.remove(productId));
    await relay(res.headers);
    return { ok: true, wishlist: toView(res) };
  } catch (error) {
    return toFailure(error);
  }
}
