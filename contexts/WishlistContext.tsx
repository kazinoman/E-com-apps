"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./UserInfoContext";
import { fetchUserWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from "@/services/wishlist.service";
import { toast } from "sonner";

export type WishlistItem = {
  id: string | number;
  userId: string | number;
  productId: string | number;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (productId: string | number) => Promise<void>;
};

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isLogin, isAuthLoading } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    
    setIsLoading(true);
    const data = await fetchUserWishlist(user.id);
    setWishlist(Array.isArray(data) ? data : []);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading) {
      loadWishlist();
    }
  }, [isAuthLoading, loadWishlist]);

  const isInWishlist = (productId: string | number) => {
    return wishlist.some((item) => String(item.productId) === String(productId));
  };

  const toggleWishlist = async (productId: string | number) => {
    if (!isLogin || !user) {
      toast.error("Please login to add items to your wishlist.");
      return;
    }

    const existingItem = wishlist.find((item) => String(item.productId) === String(productId));

    if (existingItem) {
      // Optimistic UI update
      setWishlist((prev) => prev.filter((item) => item.id !== existingItem.id));
      const success = await apiRemoveFromWishlist(existingItem.id);
      
      if (success) {
        toast.success("Removed from wishlist");
      } else {
        // Revert on failure
        setWishlist((prev) => [...prev, existingItem]);
        toast.error("Failed to remove from wishlist");
      }
    } else {
      // Create temporary ID for optimistic UI
      const tempId = `temp-${Date.now()}`;
      const newItem = { id: tempId, userId: user.id, productId };
      
      setWishlist((prev) => [...prev, newItem]);
      const addedItem = await apiAddToWishlist(user.id, productId);
      
      if (addedItem) {
        // Replace temp item with real item from server
        setWishlist((prev) => prev.map((item) => (item.id === tempId ? addedItem : item)));
        toast.success("Added to wishlist");
      } else {
        // Revert on failure
        setWishlist((prev) => prev.filter((item) => item.id !== tempId));
        toast.error("Failed to add to wishlist");
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isLoading, isInWishlist, toggleWishlist }}>
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
