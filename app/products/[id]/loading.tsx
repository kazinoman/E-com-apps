import React from "react";
import { Container } from "@/components/common/Container";
import { ChevronRight } from "lucide-react";

export default function ProductDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
      <Container>
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 py-6">
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-700" />
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-700" />
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-4">
          {/* Left: Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Right: Product Info Skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-8 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="flex items-center gap-4 pt-2">
                <div className="h-8 w-24 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="h-6 w-16 rounded bg-gray-100 dark:bg-gray-900 animate-pulse" />
              </div>
            </div>

            <div className="space-y-4 py-6 border-y border-gray-100 dark:border-gray-800">
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-10 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <div className="w-32 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="flex-1 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
