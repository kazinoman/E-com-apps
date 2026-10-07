"use client";

import { ArrowUpDown, Check } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function MobileSortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentSort = () => {
    const sort = searchParams.get("sort");
    const order = searchParams.get("order");
    if (sort === "rating") return "rating";
    if (sort === "price" && order === "asc") return "price_asc";
    if (sort === "price" && order === "desc") return "price_desc";
    if (sort === "newest") return "newest";
    return "";
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
    setOpen(false);
  };

  const currentSort = getCurrentSort();

  const options = [
    { value: "rating", label: "Rating" },
    { value: "price_asc", label: "Price: Low to high" },
    { value: "price_desc", label: "Price: High to low" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center w-10 h-10 border rounded-lg text-sm transition-colors",
          open
            ? "bg-gray-100 border-gray-300 dark:bg-zinc-800 dark:border-zinc-700"
            : "border-border hover:bg-gray-50 dark:hover:bg-zinc-800"
        )}
      >
        <ArrowUpDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1A1A1A] border border-border rounded-lg shadow-lg z-50 py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSort(option.value)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <span className={cn(
                "font-medium",
                currentSort === option.value ? "text-primary" : "text-[#333] dark:text-gray-200"
              )}>
                {option.label}
              </span>
              {currentSort === option.value && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
