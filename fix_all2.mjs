import fs from 'fs';
import path from 'path';

const basePath = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1';

function fixCartItemsRoute() {
  const file = path.join(basePath, 'cart/items/route.ts');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/let token = await readCartToken\(\);\n  if \(\!token\) \{\n    token = newToken\(\);\n    \(await cookies\(\)\)\.set\(CART_COOKIE\.name, token, \{ maxAge: CART_COOKIE\.maxAge, path: "\/", httpOnly: true, sameSite: "lax" \}\);\n  \}\n  if \(\!token\) \{\n    token = newToken\(\);\n    \(await cookies\(\)\)\.set\(CART_COOKIE\.name, token, \{ maxAge: CART_COOKIE\.maxAge, path: "\/", httpOnly: true, sameSite: "lax" \}\);\n  \}/g, `let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }`);
  fs.writeFileSync(file, content);
}
fixCartItemsRoute();

function fixWishlistRoutes() {
  // wishlist/route.ts
  const getRoute = path.join(basePath, 'wishlist/route.ts');
  let content = fs.readFileSync(getRoute, 'utf8');
  content = content.replace(/session \|\| 'guest'/g, "session || (await import('@/lib/mock/store').then(m => m.readCartToken())) || ''");
  // The route doesn't import readCartToken, let's just properly fix it.
  fs.writeFileSync(getRoute, `import { ok } from "@/lib/mock/envelope";
import { getWishlist, readSession, readCartToken } from "@/lib/mock/store";

export async function GET(request: Request) {
  const session = await readSession();
  const token = await readCartToken();
  const wishlist = getWishlist(session || token);
  return ok(wishlist, "Wishlist fetched");
}
`);

  // wishlist/items/route.ts
  const postRoute = path.join(basePath, 'wishlist/items/route.ts');
  fs.writeFileSync(postRoute, `import { cookies } from "next/headers";
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
`);

  // wishlist/items/[productId]/route.ts
  const deleteRoute = path.join(basePath, 'wishlist/items/[productId]/route.ts');
  fs.writeFileSync(deleteRoute, `import { cookies } from "next/headers";
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
`);
}
fixWishlistRoutes();
console.log("Pass 4 done.");
