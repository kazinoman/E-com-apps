"use server";

import { ProductCardProps } from "@/components/common/ProductCard";
import { api } from "@/lib/api/axios";
import { home as homeUrls } from "@/lib/api/apiUrls";

export interface HomeSection {
  id: string;
  title: string;
  products: ProductCardProps[];
}

export async function fetchProducts(endpoint: string): Promise<ProductCardProps[]> {
  try {
    const res = await api.get(homeUrls.dynamic(endpoint));
    return res.data?.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

export async function fetchHomeSections(): Promise<HomeSection[]> {
  try {
    const res = await api.get(homeUrls.sections);
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching home sections:", error);
    return [];
  }
}

export async function fetchSliderImages(): Promise<any[]> {
  try {
    const res = await api.get(homeUrls.slider);
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return [];
  }
}
