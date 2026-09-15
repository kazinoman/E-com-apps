/**
 * Fixture -> API-shape translation for the mock.
 *
 * data/db.json was authored for the app's old in-repo mock and has a different
 * shape from the real API (flat `price`, `image`, `rating`). Everything here
 * maps one onto the other in ONE place, so the route handlers stay thin and
 * there is a single file to fix when the real contract moves.
 *
 * Where the fixture has no equivalent the value is derived deterministically
 * from the product id rather than randomised, so a given product looks the
 * same on every request and across restarts.
 */
import { getDbData } from "@/lib/data";

/**
 * Fixture prices are small round numbers written as if they were dollars.
 * Real catalogue prices are BDT in the thousands, derived from a CNY price
 * via merchant_config.fx_rate_cny_bdt. We scale the fixture into a plausible
 * BDT range and derive CNY back out at the observed live rate (CNY 435 ->
 * BDT 9690 on 2026-09-15), so the two fields stay consistent with each other.
 */
const FX_CNY_BDT = 22.28;
const FIXTURE_TO_BDT = 120;

/** Stable pseudo-random integer in [min, max] derived from a string key. */
function derive(key: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return min + (h % (max - min + 1));
}

export interface ApiProductListItem {
  id: string;
  remoteId: string;
  title: string;
  imageUrl: string;
  price: { cny: number; bdt: number };
  category: string;
  salesCount: number;
  moq: number;
  weightKg: number;
  ratingAvg: number | null;
  ratingCount: number | null;
}

export interface ApiProductDetail extends ApiProductListItem {
  descriptionHtml: string | null;
  ratingBreakdown: Record<string, number>;
  attributes: Record<string, string>;
}

export function toListItem(p: any): ApiProductListItem {
  const id = String(p.id);
  const bdt = Math.round((Number(p.price) || 0) * FIXTURE_TO_BDT);
  return {
    id,
    remoteId: id,
    title: p.title ?? "",
    imageUrl: p.image ?? p.images?.[0] ?? "",
    price: { cny: Math.round(bdt / FX_CNY_BDT), bdt },
    category: p.category ?? "",
    // The fixture has `sold` on some rows; otherwise derive. Never reuse
    // reviewsCount for this — sales and reviews are different numbers.
    salesCount: Number(p.sold) || derive(id + "sales", 10, 5000),
    // The real backend's default minimum order quantity is 3, not 1.
    moq: 3,
    weightKg: Number(p.weightKg) || derive(id + "w", 1, 200) / 100,
    ratingAvg: p.rating ?? null,
    ratingCount: p.reviewsCount ?? null,
  };
}

export function toDetail(p: any): ApiProductDetail {
  const base = toListItem(p);
  const specs: Record<string, string> = {};
  for (const s of p.specifications ?? []) {
    if (s?.label) specs[s.label] = String(s.value ?? "");
  }
  const dist = p.reviewsData?.distribution ?? {};
  return {
    ...base,
    descriptionHtml: p.description ?? null,
    ratingBreakdown: {
      "1": dist["1"] ?? 0,
      "2": dist["2"] ?? 0,
      "3": dist["3"] ?? 0,
      "4": dist["4"] ?? 0,
      "5": dist["5"] ?? 0,
    },
    attributes: specs,
  };
}

export async function allProducts(): Promise<any[]> {
  const db = await getDbData();
  return db?.products ?? [];
}

/**
 * The real /categories returns a FLAT array with a parentSlug, not a tree.
 * db.json only carries a category string per product, so derive the set.
 */
export async function allCategories() {
  const products = await allProducts();
  const seen = new Map<string, { slug: string; name: string; parentSlug: string | null }>();
  for (const p of products) {
    const slug = p.category;
    if (!slug || seen.has(slug)) continue;
    const parts = String(slug).split("-");
    seen.set(slug, {
      slug,
      name: p.categoryName ?? titleCase(parts[parts.length - 1]),
      parentSlug: null,
    });
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const titleCase = (s: string) =>
  s.replace(/(^|\s)\S/g, (c) => c.toUpperCase()).replace(/_/g, " ");
