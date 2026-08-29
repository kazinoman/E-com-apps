import React from "react";
import { cn } from "@/lib/utils";

export function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-full w-full min-w-[150px] bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-800 rounded-2xl p-2.5 animate-pulse", className)}>
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/4.5] bg-gray-100 dark:bg-zinc-800 rounded-xl" />

      {/* Content Skeleton */}
      <div className="px-2 pt-4 pb-2 flex flex-col flex-grow justify-between gap-1">
        <div className="space-y-3">
          {/* Category */}
          <div className="h-3 w-1/3 bg-gray-200 dark:bg-zinc-700 rounded" />
          {/* Title */}
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-700 rounded" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Brand */}
          <div className="h-3 w-1/4 bg-gray-200 dark:bg-zinc-700 rounded" />
          {/* Original Price */}
          <div className="h-3 w-1/5 bg-gray-200 dark:bg-zinc-700 rounded" />
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Rating */}
          <div className="h-4 w-1/5 bg-gray-200 dark:bg-zinc-700 rounded" />
          {/* Price */}
          <div className="h-5 w-1/4 bg-gray-200 dark:bg-zinc-700 rounded" />
        </div>
      </div>
    </div>
  );
}
