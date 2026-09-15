import fs from 'fs';
import path from 'path';

const basePath = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1';
const dirs = ['cart', 'wishlist', 'auth', 'me', 'checkout', 'orders'];

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('route.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allRoutes = dirs.flatMap(d => getAllFiles(path.join(basePath, d)));

for (const file of allRoutes) {
  let content = fs.readFileSync(file, 'utf8');

  // Let's add newToken, CART_COOKIE, SESSION_COOKIE to imports from @/lib/mock/store if missing, and used.
  if (content.includes('saveCart(') || content.includes('saveWishlist(')) {
    if (!content.includes('newToken')) {
      content = content.replace(/import \{([^}]+)\} from "@\/lib\/mock\/store"/g, (match, p1) => {
        const parts = p1.split(',').map(s => s.trim());
        if (!parts.includes('newToken')) parts.push('newToken');
        if (file.includes('/cart') && !parts.includes('CART_COOKIE')) parts.push('CART_COOKIE');
        if (file.includes('/wishlist') && !parts.includes('SESSION_COOKIE')) parts.push('SESSION_COOKIE');
        if (file.includes('/wishlist') && !parts.includes('CART_COOKIE')) parts.push('CART_COOKIE'); // wishlist uses both
        return `import { ${parts.join(', ')} } from "@/lib/mock/store"`;
      });
    }
  }
  
  // Also import `recalculate` if we mutate cart
  if (file.includes('/cart') && (content.includes('saveCart(') || content.includes('cart.items.push'))) {
    content = content.replace(/import \{([^}]+)\} from "@\/lib\/mock\/store"/g, (match, p1) => {
      const parts = p1.split(',').map(s => s.trim());
      if (!parts.includes('recalculate')) parts.push('recalculate');
      return `import { ${parts.join(', ')} } from "@/lib/mock/store"`;
    });
  }

  // CART tokens null check
  if (file.includes('cart/items/route.ts') || file.includes('cart/items/[id]/route.ts')) {
    // Replace const token = await readCartToken();
    content = content.replace(/const token = await readCartToken\(\);/, `let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }`);
    content = content.replace(/let token = await readCartToken\(\);/, `let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }`);
    // also remove the old cookie store check
    content = content.replace(/let cookieSet = false;[\s\S]*?cookieSet = true;\n\s*\}/, '');
    
    // Some routes might already have `let token` instead of `const token` because we ran this previously
    // Actually, wait, let's just make sure we don't duplicate the if (!token) block.
  }

  // WISHLIST tokens null check
  if (file.includes('wishlist/items/route.ts') || file.includes('wishlist/items/[productId]/route.ts')) {
    if (!content.includes('cookies }')) {
      content = `import { cookies } from "next/headers";\n` + content;
    }
    // "saveCart/saveWishlist need a non-null key. Where the caller may not have one yet (first add to cart), mint one with newToken(), set the cookie, and use it:"
    // Replace `const session = await readSession();`
    // Ensure we don't duplicate it.
    if (!content.includes('let key = session || cartToken;')) {
      content = content.replace(/const session = await readSession\(\);/, `const session = await readSession();
  let cartToken = await readCartToken();
  let key = session || cartToken;
  if (!key) {
    key = newToken();
    (await cookies()).set(CART_COOKIE.name, key, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }`);
    }
    content = content.replace(/session \|\| 'guest'/g, 'key');
    content = content.replace(/import \{([^}]+)\} from "@\/lib\/mock\/store"/g, (match, p1) => {
      const parts = p1.split(',').map(s => s.trim());
      if (!parts.includes('readCartToken')) parts.push('readCartToken');
      return `import { ${parts.join(', ')} } from "@/lib/mock/store"`;
    });
  }

  // Remove manual cart calculations and use recalculate() before saveCart
  content = content.replace(/cart\.subtotalBdt\s*=\s*.*?;\s*cart\.shippingBdt\s*=\s*.*?;\s*cart\.totalBdt\s*=\s*.*?;/g, 'recalculate(cart);');

  fs.writeFileSync(file, content);
}
console.log("Pass 3 done.");
