"use server";

import { api } from "@/lib/api/axios";
import { checkout } from "@/lib/api/apiUrls";
import type { CheckoutTerms } from "@/lib/types/checkout-terms";

/**
 * Fetch the merchant's advance-payment and freight terms.
 *
 * Public endpoint — no session required. Falls back to sensible defaults
 * (100% advance, no minimum) so the product page never crashes.
 */
export async function fetchCheckoutTerms(): Promise<CheckoutTerms> {
  try {
    const res = await api.get(checkout.terms);
    return res.data?.data ?? { shippingDaysMin: null, shippingDaysMax: null, advancePct: 100, minOrderBdt: 0, sea: { enabled: false, minOrderBdt: 0, minBdtPerKg: 0, maxBdtPerKg: 0 } };
  } catch (error) {
    console.error("checkout-terms: fetch failed", error);
    return { shippingDaysMin: null, shippingDaysMax: null, advancePct: 100, minOrderBdt: 0, sea: { enabled: false, minOrderBdt: 0, minBdtPerKg: 0, maxBdtPerKg: 0 } };
  }
}
