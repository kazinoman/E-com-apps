"use server";

import { Order } from "@/types/order";
import { orders as ordersUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { clearPendingOrder, writePendingOrder } from "@/lib/pending-order";

/**
 * Orders belong to the session — there is no user id in any path here.
 *
 * `GET /orders` is paginated and nothing more: the backend has no status
 * filter, so the active/history split the UI wants is made here, from each
 * order's own status.
 */

/** Finished as far as a shopper is concerned; everything else is in flight. */
const HISTORY_STATUSES = new Set(["delivered", "cancelled", "refunded"]);

/** Backend max is 50 per page. */
const PAGE_SIZE = 50;

async function listOrders(): Promise<Order[]> {
  const res = await api.get(ordersUrls.list, { params: { page: 1, pageSize: PAGE_SIZE } });
  return res.data?.data?.items ?? [];
}

export async function getActiveOrders(): Promise<Order[]> {
  try {
    return (await listOrders()).filter((o) => !HISTORY_STATUSES.has(String(o.status)));
  } catch (error) {
    console.error("Error fetching active orders:", error);
    return [];
  }
}

export async function getHistoryOrders(): Promise<Order[]> {
  try {
    return (await listOrders()).filter((o) => HISTORY_STATUSES.has(String(o.status)));
  } catch (error) {
    console.error("Error fetching history orders:", error);
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const res = await api.get(ordersUrls.detail(id));
    return res.data?.data ?? null;
  } catch (error) {
    if ((error as { response?: { status?: number } }).response?.status === 404) return null;
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
}

/**
 * Placing an order is `POST /checkout`, not `POST /orders`.
 *
 * The body is the address the customer picked plus the payment method; the
 * server prices the order from the cart it already holds, so no line items and
 * no totals are sent from here. An sslcommerz order comes back with
 * `gatewayRedirectUrl` to send the browser to.
 */
export async function createOrder(input: {
  addressId: string;
  paymentMethod: "cod" | "sslcommerz";
  notes?: string;
}) {
  try {
    // Snake-cased to address_id / payment_method by the request interceptor.
    const res = await api.post(ordersUrls.create, input);
    const data = res.data?.data;

    /*
     * An online payment sends the shopper off to SSLCommerz, which returns
     * them to a fixed URL carrying no order reference we can trust. Remember
     * which order they went to pay for, so the page that greets them on the
     * way back can report on the real one. COD never leaves the site, so it
     * clears any stale value instead.
     */
    if (data?.gatewayRedirectUrl && data?.order?.id) {
      await writePendingOrder(String(data.order.id));
    } else {
      await clearPendingOrder();
    }

    return { ok: true, data };
  } catch (error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    console.error("Error creating order:", error);
    return { ok: false, error: response?.data?.message ?? "An error occurred. Please try again." };
  }
}

/** Only `pending` and `awaiting_payment` orders can be cancelled — the state
 * machine rejects the rest, and the message it returns is shown as-is. */
export async function cancelOrder(id: string) {
  try {
    const res = await api.post(ordersUrls.cancel(id));
    return { ok: true, data: res.data?.data };
  } catch (error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return { ok: false, error: response?.data?.message ?? "Could not cancel this order." };
  }
}

/**
 * Guest order tracking has no backend yet (HYDRA ab4cc8b4), so this always
 * fails. `FEATURES.guestOrderTracking` gates the page itself, which is where
 * the shopper is told — the signature stays so the page compiles once the
 * endpoint lands and the flag flips.
 */
export async function trackPublicOrder(
  _phone: string,
  _orderNo: string,
): Promise<{ ok: boolean; data?: Order; error?: string }> {
  return { ok: false, error: "Order tracking isn't available yet. Sign in to see your orders." };
}
