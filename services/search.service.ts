"use server";

import { ProductCardProps } from "@/components/common/ProductCard";
import { api } from "@/lib/api/axios";
import { search as searchUrls } from "@/lib/api/apiUrls";
import { fetchCategoryOptions } from "./category.service";
import type { CategoryOption } from "@/lib/types/category";

/**
 * The filter vocabulary the search UI speaks. It is not the backend's: the
 * mapping to `ListProductsQuery` happens here, in one place, and anything the
 * backend cannot answer is dropped rather than sent and silently ignored.
 */
export interface SearchParams {
  category?: string;
  subCategory?: string;
  title?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  color?: string;
}

export interface SearchResponse {
  data: ProductCardProps[];
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

/**
 * `sort` + `order` in the URL collapse into the backend's single enum.
 *
 * `rating` maps to `popular`: the catalog carries sales counts, not ratings,
 * so sorting by stars would be sorting by a number we do not have.
 */
function toBackendSort(sort?: string, order?: "asc" | "desc") {
  if (sort === "price") return order === "asc" ? "price_asc" : "price_desc";
  if (sort === "rating") return "popular";
  if (sort === "newest" || sort === "popular" || sort === "relevance") return sort;
  return undefined;
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  return fetchCategoryOptions();
}

export async function searchProducts(params: SearchParams): Promise<SearchResponse | null> {
  try {
    // A sub-category is a category slug in its own right, so the narrower of
    // the two wins. `color` and `rating` have no backend filter and are not
    // sent.
    const res = await api.get(searchUrls.products, {
      params: {
        q: params.search ?? params.title,
        category: params.subCategory ?? params.category,
        page: params.page,
        pageSize: params.limit,
        sort: toBackendSort(params.sort, params.order),
        priceMin: params.priceMin,
        priceMax: params.priceMax,
      },
    });

    // The envelope carries `pagination` as a sibling of `data`, not inside it,
    // and counts the collection as `totalItems`. `data` itself is `{ items }`.
    const pagination = res.data?.pagination ?? {};
    const limit = pagination.pageSize ?? params.limit ?? 24;
    const total = pagination.totalItems ?? 0;

    // The item shape is the backend's product card, not v2's ProductCardProps —
    // reconciling the two is v2-6.
    return {
      data: res.data?.data?.items ?? [],
      meta: {
        pagination: {
          total,
          page: pagination.page ?? params.page ?? 1,
          limit,
          totalPages: pagination.totalPages ?? Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error(`Error searching products:`, error);
    return null;
  }
}
