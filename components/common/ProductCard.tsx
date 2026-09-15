"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/UserInfoContext";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string | number;
  title: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  image: string;
  badge?: string | null;
  sold?: string | number;
  shippingTime?: string;
}

export function ProductCard({
  id,
  title,
  category,
  brand,
  price,
  originalPrice,
  rating,
  image,
  badge,
  sold,
  shippingTime,
}: ProductCardProps) {
  const getBadgeStyle = (badgeText: string) => {
    const text = badgeText.toLowerCase();
    if (text === "sale") return "text-[#00C566] border-[#00C566]";
    if (text.includes("% off") || text.includes("discount")) return "text-[#448DFF] border-[#448DFF]";
    if (text === "out of stock" || text.includes("stock")) return "text-[#FF5C5C] border-[#FF5C5C]";
    return "text-[#333333] border-[#333333] dark:text-gray-200 dark:border-gray-200"; // Fallback style
  };
  const { isLogin } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWished = isInWishlist(id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  const formatSold = (value?: string | number) => {
    if (!value) return null;
    if (typeof value === 'number') {
      if (value >= 1000000) return `${Math.floor(value / 1000000)}m+ sold`;
      if (value >= 1000) return `${Math.floor(value / 1000)}k+ sold`;
      return `${value} sold`;
    }
    const str = value.toString();
    return str.toLowerCase().includes('sold') ? str : `${str} sold`;
  };

  return (
    <Link href={`/products/${id}`} className="group flex flex-col h-full w-full min-w-[200px] bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-800 rounded-2xl p-2.5 hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/4.5] bg-[#F6F6F9] dark:bg-zinc-800 rounded-xl flex items-center justify-center p-6 overflow-hidden">
        {/* Wishlist Button */}
        {isLogin && (
          <button
            onClick={handleWishlistClick}
            className={cn(
              "absolute top-3 right-3 p-1.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm z-20 transition-all duration-300",
              isWished ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            )}
          >
            <Heart
              className={cn("w-[18px] h-[18px]", isWished ? "fill-[#FF4D4F] text-[#FF4D4F]" : "text-gray-400 hover:text-[#FF4D4F]")}
            />
          </button>
        )}

        {badge && (
          <div className={`absolute top-3 left-3 px-2 py-0.5 text-[12px] font-medium border rounded bg-white dark:bg-zinc-900 z-10 ${getBadgeStyle(badge)}`}>
            {badge}
          </div>
        )}
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain drop-shadow-sm mix-blend-multiply dark:mix-blend-normal"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="px-2 pt-4 pb-2 flex flex-col flex-grow justify-between gap-1">
        <div className="space-y-1">
          <span className="text-[13px] text-[#999999] dark:text-gray-400 font-medium">
            {category}
          </span>
          <h3 className="font-semibold text-[15px] leading-snug text-[#333333] dark:text-gray-100 line-clamp-2 min-h-[42px]">
            {title}
          </h3>
        </div>

        {/* <div className="flex items-center justify-between mt-1">
          <span className="text-[13px] text-[#999999] dark:text-gray-400 font-medium">{brand}</span>
        </div> */}

        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 text-[13px] font-semibold text-[#555555] dark:text-gray-300">
            {rating} <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
          </div>
          {sold && (
            <span className="text-[12px] text-[#999999] border-l border-[#EAE4E3] dark:border-zinc-700 pl-2">
              {formatSold(sold)}
            </span>
          )}
        </div>

        <div className="text-[11px] font-medium text-[#00C566] bg-[#00C566]/10 px-1.5 py-0.5 rounded w-fit mt-1">
          {shippingTime || "CN to BD 10-12 days"}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="font-bold text-[18px] text-[#333333] dark:text-gray-100">
              $ {price.toFixed(2)}
            </div>
            {originalPrice && (
              <span className="text-[13px] text-[#999999] dark:text-gray-500 line-through font-medium">
                $ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
