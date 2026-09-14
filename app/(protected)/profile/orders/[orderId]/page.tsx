import { OrderDetailsClient } from "./OrderDetailsClient";
import { Order } from "@/types/order";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

async function getOrder(id: string): Promise<Order | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    
    const res = await fetch(`${protocol}://${host}/api/orders/${id}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch order");
    }
    const data = await res.json();
    return data.order;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
}

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
