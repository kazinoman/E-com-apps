"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { trackPublicOrder } from "@/services/order.service";
import { OrderDetailsClient } from "@/app/(protected)/profile/orders/[orderId]/OrderDetailsClient";
import { Order } from "@/types/order";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !orderId) {
      toast.error("Please enter both phone number and order ID.");
      return;
    }
    
    setIsLoading(true);
    const res = await trackPublicOrder(phone, orderId);
    setIsLoading(false);

    if (res.ok && res.data) {
      setOrder(res.data);
      toast.success("Order found!");
    } else {
      toast.error(res.error || "Order not found. Please check your details.");
    }
  };

  if (order) {
    return (
      <div className="bg-[#F8F9FA] dark:bg-black min-h-screen py-8">
        <Container className="max-w-4xl">
          <OrderDetailsClient 
            order={order} 
            onBack={() => setOrder(null)} 
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FA] dark:bg-black min-h-screen py-8 sm:py-12 flex justify-center px-4">
      <div className="w-full max-w-[500px] bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-12 relative flex flex-col items-center">
        <h1 className="text-[20px] font-bold text-[#333333] dark:text-white mb-8">Track Order</h1>
        
        <div className="flex justify-center mb-10 w-full relative h-[160px] sm:h-[180px]">
          <Image 
            src="/images/track-order-illustration.png" 
            alt="Track Order Illustration" 
            fill
            className="object-contain"
          />
        </div>

        <div className="w-full">
          <h2 className="text-[22px] font-bold text-[#333333] dark:text-white mb-2">Track your order</h2>
          <p className="text-[14px] text-[#8C93A3] mb-8 leading-relaxed">
            Enter your phone number and order id to get the latest update on your order status
          </p>

          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Phone number</label>
              <input 
                type="text" 
                placeholder="+880 - 1234567890" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Order Id</label>
              <input 
                type="text" 
                placeholder="e.g. #123456789" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#333333] dark:bg-white text-white dark:text-[#333333] rounded-xl py-4 text-[15px] font-bold mt-2 hover:bg-black dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track your order"}
            </button>
          </form>

          <div className="text-center mt-8 text-[13px] text-[#8C93A3]">
            Facing some difficulties, please visit <Link href="/contact" className="font-bold text-[#333333] dark:text-white hover:underline">Contact us</Link> page.
          </div>
        </div>
      </div>
    </div>
  );
}
