"use server";

import { api } from "@/lib/api/axios";
import { wishlist } from "@/lib/api/apiUrls";

export async function fetchUserWishlist(userId: string | number) {
  try {
    const res = await api.get(wishlist.get(String(userId)));
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch wishlist", error);
    return [];
  }
}

export async function addToWishlist(userId: string | number, productId: string | number) {
  try {
    const res = await api.post(wishlist.add, { userId, productId });
    return res.data?.data || null;
  } catch (error) {
    console.error("Failed to add to wishlist", error);
    return null;
  }
}

export async function removeFromWishlist(id: string | number) {
  try {
    await api.delete(wishlist.remove(String(id)));
    return true;
  } catch (error) {
    console.error("Failed to remove from wishlist", error);
    return false;
  }
}
