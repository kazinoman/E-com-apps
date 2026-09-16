"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/UserInfoContext";
import {
  deleteReview,
  fetchMyReview,
  fetchProductReviews,
  submitReview,
  updateReview,
} from "@/services/review.service";
import {
  REVIEW_BODY_MAX,
  REVIEW_TITLE_MAX,
  type MyReviewState,
  type Review,
  type ReviewPage,
} from "@/lib/types/review";
import { ReviewStars, ReviewStarsInput } from "./ReviewStars";

/**
 * The Reviews tab.
 *
 * Reading is public; writing needs a signed-in buyer who actually bought this
 * product. We cannot know from the catalog whether the viewer bought it, so the
 * form is always offered to a signed-in shopper and the backend's own 403
 * ("You can only review a product you have bought") is shown when it is not
 * true. Hiding the form on a guess would silently lock out real customers.
 *
 * Every API call goes through `services/review.service.ts` — a `"use server"`
 * module — because the axios client imports `next/headers` and cannot be
 * imported from a Client Component.
 */

interface ProductReviewsProps {
  productId: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/**
 * What to tell the author about their own review, based on the status the row
 * actually carries. A review is created `published` today (the verified-
 * purchase gate replaces a moderation queue), so we do NOT promise "awaiting
 * approval" unless the backend really says `pending`.
 */
function statusNotice(status: Review["status"]): { tone: string; text: string } {
  switch (status) {
    case "pending":
      return {
        tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        text: "Awaiting approval. It is not on the product page yet — you do not need to post it again.",
      };
    case "rejected":
      return {
        tone: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        text: "This review was not published. Editing it submits it again.",
      };
    default:
      return {
        tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        text: "Your review is live on this page.",
      };
  }
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { isLogin } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<ReviewPage | null>(null);
  const [mine, setMine] = useState<MyReviewState | null>(null);
  const [loading, setLoading] = useState(true);

  // Write form
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);

  const loadList = useCallback(
    async (p: number) => {
      setLoading(true);
      setReviews(await fetchProductReviews(productId, p));
      setLoading(false);
    },
    [productId],
  );

  useEffect(() => {
    void loadList(page);
  }, [loadList, page]);

  useEffect(() => {
    // `mine` is buyer-authenticated; an anonymous call is a 401 the service
    // turns into `signedOut`, so there is nothing to ask for when logged out.
    if (!isLogin) {
      setMine({ state: "signedOut" });
      return;
    }
    let live = true;
    void fetchMyReview(productId).then((m) => {
      if (live) setMine(m);
    });
    return () => {
      live = false;
    };
  }, [productId, isLogin]);

  const startEdit = (review: Review) => {
    setRating(review.rating);
    setTitle(review.title ?? "");
    setBody(review.body ?? "");
    setWriteError(null);
    setEditing(true);
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setBody("");
    setWriteError(null);
    setEditing(false);
  };

  const handleSubmit = async () => {
    if (rating < 1) return;
    setSaving(true);
    setWriteError(null);

    // Empty strings are omitted, not sent: the backend rejects a zero-length
    // title or body (min 1), while an absent one is a valid rating-only review.
    const input = {
      rating,
      ...(title.trim() ? { title: title.trim() } : {}),
      ...(body.trim() ? { body: body.trim() } : {}),
    };

    const existing = mine?.state === "mine" ? mine.review : null;
    const result = existing
      ? await updateReview(existing.id, input)
      : await submitReview(productId, input);
    setSaving(false);

    if (!result.ok) {
      setWriteError(result.message);
      if (result.errorCode === "REVIEW_ALREADY_EXISTS") {
        // One row per customer per product. Our copy of `mine` is stale — pull
        // the real one so the shopper gets the edit form instead of a dead end.
        setMine(await fetchMyReview(productId));
      }
      return;
    }

    setMine({ state: "mine", review: result.review });
    setEditing(false);
    toast.success(existing ? "Review updated" : "Thanks for your review");
    await loadList(1);
    setPage(1);
    // The product header renders ratingAvg from the server; refresh so it
    // reflects the aggregate this review just changed.
    router.refresh();
  };

  const handleDelete = async () => {
    if (mine?.state !== "mine") return;
    setSaving(true);
    const result = await deleteReview(mine.review.id);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setMine({ state: "none" });
    resetForm();
    toast.success("Review removed");
    await loadList(1);
    setPage(1);
    router.refresh();
  };

  const showForm =
    mine?.state === "none" || (mine?.state === "mine" && editing);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Summary — only when a real aggregate exists. `ratingAvg` is null for
          effectively the whole catalog; nothing is invented to fill the gap. */}
      {reviews && reviews.ratingAvg !== null ? (
        <div className="flex flex-wrap items-center gap-4 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <div className="text-4xl font-bold text-slate-800 dark:text-gray-100">
            {reviews.ratingAvg.toFixed(1)}
          </div>
          <div>
            <ReviewStars rating={reviews.ratingAvg} size="md" />
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
              {reviews.ratingCount === 1 ? "1 review" : `${reviews.ratingCount ?? 0} reviews`}
            </p>
          </div>
          <div className="flex-1 min-w-[200px] space-y-1">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = reviews.ratingBreakdown[String(star) as "1"] ?? 0;
              const total = reviews.ratingCount ?? 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                  <span className="w-3 tabular-nums">{star}</span>
                  <span className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <span className="block h-full bg-orange-400" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-6 text-right tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Write path */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
        {mine === null ? (
          <p className="text-sm text-slate-500 dark:text-gray-400">Loading…</p>
        ) : mine.state === "signedOut" ? (
          <p className="text-sm text-slate-500 dark:text-gray-400">
            <Link href="/login" className="font-semibold text-slate-800 dark:text-gray-100 underline">
              Sign in
            </Link>{" "}
            to review this product. Only customers who have bought it can leave a review.
          </p>
        ) : mine.state === "unavailable" ? (
          <p className="text-sm text-slate-500 dark:text-gray-400">
            We could not check whether you have already reviewed this product. Reload the page to try again.
          </p>
        ) : mine.state === "mine" && !editing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-slate-800 dark:text-gray-100">Your review</h3>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <button
                  onClick={() => startEdit(mine.review)}
                  className="text-slate-800 dark:text-gray-100 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
            {(() => {
              const notice = statusNotice(mine.review.status);
              return (
                <p className={`text-xs font-medium rounded-lg px-3 py-2 ${notice.tone}`}>{notice.text}</p>
              );
            })()}
            <ReviewItem review={mine.review} />
          </div>
        ) : null}

        {showForm && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-gray-100">
              {mine?.state === "mine" ? "Edit your review" : "Write a review"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              You can review a product once you have an order for it that we have confirmed.
            </p>

            <ReviewStarsInput value={rating} onChange={setRating} disabled={saving} />

            <input
              type="text"
              value={title}
              maxLength={REVIEW_TITLE_MAX}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-3 text-sm text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
            />

            <textarea
              value={body}
              maxLength={REVIEW_BODY_MAX}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="What was it like? (optional)"
              className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-3 text-sm text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6] resize-y"
            />

            {/* The backend's sentence, verbatim — including the 403 a shopper
                gets when they have not bought this product. */}
            {writeError && (
              <p className="text-sm text-red-600 dark:text-red-400">{writeError}</p>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving || rating < 1}
                className="bg-[#333333] dark:bg-white text-white dark:text-[#333333] px-6 py-2.5 rounded-lg text-sm font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {saving ? "Saving…" : mine?.state === "mine" ? "Save changes" : "Post review"}
              </button>
              {mine?.state === "mine" && (
                <button
                  onClick={resetForm}
                  disabled={saving}
                  className="text-sm font-semibold text-slate-500 dark:text-gray-400 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Published list */}
      {loading && !reviews ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10">Loading reviews…</p>
      ) : !reviews || reviews.items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-10">
          No reviews yet. This product has not been reviewed by a customer — be the first once
          your order is confirmed.
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.items.map((review) => (
            <div key={review.id} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
              <ReviewItem review={review} />
            </div>
          ))}

          {reviews.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="text-sm font-semibold text-slate-800 dark:text-gray-100 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-slate-500 dark:text-gray-400 tabular-nums">
                Page {reviews.pagination.page} of {reviews.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(reviews.pagination.totalPages, p + 1))}
                disabled={page >= reviews.pagination.totalPages || loading}
                className="text-sm font-semibold text-slate-800 dark:text-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/** One review. `authorName` is a display name or "Anonymous" — never contact
 * details, which the backend deliberately never sends. */
function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <ReviewStars rating={review.rating} />
        <span className="text-sm font-semibold text-slate-800 dark:text-gray-100">
          {review.authorName}
        </span>
        {review.verifiedPurchase && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Verified purchase
          </span>
        )}
        <span className="text-xs text-slate-400 dark:text-gray-500">
          {formatDate(review.createdAt)}
        </span>
      </div>
      {review.title && (
        <p className="text-sm font-semibold text-slate-800 dark:text-gray-100">{review.title}</p>
      )}
      {review.body && (
        <p className="text-sm text-slate-600 dark:text-gray-400 whitespace-pre-line">{review.body}</p>
      )}
    </div>
  );
}
