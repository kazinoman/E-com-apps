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

const DUMMY_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1572635196237-14b3f281501f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1507764923504-cd90bf7da772?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400"
];

// Generate some basic mock products for the dummy data
const createMockProducts = (count: number, prefix: string): ProductCardProps[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-prod-${i + 1}`,
    title: `Premium ${prefix} Product ${i + 1} with amazing features and quality build`,
    price: {
      bdt: Math.floor(Math.random() * 5000) + 1000,
      cny: 0
    },
    imageUrl: DUMMY_IMAGES[i % DUMMY_IMAGES.length],
    category: `Category ${prefix}`,
    ratingAvg: 4.5 + Math.random() * 0.5,
    ratingCount: Math.floor(Math.random() * 500) + 50,
    inStock: true,
    salesCount: Math.floor(Math.random() * 1000) + 100,
    moq: 1,
  }));
};

export function getDummyCampaigns(): Campaign[] {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);
  endDate.setHours(endDate.getHours() + 14);

  const campaigns: Campaign[] = [
    {
      id: "autumn-luxe-runway",
      title: "Autumn Luxe Runway & Trenchwear Fest",
      description: "Designer double-breasted trench coats, fine leather glove pairings, and premium wool knits.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
      tags: ["UP TO 65% OFF", "Luxury Apparel"],
      category: "PARIS & MILAN CURATED",
      rating: 4.8,
      soldCount: "650+ sold",
      soldPercentage: 88,
      stockLeft: 12,
      featuredProductName: "Cashmere Overcoat Duo",
      features: ["Dhaka Same-Day Eligible", "Overseas Factory Direct"],
      products: createMockProducts(15, "Autumn")
    },
    {
      id: "nomad-travel-commuter",
      title: "Travel & Urban Carry Modular Gear Fest",
      description: "Minimalist ballistic nylon commuter backpacks, anti-theft compartments, and modular laptop sleeves.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
      tags: ["FLAT 45% OFF", "Fast Seller"],
      category: "NOMAD UTILITY LAB",
      rating: 5.0,
      soldCount: "980+ sold",
      soldPercentage: 94,
      stockLeft: 4,
      featuredProductName: "Level-9 28L Roll-Top Pack",
      features: ["Water-Resistant Tested"],
      products: createMockProducts(12, "Nomad")
    },
    {
      id: "hi-res-acoustics",
      title: "Hi-Res Acoustics & Workspace Tech Drop",
      description: "Active Noise-Cancelling studio headsets, aerospace aluminum smartwatches, and wireless charging stations.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
      tags: ["UP TO 70% OFF", "Direct Import"],
      category: "ZAAG HI-TECH VAULT",
      rating: 4.9,
      soldCount: "420+ sold",
      soldPercentage: 67,
      stockLeft: 34,
      featuredProductName: "ANC Wireless Studio V2",
      features: ["1-Year Warranty"],
      products: createMockProducts(18, "Tech")
    },
    {
      id: "sneaker-head-vault",
      title: "Sneakerhead Vault: Limited Editions",
      description: "Exclusive streetwear sneakers, premium high-tops, and rare collector editions at unbeatable prices.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80&w=800",
      tags: ["LIMITED STOCK", "Streetwear"],
      category: "SNEAKER VAULT",
      rating: 4.9,
      soldCount: "1.2k+ sold",
      soldPercentage: 91,
      stockLeft: 18,
      featuredProductName: "Air Retro High OG",
      features: ["Authenticity Guaranteed", "Free Returns"],
      products: createMockProducts(14, "Sneaker")
    },
    {
      id: "smart-home-essentials",
      title: "Smart Home & AI Gadgets Event",
      description: "Upgrade your living space with AI-powered cameras, smart lighting, and robotic vacuum cleaners.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
      tags: ["UP TO 50% OFF", "Smart Living"],
      category: "HOME INNOVATION",
      rating: 4.7,
      soldCount: "800+ sold",
      soldPercentage: 75,
      stockLeft: 42,
      featuredProductName: "Smart Vacuum Pro 360",
      features: ["Next-Day Delivery"],
      products: createMockProducts(20, "SmartHome")
    },
    {
      id: "gaming-battlestation",
      title: "Ultimate Gaming Battlestation Drop",
      description: "Mechanical keyboards, ultra-wide 144Hz monitors, and RGB gaming mice for the true enthusiasts.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
      tags: ["HOT DEAL", "PC Master Race"],
      category: "GAMING GEAR",
      rating: 4.9,
      soldCount: "2.5k+ sold",
      soldPercentage: 96,
      stockLeft: 5,
      featuredProductName: "RGB Mechanical Keyboard",
      features: ["Esports Ready"],
      products: createMockProducts(25, "Gaming")
    },
    {
      id: "fitness-activewear",
      title: "Pro Fitness & Activewear Sale",
      description: "Breathable compression gear, premium yoga mats, and advanced fitness trackers for your workout.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
      tags: ["30% OFF", "Active Lifestyle"],
      category: "GYM & FITNESS",
      rating: 4.6,
      soldCount: "1.1k+ sold",
      soldPercentage: 82,
      stockLeft: 22,
      featuredProductName: "Elite Yoga Mat Set",
      features: ["Sweat Resistant"],
      products: createMockProducts(10, "Fitness")
    },
    {
      id: "beauty-skincare-luxe",
      title: "K-Beauty & Luxury Skincare",
      description: "Hydrating serums, organic face masks, and premium cosmetics sourced directly from Seoul.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1522337360788-8b13fee7a3af?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1522337360788-8b13fee7a3af?auto=format&fit=crop&q=80&w=800",
      tags: ["BUY 1 GET 1", "Skincare"],
      category: "K-BEAUTY EXCLUSIVE",
      rating: 4.9,
      soldCount: "3.2k+ sold",
      soldPercentage: 98,
      stockLeft: 2,
      featuredProductName: "Glow Serum Essence",
      features: ["100% Organic", "Cruelty-Free"],
      products: createMockProducts(30, "Beauty")
    },
    {
      id: "kitchen-masterchef",
      title: "Masterchef Kitchen Appliances",
      description: "Professional-grade blenders, air fryers, and stainless steel cookware for the modern kitchen.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
      tags: ["CLEARANCE", "Home & Kitchen"],
      category: "CULINARY ARTS",
      rating: 4.5,
      soldCount: "450+ sold",
      soldPercentage: 60,
      stockLeft: 55,
      featuredProductName: "Pro-Blend Mixer 5000",
      features: ["2-Year Warranty"],
      products: createMockProducts(12, "Kitchen")
    },
    {
      id: "drone-photography",
      title: "Aerial Photography & Drones",
      description: "4K cinematic drones, stabilized gimbals, and action cameras for creators and adventurers.",
      endDate: endDate.toISOString(),
      bannerImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=2000",
      cardImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
      tags: ["UP TO 20% OFF", "Photography"],
      category: "CREATOR STUDIO",
      rating: 4.8,
      soldCount: "920+ sold",
      soldPercentage: 85,
      stockLeft: 15,
      featuredProductName: "Aero X4 Cinematic Drone",
      features: ["Free Shipping"],
      products: createMockProducts(16, "Drone")
    }
  ];

  return campaigns;
}
