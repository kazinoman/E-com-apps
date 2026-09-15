// Mock of GET /api/v1/products/:id, mirroring the real merchant backend.
// Switch with NEXT_PUBLIC_API_BASE (:3000 real, :3001 this mock).
import { ok, fail } from "@/lib/mock/envelope";
import { allProducts, toDetail } from "@/lib/mock/fixtures";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = (await allProducts()).find((p) => String(p.id) === id);
  if (!product) {
    return fail("Product not found", "PRODUCT_NOT_FOUND", 404);
  }
  return ok(toDetail(product), "Product fetched successfully");
}
