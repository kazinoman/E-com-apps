"use client";

import { ReactNode } from "react";

import { AuthProvider, type User } from "./UserInfoContext";
import type { CartView } from "@/lib/types/cart";
import { WishlistProvider } from "./WishlistContext";
import { CartProvider } from "./CartContext";
import { Toaster } from "sonner";

/**
 * `initialUser` and `initialCart` are resolved on the server in app/layout.tsx
 * and passed down, so the first render already knows who the viewer is and
 * what is in their cart. There is no client-side auth bootstrap, no signed-out
 * flash and no empty-cart flash.
 */
export function ContextWrapper({
  children,
  initialUser = null,
  initialCart,
}: {
  children: ReactNode;
  initialUser?: User | null;
  initialCart?: CartView;
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <WishlistProvider>
        <CartProvider initialCart={initialCart}>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
