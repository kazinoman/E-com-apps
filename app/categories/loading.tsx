import { Container } from "@/components/common/Container";

export default function CategoriesLoading() {
  return (
    <div className="bg-zinc-50 dark:bg-background min-h-screen pb-20 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-14 border-b border-border bg-card/50">
        <Container className="h-full flex items-center">
          <div className="w-48 h-4 bg-muted rounded"></div>
        </Container>
      </div>

      <Container className="py-6 lg:py-8">
        {/* Top Dark Banner Skeleton */}
        <div className="bg-muted dark:bg-[#121629]/50 rounded-[20px] p-8 lg:p-12 mb-8 h-[320px] lg:h-[280px]">
          <div className="w-24 h-6 bg-muted-foreground/20 rounded-full mb-6"></div>
          <div className="w-3/4 max-w-md h-10 bg-muted-foreground/20 rounded-lg mb-4"></div>
          <div className="w-full max-w-2xl h-16 bg-muted-foreground/20 rounded-lg mb-12"></div>
          <div className="flex gap-6 lg:gap-12">
            <div className="w-16 h-12 bg-muted-foreground/20 rounded"></div>
            <div className="w-16 h-12 bg-muted-foreground/20 rounded"></div>
            <div className="w-16 h-12 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>

        {/* Category Pills Skeleton */}
        <div className="flex flex-wrap items-center gap-2.5 mb-14">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="px-6 py-4 w-24 bg-muted rounded-full"
            ></div>
          ))}
        </div>

        {/* Subcategories Sections Skeleton */}
        <div className="space-y-16">
          {[1, 2].map((sectionIndex) => (
            <section key={sectionIndex}>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-muted w-[34px] h-[34px] rounded-xl"></div>
                  <div className="w-40 h-8 bg-muted rounded-lg"></div>
                  <div className="w-24 h-6 bg-muted rounded-full hidden sm:block"></div>
                </div>
                <div className="w-16 h-5 bg-muted rounded"></div>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((cardIndex) => (
                  <div
                    key={cardIndex}
                    className="relative flex flex-col rounded-[16px] overflow-hidden border border-border/60 bg-card h-[135px]"
                  >
                    {/* Gradient Top */}
                    <div className="h-[75px] w-full bg-muted/50" />

                    {/* Bottom Area with Icon Overlap */}
                    <div className="px-3.5 pb-3.5 flex items-end justify-between relative h-[60px]">
                      <div className="absolute -top-5 left-3.5 w-[42px] h-[42px] rounded-xl border-[3px] border-card bg-muted"></div>
                      <div className="w-3/5 h-4 bg-muted rounded z-10 w-[calc(100%-24px)] mb-0.5"></div>
                      <div className="w-[22px] h-[22px] rounded-full bg-muted shrink-0"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </div>
  );
}
