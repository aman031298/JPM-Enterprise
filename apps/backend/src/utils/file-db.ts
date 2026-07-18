import fs from "node:fs/promises";
import path from "node:path";

const dataRoot = path.resolve(process.cwd(), "../../mock-data");

export async function readCollection<T>(name: string): Promise<T[]> {
  const filePath = path.join(dataRoot, `${name}.json`);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content) as T[];
}

export async function writeCollection<T>(name: string, records: T[]): Promise<void> {
  const filePath = path.join(dataRoot, `${name}.json`);
  await fs.writeFile(filePath, JSON.stringify(records, null, 2));
}
