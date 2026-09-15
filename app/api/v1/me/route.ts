// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return unauthorized();
  
  return ok({
    id: "user-123",
    fullName: "Mock User",
    email: "mock@example.com",
    phone: "+880123456789",
    createdAt: new Date().toISOString()
  }, "User profile fetched");
}

export async function PATCH(request: Request) {
  const session = await readSession();
  if (!session) return unauthorized();
  return ok(null, "Profile updated");
}
