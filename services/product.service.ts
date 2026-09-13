import { ProductResponse } from "@/schemas/product";

const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:3001";

export const getProductById = async (id: string): Promise<ProductResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: "no-store", // For fresh mock data
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }
    
    const data: ProductResponse = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
