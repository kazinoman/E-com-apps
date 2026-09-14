"use client";

import { useState } from "react";
import Image from "next/image";
import { Order, OrderItem } from "@/types/order";
import { TrackOrderModal } from "@/components/common/TrackOrderModal";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderDetailsClientProps {
  order: Order;
}

export function OrderDetailsClient({ order }: OrderDetailsClientProps) {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [expandedSeller, setExpandedSeller] = useState<string | null>(null);

  // Group items by seller
  const itemsBySeller = order.items.reduce((acc, item) => {
    const seller = item.seller || "Default Seller";
    if (!acc[seller]) acc[seller] = [];
    acc[seller].push(item);
    return acc;
  }, {} as Record<string, OrderItem[]>);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-[#E3F9ED] text-[#22C55E]";
      case "canceled":
        return "bg-[#FEE2E2] text-[#EF4444]";
      case "in progress":
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
        <Link href="/profile/orders/active" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </Link>
        <h1 className="text-xl font-bold text-[#333333] dark:text-white flex-1 text-center">Order Details</h1>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      <div className="text-center mb-8">
        <div className="text-[14px] text-[#8C93A3] font-medium mb-1">Order Id</div>
        <div className="text-[16px] font-bold text-[#333333] dark:text-white">#{order.id.replace('ORD-', '')}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Ordered Items */}
        <div>
          <h3 className="text-[14px] font-medium text-[#8C93A3] text-center mb-4">Ordered Items</h3>
          
          <div className="space-y-4">
            {Object.entries(itemsBySeller).map(([seller, items], idx) => {
              const isExpanded = expandedSeller === seller || Object.keys(itemsBySeller).length === 1 || idx === 0;
              const sellerTotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
              const sellerItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

              return (
                <div key={seller} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 overflow-hidden">
                  <div 
                    className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => setExpandedSeller(isExpanded ? null : seller)}
                  >
                    <div>
                      <div className="text-[13px] text-[#8C93A3] font-medium mb-1">Seller : <span className="text-[#333333] dark:text-white font-bold">{seller}</span></div>
                      <div className={`px-2 py-1 rounded text-[11px] font-bold inline-block ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[12px] font-bold text-[#8C93A3] mb-1">{sellerItemsCount} items</div>
                        <div className="text-[14px] font-bold text-[#333333] dark:text-white">${sellerTotal.toFixed(2)}</div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start">
                          <div>
                            <div className="text-[13px] font-bold text-[#333333] dark:text-white">{item.product.title}</div>
                            <div className="text-[12px] font-medium text-[#8C93A3]">{item.quantity} x ${item.product.price.toFixed(2)}</div>
                          </div>
                          <div className="text-[13px] font-bold text-[#333333] dark:text-white">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 flex gap-3">
                        <button 
                          onClick={() => setIsTrackModalOpen(true)}
                          className="flex-1 bg-[#333333] dark:bg-white text-white dark:text-[#333333] py-2.5 rounded-lg text-[13px] font-bold transition-transform hover:-translate-y-0.5"
                        >
                          Track your order
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-[#F7F7FA] dark:bg-gray-800 text-[#333333] dark:text-white py-2.5 rounded-lg text-[13px] font-bold transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                          Give Seller Ratings
                        </button>
                        <button className="flex-1 bg-[#F7F7FA] dark:bg-gray-800 text-[#333333] dark:text-white py-2.5 rounded-lg text-[13px] font-bold transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                          Leave items review
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Summary & Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-[14px] font-medium text-[#8C93A3] text-center mb-4">Order summary</h3>
            <div className="bg-[#F7F7FA] dark:bg-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[14px] font-medium text-[#333333] dark:text-white">Total items</span>
                <span className="text-[14px] font-bold text-[#333333] dark:text-white">{order.items.reduce((a, b) => a + b.quantity, 0)}</span>
              </div>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-[#8C93A3]">Sub total</span>
                  <span className="text-[14px] font-bold text-[#8C93A3]">${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-[#8C93A3]">Shipping cost</span>
                  <span className="text-[14px] font-bold text-[#8C93A3]">${order.totals.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-[#8C93A3]">Discount</span>
                  <span className="text-[14px] font-bold text-[#EF4444]">-${order.totals.discount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[16px] font-bold text-[#333333] dark:text-white">Total</span>
                <span className="text-[18px] font-black text-[#333333] dark:text-white">${order.totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-medium text-[#8C93A3] text-center mb-4">Order info</h3>
            <div className="bg-[#F7F7FA] dark:bg-gray-800 rounded-2xl p-6 space-y-5">
              
              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Order Id</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">#{order.id.replace('ORD-', '')}</div>
              </div>
              
              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Date</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{formattedDate}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Phone number</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.customer.phone}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Email</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.customer.email}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Delivery type</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.payment.deliveryType}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Delivery Address</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.customer.deliveryAddress}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Billing Address</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.customer.billingAddress}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Payment method</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.payment.paymentMethod}</div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-[#333333] dark:text-white mb-1">Order Note</div>
                <div className="text-[13px] font-medium text-[#8C93A3]">{order.customer.orderNote || "No note provided."}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <TrackOrderModal 
        isOpen={isTrackModalOpen} 
        onClose={() => setIsTrackModalOpen(false)} 
        timeline={order.timeline || []} 
      />
    </div>
  );
}
