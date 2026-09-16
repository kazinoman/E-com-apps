"use client";

import React, { createContext, useContext, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addCartItem,
  clearCart as clearCartAction,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.service";
import { EMPTY_CART, type CartLine, type CartResult, type CartView } from "@/lib/types/cart";

/**
 * Display state over the server cart.
 *
 * The provider holds no pricing logic of its own. Every mutation returns the
 * whole recomputed cart and that reply replaces the state wholesale, which is
 * the only way the MOQ adjustment, the tier price and the price-drift notice
 * can be right — the client cannot know any of them.
 *
 * `initialCart` is read on the server in app/layout.tsx, so the first HTML
 * already carries the real cart: no empty-then-populate flicker, and no
 * `if (!isMounted) return null` blanking the whole tree.
 */
interface CartContextType {
  cart: CartLine[];
  /** Subtotal in whole Taka, excluding freight. */
  cartTotal: number;
  /** Goods total (same as subtotal since freight is billed on delivery). */
  total: number;
  /** Advance percentage from the merchant — never hardcoded. */
  advancePct: number;
  /** Advance due at checkout. */
  advanceDueBdt: number;
  /** Minimum order value in Taka. */
  minOrderBdt: number;
  /** True when the cart total is below the merchant's minimum. */
  belowMinimum: boolean;
  cartItemCount: number;
  notice: CartView["notice"];
  isPending: boolean;
  addToCart: (productId: string | number, quantity: number, skuExternalId?: string | null) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({
  children,
  initialCart = EMPTY_CART,
}: {
  children: React.ReactNode;
  initialCart?: CartView;
}) => {
  const [view, setView] = useState<CartView>(initialCart);
  const [isPending, startTransition] = useTransition();

  /*
   * Mutations are independent round-trips, so two fast clicks can land out of
   * order and an older reply would otherwise overwrite a newer cart. Only the
   * newest issued request is allowed to apply its result.
   */
  const seq = useRef(0);

  const apply = (ticket: number, result: CartResult, successMessage?: string) => {
    if (ticket !== seq.current) return;
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setView(result.cart);
    // The server adjusted the request (quantity raised to the MOQ, say).
    // Telling the shopper is the point of the notice — swallowing it is how a
    // cart silently disagrees with what was clicked.
    if (result.cart.notice) toast.warning(result.cart.notice.message);
    else if (successMessage) toast.success(successMessage);

    const moved = result.cart.items.find((i) => i.priceChanged);
    if (moved) {
      toast.warning(
        `Price updated: "${moved.title}" is now ৳${moved.unitPriceBdt.toLocaleString()} (was ৳${moved.priceChanged!.previousUnitPriceBdt.toLocaleString()}).`,
      );
    }
  };

  const run = (fn: () => Promise<CartResult>, successMessage?: string) =>
    new Promise<void>((resolve) => {
      const ticket = ++seq.current;
      startTransition(async () => {
        apply(ticket, await fn(), successMessage);
        resolve();
      });
    });

  const addToCart = (
    productId: string | number,
    quantity: number,
    skuExternalId?: string | null,
  ) =>
    run(
      () =>
        addCartItem({
          productId: String(productId),
          skuExternalId: skuExternalId ?? null,
          quantity,
        }),
      "Added to cart",
    );

  const removeFromCart = (itemId: string) =>
    run(() => removeCartItem(itemId), "Removed from cart");

  const updateQuantity = (itemId: string, quantity: number) => {
    // The backend floors quantity at 1 and raises it to the MOQ; a 0 here
    // would just be a 400. Removal is its own call.
    if (quantity < 1) return Promise.resolve();
    return run(() => updateCartItem(itemId, quantity));
  };

  const clearCart = () => run(() => clearCartAction(), "Cart cleared");

  const refresh = async () => {
    const ticket = ++seq.current;
    const cart = await fetchCart();
    if (ticket === seq.current) setView(cart);
  };

  const cartItemCount = view.items.reduce((n, item) => n + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart: view.items,
        cartTotal: view.subtotalBdt,
        total: view.totalBdt,
        advancePct: view.advancePct,
        advanceDueBdt: view.advanceDueBdt,
        minOrderBdt: view.minOrderBdt,
        belowMinimum: view.belowMinimum,
        cartItemCount,
        notice: view.notice,
        isPending,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refresh,
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

export type { CartLine, CartView };
