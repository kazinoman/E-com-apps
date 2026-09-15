import { NextResponse } from 'next/server';
import { getUserCart, saveUserCart } from '@/lib/api/cartDb';

// PUT /api/cart/[id]
// Body: { userId: string, quantity: number }
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const itemId = params.id;
    const body = await request.json();
    const { userId, quantity } = body;

    if (!userId || quantity === undefined) {
      return NextResponse.json({ error: 'userId and quantity are required' }, { status: 400 });
    }

    const cart = getUserCart(userId);
    const itemIndex = cart.findIndex((i: any) => i.id === itemId);

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    cart[itemIndex].quantity = quantity;
    saveUserCart(userId, cart);

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/cart/[id]?userId=xyz
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const itemId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let cart = getUserCart(userId);
    cart = cart.filter((i: any) => i.id !== itemId);
    saveUserCart(userId, cart);

    return NextResponse.json({ success: true, cart }, { status: 200 });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
