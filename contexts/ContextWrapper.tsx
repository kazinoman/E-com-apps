"use client";

import { ReactNode } from "react";

import { AuthProvider, type User } from "./UserInfoContext";
import { WishlistProvider } from "./WishlistContext";
import { CartProvider } from "./CartContext";
import { Toaster } from "sonner";

/**
 * `initialUser` is resolved on the server in app/layout.tsx and passed down,
 * so the first render already knows who the viewer is. There is no
 * client-side auth bootstrap and no signed-out flash.
 */
export function ContextWrapper({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <WishlistProvider>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
