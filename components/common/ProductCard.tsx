"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";
import { categoryLabel, type ProductCardData } from "@/schemas/product";

/**
 * Noman's card layout with real catalog fields. Missing rating/sold display 0
 * by the client's explicit decision. A strike price requires a real merchant
 * markdown; New means catalog-added within 30 days; unknown stock has no badge.
 * Shipping days are passed from public checkout terms, never a guessed range.
 */
export type ProductCardProps = ProductCardData & { shippingTime?: string | null };

export function ProductCard({
  id,
  title,
  imageUrl,
  price,
  category,
  salesCount,
  ratingAvg,
  originalPriceBdt,
  isNew,
  inStock,
  shippingTime,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  const formatSold = (value: number | null) => {
    if (!value) return "0 sold";
    if (value >= 1_000_000) return `${Math.floor(value / 1_000_000)}m+ sold`;
    if (value >= 1_000) return `${Math.floor(value / 1_000)}k+ sold`;
    return `${value} sold`;
  };

  const sold = formatSold(salesCount);
  const label = categoryLabel(category);
  const originalPrice = originalPriceBdt != null && originalPriceBdt > price.bdt
    ? originalPriceBdt : null;
  const badge = inStock === false ? "Out of stock" : originalPrice ? "Sale" : isNew ? "New" : null;
  const badgeStyle = badge === "Sale" ? "text-[#00C566] border-[#00C566]"
    : badge === "Out of stock" ? "text-[#FF5C5C] border-[#FF5C5C]"
    : "text-[#333333] border-[#333333] dark:text-gray-200 dark:border-gray-200";

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

        {badge && (
          <div className={`absolute top-3 left-3 px-2 py-0.5 text-[12px] font-medium border rounded bg-white dark:bg-zinc-900 z-10 ${badgeStyle}`}>
            {badge}
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

        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-[13px] font-semibold text-[#555555] dark:text-gray-300">
            {ratingAvg ?? 0} <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
          </div>
          <span className="text-[12px] text-[#999999] border-l border-[#EAE4E3] dark:border-zinc-700 pl-2">
            {sold}
          </span>
        </div>

        {shippingTime && (
          <div className="text-[11px] font-medium text-[#00C566] bg-[#00C566]/10 px-1.5 py-0.5 rounded w-fit mt-1">
            {shippingTime}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="font-bold text-[18px] text-[#333333] dark:text-gray-100">
              ৳{price.bdt.toLocaleString("en-BD")}
            </div>
            {originalPrice !== null && (
              <span className="text-[13px] text-[#999999] dark:text-gray-500 line-through font-medium">
                ৳{originalPrice.toLocaleString("en-BD")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
