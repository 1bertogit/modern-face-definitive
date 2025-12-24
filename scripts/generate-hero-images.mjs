/**
 * Script para gerar versões responsivas da imagem hero
 * Execute: node scripts/generate-hero-images.mjs
 * 
 * Gera 3 versões otimizadas:
 * - 412w: Mobile (< 640px)
 * - 824w: Tablet/Desktop (640px - 1024px)
 * - 1200w: Large Desktop (> 1024px)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const inputPath = join(rootDir, 'public/image-dr-roberio-brandao.webp');
const outputDir = join(rootDir, 'public/images/hero');

// Criar diretório se não existir
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Dimensões para gerar (largura em pixels)
// Mantendo aspect ratio aproximado de 547:961 (≈ 0.57)
const sizes = [
  { width: 412, height: 720 },   // Mobile
  { width: 824, height: 1440 },   // Tablet/Desktop (2x mobile)
  { width: 1200, height: 2100 }  // Large Desktop
];

async function generateHeroImages() {
  try {
    console.log('🖼️  Gerando versões responsivas da imagem hero...\n');

    // Verificar se a imagem original existe
    if (!existsSync(inputPath)) {
      console.error(`❌ Imagem original não encontrada: ${inputPath}`);
      process.exit(1);
    }

    const results = [];

    for (const size of sizes) {
      const outputPath = join(outputDir, `dr-roberio-${size.width}w.webp`);
      
      await sharp(inputPath)
        .resize(size.width, size.height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ 
          quality: 85,  // Balance entre qualidade e tamanho
          effort: 6     // Compressão mais agressiva
        })
        .toFile(outputPath);

      // Obter tamanho do arquivo gerado
      const fileStats = statSync(outputPath);
      const fileSizeKB = (fileStats.size / 1024).toFixed(1);

      results.push({
        width: size.width,
        path: outputPath.replace(rootDir, ''),
        size: fileSizeKB
      });

      console.log(`✅ Gerado: ${size.width}w (${fileSizeKB} KB)`);
    }

    console.log('\n📊 Resumo:');
    console.log('─'.repeat(50));
    results.forEach(r => {
      console.log(`  ${r.path.padEnd(35)} ${r.size.padStart(6)} KB`);
    });
    console.log('─'.repeat(50));
    
    const totalSize = results.reduce((sum, r) => sum + parseFloat(r.size), 0);
    console.log(`\n💾 Tamanho total: ${totalSize.toFixed(1)} KB`);
    console.log(`📉 Economia estimada: ~${(127 - totalSize).toFixed(1)} KB vs imagem original (127 KB)`);
    console.log('\n✨ Imagens hero responsivas geradas com sucesso!');
    console.log('\n📝 Próximo passo: Atualizar EditorialHero.astro com srcset');
    
  } catch (error) {
    console.error('❌ Erro ao gerar imagens:', error.message);
    process.exit(1);
  }
}

generateHeroImages();

