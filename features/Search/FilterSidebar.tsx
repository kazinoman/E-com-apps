"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Star, RefreshCw, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryOption } from "@/lib/types/category";

export function FilterSidebar({ className, categories = [] }: { className?: string; categories?: CategoryOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const updateSort = (val: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (val === "rating") {
      newParams.set("sort", "rating");
      newParams.set("order", "desc");
    } else if (val === "price_asc") {
      newParams.set("sort", "price");
      newParams.set("order", "asc");
    } else if (val === "price_desc") {
      newParams.set("sort", "price");
      newParams.set("order", "desc");
    } else if (val === "newest") {
      newParams.set("sort", "newest");
      newParams.set("order", "desc");
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const getCurrentSort = () => {
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    if (sort === "rating") return "rating";
    if (sort === "price" && order === "asc") return "price_asc";
    if (sort === "price" && order === "desc") return "price_desc";
    if (sort === "newest") return "newest";
    return "";
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("priceMin") || 0),
    Number(searchParams.get("priceMax") || 10000)
  ]);

  const [expandedCats, setExpandedCats] = useState<string[]>(categories.map(c => c.value));
  const toggleCat = (val: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedCats((prev) => 
      prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]
    );
  };

  // Debounced price update
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (priceRange[0] > 0) newParams.set("priceMin", priceRange[0].toString());
      else newParams.delete("priceMin");
      
      if (priceRange[1] < 10000) newParams.set("priceMax", priceRange[1].toString());
      else newParams.delete("priceMax");
      
      const newQuery = newParams.toString();
      if (searchParams.toString() !== newQuery) {
        router.push(`${pathname}?${newQuery}`);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [priceRange, pathname, router, searchParams]);

  const currentCategory = searchParams.get("category");
  const currentRating = searchParams.get("rating");

  return (
    <div className={cn("flex flex-col w-full text-[#333333] dark:text-gray-200", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-sm flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset filters
        </button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "sort", "availability"]} className="w-full">
        {/* CATEGORIES */}
        <AccordionItem value="categories" className="border-b border-gray-100 dark:border-zinc-800">
          <AccordionTrigger className="text-[15px] font-semibold hover:no-underline">
            Categories <span className="text-gray-400 font-normal ml-1 text-sm">({categories.length})</span>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="flex flex-col space-y-3">
                {categories.map((cat) => {
                  const isChecked = currentCategory === cat.value;
                  const isExpanded = expandedCats.includes(cat.value) || isChecked;
                  return (
                    <div key={cat.value} className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`cat-${cat.value}`} 
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              // When changing category, clear subCategory as well
                              const newParams = new URLSearchParams(searchParams.toString());
                              if (checked) {
                                newParams.set("category", cat.value);
                              } else {
                                newParams.delete("category");
                              }
                              newParams.delete("subCategory");
                              router.push(`${pathname}?${newParams.toString()}`);
                            }}
                          />
                          <label htmlFor={`cat-${cat.value}`} className="text-sm cursor-pointer">{cat.label}</label>
                        </div>
                        {cat.children && cat.children.length > 0 && (
                          <button onClick={(e) => toggleCat(cat.value, e)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                      {isExpanded && cat.children && cat.children.length > 0 && (
                        <div className="ml-6 flex flex-col space-y-2 pt-1">
                          {cat.children.map((sub) => (
                            <div key={sub.value} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`sub-${sub.value}`} 
                                checked={searchParams.get("subCategory") === sub.value}
                                onCheckedChange={(checked) => updateParam("subCategory", checked ? sub.value : null)}
                              />
                              <label htmlFor={`sub-${sub.value}`} className="text-sm cursor-pointer text-gray-500 dark:text-gray-400">{sub.label}</label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
        {/* SORT BY */}
        <AccordionItem value="sort" className="border-b border-gray-100 dark:border-zinc-800">
          <AccordionTrigger className="text-[15px] font-semibold hover:no-underline">Sort by</AccordionTrigger>
          <AccordionContent className="pt-1 pb-4">
            <RadioGroup value={getCurrentSort()} onValueChange={updateSort} className="gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="r1" />
                <label htmlFor="r1" className="text-sm cursor-pointer">Rating</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_asc" id="r2" />
                <label htmlFor="r2" className="text-sm cursor-pointer">Price : Low to high</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_desc" id="r3" />
                <label htmlFor="r3" className="text-sm cursor-pointer">Price : High to low</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="r4" />
                <label htmlFor="r4" className="text-sm cursor-pointer">Newest</label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* AVAILABILITY */}
        <AccordionItem value="availability" className="border-b border-gray-100 dark:border-zinc-800">
          <AccordionTrigger className="text-[15px] font-semibold hover:no-underline">
            Availability <span className="text-gray-400 font-normal ml-1 text-sm">(2)</span>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="av-in" defaultChecked />
              <label htmlFor="av-in" className="text-sm cursor-pointer">In-stock</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="av-out" />
              <label htmlFor="av-out" className="text-sm cursor-pointer">Out of stock</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="av-up" defaultChecked />
              <label htmlFor="av-up" className="text-sm cursor-pointer">Upcoming</label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* PRICE */}
        <AccordionItem value="price" className="border-b border-gray-100 dark:border-zinc-800">
          <AccordionTrigger className="text-[15px] font-semibold hover:no-underline">Price</AccordionTrigger>
          <AccordionContent className="pt-3 pb-4">
            <Slider 
              defaultValue={priceRange} 
              max={10000} 
              step={10} 
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-6"
            />
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <Input 
                  type="number" 
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="pl-7 h-9 text-sm"
                />
              </div>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <Input 
                  type="number" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="pl-7 h-9 text-sm" 
                  placeholder="Max price"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* RATINGS */}
        <AccordionItem value="ratings" className="border-b border-gray-100 dark:border-zinc-800">
          <AccordionTrigger className="text-[15px] font-semibold hover:no-underline">
            Ratings <span className="text-gray-400 font-normal ml-1 text-sm">(1)</span>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox 
                  id={`rating-${rating}`} 
                  checked={currentRating === rating.toString()}
                  onCheckedChange={(checked) => updateParam("rating", checked ? rating.toString() : null)}
                />
                <label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1.5">
                  {rating} <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" /> {rating < 5 && "& up"}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>



        {/* COLORS (OPTIONAL) */}
        <AccordionItem value="colors" className="border-b-0">
          <AccordionTrigger className="text-[15px] font-semibold hover:no-underline">
            Colors <span className="text-gray-400 font-normal ml-1 text-sm">(2)</span>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-4 space-y-3">
            {["Black", "Green", "Blue", "Red", "Purple", "Yellow"].map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox 
                  id={`color-${color}`} 
                  checked={searchParams.get("color") === color.toLowerCase()}
                  onCheckedChange={(checked) => updateParam("color", checked ? color.toLowerCase() : null)}
                />
                <label htmlFor={`color-${color}`} className="text-sm cursor-pointer">{color}</label>
              </div>
            ))}
            <button className="text-sm font-medium text-gray-500 flex items-center gap-1 pt-2">
              - See less
            </button>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
