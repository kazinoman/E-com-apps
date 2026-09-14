"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

export const CartSummary = () => {
  const { cartTotal, cartItemCount } = useCart();

  const payNowAmount = cartTotal * 0.7;
  const payOnDeliveryAmount = cartTotal * 0.3;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24 transition-colors">
      <h2 className="text-xl font-bold text-center text-[#1C244B] dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        Cart Summary
      </h2>

      <div className="space-y-4 mb-6 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Product Price</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            ৳ {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Pay Now (70%)</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            ৳ {payNowAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-400">Pay on Delivery</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-right">
            ৳ {payOnDeliveryAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} + Shipping & Courier Charge
          </span>
        </div>
      </div>

      <Button
        className="w-full bg-[#117C43] hover:bg-[#0e6336] text-white h-12 rounded-lg font-bold text-base tracking-wide shadow-md hover:shadow-lg transition-all"
        disabled={cartItemCount === 0}
      >
        Checkout
      </Button>
    </div>
  );
};
