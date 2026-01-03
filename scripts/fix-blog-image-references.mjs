#!/usr/bin/env node
/**
 * Script para corrigir referências de imagens nos arquivos MDX do blog
 * Mapeia imagens referenciadas para imagens existentes na pasta
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const blogDir = path.join(rootDir, 'src/content/blog/pt');
const imageDir = path.join(rootDir, 'public/images/blog/pt');

/**
 * Normaliza string para comparação (remove acentos, lower case, etc)
 */
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Extrai palavras-chave do nome do arquivo MDX
 */
function extractKeywords(filename) {
  const baseName = filename.replace('.mdx', '').replace(/^\d+-/, '');
  const words = baseName.split('-').filter(w => w.length > 2);
  return new Set(words);
}

/**
 * Encontra a melhor correspondência de imagem
 */
function findBestMatch(referencedImage, existingImages, mdxFilename) {
  const refNormalized = normalize(referencedImage.replace('.webp', ''));
  const mdxKeywords = extractKeywords(mdxFilename);
  
  // Tentar correspondência exata normalizada primeiro
  for (const existing of existingImages) {
    const existNormalized = normalize(existing.replace('.webp', ''));
    if (refNormalized === existNormalized) {
      return existing;
    }
  }
  
  // Tentar correspondência parcial (contém palavras-chave do MDX)
  let bestMatch = null;
  let bestScore = 0;
  
  for (const existing of existingImages) {
    const existNormalized = normalize(existing.replace('.webp', ''));
    const existKeywords = new Set(existNormalized.split('-').filter(w => w.length > 2));
    
    // Contar palavras-chave em comum
    const commonKeywords = [...mdxKeywords].filter(k => existKeywords.has(k));
    const score = commonKeywords.length;
    
    // Bonus se o nome referenciado contém o existente ou vice-versa
    if (existNormalized.includes(refNormalized) || refNormalized.includes(existNormalized)) {
      if (score > bestScore) {
        bestScore = score + 0.5;
        bestMatch = existing;
      }
    } else if (score > bestScore) {
      bestScore = score;
      bestMatch = existing;
    }
  }
  
  // Só retornar se tiver pelo menos 2 palavras-chave em comum
  return bestScore >= 2 ? bestMatch : null;
}

/**
 * Processa um arquivo MDX
 */
function processFile(mdxFile, imageMap) {
  const filePath = path.join(blogDir, mdxFile);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Encontrar linha com image:
  const imageMatch = content.match(/^image:\s*"([^"]+)"/m);
  if (!imageMatch) {
    return { processed: false, reason: 'no-image-field' };
  }
  
  const oldImagePath = imageMatch[1];
  const oldImageName = oldImagePath.replace('/images/blog/pt/', '').replace('.webp', '');
  
  // Encontrar melhor correspondência
  const bestMatch = findBestMatch(oldImageName, Object.keys(imageMap), mdxFile);
  
  if (!bestMatch) {
    return { processed: false, reason: 'no-match', oldImage: oldImageName };
  }
  
  const newImagePath = `/images/blog/pt/${bestMatch}`;
  
  // Se já está correto, não precisa mudar
  if (oldImagePath === newImagePath) {
    return { processed: false, reason: 'already-correct' };
  }
  
  // Substituir no conteúdo
  const newContent = content.replace(
    /^image:\s*"[^"]+"/m,
    `image: "${newImagePath}"`
  );
  
  // Salvar
  fs.writeFileSync(filePath, newContent, 'utf-8');
  
  return {
    processed: true,
    oldImage: oldImageName,
    newImage: bestMatch,
    oldPath: oldImagePath,
    newPath: newImagePath
  };
}

/**
 * Main
 */
function main() {
  console.log('🔍 Analisando imagens do blog PT...\n');
  
  // Ler imagens existentes
  if (!fs.existsSync(imageDir)) {
    console.error(`❌ Diretório de imagens não encontrado: ${imageDir}`);
    process.exit(1);
  }
  
  const existingImages = fs.readdirSync(imageDir)
    .filter(f => f.endsWith('.webp'))
    .map(f => f);
  
  console.log(`📁 Imagens existentes: ${existingImages.length}`);
  
  // Criar mapa de imagens normalizadas
  const imageMap = {};
  for (const img of existingImages) {
    const normalized = normalize(img.replace('.webp', ''));
    if (!imageMap[normalized]) {
      imageMap[normalized] = img;
    }
  }
  
  // Ler arquivos MDX
  if (!fs.existsSync(blogDir)) {
    console.error(`❌ Diretório de blog não encontrado: ${blogDir}`);
    process.exit(1);
  }
  
  const mdxFiles = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.mdx'));
  
  console.log(`📄 Arquivos MDX: ${mdxFiles.length}\n`);
  
  // Processar cada arquivo
  let processed = 0;
  let skipped = 0;
  let noMatch = 0;
  const changes = [];
  
  for (const mdxFile of mdxFiles) {
    const result = processFile(mdxFile, imageMap);
    
    if (result.processed) {
      processed++;
      changes.push({
        file: mdxFile,
        old: result.oldImage,
        new: result.newImage
      });
      console.log(`✅ ${mdxFile}`);
      console.log(`   ${result.oldImage} → ${result.newImage}`);
    } else if (result.reason === 'no-match') {
      noMatch++;
      console.log(`⚠️  ${mdxFile} - Sem correspondência para: ${result.oldImage}`);
    } else if (result.reason === 'already-correct') {
      skipped++;
    } else {
      skipped++;
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`  ✅ Corrigidos: ${processed}`);
  console.log(`  ⏭️  Já corretos ou sem campo image: ${skipped}`);
  console.log(`  ⚠️  Sem correspondência: ${noMatch}`);
  
  if (processed > 0) {
    console.log(`\n✨ ${processed} arquivos atualizados com sucesso!`);
  }
}

main();

