#!/usr/bin/env node
/**
 * Script para corrigir comparações numéricas em arquivos MDX
 * Substitui <número e >número por &lt;número e &gt;número
 */

import { readFileSync, writeFileSync } from 'fs';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

function findMdxFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  files.forEach((file) => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      findMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = findMdxFiles('src/content/blog');

let totalFixed = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  let fixed = false;
  
  // Corrigir <número (mas não tags HTML válidas como <strong>)
  const before = content;
  
  // Substituir <número ou <número. por &lt;número (mas não tags HTML)
  // Também captura casos como p<0.05, <2g, etc.
  content = content.replace(/([^<a-zA-Z]|^)<(\d+[.,]?\d*)/g, (match, before, num) => {
    // Verificar se não é uma tag HTML válida
    if (before.match(/[a-zA-Z]$/)) {
      return match; // Provavelmente parte de uma tag HTML
    }
    fixed = true;
    return `${before}&lt;${num}`;
  });
  
  // Substituir >número ou >número. por &gt;número (mas não tags HTML)
  content = content.replace(/([^>a-zA-Z]|^)>(\d+[.,]?\d*)/g, (match, before, num) => {
    // Verificar se não é uma tag HTML válida
    if (before.match(/[a-zA-Z]$/)) {
      return match; // Provavelmente parte de uma tag HTML
    }
    fixed = true;
    return `${before}&gt;${num}`;
  });
  
  if (fixed) {
    writeFileSync(file, content, 'utf-8');
    totalFixed++;
    console.log(`✓ Fixed: ${file}`);
  }
}

console.log(`\n✅ Total files fixed: ${totalFixed}`);

