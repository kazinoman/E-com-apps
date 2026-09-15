import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json');

export async function getOrdersData() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading orders data:", error);
    return [];
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const rawOrders = await getOrdersData();
    // Reconstruct original ORD- id if needed, or we just map by transformed ID
    // Actually, let's keep the file intact and just pretend we updated it,
    // or we can write to it. For a mock, updating memory or file is fine.
    // The ID passed in is the transformed ID like OTO-2026-00001.
    // Let's find by original ID:
    const originalId = id.replace('OTO-2026-', 'ORD-');
    
    const orderIndex = rawOrders.findIndex((o: any) => o.id === originalId);
    if (orderIndex >= 0) {
      // For this mock, we might not want to mutate the actual git-tracked json,
      // but the prompt says "updateOrderStatus". Let's mutate it in memory 
      // or write to file. I'll write to file as it's just a mock.
      rawOrders[orderIndex].status = status;
      await fs.writeFile(dataFilePath, JSON.stringify(rawOrders, null, 2), 'utf8');
    }
  } catch (error) {
    console.error("Error updating order:", error);
  }
}

export function transformOrder(rawOrder: any) {
  let mappedStatus = "pending";
  const s = (rawOrder.status || "").toLowerCase();
  
  if (s === "delivered") mappedStatus = "delivered";
  else if (s === "in progress") mappedStatus = "confirmed";
  else if (s === "cancelled") mappedStatus = "cancelled";
  else if (s === "pending") mappedStatus = "pending";
  else if (s === "shipped") mappedStatus = "shipped";
  else mappedStatus = "confirmed";

  // The spec says: Order numbers look like OTO-2026-000001
  const orderId = rawOrder.id.replace('ORD-', 'OTO-2026-');

  // We should also map items to match camelCase, but the fixture already uses camelCase.
  // The prompt only explicitly asks to translate the order status to one of the eight 
  // and the order numbers.
  
  return {
    ...rawOrder,
    id: orderId,
    status: mappedStatus
  };
}
