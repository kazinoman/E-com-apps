import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json');

// In-memory store for Vercel serverless environment
let memoryOrders: any[] | null = null;

// Helper to get orders
function getOrders(): any[] {
  if (memoryOrders) return memoryOrders;
  
  try {
    if (!fs.existsSync(dataFilePath)) {
      memoryOrders = [];
      return memoryOrders;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    memoryOrders = JSON.parse(fileData);
    return memoryOrders || [];
  } catch (error) {
    console.error('Error reading orders:', error);
    memoryOrders = [];
    return memoryOrders;
  }
}

// Helper to save orders
function saveOrders(orders: any[]) {
  memoryOrders = orders;
  
  // Only attempt to write to disk if not on Vercel/Production
  if (process.env.VERCEL) return;
  
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error saving orders (expected in Serverless):', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data. Cart items are required.' },
        { status: 400 }
      );
    }

    const orders = getOrders();

    // Generate a new order ID
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    // Determine initial status based on payment method
    let initialStatus = 'order-initiate';
    if (body.payment?.paymentMethod === 'Online payment') {
      initialStatus = 'paid';
    }

    const newOrder = {
      id: newOrderId,
      ...body,
      status: initialStatus,
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    saveOrders(orders);

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating order.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status');

  let orders = getOrders();

  if (statusParam === 'active') {
    orders = orders.filter((o: any) => o.status !== 'Delivered' && o.status !== 'Canceled');
  } else if (statusParam === 'history') {
    orders = orders.filter((o: any) => o.status === 'Delivered' || o.status === 'Canceled');
  }

  return NextResponse.json({ orders });
}
