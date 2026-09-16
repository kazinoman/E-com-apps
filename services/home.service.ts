"use server";

import { ProductCardProps } from "@/components/common/ProductCard";
import { api } from "@/lib/api/axios";
import { products as productsUrls } from "@/lib/api/apiUrls";
import { FEATURES } from "@/lib/api/features";
import type { SlideData } from "@/features/Home/SliderComponent";

export interface HomeSection {
  id: string;
  title: string;
  products: ProductCardProps[];
}

/** The reference rail order, backed by real catalog queries. See HOMEPAGE-PARITY.md. */
const HOME_RAILS = [
  { id: "best-selling", title: "Best Selling", params: { sort: "popular" } },
  { id: "trending-products", title: "Trending Products", params: { sort: "popular", page: 2 } },
  { id: "electronics", title: "Top Electronics", params: { category: "gadgets", sort: "popular" } },
  { id: "fashion", title: "Latest Fashion", params: { category: "women-wear", sort: "newest" } },
  { id: "bags", title: "Premium Bags", params: { category: "bags", sort: "price_desc" } },
  { id: "you-may-also-like", title: "You May Also Like", params: { sort: "newest" } },
] as const;

async function fetchProducts(params: Record<string, string | number>): Promise<ProductCardProps[]> {
  try {
    const res = await api.get(productsUrls.list, { params });
    return res.data?.data?.items ?? [];
  } catch (error) {
    console.error("Error fetching homepage products:", params, error);
    return [];
  }
}

export async function fetchFeaturedProducts(limit = 12): Promise<ProductCardProps[]> {
  return fetchProducts({ featured: "true", pageSize: limit });
}

export async function fetchHomeSections(): Promise<HomeSection[]> {
  return Promise.all(HOME_RAILS.map(async ({ id, title, params }) => ({
    id,
    title,
    products: await fetchProducts({ pageSize: 8, ...params }),
  })));
}

export async function fetchSliderImages(): Promise<SlideData[]> {
  if (!FEATURES.homeSections) return [];
  return [];
}
