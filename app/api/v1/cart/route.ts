// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";
import { getCart, saveCart, readCartToken, newToken, CART_COOKIE, recalculate } from "@/lib/mock/store";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }
  const cart = getCart(token);
  return ok(cart, "Cart fetched successfully");
}

export async function DELETE(request: Request) {
  let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }
  const cart = getCart(token);
  cart.items = [];
  saveCart(token, cart);
  return ok(null, "Cart cleared");
}
