"use server";

import { api } from "@/lib/api/axios";
import { reviews as reviewUrls } from "@/lib/api/apiUrls";
import { EMPTY_PAGINATION } from "@/lib/types/pagination";
import {
  EMPTY_RATING_BREAKDOWN,
  REVIEW_PAGE_SIZE,
  type MyReviewState,
  type Review,
  type ReviewDeleteResult,
  type ReviewInput,
  type ReviewPage,
  type ReviewWriteResult,
} from "@/lib/types/review";

/**
 * Product reviews.
 *
 * Every call goes through the server-only axios client, so the httpOnly
 * `buyer_session` cookie reaches the backend without the browser ever touching
 * it. Nothing here takes a customer id: the author of a write and the owner of
 * `mine` are both resolved from that cookie.
 *
 * This module is `"use server"`, so it may export async functions and nothing
 * else — the types above come from `lib/types/review.ts`.
 */

function errorOf(error: unknown) {
  return (
    error as {
      response?: { status?: number; data?: { message?: string; errorCode?: string } };
    }
  ).response;
}

function toWriteFailure(error: unknown, fallback: string): ReviewWriteResult {
  const res = errorOf(error);
  return {
    ok: false,
    // The backend's own sentences are already shopper-facing ("You can only
    // review a product you have bought"), so they are shown verbatim rather
    // than replaced with a guess about what went wrong.
    message: res?.data?.message ?? fallback,
    errorCode: res?.data?.errorCode,
  };
}

/**
 * Published reviews for a product, newest first.
 *
 * Public: no session required. `pagination` is lifted from the envelope's
 * sibling block (`totalItems`, not `total`); the aggregates sit inside `data`.
 * Never throws — a product whose reviews we cannot read renders as "no reviews
 * yet", which is also the truth for nearly every product in the catalog.
 */
export async function fetchProductReviews(
  productId: string,
  page = 1,
): Promise<ReviewPage> {
  const empty: ReviewPage = {
    items: [],
    pagination: { ...EMPTY_PAGINATION, page, pageSize: REVIEW_PAGE_SIZE },
    ratingAvg: null,
    ratingCount: null,
    ratingBreakdown: EMPTY_RATING_BREAKDOWN,
  };

  try {
    // `pageSize` is snake_cased to `page_size` by the request interceptor.
    const res = await api.get(reviewUrls.list(productId), {
      params: { page, pageSize: REVIEW_PAGE_SIZE },
    });
    const body = res.data as {
      data?: {
        items?: Review[];
        ratingAvg?: number | null;
        ratingCount?: number | null;
        ratingBreakdown?: ReviewPage["ratingBreakdown"];
      };
      pagination?: ReviewPage["pagination"];
    };

    return {
      items: body.data?.items ?? [],
      pagination: body.pagination ?? empty.pagination,
      // null, never 0: an unreviewed product shows no stars at all.
      ratingAvg: body.data?.ratingAvg ?? null,
      ratingCount: body.data?.ratingCount ?? null,
      ratingBreakdown: body.data?.ratingBreakdown ?? EMPTY_RATING_BREAKDOWN,
    };
  } catch (error) {
    console.error("reviews: list failed", error);
    return empty;
  }
}

/**
 * The signed-in buyer's own review of this product, whatever its status.
 *
 * A 401 means "not signed in", which is a different UI from "signed in and has
 * not reviewed" — hence the four-way state rather than `Review | null`.
 */
export async function fetchMyReview(productId: string): Promise<MyReviewState> {
  try {
    const res = await api.get(reviewUrls.mine(productId));
    // Wrapped as `{ review }` on purpose — a bare null would short-circuit the
    // envelope interceptor and come back as an empty body.
    const review = (res.data as { data?: { review?: Review | null } }).data?.review;
    return review ? { state: "mine", review } : { state: "none" };
  } catch (error) {
    if (errorOf(error)?.status === 401) return { state: "signedOut" };
    console.error("reviews: mine failed", error);
    return { state: "unavailable" };
  }
}

/**
 * Post a review. Buyer-authenticated AND verified-purchase: the backend
 * answers 403 `REVIEW_NOT_PURCHASED` unless the customer owns a
 * paid/confirmed/shipped/delivered order containing this exact product, and
 * 409 `REVIEW_ALREADY_EXISTS` on a second review of the same product (one row
 * per customer per product, enforced by a unique index). Both are surfaced to
 * the shopper rather than guessed at up front — we cannot tell from the
 * catalog alone whether someone bought something.
 */
export async function submitReview(
  productId: string,
  input: ReviewInput,
): Promise<ReviewWriteResult> {
  try {
    const res = await api.post(reviewUrls.create(productId), input);
    return { ok: true, review: (res.data as { data: Review }).data };
  } catch (error) {
    return toWriteFailure(error, "Could not post your review. Try again.");
  }
}

/**
 * Edit your own review. Someone else's is a 404, not a 403.
 *
 * At least one field must be present — a bare `{}` is rejected by the backend
 * as a client bug. Note that editing a review a moderator REJECTED puts it
 * back into the normal flow; an already-published review stays published.
 */
export async function updateReview(
  reviewId: string,
  input: ReviewInput,
): Promise<ReviewWriteResult> {
  try {
    const res = await api.patch(reviewUrls.update(reviewId), input);
    return { ok: true, review: (res.data as { data: Review }).data };
  } catch (error) {
    return toWriteFailure(error, "Could not update your review. Try again.");
  }
}

/** Hard delete of your own review — the author owns their words. 204, no body. */
export async function deleteReview(reviewId: string): Promise<ReviewDeleteResult> {
  try {
    await api.delete(reviewUrls.remove(reviewId));
    return { ok: true };
  } catch (error) {
    const res = errorOf(error);
    return { ok: false, message: res?.data?.message ?? "Could not delete your review." };
  }
}
