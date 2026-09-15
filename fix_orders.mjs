import fs from 'fs';

const cFile = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1/orders/[id]/cancel/route.ts';
let cContent = fs.readFileSync(cFile, 'utf8');
cContent = cContent.replace(/ok\(transformOrder\(updatedOrder, "Order cancelled successfully"\)\);/, 'ok(transformOrder(updatedOrder), "Order cancelled successfully");');
fs.writeFileSync(cFile, cContent);

const oFile = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1/orders/[id]/route.ts';
let oContent = fs.readFileSync(oFile, 'utf8');
oContent = oContent.replace(/ok\(transformOrder\(rawOrder, "Order fetched successfully"\)\);/, 'ok(transformOrder(rawOrder), "Order fetched successfully");');
fs.writeFileSync(oFile, oContent);
