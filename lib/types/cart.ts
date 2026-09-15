/**
 * The cart as the backend renders it.
 *
 * Mirrors `CartService.list()` (backend/src/modules/cart/cart.service.ts:259)
 * after the global ResponseEnvelopeInterceptor camelizes the payload. Every
 * money field is whole Taka: `PricingService.toTaka` is the single rounding
 * boundary, so `unitPriceBdt * quantity === lineTotalBdt` exactly and the
 * client must never re-derive a price of its own.
 */
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
}

export interface CartNotice {
  code: string;
  message: string;
}

export interface CartView {
  items: CartLine[];
  subtotalBdt: number;
  shippingBdt: number;
  totalBdt: number;
  notice: CartNotice | null;
}

export const EMPTY_CART: CartView = {
  items: [],
  subtotalBdt: 0,
  shippingBdt: 0,
  totalBdt: 0,
  notice: null,
};

/** Mutations answer with the whole cart, or with a message worth showing. */
export type CartResult =
  | { ok: true; cart: CartView }
  | { ok: false; message: string; errorCode?: string };
