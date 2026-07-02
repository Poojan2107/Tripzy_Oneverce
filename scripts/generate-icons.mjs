import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

async function generateIcons() {
  const svgBuffer = readFileSync(join(root, 'public/icons/icon-512.svg'));

  const sizes = [192, 512];

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(root, `public/icons/icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  // Also generate apple-touch-icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(root, 'public/icons/apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
}

generateIcons().catch(console.error);
