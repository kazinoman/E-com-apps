"use server";

import { vendors as vendorUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { emptyPage, isNotFound, unwrapPaginated } from "@/lib/api/paginated";
import type { VendorProfile } from "@/lib/types/vendor";
import type { Paginated } from "@/lib/types/pagination";
import type { ProductCardData } from "@/schemas/product";

/**
 * There is no vendor *index* endpoint — only `GET /vendors/:id`. A vendor is
 * reached from a product it sells, never from a browsable supplier directory,
 * so no `/vendors` list route exists.
 */
export async function fetchVendor(id: string): Promise<VendorProfile | null> {
  try {
    const res = await api.get(vendorUrls.detail(id));
    return res.data?.data ?? null;
  } catch (error) {
    if (isNotFound(error)) return null;
    console.error("Error fetching vendor:", error);
    return null;
  }
}

export async function fetchVendorProducts(
  id: string,
  page = 1,
  pageSize = 24,
): Promise<Paginated<ProductCardData>> {
  try {
    const res = await api.get(vendorUrls.products(id), { params: { page, pageSize } });
    return unwrapPaginated<ProductCardData>(res.data);
  } catch (error) {
    if (!isNotFound(error)) console.error("Error fetching vendor products:", error);
    return emptyPage<ProductCardData>();
  }
}
