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

// Ensure fetch uses absolute URL when invoked from Server Components
const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
};

export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/campaigns`, {
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
    const res = await fetch(`${getBaseUrl()}/api/campaigns/${id}`, {
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
