/**
 * Products as the backend renders them (`ProductsService.detail`, camelized by
 * the response interceptor).
 *
 * Two things here are not negotiable, and both were wrong in the mock:
 *
 * - **Price is an object**, `{ cny, bdt }`, at every level — product, SKU and
 *   quantity tier. Taka is whole and already includes the merchant's markup
 *   and any price override; CNY is what we paid upstream. Never add, scale or
 *   round either on the client.
 * - **Rating and vendor may be absent.** `ratingAvg` is null for virtually the
 *   whole catalog, because nobody has reviewed a freshly imported product.
 *   Render nothing when it is null. A default of 0, 4.5 or "no reviews yet
 *   ★★★★★" is a fabricated rating, which is the same class of lie as the
 *   invented strikethrough price deleted in v2-4.
 */

export interface Money {
  cny: number;
  bdt: number;
}

/**
 * A purchasable variant. `skuId` is the upstream `sku_external_id` and is what
 * `POST /cart/items` wants as `sku_external_id` — it is not our own id.
 */
export interface Sku {
  skuId: string;
  /** Opaque upstream axis→value bag, e.g. `{ Color: "67" }`. Rendered, never parsed. */
  attributes: Record<string, string>;
  price: Money;
  stock: number | null;
  imageUrl: string | null;
}

/** One selectable axis (Color, Size…) with the values the SKUs actually use. */
export interface VariantAxis {
  axis: string;
  values: { value: string; imageUrl: string | null }[];
}

/** Buy more, pay less. `minQuantity` is the lower bound of the break. */
export interface PriceTier {
  minQuantity: number;
  price: Money;
}

export interface ProductImage {
  url: string;
  position: number | null;
  isPrimary: boolean;
}

export interface ProductVideo {
  url: string;
  previewUrl: string | null;
}

export interface Vendor {
  id: string;
  name: string | null;
  score: number | null;
}

export interface Product {
  /** Catalog id as a string — these overflow a JS number. */
  id: string;
  remoteId: string;
  title: string;
  descriptionHtml: string | null;
  category: string | null;

  price: Money;
  salesCount: number | null;
  /** Minimum order quantity. null means none — a first lot of 1 is not a rule. */
  moq: number | null;
  weightKg: number | null;

  ratingAvg: number | null;
  ratingCount: number | null;
  ratingBreakdown: Record<string, number>;

  /** Opaque upstream spec keys, preserved verbatim through camelization. */
  attributes: Record<string, string>;

  video: ProductVideo[];
  images: ProductImage[];
  variantAxes: VariantAxis[];
  skus: Sku[];
  priceTiers: PriceTier[];
  vendor: Vendor | null;
}

/**
 * The tier price that applies at a given quantity: the highest break whose
 * `minQuantity` the order reaches. Falls back to the product price when the
 * catalog carries no tiers, which is most of it.
 */
export function tierPriceFor(product: Product, quantity: number): Money {
  const applicable = product.priceTiers
    .filter((tier) => quantity >= tier.minQuantity)
    .sort((a, b) => b.minQuantity - a.minQuantity)[0];
  return applicable?.price ?? product.price;
}

/** The primary image, else the first, else nothing. */
export function primaryImage(product: Product): string | null {
  return (product.images.find((i) => i.isPrimary) ?? product.images[0])?.url ?? null;
}
