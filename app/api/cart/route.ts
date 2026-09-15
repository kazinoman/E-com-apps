import { NextResponse } from 'next/server';
import { getUserCart, saveUserCart } from '@/lib/api/cartDb';

// GET /api/cart?userId=xyz
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const cart = getUserCart(userId);
  return NextResponse.json({ cart });
}

// POST /api/cart
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, item } = body;

    if (!userId || !item) {
      return NextResponse.json({ error: 'userId and item are required' }, { status: 400 });
    }

    const cart = getUserCart(userId);
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex((i: any) => i.id === item.id);
    
    if (existingItemIndex !== -1) {
      // If it exists, we could either update quantity or just replace.
      // Assuming the frontend sends the updated item with new quantity
      cart[existingItemIndex] = { ...cart[existingItemIndex], ...item, quantity: cart[existingItemIndex].quantity + item.quantity };
    } else {
      cart.push(item);
    }

    saveUserCart(userId, cart);

    return NextResponse.json({ success: true, cart }, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/cart?userId=xyz
// Replace entire cart (Useful for login merge/overwrite)
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const body = await request.json();

    if (!userId || !body.cart || !Array.isArray(body.cart)) {
      return NextResponse.json({ error: 'userId and cart array are required' }, { status: 400 });
    }

    saveUserCart(userId, body.cart);

    return NextResponse.json({ success: true, cart: body.cart }, { status: 200 });
  } catch (error) {
    console.error('Error saving entire cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
