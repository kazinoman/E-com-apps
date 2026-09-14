import { OrderDetailsClient } from "./OrderDetailsClient";
import { Order } from "@/types/order";
import { getOrder } from "@/services/order.service";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) {
    notFound();
  }

  return <OrderDetailsClient order={order} />;
}
