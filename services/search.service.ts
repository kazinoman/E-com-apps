"use server";

import { ProductCardProps } from "@/components/common/ProductCard";
import { api } from "@/lib/api/axios";

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
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "http://localhost:3000/api";
    const res = await api.get(`${API_BASE_URL}/categories`);
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

    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "http://localhost:3000/api";
    const res = await api.get(`${API_BASE_URL}/search?${query.toString()}`);
    return res.data;
  } catch (error) {
    console.error(`Error searching products:`, error);
    return null;
  }
}
