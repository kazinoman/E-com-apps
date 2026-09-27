import React from "react";
import { Container } from "@/components/common/Container";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-muted pb-20 pt-8">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Sidebar Navigation Skeleton */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-6 space-y-8">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                </div>
              </div>

              {/* Nav Links */}
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-transparent">
                    <div className="h-5 w-5 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Main Content Area Skeleton */}
          <div className="flex-1 w-full space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
              <div className="h-8 w-48 rounded-md bg-muted animate-pulse mb-8" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    <div className="h-12 w-full rounded-lg bg-muted border border-border animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="h-12 w-32 rounded-lg bg-muted animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
