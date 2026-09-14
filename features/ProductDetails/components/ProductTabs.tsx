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
    <div className="mt-16 border-t border-gray-200 pt-10">
      {/* Tabs Header */}
      <div className="flex gap-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm md:text-base font-medium transition-colors relative ${
              activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900" />
            )}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="py-8">
        {activeTab === "Similar product" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {similarProducts.length > 0 ? (
              similarProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))
            ) : (
              <p className="col-span-full text-gray-500 text-center py-10">
                No similar products found.
              </p>
            )}
          </div>
        )}

        {activeTab === "Specifications" && (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-6">Specifications</h3>
            {product.specifications && product.specifications.length > 0 ? (
              <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
                <div className="grid grid-cols-2 md:grid-cols-6 bg-gray-200 gap-[1px]">
                  {product.specifications.map((spec, index) => {
                    return (
                      <div key={index} className="contents">
                        <div className="p-4 bg-gray-50/50 text-gray-600 text-sm font-medium flex items-center">
                          {spec.label}
                        </div>
                        <div className="p-4 bg-white text-gray-900 text-sm flex items-center">
                          {spec.value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
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
              <p className="text-gray-500 text-center py-10">
                No package images available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
