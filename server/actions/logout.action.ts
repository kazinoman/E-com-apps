"use server";

import { auth } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { cookies } from "next/headers";

export async function logoutAction() {
  try {
    // Call the external API to invalidate the token if necessary
    await api.post(auth.logout);
  } catch (error) {
    console.error("Failed to call logout API endpoint:", error);
    // Even if it fails, we should proceed to clear the local cookie
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("buyer_session");
  }
}
