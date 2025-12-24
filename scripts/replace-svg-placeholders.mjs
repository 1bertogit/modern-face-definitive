#!/usr/bin/env node
/**
 * Script para substituir placeholders SVG por PNG nos arquivos do código
 */

import fs from 'node:fs';
import path from 'node:path';

// Mapeamento de placeholders SVG para PNG
const REPLACEMENTS = {
  // Casos cirúrgicos - before-after
  '/images/casos/before-after-placeholder-1.svg': '/images/casos/before-after/before-after-1.png',
  '/images/casos/before-after-placeholder-2.svg': '/images/casos/before-after/before-after-2.png',
  '/images/casos/before-after-placeholder-3.svg': '/images/casos/before-after/before-after-3.png',
  '/images/casos/before-after-placeholder-4.svg': '/images/casos/before-after/before-after-4.png',
  '/images/casos/before-after-placeholder-5.svg': '/images/casos/before-after/before-after-5.png',
  '/images/casos/before-after-placeholder-6.svg': '/images/casos/before-after/before-after-6.png',
  
  // Casos cirúrgicos - student results
  '/images/casos/student-result-placeholder-1.svg': '/images/casos/students/student-result-1.png',
  '/images/casos/student-result-placeholder-2.svg': '/images/casos/students/student-result-2.png',
  '/images/casos/student-result-placeholder-3.svg': '/images/casos/students/student-result-3.png',
  '/images/casos/student-result-placeholder-4.svg': '/images/casos/students/student-result-4.png',
  
  // Casos cirúrgicos - técnicas
  '/images/casos/case-endomidface-placeholder.svg': '/images/casos/techniques/case-endomidface.png',
  '/images/casos/case-deep-neck-placeholder.svg': '/images/casos/techniques/case-deep-neck.png',
  '/images/casos/case-browlift-placeholder.svg': '/images/casos/techniques/case-browlift.png',
  '/images/casos/case-face-completa-placeholder.svg': '/images/casos/techniques/case-face-completa.png',
  
  // Técnicas - hero images
  '/images/techniques/endomidface-placeholder.svg': '/images/techniques/endomidface-hero.png',
  '/images/techniques/browlift-placeholder.svg': '/images/techniques/browlift-hero.png',
  '/images/techniques/deep-neck-placeholder.svg': '/images/techniques/deep-neck-hero.png',
  '/images/techniques/formacao-placeholder.svg': '/images/techniques/formacao-hero.png',
  
  // Hero placeholder (mantém SVG se não houver PNG equivalente)
  // '/images/hero-placeholder.svg': '/images/hero/dr-roberio-1200w.webp',
};

/**
 * Verifica se a imagem PNG existe antes de substituir
 */
function imageExists(imagePath) {
  const publicPath = path.join(process.cwd(), 'public', imagePath);
  return fs.existsSync(publicPath);
}

/**
 * Processa um arquivo e substitui placeholders
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const replacements = [];
  
  for (const [svgPath, pngPath] of Object.entries(REPLACEMENTS)) {
    // Verifica se PNG existe
    if (!imageExists(pngPath)) {
      console.log(`  ⚠️  Imagem não encontrada: ${pngPath}`);
      continue;
    }
    
    // Substitui todas as ocorrências
    const regex = new RegExp(svgPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (content.includes(svgPath)) {
      content = content.replace(regex, pngPath);
      modified = true;
      replacements.push({ from: svgPath, to: pngPath });
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return replacements;
  }
  
  return null;
}

/**
 * Escaneia recursivamente um diretório procurando arquivos
 */
function scanDirectory(dir, extensions, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Pula node_modules e outras pastas desnecessárias
      if (!['node_modules', '.git', 'dist', '.astro'].includes(entry.name)) {
        scanDirectory(fullPath, extensions, files);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

/**
 * Função principal
 */
function main() {
  console.log('🔄 Substituindo placeholders SVG por PNG...\n');
  
  const directories = [
    'src/pages',
    'src/components',
    'src/lib',
  ];
  
  const extensions = ['.astro', '.ts', '.tsx', '.js', '.jsx'];
  
  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalReplacements = 0;
  
  for (const dir of directories) {
    const fullPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Diretório não encontrado: ${fullPath}`);
      continue;
    }
    
    console.log(`📁 Escaneando: ${dir}`);
    const files = scanDirectory(fullPath, extensions);
    
    for (const filePath of files) {
      totalFiles++;
      const relativePath = path.relative(process.cwd(), filePath);
      const replacements = processFile(filePath);
      
      if (replacements) {
        modifiedFiles++;
        totalReplacements += replacements.length;
        console.log(`  ✅ ${relativePath}`);
        for (const { from, to } of replacements) {
          console.log(`     ${from} → ${to}`);
        }
      }
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`  📄 Arquivos escaneados: ${totalFiles}`);
  console.log(`  ✅ Arquivos modificados: ${modifiedFiles}`);
  console.log(`  🔄 Substituições realizadas: ${totalReplacements}`);
}

main();

