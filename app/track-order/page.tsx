"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { trackPublicOrder } from "@/services/order.service";
import { FEATURES } from "@/lib/api/features";
import { OrderDetailsClient } from "@/app/(protected)/profile/orders/[orderId]/OrderDetailsClient";
import { Order } from "@/types/order";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/contexts/UserInfoContext";
import { TrackOrderForm } from "@/components/common/TrackOrderForm";

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const { isLogin } = useAuth();

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
      <div className="bg-zinc-50 font-sans dark:bg-background min-h-screen flex flex-col">
        <div className="py-8 flex-1">
          <Container className="">
            <button
              onClick={() => setOrder(null)}
              className="mb-6 text-[14px] font-medium text-[#4A85F6] hover:underline"
            >
              ← Track another order
            </button>
            <OrderDetailsClient
              order={order}
              onBack={() => setOrder(null)}
            />
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 font-sans dark:bg-background min-h-screen flex flex-col">
      <div className="py-8 sm:py-12 flex justify-center px-4 flex-1">
        <div className="w-full max-w-[500px] bg-card rounded-3xl shadow-sm border border-border p-8 sm:p-12 relative flex flex-col items-center">
          <h1 className="text-[20px] font-bold text-foreground mb-8">Track Order</h1>

          <div className="flex justify-center mb-10 w-full relative h-[160px] sm:h-[180px]">
            <Image
              src="/images/track-order-illustration.png"
              alt="Track Order Illustration"
              fill
              className="object-contain"
            />
          </div>

          <div className="w-full">
            <TrackOrderForm onTrack={handleTrack} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
