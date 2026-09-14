"use server";

import { category as categoryUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await api.get(categoryUrls.list);
    const data = res.data;
    
    const filters = data?.data?.filters;
    if (!filters || !filters.length) return [];

    const categoryFilter = filters.find((f: any) => f.key === 'category');
    if (!categoryFilter || !categoryFilter.options) return [];

    return categoryFilter.options.map((opt: any) => ({
      id: opt.value,
      name: opt.label,
      subcategories: (opt.children || []).map((child: any) => ({
        id: child.value,
        name: child.label,
      })),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
