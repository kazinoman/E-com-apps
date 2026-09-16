"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

const taka = (n: number) => `৳ ${n.toLocaleString()}`;

export const CartSummary = () => {
  const { cart, cartTotal, advancePct, advanceDueBdt, belowMinimum, minOrderBdt, cartItemCount, isPending } = useCart();
  const router = useRouter();

  // A line the catalog has dropped is priced off its snapshot and left out of
  // the subtotal; checkout would refuse it, so block here rather than there.
  const blocked = cart.some((item) => item.unavailable || item.belowMoq);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24 transition-colors">
      <h2 className="text-xl font-bold text-center text-[#1C244B] dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        Cart Summary
      </h2>

      <div className="space-y-4 mb-6 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Goods total</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{taka(cartTotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Freight</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 italic">Billed on delivery</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-gray-600 dark:text-gray-400">Advance ({advancePct}%)</span>
          <span className="font-bold text-base text-gray-900 dark:text-gray-100">{taka(advanceDueBdt)}</span>
        </div>
      </div>

      {belowMinimum && (
        <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
          Minimum order is {taka(minOrderBdt)}. Add more items to check out.
        </p>
      )}

      {blocked && (
        <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
          Fix the flagged items above before checking out.
        </p>
      )}

      <Button
        className="w-full bg-[#117C43] hover:bg-[#0e6336] text-white h-12 rounded-lg font-bold text-base tracking-wide shadow-md hover:shadow-lg transition-all"
        disabled={cartItemCount === 0 || blocked || belowMinimum || isPending}
        onClick={() => router.push('/checkout')}
      >
        Checkout
      </Button>
    </div>
  );
};
