import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getDbData();
    if (!data) {
      return NextResponse.json({ error: 'Data not found' }, { status: 500 });
    }
    return NextResponse.json(data.products || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
