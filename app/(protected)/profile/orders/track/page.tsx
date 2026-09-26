"use client";

import { useState } from "react";
import Image from "next/image";
import { trackPublicOrder } from "@/services/order.service";
import { OrderDetailsClient } from "@/app/(protected)/profile/orders/[orderId]/OrderDetailsClient";
import { Order } from "@/types/order";
import { toast } from "sonner";
import { TrackOrderForm } from "@/components/common/TrackOrderForm";

export default function ProfileTrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = async (phoneStr: string, orderIdStr: string) => {
    if (!phoneStr || !orderIdStr) {
      toast.error("Please enter both phone number and order ID.");
      return;
    }
    
    setIsLoading(true);
    const res = await trackPublicOrder(phoneStr, orderIdStr);
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
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 w-full min-h-full flex flex-col p-8">
        <button 
          onClick={() => setOrder(null)} 
          className="mb-6 text-[14px] font-medium text-[#4A85F6] hover:underline self-start"
        >
          ← Track another order
        </button>
        <OrderDetailsClient 
          order={order} 
          onBack={() => setOrder(null)} 
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 w-full min-h-full flex flex-col items-center p-8 sm:p-12">
      <h1 className="text-[20px] font-bold text-[#333333] dark:text-white mb-8">Track Order</h1>
      
      <div className="flex justify-center mb-10 w-full relative h-[160px] sm:h-[180px]">
        <Image 
          src="/images/track-order-illustration.png" 
          alt="Track Order Illustration" 
          fill
          className="object-contain"
        />
      </div>

      <div className="w-full max-w-[500px]">
        <TrackOrderForm onTrack={handleTrack} isLoading={isLoading} />
      </div>
    </div>
  );
}
