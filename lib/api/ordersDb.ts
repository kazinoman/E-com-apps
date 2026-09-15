import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json');

// Global In-memory store for Vercel serverless environment
// Using globalThis ensures that during hot reloads or multiple imports, the same array is used.
if (!(globalThis as any).memoryOrders) {
  (globalThis as any).memoryOrders = null;
}

export function getOrders(): any[] {
  if ((globalThis as any).memoryOrders) return (globalThis as any).memoryOrders;
  
  try {
    if (!fs.existsSync(dataFilePath)) {
      (globalThis as any).memoryOrders = [];
      return (globalThis as any).memoryOrders;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    (globalThis as any).memoryOrders = JSON.parse(fileData);
    return (globalThis as any).memoryOrders || [];
  } catch (error) {
    console.error('Error reading orders:', error);
    (globalThis as any).memoryOrders = [];
    return (globalThis as any).memoryOrders;
  }
}

export function saveOrders(orders: any[]) {
  (globalThis as any).memoryOrders = orders;
  
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
