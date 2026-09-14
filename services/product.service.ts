"use server";

import { ProductResponse } from "@/schemas/product";
import { products as productsUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";

export const getProductById = async (id: string): Promise<ProductResponse | null> => {
  try {
    const res = await api.get(productsUrls.detail(id));
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error("Error fetching product:", error);
    return null;
  }
};

export const getSimilarProducts = async (category: string, limit: number = 20): Promise<any[]> => {
  try {
    const res = await api.get(productsUrls.byCategory(category, limit));
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
};
