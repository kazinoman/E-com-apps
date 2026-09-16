"use server";

import { ProductCardProps } from "@/components/common/ProductCard";
import { api } from "@/lib/api/axios";
import { products as productsUrls } from "@/lib/api/apiUrls";
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

/**
 * PLACEHOLDER hero, at Sonnet's explicit request (2026-09-16), until the
 * merchant can actually set a real banner (HYDRA 3e1d1569 — no admin CMS for
 * this exists yet). These are generic stock photos with generic captions —
 * no price, no claim, nothing that reads as a real promotion — and they link
 * to real category pages, not dead "#" hrefs. Delete this array the same
 * commit the real banner endpoint lands; don't let it become the permanent
 * "temporary" hero.
 */
const PLACEHOLDER_SLIDES: SlideData[] = [
  {
    id: "placeholder-1",
    title: "Shop the full catalog",
    linkText: "Browse categories",
    linkUrl: "/categories",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    backgroundColor: "bg-[#4895EF]",
  },
  {
    id: "placeholder-2",
    title: "Gadgets & electronics",
    linkText: "Shop gadgets",
    linkUrl: "/category/gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop",
    backgroundColor: "bg-[#FF7B54]",
  },
  {
    id: "placeholder-3",
    title: "Bags for every trip",
    linkText: "Shop bags",
    linkUrl: "/category/bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
    backgroundColor: "bg-[#2ECC71]",
  },
  {
    id: "placeholder-4",
    title: "Women's fashion",
    linkText: "Shop women's wear",
    linkUrl: "/category/women-wear",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    backgroundColor: "bg-[#9B59B6]",
  },
];

export async function fetchSliderImages(): Promise<SlideData[]> {
  return PLACEHOLDER_SLIDES;
}
