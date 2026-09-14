"use server";

import { Order } from "@/types/order";
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "http://localhost:3000/api";

export async function getActiveOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders?status=active`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch active orders");
    }
    const data = await res.json();
    return data.orders || [];
  } catch (error) {
    console.error("Error fetching active orders:", error);
    return [];
  }
}

export async function getHistoryOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders?status=history`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch history orders");
    }
    const data = await res.json();
    return data.orders || [];
  } catch (error) {
    console.error("Error fetching history orders:", error);
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
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

export async function createOrder(orderData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error creating order:", error);
    return { ok: false, data: { error: "An error occurred. Please try again." } };
  }
}
