"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchCategories, Category } from "@/services/category.service";
import { Grid, ChevronDown } from "lucide-react";

export const MegaMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/search?category=${encodeURIComponent(categoryId)}`);
    setActiveHover(null);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/search?category=${encodeURIComponent(categoryId)}&subCategory=${encodeURIComponent(subcategoryId)}`);
    setActiveHover(null);
  };

  // Display up to 8 categories in the navbar inline
  const visibleCategories = categories.slice(0, 8);

  return (
    <div className="flex items-center gap-4 lg:gap-8 relative z-50">
      {/* All Categories Trigger */}
      <div 
        className="relative group"
        onMouseEnter={() => setActiveHover("all")}
        onMouseLeave={() => setActiveHover(null)}
      >
        <button className="flex items-center gap-2 bg-[#F0F2F5] dark:bg-gray-800 text-[#333333] dark:text-gray-200 px-5 py-2.5 rounded-md font-medium text-[14px] transition-colors hover:bg-white dark:hover:bg-gray-700">
          <Grid className="w-4 h-4" />
          All Categories
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Mega Menu Dropdown */}
        {activeHover === "all" && (
          <div className="absolute top-full left-0 mt-2 w-[80vw] max-w-[1200px] bg-white dark:bg-gray-900 text-black dark:text-gray-100 shadow-2xl rounded-xl p-8 border border-gray-100 dark:border-gray-800 max-h-[75vh] overflow-y-auto z-50">
            <div className="grid grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10">
              {categories.map((cat) => (
                <div key={cat.id} className="flex flex-col">
                  <button 
                    onClick={() => handleCategoryClick(cat.id)}
                    className="font-bold text-[15px] text-[#1A1A1A] dark:text-gray-200 text-left hover:text-[#F05C22] dark:hover:text-[#F05C22] mb-4 transition-colors"
                  >
                    {cat.name}
                  </button>
                  <div className="flex flex-col gap-2.5">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={(e) => handleSubcategoryClick(cat.id, sub.id, e)}
                        className="text-[14px] text-[#666666] dark:text-gray-400 text-left hover:text-[#F05C22] dark:hover:text-[#F05C22] transition-colors"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inline Categories */}
      <nav className="hidden lg:flex items-center gap-6">
        {visibleCategories.map((cat) => (
          <div 
            key={cat.id} 
            className="relative py-4" // padding to create hover bridge
            onMouseEnter={() => setActiveHover(cat.id)}
            onMouseLeave={() => setActiveHover(null)}
          >
            <button 
              onClick={() => handleCategoryClick(cat.id)}
              className="flex items-center gap-1.5 text-[14px] text-[#B3B3B3] hover:text-white font-medium transition-colors"
            >
              {cat.name}
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Subcategory Dropdown */}
            {activeHover === cat.id && (
              <div className="absolute top-[100%] left-0 w-80 bg-white dark:bg-gray-900 text-black dark:text-gray-100 shadow-xl rounded-lg p-5 border border-gray-100 dark:border-gray-800 flex flex-col gap-4 z-50">
                <div className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  {cat.name}
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={(e) => handleSubcategoryClick(cat.id, sub.id, e)}
                      className="text-[14px] text-[#4A4A4A] dark:text-gray-300 text-left hover:text-[#F05C22] dark:hover:text-[#F05C22] transition-colors whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};
