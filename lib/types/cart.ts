/**
 * The cart as the backend renders it.
 *
 * Mirrors `CartService.list()` (backend/src/modules/cart/cart.service.ts:259)
 * after the global ResponseEnvelopeInterceptor camelizes the payload. Every
 * money field is whole Taka: `PricingService.toTaka` is the single rounding
 * boundary, so `unitPriceBdt * quantity === lineTotalBdt` exactly and the
 * client must never re-derive a price of its own.
 */

/** Per-item freight rate supplied by the backend on each cart line. */
export interface FreightRate {
  code: string;
  name: string;
  bdtPerKg: number;
}

export interface CartLine {
  /** Server cart_item id — the handle for PATCH/DELETE, not a composite key. */
  id: string;
  productId: string;
  skuExternalId: string | null;
  /** Snapshot taken at add-time; the catalog may have moved since. */
  title: string;
  imageUrl: string | null;
  /** Opaque by contract — never case-converted in either direction. */
  attributes: unknown;
  quantity: number;
  unitPriceBdt: number;
  lineTotalBdt: number;
  moq: number | null;
  activeTierMinQty: number | null;
  belowMoq: boolean;
  /** The SKU is gone from the catalog: shown, priced off its snapshot, excluded from the subtotal. */
  unavailable: boolean;
  /** Set when the live price has drifted from the snapshot — the CART_PRICE_CHANGED warning surface. */
  priceChanged: { previousUnitPriceBdt: number } | null;
  /** Air freight rate for this item, null when the backend has no rate card for it. */
  freightRate: FreightRate | null;
}

export interface CartNotice {
  code: string;
  message: string;
}

export interface CartView {
  items: CartLine[];
  subtotalBdt: number;
  totalBdt: number;
  /** Advance percentage set by the merchant — never hardcoded. */
  advancePct: number;
  /** The advance the buyer pays at checkout. */
  advanceDueBdt: number;
  /** Minimum order value in Taka. */
  minOrderBdt: number;
  /** True when the cart total is below the merchant's minimum. */
  belowMinimum: boolean;
  notice: CartNotice | null;
}

export const EMPTY_CART: CartView = {
  items: [],
  subtotalBdt: 0,
  totalBdt: 0,
  advancePct: 0,
  advanceDueBdt: 0,
  minOrderBdt: 0,
  belowMinimum: false,
  notice: null,
};

/** Mutations answer with the whole cart, or with a message worth showing. */
export type CartResult =
  | { ok: true; cart: CartView }
  | { ok: false; message: string; errorCode?: string };
