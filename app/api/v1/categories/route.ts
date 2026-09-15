// Mock of GET /api/v1/categories, mirroring the real merchant backend.
// Switch with NEXT_PUBLIC_API_BASE (:3000 real, :3001 this mock).
import { ok } from "@/lib/mock/envelope";
import { allCategories } from "@/lib/mock/fixtures";

export async function GET() {
  // The real endpoint returns a FLAT array as `data`, not a {items} object.
  return ok(await allCategories(), "Categories fetched successfully");
}
