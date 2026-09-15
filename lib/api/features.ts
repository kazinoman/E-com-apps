/**
 * Storefront features whose backend does not exist yet.
 *
 * v2 was built against a mock that answered every one of these. Calling them
 * against the real API 404s, and a 404 rendered as an empty page is worse than
 * a feature that is visibly absent — so the UI branches on these flags and
 * never issues the request.
 *
 * Flip a flag the same commit the endpoint lands, not before.
 */
export const FEATURES = {
  /** `GET /home/sections` + `GET /home/slider` — merchant-curated homepage. */
  homeSections: false,
  /** `GET /orders/track` — look up an order by phone + order number. */
  guestOrderTracking: false,
} as const;
