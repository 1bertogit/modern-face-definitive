#!/usr/bin/env node
/**
 * Script para identificar páginas faltantes em cada idioma
 * Compara estrutura de páginas EN, PT e ES
 */

import { readdir, stat } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pagesDir = join(__dirname, '..', 'src', 'pages');

// Mapeamento de traduções de paths
const pathTranslations = {
  'en': {
    'about': 'sobre',
    'anatomy': 'anatomia',
    'applied-anatomy': 'anatomia-aplicada',
    'blog': 'blog',
    'cases': 'casos',
    'clinical-technology': 'tecnologia-clinica',
    'contact': 'contato',
    'education': 'educacao',
    'faq': 'faq',
    'glossary': 'glossario',
    'library': 'biblioteca',
    'modern-face': 'face-moderna',
    'philosophy': 'filosofia',
    'privacy': 'privacidade',
    'surgical-planning': 'planificacion-quirurgica',
    'techniques': 'tecnicas',
    'terms': 'termos',
    'training': 'formacao',
  },
  'es': {
    'about': 'sobre',
    'anatomy': 'anatomia',
    'applied-anatomy': 'anatomia-aplicada',
    'blog': 'blog',
    'cases': 'casos',
    'clinical-technology': 'tecnologia-clinica',
    'contact': 'contacto',
    'education': 'educacion',
    'faq': 'faq',
    'glossary': 'glosario',
    'library': 'biblioteca',
    'modern-face': 'face-moderna',
    'philosophy': 'filosofia',
    'privacy': 'privacidad',
    'surgical-planning': 'planificacion-quirurgica',
    'techniques': 'tecnicas',
    'terms': 'terminos',
    'training': 'formacion',
  }
};

// Ignorar arquivos de sistema
const ignoreFiles = new Set([
  '404.astro',
  'rss.xml.ts',
  'sitemap-blog.xml.astro',
  'sitemap-custom-index.xml.astro',
  'sitemap-education.xml.astro',
  'sitemap-es.xml.astro',
  'sitemap-pages.xml.astro',
  'sitemap-pt.xml.astro',
  'sitemap-techniques.xml.astro',
]);

async function getAllPages(dir, prefix = '') {
  const pages = new Set();
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    
    if (ignoreFiles.has(entry.name)) continue;
    
    if (entry.isDirectory()) {
      if (entry.name === 'pt' || entry.name === 'es') {
        // Pular diretórios de locale
        continue;
      }
      const subPages = await getAllPages(fullPath, relativePath);
      subPages.forEach(p => pages.add(p));
    } else if (entry.name.endsWith('.astro')) {
      const pagePath = relativePath.replace(/\.astro$/, '');
      pages.add(pagePath);
    }
  }
  
  return pages;
}

async function getLocalePages(dir, locale) {
  const localeDir = join(dir, locale);
  try {
    await stat(localeDir);
  } catch {
    return new Set();
  }
  
  return await getAllPages(localeDir, locale);
}

function translatePath(path, locale) {
  if (locale === 'en') return path;
  
  const translations = pathTranslations[locale];
  if (!translations) return path;
  
  let translated = path;
  for (const [en, translatedPath] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(`^${en}/`), `${translatedPath}/`);
    translated = translated.replace(new RegExp(`/${en}/`), `/${translatedPath}/`);
    translated = translated.replace(new RegExp(`^${en}$`), translatedPath);
  }
  
  return translated;
}

async function main() {
  console.log('🔍 Analisando páginas faltantes...\n');
  
  const enPages = await getAllPages(pagesDir);
  const ptPages = await getLocalePages(pagesDir, 'pt');
  const esPages = await getLocalePages(pagesDir, 'es');
  
  console.log(`📊 Estatísticas:`);
  console.log(`   EN: ${enPages.size} páginas`);
  console.log(`   PT: ${ptPages.size} páginas`);
  console.log(`   ES: ${esPages.size} páginas\n`);
  
  // Encontrar páginas EN que não têm equivalente em PT
  const missingInPT = [];
  for (const enPage of enPages) {
    const expectedPT = translatePath(enPage, 'pt');
    if (!ptPages.has(expectedPT) && !ptPages.has(enPage)) {
      missingInPT.push({ en: enPage, expectedPT });
    }
  }
  
  // Encontrar páginas EN que não têm equivalente em ES
  const missingInES = [];
  for (const enPage of enPages) {
    const expectedES = translatePath(enPage, 'es');
    if (!esPages.has(expectedES) && !esPages.has(enPage)) {
      missingInES.push({ en: enPage, expectedES });
    }
  }
  
  // Encontrar páginas PT que não têm equivalente em EN
  const missingInENFromPT = [];
  for (const ptPage of ptPages) {
    // Verificar se existe equivalente em EN
    let found = false;
    for (const enPage of enPages) {
      const expectedPT = translatePath(enPage, 'pt');
      if (expectedPT === ptPage || enPage === ptPage) {
        found = true;
        break;
      }
    }
    if (!found) {
      missingInENFromPT.push(ptPage);
    }
  }
  
  // Encontrar páginas ES que não têm equivalente em EN
  const missingInENFromES = [];
  for (const esPage of esPages) {
    // Verificar se existe equivalente em EN
    let found = false;
    for (const enPage of enPages) {
      const expectedES = translatePath(enPage, 'es');
      if (expectedES === esPage || enPage === esPage) {
        found = true;
        break;
      }
    }
    if (!found) {
      missingInENFromES.push(esPage);
    }
  }
  
  // Relatório
  console.log('='.repeat(80));
  console.log('📋 PÁGINAS FALTANTES');
  console.log('='.repeat(80));
  
  if (missingInPT.length > 0) {
    console.log(`\n❌ FALTAM EM PT (${missingInPT.length} páginas):`);
    missingInPT.slice(0, 50).forEach(({ en, expectedPT }) => {
      console.log(`   EN: /${en}`);
      console.log(`   PT: /pt/${expectedPT}`);
    });
    if (missingInPT.length > 50) {
      console.log(`   ... e mais ${missingInPT.length - 50} páginas`);
    }
  } else {
    console.log('\n✅ Todas as páginas EN têm equivalente em PT');
  }
  
  if (missingInES.length > 0) {
    console.log(`\n❌ FALTAM EM ES (${missingInES.length} páginas):`);
    missingInES.slice(0, 50).forEach(({ en, expectedES }) => {
      console.log(`   EN: /${en}`);
      console.log(`   ES: /es/${expectedES}`);
    });
    if (missingInES.length > 50) {
      console.log(`   ... e mais ${missingInES.length - 50} páginas`);
    }
  } else {
    console.log('\n✅ Todas as páginas EN têm equivalente em ES');
  }
  
  if (missingInENFromPT.length > 0) {
    console.log(`\n⚠️  PÁGINAS PT SEM EQUIVALENTE EM EN (${missingInENFromPT.length} páginas):`);
    missingInENFromPT.slice(0, 20).forEach(page => {
      console.log(`   /pt/${page}`);
    });
    if (missingInENFromPT.length > 20) {
      console.log(`   ... e mais ${missingInENFromPT.length - 20} páginas`);
    }
  }
  
  if (missingInENFromES.length > 0) {
    console.log(`\n⚠️  PÁGINAS ES SEM EQUIVALENTE EM EN (${missingInENFromES.length} páginas):`);
    missingInENFromES.slice(0, 20).forEach(page => {
      console.log(`   /es/${page}`);
    });
    if (missingInENFromES.length > 20) {
      console.log(`   ... e mais ${missingInENFromES.length - 20} páginas`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
}

main().catch(console.error);

