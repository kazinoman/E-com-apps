import React from "react";
import { ProductCard } from "@/components/common/ProductCard";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/schemas/product";

/**
 * The catalog grid. Layout only — the card itself is `ProductCard`, the one
 * card component in this app, so brand/rating omissions stay handled in a
 * single place.
 */
export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  className,
}: {
  products: ProductCardData[];
  emptyMessage?: string;
  className?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-[15px] text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
