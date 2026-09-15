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

/**
 * Merchant-curated homepage rails and the hero slider have no backend yet
 * (HYDRA 3e1d1569). Until they do, these return nothing and the page renders
 * without them — calling the mock's `/home/*` against the real API only 404s.
 *
 * What the backend *does* offer today is `GET /products?featured=true`: the
 * merchant's hand-picked rail, in the order they picked. That is what the
 * homepage shows in the meantime.
 */

export async function fetchFeaturedProducts(limit = 12): Promise<ProductCardProps[]> {
  try {
    const res = await api.get(productsUrls.list, {
      params: { featured: "true", pageSize: limit },
    });
    return res.data?.data?.items ?? [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function fetchHomeSections(): Promise<HomeSection[]> {
  if (!FEATURES.homeSections) return [];
  return [];
}

export async function fetchSliderImages(): Promise<SlideData[]> {
  if (!FEATURES.homeSections) return [];
  return [];
}
