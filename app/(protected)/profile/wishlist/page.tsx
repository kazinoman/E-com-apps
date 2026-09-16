"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import type { WishlistLine } from "@/lib/types/wishlist";

/**
 * The saved list, rendered from the wishlist context.
 *
 * No fetch of its own: the wishlist is resolved on the server in
 * app/layout.tsx and handed to WishlistProvider, so the first HTML already
 * carries it. Removal goes through the same `toggleWishlist` the hearts use,
 * and the server's reply replaces the list wholesale.
 *
 * Nothing is defaulted. A line whose `priceBdt` is null shows no price and a
 * line whose `available` is false is shown as unavailable — both stay in the
 * list, because a saved product that quietly vanished is worse than one the
 * shopper can see has gone.
 */

/** Whole Taka — the backend is the only rounding boundary. */
const taka = (value: number | null) => (value === null ? null : `৳${value.toLocaleString()}`);

function formatSold(value: number | null) {
  if (!value) return null;
  if (value >= 1_000_000) return `${Math.floor(value / 1_000_000)}m+ sold`;
  if (value >= 1_000) return `${Math.floor(value / 1_000)}k+ sold`;
  return `${value} sold`;
}

function WishlistRow({
  item,
  onRemove,
  disabled,
}: {
  item: WishlistLine;
  onRemove: () => void;
  disabled: boolean;
}) {
  const price = taka(item.priceBdt);
  const sold = formatSold(item.salesCount);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F7FA] dark:bg-gray-800">
      <Link
        href={`/products/${item.productId}`}
        className="relative w-[84px] h-[84px] shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="84px"
            className="object-contain p-1.5"
          />
        ) : null}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productId}`}
          className="block text-[14px] font-bold text-[#333333] dark:text-white line-clamp-2 hover:text-[#4A85F6] transition-colors"
        >
          {item.title}
        </Link>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-[#8C93A3]">
          {item.moq === null ? null : <span>MOQ {item.moq} pcs</span>}
          {item.weightKg === null ? null : <span>{item.weightKg} kg</span>}
          {sold ? <span>{sold}</span> : null}
        </div>

        {item.available ? null : (
          <span className="inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FDECEC] dark:bg-red-950 text-[#E94B4B]">
            No longer available
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* A missing price is a missing price — no "—" standing in for a
            number the backend did not give us. */}
        {price ? (
          <span className="text-[15px] font-bold text-[#333333] dark:text-white">{price}</span>
        ) : null}

        <button
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Remove ${item.title} from wishlist`}
          className="text-[#8C93A3] hover:text-[#E94B4B] disabled:opacity-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { wishlist, isPending, toggleWishlist } = useWishlist();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 w-full min-h-full p-8">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[14px] font-medium text-[#8C93A3]">
          {wishlist.length === 1 ? "1 saved product" : `${wishlist.length} saved products`}
        </h2>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[15px] font-bold text-[#333333] dark:text-white mb-2">
            Nothing saved yet
          </p>
          <p className="text-[13px] text-[#8C93A3] mb-6">
            Tap the heart on any product and it will wait for you here.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#333333] hover:bg-black text-white px-6 py-3 rounded-lg text-[13px] font-bold transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <WishlistRow
              key={item.id}
              item={item}
              disabled={isPending}
              onRemove={() => toggleWishlist(item.productId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
