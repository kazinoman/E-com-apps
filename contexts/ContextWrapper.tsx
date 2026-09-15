"use client";

import { ReactNode } from "react";

import { AuthProvider } from "./UserInfoContext";
import { WishlistProvider } from "./WishlistContext";
import { CartProvider } from "./CartContext";
import { Toaster } from "sonner";

export function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
