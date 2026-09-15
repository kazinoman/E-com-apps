import { cookies } from "next/headers";
// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized, validationError } from "@/lib/mock/envelope";
import {  getCart, saveCart, readCartToken, readSession, newToken , CART_COOKIE } from "@/lib/mock/store";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return unauthorized();
  
  const body = await request.json().catch(() => ({}));
  if (!body.address_id || !body.payment_method) {
    return validationError([
      { field: "address_id", message: "Required" },
      { field: "payment_method", message: "Required" }
    ]);
  }

  let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }
  const cart = getCart(token);
  
  // Clear cart on checkout
  cart.items = [];
  saveCart(token, cart);

  return ok({ orderId: "OTO-2026-000001" }, "Checkout successful", 201);
}
