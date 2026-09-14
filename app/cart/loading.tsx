import React from "react";
import { Container } from "@/components/common/Container";

export default function CartSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-12 pb-20">
      <Container>
        <div className="flex items-center gap-4 mb-8">
          <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Cart Items List */}
          <div className="flex-1 space-y-6">
            <div className="h-10 w-full rounded-lg bg-gray-100 dark:bg-gray-900 animate-pulse mb-6" />
            
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-gradient-to-tr from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 animate-pulse flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-3">
                    <div className="h-5 w-3/4 md:w-1/2 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div className="h-4 w-1/4 rounded bg-gray-100 dark:bg-gray-900 animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div className="h-8 w-28 rounded-md bg-gray-100 dark:bg-gray-900 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-6">
              <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-gray-900 animate-pulse" />
                    <div className="h-4 w-1/4 rounded bg-gray-100 dark:bg-gray-900 animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
