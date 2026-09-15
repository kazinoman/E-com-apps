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

  // Fix multi-line validationError in Response.json
  content = content.replace(/return\s+Response\.json\(\s*validationError\(([\s\S]*?)\)\s*,\s*\{\s*status:\s*\d+\s*\}\s*\)/g, 'return validationError($1)');
  
  // Fix let res = Response.json(ok(...), { status: 201 }); return res;
  content = content.replace(/const\s+res\s*=\s*Response\.json\(\s*ok\(([\s\S]*?)\)\s*,\s*\{\s*status:\s*(\d+)\s*\}\s*\);\s*return\s+res;/g, 'return ok($1, $2);');

  // Fix response.json with ok directly: return Response.json(ok(...), { status: ... })
  // We already did this for some, but let's do it for any that didn't match.
  content = content.replace(/return\s+Response\.json\(\s*ok\(([\s\S]*?)\)\s*,\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g, 'return ok($1, $2)');

  fs.writeFileSync(file, content);
}
console.log("Pass 2 done.");
