import React from "react";
import { Container } from "@/components/common/Container";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";

export default function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
      <Container className="pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Filters Sidebar Skeleton */}
          <div className="w-full lg:w-[280px] flex-shrink-0 space-y-8 hidden lg:block">
            {[1, 2, 3].map((section) => (
              <div key={section} className="space-y-4">
                <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-sm bg-gray-200 dark:bg-gray-800 animate-pulse" />
                      <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-900 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Search Results Skeleton */}
          <div className="flex-1 w-full space-y-6">
            {/* Top Toolbar Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-10 w-32 rounded-lg bg-gray-100 dark:bg-gray-900 animate-pulse" />
                <div className="h-10 w-32 rounded-lg bg-gray-100 dark:bg-gray-900 animate-pulse" />
              </div>
            </div>

            {/* Product Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-full">
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
