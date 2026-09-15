const fs = require('fs');
const path = require('path');

const basePath = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1';

const files = {
  // Cart
  'cart/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";
import { getCart, saveCart, readCartToken } from "@/lib/mock/store";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const token = await readCartToken();
  const cart = await getCart(token);
  return Response.json(ok("Cart fetched successfully", cart));
}

export async function DELETE(request: Request) {
  const token = await readCartToken();
  const cart = await getCart(token);
  cart.items = [];
  cart.subtotalBdt = 0;
  cart.shippingBdt = 0;
  cart.totalBdt = 0;
  await saveCart(token, cart);
  return Response.json(ok("Cart cleared", null));
}
`,
  'cart/items/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, validationError } from "@/lib/mock/envelope";
import { getCart, saveCart, readCartToken } from "@/lib/mock/store";
import { getDbData } from "@/lib/data";
import { cookies } from "next/headers";

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.product_id) {
    return Response.json(validationError([{ field: "product_id", message: "Invalid input" }]), { status: 400 });
  }

  const token = await readCartToken();
  const cart = await getCart(token);

  const db = await getDbData();
  const product = db.products.find((p: any) => String(p.id) === String(body.product_id));
  if (!product) {
    return Response.json(validationError([{ field: "product_id", message: "Product not found" }]), { status: 400 });
  }

  const quantity = body.quantity || 1;
  const unitPrice = product.price || 0;

  const newItem = {
    id: generateUUID(),
    productId: String(product.id),
    skuExternalId: body.sku_external_id || null,
    title: product.title,
    imageUrl: product.image || product.images?.[0] || "",
    attributes: {},
    quantity,
    unitPriceBdt: unitPrice,
    lineTotalBdt: unitPrice * quantity,
    moq: product.moq || 1,
    activeTierMinQty: null,
    belowMoq: false,
    unavailable: false,
    priceChanged: null
  };

  cart.items.push(newItem);
  cart.subtotalBdt = cart.items.reduce((sum: number, item: any) => sum + item.lineTotalBdt, 0);
  cart.shippingBdt = cart.items.length > 0 ? 120 : 0;
  cart.totalBdt = cart.subtotalBdt + cart.shippingBdt;

  await saveCart(token, cart);

  let cookieSet = false;
  const cookieStore = await cookies();
  if (!cookieStore.has('cart_token')) {
    cookieStore.set('cart_token', token, { maxAge: 5184000, path: '/', httpOnly: true, sameSite: 'lax' });
    cookieSet = true;
  }

  const res = Response.json(ok("Item added to cart", cart), { status: 201 });
  return res;
}
`,
  'cart/items/[id]/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, validationError } from "@/lib/mock/envelope";
import { getCart, saveCart, readCartToken } from "@/lib/mock/store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  
  if (typeof body.quantity !== 'number') {
    return Response.json(validationError([{ field: "quantity", message: "Invalid input" }]), { status: 400 });
  }

  const token = await readCartToken();
  const cart = await getCart(token);
  
  const item = cart.items.find((i: any) => i.id === id);
  if (item) {
    item.quantity = body.quantity;
    item.lineTotalBdt = item.unitPriceBdt * item.quantity;
    
    cart.subtotalBdt = cart.items.reduce((sum: number, item: any) => sum + item.lineTotalBdt, 0);
    cart.shippingBdt = cart.items.length > 0 ? 120 : 0;
    cart.totalBdt = cart.subtotalBdt + cart.shippingBdt;
    
    await saveCart(token, cart);
  }
  
  return Response.json(ok("Cart updated", cart));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await readCartToken();
  const cart = await getCart(token);
  
  cart.items = cart.items.filter((i: any) => i.id !== id);
  cart.subtotalBdt = cart.items.reduce((sum: number, item: any) => sum + item.lineTotalBdt, 0);
  cart.shippingBdt = cart.items.length > 0 ? 120 : 0;
  cart.totalBdt = cart.subtotalBdt + cart.shippingBdt;
  
  await saveCart(token, cart);
  
  return Response.json(ok("Item removed", cart));
}
`,
  // Wishlist
  'wishlist/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";
import { getWishlist, readSession } from "@/lib/mock/store";

export async function GET(request: Request) {
  const session = await readSession();
  const wishlist = await getWishlist(session || 'guest');
  return Response.json(ok("Wishlist fetched", { items: wishlist, count: wishlist.length }));
}
`,
  'wishlist/items/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, validationError } from "@/lib/mock/envelope";
import { getWishlist, saveWishlist, readSession } from "@/lib/mock/store";

export async function POST(request: Request) {
  const session = await readSession();
  const body = await request.json().catch(() => ({}));
  if (!body.product_id) {
    return Response.json(validationError([{ field: "product_id", message: "Invalid input" }]), { status: 400 });
  }
  
  const wishlist = await getWishlist(session || 'guest');
  if (!wishlist.includes(body.product_id)) {
    wishlist.push(body.product_id);
    await saveWishlist(session || 'guest', wishlist);
  }
  
  return Response.json(ok("Item added to wishlist", { items: wishlist, count: wishlist.length }), { status: 201 });
}
`,
  'wishlist/items/[productId]/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";
import { getWishlist, saveWishlist, readSession } from "@/lib/mock/store";

export async function DELETE(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const session = await readSession();
  let wishlist = await getWishlist(session || 'guest');
  
  wishlist = wishlist.filter((id: string) => id !== productId);
  await saveWishlist(session || 'guest', wishlist);
  
  return Response.json(ok("Item removed from wishlist", { items: wishlist, count: wishlist.length }));
}
`,
  // Auth
  'auth/signup/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";

export async function POST(request: Request) {
  return Response.json(ok("Signup successful", null));
}
`,
  'auth/login/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, fail } from "@/lib/mock/envelope";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!body.email || body.password !== 'password123') {
    return Response.json(fail("Invalid email or password", "INVALID_CREDENTIALS"), { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('buyer_session', 'mock-session-token', { maxAge: 2592000, path: '/', httpOnly: true, sameSite: 'lax' });
  
  return Response.json(ok("Login successful", null));
}
`,
  'auth/logout/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('buyer_session');
  return Response.json(ok("Logout successful", null));
}
`,
  'auth/password-reset/request/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";

export async function POST(request: Request) {
  return Response.json(ok("Password reset requested", null));
}
`,
  'auth/password-reset/confirm/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok } from "@/lib/mock/envelope";

export async function POST(request: Request) {
  return Response.json(ok("Password reset confirmed", null));
}
`,
  // Customer (Me)
  'me/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  
  return Response.json(ok("User profile fetched", {
    id: "user-123",
    fullName: "Mock User",
    email: "mock@example.com",
    phone: "+880123456789",
    createdAt: new Date().toISOString()
  }));
}

export async function PATCH(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Profile updated", null));
}
`,
  'me/password/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function PATCH(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Password updated", null));
}
`,
  'me/email/request/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Email update requested", null));
}
`,
  'me/email/confirm/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Email update confirmed", null));
}
`,
  'me/phone/request/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Phone update requested", null));
}
`,
  'me/phone/confirm/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Phone update confirmed", null));
}
`,
  'me/addresses/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Addresses fetched", []));
}

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Address added", null), { status: 201 });
}
`,
  'me/addresses/[id]/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Address updated", null));
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Address deleted", null));
}
`,
  'me/addresses/[id]/default/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  return Response.json(ok("Default address set", null));
}
`,
  // Checkout
  'checkout/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, unauthorized, validationError } from "@/lib/mock/envelope";
import { getCart, saveCart, readCartToken, readSession } from "@/lib/mock/store";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  
  const body = await request.json().catch(() => ({}));
  if (!body.address_id || !body.payment_method) {
    return Response.json(validationError([
      { field: "address_id", message: "Required" },
      { field: "payment_method", message: "Required" }
    ]), { status: 400 });
  }

  const token = await readCartToken();
  const cart = await getCart(token);
  
  // Clear cart on checkout
  cart.items = [];
  cart.subtotalBdt = 0;
  cart.shippingBdt = 0;
  cart.totalBdt = 0;
  await saveCart(token, cart);

  return Response.json(ok("Checkout successful", { orderId: "OTO-2026-000001" }), { status: 201 });
}
`,
  // Orders
  'orders/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { okPaginated, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";
import { getOrdersData, transformOrder } from "@/lib/mock/store-orders";

export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });
  
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('page_size') || '20', 10);

  const rawOrders = await getOrdersData();
  const orders = rawOrders.map(transformOrder);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  return Response.json(okPaginated("Orders fetched successfully", paginatedOrders, {
    page,
    pageSize,
    totalItems: orders.length,
    totalPages: Math.ceil(orders.length / pageSize)
  }));
}
`,
  'orders/[id]/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, fail, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";
import { getOrdersData, transformOrder } from "@/lib/mock/store-orders";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });

  const { id } = await params;
  const rawOrders = await getOrdersData();
  const rawOrder = rawOrders.find((o: any) => o.id === id);

  if (!rawOrder) {
    return Response.json(fail("Order not found", "ORDER_NOT_FOUND"), { status: 404 });
  }

  return Response.json(ok("Order fetched successfully", transformOrder(rawOrder)));
}
`,
  'orders/[id]/cancel/route.ts': `// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { ok, fail, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";
import { getOrdersData, updateOrderStatus, transformOrder } from "@/lib/mock/store-orders";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!session) return Response.json(unauthorized(), { status: 401 });

  const { id } = await params;
  const rawOrders = await getOrdersData();
  const rawOrder = rawOrders.find((o: any) => o.id === id);

  if (!rawOrder) {
    return Response.json(fail("Order not found", "ORDER_NOT_FOUND"), { status: 404 });
  }

  await updateOrderStatus(id, "cancelled");

  const updatedOrders = await getOrdersData();
  const updatedOrder = updatedOrders.find((o: any) => o.id === id);

  return Response.json(ok("Order cancelled successfully", transformOrder(updatedOrder)));
}
`
};

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(basePath, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log(`Created ${fullPath}`);
}
