import React from "react";
import { Container } from "@/components/common/Container";

export default function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
      <header className="border-b border-gray-100 dark:border-gray-800 py-4 mb-8">
        <Container className="flex items-center justify-center relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </Container>
      </header>

      <Container>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column: Form Skeleton */}
          <div className="flex-1 space-y-8">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-6 flex justify-center lg:justify-start">
              <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="h-10 w-full rounded-md bg-gray-100 dark:bg-gray-900 animate-pulse" />
                </div>
              ))}
              
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="h-24 w-full rounded-md bg-gray-100 dark:bg-gray-900 animate-pulse" />
              </div>
            </div>

            {/* Delivery & Payment Sections */}
            {[1, 2].map((section) => (
              <div key={section} className="pt-4 space-y-3">
                <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-800 animate-pulse mb-4" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 w-full rounded-md border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 animate-pulse" />
                ))}
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Skeleton */}
          <div className="w-full lg:w-[450px] xl:w-[500px]">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-6 flex justify-center lg:justify-start">
              <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                      <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    </div>
                    <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse mb-12" />
          </div>
        </div>
      </Container>
    </div>
  );
}
