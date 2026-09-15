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

  // 1. Argument order reversed for ok()
  // Matches ok("message", data) or ok('message', data)
  // Need to be careful. ok("message") without data shouldn't be swapped if there's only 1 arg. Wait, the mock envelope is ok<T>(data: T, message = "Success", status = 200). 
  // If they pass ok("message", data), it's string, then data.
  content = content.replace(/ok\(\s*(["'`].*?["'`])\s*,\s*(.*?)\s*\)/g, (match, msg, data) => {
    return `ok(${data}, ${msg})`;
  });

  // 2. Double wrapping.
  // return Response.json(ok(...), { status: 201 })
  content = content.replace(/return\s+Response\.json\(\s*ok\((.*?)\)\s*,\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g, 'return ok($1, $2)');
  content = content.replace(/return\s+Response\.json\(\s*ok\((.*?)\)\s*\)/g, 'return ok($1)');
  
  content = content.replace(/return\s+Response\.json\(\s*fail\((.*?)\)\s*,\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g, 'return fail($1, $2)');
  content = content.replace(/return\s+Response\.json\(\s*fail\((.*?)\)\s*\)/g, 'return fail($1)');

  content = content.replace(/return\s+Response\.json\(\s*validationError\((.*?)\)\s*,\s*\{\s*status:\s*\d+\s*\}\s*\)/g, 'return validationError($1)');
  content = content.replace(/return\s+Response\.json\(\s*validationError\((.*?)\)\s*\)/g, 'return validationError($1)');

  content = content.replace(/return\s+Response\.json\(\s*unauthorized\(\)\s*,\s*\{\s*status:\s*\d+\s*\}\s*\)/g, 'return unauthorized()');
  content = content.replace(/return\s+Response\.json\(\s*unauthorized\(\)\s*\)/g, 'return unauthorized()');
  
  content = content.replace(/return\s+Response\.json\(\s*notFound\((.*?)\)\s*,\s*\{\s*status:\s*\d+\s*\}\s*\)/g, 'return notFound($1)');
  content = content.replace(/return\s+Response\.json\(\s*notFound\((.*?)\)\s*\)/g, 'return notFound($1)');

  // 4. Sync helpers.
  content = content.replace(/await\s+getCart\(/g, 'getCart(');
  content = content.replace(/await\s+saveCart\(/g, 'saveCart(');
  content = content.replace(/await\s+getWishlist\(/g, 'getWishlist(');
  content = content.replace(/await\s+saveWishlist\(/g, 'saveWishlist(');
  
  fs.writeFileSync(file, content);
}
console.log("Basic replacements done.");
