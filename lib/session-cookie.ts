// Server-only: importing next/headers makes this unusable from a Client
// Component, which is the boundary we want.
import { cookies } from "next/headers";

/**
 * Copy the backend's session and guest cookies onto the browser response.
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
/** 60 days — backend `GUEST_TOKEN_TTL_S`, shared by every guest token. */
const GUEST_MAX_AGE = 60 * 60 * 24 * 60;

/**
 * Every cookie the backend may set on us, with the lifetime to mirror.
 *
 * The guest tokens are what make a cart, a wishlist and a comparison survive
 * without an account. Each is minted independently on first write to its own
 * resource, so dropping any one of them silently resets that feature on every
 * request — the failure is invisible, which is why the list lives in one place
 * and both the relay and the outbound forwarder read it.
 */
export const RELAYED_COOKIES: ReadonlyArray<{ name: string; maxAge: number }> = [
  { name: SESSION_COOKIE, maxAge: SESSION_MAX_AGE },
  { name: CART_COOKIE, maxAge: GUEST_MAX_AGE },
  { name: "wishlist_token", maxAge: GUEST_MAX_AGE },
  { name: "compare_token", maxAge: GUEST_MAX_AGE },
];

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

  for (const { name, maxAge } of RELAYED_COOKIES) {
    const value = extract(header, name);
    if (!value) continue;
    jar.set(name, value, {
      httpOnly: true,
      // `secure` must follow the environment: a secure cookie is dropped
      // silently over plain http, so hardcoding true breaks local dev with no
      // visible error.
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }
}

/** Clear every cookie on sign-out. */
export async function clearSessionCookies() {
  const jar = await cookies();
  for (const { name } of RELAYED_COOKIES) jar.delete(name);
}
