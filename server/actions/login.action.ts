"use server";

import { auth } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { relaySessionCookie } from "@/lib/session-cookie";

export async function login({ phone, password }: { phone: string; password: string }) {
  try {
    const response = await api.post(auth.login, { phone, password });

    // A Server Action is one of the few places that can set a cookie on the
    // browser, so the backend's session cookie is relayed here rather than in
    // the axios interceptor (a Server Component render cannot set one).
    await relaySessionCookie(response.headers["set-cookie"]);

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Invalid credentials. Please try again.";
    return { success: false, message };
  }
}
