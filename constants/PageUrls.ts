export const PageUrls = {
  home: "/",
  login: "/login",
  signup: "/signup",
  profile: "/profile/my-profile",
  address: "/profile/my-address",
  cart: "/cart",
  checkout: "/checkout",
  orders: "/profile/orders",
  wishlist: "/profile/wishlist",
  orderDetails: (id: string) => `/order-details/${id}`,
  productDetails: (slug: string) => `/product-details/${slug}`,
  collection: (slug: string) => `/collection/${slug}`,
  search: "/search",

  orderComfirm: (id: string) => `/order-comfirm/${id}`,

  logout: "/logout",
};
