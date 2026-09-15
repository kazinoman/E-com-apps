const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');
const rawData = fs.readFileSync(dbPath, 'utf-8');
const data = JSON.parse(rawData);

if (data.products) {
  data.products = data.products.map(product => {
    // Generate a random sold number between 100 and 20000 if not already present
    const randomSold = Math.floor(Math.random() * (20000 - 100 + 1)) + 100;
    return {
      ...product,
      sold: product.sold || randomSold
    };
  });
  
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Successfully added "sold" property to all products.');
} else {
  console.log('No products array found in db.json');
}
