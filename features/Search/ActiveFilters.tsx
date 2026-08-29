"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, ChevronRight } from "lucide-react";

export function ActiveFilters({ total }: { total: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchQuery = searchParams.get("search") || searchParams.get("title") || searchParams.get("category") || "All Products";

  const removeParam = (key: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(key);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const getActiveFilters = () => {
    const filters: { key: string; label: string; value: string }[] = [];
    
    if (searchParams.get("search")) filters.push({ key: "search", label: "search", value: searchParams.get("search")! });
    if (searchParams.get("category")) filters.push({ key: "category", label: "category", value: searchParams.get("category")! });
    if (searchParams.get("subCategory")) filters.push({ key: "subCategory", label: "subcategory", value: searchParams.get("subCategory")! });
    
    // Sort logic
    const sort = searchParams.get("sort");
    if (sort) filters.push({ key: "sort", label: "sort by", value: sort });
    
    // Price logic
    const min = searchParams.get("priceMin");
    const max = searchParams.get("priceMax");
    if (min || max) {
      filters.push({ 
        key: "price", 
        label: "price", 
        value: `$${min || 0} - $${max || "Max"}` 
      });
    }

    if (searchParams.get("color")) filters.push({ key: "color", label: "color", value: searchParams.get("color")! });

    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="flex flex-col gap-4 sticky top-0 z-20 bg-zinc-50 dark:bg-black pt-1 pb-3 -mt-1 border-b border-transparent">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[#333333] dark:text-gray-200 gap-2">
        <h1 className="text-[15px] font-medium">Result for <span className="font-semibold text-black dark:text-white">"{searchQuery}"</span></h1>
        <div className="text-[14px] text-gray-500">Total <span className="font-semibold text-black dark:text-white mx-1">"{total.toLocaleString()}"</span> products</div>
      </div>

      {activeFilters.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-2">
            {activeFilters.map((filter, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900"
              >
                <span className="text-[#888888] dark:text-gray-400">{filter.label} :</span>
                <span className="font-semibold text-[#333333] dark:text-gray-200">{filter.value}</span>
                <button 
                  onClick={() => {
                    if (filter.key === "price") {
                      const newParams = new URLSearchParams(searchParams.toString());
                      newParams.delete("priceMin");
                      newParams.delete("priceMax");
                      router.push(`${pathname}?${newParams.toString()}`);
                    } else if (filter.key === "sort") {
                      const newParams = new URLSearchParams(searchParams.toString());
                      newParams.delete("sort");
                      newParams.delete("order");
                      router.push(`${pathname}?${newParams.toString()}`);
                    } else {
                      removeParam(filter.key);
                    }
                  }}
                  className="ml-1 text-[#888888] hover:text-red-500 transition-colors focus:outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {activeFilters.length > 3 && (
              <button className="flex items-center justify-center w-8 h-[34px] rounded-lg bg-[#F8F8F8] dark:bg-zinc-800 hover:bg-gray-100 transition-colors border border-transparent">
                <ChevronRight className="w-4 h-4 text-[#888888]" />
              </button>
            )}
          </div>
          <ScrollBar orientation="horizontal" className="h-0 hidden" />
        </ScrollArea>
      )}
    </div>
  );
}
