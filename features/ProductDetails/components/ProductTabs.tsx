"use client";

import { useState } from "react";
import { Product } from "@/schemas/product";
import { ProductCard } from "@/components/common/ProductCard";

interface ProductTabsProps {
  product: Product;
  similarProducts: any[];
}

type TabType = "Similar product" | "Specifications" | "Package Info";

export const ProductTabs = ({ product, similarProducts }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("Similar product");

  const tabs: TabType[] = ["Similar product", "Specifications", "Package Info"];

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
      {/* Tabs Header */}
      <div className="flex gap-8 border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm md:text-base font-medium transition-colors relative ${
              activeTab === tab ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900 dark:bg-gray-100" />
            )}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="py-8">
        {activeTab === "Similar product" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 justify-start">
            {similarProducts.length > 0 ? (
              similarProducts.slice(0, 15).map((p) => (
                <div key={p.id} className="w-full max-w-[280px]">
                  <ProductCard {...p} />
                </div>
              ))
            ) : (
              <p className="col-span-full text-gray-500 dark:text-gray-400 text-center py-10">
                No similar products found.
              </p>
            )}
          </div>
        )}

        {activeTab === "Specifications" && (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-6 dark:text-gray-100">Specifications</h3>
            {product.specifications && product.specifications.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900">
                <div className="grid grid-cols-2 md:grid-cols-6 bg-gray-200 dark:bg-gray-700 gap-[1px]">
                  {product.specifications.map((spec, index) => {
                    return (
                      <div key={index} className="contents">
                        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center">
                          {spec.label}
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm flex items-center">
                          {spec.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No specifications available.</p>
            )}
          </div>
        )}

        {activeTab === "Package Info" && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            {product.description?.images && product.description.images.length > 0 ? (
              product.description.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.title} package info ${i + 1}`}
                  className="w-full rounded-xl shadow-sm object-cover"
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                No package images available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
