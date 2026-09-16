"use server";

import { api } from "@/lib/api/axios";
import { compare as compareUrls } from "@/lib/api/apiUrls";
import { relaySessionCookie } from "@/lib/session-cookie";
import { EMPTY_COMPARE, type CompareResult, type CompareView } from "@/lib/types/compare";

/**
 * Session-scoped product comparison — the same contract as the cart and the
 * wishlist.
 *
 * No user id crosses the wire: the backend resolves the tray from
 * `buyer_session`, else the httpOnly `compare_token` it mints on the first
 * write. Removal is keyed by *product* id, not by the compare_item row id, and
 * add/remove answer with the whole recomputed comparison — including the
 * recomputed `specKeys` union — so the client stores what the server sent and
 * never patches its own copy.
 *
 * Guests get a tray too, which is why every mutation relays `set-cookie`: drop
 * that and a guest's comparison silently resets on every request.
 */

async function relay(headers: unknown) {
  const setCookie = (headers as Record<string, unknown> | undefined)?.["set-cookie"];
  await relaySessionCookie(setCookie as string | string[] | undefined);
}

function toView(res: { data?: { data?: CompareView } }): CompareView {
  return res.data?.data ?? EMPTY_COMPARE;
}

function toFailure(error: unknown): CompareResult {
  const res = (error as { response?: { data?: { message?: string; errorCode?: string } } })?.response;
  return {
    ok: false,
    message: res?.data?.message ?? "Could not reach the store. Try again.",
    errorCode: res?.data?.errorCode,
  };
}

/** Never throws — a comparison we cannot read renders as empty. */
export async function fetchCompare(): Promise<CompareView> {
  try {
    return toView(await api.get(compareUrls.get));
  } catch (error) {
    console.error("compare: fetch failed", error);
    return EMPTY_COMPARE;
  }
}

/**
 * Add one product. Re-adding something already in the tray is a backend no-op
 * and does NOT trip the cap; the 5th *distinct* product comes back 409
 * COMPARE_LIMIT_REACHED with the message to show the shopper.
 */
export async function addToCompare(productId: string): Promise<CompareResult> {
  try {
    // Snake-cased to `product_id` by the request interceptor.
    const res = await api.post(compareUrls.add, { productId });
    // First add for a guest is where `compare_token` is born.
    await relay(res.headers);
    return { ok: true, compare: toView(res) };
  } catch (error) {
    return toFailure(error);
  }
}

export async function removeFromCompare(productId: string): Promise<CompareResult> {
  try {
    const res = await api.delete(compareUrls.remove(productId));
    await relay(res.headers);
    return { ok: true, compare: toView(res) };
  } catch (error) {
    return toFailure(error);
  }
}

/**
 * Empty the tray. This one answers 204 with no body — clearing an absent tray
 * is a no-op and never mints a cookie — so the empty view is synthesised here
 * rather than read off the response.
 */
export async function clearCompare(): Promise<CompareResult> {
  try {
    const res = await api.delete(compareUrls.clear);
    await relay(res.headers);
    return { ok: true, compare: EMPTY_COMPARE };
  } catch (error) {
    return toFailure(error);
  }
}
