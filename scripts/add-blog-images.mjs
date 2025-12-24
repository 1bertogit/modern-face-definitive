#!/usr/bin/env node
/**
 * Script para adicionar propriedade 'image' ao frontmatter dos posts do blog
 * Baseado no canonicalSlug ou nome do arquivo
 */

import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIRS = [
  { path: 'src/content/blog/pt', locale: 'pt' },
  { path: 'src/content/blog/en', locale: 'en' },
  { path: 'src/content/blog/es', locale: 'es' }
];

/**
 * Escaneia recursivamente um diretório procurando arquivos .mdx
 */
function scanDir(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extrai frontmatter de um arquivo MDX
 */
function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;
  
  return frontmatterMatch[1];
}

/**
 * Adiciona propriedade image ao frontmatter
 */
function addImageToFrontmatter(frontmatter, imagePath) {
  // Verifica se já existe image
  if (frontmatter.match(/^image:/m)) {
    return null; // Já tem image, não modificar
  }
  
  // Tenta encontrar canonicalSlug ou usar o nome do arquivo
  const canonicalSlugMatch = frontmatter.match(/^canonicalSlug:\s*["']?([^"'\n]+)["']?/m);
  const slug = canonicalSlugMatch ? canonicalSlugMatch[1].trim() : null;
  
  // Adiciona image após articleType ou antes de faq (ou no final se não encontrar)
  let newFrontmatter = frontmatter;
  
  // Busca posição para inserir (após articleType ou antes de faq)
  const articleTypeMatch = frontmatter.match(/^(articleType:.*)$/m);
  const faqMatch = frontmatter.match(/^(faq:.*)$/m);
  
  if (articleTypeMatch) {
    // Inserir após articleType
    const insertPos = frontmatter.indexOf(articleTypeMatch[0]) + articleTypeMatch[0].length;
    newFrontmatter = 
      frontmatter.substring(0, insertPos) + 
      `\nimage: "${imagePath}"` +
      frontmatter.substring(insertPos);
  } else if (faqMatch) {
    // Inserir antes de faq
    const insertPos = frontmatter.indexOf(faqMatch[0]);
    newFrontmatter = 
      frontmatter.substring(0, insertPos) + 
      `image: "${imagePath}"\n` +
      frontmatter.substring(insertPos);
  } else {
    // Inserir no final
    newFrontmatter = frontmatter + `\nimage: "${imagePath}"`;
  }
  
  return newFrontmatter;
}

/**
 * Gera caminho da imagem baseado no slug e locale
 */
function getImagePath(slug, locale, filename) {
  // Remove extensão do filename se existir
  const baseName = filename.replace(/\.mdx$/, '');
  
  // Usa slug se disponível, senão usa baseName
  const imageSlug = slug || baseName;
  
  return `/images/blog/${locale}/${imageSlug}.png`;
}

/**
 * Verifica se a imagem existe
 */
function imageExists(imagePath) {
  const publicPath = path.join(process.cwd(), 'public', imagePath);
  return fs.existsSync(publicPath);
}

/**
 * Processa um arquivo MDX
 */
function processFile(filePath, locale) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatter = extractFrontmatter(content);
  
  if (!frontmatter) {
    console.log(`⚠️  Sem frontmatter: ${filePath}`);
    return { processed: false, reason: 'no-frontmatter' };
  }
  
  // Verifica se já tem image
  if (frontmatter.match(/^image:/m)) {
    return { processed: false, reason: 'already-has-image' };
  }
  
  // Extrai canonicalSlug ou usa nome do arquivo
  const canonicalSlugMatch = frontmatter.match(/^canonicalSlug:\s*["']?([^"'\n]+)["']?/m);
  const slug = canonicalSlugMatch ? canonicalSlugMatch[1].trim() : null;
  
  const filename = path.basename(filePath);
  const imagePath = getImagePath(slug, locale, filename);
  
  // Verifica se imagem existe
  if (!imageExists(imagePath)) {
    return { processed: false, reason: 'image-not-found', imagePath };
  }
  
  // Adiciona image ao frontmatter
  const newFrontmatter = addImageToFrontmatter(frontmatter, imagePath);
  
  if (!newFrontmatter) {
    return { processed: false, reason: 'already-has-image' };
  }
  
  // Substitui frontmatter no conteúdo
  const newContent = content.replace(/^---\s*\n[\s\S]*?\n---/, `---\n${newFrontmatter}\n---`);
  
  // Salva arquivo
  fs.writeFileSync(filePath, newContent, 'utf-8');
  
  return { processed: true, imagePath };
}

/**
 * Processa todos os posts do blog
 */
function main() {
  console.log('🔄 Processando posts do blog para adicionar propriedade image...\n');
  
  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalNotFound = 0;
  
  for (const { path: blogPath, locale } of BLOG_DIRS) {
    const fullPath = path.join(process.cwd(), blogPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Diretório não encontrado: ${fullPath}`);
      continue;
    }
    
    const files = scanDir(fullPath);
    console.log(`\n📁 ${locale}: ${files.length} arquivos encontrados`);
    
    for (const filePath of files) {
      const relativePath = path.relative(process.cwd(), filePath);
      const result = processFile(filePath, locale);
      
      if (result.processed) {
        console.log(`  ✅ ${path.basename(filePath)} → ${result.imagePath}`);
        totalProcessed++;
      } else if (result.reason === 'image-not-found') {
        console.log(`  ⚠️  ${path.basename(filePath)} → Imagem não encontrada: ${result.imagePath}`);
        totalNotFound++;
      } else if (result.reason === 'already-has-image') {
        totalSkipped++;
      } else {
        totalSkipped++;
      }
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`  ✅ Processados: ${totalProcessed}`);
  console.log(`  ⏭️  Pulados (já tem image ou sem frontmatter): ${totalSkipped}`);
  console.log(`  ⚠️  Imagens não encontradas: ${totalNotFound}`);
}

main();

