"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getOrder } from "@/services/order.service";
import { Order, taka } from "@/types/order";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const orderData = await getOrder(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          setError("Order not found");
        }
      } catch {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C244B] dark:border-white"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-500">Oops!</h2>
        <p className="text-gray-600 dark:text-gray-400">{error || "Something went wrong."}</p>
        <Link href="/">
          <Button className="bg-[#1C244B] text-white">Return to Home</Button>
        </Link>
      </div>
    );
  }

  const { items } = order;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
      <header className="py-6 mb-8 text-center">
        <h1 className="text-[18px] font-bold text-[#1C244B] dark:text-white">Order Confirmation</h1>
      </header>

      <Container className="max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <div className="relative inline-flex items-center justify-center">
            <Image 
              src="/order-success-icon.png" 
              alt="Order Success" 
              width={160} 
              height={120} 
              className="object-contain drop-shadow-sm dark:brightness-90"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1C244B] dark:text-white">Thanks for your order!</h2>
            <p className="text-[14px] text-[#8C93A3]">
              Your order <span className="font-semibold text-gray-700 dark:text-gray-300">{order.orderNo}</span> has been placed successfully.<br />
              Please be patient while we confirm your order.
            </p>
          </div>
        </div>

        <div className="mb-6 text-center lg:text-left">
          <h3 className="text-[14px] font-semibold text-[#8C93A3] border-b border-gray-100 dark:border-gray-800 pb-2 inline-block">Order summary</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items List */}
          <div className="flex-1 bg-[#F9FAFB] dark:bg-gray-900 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
              <span className="font-semibold text-[14px] text-gray-800 dark:text-gray-200">
                Total items <span className="text-[#8C93A3] font-normal">({totalItems} items)</span>
              </span>
              <span className="font-bold text-[15px] text-[#1C244B] dark:text-white">
                {taka(order.itemsTotalBdt)}
              </span>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-[14px] font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
                    <p className="text-[13px] text-[#8C93A3] mt-1">
                      {item.quantity} × {taka(item.unitPriceBdt)}
                    </p>
                  </div>
                  <span className="text-[14px] font-medium text-[#1C244B] dark:text-white whitespace-nowrap">
                    {taka(item.lineTotalBdt)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="w-full lg:w-[350px]">
            <div className="bg-[#F9FAFB] dark:bg-gray-900 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 border-dashed dark:border-gray-800">
                <span className="text-[14px] font-medium text-[#1C244B] dark:text-white">Total items</span>
                <span className="text-[14px] font-medium text-[#1C244B] dark:text-white">{totalItems}</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#8C93A3]">Goods total</span>
                  <span className="text-[14px] text-[#8C93A3]">{taka(order.itemsTotalBdt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#8C93A3]">Freight</span>
                  <span className="text-[14px] text-[#8C93A3] italic">On delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#8C93A3]">Advance ({order.advancePct}%)</span>
                  <span className="text-[14px] font-semibold text-[#1C244B] dark:text-white">{taka(order.advanceDueBdt)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
                <span className="text-[16px] font-bold text-[#1C244B] dark:text-white">Advance paid</span>
                <span className="text-[18px] font-bold text-[#1C244B] dark:text-white">{taka(order.advanceDueBdt)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href={`/profile/orders/${order.id}`} className="text-[13px] font-semibold text-[#1C244B] dark:text-white border-b border-[#1C244B] dark:border-white pb-0.5 hover:opacity-80 transition-opacity">
                See order details
              </Link>
              <Link href="/">
                <Button className="px-6 bg-[#333333] hover:bg-black text-white font-medium text-[14px]">
                  Continue shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
