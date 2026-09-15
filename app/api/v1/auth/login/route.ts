// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, fail } from "@/lib/mock/envelope";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.email || body.password !== 'password123') {
    return fail("Invalid email or password", "INVALID_CREDENTIALS", 401);
  }

  const cookieStore = await cookies();
  cookieStore.set('buyer_session', 'mock-session-token', { maxAge: 2592000, path: '/', httpOnly: true, sameSite: 'lax' });
  
  return ok(null, "Login successful");
}
