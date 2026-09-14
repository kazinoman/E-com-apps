import { NextRequest, NextResponse } from 'next/server';
import { getDbData } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getDbData();
    if (!data) {
      return NextResponse.json({ error: 'Data not found' }, { status: 500 });
    }

    const product = data.products?.find((p: any) => String(p.id) === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product found successfully',
      data: product
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
