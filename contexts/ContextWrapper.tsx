"use client";

import { ReactNode } from "react";

import { AuthProvider, type User } from "./UserInfoContext";
import type { CartView } from "@/lib/types/cart";
import type { WishlistView } from "@/lib/types/wishlist";
import type { CompareView } from "@/lib/types/compare";
import { WishlistProvider } from "./WishlistContext";
import { CartProvider } from "./CartContext";
import { CompareProvider } from "./CompareContext";
import { Toaster } from "sonner";

/**
 * `initialUser`, `initialCart`, `initialWishlist` and `initialCompare` are
 * resolved on the server in app/layout.tsx and passed down, so the first
 * render already knows who the viewer is and what they have saved. There is no
 * client-side bootstrap for any of them, so no signed-out flash, no empty-cart
 * flash and no hearts that fill in a beat late.
 */
export function ContextWrapper({
  children,
  initialUser = null,
  initialCart,
  initialWishlist,
  initialCompare,
}: {
  children: ReactNode;
  initialUser?: User | null;
  initialCart?: CartView;
  initialWishlist?: WishlistView;
  initialCompare?: CompareView;
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <WishlistProvider initialWishlist={initialWishlist}>
        <CompareProvider initialCompare={initialCompare}>
          <CartProvider initialCart={initialCart}>
            {children}
            <Toaster position="bottom-right" />
          </CartProvider>
        </CompareProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
