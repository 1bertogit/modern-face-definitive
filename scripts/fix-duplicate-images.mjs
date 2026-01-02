#!/usr/bin/env node
/**
 * Script para corrigir imagens duplicadas nos arquivos MDX do blog
 * Garante que cada artigo tenha uma imagem única
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const blogDir = path.join(rootDir, 'src/content/blog/pt');
const imageDir = path.join(rootDir, 'public/images/blog/pt');

// Mapeamento específico de artigos que devem usar imagens específicas
const imageMappings = {
  // Anatomia do SMAS - usar imagem específica
  'anatomia-do-smas-fundamentos-para-cirurgioes-de-face-moderna.mdx': 'anatomia-smas-fundamentos.webp',
  'anatomia-smas-e-espacos-faciais-o-guia-definitivo-para-cirur.mdx': 'anatomia-smas-espacos-faciais-fundamentos.webp',
  
  // Cicatriz
  'cicatriz-do-lifting-facial-localizacao-e-cuidados.mdx': 'cicatriz-lifting-facial-cuidados.webp',
  'quanto-tempo-dura-o-lifting-facial-guia-completo-2025.mdx': 'tempo-duracao-resultado-lifting.webp',
  
  // Como escolher/se tornar cirurgião
  'como-escolher-cirurgiao-para-lifting-guia-completo.mdx': 'escolhendo-cirurgiao-lifting-facial.webp',
  'como-se-tornar-um-cirurgiao-de-face-moderna-o-caminho-comple.mdx': 'como-se-tornar-cirurgiao-face-moderna.webp',
  
  // Complicações
  'complicacoes-em-lifting-facial-prevencao-identificacao-e-man.mdx': 'complicacoes-lifting-facial-prevencao.webp',
  'lifting-facial-aos-40-anos-prevencao-inteligente.mdx': 'lifting-facial-40-anos.webp',
  
  // Endomidface
  'endomidface-por-visao-direta-guia-completo-2025.mdx': 'endomidface-guia-completo.webp',
  'endomidface-por-visao-direta-tecnica-completa.mdx': 'endomidface-por-visao-direta-tecnica.webp',
  
  // Face Moderna
  'face-moderna-a-filosofia-que-revolucionou-a-cirurgia-facial.mdx': 'face-moderna-conceito-filosofia.webp',
  'o-que-e-face-moderna-a-nova-era-da-cirurgia-facial.mdx': 'o-que-e-face-moderna.webp',
  
  // Lifting aos 50/60
  'primeiro-lifting-aos-50-anos-guia-completo-2025.mdx': 'primeiro-lifting-50-anos-guia.webp',
  'lifting-aos-60-anos-guia-completo-2025.mdx': 'lifting-facial-60-anos.webp',
};

/**
 * Normaliza string para comparação
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
 * Encontra imagem similar disponível
 */
function findSimilarImage(targetImage, availableImages, excludeImages) {
  const targetNormalized = normalize(targetImage.replace('.webp', ''));
  const targetWords = new Set(targetNormalized.split('-').filter(w => w.length > 2));
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const img of availableImages) {
    if (excludeImages.includes(img)) continue;
    
    const imgNormalized = normalize(img.replace('.webp', ''));
    const imgWords = new Set(imgNormalized.split('-').filter(w => w.length > 2));
    
    // Contar palavras em comum
    const commonWords = [...targetWords].filter(w => imgWords.has(w));
    const score = commonWords.length;
    
    if (score > bestScore && score >= 2) {
      bestScore = score;
      bestMatch = img;
    }
  }
  
  return bestMatch;
}

/**
 * Processa um arquivo MDX
 */
function processFile(mdxFile, availableImages, usedImages) {
  const filePath = path.join(blogDir, mdxFile);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Verificar se há mapeamento específico
  if (imageMappings[mdxFile]) {
    const newImage = imageMappings[mdxFile];
    const newImagePath = `/images/blog/pt/${newImage}`;
    
    // Verificar se a imagem existe
    if (!fs.existsSync(path.join(imageDir, newImage))) {
      console.log(`⚠️  ${mdxFile}: Imagem mapeada não existe: ${newImage}`);
      return { processed: false, reason: 'mapped-image-not-found' };
    }
    
    // Substituir
    const newContent = content.replace(
      /^image:\s*"[^"]+"/m,
      `image: "${newImagePath}"`
    );
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return { processed: true, newImage, reason: 'mapped' };
    }
  }
  
  // Encontrar imagem atual
  const imageMatch = content.match(/^image:\s*"([^"]+)"/m);
  if (!imageMatch) {
    return { processed: false, reason: 'no-image' };
  }
  
  const currentImage = imageMatch[1].replace('/images/blog/pt/', '');
  
  // Se já está em uso por outro arquivo, encontrar alternativa
  if (usedImages.has(currentImage)) {
    const alternative = findSimilarImage(currentImage, availableImages, Array.from(usedImages));
    
    if (alternative) {
      const newImagePath = `/images/blog/pt/${alternative}`;
      const newContent = content.replace(
        /^image:\s*"[^"]+"/m,
        `image: "${newImagePath}"`
      );
      
      fs.writeFileSync(filePath, newContent, 'utf-8');
      usedImages.add(alternative);
      return { processed: true, oldImage: currentImage, newImage: alternative, reason: 'duplicate-fixed' };
    } else {
      return { processed: false, reason: 'no-alternative', currentImage };
    }
  }
  
  usedImages.add(currentImage);
  return { processed: false, reason: 'unique' };
}

/**
 * Main
 */
function main() {
  console.log('🔍 Corrigindo imagens duplicadas...\n');
  
  // Ler imagens disponíveis
  const availableImages = fs.readdirSync(imageDir)
    .filter(f => f.endsWith('.webp'))
    .map(f => f);
  
  console.log(`📁 Imagens disponíveis: ${availableImages.length}`);
  
  // Ler arquivos MDX
  const mdxFiles = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.mdx'));
  
  console.log(`📄 Arquivos MDX: ${mdxFiles.length}\n`);
  
  // Processar arquivos (primeiro os que têm mapeamento específico)
  const usedImages = new Set();
  let processed = 0;
  let mapped = 0;
  let duplicatesFixed = 0;
  const issues = [];
  
  // Processar arquivos com mapeamento primeiro
  const mappedFiles = mdxFiles.filter(f => imageMappings[f]);
  const otherFiles = mdxFiles.filter(f => !imageMappings[f]);
  
  for (const mdxFile of [...mappedFiles, ...otherFiles]) {
    const result = processFile(mdxFile, availableImages, usedImages);
    
    if (result.processed) {
      if (result.reason === 'mapped') {
        mapped++;
        usedImages.add(result.newImage);
        console.log(`✅ ${mdxFile}`);
        console.log(`   → ${result.newImage} (mapeado)`);
      } else if (result.reason === 'duplicate-fixed') {
        duplicatesFixed++;
        console.log(`🔄 ${mdxFile}`);
        console.log(`   ${result.oldImage} → ${result.newImage}`);
      }
      processed++;
    } else if (result.reason === 'no-alternative') {
      issues.push({ file: mdxFile, image: result.currentImage });
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`  ✅ Processados: ${processed}`);
  console.log(`  📌 Mapeados: ${mapped}`);
  console.log(`  🔄 Duplicatas corrigidas: ${duplicatesFixed}`);
  
  if (issues.length > 0) {
    console.log(`\n⚠️  Arquivos sem alternativa:`);
    issues.forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.image}`);
    });
  }
  
  console.log(`\n✨ Correção concluída!`);
}

main();

