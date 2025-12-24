#!/usr/bin/env node

/**
 * Script para substituir emojis por ícones SVG nos posts do blog
 * 
 * Uso:
 *   node scripts/replace-emojis.mjs --dry-run  # Preview sem alterar
 *   node scripts/replace-emojis.mjs --file path/to/file.mdx  # Um arquivo específico
 *   node scripts/replace-emojis.mjs  # Todos os arquivos
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Mapeamento de emojis para componentes Icon
const emojiReplacements = {
  // Títulos H2
  '## 🎯 ': '## <Icon name="executive-summary" size={20} /> ',
  
  // Listas
  '- ✅ ': '- <Icon name="check-positive" size={16} /> ',
  '- ❌ ': '- <Icon name="check-negative" size={16} /> ',
  
  // Texto inline em negrito
  '**✅ ': '**<Icon name="check-positive" size={14} /> ',
  '**❌ ': '**<Icon name="check-negative" size={14} /> ',
  
  // Subtítulos H4
  '#### 💡 ': '#### <Icon name="note" size={18} /> ',
  '#### 📍 ': '#### <Icon name="location" size={18} /> ',
  '#### ✅ ': '#### <Icon name="check-positive" size={18} /> ',
  '#### ❌ ': '#### <Icon name="check-negative" size={18} /> ',
  
  // Subtítulos H3
  '### ✅ ': '### <Icon name="check-positive" size={18} /> ',
  '### ❌ ': '### <Icon name="check-negative" size={18} /> ',
  
  // Tabelas (cuidado - pode precisar ajuste manual)
  '| ✅ ': '| <Icon name="check-positive" size={16} /> ',
  '| ❌ ': '| <Icon name="check-negative" size={16} /> ',
  ' ✅ |': ' <Icon name="check-positive" size={16} /> |',
  ' ❌ |': ' <Icon name="check-negative" size={16} /> |',
  
  // Outros emojis
  ' ⚠️ ': ' <Icon name="warning" size={16} /> ',
  ' 🔄 ': ' <Icon name="combine" size={16} /> ',
  ' ⭐': ' <Icon name="star" size={16} />',
};

function findMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function replaceEmojis(content) {
  let newContent = content;
  let replacements = [];
  
  // Adicionar import do Icon após o frontmatter se não existir
  if (!newContent.includes("import Icon") && !newContent.includes("Icon.astro")) {
    const frontmatterEnd = newContent.indexOf('\n---\n', newContent.indexOf('---'));
    if (frontmatterEnd !== -1) {
      const afterFrontmatter = frontmatterEnd + 5;
      // Verificar se já há conteúdo após frontmatter
      const nextLine = newContent.slice(afterFrontmatter).trim();
      if (nextLine) {
        newContent = newContent.slice(0, afterFrontmatter) + 
                     "import Icon from '@components/ui/Icon.astro';\n\n" + 
                     newContent.slice(afterFrontmatter);
      } else {
        newContent = newContent.slice(0, afterFrontmatter) + 
                     "import Icon from '@components/ui/Icon.astro';\n" + 
                     newContent.slice(afterFrontmatter);
      }
    }
  }
  
  // Aplicar substituições
  for (const [emoji, replacement] of Object.entries(emojiReplacements)) {
    const regex = new RegExp(emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = newContent.match(regex);
    
    if (matches) {
      replacements.push({ emoji, count: matches.length });
      newContent = newContent.replace(regex, replacement);
    }
  }
  
  return { newContent, replacements };
}

function processFile(filePath, dryRun = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { newContent, replacements } = replaceEmojis(content);
    
    if (replacements.length === 0) {
      return { file: filePath, changed: false, replacements: [] };
    }
    
    if (!dryRun) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    
    return { file: filePath, changed: true, replacements };
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return { file: filePath, changed: false, error: error.message };
  }
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const fileArg = args.find(arg => arg.startsWith('--file='));
  
  console.log('🔄 Substituindo emojis por ícones SVG...\n');
  
  if (dryRun) {
    console.log('⚠️  MODO DRY-RUN: Nenhum arquivo será alterado\n');
  }
  
  let files;
  
  if (fileArg) {
    const filePath = fileArg.split('=')[1];
    files = [path.resolve(rootDir, filePath)];
  } else {
    const blogDir = path.join(rootDir, 'src/content/blog');
    files = findMdxFiles(blogDir);
  }
  
  console.log(`📁 Encontrados ${files.length} arquivo(s) MDX\n`);
  
  const results = files.map(file => processFile(file, dryRun));
  const changed = results.filter(r => r.changed);
  const unchanged = results.filter(r => !r.changed && !r.error);
  const errors = results.filter(r => r.error);
  
  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO');
  console.log('='.repeat(60));
  console.log(`✅ Arquivos alterados: ${changed.length}`);
  console.log(`⚪ Arquivos sem emojis: ${unchanged.length}`);
  if (errors.length > 0) {
    console.log(`❌ Erros: ${errors.length}`);
  }
  
  if (changed.length > 0) {
    console.log('\n📝 Arquivos alterados:');
    changed.forEach(({ file, replacements }) => {
      const relativePath = path.relative(rootDir, file);
      const totalReplacements = replacements.reduce((sum, r) => sum + r.count, 0);
      console.log(`   ${relativePath} (${totalReplacements} substituições)`);
      replacements.forEach(r => {
        console.log(`      - ${r.emoji.trim()}: ${r.count}x`);
      });
    });
  }
  
  if (dryRun && changed.length > 0) {
    console.log('\n💡 Execute sem --dry-run para aplicar as mudanças');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

main();

