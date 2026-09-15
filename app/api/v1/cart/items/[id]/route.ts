import { cookies } from "next/headers";
import { ok, validationError } from "@/lib/mock/envelope";
import { getCart, saveCart, readCartToken, newToken, CART_COOKIE, recalculate } from "@/lib/mock/store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  
  if (typeof body.quantity !== 'number') {
    return validationError([{ field: "quantity", message: "Invalid input" }]);
  }

  let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }
  const cart = getCart(token);
  
  const item = cart.items.find((i: any) => i.id === id);
  if (item) {
    item.quantity = body.quantity;
    saveCart(token, cart); // saveCart automatically calls recalculate
  }
  
  return ok(cart, "Cart updated");
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }
  const cart = getCart(token);
  
  cart.items = cart.items.filter((i: any) => i.id !== id);
  saveCart(token, cart); // saveCart automatically calls recalculate
  
  return ok(cart, "Item removed");
}
