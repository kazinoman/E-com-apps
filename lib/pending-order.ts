// Server-only: importing next/headers makes this unusable from a Client
// Component, which is the boundary we want.
import { cookies } from "next/headers";

/**
 * Which order the shopper is away paying for.
 *
 * SSLCommerz returns the shopper to a fixed URL with no order reference we can
 * trust, so the order id is kept here instead — httpOnly, so the page that
 * greets them on the way back can look up the real order without ever taking
 * an order id from the query string. An id in the URL would let anyone read
 * back somebody else's order simply by editing it.
 *
 * One hour: long enough for a slow payment, short enough that a stale cookie
 * cannot make a later visit report on an order the shopper has moved on from.
 */
export const PENDING_ORDER_COOKIE = "pending_payment_order";
const PENDING_ORDER_MAX_AGE = 60 * 60;

export async function writePendingOrder(orderId: string) {
  const jar = await cookies();
  jar.set(PENDING_ORDER_COOKIE, orderId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // `lax` is deliberate and load-bearing: the gateway returns the shopper
    // with a cross-site POST, which carries no lax cookie. That POST is
    // answered with a 303, and the GET the browser then makes is a top-level
    // same-site navigation, which does carry it.
    sameSite: "lax",
    path: "/",
    maxAge: PENDING_ORDER_MAX_AGE,
  });
}

export async function readPendingOrder(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(PENDING_ORDER_COOKIE)?.value ?? null;
}

export async function clearPendingOrder() {
  const jar = await cookies();
  jar.delete(PENDING_ORDER_COOKIE);
}

export type PaymentOutcome = "success" | "fail" | "cancel";

export function isPaymentOutcome(value: unknown): value is PaymentOutcome {
  return value === "success" || value === "fail" || value === "cancel";
}
