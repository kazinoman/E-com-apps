import { cookies } from "next/headers";
import { ok, validationError } from "@/lib/mock/envelope";
import { getWishlist, saveWishlist, readSession, readCartToken, newToken, CART_COOKIE } from "@/lib/mock/store";
import { getDbData } from "@/lib/data";

export async function POST(request: Request) {
  const session = await readSession();
  let cartToken = await readCartToken();
  let key = session || cartToken;
  if (!key) {
    key = newToken();
    (await cookies()).set(CART_COOKIE.name, key, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }

  const body = await request.json().catch(() => ({}));
  if (!body.product_id) {
    return validationError([{ field: "product_id", message: "Invalid input" }]);
  }
  
  const wishlist = getWishlist(key);
  
  if (!wishlist.items.some(i => i.productId === String(body.product_id))) {
    const db = await getDbData();
    const product = db.products.find((p: any) => String(p.id) === String(body.product_id));
    if (product) {
      wishlist.items.push({
        productId: String(product.id),
        title: product.title,
        imageUrl: product.image || product.images?.[0] || "",
        priceBdt: product.price || 0
      });
      saveWishlist(key, wishlist);
    } else {
      return validationError([{ field: "product_id", message: "Product not found" }]);
    }
  }
  
  return ok(wishlist, "Item added to wishlist", 201);
}
