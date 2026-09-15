"use server";

import { api } from "@/lib/api/axios";
import { cart as cartUrls } from "@/lib/api/apiUrls";
import { CartItem } from "@/contexts/CartContext";

export async function getCart(userId: string) {
  try {
    const res = await api.get(cartUrls.get(userId));
    return res.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

export async function addCartItem(userId: string, item: CartItem) {
  try {
    const res = await api.post(cartUrls.add, { userId, item });
    return res.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
}

export async function updateCartItem(userId: string, itemId: string, quantity: number) {
  try {
    const res = await api.put(cartUrls.update(itemId), { userId, quantity });
    return res.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return null;
  }
}

export async function removeCartItem(userId: string, itemId: string) {
  try {
    const res = await api.delete(cartUrls.remove(itemId, userId));
    return res.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return null;
  }
}

export async function syncCart(userId: string, cart: CartItem[]) {
  try {
    const res = await api.put(cartUrls.sync(userId), { cart });
    return res.data;
  } catch (error) {
    console.error("Error syncing cart:", error);
    return null;
  }
}
