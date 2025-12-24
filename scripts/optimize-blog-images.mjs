/**
 * Script para otimizar imagens do blog: converter PNG para WebP
 * Execute: node scripts/optimize-blog-images.mjs
 * 
 * Gera versões WebP otimizadas de todas as imagens PNG do blog
 * Mantém os PNGs originais como fallback
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Diretórios de imagens do blog
const blogImageDirs = [
  { path: 'public/images/blog/pt', locale: 'pt' },
  { path: 'public/images/blog/en', locale: 'en' },
  { path: 'public/images/blog/es', locale: 'es' }
];

// Configurações de otimização
const OPTIMIZATION_CONFIG = {
  quality: 85,        // Qualidade WebP (85 é um bom equilíbrio)
  effort: 6,          // Nível de compressão (0-6, 6 é mais lento mas melhor)
  maxWidth: 1920,     // Largura máxima (covers de blog geralmente são 16:10 ou 21:9)
  maxHeight: 1080
};

async function optimizeImage(pngPath, webpPath) {
  try {
    const stats = fs.statSync(pngPath);
    const originalSize = stats.size;

    // Converter para WebP com otimizações
    await sharp(pngPath)
      .resize(OPTIMIZATION_CONFIG.maxWidth, OPTIMIZATION_CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: OPTIMIZATION_CONFIG.quality,
        effort: OPTIMIZATION_CONFIG.effort
      })
      .toFile(webpPath);

    const webpStats = fs.statSync(webpPath);
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

async function processDirectory(dirPath, locale) {
  const fullPath = path.join(rootDir, dirPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`   ⚠️  Diretório não existe: ${dirPath}`);
    return { processed: 0, skipped: 0, failed: 0, totalSavings: 0 };
  }

  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.png'));
  
  if (files.length === 0) {
    console.log(`   ℹ️  Nenhuma imagem PNG encontrada em ${dirPath}`);
    return { processed: 0, skipped: 0, failed: 0, totalSavings: 0 };
  }

  console.log(`\n📁 ${locale}: ${files.length} imagem(ns) encontrada(s)`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let totalSavings = 0;

  for (const file of files) {
    const pngPath = path.join(fullPath, file);
    const webpPath = pngPath.replace(/\.png$/, '.webp');

    // Se WebP já existe, pular
    if (fs.existsSync(webpPath)) {
      skipped++;
      continue;
    }

    const result = await optimizeImage(pngPath, webpPath);

    if (result.success) {
      processed++;
      totalSavings += result.savings;
      console.log(`   ✅ ${file} → ${formatBytes(result.webpSize)} (${result.savings}% menor)`);
    } else {
      failed++;
      console.log(`   ❌ ${file}: ${result.error}`);
    }
  }

  return { processed, skipped, failed, totalSavings };
}

async function main() {
  console.log('='.repeat(70));
  console.log('🖼️  OTIMIZADOR DE IMAGENS DO BLOG (PNG → WebP)');
  console.log('='.repeat(70));
  console.log('\n📊 Configurações:');
  console.log(`   Qualidade: ${OPTIMIZATION_CONFIG.quality}%`);
  console.log(`   Largura máxima: ${OPTIMIZATION_CONFIG.maxWidth}px`);
  console.log(`   Altura máxima: ${OPTIMIZATION_CONFIG.maxHeight}px`);
  console.log(`   Esforço de compressão: ${OPTIMIZATION_CONFIG.effort}/6`);

  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let grandTotalSavings = 0;

  for (const { path: dirPath, locale } of blogImageDirs) {
    const result = await processDirectory(dirPath, locale);
    totalProcessed += result.processed;
    totalSkipped += result.skipped;
    totalFailed += result.failed;
    grandTotalSavings += result.totalSavings;
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 RESUMO FINAL');
  console.log('='.repeat(70));
  console.log(`✅ Processadas: ${totalProcessed} imagem(ns)`);
  console.log(`⏭️  Puladas (já existem): ${totalSkipped} imagem(ns)`);
  console.log(`❌ Falhas: ${totalFailed} imagem(ns)`);
  
  if (totalProcessed > 0) {
    const avgSavings = (grandTotalSavings / totalProcessed).toFixed(1);
    console.log(`\n💾 Economia média: ${avgSavings}% por imagem`);
    console.log(`📉 Economia total estimada: ${grandTotalSavings.toFixed(1)}%`);
  }

  console.log('\n✨ Otimização concluída!');
  console.log('\n💡 Próximos passos:');
  console.log('   1. Atualizar componentes para usar .webp com fallback .png');
  console.log('   2. Testar visualmente no site');
  console.log('   3. Verificar performance no Lighthouse');
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

