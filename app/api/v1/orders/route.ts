// Mock API mirroring the real contract
// NEXT_PUBLIC_API_BASE=http://127.0.0.1:3001/api/v1 switches to this mock
import { okPaginated, unauthorized } from "@/lib/mock/envelope";
import { readSession } from "@/lib/mock/store";
import { getOrdersData, transformOrder } from "@/lib/mock/store-orders";

export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return unauthorized();
  
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const pageSize = parseInt(url.searchParams.get('page_size') || '20', 10);

  const rawOrders = await getOrdersData();
  const orders = rawOrders.map(transformOrder);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  return okPaginated(paginatedOrders, {
    page,
    pageSize,
    totalItems: orders.length,
    totalPages: Math.ceil(orders.length / pageSize)
  }, "Orders fetched successfully");
}
