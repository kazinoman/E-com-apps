"use client";

import { useCart } from "@/contexts/CartContext";
import type { CartLine } from "@/lib/types/cart";
import Image from "next/image";
import { Trash2, Plus, Minus, AlertTriangle } from "lucide-react";

/** Taka is never fractional — the backend rounds at one boundary, so no decimals here. */
const taka = (n: number) => `৳${n.toLocaleString()}`;

/** `attributes` is opaque by contract: render what is there, assume nothing. */
function describe(attributes: unknown): string | null {
  if (!attributes || typeof attributes !== "object") return null;
  const entries = Object.entries(attributes as Record<string, unknown>).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );
  if (entries.length === 0) return null;
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join(" · ");
}

export const CartItemList = () => {
  const { cart, removeFromCart, updateQuantity, isPending } = useCart();

  // Lines of the same product sit together; a product can appear once per SKU.
  const grouped = cart.reduce((acc, item) => {
    (acc[item.productId] ??= []).push(item);
    return acc;
  }, {} as Record<string, CartLine[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([productId, items]) => {
        const head = items[0];
        const totalItemsInGroup = items.reduce((sum, item) => sum + item.quantity, 0);
        // Only the lines the server actually priced; an unavailable one is
        // excluded from the subtotal, so it must not be counted here either.
        const groupTotal = items.reduce(
          (sum, item) => sum + (item.unavailable ? 0 : item.lineTotalBdt),
          0,
        );

        return (
          <div key={productId} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
            <div className="flex gap-4 p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                {head.imageUrl && (
                  <Image
                    src={head.imageUrl}
                    alt={head.title}
                    fill
                    className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{head.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Product Code: {productId}</p>
              </div>
            </div>

            <div className="bg-[#FDFDFD] dark:bg-gray-800/30">
              {items.map((item) => {
                const variant = describe(item.attributes);
                const min = item.moq ?? 1;

                return (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 gap-4 md:gap-6 transition-colors">
                    <div className="flex-1 min-w-[200px] space-y-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {variant ?? "Default variant"}
                      </p>
                      {item.skuExternalId && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.skuExternalId}</p>
                      )}
                      {item.unavailable && (
                        <p className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          No longer available — remove it to check out.
                        </p>
                      )}
                      {item.priceChanged && (
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Price changed from {taka(item.priceChanged.previousUnitPriceBdt)}.
                        </p>
                      )}
                      {item.belowMoq && (
                        <p className="text-sm text-amber-600 dark:text-amber-400">
                          Minimum order quantity is {item.moq}.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-y-4 gap-x-4 sm:gap-6 lg:gap-12 w-full md:w-auto mt-2 md:mt-0">
                      <div className="text-left sm:text-right whitespace-nowrap w-[45%] sm:w-auto">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.quantity} x {taka(item.unitPriceBdt)}
                        </p>
                      </div>

                      <div className="text-right whitespace-nowrap w-[45%] sm:w-auto sm:min-w-[80px]">
                        <p className="font-bold text-gray-900 dark:text-gray-100">{taka(item.lineTotalBdt)}</p>
                      </div>

                      <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isPending || item.quantity <= min}
                          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <span className="w-6 md:w-8 text-center text-sm font-medium text-gray-900 dark:text-gray-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isPending}
                          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={isPending}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-900/20 p-2 rounded-md shrink-0 ml-auto sm:ml-0 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold text-gray-800 dark:text-gray-200 border-t border-gray-100 dark:border-gray-800">
              <span>Item Summary</span>
              <span>{totalItemsInGroup} items</span>
              <span className="text-gray-900 dark:text-gray-100 text-base">{taka(groupTotal)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
