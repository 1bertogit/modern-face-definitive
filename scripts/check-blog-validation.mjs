#!/usr/bin/env node
/**
 * Script para verificar erros de validação nos posts do blog
 */

import { readFileSync } from 'fs';
import { readdirSync } from 'fs';
import { join } from 'path';

const blogDir = 'src/content/blog/pt';
const files = readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

console.log(`📁 Total de arquivos: ${files.length}\n`);

const issues = {
  missingLocale: [],
  wrongLocale: [],
  draftTrue: [],
  invalidDate: [],
  titleTooLong: [],
  descriptionTooLong: [],
  missingRequired: [],
  extraFields: [],
};

for (const file of files) {
  const filePath = join(blogDir, file);
  const content = readFileSync(filePath, 'utf-8');
  
  // Extrair frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    issues.missingRequired.push({ file, reason: 'No frontmatter' });
    continue;
  }
  
  const frontmatter = frontmatterMatch[1];
  const lines = frontmatter.split('\n');
  const data = {};
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const keyClean = key.trim();
      const valueClean = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      data[keyClean] = valueClean;
    }
  }
  
  // Verificar locale
  if (!data.locale) {
    issues.missingLocale.push(file);
  } else if (data.locale !== 'pt' && data.locale !== '"pt"' && data.locale !== "'pt'") {
    issues.wrongLocale.push({ file, locale: data.locale });
  }
  
  // Verificar draft
  if (data.draft === 'true' || data.draft === true) {
    issues.draftTrue.push(file);
  }
  
  // Verificar título
  if (data.title && data.title.length > 150) {
    issues.titleTooLong.push({ file, length: data.title.length });
  }
  
  // Verificar descrição
  if (data.description && data.description.length > 300) {
    issues.descriptionTooLong.push({ file, length: data.description.length });
  }
  
  // Verificar campos obrigatórios
  const required = ['title', 'description', 'category', 'date'];
  for (const field of required) {
    if (!data[field]) {
      issues.missingRequired.push({ file, reason: `Missing ${field}` });
    }
  }
  
  // Verificar data
  if (data.date) {
    try {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        issues.invalidDate.push({ file, date: data.date });
      }
    } catch (e) {
      issues.invalidDate.push({ file, date: data.date });
    }
  }
  
  // Verificar campos extras (não no schema)
  const schemaFields = [
    'title', 'description', 'category', 'date', 'author', 'readTime', 
    'featured', 'draft', 'keywords', 'canonicalUrl', 'image', 'ogImage',
    'relatedPosts', 'articleType', 'faq', 'locale', 'canonicalSlug'
  ];
  const extraFields = Object.keys(data).filter(k => !schemaFields.includes(k));
  if (extraFields.length > 0) {
    issues.extraFields.push({ file, fields: extraFields });
  }
}

console.log('🔍 Resultados da Análise:\n');

if (issues.missingLocale.length > 0) {
  console.log(`❌ Arquivos sem locale: ${issues.missingLocale.length}`);
  issues.missingLocale.forEach(f => console.log(`   - ${f}`));
  console.log();
}

if (issues.wrongLocale.length > 0) {
  console.log(`❌ Arquivos com locale errado: ${issues.wrongLocale.length}`);
  issues.wrongLocale.forEach(({ file, locale }) => console.log(`   - ${file}: ${locale}`));
  console.log();
}

if (issues.draftTrue.length > 0) {
  console.log(`📝 Arquivos com draft=true: ${issues.draftTrue.length}`);
  issues.draftTrue.forEach(f => console.log(`   - ${f}`));
  console.log();
}

if (issues.titleTooLong.length > 0) {
  console.log(`⚠️  Títulos muito longos (>150): ${issues.titleTooLong.length}`);
  issues.titleTooLong.forEach(({ file, length }) => console.log(`   - ${file}: ${length} chars`));
  console.log();
}

if (issues.descriptionTooLong.length > 0) {
  console.log(`⚠️  Descrições muito longas (>300): ${issues.descriptionTooLong.length}`);
  issues.descriptionTooLong.forEach(({ file, length }) => console.log(`   - ${file}: ${length} chars`));
  console.log();
}

if (issues.invalidDate.length > 0) {
  console.log(`❌ Datas inválidas: ${issues.invalidDate.length}`);
  issues.invalidDate.forEach(({ file, date }) => console.log(`   - ${file}: ${date}`));
  console.log();
}

if (issues.missingRequired.length > 0) {
  console.log(`❌ Campos obrigatórios faltando: ${issues.missingRequired.length}`);
  issues.missingRequired.forEach(({ file, reason }) => console.log(`   - ${file}: ${reason}`));
  console.log();
}

if (issues.extraFields.length > 0) {
  console.log(`ℹ️  Arquivos com campos extras (não no schema): ${issues.extraFields.length}`);
  if (issues.extraFields.length <= 10) {
    issues.extraFields.forEach(({ file, fields }) => console.log(`   - ${file}: ${fields.join(', ')}`));
  } else {
    console.log(`   (Mostrando apenas os primeiros 10)`);
    issues.extraFields.slice(0, 10).forEach(({ file, fields }) => console.log(`   - ${file}: ${fields.join(', ')}`));
  }
  console.log();
}

const totalIssues = 
  issues.missingLocale.length +
  issues.wrongLocale.length +
  issues.draftTrue.length +
  issues.titleTooLong.length +
  issues.descriptionTooLong.length +
  issues.invalidDate.length +
  issues.missingRequired.length;

const validPosts = files.length - totalIssues;

console.log(`\n📊 Resumo:`);
console.log(`   Total de arquivos: ${files.length}`);
console.log(`   Posts válidos (sem problemas críticos): ${validPosts}`);
console.log(`   Posts com problemas: ${totalIssues}`);
console.log(`   Posts com draft: ${issues.draftTrue.length}`);

if (validPosts !== 75) {
  console.log(`\n⚠️  PROBLEMA: Esperado 75 posts válidos, mas encontrado ${validPosts}`);
  console.log(`   Diferença: ${75 - validPosts} posts`);
}

