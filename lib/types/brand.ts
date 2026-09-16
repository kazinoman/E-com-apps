/**
 * Brands as `GET /brands` and `GET /brands/:slug` return them.
 *
 * Note what is *not* here: a logo, a description, a country, a hero image. The
 * catalog carries three fields per brand and nothing else, so a brand page
 * shows three fields. There is also no brand on a product card, which is why
 * nothing outside these two endpoints can tell you a product's brand.
 */
export interface Brand {
  slug: string;
  name: string;
  productCount: number;
}
