// Server-only: importing next/headers makes this unusable from a Client
// Component, which is the boundary we want.
import { cookies } from "next/headers";

/**
 * Copy the backend's session cookie onto the browser response.
 *
 * The app talks to the API server-to-server, so a Set-Cookie the backend
 * returns lands on our fetch, not on the shopper's browser. Anything that
 * establishes or clears a session has to relay it deliberately — and only a
 * Server Action or route handler may, since a Server Component render cannot
 * set cookies.
 */
export const SESSION_COOKIE = "buyer_session";
export const CART_COOKIE = "cart_token";

/** 30 days, matching the backend's TTL_S for the buyer session JWT. */
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
/** 60 days, matching the backend's guest cart token. */
const CART_MAX_AGE = 60 * 60 * 24 * 60;

function extract(header: string | string[] | undefined, name: string): string | null {
  if (!header) return null;
  const all = Array.isArray(header) ? header : [header];
  for (const line of all) {
    // Match this cookie specifically. Scanning only the first Set-Cookie
    // line would miss the session whenever the backend sets more than one.
    const m = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`).exec(line);
    if (m) return m[1];
  }
  return null;
}

export async function relaySessionCookie(header: string | string[] | undefined) {
  const jar = await cookies();

  const session = extract(header, SESSION_COOKIE);
  if (session) {
    jar.set(SESSION_COOKIE, session, {
      httpOnly: true,
      // `secure` must follow the environment: a secure cookie is dropped
      // silently over plain http, so hardcoding true breaks local dev with no
      // visible error.
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
  }

  const cart = extract(header, CART_COOKIE);
  if (cart) {
    jar.set(CART_COOKIE, cart, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CART_MAX_AGE,
    });
  }
}

/** Clear both cookies on sign-out. */
export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(CART_COOKIE);
}
