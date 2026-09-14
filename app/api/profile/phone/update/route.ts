import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { newPhone } = await request.json();

    if (!newPhone) {
      return NextResponse.json({ error: "New phone number is required" }, { status: 400 });
    }

    // In a real app, update the user record in the database
    console.log(`Mock: Updated phone number to ${newPhone}`);

    return NextResponse.json({ success: true, message: "Phone number updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
