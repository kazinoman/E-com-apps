// Mock of the real backend's liveness probe.
// Note it is UNVERSIONED there — @Controller('health') carries no version, so
// the real path is /health and /api/v1/health is a 404. This mock is reached
// at /api/health for the same reason: it sits outside the /api/v1 tree.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", mock: true });
}
