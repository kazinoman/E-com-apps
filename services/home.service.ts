import { ProductCardProps } from "@/components/common/ProductCard";
import { api } from "@/lib/api/axios";

export async function fetchProducts(endpoint: string): Promise<ProductCardProps[]> {
  try {
    const res = await api.get(`http://localhost:3001/${endpoint}`);
    return res.data?.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}
