import { cookies } from "next/headers";
import { ok } from "@/lib/mock/envelope";
import { getWishlist, saveWishlist, readSession, readCartToken, newToken, CART_COOKIE } from "@/lib/mock/store";

export async function DELETE(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const session = await readSession();
  let cartToken = await readCartToken();
  let key = session || cartToken;
  if (!key) {
    key = newToken();
    (await cookies()).set(CART_COOKIE.name, key, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }

  const wishlist = getWishlist(key);
  wishlist.items = wishlist.items.filter((i: any) => String(i.productId) !== String(productId));
  saveWishlist(key, wishlist);
  
  return ok(wishlist, "Item removed from wishlist");
}
