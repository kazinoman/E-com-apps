import { NextRequest, NextResponse } from 'next/server';
import { getDbData } from '@/lib/data';

// This handles /api/featured-products, /api/trending-products, etc.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await params;
    const data = await getDbData();
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 500 });

    const products = data.products || [];
    let result = [];

    // Simulate different collections with different subsets of products
    switch (collection) {
      case 'featured-products':
        result = products.slice(0, 8);
        break;
      case 'trending-products':
        result = products.slice(8, 16);
        break;
      case 'new-arrivals':
        result = [...products].reverse().slice(0, 8);
        break;
      case 'you-may-also-like':
        result = products.slice(4, 12);
        break;
      default:
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
