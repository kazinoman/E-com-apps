"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Package, ShoppingCart, Loader2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { CompareButton } from "@/components/common/CompareButton";
import { cn } from "@/lib/utils";
import { categoryLabel, type ProductCardData } from "@/schemas/product";

/**
 * Noman's card layout with real catalog fields. Missing rating/sold display 0
 * by the client's explicit decision. A strike price requires a real merchant
 * markdown; New means catalog-added within 30 days; unknown stock has no badge.
 * Shipping days are passed from public checkout terms, never a guessed range.
 *
 * MOQ sits in the rating/sold row, not on the image — it's a fact about the
 * listing, read alongside sold count, not a status flag like the image
 * corner badge (Out of stock/Sale/New). Wishlist, compare and add-to-cart
 * are grouped together in the bottom-right, beside the price, as one action
 * row — nothing floats over the product photo any more.
 *
 * Add-to-cart: no SKU is picked here (that choice belongs on the product
 * page), so it adds the product's own base price/base image at its real
 * MOQ, exactly what `CartService.resolveProduct` does for a null SKU.
 * Disabled when the catalog's own stock signal says `inStock === false`.
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
  moq,
  originalPriceBdt,
  isNew,
  inStock,
  shippingTime,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWished = isInWishlist(id);
  const [isAdding, setIsAdding] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  // No SKU picked here — a variant choice belongs on the product page, not a
  // grid card. The backend resolves that to the product's own base price
  // (see CartService.resolveProduct), never a guess. Floor at the real MOQ,
  // same number the badge above already shows, never a hardcoded 1.
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdding || inStock === false) return;
    setIsAdding(true);
    await addToCart(id, moq && moq > 1 ? moq : 1, null);
    setIsAdding(false);
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

  const hasMoq = moq != null && moq > 1;

  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col h-full w-full min-w-[200px] bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-800 rounded-2xl p-2.5 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/4.5] bg-[#F6F6F9] dark:bg-zinc-800 rounded-xl flex items-center justify-center p-6 overflow-hidden">

        {/* Scrim behind the status badge: a busy or dark product photo (this
            catalog has plenty) can otherwise sit right under it with no
            separation. Fixed height, not tied to the badge's presence, so
            it never pops in/out as content changes. */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent z-[5] pointer-events-none" />

        {/* ── Top-left: status badge only — MOQ moved into the rating row ── */}
        {badge && (
          <div className={`absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[11px] font-semibold leading-tight border rounded bg-white dark:bg-zinc-900 shadow-sm ${badgeStyle}`}>
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
      <div className="px-2 pt-3.5 pb-2 flex flex-col flex-grow justify-between gap-1">
        <div className="space-y-1">
          {label && (
            <span className="text-[12px] text-[#999999] dark:text-gray-400 font-medium tracking-wide uppercase">{label}</span>
          )}
          <h3 className="font-semibold text-[14px] leading-snug text-[#333333] dark:text-gray-100 line-clamp-2 min-h-[40px]">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex items-center gap-1 text-[12px] font-semibold text-[#555555] dark:text-gray-300">
            {ratingAvg ?? 0} <Star className="w-3 h-3 fill-[#FFB800] text-[#FFB800]" />
          </div>
          <span className="text-[11px] text-[#999999] border-l border-[#EAE4E3] dark:border-zinc-700 pl-2">
            {sold}
          </span>
          {hasMoq && (
            <span className="flex items-center gap-1 text-[11px] text-[#999999] border-l border-[#EAE4E3] dark:border-zinc-700 pl-2">
              <Package className="w-3 h-3 shrink-0" />
              MOQ&nbsp;{moq}
            </span>
          )}
        </div>

        {shippingTime && (
          <div className="text-[10px] font-semibold text-[#00C566] bg-[#00C566]/10 px-1.5 py-0.5 rounded w-fit mt-0.5 tracking-wide">
            {shippingTime}
          </div>
        )}

        <div className="flex items-end justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <div className="font-extrabold text-xl leading-none text-[#333333] dark:text-gray-50 tracking-tight">
              ৳{price.bdt.toLocaleString("en-BD")}
            </div>
            {originalPrice !== null && (
              <span className="text-[12px] text-[#AAAAAA] dark:text-gray-500 line-through font-medium">
                ৳{originalPrice.toLocaleString("en-BD")}
              </span>
            )}
          </div>

          {/* Wishlist, compare and add-to-cart as one action row, beside
              the price — nothing floats over the product photo. */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleWishlistClick}
              aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#F0F0F0] dark:border-zinc-700 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <Heart
                className={cn(
                  "w-[17px] h-[17px] transition-colors",
                  isWished ? "fill-[#FF4D4F] text-[#FF4D4F]" : "text-gray-400 hover:text-[#FF4D4F]"
                )}
              />
            </button>
            {/* No text-color utility here: CompareButton owns its own
                active/inactive color, and `cn()` (twMerge) would let a color
                class passed in here silently win over it, hiding the
                "already in comparison" state. */}
            <CompareButton
              productId={id}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#F0F0F0] dark:border-zinc-700 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
            />
            <button
              onClick={handleAddToCart}
              disabled={isAdding || inStock === false}
              aria-label={inStock === false ? "Out of stock" : "Add to cart"}
              title={inStock === false ? "Out of stock" : "Add to cart"}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 text-white transition-colors hover:bg-slate-700 disabled:bg-gray-200 disabled:text-gray-400 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
