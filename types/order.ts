/**
 * Orders as the backend renders them (`OrderView`, camelized by the response
 * interceptor). Money is whole taka — `PricingService.toTaka` is the single
 * rounding boundary and taka is never fractional, so nothing here is a float
 * to be formatted with decimals.
 */

export interface OrderItem {
  id: string;
  productId: string;
  skuExternalId: string | null;
  quantity: number;
  title: string;
  imageUrl: string | null;
  /** Opaque attribute bag — rendered as-is, never interpreted. */
  attributes: unknown;
  unitPriceBdt: number;
  lineTotalBdt: number;
}

export interface OrderPayment {
  id: string;
  method: string;
  status: string;
  amountBdt: number;
  gatewayTranId: string | null;
  gatewaySessionId: string | null;
  createdAt: string;
}

export interface OrderHistoryEvent {
  fromStatus: string | null;
  toStatus: string;
  reason: string | null;
  actor: string | null;
  at: string;
}

/** Every state the backend's order machine knows (`order-state.ts`). */
export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  orderNo: string;
  status: OrderStatus | string;
  paymentMethod: string;

  /**
   * The delivery address as it stood when the order was placed. It is a
   * snapshot, not a reference: editing the saved address later must not
   * rewrite where a past order went.
   */
  shipName: string;
  shipPhone: string;
  shipLine1: string;
  shipLine2: string | null;
  shipCity: string;
  shipDistrict: string | null;
  shipPostcode: string | null;
  shipCountry: string;

  itemsTotalBdt: number;
  shippingBdt: number;
  grandTotalBdt: number;
  notes: string | null;

  /**
   * Merchant-entered shipment identity, null until they record one. Nothing
   * here is derived — no carrier is guessed and no delivery date is implied.
   */
  shippingCarrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;

  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  history?: OrderHistoryEvent[];
  payments?: OrderPayment[];
}

/** Statuses a shopper reads as finished. */
export const FINISHED_STATUSES = new Set(["delivered", "cancelled", "refunded"]);

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  awaiting_payment: "Awaiting payment",
  paid: "Paid",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const statusLabel = (status: string) => STATUS_LABELS[status] ?? status;

/** Whole taka, no decimals. */
export const taka = (amount: number) => `৳${amount.toLocaleString()}`;
