// Mock of GET /api/v1/products, mirroring the real merchant backend.
// Switch with NEXT_PUBLIC_API_BASE (:3000 real, :3001 this mock).
import { type NextRequest } from "next/server";
import { okPaginated } from "@/lib/mock/envelope";
import { allProducts, toListItem } from "@/lib/mock/fixtures";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  // Query params are snake_case, matching the real API.
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
  const pageSize = Math.max(1, parseInt(sp.get("page_size") ?? "20", 10) || 20);
  const category = sp.get("category");
  const q = sp.get("q");

  let products = await allProducts();
  if (category) products = products.filter((p) => p.category === category);
  if (q) {
    const needle = q.toLowerCase();
    products = products.filter((p) =>
      String(p.title ?? "").toLowerCase().includes(needle),
    );
  }

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
    "Products fetched successfully",
  );
}
