"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { CompareButton } from "@/components/common/CompareButton";
import { cn } from "@/lib/utils";
import { categoryLabel, type ProductCardData } from "@/schemas/product";

/**
 * A catalog card, rendered straight from what the API returns.
 *
 * Two fields are deliberately optional and render as nothing when absent:
 * `ratingAvg` is null for virtually every product (nobody has reviewed a fresh
 * import) and there is no brand on a card at all. Substituting a default —
 * 0 stars, 4.5, "No brand" — would be inventing product information, which is
 * the same mistake as the strikethrough "original price" this card used to
 * fabricate as `price + 100`.
 */
export type ProductCardProps = ProductCardData;

export function ProductCard({
  id,
  title,
  imageUrl,
  price,
  category,
  salesCount,
  moq,
  ratingAvg,
  ratingCount,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  const formatSold = (value: number | null) => {
    if (!value) return null;
    if (value >= 1_000_000) return `${Math.floor(value / 1_000_000)}m+ sold`;
    if (value >= 1_000) return `${Math.floor(value / 1_000)}k+ sold`;
    return `${value} sold`;
  };

  const sold = formatSold(salesCount);
  const label = categoryLabel(category);

  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col h-full w-full min-w-[200px] bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-800 rounded-2xl p-2.5 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/4.5] bg-[#F6F6F9] dark:bg-zinc-800 rounded-xl flex items-center justify-center p-6 overflow-hidden">
        {/* Wishlist Button — shown signed out too: the backend keeps a guest
            wishlist against `wishlist_token` and merges it on login. */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute top-3 right-3 p-1.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm z-20 transition-all duration-300",
            isWished ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
          )}
        >
          <Heart
            className={cn(
              "w-[18px] h-[18px]",
              isWished ? "fill-[#FF4D4F] text-[#FF4D4F]" : "text-gray-400 hover:text-[#FF4D4F]"
            )}
          />
        </button>

        <CompareButton
          productId={id}
          className={cn(
            "absolute top-[3.25rem] right-3 p-1.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm z-20 transition-all duration-300",
            "opacity-100 lg:opacity-0 lg:group-hover:opacity-100",
          )}
        />

        {moq && moq > 1 && (
          <div className="absolute top-3 left-3 px-2 py-0.5 text-[12px] font-medium border rounded bg-white dark:bg-zinc-900 z-10 text-[#333333] border-[#333333] dark:text-gray-200 dark:border-gray-200">
            Min {moq}
          </div>
        )}

        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-normal"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="px-2 pt-4 pb-2 flex flex-col flex-grow justify-between gap-1">
        <div className="space-y-1">
          {label && (
            <span className="text-[13px] text-[#999999] dark:text-gray-400 font-medium">{label}</span>
          )}
          <h3 className="font-semibold text-[15px] leading-snug text-[#333333] dark:text-gray-100 line-clamp-2 min-h-[42px]">
            {title}
          </h3>
        </div>

        {/* Ratings exist for almost nothing in this catalog; the row collapses
            rather than showing a zero that reads as a bad review. */}
        {(ratingAvg !== null || sold) && (
          <div className="flex items-center gap-2 mt-1">
            {ratingAvg !== null && (
              <div className="flex items-center gap-1 text-[13px] font-semibold text-[#555555] dark:text-gray-300">
                {ratingAvg.toFixed(1)} <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                {ratingCount ? (
                  <span className="text-[12px] font-normal text-[#999999]">({ratingCount})</span>
                ) : null}
              </div>
            )}
            {sold && (
              <span
                className={cn(
                  "text-[12px] text-[#999999]",
                  ratingAvg !== null && "border-l border-[#EAE4E3] dark:border-zinc-700 pl-2"
                )}
              >
                {sold}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="font-bold text-[18px] text-[#333333] dark:text-gray-100">
            ৳{price.bdt.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
