"use server";

import { ProductCardProps } from "@/components/common/ProductCard";
import { api } from "@/lib/api/axios";
import { search as searchUrls } from "@/lib/api/apiUrls";

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
    }
  }
}

export interface CategoryOption {
  value: string;
  label: string;
  children?: { value: string; label: string }[];
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  try {
    const res = await api.get(searchUrls.categories);
    const categoryFilter = res.data?.data?.filters?.find((f: any) => f.key === 'category');
    return categoryFilter?.options || [];
  } catch (error) {
    console.error(`Error fetching categories:`, error);
    return [];
  }
}

export async function searchProducts(params: SearchParams): Promise<SearchResponse | null> {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.append(key, String(value));
      }
    });

    const res = await api.get(searchUrls.products(query.toString()));
    return res.data;
  } catch (error) {
    console.error(`Error searching products:`, error);
    return null;
  }
}
