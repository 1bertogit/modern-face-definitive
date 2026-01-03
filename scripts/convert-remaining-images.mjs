#!/usr/bin/env node
/**
 * Script para converter imagens JPG/PNG restantes para WebP
 * Converte imagens específicas identificadas na auditoria SEO
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Imagens específicas identificadas na auditoria
const imagesToConvert = [
  {
    input: 'public/images/blog_roberio_autor.jpg',
    output: 'public/images/blog_roberio_autor.webp',
    description: 'Avatar do autor do blog'
  },
  {
    input: 'public/images/techniques/formacao-hero.png',
    output: 'public/images/techniques/formacao-hero.webp',
    description: 'Hero image da página de formação'
  }
];

async function convertImage(inputPath, outputPath) {
  try {
    const fullInputPath = path.join(rootDir, inputPath);
    const fullOutputPath = path.join(rootDir, outputPath);

    if (!fs.existsSync(fullInputPath)) {
      console.log(`⚠️  Arquivo não encontrado: ${inputPath}`);
      return { success: false, error: 'File not found' };
    }

    // Se WebP já existe, pular
    if (fs.existsSync(fullOutputPath)) {
      console.log(`⏭️  Já existe: ${outputPath}`);
      return { success: true, skipped: true };
    }

    const stats = fs.statSync(fullInputPath);
    const originalSize = stats.size;

    // Converter para WebP
    await sharp(fullInputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(fullOutputPath);

    const webpStats = fs.statSync(fullOutputPath);
    const webpSize = webpStats.size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    return {
      success: true,
      originalSize,
      webpSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function main() {
  console.log('🖼️  Convertendo imagens restantes para WebP\n');

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const img of imagesToConvert) {
    console.log(`📸 ${img.description}:`);
    const result = await convertImage(img.input, img.output);

    if (result.success) {
      if (result.skipped) {
        skipped++;
      } else {
        processed++;
        console.log(`   ✅ Convertido: ${formatBytes(result.webpSize)} (${result.savings}% menor)`);
      }
    } else {
      failed++;
      console.log(`   ❌ Erro: ${result.error}`);
    }
  }

  console.log('\n📊 Resumo:');
  console.log(`   ✅ Convertidas: ${processed}`);
  console.log(`   ⏭️  Já existiam: ${skipped}`);
  console.log(`   ❌ Falhas: ${failed}`);

  if (processed > 0) {
    console.log('\n💡 Próximo passo: Atualizar referências no código para usar .webp');
  }
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

