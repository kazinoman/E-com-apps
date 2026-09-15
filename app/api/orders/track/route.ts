import { NextResponse } from 'next/server';
import { getDbData } from '@/lib/data';
import { Order } from '@/types/order';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const orderId = searchParams.get('orderId');

    if (!phone || !orderId) {
      return NextResponse.json({ error: 'Phone number and Order ID are required' }, { status: 400 });
    }

    const data = await getDbData();
    if (!data) return NextResponse.json({ error: 'Data not found' }, { status: 500 });

    const orders: Order[] = data.orders || [];
    
    // Find matching order
    const order = orders.find(o => o.id === orderId && o.customer.phone === phone);

    if (!order) {
      return NextResponse.json({ error: 'Order not found with provided details' }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
