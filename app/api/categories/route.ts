import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getDbData();
    const categoriesData = data?.categories?.data;
    
    if (!categoriesData) {
      return NextResponse.json({ success: true, data: { filters: [] } }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: categoriesData }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
