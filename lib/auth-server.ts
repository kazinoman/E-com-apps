// Server-only: importing next/headers makes this unusable from a Client
// Component, which is the boundary we want.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/api/axios";

/**
 * Server-side session.
 *
 * The `buyer_session` cookie is httpOnly, so the browser cannot read it and
 * the client cannot assert who it is. Identity is established here, on the
 * server, by asking the backend — never by trusting anything the client sent
 * or stored.
 *
 * This replaces the previous arrangement, where the user object lived in
 * localStorage and `isLogin` was derived from its presence. That was
 * spoofable from devtools, and it is why the cart code ended up passing a
 * client-held `user.id` to the API as a query parameter.
 */

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
}

/**
 * The signed-in customer, or null.
 *
 * A 401 is the ordinary signed-out answer, not an error: the backend returns
 * it whenever the cookie is missing, expired or invalid, and all three mean
 * the same thing to us.
 */
export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  if (!jar.get("buyer_session")) return null;

  try {
    const res = await api.get("/me");
    return (res.data?.data as User) ?? null;
  } catch (error: any) {
    if (error?.response?.status === 401) return null;
    // A backend that is down must not read as "signed out" — that would log
    // people out of a page that merely failed to load. Surface it instead.
    console.error("Failed to resolve the current user:", error?.message ?? error);
    return null;
  }
}

/**
 * Same, but sends anonymous visitors to the login screen first.
 *
 * Call this from a layout or page, never from a client effect: redirecting
 * after render means the protected markup has already been sent to the
 * browser.
 */
export async function requireUser(returnTo?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/login${next}`);
  }
  return user;
}
