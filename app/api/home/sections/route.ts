import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getDbData();
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 500 });

    const products = data.products || [];

    const mockBags = [
      {
        id: "bag-1",
        title: "Premium Leather Backpack",
        price: 120.00,
        originalPrice: 150.00,
        rating: 4.8,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
        badge: "New",
        category: "Bags",
      },
      {
        id: "bag-2",
        title: "Canvas Messenger Bag",
        price: 45.99,
        rating: 4.5,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
        category: "Bags",
      },
      {
        id: "bag-3",
        title: "Women's Tote Bag",
        price: 85.00,
        originalPrice: 95.00,
        rating: 4.9,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop",
        badge: "-10%",
        category: "Bags",
      },
      {
        id: "bag-4",
        title: "Travel Duffel Bag",
        price: 65.00,
        rating: 4.7,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1550801878-3f59e9314c2b?q=80&w=600&auto=format&fit=crop",
        category: "Bags",
      },
      {
        id: "bag-5",
        title: "Minimalist Crossbody Bag",
        price: 55.00,
        rating: 4.6,
        reviews: 90,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
        category: "Bags",
      },
      {
        id: "bag-6",
        title: "Vintage Leather Briefcase",
        price: 199.99,
        originalPrice: 250.00,
        rating: 4.8,
        reviews: 65,
        image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=600&auto=format&fit=crop",
        badge: "Hot",
        category: "Bags",
      }
    ];

    let bags = products.filter((p: any) => p.category === 'Bags' || p.title.toLowerCase().includes('bag'));
    if (bags.length < 6) {
      bags = [...bags, ...mockBags].slice(0, 8);
    }

    // Customizable sections with different slices of the mocked product data
    const sections = [
      {
        id: 'best-selling',
        title: 'Best Selling',
        products: products.slice(0, 8),
      },
      {
        id: 'trending-products',
        title: 'Trending Products',
        products: products.slice(8, 16),
      },
      {
        id: 'electronics',
        title: 'Top Electronics',
        products: products.filter((p: any) => p.category === 'Electronics').slice(0, 8).length > 0 ? products.filter((p: any) => p.category === 'Electronics').slice(0, 8) : products.slice(4, 12),
      },
      {
        id: 'fashion',
        title: 'Latest Fashion',
        products: products.filter((p: any) => p.category === 'Fashion').slice(0, 8).length > 0 ? products.filter((p: any) => p.category === 'Fashion').slice(0, 8) : products.reverse().slice(0, 8),
      },
      {
        id: 'bags',
        title: 'Premium Bags',
        products: bags,
      },
      {
        id: 'you-may-also-like',
        title: 'You May Also Like',
        products: products.slice(5, 13),
      }
    ];

    // Ensure all sections have products (fallback if filter is empty)
    const validSections = sections.map(sec => {
      if (!sec.products || sec.products.length === 0) {
        sec.products = products.slice(0, 6);
      }
      return sec;
    });

    return NextResponse.json({ success: true, data: validSections }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
