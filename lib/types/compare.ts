/**
 * The comparison tray as the backend renders it (CompareViewDto, camelized by
 * the response envelope interceptor).
 *
 * Session state, exactly like the cart and the wishlist: resolved from
 * `buyer_session`, else the guest `compare_token` — never from a user id.
 *
 * Types live here rather than in the service because a `"use server"` module
 * may export nothing but async functions.
 */

export interface CompareItem {
  /** Server compare_item row id. Removal is keyed by `productId`, not this. */
  id: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  /** Whole Taka. null once the product stops being sellable. */
  priceBdt: number | null;
  priceCny: number | null;
  salesCount: number | null;
  /** Minimum order quantity; null when there is none (1 normalises to null). */
  moq: number | null;
  /** Per-unit shipping weight in kg — the column `/compare` exists for. */
  weightKg: number | null;
  available: boolean;
  /**
   * Already widened by the backend to the full `specKeys` union: a key this
   * product lacks is present with a null value, so the table is a rectangle
   * and the client reconciles nothing. Keys are opaque upstream strings and
   * are never case-converted.
   */
  attributes: Record<string, string | null>;
}

export interface CompareView {
  items: CompareItem[];
  /** Union of spec keys in first-seen order — the row list for the table. */
  specKeys: string[];
  count: number;
  /** Hard cap enforced by the backend (COMPARE_MAX). */
  limit: number;
}

/** `limit` mirrors the backend's COMPARE_MAX; a read never invents a tray. */
export const EMPTY_COMPARE: CompareView = {
  items: [],
  specKeys: [],
  count: 0,
  limit: 4,
};

export type CompareResult =
  | { ok: true; compare: CompareView }
  | { ok: false; message: string; errorCode?: string };

/** The backend rejects the 5th distinct product with this code (HTTP 409). */
export const COMPARE_LIMIT_REACHED = "COMPARE_LIMIT_REACHED";
