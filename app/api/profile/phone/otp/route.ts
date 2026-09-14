import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // In a real app, integrate with an SMS gateway here
    console.log(`Mock: Sent OTP to ${phone}`);

    // We simulate success and return a mock message
    return NextResponse.json({ success: true, message: "Verification code sent successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
