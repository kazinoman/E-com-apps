import { OrderTabs } from "@/components/common/OrderTabs";
import { OrderCard } from "@/components/common/OrderCard";
import { Order } from "@/types/order";
import { getHistoryOrders } from "@/services/order.service";

export default async function HistoryOrdersPage() {
  const orders = await getHistoryOrders();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 w-full min-h-full">
      <OrderTabs />
      
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No completed orders found.
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
