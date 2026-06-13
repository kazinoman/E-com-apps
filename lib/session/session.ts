// lib/server/session.ts
import { cookies } from "next/headers";

export function getSession() {
  return cookies().get("buyer_session")?.value;
}
