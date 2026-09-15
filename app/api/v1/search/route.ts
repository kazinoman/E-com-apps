// Mock of GET /api/v1/search, mirroring the real merchant backend.
// Switch with NEXT_PUBLIC_API_BASE (:3000 real, :3001 this mock).
import { type NextRequest } from "next/server";
import { okPaginated } from "@/lib/mock/envelope";
import { allProducts, toListItem } from "@/lib/mock/fixtures";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = (sp.get("q") ?? "").toLowerCase();
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const pageSize = Math.max(1, parseInt(sp.get("page_size") ?? "20", 10) || 20);

  const products = q
    ? (await allProducts()).filter((p) =>
        String(p.title ?? "").toLowerCase().includes(q),
      )
    : await allProducts();

  const totalItems = products.length;
  const start = (page - 1) * pageSize;
  const items = products.slice(start, start + pageSize).map(toListItem);

  return okPaginated(
    items,
    {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
    "Search results fetched successfully",
  );
}
