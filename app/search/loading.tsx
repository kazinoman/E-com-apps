import React from "react";
import { Container } from "@/components/common/Container";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";

export default function SearchLoading() {
  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen">
      <Container className="py-8 flex flex-col md:flex-row gap-8">
        {/* Mobile & Tablet Header Skeleton */}
        <div className="md:hidden flex justify-between items-center mb-2">
          <div className="h-7 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-9 w-24 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
        </div>

        {/* Desktop Sidebar Skeleton */}
        <aside className="hidden md:block w-[200px] lg:w-[240px] shrink-0 sticky top-0 max-h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1 pb-10">
          <div className="flex flex-col gap-6 animate-pulse">
            <div className="flex justify-between items-center mb-2">
              <div className="h-6 w-16 bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
            
            {/* Accordion Skeletons */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-b border-gray-100 dark:border-zinc-800 pb-4 space-y-4">
                <div className="h-5 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-200 dark:bg-zinc-800" /><div className="h-4 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded" /></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-200 dark:bg-zinc-800" /><div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded" /></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-gray-200 dark:bg-zinc-800" /><div className="h-4 w-1/3 bg-gray-200 dark:bg-zinc-800 rounded" /></div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Active Filters Header Skeleton */}
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="h-5 w-48 bg-gray-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
          
          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        </div>
      </Container>
    </div>
  );
}
