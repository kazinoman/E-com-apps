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
 * (HYDRA 3e1d1569). Until they do, the hero stays empty and the page renders
 * without it — calling the mock's `/home/*` against the real API only 404s.
 *
 * The rails themselves don't have to be empty, though: `GET
 * /products?featured=true` is the merchant's hand-picked rail, and nobody has
 * curated one yet (2026-09-16: zero products marked featured across all
 * 48,015), so that call always answers `[]`. Falling back to `sort=popular`
 * means the homepage shows the catalog's real best-sellers instead of a blank
 * page until curation exists — real data, just not merchant-picked, and
 * labelled accordingly rather than passed off as "Featured".
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

async function fetchPopularProducts(limit = 12): Promise<ProductCardProps[]> {
  try {
    const res = await api.get(productsUrls.list, {
      params: { sort: "popular", pageSize: limit },
    });
    return res.data?.data?.items ?? [];
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return [];
  }
}

export async function fetchHomeSections(): Promise<HomeSection[]> {
  const featured = await fetchFeaturedProducts(12);
  if (featured.length > 0) {
    return [{ id: "featured", title: "Featured", products: featured }];
  }

  const popular = await fetchPopularProducts(12);
  if (popular.length === 0) return [];
  return [{ id: "popular", title: "Popular right now", products: popular }];
}

export async function fetchSliderImages(): Promise<SlideData[]> {
  if (!FEATURES.homeSections) return [];
  return [];
}
