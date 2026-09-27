import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, LayoutGrid, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/common/Container";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { fetchCategories } from "@/services/category.service";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All categories",
  description: "Browse the full catalog by category.",
};

const cardStyles = [
  { bg: 'bg-gradient-to-br from-green-100/70 to-yellow-50/70 dark:from-green-900/30 dark:to-yellow-900/20', iconBg: 'bg-[#2D4A22]' },
  { bg: 'bg-gradient-to-br from-orange-100/70 to-rose-50/70 dark:from-orange-900/30 dark:to-rose-900/20', iconBg: 'bg-[#5C3A21]' },
  { bg: 'bg-gradient-to-br from-purple-100/70 to-pink-50/70 dark:from-purple-900/30 dark:to-pink-900/20', iconBg: 'bg-[#3A2554]' },
  { bg: 'bg-gradient-to-br from-blue-100/70 to-cyan-50/70 dark:from-blue-900/30 dark:to-cyan-900/20', iconBg: 'bg-[#1E3A45]' },
  { bg: 'bg-gradient-to-br from-rose-100/70 to-orange-50/70 dark:from-rose-900/30 dark:to-orange-900/20', iconBg: 'bg-[#54252C]' },
  { bg: 'bg-gradient-to-br from-indigo-100/70 to-blue-50/70 dark:from-indigo-900/30 dark:to-blue-900/20', iconBg: 'bg-[#252854]' }
];

const getCardStyle = (name: string) => {
  const index = name.charCodeAt(0) % cardStyles.length;
  return cardStyles[index];
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="bg-zinc-50 dark:bg-background min-h-screen pb-20">
      <CustomBreadcrumb routes={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <Container className="py-6 lg:py-8">
        {/* Top Dark Banner */}
        <div className="bg-[#121629] dark:bg-card rounded-[20px] p-8 lg:p-12 mb-8 overflow-hidden relative shadow-xl">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1 mb-6">
              <LayoutGrid className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold text-white tracking-widest uppercase">Marketplace</span>
            </div>

            <h1 className="text-3xl lg:text-[40px] font-extrabold text-white tracking-tight mb-4">
              All Categories
            </h1>
            <p className="text-gray-400 text-[15px] max-w-2xl mb-12 leading-relaxed">
              Explore the full catalog — every department, every aisle. Authentic products, verified sellers and Cash on Delivery, nationwide.
            </p>

            <div className="flex flex-wrap items-center gap-6 lg:gap-12">
              <div className="flex flex-col">
                <span className="text-3xl lg:text-4xl font-black text-white">{categories.length}</span>
                <span className="text-[13px] text-gray-400 mt-1">Departments</span>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-3xl lg:text-4xl font-black text-white">
                  {categories.reduce((acc, c) => acc + c.subcategories.length, 0)}
                </span>
                <span className="text-[13px] text-gray-400 mt-1">Categories</span>
              </div>
              <div className="w-px h-12 bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-black text-white tracking-tight">COD</span>
                <span className="text-[13px] text-gray-400 mt-1">Pay on delivery</span>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block" />
              <div className="flex flex-col hidden md:flex">
                <div className="flex items-center text-2xl lg:text-3xl font-black text-white tracking-tight">
                  <span className="text-xl lg:text-2xl mr-0.5">৳</span>60+
                </div>
                <span className="text-[13px] text-gray-400 mt-1">Delivery inside Dhaka</span>
              </div>
            </div>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="py-20 text-center text-[15px] text-gray-500 dark:text-gray-400">
            Categories are unavailable right now.
          </div>
        ) : (
          <>
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2.5 mb-14">
              {categories.map((cat) => (
                <Link
                  key={`pill-${cat.id}`}
                  href={`#cat-${cat.id}`}
                  className="px-4 py-2.5 bg-white dark:bg-card hover:bg-gray-100 dark:hover:bg-secondary text-[13px] font-semibold text-gray-700 dark:text-gray-200 rounded-full transition-colors whitespace-nowrap shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Subcategories Sections */}
            <div className="space-y-16">
              {categories.map((category, index) => (
                <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-24">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#121629] dark:bg-white text-white dark:text-black w-[34px] h-[34px] rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h2 className="text-[22px] font-extrabold text-foreground tracking-tight">
                        {category.name}
                      </h2>
                      <span className="px-3 py-1 bg-gray-200/60 dark:bg-secondary/60 text-gray-600 dark:text-gray-300 text-[12px] font-semibold rounded-full hidden sm:inline-block">
                        {category.subcategories.length} categories
                      </span>
                    </div>
                    <Link
                      href={`/search?category=${encodeURIComponent(category.id)}`}
                      className="text-primary text-[14px] font-bold hover:underline inline-flex items-center gap-1 transition-colors"
                    >
                      View all <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Subcategories Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {category.subcategories.map((sub) => {
                      const style = getCardStyle(sub.name);
                      return (
                        <Link
                          key={sub.id}
                          href={`/search?subCategory=${encodeURIComponent(sub.id)}`}
                          className="relative flex flex-col rounded-[16px] overflow-hidden border border-gray-100 dark:border-gray-800/60 group hover:shadow-lg transition-all duration-300 bg-white dark:bg-card hover:-translate-y-0.5"
                        >
                          {/* Gradient Top */}
                          <div className={cn("h-[75px] w-full transition-opacity duration-300 group-hover:opacity-90", style.bg)} />

                          {/* Bottom Area with Icon Overlap */}
                          <div className="px-3.5 pb-3.5 flex items-end justify-between relative h-[60px]">
                            <div className={cn(
                              "absolute -top-5 left-3.5 w-[42px] h-[42px] rounded-xl border-[3px] border-white dark:border-card flex items-center justify-center text-white font-black text-lg shadow-sm transition-transform duration-300 group-hover:scale-105",
                              style.iconBg
                            )}>
                              {sub.name.charAt(0).toUpperCase()}
                            </div>

                            <span className="font-bold text-[14px] text-gray-900 dark:text-gray-100 truncate pr-2 z-10 w-[calc(100%-24px)] pb-0.5">
                              {sub.name}
                            </span>

                            <div className="w-[22px] h-[22px] rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                              <ArrowUpRight className="w-3 h-3" />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
