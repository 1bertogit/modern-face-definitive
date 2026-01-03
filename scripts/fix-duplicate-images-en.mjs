#!/usr/bin/env node
/**
 * Script para corrigir imagens duplicadas no blog EN
 * Mapeia cada artigo para uma imagem única baseada no slug
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse, stringify } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const blogPostsDir = path.join(rootDir, 'src/content/blog/en');
const blogImagesDir = path.join(rootDir, 'public/images/blog/en');

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function getExistingImageSlugs() {
  const files = fs.readdirSync(blogImagesDir);
  return new Set(files.map(file => path.basename(file, path.extname(file))));
}

function getArticleData() {
  const mdxFiles = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.mdx'));
  const articles = [];

  for (const file of mdxFiles) {
    const filePath = path.join(blogPostsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

    if (frontmatterMatch) {
      const frontmatter = parse(frontmatterMatch[1]);
      if (frontmatter.image) {
        articles.push({
          filePath,
          fileName: file,
          currentImage: frontmatter.image,
          canonicalSlug: frontmatter.canonicalSlug,
        });
      }
    }
  }
  return articles;
}

function findBestUniqueImage(article, existingImageSlugs, usedImages) {
  const baseSlug = slugify(path.basename(article.filePath, '.mdx'));
  const canonicalSlug = article.canonicalSlug ? slugify(article.canonicalSlug) : baseSlug;

  // Prioritize image matching canonicalSlug
  if (existingImageSlugs.has(canonicalSlug) && !usedImages.has(canonicalSlug)) {
    return canonicalSlug;
  }

  // Try image matching filename slug
  if (existingImageSlugs.has(baseSlug) && !usedImages.has(baseSlug)) {
    return baseSlug;
  }

  // Try to find partial match
  for (const existingSlug of existingImageSlugs) {
    if (!usedImages.has(existingSlug)) {
      // Check if slug contains key words from article
      const articleWords = baseSlug.split('-').filter(w => w.length > 3);
      const imageWords = existingSlug.split('-').filter(w => w.length > 3);
      const commonWords = articleWords.filter(w => imageWords.includes(w));
      
      if (commonWords.length >= 2) {
        return existingSlug;
      }
    }
  }

  // Fallback to a generic image if available and not used
  const genericImage = 'og-default';
  if (existingImageSlugs.has(genericImage) && !usedImages.has(genericImage)) {
    return genericImage;
  }

  // If no unique image found, return null
  return null;
}

function updateArticleImage(filePath, newImageSlug) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

  if (frontmatterMatch) {
    const frontmatter = parse(frontmatterMatch[1]);
    frontmatter.image = `/images/blog/en/${newImageSlug}.webp`;
    const newFrontmatterRaw = stringify(frontmatter);
    content = content.replace(frontmatterMatch[0], `---\n${newFrontmatterRaw}---`);
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

async function main() {
  console.log('🔍 Corrigindo imagens duplicadas no blog EN...');

  const existingImageSlugs = getExistingImageSlugs();
  const articles = getArticleData();
  const usedImages = new Set();

  console.log(`\n📁 Imagens disponíveis: ${existingImageSlugs.size}`);
  console.log(`📄 Arquivos MDX: ${articles.length}\n`);

  let processedCount = 0;
  let mappedCount = 0;
  let correctedDuplicates = 0;

  for (const article of articles) {
    const currentImageSlug = path.basename(article.currentImage, path.extname(article.currentImage));

    // If the current image is already unique and exists, mark as used
    if (existingImageSlugs.has(currentImageSlug) && !usedImages.has(currentImageSlug)) {
      usedImages.add(currentImageSlug);
      processedCount++;
      continue;
    }

    // Try to find a unique image for this article
    const newImageSlug = findBestUniqueImage(article, existingImageSlugs, usedImages);

    if (newImageSlug) {
      if (updateArticleImage(article.filePath, newImageSlug)) {
        console.log(`✅ ${article.fileName}\n   → ${newImageSlug}.webp`);
        usedImages.add(newImageSlug);
        mappedCount++;
        if (currentImageSlug !== newImageSlug) {
          correctedDuplicates++;
        }
      }
    } else {
      console.log(`⚠️  ${article.fileName}: Imagem mapeada não existe: ${currentImageSlug}.webp`);
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`  ✅ Processados: ${processedCount}`);
  console.log(`  📌 Mapeados: ${mappedCount}`);
  console.log(`  🔄 Duplicatas corrigidas: ${correctedDuplicates}`);
  console.log('\n✨ Correção concluída!');
}

main().catch(console.error);

