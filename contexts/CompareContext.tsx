"use client";

import { createContext, useContext, useRef, useState, useTransition, type ReactNode } from "react";
import { toast } from "sonner";
import {
  addToCompare as apiAdd,
  clearCompare as apiClear,
  fetchCompare,
  removeFromCompare as apiRemove,
} from "@/services/compare.service";
import {
  COMPARE_LIMIT_REACHED,
  EMPTY_COMPARE,
  type CompareResult,
  type CompareView,
} from "@/lib/types/compare";

/**
 * Server truth, same shape as CartContext and WishlistContext.
 *
 * The tray is resolved from cookies, so it works signed out — no login gate
 * and no user id anywhere. Every mutation returns the whole recomputed
 * comparison and that reply replaces state wholesale; nothing is patched
 * locally, so the spec-key union can never drift from the products it
 * describes.
 */

type CompareContextType = {
  items: CompareView["items"];
  /** Row list for the comparison table: the union of spec keys. */
  specKeys: string[];
  count: number;
  /** Hard cap the backend enforces (4). */
  limit: number;
  isFull: boolean;
  isPending: boolean;
  isInCompare: (productId: string | number) => boolean;
  toggleCompare: (productId: string | number) => Promise<void>;
  removeFromCompare: (productId: string | number) => Promise<void>;
  clearCompare: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({
  children,
  initialCompare = EMPTY_COMPARE,
}: {
  children: ReactNode;
  initialCompare?: CompareView;
}) {
  const [view, setView] = useState<CompareView>(initialCompare);
  const [isPending, startTransition] = useTransition();
  // Drops out-of-order replies from fast repeated clicks.
  const seq = useRef(0);

  const apply = (ticket: number, result: CompareResult, successMessage: string) => {
    if (ticket !== seq.current) return;
    if (!result.ok) {
      // The cap is the one failure a shopper can act on, so it is surfaced as
      // guidance rather than as a generic error.
      if (result.errorCode === COMPARE_LIMIT_REACHED) toast.warning(result.message);
      else toast.error(result.message);
      return;
    }
    setView(result.compare);
    toast.success(successMessage);
  };

  const run = (fn: () => Promise<CompareResult>, successMessage: string) =>
    new Promise<void>((resolve) => {
      const ticket = ++seq.current;
      startTransition(async () => {
        apply(ticket, await fn(), successMessage);
        resolve();
      });
    });

  const isInCompare = (productId: string | number) =>
    view.items.some((item) => item.productId === String(productId));

  const toggleCompare = (productId: string | number) => {
    const id = String(productId);
    if (isInCompare(id)) return run(() => apiRemove(id), "Removed from comparison");
    // Checked here as well as server-side so the shopper is told before a
    // round-trip; the backend is still the authority and answers 409.
    if (view.count >= view.limit) {
      toast.warning(`You can compare up to ${view.limit} products at a time`);
      return Promise.resolve();
    }
    return run(() => apiAdd(id), "Added to comparison");
  };

  const removeFromCompare = (productId: string | number) =>
    run(() => apiRemove(String(productId)), "Removed from comparison");

  const clearCompare = () => run(() => apiClear(), "Comparison cleared");

  const refresh = async () => {
    setView(await fetchCompare());
  };

  return (
    <CompareContext.Provider
      value={{
        items: view.items,
        specKeys: view.specKeys,
        count: view.count,
        limit: view.limit,
        isFull: view.count >= view.limit,
        isPending,
        isInCompare,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        refresh,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
