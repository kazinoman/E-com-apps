// Mock of GET /api/v1/search/suggestions, mirroring the real merchant backend.
// Switch with NEXT_PUBLIC_API_BASE (:3000 real, :3001 this mock).
import { type NextRequest } from "next/server";
import { ok } from "@/lib/mock/envelope";
import { allProducts } from "@/lib/mock/fixtures";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").toLowerCase();
  if (!q) return ok([], "Search suggestions fetched successfully");

  // `data` is a flat array of trimmed products — no envelope items, no price.
  const data = (await allProducts())
    .filter((p) => String(p.title ?? "").toLowerCase().includes(q))
    .slice(0, 8)
    .map((p) => ({
      id: String(p.id),
      title: p.title ?? "",
      imageUrl: p.image ?? p.images?.[0] ?? "",
      category: p.category ?? "",
    }));

  return ok(data, "Search suggestions fetched successfully");
}
