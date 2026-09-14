import React from "react";
import { Container } from "./Container";

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 w-full pt-12 pb-20">
      <Container className="space-y-12">
        {/* Header Skeleton */}
        <div className="space-y-5">
          <div className="h-10 w-3/4 md:w-1/3 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 animate-pulse" />
          <div className="h-5 w-full md:w-1/2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800/50 animate-pulse" />
        </div>

        {/* Content Area Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="w-full h-[350px] rounded-2xl bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 animate-pulse" />
            <div className="space-y-4">
               <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
               <div className="h-4 w-[90%] rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
               <div className="h-4 w-[80%] rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="space-y-4">
                    <div className="w-full aspect-square rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    <div className="h-4 w-3/4 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
                 </div>
               ))}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 animate-pulse" />
            <div className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-950 border border-gray-100 dark:border-gray-800 animate-pulse p-6 space-y-6">
               <div className="h-6 w-1/2 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
               <div className="space-y-4 pt-4">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="flex justify-between items-center">
                     <div className="h-4 w-1/3 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
                     <div className="h-4 w-1/4 rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
                   </div>
                 ))}
               </div>
               <div className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
