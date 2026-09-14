import { NextResponse } from "next/server";
import { addresses } from "./store";

export async function GET() {
  return NextResponse.json({ success: true, data: addresses }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.street || !data.city || !data.state || !data.zip || !data.country) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAddress = {
      id: Date.now().toString(),
      ...data,
      isDefault: addresses.length === 0, // make default if it's the only one
    };

    addresses.push(newAddress);

    return NextResponse.json({ success: true, data: newAddress }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
