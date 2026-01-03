#!/usr/bin/env node
/**
 * Script para identificar páginas faltantes em cada idioma
 * Compara arquivos .astro diretamente
 */

import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pagesDir = join(__dirname, '..', 'src', 'pages');

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

async function getAllAstroFiles(dir, basePath = '') {
  const files = new Set();
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (ignoreFiles.has(entry.name)) continue;
    
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Pular diretórios de locale
      if (entry.name === 'pt' || entry.name === 'es') continue;
      
      const subFiles = await getAllAstroFiles(fullPath, relativePath);
      subFiles.forEach(f => files.add(f));
    } else if (entry.name.endsWith('.astro')) {
      const pathWithoutExt = relativePath.replace(/\.astro$/, '');
      files.add(pathWithoutExt);
    }
  }
  
  return files;
}

async function getLocaleFiles(dir, locale) {
  const localeDir = join(dir, locale);
  try {
    await stat(localeDir);
  } catch {
    return new Set();
  }
  
  return await getAllAstroFiles(localeDir, locale);
}

// Mapeamento básico de traduções de paths
function normalizePathForComparison(path, locale) {
  // Remove locale prefix se existir
  let normalized = path.replace(/^(pt|es)\//, '');
  
  // Mapeamentos conhecidos
  const mappings = {
    'pt': {
      'sobre': 'about',
      'anatomia': 'anatomy',
      'anatomia-aplicada': 'applied-anatomy',
      'casos': 'cases',
      'contato': 'contact',
      'educacao': 'education',
      'glossario': 'glossary',
      'biblioteca': 'library',
      'face-moderna': 'modern-face',
      'privacidade': 'privacy',
      'tecnicas': 'techniques',
      'tecnologia-clinica': 'clinical-technology',
      'termos': 'terms',
      'formacao': 'training',
      'planificacion-quirurgica': 'surgical-planning',
      'alunos': 'students',
      'cirurgicos': 'surgical',
      'estudos-clinicos': 'clinical-studies',
      'ebooks': 'ebooks',
      'guias-praticos': 'practical-guides',
      'infograficos': 'infographics',
      'publicacoes': 'publications',
      'programas-nucleo': 'core-programs',
      'cursos-satelites': 'satellite-courses',
      'formacao-avancada': 'advanced-training',
    },
    'es': {
      'sobre': 'about',
      'anatomia': 'anatomy',
      'anatomia-aplicada': 'applied-anatomy',
      'casos': 'cases',
      'contacto': 'contact',
      'educacion': 'education',
      'glosario': 'glossary',
      'biblioteca': 'library',
      'face-moderna': 'modern-face',
      'privacidad': 'privacy',
      'tecnicas': 'techniques',
      'tecnologia-clinica': 'clinical-technology',
      'terminos': 'terms',
      'formacion': 'training',
      'planificacion-quirurgica': 'surgical-planning',
      'alumnos': 'students',
      'quirurgicos': 'surgical',
      'estudios-clinicos': 'clinical-studies',
      'ebooks': 'ebooks',
      'guias-practicos': 'practical-guides',
      'infograficos': 'infographics',
      'publicaciones': 'publications',
      'programas-nucleo': 'core-programs',
      'cursos-satelites': 'satellite-courses',
      'formacion-avanzada': 'advanced-training',
    }
  };
  
  if (locale === 'en') return normalized;
  
  const mapping = mappings[locale] || {};
  let result = normalized;
  
  // Aplicar mapeamentos
  for (const [pt, en] of Object.entries(mapping)) {
    result = result.replace(new RegExp(`^${pt}/`), `${en}/`);
    result = result.replace(new RegExp(`/${pt}/`), `/${en}/`);
    result = result.replace(new RegExp(`^${pt}$`), en);
  }
  
  return result;
}

async function main() {
  console.log('🔍 Analisando páginas faltantes...\n');
  
  const enFiles = await getAllAstroFiles(pagesDir);
  const ptFiles = await getLocaleFiles(pagesDir, 'pt');
  const esFiles = await getLocaleFiles(pagesDir, 'es');
  
  console.log(`📊 Estatísticas:`);
  console.log(`   EN: ${enFiles.size} páginas`);
  console.log(`   PT: ${ptFiles.size} páginas`);
  console.log(`   ES: ${esFiles.size} páginas\n`);
  
  // Normalizar paths PT e ES para comparação
  const ptNormalized = new Map();
  for (const ptFile of ptFiles) {
    const normalized = normalizePathForComparison(ptFile, 'pt');
    ptNormalized.set(normalized, ptFile);
  }
  
  const esNormalized = new Map();
  for (const esFile of esFiles) {
    const normalized = normalizePathForComparison(esFile, 'es');
    esNormalized.set(normalized, esFile);
  }
  
  // Encontrar páginas EN que não têm equivalente em PT
  const missingInPT = [];
  for (const enFile of enFiles) {
    if (!ptNormalized.has(enFile)) {
      missingInPT.push(enFile);
    }
  }
  
  // Encontrar páginas EN que não têm equivalente em ES
  const missingInES = [];
  for (const enFile of enFiles) {
    if (!esNormalized.has(enFile)) {
      missingInES.push(enFile);
    }
  }
  
  // Encontrar páginas PT que não têm equivalente em EN
  const missingInENFromPT = [];
  for (const [normalized, original] of ptNormalized.entries()) {
    if (!enFiles.has(normalized)) {
      missingInENFromPT.push(original);
    }
  }
  
  // Encontrar páginas ES que não têm equivalente em EN
  const missingInENFromES = [];
  for (const [normalized, original] of esNormalized.entries()) {
    if (!enFiles.has(normalized)) {
      missingInENFromES.push(original);
    }
  }
  
  // Relatório
  console.log('='.repeat(80));
  console.log('📋 PÁGINAS FALTANTES');
  console.log('='.repeat(80));
  
  if (missingInPT.length > 0) {
    console.log(`\n❌ FALTAM EM PT (${missingInPT.length} páginas):`);
    missingInPT.forEach(page => {
      console.log(`   /${page}`);
    });
  } else {
    console.log('\n✅ Todas as páginas EN têm equivalente em PT');
  }
  
  if (missingInES.length > 0) {
    console.log(`\n❌ FALTAM EM ES (${missingInES.length} páginas):`);
    missingInES.forEach(page => {
      console.log(`   /${page}`);
    });
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

