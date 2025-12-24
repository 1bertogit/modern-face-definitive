/**
 * Script de diagnóstico para verificar por que apenas 34 posts aparecem
 * Execute: node scripts/debug-blog-articles.mjs
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const BLOG_DIR = './src/content/blog/en';

async function analyzeBlogPosts() {
  console.log('🔍 Analisando posts do blog em inglês...\n');

  try {
    // Listar todos os arquivos .mdx
    const files = await readdir(BLOG_DIR);
    const mdxFiles = files.filter(f => f.endsWith('.mdx'));
    
    console.log(`📁 Total de arquivos .mdx encontrados: ${mdxFiles.length}\n`);

    const analysis = {
      total: mdxFiles.length,
      withLocale: 0,
      withoutLocale: 0,
      withDraft: 0,
      withoutDraft: 0,
      draftTrue: 0,
      draftFalse: 0,
      draftUndefined: 0,
      localeEn: 0,
      localePtBr: 0,
      localeEs: 0,
      localeOther: 0,
      localeUndefined: 0,
      withDate: 0,
      withoutDate: 0,
      invalidDate: 0,
      errors: [],
    };

    for (const file of mdxFiles) {
      try {
        const content = await readFile(join(BLOG_DIR, file), 'utf-8');
        const frontmatter = extractFrontmatter(content);

        // Verificar locale
        if (frontmatter.locale) {
          analysis.withLocale++;
          if (frontmatter.locale === 'en') analysis.localeEn++;
          else if (frontmatter.locale === 'pt') analysis.localePtBr++;
          else if (frontmatter.locale === 'es') analysis.localeEs++;
          else analysis.localeOther++;
        } else {
          analysis.withoutLocale++;
          analysis.localeUndefined++;
        }

        // Verificar draft
        if (frontmatter.draft !== undefined) {
          analysis.withDraft++;
          if (frontmatter.draft === true) analysis.draftTrue++;
          else if (frontmatter.draft === false) analysis.draftFalse++;
        } else {
          analysis.withoutDraft++;
          analysis.draftUndefined++;
        }

        // Verificar date
        if (frontmatter.date) {
          analysis.withDate++;
          try {
            const date = new Date(frontmatter.date);
            if (isNaN(date.getTime())) {
              analysis.invalidDate++;
              analysis.errors.push(`${file}: Data inválida: ${frontmatter.date}`);
            }
          } catch (e) {
            analysis.invalidDate++;
            analysis.errors.push(`${file}: Erro ao processar data: ${frontmatter.date}`);
          }
        } else {
          analysis.withoutDate++;
        }

        // Verificar se tem todos os campos obrigatórios
        const required = ['title', 'description', 'category', 'date'];
        const missing = required.filter(field => !frontmatter[field]);
        if (missing.length > 0) {
          analysis.errors.push(`${file}: Campos faltando: ${missing.join(', ')}`);
        }

      } catch (error) {
        analysis.errors.push(`${file}: Erro ao ler arquivo - ${error.message}`);
      }
    }

    // Relatório
    console.log('📊 ESTATÍSTICAS:');
    console.log('─'.repeat(50));
    console.log(`Total de arquivos: ${analysis.total}`);
    console.log(`\n📍 LOCALE:`);
    console.log(`  Com locale definido: ${analysis.withLocale}`);
    console.log(`  Sem locale: ${analysis.withoutLocale}`);
    console.log(`  locale: 'en': ${analysis.localeEn} ✅`);
    console.log(`  locale: 'pt': ${analysis.localePtBr} ❌ (erro!)`);
    console.log(`  locale: 'es': ${analysis.localeEs} ❌ (erro!)`);
    console.log(`  locale: outro: ${analysis.localeOther} ❌ (erro!)`);
    console.log(`  locale: undefined: ${analysis.localeUndefined} ❌ (erro!)`);

    console.log(`\n📝 DRAFT:`);
    console.log(`  Com draft definido: ${analysis.withDraft}`);
    console.log(`  Sem draft: ${analysis.withoutDraft}`);
    console.log(`  draft: true: ${analysis.draftTrue} ❌ (não aparecerá)`);
    console.log(`  draft: false: ${analysis.draftFalse} ✅`);
    console.log(`  draft: undefined: ${analysis.draftUndefined} ✅ (default false)`);

    console.log(`\n📅 DATE:`);
    console.log(`  Com date: ${analysis.withDate}`);
    console.log(`  Sem date: ${analysis.withoutDate} ❌ (erro!)`);
    console.log(`  Date inválida: ${analysis.invalidDate} ❌ (erro!)`);

    // Calcular quantos devem aparecer
    const shouldAppear = analysis.total 
      - analysis.draftTrue 
      - (analysis.localePtBr + analysis.localeEs + analysis.localeOther + analysis.localeUndefined)
      - analysis.withoutDate
      - analysis.invalidDate;

    console.log(`\n🎯 RESULTADO ESPERADO:`);
    console.log(`  Posts que DEVEM aparecer: ${shouldAppear}`);
    console.log(`  Posts que aparecem atualmente: 34`);
    console.log(`  Diferença: ${shouldAppear - 34}`);

    if (analysis.errors.length > 0) {
      console.log(`\n⚠️  ERROS ENCONTRADOS (${analysis.errors.length}):`);
      analysis.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`));
      if (analysis.errors.length > 10) {
        console.log(`  ... e mais ${analysis.errors.length - 10} erros`);
      }
    }

    // Listar posts problemáticos
    console.log(`\n🔍 DIAGNÓSTICO:`);
    if (analysis.localePtBr > 0 || analysis.localeEs > 0 || analysis.localeOther > 0) {
      console.log(`  ⚠️  ${analysis.localePtBr + analysis.localeEs + analysis.localeOther} posts têm locale incorreto`);
    }
    if (analysis.draftTrue > 0) {
      console.log(`  ⚠️  ${analysis.draftTrue} posts estão marcados como draft: true`);
    }
    if (analysis.withoutDate > 0) {
      console.log(`  ⚠️  ${analysis.withoutDate} posts não têm data`);
    }
    if (analysis.invalidDate > 0) {
      console.log(`  ⚠️  ${analysis.invalidDate} posts têm data inválida`);
    }

  } catch (error) {
    console.error('❌ Erro ao analisar:', error);
  }
}

function extractFrontmatter(content) {
  const frontmatter = {};
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  
  if (match) {
    const fmContent = match[1];
    const lines = fmContent.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Remover aspas
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Converter booleanos
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        
        frontmatter[key] = value;
      }
    }
  }
  
  return frontmatter;
}

// Executar
analyzeBlogPosts().catch(console.error);

