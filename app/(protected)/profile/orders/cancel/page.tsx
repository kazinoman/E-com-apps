import { getActiveOrders } from "@/services/order.service";
import { CancelOrderCard } from "@/components/common/CancelOrderCard";

export default async function CancelOrdersPage() {
  const orders = await getActiveOrders();
  const cancellableOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "awaiting_payment"
  );

  return (
    <div className="bg-card rounded-3xl shadow-sm border border-border p-8 w-full min-h-full">
      <h1 className="text-2xl font-bold text-foreground mb-6">Cancel Orders</h1>
      
      {cancellableOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No orders found to cancel.
        </div>
      ) : (
        <div className="space-y-4">
          {cancellableOrders.map((order) => (
            <CancelOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
