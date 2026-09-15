// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";

export async function POST(request: Request) {
  return ok(null, "Signup successful");
}
