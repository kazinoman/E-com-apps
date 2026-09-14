import { NextRequest, NextResponse } from 'next/server';
import { getDbData, writeDbData } from '@/lib/data';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getDbData();
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 500 });

    if (!data.wishlists) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
    }

    const initialLength = data.wishlists.length;
    data.wishlists = data.wishlists.filter((w: any) => String(w.id) !== id);

    if (data.wishlists.length === initialLength) {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    }

    await writeDbData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
