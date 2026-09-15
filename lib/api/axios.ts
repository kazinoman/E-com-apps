import axios from "axios";
import { cookies } from "next/headers";
import { snakeizeDeep } from "./case";
import { RELAYED_COOKIES } from "../session-cookie";

/**
 * Server-side HTTP client for the merchant backend.
 *
 * This module imports `next/headers`, so it is server-only: Server Components,
 * Server Actions and route handlers. A Client Component that imports it will
 * fail to build. That is deliberate — the session lives in an httpOnly cookie
 * the browser cannot read, so the browser has no business calling the API
 * directly.
 */

/**
 * The backend is NestJS with URI versioning (`bootstrap.ts`: prefix `api/v`,
 * version `1`) and no global prefix, so every versioned route is
 * `/api/v1/...`. Liveness is the exception: `@Controller('health')` carries no
 * version, so it answers at `/health` and `/api/v1/health` is a 404.
 *
 * The fallback matches the backend's local dev port. Note the dev server for
 * this app must therefore run somewhere else — use `next dev -p 3001`.
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:3000/api/v1";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Forward the caller's session and guest cookies to the backend.
 *
 * `buyer_session` is a 30-day JWT set at login; the guest tokens
 * (`cart_token`, `wishlist_token`, `compare_token`) each identify one
 * anonymous resource and are minted by the backend on first write to it. All
 * are httpOnly, so this hop is the only way they reach the API — and a token
 * left out here is re-minted on every request, quietly emptying that feature.
 * RELAYED_COOKIES is the single list; session-cookie.ts relays the same set
 * back.
 *
 * Cookies the backend sets in a response are NOT relayed to the browser from
 * here — a Server Component cannot set a cookie. Anything that needs to
 * establish a session or a cart token must run in a Server Action or a route
 * handler and copy the `set-cookie` header across itself.
 */
api.interceptors.request.use(async (config) => {
  const jar = await cookies();

  const forwarded = RELAYED_COOKIES.map(({ name }) => {
    const value = jar.get(name)?.value;
    return value ? `${name}=${value}` : null;
  })
    .filter(Boolean)
    .join("; ");

  if (forwarded) {
    config.headers.Cookie = forwarded;
  }

  return config;
});

/**
 * Convert outbound payloads to snake_case.
 *
 * Responses are left alone: the backend already camelizes them, and the
 * components are written against that. This one-way conversion is the whole
 * adapter — see lib/api/case.ts for why the asymmetry exists.
 *
 * FormData and other non-plain bodies pass through untouched, so a file
 * upload still works.
 */
api.interceptors.request.use((config) => {
  if (config.data !== undefined) {
    config.data = snakeizeDeep(config.data);
  }
  if (config.params !== undefined) {
    config.params = snakeizeDeep(config.params);
  }
  return config;
});
