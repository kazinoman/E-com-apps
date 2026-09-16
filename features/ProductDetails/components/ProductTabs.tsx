"use client";

import { useEffect, useState } from "react";
import type { Product, ProductCardData } from "@/schemas/product";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductReviews } from "./ProductReviews";

interface ProductTabsProps {
  product: Product;
  similarProducts: ProductCardData[];
}

type TabType = "Similar product" | "Specifications" | "Description" | "Reviews";

export const ProductTabs = ({ product, similarProducts }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("Similar product");

  const tabs: TabType[] = ["Similar product", "Specifications", "Description", "Reviews"];

  /*
   * `?tab=reviews` opens this tab directly — that is the target of the "write a
   * review" link on an order. Read from `window.location` in an effect rather
   * than with `useSearchParams`, which would force the whole PDP out of static
   * rendering unless it were wrapped in a Suspense boundary.
   */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "reviews") {
      setActiveTab("Reviews");
    }
  }, []);

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
            {/* `attributes` is an opaque upstream key→value bag, preserved
                verbatim through the API. Rendered as given; never parsed. */}
            {Object.keys(product.attributes ?? {}).length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900">
                <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-200 dark:bg-gray-700 gap-[1px]">
                  {Object.entries(product.attributes).map(([label, value]) => (
                    <div key={label} className="contents">
                      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center">
                        {label}
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm flex items-center">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No specifications available.</p>
            )}
          </div>
        )}

        {activeTab === "Description" && (
          <div className="w-full max-w-4xl mx-auto">
            {/* `descriptionHtml` is null for most of the catalog — the source
                listings carry no prose at all. Say so rather than showing an
                empty panel. */}
            {product.descriptionHtml ? (
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-10">
                This product has no description. The specifications tab lists everything the
                supplier published.
              </p>
            )}
          </div>
        )}

        {activeTab === "Reviews" && <ProductReviews productId={product.id} />}

      </div>
    </div>
  );
};
