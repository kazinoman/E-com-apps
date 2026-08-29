import { Container } from "@/components/common/Container";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black pb-20">
      <main className="flex flex-1 w-full flex-col dark:bg-black">
        {/* Hero Slider Skeleton */}
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-200 dark:bg-zinc-900 animate-pulse flex items-center justify-center">
          <div className="w-3/4 max-w-4xl flex flex-col md:flex-row items-center gap-8 opacity-50">
             <div className="flex-1 space-y-4 w-full flex flex-col items-center md:items-start">
                <div className="h-10 w-3/4 bg-gray-300 dark:bg-zinc-800 rounded-lg"></div>
                <div className="h-10 w-1/2 bg-gray-300 dark:bg-zinc-800 rounded-lg"></div>
                <div className="h-5 w-32 bg-gray-300 dark:bg-zinc-800 rounded mt-4"></div>
             </div>
             <div className="flex-1 w-full h-48 md:h-64 bg-gray-300 dark:bg-zinc-800 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <Container className="mt-12 space-y-12 flex flex-col">
          {/* Create 4 Skeleton Sections */}
          {[1, 2, 3, 4].map((sectionIndex) => (
            <section key={sectionIndex} className="w-full flex flex-col gap-5">
              {/* Section Header Skeleton */}
              <div className="flex items-center justify-between w-full">
                <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                <div className="flex items-center gap-2 hidden sm:flex">
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
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
