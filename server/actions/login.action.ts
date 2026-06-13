"use server";

import { auth } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { cookies } from "next/headers";

export async function login({ email, password }: { email: string; password: string }) {
  const response = await api.post(auth.login, { email, password });

  // Access header correctly
  const setCookieHeader = response.headers["set-cookie"];

  if (setCookieHeader) {
    // Handle case where set-cookie is an array (multiple cookies)
    const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader[0] : setCookieHeader;
    const match = cookieString.match(/buyer_session=([^;]+)/);

    if (match) {
      const cookieStore = await cookies();
      cookieStore.set("buyer_session", match[1], {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  return response.data;
}
