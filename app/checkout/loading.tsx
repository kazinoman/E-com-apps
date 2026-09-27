import React from "react";
import { Container } from "@/components/common/Container";

export default function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border py-4 mb-8">
        <Container className="flex items-center justify-center relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-muted animate-pulse" />
          <div className="h-6 w-32 rounded-md bg-muted animate-pulse" />
        </Container>
      </header>

      <Container>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column: Form Skeleton */}
          <div className="flex-1 space-y-8">
            <div className="border-b border-border pb-2 mb-6 flex justify-center lg:justify-start">
              <div className="h-5 w-40 rounded bg-muted animate-pulse" />
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                </div>
              ))}
              
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                <div className="h-24 w-full rounded-md bg-muted animate-pulse" />
              </div>
            </div>

            {/* Delivery & Payment Sections */}
            {[1, 2].map((section) => (
              <div key={section} className="pt-4 space-y-3">
                <div className="h-5 w-32 rounded bg-muted animate-pulse mb-4" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 w-full rounded-md border border-border bg-muted animate-pulse" />
                ))}
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Skeleton */}
          <div className="w-full lg:w-[450px] xl:w-[500px]">
            <div className="border-b border-border pb-2 mb-6 flex justify-center lg:justify-start">
              <div className="h-5 w-32 rounded bg-muted animate-pulse" />
            </div>

            <div className="bg-muted rounded-xl p-6 mb-6 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                <div className="h-5 w-16 rounded bg-muted animate-pulse" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                      <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-12 w-full rounded-lg bg-muted animate-pulse mb-12" />
          </div>
        </div>
      </Container>
    </div>
  );
}
