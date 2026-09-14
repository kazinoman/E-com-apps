import { ProductResponse } from "@/schemas/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "http://localhost:3000/api";

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
