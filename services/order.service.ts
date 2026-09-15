"use server";

import { Order } from "@/types/order";
import { orders as ordersUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";

export async function getActiveOrders(): Promise<Order[]> {
  try {
    const res = await api.get(ordersUrls.active);
    return res.data?.orders || [];
  } catch (error) {
    console.error("Error fetching active orders:", error);
    return [];
  }
}

export async function getHistoryOrders(): Promise<Order[]> {
  try {
    const res = await api.get(ordersUrls.history);
    return res.data?.orders || [];
  } catch (error) {
    console.error("Error fetching history orders:", error);
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const res = await api.get(ordersUrls.detail(id));
    return res.data?.order;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error(`Error fetching order ${id}:`, error);
    return null;
  }
}

export async function createOrder(orderData: any) {
  try {
    const res = await api.post(ordersUrls.create, orderData);
    return { ok: true, data: res.data };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { ok: false, data: { error: error.response?.data?.error || "An error occurred. Please try again." } };
  }
}

export async function trackPublicOrder(phone: string, orderId: string): Promise<{ ok: boolean; data?: Order; error?: string }> {
  try {
    const res = await api.get(`${ordersUrls.track}?phone=${encodeURIComponent(phone)}&orderId=${encodeURIComponent(orderId)}`);
    return { ok: true, data: res.data?.order };
  } catch (error: any) {
    if (error.response?.status === 404) return { ok: false, error: "Order not found with provided details." };
    console.error("Error tracking order:", error);
    return { ok: false, error: error.response?.data?.error || "An error occurred. Please try again." };
  }
}
