import fs from 'fs/promises';
import path from 'path';

// Define path to the mock database
const dataFilePath = path.join(process.cwd(), 'data', 'db.json');

export async function getDbData() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading mock data:", error);
    return null;
  }
}

export async function writeDbData(data: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Error writing mock data:", error);
    return false;
  }
}
