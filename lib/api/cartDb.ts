import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'carts.json');

// Global In-memory store for Vercel serverless environment
if (!(globalThis as any).memoryCarts) {
  (globalThis as any).memoryCarts = null;
}

export function getAllCarts(): Record<string, any[]> {
  if ((globalThis as any).memoryCarts) return (globalThis as any).memoryCarts;
  
  try {
    if (!fs.existsSync(dataFilePath)) {
      (globalThis as any).memoryCarts = {};
      return (globalThis as any).memoryCarts;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    (globalThis as any).memoryCarts = JSON.parse(fileData);
    return (globalThis as any).memoryCarts || {};
  } catch (error) {
    console.error('Error reading carts:', error);
    (globalThis as any).memoryCarts = {};
    return (globalThis as any).memoryCarts;
  }
}

export function saveAllCarts(carts: Record<string, any[]>) {
  (globalThis as any).memoryCarts = carts;
  
  // Only attempt to write to disk if not on Vercel/Production
  if (process.env.VERCEL) return;
  
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(carts, null, 2));
  } catch (error) {
    console.error('Error saving carts (expected in Serverless):', error);
  }
}

export function getUserCart(userId: string): any[] {
  const carts = getAllCarts();
  return carts[userId] || [];
}

export function saveUserCart(userId: string, cart: any[]) {
  const carts = getAllCarts();
  carts[userId] = cart;
  saveAllCarts(carts);
}
