"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Stars, in the two forms this feature needs.
 *
 * Read-only display rounds DOWN to whole stars and prints the number beside
 * them, so a 4.6 never reads as a 5. Nothing here invents a value: the callers
 * only render it when there is a real rating to show.
 *
 * The filled colour matches `ProductInfo` / `ProductCard` (`orange-400` /
 * `#FFB800` respectively — the PDP uses orange-400).
 */

export function ReviewStars({
  rating,
  className,
  size = "sm",
}: {
  rating: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const px = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            px,
            i <= Math.floor(rating)
              ? "fill-orange-400 text-orange-400"
              : "fill-transparent text-slate-300 dark:text-gray-600",
          )}
        />
      ))}
    </span>
  );
}

/**
 * The write control. Five buttons, not a slider: the backend takes an integer
 * 1–5 and nothing else, so half stars would be a lie the API cannot store.
 * `value` of 0 means "nothing picked yet", which the form treats as invalid.
 */
export function ReviewStarsInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          aria-pressed={value === i}
          className="p-1 rounded-md transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Star
            className={cn(
              "w-7 h-7",
              i <= value
                ? "fill-orange-400 text-orange-400"
                : "fill-transparent text-slate-300 dark:text-gray-600",
            )}
          />
        </button>
      ))}
    </div>
  );
}
