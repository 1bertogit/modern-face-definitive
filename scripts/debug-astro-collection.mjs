#!/usr/bin/env node
/**
 * Debug script para verificar o que o Astro está retornando
 * Executa durante o build/dev do Astro
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

// Criar um script temporário que será executado pelo Astro
const astroScript = `
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const ptPosts = allPosts.filter(p => p.data.locale === 'pt');
const ptNoDraft = ptPosts.filter(p => !p.data.draft);

console.log('Total posts:', allPosts.length);
console.log('PT posts:', ptPosts.length);
console.log('PT no draft:', ptNoDraft.length);

// Listar slugs
console.log('\\nSlugs PT (sem draft):');
ptNoDraft.forEach(p => {
  const slug = p.slug.split('/').slice(1).join('/') || p.slug;
  console.log('  -', slug);
});

// Verificar erros de validação
const errors = [];
for (const post of allPosts) {
  try {
    // Tentar acessar propriedades
    const test = post.data.title;
  } catch (e) {
    errors.push({ slug: post.slug, error: e.message });
  }
}

if (errors.length > 0) {
  console.log('\\nErros encontrados:');
  errors.forEach(({ slug, error }) => {
    console.log('  -', slug, ':', error);
  });
}
`;

writeFileSync('scripts/temp-astro-debug.mjs', astroScript);

console.log('📝 Script criado. Execute:');
console.log('   npm run dev');
console.log('   E então acesse: http://localhost:3000/debug-blog');
console.log('\nOu execute o build e verifique os logs:');
console.log('   npm run build 2>&1 | grep -A 100 "DEBUG"');

