import fs from 'fs';
const file = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1/cart/route.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/const token = await readCartToken\(\);/, `let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }`);
// Also fix DELETE
content = content.replace(/const token = await readCartToken\(\);/, `let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }`);
// And remove recalculate(cart) since saveCart calls it
content = content.replace(/recalculate\(cart\);\n\s*saveCart\(token, cart\);/, `saveCart(token, cart);`);
fs.writeFileSync(file, content);
