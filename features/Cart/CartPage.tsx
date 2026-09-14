"use client";

import { useCart } from "@/contexts/CartContext";
import { Container } from "@/components/common/Container";
import { CartItemList } from "./components/CartItemList";
import { CartSummary } from "./components/CartSummary";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CartPage = () => {
  const { cart, cartItemCount } = useCart();

  return (
    <main className="min-h-screen py-12 bg-white dark:bg-gray-950 transition-colors">
      <Container>
        <h1 className="text-2xl font-bold text-[#1C244B] dark:text-white mb-8">
          My cart <span className="text-[#6B7280] dark:text-gray-400 font-normal text-xl">({cartItemCount} Items)</span>
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-6 transition-colors">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">Looks like you haven't added anything to your cart yet. Discover great products on our store.</p>
            <Link href="/">
              <Button className="bg-[#E70B89] hover:bg-[#c90a78] text-white px-8 h-12 text-base font-medium">
                START SHOPPING
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:flex-1">
              <CartItemList />

              <div className="flex justify-end mt-6">
                <Link href="/">
                  <Button variant="outline" className="h-12 px-6 border-slate-300 dark:border-gray-700 text-[#1C244B] dark:text-white font-bold tracking-wide rounded-sm hover:bg-slate-50 dark:hover:bg-gray-800 dark:hover:text-white transition-colors">
                    CONTINUE SHOPPING
                  </Button>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-[380px] xl:w-[420px]">
              <CartSummary />
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};
