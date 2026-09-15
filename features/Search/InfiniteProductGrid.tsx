"use client";

import React, { useState, useEffect, useRef } from "react";
import { ProductCard, ProductCardProps } from "@/components/common/ProductCard";
import { ProductSkeleton } from "@/components/common/ProductSkeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { searchProducts, SearchParams } from "@/services/search.service";

export function InfiniteProductGrid({
  initialProducts,
  initialTotalPages,
  queryParams,
}: {
  initialProducts: ProductCardProps[];
  initialTotalPages: number;
  queryParams: SearchParams;
}) {
  const [products, setProducts] = useState<ProductCardProps[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTotalPages > 1);
  const [isLoading, setIsLoading] = useState(false);
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(loaderRef, { rootMargin: '200px' });

  // Reset state when query changes
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    setHasMore(initialTotalPages > 1);
  }, [initialProducts, initialTotalPages]);

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      loadMoreProducts();
    }
  }, [isIntersecting, hasMore, isLoading]);

  const loadMoreProducts = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    
    try {
      const res = await searchProducts({ ...queryParams, page: nextPage });
      if (res && res.data) {
        setProducts(prev => [...prev, ...res.data]);
        setPage(nextPage);
        if (nextPage >= res.meta.pagination.totalPages) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (products.length === 0 && !isLoading) {
    return (
      <div className="py-20 text-center text-gray-500">
        No products found matching your criteria.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-3 lg:mt-6">
        {products.map((p, i) => <ProductCard key={`${p.id}-${i}`} {...p} />)}
        
        {isLoading && (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        )}
      </div>
      
      {/* Invisible element to trigger intersection observer early */}
      {hasMore && <div ref={loaderRef} className="h-10 w-full mt-4" />}
    </>
  );
}
