"use server";

import { ProductResponse } from "@/schemas/product";
import { products as productsUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";

export const getProductById = async (id: string): Promise<ProductResponse | null> => {
  try {
    const res = await api.get(productsUrls.detail(id));
    return res.data?.data ?? null;
  } catch (error) {
    if ((error as { response?: { status?: number } }).response?.status === 404) return null;
    console.error("Error fetching product:", error);
    return null;
  }
};

/**
 * "Similar" is everything else in the same category — the catalog has no
 * recommender, and pretending otherwise would just be a shuffled list.
 */
export const getSimilarProducts = async (category: string, limit = 20): Promise<unknown[]> => {
  try {
    const res = await api.get(productsUrls.list, {
      params: { category, pageSize: limit },
    });
    return res.data?.data?.items ?? [];
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
};
