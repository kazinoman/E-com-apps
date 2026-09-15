"use client";

import { useState } from "react";
import Image from "next/image";
import { Order, statusLabel, taka } from "@/types/order";
import { TrackOrderModal } from "@/components/common/TrackOrderModal";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderDetailsClientProps {
  order: Order;
  backUrl?: string;
  onBack?: () => void;
}

export function OrderDetailsClient({ order, backUrl = "/profile/orders/active", onBack }: OrderDetailsClientProps) {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  // No seller grouping: this is a single-merchant storefront. Every line on an
  // order comes from us.
  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  const shipTo = [
    order.shipLine1,
    order.shipLine2,
    order.shipCity,
    order.shipDistrict,
    order.shipPostcode,
  ]
    .filter(Boolean)
    .join(", ");

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
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 w-full min-h-full">
      <div className="flex items-center gap-4 mb-8">
        {onBack ? (
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        ) : (
          <Link href={backUrl} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
        )}
        <h1 className="text-xl font-bold text-[#333333] dark:text-white flex-1 text-center">Order Details</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <div className="text-center mb-8">
        <div className="text-[14px] text-[#8C93A3] font-medium mb-1">Order</div>
        <div className="text-[16px] font-bold text-[#333333] dark:text-white">{order.orderNo}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Ordered Items */}
        <div>
          <h3 className="text-[14px] font-medium text-[#8C93A3] text-center mb-4">Ordered Items</h3>
          
          <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className={`px-2 py-1 rounded text-[11px] font-bold inline-block ${getStatusColor(order.status)}`}>
                {statusLabel(order.status)}
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold text-[#8C93A3] mb-1">{totalItems} items</div>
                <div className="text-[14px] font-bold text-[#333333] dark:text-white">{taka(order.itemsTotalBdt)}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-[13px] font-bold text-[#333333] dark:text-white">{item.title}</div>
                    <div className="text-[12px] font-medium text-[#8C93A3]">
                      {item.quantity} × {taka(item.unitPriceBdt)}
                    </div>
                  </div>
                  <div className="text-[13px] font-bold text-[#333333] dark:text-white whitespace-nowrap">
                    {taka(item.lineTotalBdt)}
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <button
                  onClick={() => setIsTrackModalOpen(true)}
                  className="w-full bg-[#333333] dark:bg-white text-white dark:text-[#333333] py-2.5 rounded-lg text-[13px] font-bold transition-transform hover:-translate-y-0.5"
                >
                  Track your order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-[14px] font-medium text-[#8C93A3] text-center mb-4">Order summary</h3>
            <div className="bg-[#F7F7FA] dark:bg-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[14px] font-medium text-[#333333] dark:text-white">Total items</span>
                <span className="text-[14px] font-bold text-[#333333] dark:text-white">{totalItems}</span>
              </div>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-[#8C93A3]">Sub total</span>
                  <span className="text-[14px] font-bold text-[#8C93A3]">{taka(order.itemsTotalBdt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-[#8C93A3]">Delivery</span>
                  <span className="text-[14px] font-bold text-[#8C93A3]">{taka(order.shippingBdt)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[16px] font-bold text-[#333333] dark:text-white">Total</span>
                <span className="text-[18px] font-black text-[#333333] dark:text-white">{taka(order.grandTotalBdt)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-medium text-[#8C93A3] text-center mb-4">Order info</h3>
            <div className="bg-[#F7F7FA] dark:bg-gray-800 rounded-2xl p-6 space-y-5">
              
              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Order number</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.orderNo}</div>
              </div>
              
              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Date</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{formattedDate}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Phone number</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.shipPhone}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Deliver to</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.shipName} — {shipTo}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Payment method</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">
                  {order.paymentMethod === "cod" ? "Cash on delivery" : "Online payment"}
                </div>
              </div>

              {order.trackingNumber && (
                <div>
                  <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Tracking</div>
                  <div className="text-[13px] font-medium text-[#8C93A3]">
                    {order.shippingCarrier ? `${order.shippingCarrier} — ` : ""}
                    {order.trackingUrl ? (
                      <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="underline">
                        {order.trackingNumber}
                      </a>
                    ) : (
                      order.trackingNumber
                    )}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Order note</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.notes || "No note provided."}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <TrackOrderModal 
        isOpen={isTrackModalOpen} 
        onClose={() => setIsTrackModalOpen(false)} 
        history={order.history ?? []}
        paymentMethod={order.paymentMethod}
      
      />
    </div>
  );
}
