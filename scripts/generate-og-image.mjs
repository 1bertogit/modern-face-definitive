/**
 * Script para gerar a OG image default
 * Execute: node scripts/generate-og-image.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const svgPath = join(rootDir, 'public/images/og-default.svg');
const outputPath = join(rootDir, 'public/images/og-default.webp');

async function generateOgImage() {
  try {
    const svgBuffer = readFileSync(svgPath);

    await sharp(svgBuffer)
      .resize(1200, 630)
      .webp({ quality: 90 })
      .toFile(outputPath);

    console.log('✅ OG image generated successfully:', outputPath);
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOgImage();
