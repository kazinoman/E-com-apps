export const auth = {
  register: "/v1/auth/signup",
  login: "/v1/auth/login",
  logout: "/v1/auth/logout",
};

export const wishlist = {
  get: (userId: string) => `/wishlists?userId=${userId}`,
  add: "/wishlists",
  remove: (id: string) => `/wishlists/${id}`,
};

export const search = {
  categories: "/categories",
  products: (query: string) => `/search?${query}`,
};

export const profile = {
  phone: {
    otp: "/profile/phone/otp",
    verify: "/profile/phone/verify",
    update: "/profile/phone/update",
  },
  address: {
    list: "/profile/address",
    add: "/profile/address",
    update: (id: string) => `/profile/address/${id}`,
    remove: (id: string) => `/profile/address/${id}`,
  }
};

export const products = {
  detail: (id: string) => `/products/${id}`,
  byCategory: (category: string, limit: number) => `/search?category=${encodeURIComponent(category)}&limit=${limit}`,
};

export const orders = {
  active: "/orders?status=active",
  history: "/orders?status=history",
  detail: (id: string) => `/orders/${id}`,
  create: "/orders",
  track: "/orders/track",
};

export const home = {
  sections: "/home/sections",
  slider: "/home/slider",
  dynamic: (endpoint: string) => `/${endpoint}`,
};

export const category = {
  list: "/categories",
};

export const cart = {
  get: (userId: string) => `/cart?userId=${userId}`,
  add: "/cart",
  update: (id: string) => `/cart/${id}`,
  remove: (id: string, userId: string) => `/cart/${id}?userId=${userId}`,
  sync: (userId: string) => `/cart?userId=${userId}`,
};

export const apiUrls = {
  auth,
  wishlist,
  search,
  profile,
  products,
  orders,
  home,
  category,
  cart,
};
