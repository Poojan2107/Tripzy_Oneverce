import { readdirSync, writeFileSync, existsSync, statSync } from "fs";
import { join } from "path";

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".js")) files.push(full);
  }
  return files;
}

const serverDir = join(process.cwd(), ".next", "server");
if (!existsSync(serverDir)) process.exit(0);

const expectedNft = [
  join(serverDir, "middleware.js.nft.json"),
];

for (const nftPath of expectedNft) {
  if (!existsSync(nftPath)) {
    writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }));
  }
}

for (const file of walk(serverDir)) {
  const nftPath = file + ".nft.json";
  if (!existsSync(nftPath)) {
    writeFileSync(nftPath, JSON.stringify({ version: 1, files: [] }));
  }
}
