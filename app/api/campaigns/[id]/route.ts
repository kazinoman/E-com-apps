import { NextResponse } from "next/server";
import { getDummyCampaigns } from "@/lib/dummy/campaigns";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaigns = getDummyCampaigns();
  const campaign = campaigns.find(c => c.id === id);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!campaign) {
    return NextResponse.json(
      { success: false, message: "Campaign not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: campaign
  });
}
