import { NextResponse } from "next/server";
import { addresses } from "../store";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await request.json();
    
    const index = addresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    addresses[index] = { ...addresses[index], ...data };

    return NextResponse.json({ success: true, data: addresses[index] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const index = addresses.findIndex(addr => addr.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    addresses.splice(index, 1);

    return NextResponse.json({ success: true, message: "Address deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
