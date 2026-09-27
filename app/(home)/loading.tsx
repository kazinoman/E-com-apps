import { Container } from "@/components/common/Container";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-950 font-sans pb-20">
      <main className="flex flex-1 w-full flex-col">
        {/* Hero Slider Skeleton */}
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-900 dark:to-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-3/4 max-w-4xl flex flex-col md:flex-row items-center gap-8 opacity-50">
             <div className="flex-1 space-y-4 w-full flex flex-col items-center md:items-start">
                <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-10 w-1/2 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mt-4"></div>
             </div>
             <div className="flex-1 w-full h-48 md:h-64 bg-gray-300 dark:bg-gray-700 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Campaign Section Skeleton */}
        <section className="bg-[#F8F9FA] dark:bg-[#0A0A0A] py-16">
          <Container>
            {/* Banner Header Skeleton */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 bg-gray-100 dark:bg-[#111111] p-6 lg:p-8 rounded-[24px] animate-pulse border border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-10 w-full lg:w-auto">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-800 shrink-0"></div>
                  <div className="flex flex-col gap-2">
                    <div className="w-32 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="w-40 h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
                <div className="hidden md:block w-64 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-48 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="w-28 h-12 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0"></div>
              </div>
            </div>

            {/* Campaign Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-[420px] w-full bg-gray-100 dark:bg-[#111111] rounded-[24px] animate-pulse border border-gray-200 dark:border-gray-800 ${i === 3 ? 'hidden lg:block' : ''} ${i === 2 ? 'hidden md:block' : ''}`}></div>
               ))}
            </div>
          </Container>
        </section>
        
        <Container className="mt-6 space-y-12 flex flex-col">
          {/* Create 4 Skeleton Sections */}
          {[1, 2, 3, 4].map((sectionIndex) => (
            <section key={sectionIndex} className="w-full flex flex-col gap-6">
              {/* Section Header Skeleton */}
              <div className="flex items-center justify-between w-full">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                </div>
              </div>

              {/* Product Skeletons Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-full ${i > 1 ? 'hidden sm:block' : ''} ${i > 2 ? 'hidden md:block' : ''} ${i > 3 ? 'hidden lg:block' : ''}`}
                  >
                    <ProductSkeleton />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </Container>
      </main>
    </div>
  );
}
