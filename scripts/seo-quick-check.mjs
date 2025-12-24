#!/usr/bin/env node
/**
 * SEO Quick Check Script
 * Verifica aspectos críticos de SEO no código
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const issues = [];
const stats = {
  pagesChecked: 0,
  pagesWithTitle: 0,
  pagesWithDescription: 0,
  pagesWithKeywords: 0,
  pagesWithSchema: 0,
  pagesWithHreflang: 0,
  imagesTotal: 0,
  imagesWithoutAlt: 0,
  imagesWithLazy: 0,
};

// Files that should be excluded from SEO checks (not HTML pages)
const EXCLUDED_PATTERNS = [
  /rss\.xml/i,
  /sitemap/i,
  /robots\.txt/i,
  /\.json$/i,
  /api\//i,
];

function isExcludedFile(filePath) {
  return EXCLUDED_PATTERNS.some(pattern => pattern.test(filePath));
}

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = filePath.replace(rootDir, '');
  
  // Skip non-HTML pages (RSS, sitemap, API routes, etc.)
  if (isExcludedFile(relativePath)) {
    return; // Skip - not an HTML page
  }
  
  // Skip redirect-only pages (they don't need SEO)
  if (content.includes('Astro.redirect') && !content.includes('BaseLayout')) {
    return; // Skip this file - it's just a redirect
  }
  
  stats.pagesChecked++;
  
  // Check title
  if (content.includes('<title>') || content.includes('title=')) {
    stats.pagesWithTitle++;
  } else {
    issues.push({
      file: relativePath,
      type: 'missing-title',
      severity: 'high',
      message: 'Página sem tag <title> ou prop title'
    });
  }
  
  // Check description
  if (content.includes('description=') || content.includes('meta name="description"')) {
    stats.pagesWithDescription++;
  } else {
    issues.push({
      file: relativePath,
      type: 'missing-description',
      severity: 'high',
      message: 'Página sem meta description'
    });
  }
  
  // Check keywords (optional)
  if (content.includes('keywords=') || content.includes('meta name="keywords"')) {
    stats.pagesWithKeywords++;
  }
  
  // Check schema
  if (content.includes('application/ld+json') || content.includes('Schema')) {
    stats.pagesWithSchema++;
  }
  
  // Check hreflang (multiple detection methods)
  const hasHreflang = 
    content.includes('hreflang') || 
    content.includes('getAlternateUrls') ||
    content.includes('alternates') ||
    content.includes('AlternateLinks') ||
    content.includes('rel="alternate"') ||
    // Check if using BaseLayout which includes SEO component with hreflang
    (content.includes('BaseLayout') && (content.includes('lang=') || content.includes('locale')));
  
  if (hasHreflang) {
    stats.pagesWithHreflang++;
  }
  
  // Check images
  const imgMatches = content.match(/<img[^>]*>/gi) || [];
  stats.imagesTotal += imgMatches.length;
  
  imgMatches.forEach(img => {
    // Check alt
    if (!img.includes('alt=')) {
      stats.imagesWithoutAlt++;
      issues.push({
        file: relativePath,
        type: 'image-no-alt',
        severity: 'medium',
        message: `Imagem sem atributo alt: ${img.substring(0, 50)}...`
      });
    }
    
    // Check lazy loading
    if (img.includes('loading="lazy"') || img.includes("loading='lazy'")) {
      stats.imagesWithLazy++;
    }
  });
}

function walkDir(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, .git, etc.
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        walkDir(filePath, fileList);
      }
    } else if (extname(file) === '.astro') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

console.log('🔍 SEO Quick Check - Modern Face Institute\n');
console.log('Analisando arquivos...\n');

const pagesDir = join(rootDir, 'src/pages');
const astroFiles = walkDir(pagesDir);

astroFiles.forEach(file => {
  try {
    checkFile(file);
  } catch (error) {
    console.error(`Erro ao processar ${file}:`, error.message);
  }
});

// Print results
console.log('📊 ESTATÍSTICAS:\n');
console.log(`Total de páginas analisadas: ${stats.pagesChecked}`);
console.log(`Páginas com title: ${stats.pagesWithTitle} (${Math.round(stats.pagesWithTitle/stats.pagesChecked*100)}%)`);
console.log(`Páginas com description: ${stats.pagesWithDescription} (${Math.round(stats.pagesWithDescription/stats.pagesChecked*100)}%)`);
console.log(`Páginas com keywords: ${stats.pagesWithKeywords} (${Math.round(stats.pagesWithKeywords/stats.pagesChecked*100)}%) ⚠️  (deprecated pelo Google)`);
console.log(`Páginas com schema: ${stats.pagesWithSchema} (${Math.round(stats.pagesWithSchema/stats.pagesChecked*100)}%)`);
console.log(`Páginas com hreflang: ${stats.pagesWithHreflang} (${Math.round(stats.pagesWithHreflang/stats.pagesChecked*100)}%)`);
console.log(`\nTotal de imagens: ${stats.imagesTotal}`);
console.log(`Imagens sem alt: ${stats.imagesWithoutAlt} (${stats.imagesTotal > 0 ? Math.round(stats.imagesWithoutAlt/stats.imagesTotal*100) : 0}%)`);
console.log(`Imagens com lazy loading: ${stats.imagesWithLazy} (${stats.imagesTotal > 0 ? Math.round(stats.imagesWithLazy/stats.imagesTotal*100) : 0}%)`);

// Print issues
if (issues.length > 0) {
  console.log(`\n⚠️  PROBLEMAS ENCONTRADOS: ${issues.length}\n`);
  
  const highSeverity = issues.filter(i => i.severity === 'high');
  const mediumSeverity = issues.filter(i => i.severity === 'medium');
  const lowSeverity = issues.filter(i => i.severity === 'low');
  
  if (highSeverity.length > 0) {
    console.log(`🔴 ALTA PRIORIDADE (${highSeverity.length}):`);
    highSeverity.slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.file}`);
      console.log(`    ${issue.message}\n`);
    });
    if (highSeverity.length > 10) {
      console.log(`  ... e mais ${highSeverity.length - 10} problemas\n`);
    }
  }
  
  if (mediumSeverity.length > 0) {
    console.log(`🟡 MÉDIA PRIORIDADE (${mediumSeverity.length}):`);
    mediumSeverity.slice(0, 10).forEach(issue => {
      console.log(`  - ${issue.file}`);
      console.log(`    ${issue.message}\n`);
    });
    if (mediumSeverity.length > 10) {
      console.log(`  ... e mais ${mediumSeverity.length - 10} problemas\n`);
    }
  }
  
  if (lowSeverity.length > 0) {
    console.log(`🟢 BAIXA PRIORIDADE (${lowSeverity.length}):`);
    console.log(`  (Omitido para brevidade)\n`);
  }
} else {
  console.log('\n✅ Nenhum problema crítico encontrado!');
}

console.log('\n📝 Relatório completo salvo em: SEO_AUDIT_REPORT.md');
console.log('\n💡 Próximos passos:');
console.log('  1. Corrigir problemas de alta prioridade');
console.log('  2. Executar Lighthouse audit');
console.log('  3. Validar schema.org com Google Rich Results Test');
console.log('  4. Verificar hreflang com ferramentas online');

