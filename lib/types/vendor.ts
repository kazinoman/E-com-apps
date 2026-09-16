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
