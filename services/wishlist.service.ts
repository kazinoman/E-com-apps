"use server";

import axios from "axios";

// Creating a localized instance since lib/api/axios uses cookies which might not be needed for basic mock wishlist API
const wishlistApi = axios.create({
  baseURL: "http://localhost:3001",
});

export async function fetchUserWishlist(userId: string | number) {
  try {
    const res = await wishlistApi.get(`/wishlists?userId=${userId}`);
    return res.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch wishlist", error);
    return [];
  }
}

export async function addToWishlist(userId: string | number, productId: string | number) {
  try {
    const res = await wishlistApi.post(`/wishlists`, { userId, productId });
    return res.data?.data || null;
  } catch (error) {
    console.error("Failed to add to wishlist", error);
    return null;
  }
}

export async function removeFromWishlist(id: string | number) {
  try {
    await wishlistApi.delete(`/wishlists/${id}`);
    return true;
  } catch (error) {
    console.error("Failed to remove from wishlist", error);
    return false;
  }
}
