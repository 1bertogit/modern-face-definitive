#!/usr/bin/env node
/**
 * Script para migrar todas as referências de 'pt' para 'pt'
 * 
 * Exceções (mantém pt):
 * - hreflang="pt-BR" (SEO)
 * - lang="pt-BR" (atributo HTML)
 * - Content-Language: pt-BR (headers HTTP)
 * - toLocaleDateString('pt-BR', ...) (formatação de data)
 * - htmlLang mapping (mapeia 'pt' para 'pt' no HTML)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const EXCLUDE_PATTERNS = [
  /hreflang\s*=\s*["']pt["']/gi,
  /lang\s*=\s*["']pt["']/gi,
  /Content-Language\s*[:=]\s*["']?pt["']?/gi,
  /toLocaleDateString\s*\(\s*["']pt["']/gi,
  /htmlLang\s*[:=]\s*\{[^}]*['"]pt['"]\s*:\s*['"]pt['"]/gi,
  /localeMap\s*[:=]\s*\{[^}]*['"]pt['"]\s*:\s*['"]pt['"]/gi,
  /langMap\s*[:=]\s*\{[^}]*['"]pt['"]\s*:\s*['"]pt['"]/gi,
];

const TARGET_DIRS = [
  'src',
  'scripts',
  'public',
  'astro.config.mjs',
  'netlify.toml',
  'vercel.json',
];

let totalFiles = 0;
let totalReplacements = 0;
const filesChanged = [];

function shouldExclude(content, match) {
  // Verificar se a linha contém algum padrão de exclusão
  const lines = content.split('\n');
  const matchLine = lines.findIndex(line => line.includes(match));
  if (matchLine === -1) return false;
  
  const lineContent = lines[matchLine];
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(lineContent));
}

function replaceInFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    let newContent = content;
    
    // Proteger casos especiais que devem manter pt
    const protectedItems = [];
    const protectPatterns = [
      /hreflang\s*=\s*["']pt["']/gi,
      /lang\s*=\s*["']pt["']/gi,
      /Content-Language\s*[:=]\s*["']?pt["']?/gi,
      /toLocaleDateString\s*\(\s*["']pt["']/gi,
      /['"]pt['"]\s*:\s*['"]pt['"]/g, // Mapeamentos como 'pt': 'pt-BR'
      /localeMap\[locale\]\s*\|\|\s*['"]pt['"]/g,
      /langMap\[locale\]\s*\|\|\s*['"]pt['"]/g,
    ];
    
    // Substituir casos protegidos por placeholders temporários
    protectPatterns.forEach((pattern, index) => {
      newContent = newContent.replace(pattern, (match) => {
        const placeholder = `__PROTECTED_${index}_${protectedItems.length}__`;
        protectedItems.push({ placeholder, original: match });
        return placeholder;
      });
    });
    
    // Agora fazer as substituições
    const replacements = [
      // locale: "pt" ou locale: 'pt'
      { from: /locale:\s*["']pt["']/gi, to: (match) => match.includes('"') ? 'locale: "pt"' : "locale: 'pt'" },
      // Tipo Locale em definições
      { from: /type\s+Locale\s*=\s*['"]en['"]\s*\|\s*['"]pt['"]\s*\|\s*['"]es['"]/g, to: "type Locale = 'en' | 'pt' | 'es'" },
      { from: /type\s+Locale\s*=\s*['"]pt['"]\s*\|\s*['"]en['"]\s*\|\s*['"]es['"]/g, to: "type Locale = 'pt' | 'en' | 'es'" },
      // Arrays
      { from: /\[['"]en['"],\s*['"]pt['"],\s*['"]es['"]\]/g, to: "['en', 'pt', 'es']" },
      { from: /\[['"]pt['"],\s*['"]en['"],\s*['"]es['"]\]/g, to: "['pt', 'en', 'es']" },
      // Record com chave pt
      { from: /['"]pt['"]\s*:/g, to: "'pt':" },
      // Comparações
      { from: /locale\s*===\s*['"]pt['"]/g, to: "locale === 'pt'" },
      { from: /locale\s*!==\s*['"]pt['"]/g, to: "locale !== 'pt'" },
      { from: /data\.locale\s*===\s*['"]pt['"]/g, to: "data.locale === 'pt'" },
      { from: /data\.locale\s*!==\s*['"]pt['"]/g, to: "data.locale !== 'pt'" },
      // Default
      { from: /default\s*:\s*['"]pt['"]/g, to: "default: 'pt'" },
      { from: /\.default\(['"]pt['"]\)/g, to: ".default('pt')" },
      // Funções com pt
      { from: /getArticlesForLocale\(['"]pt['"]\)/g, to: "getArticlesForLocale('pt')" },
      { from: /getBlogLabels\(['"]pt['"]\)/g, to: "getBlogLabels('pt')" },
      { from: /locale\s*=\s*['"]pt['"]/g, to: "locale = 'pt'" },
      { from: /const\s+locale\s*=\s*['"]pt['"]/g, to: "const locale = 'pt'" },
      // Genérico (último, mais amplo)
      { from: /pt/g, to: 'pt' },
    ];
    
    replacements.forEach(({ from, to }) => {
      if (typeof to === 'function') {
        newContent = newContent.replace(from, to);
      } else {
        newContent = newContent.replace(from, to);
      }
    });
    
    // Restaurar casos protegidos
    protectedItems.forEach(({ placeholder, original }) => {
      newContent = newContent.replace(placeholder, original);
    });
    
    // Contar substituições
    const originalMatches = (content.match(/pt/gi) || []).length;
    const finalMatches = (newContent.match(/pt/gi) || []).length;
    const actualReplacements = originalMatches - finalMatches;
    
    if (actualReplacements > 0) {
      writeFileSync(filePath, newContent, 'utf-8');
      totalReplacements += actualReplacements;
      filesChanged.push({ file: filePath, count: actualReplacements });
      console.log(`✅ ${filePath}: ${actualReplacements} substituições`);
    }
    
    totalFiles++;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
}

function processDirectory(dir) {
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      
      // Ignorar node_modules, .git, dist, etc.
      if (entry.startsWith('.') || entry === 'node_modules' || entry === 'dist' || entry === '.next') {
        continue;
      }
      
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = extname(entry);
        // Processar apenas arquivos relevantes
        if (['.ts', '.tsx', '.js', '.jsx', '.mjs', '.astro', '.mdx', '.md', '.toml', '.json', '.txt'].includes(ext)) {
          replaceInFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Erro ao processar diretório ${dir}:`, error.message);
  }
}

// Processar arquivos
console.log('🔄 Iniciando migração de pt para pt...\n');

for (const target of TARGET_DIRS) {
  if (target.includes('.')) {
    // É um arquivo
    try {
      replaceInFile(target);
    } catch (error) {
      console.error(`Erro ao processar ${target}:`, error.message);
    }
  } else {
    // É um diretório
    processDirectory(target);
  }
}

console.log(`\n📊 Resumo:`);
console.log(`   Arquivos processados: ${totalFiles}`);
console.log(`   Arquivos modificados: ${filesChanged.length}`);
console.log(`   Total de substituições: ${totalReplacements}`);

if (filesChanged.length > 0) {
  console.log(`\n📝 Arquivos modificados:`);
  filesChanged.slice(0, 20).forEach(({ file, count }) => {
    console.log(`   - ${file} (${count} substituições)`);
  });
  if (filesChanged.length > 20) {
    console.log(`   ... e mais ${filesChanged.length - 20} arquivos`);
  }
}

console.log('\n✅ Migração concluída!');
console.log('\n⚠️  IMPORTANTE: Verifique manualmente:');
console.log('   - hreflang="pt-BR" (deve permanecer pt para SEO)');
console.log('   - lang="pt-BR" (atributo HTML, deve permanecer)');
console.log('   - Content-Language headers');
console.log('   - toLocaleDateString("pt-BR", ...)');

