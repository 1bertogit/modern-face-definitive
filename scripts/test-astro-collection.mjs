#!/usr/bin/env node
/**
 * Testar se o Astro consegue carregar todos os posts
 * Simula a validação do schema
 */

import { readFileSync } from 'fs';
import { readdirSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

// Schema do blog (copiado de src/content/config.ts)
const blogSchema = z.object({
  title: z.string().max(150, 'Title should be under 150 characters for SEO'),
  description: z.string().max(300, 'Description should be under 300 characters'),
  category: z.string(),
  date: z.coerce.date(),
  author: z.string().default('Dr. Robério Brandão'),
  readTime: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional(),
  image: z
    .union([
      z.string(),
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    ])
    .optional(),
  ogImage: z.string().optional(),
  relatedPosts: z.array(z.string()).optional(),
  articleType: z
    .enum(['Article', 'MedicalWebPage', 'BlogPosting', 'NewsArticle'])
    .default('MedicalWebPage'),
  faq: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
  locale: z.enum(['pt', 'en', 'es']).default('pt'),
  canonicalSlug: z.string().optional(),
});

const blogDir = 'src/content/blog/pt';
const files = readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

console.log(`📁 Testando validação de ${files.length} arquivos...\n`);

const results = {
  valid: [],
  invalid: [],
  errors: [],
};

for (const file of files) {
  const filePath = join(blogDir, file);
  const content = readFileSync(filePath, 'utf-8');
  
  // Extrair frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    results.invalid.push({ file, error: 'No frontmatter' });
    continue;
  }
  
  const frontmatter = frontmatterMatch[1];
  
  // Tentar parsear YAML manualmente (simples)
  const data = {};
  const lines = frontmatter.split('\n');
  let currentKey = null;
  let currentValue = [];
  let inArray = false;
  let inObject = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('- ') && currentKey) {
      // Item de array
      currentValue.push(line.substring(2).replace(/^["']|["']$/g, ''));
      continue;
    }
    
    if (line.includes(':') && !line.startsWith('-')) {
      // Nova chave
      if (currentKey && currentValue.length > 0) {
        data[currentKey] = currentValue.length === 1 ? currentValue[0] : currentValue;
      } else if (currentKey) {
        data[currentKey] = true;
      }
      
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      const value = valueParts.join(':').trim();
      
      if (value === '' || value === 'true' || value === 'false') {
        currentValue = value === 'true' ? true : value === 'false' ? false : [];
      } else {
        currentValue = [value.replace(/^["']|["']$/g, '')];
      }
    } else if (currentKey && line) {
      currentValue.push(line.replace(/^["']|["']$/g, ''));
    }
  }
  
  if (currentKey) {
    if (Array.isArray(currentValue) && currentValue.length === 1 && !inArray) {
      data[currentKey] = currentValue[0];
    } else {
      data[currentKey] = currentValue.length > 0 ? currentValue : true;
    }
  }
  
  // Converter tipos básicos
  if (data.date) {
    try {
      data.date = new Date(data.date);
    } catch (e) {
      // Ignorar
    }
  }
  
  if (data.featured === 'true' || data.featured === true) {
    data.featured = true;
  } else if (data.featured === 'false' || data.featured === false) {
    data.featured = false;
  }
  
  if (data.draft === 'true' || data.draft === true) {
    data.draft = true;
  } else if (data.draft === 'false' || data.draft === false) {
    data.draft = false;
  }
  
  // Validar com Zod
  try {
    const validated = blogSchema.parse(data);
    if (!validated.draft && validated.locale === 'pt') {
      results.valid.push(file);
    } else if (validated.draft) {
      results.invalid.push({ file, error: 'Draft: true' });
    } else if (validated.locale !== 'pt') {
      results.invalid.push({ file, error: `Locale: ${validated.locale}` });
    }
  } catch (error) {
    results.invalid.push({ file, error: error.message });
    results.errors.push({ file, error: error.message });
  }
}

console.log(`✅ Posts válidos (pt, !draft): ${results.valid.length}`);
console.log(`❌ Posts inválidos: ${results.invalid.length}\n`);

if (results.invalid.length > 0) {
  console.log('📋 Detalhes dos posts inválidos:');
  results.invalid.forEach(({ file, error }) => {
    console.log(`   - ${file}: ${error}`);
  });
  console.log();
}

if (results.errors.length > 0 && results.errors.length <= 20) {
  console.log('🔍 Erros de validação:');
  results.errors.forEach(({ file, error }) => {
    console.log(`   - ${file}`);
    console.log(`     ${error.split('\n')[0]}`);
  });
}

console.log(`\n📊 Resumo:`);
console.log(`   Total de arquivos: ${files.length}`);
console.log(`   Posts válidos (pt, !draft): ${results.valid.length}`);
console.log(`   Esperado: 75`);

if (results.valid.length !== 75) {
  console.log(`\n⚠️  DIFERENÇA: ${75 - results.valid.length} posts`);
}

