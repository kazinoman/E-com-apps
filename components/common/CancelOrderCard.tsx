"use client";

import { Order, statusLabel, taka } from "@/types/order";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { cancelOrder } from "@/services/order.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CancelOrderCardProps {
  order: Order;
}

export function CancelOrderCard({ order }: CancelOrderCardProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-[#E3F9ED] text-[#22C55E]";
      case "cancelled":
      case "refunded":
        return "bg-[#FEE2E2] text-[#EF4444]";
      default:
        return "bg-[#E6F0FF] text-[#3B82F6]";
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  
  const formattedTime = new Date(order.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();

  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCancel = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setIsCancelling(true);
    const result = await cancelOrder(order.id);
    
    if (result.ok) {
      toast.success("Order cancelled successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to cancel order");
      setIsCancelling(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="bg-muted rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[14px] text-[#8C93A3] font-medium">
              <CalendarIcon className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="text-[15px] font-bold text-foreground">
              Order <span className="text-foreground">{order.orderNo}</span>
            </div>
          </div>
          
          <div className="space-y-2 text-right">
            <div className="flex items-center justify-end gap-2 text-[14px] text-[#8C93A3] font-medium">
              <ClockIcon className="w-4 h-4" />
              <span>{formattedTime}</span>
            </div>
            <div className="text-[14px] text-[#333333] dark:text-gray-300 font-bold">
              {totalItems} items
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1.5 rounded-md text-[13px] font-bold ${getStatusColor(order.status)}`}>
            {statusLabel(order.status)}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[18px] font-black text-foreground">
              {taka(order.grandTotalBdt)}
            </div>
            {confirming && (
              <button
                onClick={() => setConfirming(false)}
                disabled={isCancelling}
                className="px-4 py-1.5 bg-muted text-[13px] font-bold rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Keep order
              </button>
            )}
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="px-4 py-1.5 bg-[#FEE2E2] text-[#EF4444] text-[13px] font-bold rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              {isCancelling ? "Cancelling..." : confirming ? "Confirm cancel" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
