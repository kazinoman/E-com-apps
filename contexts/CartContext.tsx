"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Sku } from "@/schemas/product";
import { toast } from "sonner";
import { useAuth } from "./UserInfoContext";
import { addCartItem, removeCartItem, syncCart, updateCartItem, getCart } from "@/services/cart.service";

export interface CartItem {
  id: string; // unique cart item id (e.g. productId_skuId)
  product: Product;
  sku?: Sku;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, sku?: Sku) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLogin, isAuthLoading } = useAuth();
  
  // Track if we just fetched from API to prevent immediate overwrite sync
  const [justSynced, setJustSynced] = useState(false);

  // Initial mount from localStorage
  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from local storage", error);
      }
    }
  }, []);

  // Sync on login: Fetch remote cart and merge with local cart (Option B)
  useEffect(() => {
    if (!isMounted || isAuthLoading) return;
    
    if (isLogin && user?.id) {
      const fetchApiCart = async () => {
        try {
          const res = await getCart(user.id);
          let remoteCart: CartItem[] = [];
          if (res?.cart && Array.isArray(res.cart)) {
            remoteCart = res.cart;
          }

          setCart((prevLocalCart) => {
            // If local cart is empty, just use remote cart
            if (prevLocalCart.length === 0) {
              setJustSynced(true);
              localStorage.setItem("cart", JSON.stringify(remoteCart));
              return remoteCart;
            }

            // Merge local and remote
            const mergedMap = new Map<string, CartItem>();
            
            // Add remote items first
            remoteCart.forEach(item => mergedMap.set(item.id, item));
            
            // Add local items (adding quantities if exists)
            prevLocalCart.forEach(localItem => {
              const existing = mergedMap.get(localItem.id);
              if (existing) {
                mergedMap.set(localItem.id, {
                  ...existing,
                  quantity: existing.quantity + localItem.quantity
                });
              } else {
                mergedMap.set(localItem.id, localItem);
              }
            });

            const mergedCart = Array.from(mergedMap.values());
            
            // Sync the merged result back to API
            syncCart(user.id, mergedCart).catch(err => console.error("Failed to sync merged cart", err));

            setJustSynced(true);
            localStorage.setItem("cart", JSON.stringify(mergedCart));
            return mergedCart;
          });

        } catch (error) {
          console.error("Failed to fetch API cart for merge", error);
        }
      };
      fetchApiCart();
    }
  }, [isLogin, user?.id, isMounted, isAuthLoading]);

  // Sync to Local Storage and API on cart change
  useEffect(() => {
    if (!isMounted) return;
    
    // Save to local storage always
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // If just synced from API, don't immediately push back
    if (justSynced) {
      setJustSynced(false);
      return;
    }

  }, [cart, isMounted, justSynced]);

  const addToCart = async (product: Product, quantity: number, sku?: Sku) => {
    const id = `${product.id}_${sku?.id || 'base'}`;
    const newItem: CartItem = { id, product, sku, quantity };
    
    // Optimistic UI Update
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, newItem];
      }
    });
    toast.success("Added to cart");

    // API Call
    if (isLogin && user?.id) {
      await addCartItem(user.id, newItem);
    }
  };

  const removeFromCart = async (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success("Removed from cart");
    
    if (isLogin && user?.id) {
      await removeCartItem(user.id, id);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    
    if (isLogin && user?.id) {
      await updateCartItem(user.id, id, quantity);
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (isLogin && user?.id) {
      await syncCart(user.id, []);
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((total, item) => {
    const price = item.sku?.price ?? item.product.price;
    return total + price * item.quantity;
  }, 0);

  // Avoid hydration mismatch by not rendering until mounted
  if (!isMounted) return null;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
