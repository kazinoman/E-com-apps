import { OrderTabs } from "@/components/common/OrderTabs";
import { OrderCard } from "@/components/common/OrderCard";
import { Order } from "@/types/order";
import { headers } from "next/headers";

async function getActiveOrders(): Promise<Order[]> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    
    const res = await fetch(`${protocol}://${host}/api/orders?status=active`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }
    const data = await res.json();
    return data.orders || [];
  } catch (error) {
    console.error("Error fetching active orders:", error);
    return [];
  }
}

export default async function ActiveOrdersPage() {
  const orders = await getActiveOrders();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 w-full min-h-full">
      <OrderTabs />
      
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No active orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
