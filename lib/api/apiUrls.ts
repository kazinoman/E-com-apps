/*
 * Every path here is relative to `NEXT_PUBLIC_API_BASE`, which already ends in
 * `/api/v1` (see lib/api/axios.ts). So paths start at the resource — a leading
 * `/v1` would resolve to `/api/v1/v1/...` and 404.
 *
 * Nothing in this file takes a user id. The backend resolves the customer from
 * the `buyer_session` cookie and a guest from `cart_token`; a user id in a URL
 * would be an authorisation hole, not a convenience.
 */

export const auth = {
  register: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  passwordReset: {
    request: "/auth/password-reset/request",
    confirm: "/auth/password-reset/confirm",
  },
};

/** Session-scoped. Removal is keyed by product id, not by a wishlist row id. */
export const wishlist = {
  get: "/wishlist",
  add: "/wishlist/items",
  remove: (productId: string) => `/wishlist/items/${productId}`,
};

export const search = {
  products: "/search",
  suggestions: "/search/suggestions",
};

export const profile = {
  me: "/me",
  password: "/me/password",
  email: {
    request: "/me/email/request",
    confirm: "/me/email/confirm",
  },
  /*
   * Two steps, not three: `request` sends a code to the NEW number, `confirm`
   * takes that code plus the account password. There is no endpoint that
   * verifies the *current* number — proving control of the old number proves
   * nothing about who is asking.
   */
  phone: {
    request: "/me/phone/request",
    confirm: "/me/phone/confirm",
  },
  address: {
    list: "/me/addresses",
    add: "/me/addresses",
    update: (id: string) => `/me/addresses/${id}`,
    remove: (id: string) => `/me/addresses/${id}`,
    makeDefault: (id: string) => `/me/addresses/${id}/default`,
  },
};

export const brands = {
  list: "/brands",
  detail: (slug: string) => `/brands/${slug}`,
  products: (slug: string) => `/brands/${slug}/products`,
};

export const vendors = {
  detail: (id: string) => `/vendors/${id}`,
  products: (id: string) => `/vendors/${id}/products`,
};

/** Session-scoped, like the cart and wishlist. Removal is by product id. */
export const compare = {
  get: "/compare",
  add: "/compare/items",
  remove: (productId: string) => `/compare/items/${productId}`,
  clear: "/compare",
};

export const products = {
  list: "/products",
  facets: "/products/facets",
  detail: (id: string) => `/products/${id}`,
};

/*
 * `POST /checkout` creates the order — there is no `POST /orders`. Listing is
 * paginated only; the backend has no status filter, so the active/history
 * split is made from each order's own status on the client.
 */
export const orders = {
  list: "/orders",
  detail: (id: string) => `/orders/${id}`,
  create: "/checkout",
  cancel: (id: string) => `/orders/${id}/cancel`,
};

export const category = {
  list: "/categories",
  detail: (slug: string) => `/categories/${slug}`,
};

/*
 * The cart is resolved from cookies, never from a user id in the URL: the
 * `buyer_session` JWT if signed in, otherwise the httpOnly `cart_token`.
 * Item ids are server cart_item ids, not `productId_skuId` composites.
 */
export const cart = {
  get: "/cart",
  add: "/cart/items",
  update: (itemId: string) => `/cart/items/${itemId}`,
  remove: (itemId: string) => `/cart/items/${itemId}`,
  clear: "/cart",
};

export const apiUrls = {
  auth,
  wishlist,
  brands,
  vendors,
  compare,
  search,
  profile,
  products,
  orders,
  category,
  cart,
};
