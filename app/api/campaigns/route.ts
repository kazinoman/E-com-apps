import { NextResponse } from "next/server";
import { getDummyCampaigns } from "@/lib/dummy/campaigns";

export async function GET() {
  const campaigns = getDummyCampaigns();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json({
    success: true,
    data: campaigns
  });
}
