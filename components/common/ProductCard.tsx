"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

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
}: ProductCardProps) {
  const getBadgeStyle = (badgeText: string) => {
    const text = badgeText.toLowerCase();
    if (text === "sale") return "text-[#00C566] border-[#00C566]";
    if (text.includes("% off") || text.includes("discount")) return "text-[#448DFF] border-[#448DFF]";
    if (text === "out of stock" || text.includes("stock")) return "text-[#FF5C5C] border-[#FF5C5C]";
    return "text-[#333333] border-[#333333] dark:text-gray-200 dark:border-gray-200"; // Fallback style
  };

  return (
    <Link href={`/product/${id}`} className="group flex flex-col h-full min-w-[200px] bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-800 rounded-2xl p-2.5 hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/4.5] bg-[#F6F6F9] dark:bg-zinc-800 rounded-xl flex items-center justify-center p-6 overflow-hidden">
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

        <div className="flex items-center justify-between mt-1">
          <span className="text-[13px] text-[#999999] dark:text-gray-400 font-medium">{brand}</span>
          {originalPrice && (
            <span className="text-[13px] text-[#999999] dark:text-gray-500 line-through font-medium">
              $ {originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-[13px] font-semibold text-[#555555] dark:text-gray-300">
            {rating} <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
          </div>
          <div className="font-bold text-[16px] text-[#333333] dark:text-gray-100">
            $ {price.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}
