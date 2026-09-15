// Mock of POST /api/v1/cart/items, mirroring the real merchant backend.
// Switch with NEXT_PUBLIC_API_BASE (:3000 real, :3001 this mock).
import { cookies } from "next/headers";
import { ok, validationError, fail } from "@/lib/mock/envelope";
import {
  getCart,
  saveCart,
  readCartToken,
  newToken,
  CART_COOKIE,
  type CartItem,
} from "@/lib/mock/store";
import { allProducts, toListItem } from "@/lib/mock/fixtures";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  // Request bodies are snake_case on the real API. A camelCase `productId`
  // must fail here exactly as it does there, or the mock hides the bug.
  if (typeof body.product_id !== "string") {
    return validationError([
      {
        field: "product_id",
        message: "Invalid input: expected string, received undefined",
      },
    ]);
  }

  const raw = (await allProducts()).find(
    (p) => String(p.id) === String(body.product_id),
  );
  if (!raw) return fail("Product not found", "PRODUCT_NOT_FOUND", 404);

  // Go through the same mapper the catalogue endpoints use, so the price and
  // MOQ a shopper sees on the listing are the ones that reach their cart.
  const product = toListItem(raw);
  const quantity = Number(body.quantity) || 1;
  const skuExternalId = body.sku_external_id ?? null;

  // The guest's cart_token cookie is the only identity. It is minted on the
  // first add, never accepted from the request.
  let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, {
      maxAge: CART_COOKIE.maxAge,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  const cart = getCart(token);
  const existing = cart.items.find(
    (i) => i.productId === product.id && i.skuExternalId === skuExternalId,
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    const item: CartItem = {
      id: randomUUID(),
      productId: product.id,
      skuExternalId,
      title: product.title,
      imageUrl: product.imageUrl,
      attributes: {},
      quantity,
      // The real backend snapshots an already-rounded unit price: toTaka()
      // rounds HALF_UP to 0 dp, and the line total is unit x quantity with no
      // second rounding. Taka is never fractional, so round here too — a mock
      // that emits 1163.99 teaches the UI to render money the API cannot
      // produce.
      unitPriceBdt: Math.round(product.price.bdt),
      lineTotalBdt: 0, // recomputed by saveCart -> recalculate
      moq: product.moq,
      activeTierMinQty: null,
      belowMoq: false,
      unavailable: false,
      priceChanged: null,
    };
    cart.items.push(item);
  }

  return ok(saveCart(token, cart), "Item added to cart", 201);
}
