import Link from "next/link";
import { Order } from "@/types/order";
import { CalendarIcon, ClockIcon } from "lucide-react";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
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

  return (
    <Link href={`/profile/orders/${order.id}`} className="block mb-4">
      <div className="bg-[#F7F7FA] dark:bg-gray-800 rounded-2xl p-6 transition-transform hover:-translate-y-0.5 hover:shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[14px] text-[#8C93A3] font-medium">
              <CalendarIcon className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="text-[15px] font-bold text-[#333333] dark:text-white">
              Order Id <span className="text-[#333333] dark:text-white">#{order.id.replace('ORD-', '')}</span>
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
            {order.status}
          </div>
          <div className="text-[18px] font-black text-[#333333] dark:text-white">
            ${order.totals.total.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}
