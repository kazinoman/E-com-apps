"use client";

import { ReactNode } from "react";

import { AuthProvider, type User } from "./UserInfoContext";
import type { CartView } from "@/lib/types/cart";
import type { WishlistView } from "@/lib/types/wishlist";
import { WishlistProvider } from "./WishlistContext";
import { CartProvider } from "./CartContext";
import { Toaster } from "sonner";

/**
 * `initialUser`, `initialCart` and `initialWishlist` are resolved on the
 * server in app/layout.tsx and passed down, so the first render already knows
 * who the viewer is and what they have saved. There is no client-side
 * bootstrap for any of the three, so no signed-out flash, no empty-cart flash
 * and no hearts that fill in a beat late.
 */
export function ContextWrapper({
  children,
  initialUser = null,
  initialCart,
  initialWishlist,
}: {
  children: ReactNode;
  initialUser?: User | null;
  initialCart?: CartView;
  initialWishlist?: WishlistView;
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <WishlistProvider initialWishlist={initialWishlist}>
        <CartProvider initialCart={initialCart}>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
