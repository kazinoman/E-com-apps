"use server";

import { auth } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { relaySessionCookie } from "@/lib/session-cookie";

export async function login({ email, password }: { email: string; password: string }) {
  const response = await api.post(auth.login, { email, password });

  // A Server Action is one of the few places that can set a cookie on the
  // browser, so the backend's session cookie is relayed here rather than in
  // the axios interceptor (a Server Component render cannot set one).
  await relaySessionCookie(response.headers["set-cookie"]);

  return response.data;
}
