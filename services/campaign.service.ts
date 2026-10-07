import { ProductCardProps } from "@/components/common/ProductCard";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  endDate: string; // ISO date string
  bannerImage: string;
  cardImage: string;
  tags: string[];
  category: string;
  rating: number;
  soldCount: string;
  soldPercentage: number;
  stockLeft: number;
  featuredProductName: string;
  features: string[];
  products: ProductCardProps[];
}

// Ensure fetch uses relative URL for client side, and bypass fetch entirely on server side
// since absolute URL from NEXT_PUBLIC_API_BASE_URL points to the external API, not the Next.js API.
import { getDummyCampaigns } from "@/lib/dummy/campaigns";

export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    if (typeof window === "undefined") {
      return getDummyCampaigns();
    }

    const res = await fetch(`/api/campaigns`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch campaigns: ${res.statusText}`);
    }

    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error("Error in fetchCampaigns:", error);
    return [];
  }
}

export async function fetchCampaignById(id: string): Promise<Campaign | null> {
  try {
    if (typeof window === "undefined") {
      const campaigns = getDummyCampaigns();
      return campaigns.find(c => c.id === id) || null;
    }

    const res = await fetch(`/api/campaigns/${id}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch campaign details: ${res.statusText}`);
    }

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error(`Error in fetchCampaignById for ${id}:`, error);
    return null;
  }
}
