"use client";

import { useCart, CartItem } from "@/contexts/CartContext";
import Image from "next/image";
import { Trash2, Plus, Minus, CheckSquare } from "lucide-react";

export const CartItemList = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Group cart items by productId
  const groupedCart = cart.reduce((acc, item) => {
    const key = String(item.product.id);
    if (!acc[key]) {
      acc[key] = {
        product: item.product,
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { product: any; items: CartItem[] }>);

  return (
    <div className="space-y-6">
      {Object.values(groupedCart).map((group) => {
        const product = group.product;
        const totalItemsInGroup = group.items.reduce((sum, item) => sum + item.quantity, 0);
        const groupTotalValue = group.items.reduce((sum, item) => {
          const price = item.sku?.price ?? product.price;
          return sum + price * item.quantity;
        }, 0);

        return (
          <div key={product.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
            {/* Product Header row */}
            <div className="flex gap-4 p-5 border-b border-gray-100 dark:border-gray-800">
              {/* <div className="flex items-start pt-1">
                <CheckSquare className="w-5 h-5 text-[#E70B89] fill-[#E70B89]" />
              </div> */}
              <div className="relative w-[100px] h-[100px] flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{product.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Product Code: {product.id}</p>
              </div>
            </div>

            {/* Variants Rows */}
            <div className="bg-[#FDFDFD] dark:bg-gray-800/30">
              {group.items.map((item) => {
                const itemPrice = item.sku?.price ?? product.price;

                return (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 gap-4 md:gap-6 transition-colors">
                    <div className="flex-1 min-w-[200px]">
                      {item.sku ? (
                        <>
                          {item.sku.color && (
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              Color: <span className="font-normal text-gray-600 dark:text-gray-400">{item.sku.color}</span>
                            </p>
                          )}
                          {item.sku.sku && (
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              SKU: <span className="font-normal text-gray-600 dark:text-gray-400">{item.sku.sku}</span>
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Default Variant</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-y-4 gap-x-4 sm:gap-6 lg:gap-12 w-full md:w-auto mt-2 md:mt-0">
                      <div className="text-left sm:text-right whitespace-nowrap w-[45%] sm:w-auto">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.quantity} x <span className="line-through mr-1 opacity-60">৳{(item.product.originalPrice || itemPrice + 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="block sm:inline">৳{itemPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </p>
                      </div>

                      <div className="text-right whitespace-nowrap w-[45%] sm:w-auto sm:min-w-[80px]">
                        <p className="font-bold text-gray-900 dark:text-gray-100">৳{(item.quantity * itemPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>

                      <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-900 shrink-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 3}
                          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <span className="w-6 md:w-8 text-center text-sm font-medium text-gray-900 dark:text-gray-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-900/20 p-2 rounded-md shrink-0 ml-auto sm:ml-0"
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 text-sm font-semibold text-gray-800 dark:text-gray-200 border-t border-gray-100 dark:border-gray-800">
              <span>Item Summary</span>
              <span>{totalItemsInGroup} items</span>
              <span className="text-gray-900 dark:text-gray-100 text-base">৳{groupTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
