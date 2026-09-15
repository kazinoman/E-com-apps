import fs from 'fs';

const meFile = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1/me/route.ts';
let meContent = fs.readFileSync(meFile, 'utf8');
meContent = meContent.replace(/return Response\.json\(ok\("User profile fetched", (\{[\s\S]*?\})\)\);/, 'return ok($1, "User profile fetched");');
fs.writeFileSync(meFile, meContent);

const ordersFile = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1/orders/route.ts';
let ordersContent = fs.readFileSync(ordersFile, 'utf8');
ordersContent = ordersContent.replace(/return Response\.json\(okPaginated\("Orders fetched successfully", paginatedOrders, (\{[\s\S]*?\})\)\);/, 'return okPaginated(paginatedOrders, $1, "Orders fetched successfully");');
fs.writeFileSync(ordersFile, ordersContent);
