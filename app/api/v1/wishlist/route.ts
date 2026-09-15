import { ok } from "@/lib/mock/envelope";
import { getWishlist, readSession, readCartToken } from "@/lib/mock/store";

export async function GET(request: Request) {
  const session = await readSession();
  const token = await readCartToken();
  const wishlist = getWishlist(session || token);
  return ok(wishlist, "Wishlist fetched successfully");
}
