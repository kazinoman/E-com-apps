import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-card rounded-3xl shadow-sm border border-gray-100 dark:border-border p-8 w-full min-h-full animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-48 h-8 bg-muted rounded-md" />
      </div>

      <div className="space-y-6">
        {/* Placeholder Blocks to mimic generic content (orders, forms, etc) */}
        <div className="h-12 w-full max-w-sm rounded-lg bg-muted" />

        <div className="border border-gray-200 dark:border-border rounded-2xl p-6">
          <div className="space-y-4">
            <div className="h-6 w-1/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted/60" />
            <div className="h-4 w-5/6 rounded bg-muted/60" />
            <div className="h-4 w-4/6 rounded bg-muted/60" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-border rounded-2xl p-6 h-40 bg-muted/30" />
          <div className="border border-gray-200 dark:border-border rounded-2xl p-6 h-40 bg-muted/30" />
        </div>
      </div>
    </div>
  );
}
