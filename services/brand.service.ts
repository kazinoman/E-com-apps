"use server";

import { brands as brandUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { emptyPage, isNotFound, unwrapPaginated } from "@/lib/api/paginated";
import type { Brand } from "@/lib/types/brand";
import type { Paginated } from "@/lib/types/pagination";
import type { ProductCardData } from "@/schemas/product";

/**
 * There are ~4,566 brands and `GET /brands` takes no search or letter filter —
 * `?q=` and `?search=` are accepted and then ignored, returning page 1
 * unchanged. So the index paginates and nothing else; a search box here would
 * be a control that does not work.
 *
 * `page_size` is capped at 100 by the backend's validator.
 */
export async function fetchBrands(page = 1, pageSize = 48): Promise<Paginated<Brand>> {
  try {
    const res = await api.get(brandUrls.list, { params: { page, pageSize } });
    return unwrapPaginated<Brand>(res.data);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return emptyPage<Brand>();
  }
}

/** null for an unknown slug (404 `BRAND_NOT_FOUND`), so the route can 404. */
export async function fetchBrand(slug: string): Promise<Brand | null> {
  try {
    const res = await api.get(brandUrls.detail(slug));
    return res.data?.data ?? null;
  } catch (error) {
    if (isNotFound(error)) return null;
    console.error("Error fetching brand:", error);
    return null;
  }
}

export async function fetchBrandProducts(
  slug: string,
  page = 1,
  pageSize = 24,
): Promise<Paginated<ProductCardData>> {
  try {
    const res = await api.get(brandUrls.products(slug), { params: { page, pageSize } });
    return unwrapPaginated<ProductCardData>(res.data);
  } catch (error) {
    if (!isNotFound(error)) console.error("Error fetching brand products:", error);
    return emptyPage<ProductCardData>();
  }
}
