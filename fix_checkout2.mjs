import fs from 'fs';
const file = '/home/sonnet/Projects/1688/frontend_v2/app/api/v1/checkout/route.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/let token = await readCartToken\(\);[\s\S]*?token = 'guest';\n  \}/, `let token = await readCartToken();
  if (!token) {
    token = newToken();
    (await cookies()).set(CART_COOKIE.name, token, { maxAge: CART_COOKIE.maxAge, path: "/", httpOnly: true, sameSite: "lax" });
  }`);

content = content.replace(/import \{([^}]+)\} from "@\/lib\/mock\/store"/, `import { $1, CART_COOKIE } from "@/lib/mock/store"`);
if (!content.includes('import { cookies }')) {
  content = `import { cookies } from "next/headers";\n` + content;
}

fs.writeFileSync(file, content);
