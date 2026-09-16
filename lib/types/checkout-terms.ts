/**
 * `GET /api/v1/checkout/terms` — public, no auth.
 *
 * The merchant's current advance-payment and freight rules. Fetched once on
 * the product page to show the shipping info block; never hardcoded.
 */
export interface CheckoutTerms {
  advancePct: number;
  minOrderBdt: number;
  sea: {
    enabled: boolean;
    minOrderBdt: number;
    minBdtPerKg: number;
    maxBdtPerKg: number;
  };
}
