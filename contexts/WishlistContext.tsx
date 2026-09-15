"use client";

import { createContext, useContext, useState, useTransition, ReactNode, useRef } from "react";
import {
  addToWishlist as apiAdd,
  removeFromWishlist as apiRemove,
  fetchWishlist,
} from "@/services/wishlist.service";
import { EMPTY_WISHLIST, type WishlistResult, type WishlistView } from "@/lib/types/wishlist";
import { toast } from "sonner";

/**
 * Server truth, same shape as CartContext.
 *
 * The wishlist is resolved from cookies, so it works signed out — there is no
 * login gate here and no user id anywhere. Every mutation returns the whole
 * list and that reply replaces state wholesale; nothing is patched locally, so
 * the UI cannot drift from the server.
 */

type WishlistContextType = {
  wishlist: WishlistView["items"];
  isPending: boolean;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (productId: string | number) => Promise<void>;
  refresh: () => Promise<void>;
};

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({
  children,
  initialWishlist = EMPTY_WISHLIST,
}: {
  children: ReactNode;
  initialWishlist?: WishlistView;
}) {
  const [view, setView] = useState<WishlistView>(initialWishlist);
  const [isPending, startTransition] = useTransition();
  // Drops out-of-order replies from fast repeated clicks on the same heart.
  const seq = useRef(0);

  const apply = (ticket: number, result: WishlistResult, successMessage: string) => {
    if (ticket !== seq.current) return;
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setView(result.wishlist);
    toast.success(successMessage);
  };

  const run = (fn: () => Promise<WishlistResult>, successMessage: string) =>
    new Promise<void>((resolve) => {
      const ticket = ++seq.current;
      startTransition(async () => {
        apply(ticket, await fn(), successMessage);
        resolve();
      });
    });

  const isInWishlist = (productId: string | number) =>
    view.items.some((item) => item.productId === String(productId));

  const toggleWishlist = (productId: string | number) => {
    const id = String(productId);
    return isInWishlist(id)
      ? run(() => apiRemove(id), "Removed from wishlist")
      : run(() => apiAdd(id), "Added to wishlist");
  };

  const refresh = async () => {
    const next = await fetchWishlist();
    setView(next);
  };

  return (
    <WishlistContext.Provider value={{ wishlist: view.items, isPending, isInWishlist, toggleWishlist, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
