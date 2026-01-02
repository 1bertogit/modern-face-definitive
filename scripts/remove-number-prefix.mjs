#!/usr/bin/env node
/**
 * Script para remover prefixos numéricos dos arquivos de blog posts
 * Exemplo: 01-10-mitos...mdx -> 10-mitos...mdx
 */

import { readdir, rename } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const blogPtPath = join(__dirname, '../src/content/blog/pt');

async function removeNumberPrefix() {
  try {
    console.log('🔍 Listando arquivos...\n');
    const files = await readdir(blogPtPath);
    const mdxFiles = files.filter((f) => f.endsWith('.mdx') && /^\d+-/.test(f));

    if (mdxFiles.length === 0) {
      console.log('✅ Nenhum arquivo com prefixo numérico encontrado.');
      return;
    }

    console.log(`📝 Encontrados ${mdxFiles.length} arquivos para renomear:\n`);

    const renameOperations = [];

    for (const file of mdxFiles) {
      // Remove o prefixo numérico (01-, 02-, etc.) do início do nome
      const newName = file.replace(/^\d+-/, '');
      
      if (newName !== file) {
        const oldPath = join(blogPtPath, file);
        const newPath = join(blogPtPath, newName);
        
        renameOperations.push({
          old: file,
          new: newName,
          oldPath,
          newPath,
        });
      }
    }

    // Mostrar preview das mudanças
    console.log('📋 Preview das mudanças:\n');
    for (const op of renameOperations) {
      console.log(`  ${op.old}`);
      console.log(`  → ${op.new}\n`);
    }

    // Confirmar e executar
    console.log(`\n✨ Preparado para renomear ${renameOperations.length} arquivos.\n`);
    
    // Executar renomeações
    for (const op of renameOperations) {
      await rename(op.oldPath, op.newPath);
      console.log(`✅ ${op.old} → ${op.new}`);
    }

    console.log(`\n🎉 Concluído! ${renameOperations.length} arquivos renomeados com sucesso.`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

removeNumberPrefix();

