import { NextRequest, NextResponse } from 'next/server';
import { getDbData, writeDbData } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const data = await getDbData();
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 500 });

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    let wishlists = data.wishlists || [];
    if (userId) {
      wishlists = wishlists.filter((w: any) => String(w.userId) === userId);
    }

    return NextResponse.json({ data: wishlists });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await getDbData();
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 500 });

    const body = await request.json();
    const { userId, productId } = body;

    const newWishlist = {
      id: Date.now(), // Generate a simple ID
      userId,
      productId,
    };

    if (!data.wishlists) data.wishlists = [];
    data.wishlists.push(newWishlist);
    
    await writeDbData(data);

    return NextResponse.json({ data: newWishlist });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
