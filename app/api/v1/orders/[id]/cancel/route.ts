// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, fail, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";
import { getOrdersData, updateOrderStatus, transformOrder } from "@/lib/mock/store-orders";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const rawOrders = await getOrdersData();
  const rawOrder = rawOrders.find((o: any) => transformOrder(o).id === id);

  if (!rawOrder) {
    return fail("Order not found", "ORDER_NOT_FOUND", 404);
  }

  await updateOrderStatus(id, "cancelled");

  const updatedOrders = await getOrdersData();
  const updatedOrder = updatedOrders.find((o: any) => transformOrder(o).id === id);

  return ok(transformOrder(updatedOrder), "Order cancelled successfully");
}
