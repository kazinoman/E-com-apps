/**
 * A supplier as `GET /vendors/:id` returns it.
 *
 * `name` is frequently the id repeated back — an upstream backfill that never
 * finished. `vendorDisplayName` is the only sanctioned way to render it: an
 * opaque token like `BBB5pGRqM8jKpfDH4Dn02mPRg` is not a store name and must
 * never be printed as one.
 */
export interface VendorProfile {
  id: string;
  name: string | null;
  score: number | null;
  productCount: number | null;
  unitsSold: number | null;
}

/** The vendor's real name, or null when the backfill left the id in its place. */
export function vendorDisplayName(vendor: {
  id: string;
  name: string | null;
}): string | null {
  const name = vendor.name?.trim();
  if (!name) return null;
  if (name === vendor.id) return null;
  return name;
}

/**
 * A supplier score worth showing, or null.
 *
 * The upstream feed uses **0 to mean "no score recorded"**, not "rated zero":
 * every genuine score in the catalog starts at 1.00, and 6,107 of 34,313
 * vendors (18%) sit at exactly 0. Rendering those as ★ 0.0 would put a damning
 * rating on a supplier purely because the data is missing.
 *
 * A handful of rows (4) carry scores above 5 — 8, 9, 11 — which the scale does
 * not admit. They are dropped rather than shown beside a five-star icon.
 */
export function vendorScore(score: number | null | undefined): number | null {
  if (score === null || score === undefined) return null;
  if (score <= 0 || score > 5) return null;
  return score;
}
