import { ProductCardProps } from "@/components/common/ProductCard";
import { api } from "@/lib/api/axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "http://localhost:3000/api";

export async function fetchProducts(endpoint: string): Promise<ProductCardProps[]> {
  try {
    const res = await api.get(`${API_BASE_URL}/${endpoint}`);
    return res.data?.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}
