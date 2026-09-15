"use server";

import { auth } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { clearSessionCookies } from "@/lib/session-cookie";

export async function logoutAction() {
  try {
    // Ask the backend to invalidate the session first; if that fails we still
    // clear locally, so a shopper is never left appearing signed in.
    await api.post(auth.logout);
  } catch (error) {
    console.error("Failed to call logout API endpoint:", error);
  } finally {
    await clearSessionCookies();
  }
}
