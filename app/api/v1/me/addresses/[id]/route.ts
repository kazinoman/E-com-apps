// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return unauthorized();
  return ok(null, "Address updated");
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return unauthorized();
  return ok(null, "Address deleted");
}
