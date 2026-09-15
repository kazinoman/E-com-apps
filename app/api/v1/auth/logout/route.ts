// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('buyer_session');
  return ok(null, "Logout successful");
}
