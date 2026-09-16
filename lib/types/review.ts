import type { PaginationMeta } from "./pagination";

/**
 * Product reviews, as the backend renders them
 * (`modules/reviews/dto/review-view.dto.ts`, camelized by the response
 * interceptor).
 *
 * These live in `lib/types` rather than in `services/review.service.ts`
 * because a `"use server"` module may export nothing but async functions — an
 * exported interface or const there is a build error.
 */

/**
 * `published` is what a new review is created as — see `REVIEW_DEFAULT_STATUS`
 * in reviews.service.ts. The write path is gated on a verified purchase, which
 * is a stronger filter than a queue, so moderation is after-the-fact: an admin
 * can flip a row to `rejected`, and `pending` exists for a queue that is not
 * wired up today. The UI therefore renders whatever `status` the API returns
 * and never promises the shopper a review is "awaiting approval" unless the
 * row actually says `pending`.
 */
export type ReviewStatus = "pending" | "published" | "rejected";

export interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string | null;
  body: string | null;
  /** The reviewer's display name, or "Anonymous". Never an email or phone. */
  authorName: string;
  /** Always true today: only verified purchasers can post. */
  verifiedPurchase: boolean;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

/** How many published reviews gave each star value. Always all five keys. */
export type RatingBreakdown = Record<"1" | "2" | "3" | "4" | "5", number>;

/**
 * `GET /products/:id/reviews`, flattened.
 *
 * `pagination` arrives as a SIBLING of `data` and its count field is
 * `totalItems`; the aggregates arrive inside `data` alongside `items`.
 *
 * `ratingAvg` / `ratingCount` are null — not 0 — for a product nobody has
 * reviewed, which is effectively the whole freshly imported catalog. Render
 * nothing for null; never a fabricated average and never "0.0 (0 reviews)".
 */
export interface ReviewPage {
  items: Review[];
  pagination: PaginationMeta;
  ratingAvg: number | null;
  ratingCount: number | null;
  ratingBreakdown: RatingBreakdown;
}

/**
 * What `GET /products/:id/reviews/mine` told us.
 *
 * The endpoint is buyer-authenticated, so an anonymous visitor gets a 401
 * rather than a null review — a distinction the UI must keep, because "sign in
 * to review" and "you have not reviewed this yet" are different screens.
 * `unavailable` is a network/5xx failure: we do not know, so we say nothing.
 */
export type MyReviewState =
  | { state: "signedOut" }
  | { state: "none" }
  | { state: "mine"; review: Review }
  | { state: "unavailable" };

export interface ReviewInput {
  rating: number;
  title?: string;
  body?: string;
}

/**
 * A write result. `errorCode` is the backend's machine-readable code, kept so
 * the form can react to the two it has a real answer for:
 *   - `REVIEW_NOT_PURCHASED` (403) — the buyer has no paid/confirmed/shipped/
 *     delivered order containing this product.
 *   - `REVIEW_ALREADY_EXISTS` (409) — one review per customer per product; the
 *     fix is a PATCH, not a second POST.
 * `message` is the backend's own sentence and is shown to the shopper as-is.
 */
export type ReviewWriteResult =
  | { ok: true; review: Review }
  | { ok: false; message: string; errorCode?: string };

export type ReviewDeleteResult = { ok: true } | { ok: false; message: string };

/** Backend allows 1–50; 10 is its default and enough for one screen. */
export const REVIEW_PAGE_SIZE = 10;

export const EMPTY_RATING_BREAKDOWN: RatingBreakdown = {
  "1": 0,
  "2": 0,
  "3": 0,
  "4": 0,
  "5": 0,
};

export const REVIEW_TITLE_MAX = 120;
export const REVIEW_BODY_MAX = 4000;

/**
 * Order statuses that make a buyer eligible to review a line on that order —
 * mirrors `PURCHASED_ORDER_STATUSES` in the backend
 * (`modules/reviews/review-eligibility.ts`). Used only to decide whether to
 * offer a "write a review" link; the backend is still the authority and
 * answers 403 if this list ever drifts.
 */
export const REVIEWABLE_ORDER_STATUSES = new Set([
  "paid",
  "confirmed",
  "shipped",
  "delivered",
]);
