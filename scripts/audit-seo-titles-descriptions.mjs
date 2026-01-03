#!/usr/bin/env node
/**
 * Script de Auditoria SEO - Títulos e Descriptions
 * Identifica:
 * - Títulos >60 caracteres
 * - Títulos <30 caracteres
 * - Descriptions ausentes
 * - Descriptions <120 caracteres
 * - Descriptions >160 caracteres
 * - Páginas com noIndex
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const rootDir = process.cwd();
const pagesDir = join(rootDir, 'src/pages');

const EXCLUDED_PATTERNS = [
  /\.ts$/,           // TypeScript files (sitemaps, etc.)
  /\.json$/,         // JSON files
  /\.mdx$/,          // MDX content files
  /_archive/,        // Archive folder
  /node_modules/,     // Dependencies
  /\.test\./,        // Test files
];

const issues = {
  longTitles: [],
  shortTitles: [],
  missingDescriptions: [],
  shortDescriptions: [],
  longDescriptions: [],
  noIndexPages: [],
};

function isExcludedFile(filePath) {
  return EXCLUDED_PATTERNS.some(pattern => pattern.test(filePath));
}

function extractTitle(content) {
  // Match title="..." or title='...'
  const titleMatch = content.match(/title\s*=\s*["']([^"']+)["']/);
  if (titleMatch) {
    return titleMatch[1];
  }
  return null;
}

function extractDescription(content) {
  // Match description="..." or description='...'
  const descMatch = content.match(/description\s*=\s*["']([^"']+)["']/);
  if (descMatch) {
    return descMatch[1];
  }
  return null;
}

function hasNoIndex(content) {
  return /noIndex\s*=\s*true|noindex\s*=\s*true/i.test(content);
}

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = filePath.replace(rootDir + '/', '');
  
  // Skip excluded files
  if (isExcludedFile(relativePath)) {
    return;
  }
  
  // Only check .astro files
  if (!filePath.endsWith('.astro')) {
    return;
  }
  
  // Skip if not using BaseLayout
  if (!content.includes('BaseLayout')) {
    return;
  }
  
  // Check title
  const title = extractTitle(content);
  if (title) {
    const titleLength = title.length;
    if (titleLength > 60) {
      issues.longTitles.push({
        file: relativePath,
        title,
        length: titleLength,
      });
    } else if (titleLength < 30) {
      issues.shortTitles.push({
        file: relativePath,
        title,
        length: titleLength,
      });
    }
  }
  
  // Check description
  const description = extractDescription(content);
  if (!description) {
    issues.missingDescriptions.push({
      file: relativePath,
    });
  } else {
    const descLength = description.length;
    if (descLength < 120) {
      issues.shortDescriptions.push({
        file: relativePath,
        description,
        length: descLength,
      });
    } else if (descLength > 160) {
      issues.longDescriptions.push({
        file: relativePath,
        description,
        length: descLength,
      });
    }
  }
  
  // Check noIndex
  if (hasNoIndex(content)) {
    issues.noIndexPages.push({
      file: relativePath,
    });
  }
}

function walkDir(dir) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else {
      checkFile(filePath);
    }
  }
}

// Run audit
console.log('🔍 Iniciando auditoria SEO de títulos e descriptions...\n');
walkDir(pagesDir);

// Report results
console.log('📊 RESULTADOS DA AUDITORIA\n');
console.log('═'.repeat(60));

if (issues.longTitles.length > 0) {
  console.log(`\n❌ TÍTULOS LONGOS (>60 caracteres): ${issues.longTitles.length}`);
  issues.longTitles.forEach(({ file, title, length }) => {
    console.log(`  • ${file}`);
    console.log(`    Título (${length} chars): "${title}"`);
  });
}

if (issues.shortTitles.length > 0) {
  console.log(`\n⚠️  TÍTULOS CURTOS (<30 caracteres): ${issues.shortTitles.length}`);
  issues.shortTitles.forEach(({ file, title, length }) => {
    console.log(`  • ${file}`);
    console.log(`    Título (${length} chars): "${title}"`);
  });
}

if (issues.missingDescriptions.length > 0) {
  console.log(`\n❌ DESCRIPTIONS AUSENTES: ${issues.missingDescriptions.length}`);
  issues.missingDescriptions.forEach(({ file }) => {
    console.log(`  • ${file}`);
  });
}

if (issues.shortDescriptions.length > 0) {
  console.log(`\n⚠️  DESCRIPTIONS CURTAS (<120 caracteres): ${issues.shortDescriptions.length}`);
  issues.shortDescriptions.forEach(({ file, description, length }) => {
    console.log(`  • ${file}`);
    console.log(`    Description (${length} chars): "${description.substring(0, 80)}..."`);
  });
}

if (issues.longDescriptions.length > 0) {
  console.log(`\n❌ DESCRIPTIONS LONGAS (>160 caracteres): ${issues.longDescriptions.length}`);
  issues.longDescriptions.forEach(({ file, description, length }) => {
    console.log(`  • ${file}`);
    console.log(`    Description (${length} chars): "${description.substring(0, 80)}..."`);
  });
}

if (issues.noIndexPages.length > 0) {
  console.log(`\n❌ PÁGINAS COM noIndex=true: ${issues.noIndexPages.length}`);
  issues.noIndexPages.forEach(({ file }) => {
    console.log(`  • ${file}`);
  });
}

// Summary
const totalIssues = 
  issues.longTitles.length +
  issues.shortTitles.length +
  issues.missingDescriptions.length +
  issues.shortDescriptions.length +
  issues.longDescriptions.length +
  issues.noIndexPages.length;

console.log('\n' + '═'.repeat(60));
console.log(`\n📈 RESUMO: ${totalIssues} problemas encontrados`);
console.log(`   • Títulos longos: ${issues.longTitles.length}`);
console.log(`   • Títulos curtos: ${issues.shortTitles.length}`);
console.log(`   • Descriptions ausentes: ${issues.missingDescriptions.length}`);
console.log(`   • Descriptions curtas: ${issues.shortDescriptions.length}`);
console.log(`   • Descriptions longas: ${issues.longDescriptions.length}`);
console.log(`   • Páginas com noIndex: ${issues.noIndexPages.length}`);

if (totalIssues === 0) {
  console.log('\n✅ Nenhum problema encontrado!');
}

process.exit(totalIssues > 0 ? 1 : 0);

