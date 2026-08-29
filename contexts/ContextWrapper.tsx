"use client";

import { ReactNode } from "react";

import { AuthProvider } from "./UserInfoContext";
import { WishlistProvider } from "./WishlistContext";
import { Toaster } from "sonner";

export function ContextWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        {children}
        <Toaster position="top-center" />
      </WishlistProvider>
    </AuthProvider>
  );
}
