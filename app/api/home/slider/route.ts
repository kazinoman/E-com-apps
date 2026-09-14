import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const slides = [
      {
        id: 1,
        title: "Electronics Mega Sale",
        linkUrl: "/search?category=Electronics",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1920&h=600&auto=format&fit=crop",
      },
      {
        id: 2,
        title: "Summer Fashion Collection",
        linkUrl: "/search?category=Fashion",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1920&h=600&auto=format&fit=crop",
      },
      {
        id: 3,
        title: "Premium Bags",
        linkUrl: "/search?category=Bags",
        image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1920&h=600&auto=format&fit=crop",
      }
    ];

    return NextResponse.json({ success: true, data: slides }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
