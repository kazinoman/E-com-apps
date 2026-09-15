// Mock of GET /api/v1/products/facets, mirroring the real merchant backend.
// Switch with NEXT_PUBLIC_API_BASE (:3000 real, :3001 this mock).
import { ok } from "@/lib/mock/envelope";
import { allProducts } from "@/lib/mock/fixtures";

export async function GET() {
  const products = await allProducts();
  const counts = new Map<string, number>();
  for (const p of products) {
    // The real facets are grouped on the TOP-LEVEL category, so a slug like
    // "watches-smart-watch" counts under "watches".
    const top = String(p.category ?? "").split("-")[0];
    if (!top) continue;
    counts.set(top, (counts.get(top) ?? 0) + 1);
  }

  const categories = [...counts.entries()]
    .map(([slug, count]) => ({
      slug,
      name: slug.replace(/(^|-)\S/g, (c) => c.toUpperCase()).replace(/-/g, " "),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return ok({ categories }, "Facets fetched successfully");
}
