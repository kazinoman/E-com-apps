"use client";

import { Scale } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import { cn } from "@/lib/utils";

/**
 * Add/remove one product from the comparison tray.
 *
 * Shown signed out too: the backend keeps a guest tray against `compare_token`
 * exactly as it does for the cart and the wishlist. The 4-product cap is the
 * one thing a shopper can act on, so a full tray leaves the button live but
 * explains itself on click rather than going silently dead.
 */
export function CompareButton({
  productId,
  className,
  withLabel = false,
}: {
  productId: string | number;
  className?: string;
  withLabel?: boolean;
}) {
  const { isInCompare, toggleCompare, isFull, isPending } = useCompare();
  const active = isInCompare(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleCompare(productId);
      }}
      disabled={isPending}
      aria-pressed={active}
      title={active ? "Remove from comparison" : isFull ? "Comparison is full" : "Add to comparison"}
      className={cn(
        "flex items-center gap-2 text-[13px] font-bold transition-colors disabled:opacity-50",
        active ? "text-[#4A85F6]" : "text-[#8C93A3] hover:text-[#333333] dark:hover:text-white",
        className,
      )}
    >
      <Scale className="w-4 h-4" />
      {withLabel ? (active ? "In comparison" : "Compare") : null}
    </button>
  );
}
