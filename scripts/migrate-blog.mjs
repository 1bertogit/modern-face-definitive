/**
 * Blog Migration Script
 * Converts .astro blog files to MDX Content Collections
 *
 * This script only uses fs and path modules - no shell commands.
 *
 * Usage: node scripts/migrate-blog.mjs
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(currentDir, '..');

// Locale mapping
const localeConfig = {
  'src/pages/blog': { locale: 'pt', folder: 'pt' },
  'src/pages/en/blog': { locale: 'en', folder: 'en' },
  'src/pages/es/blog': { locale: 'es', folder: 'es' },
};

/**
 * Extract metadata from Astro file frontmatter
 */
function extractMetadata(content, filename) {
  const metadata = {
    title: '',
    description: '',
    category: 'Geral',
    date: '2024-12-01',
    author: 'Dr. Roberio Brandao',
    readTime: '8 min',
    featured: false,
    keywords: [],
    faq: [],
    articleType: 'MedicalWebPage',
  };

  // Extract title from BaseLayout
  const titleMatch = content.match(/title\s*=\s*["'`]([^"'`]+?)(?:\s*\|\s*[^"'`]+)?["'`]/);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // Extract description from BaseLayout
  const descMatch = content.match(/description\s*=\s*["'`]([^"'`]+)["'`]/);
  if (descMatch) {
    metadata.description = descMatch[1].trim();
  }

  // Extract keywords array
  const keywordsMatch = content.match(/const\s+keywords\s*=\s*\[([\s\S]*?)\];/);
  if (keywordsMatch) {
    const keywordStr = keywordsMatch[1];
    const keywords = [];
    const keywordPattern = /["']([^"']+)["']/g;
    let match;
    while ((match = keywordPattern.exec(keywordStr)) !== null) {
      keywords.push(match[1]);
    }
    metadata.keywords = keywords;
  }

  // Extract category from SchemaArticle section prop
  const sectionMatch = content.match(/section\s*=\s*["']([^"']+)["']/);
  if (sectionMatch) {
    metadata.category = sectionMatch[1];
  }

  // Extract date from datePublished
  const dateMatch = content.match(/datePublished\s*=\s*["']([^"']+)["']/);
  if (dateMatch) {
    metadata.date = dateMatch[1];
  }

  // Check if featured/pillar article
  if (content.includes('ARTIGO PILAR') || content.includes('PILLAR ARTICLE') || content.includes('Artigo Pilar')) {
    metadata.featured = true;
  }

  // Extract read time
  const readTimeMatch = content.match(/(\d+)\s*min\s*(?:de\s+leitura|read|de\s+lectura)/i);
  if (readTimeMatch) {
    metadata.readTime = readTimeMatch[1] + ' min';
  }

  // Extract FAQ items
  const faqMatch = content.match(/const\s+faqItems\s*=\s*\[([\s\S]*?)\];/);
  if (faqMatch) {
    const faqStr = faqMatch[1];
    const faqPattern = /\{\s*question:\s*["'`]([\s\S]*?)["'`],\s*answer:\s*["'`]([\s\S]*?)["'`],?\s*\}/g;
    let match;
    while ((match = faqPattern.exec(faqStr)) !== null) {
      metadata.faq.push({
        question: match[1].replace(/\n\s*/g, ' ').trim(),
        answer: match[2].replace(/\n\s*/g, ' ').trim(),
      });
    }
  }

  return metadata;
}

/**
 * Extract and convert HTML content to Markdown
 */
function extractContent(content) {
  // Find the main article content
  let articleContent = '';

  // Try to find content between article tags
  const articleMatch = content.match(/<article[\s\S]*?>([\s\S]*?)<\/article>/);
  if (articleMatch) {
    articleContent = articleMatch[1];
  }

  if (!articleContent) {
    return '<!-- Content extraction failed - manual review needed -->';
  }

  // Convert HTML to Markdown
  let markdown = articleContent;

  // Remove JSX comments
  markdown = markdown.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Convert headings
  markdown = markdown.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  markdown = markdown.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  markdown = markdown.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');

  // Convert paragraphs
  markdown = markdown.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // Convert strong/bold
  markdown = markdown.replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**');

  // Convert em/italic
  markdown = markdown.replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*');

  // Convert links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Convert blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, inner) => {
    const cleanContent = inner.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '').trim();
    const footerMatch = inner.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
    let result = cleanContent.split('\n').map(line => '> ' + line.trim()).join('\n');
    if (footerMatch) {
      result = result + '\n> \n> - ' + footerMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    return '\n' + result + '\n';
  });

  // Convert unordered lists
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, inner) => {
    return inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  });

  // Remove Material Symbols spans
  markdown = markdown.replace(/<span\s+class="material-symbols-outlined[^"]*"[^>]*>[^<]*<\/span>/gi, '');

  // Remove section, div, nav, details, summary tags but keep content
  markdown = markdown.replace(/<\/?(?:section|div|nav|details|summary|span|footer)[^>]*>/gi, '');

  // Remove class attributes
  markdown = markdown.replace(/\s+class="[^"]*"/gi, '');

  // Remove Astro expressions
  markdown = markdown.replace(/\{[^}]+\}/g, '');

  // Clean up whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.replace(/^\s+/gm, '');
  markdown = markdown.replace(/^\n+/, '');

  return markdown.trim();
}

/**
 * Generate MDX content with frontmatter
 */
function generateMDX(metadata, content, locale, canonicalSlug) {
  let faqYaml = '';
  if (metadata.faq.length > 0) {
    faqYaml = 'faq:\n' + metadata.faq.map(f =>
      '  - question: "' + f.question.replace(/"/g, '\\"') + '"\n    answer: "' + f.answer.replace(/"/g, '\\"') + '"'
    ).join('\n');
  }

  let keywordsYaml = '';
  if (metadata.keywords.length > 0) {
    keywordsYaml = 'keywords:\n' + metadata.keywords.map(k => '  - "' + k + '"').join('\n');
  }

  const frontmatter = '---\n' +
    'title: "' + metadata.title.replace(/"/g, '\\"') + '"\n' +
    'description: "' + metadata.description.replace(/"/g, '\\"') + '"\n' +
    'category: "' + metadata.category + '"\n' +
    'date: ' + metadata.date + '\n' +
    'author: "' + metadata.author + '"\n' +
    'readTime: "' + metadata.readTime + '"\n' +
    'featured: ' + metadata.featured + '\n' +
    'draft: false\n' +
    'locale: "' + locale + '"\n' +
    'canonicalSlug: "' + canonicalSlug + '"\n' +
    (keywordsYaml ? keywordsYaml + '\n' : '') +
    'articleType: "' + metadata.articleType + '"\n' +
    (faqYaml ? faqYaml + '\n' : '') +
    '---\n\n' +
    content + '\n';

  return frontmatter;
}

/**
 * Migrate a single file
 */
function migrateFile(sourcePath, locale, outputFolder) {
  const filename = basename(sourcePath, '.astro');
  const content = readFileSync(sourcePath, 'utf-8');

  console.log('  Processing: ' + filename);

  const metadata = extractMetadata(content, filename);
  const markdownContent = extractContent(content);
  const canonicalSlug = filename; // Use filename as canonical slug

  const mdxContent = generateMDX(metadata, markdownContent, locale, canonicalSlug);

  const outputPath = join(projectRoot, 'src/content/blog', outputFolder, filename + '.mdx');
  writeFileSync(outputPath, mdxContent);

  return { filename: filename, success: true };
}

/**
 * Main migration function
 */
function migrate() {
  console.log('Blog Migration Script');
  console.log('=====================\n');

  let totalMigrated = 0;
  let totalErrors = 0;

  for (const [sourceDir, config] of Object.entries(localeConfig)) {
    const fullSourceDir = join(projectRoot, sourceDir);

    if (!existsSync(fullSourceDir)) {
      console.log('Skipping ' + sourceDir + ' - directory not found');
      continue;
    }

    console.log('\nProcessing ' + config.locale + ' (' + sourceDir + '):');

    // Ensure output directory exists
    const outputDir = join(projectRoot, 'src/content/blog', config.folder);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Get all .astro files (excluding index and dynamic routes)
    const files = readdirSync(fullSourceDir)
      .filter(f => f.endsWith('.astro') && f !== 'index.astro' && !f.startsWith('['));

    console.log('  Found ' + files.length + ' files to migrate');

    for (const file of files) {
      try {
        const sourcePath = join(fullSourceDir, file);
        migrateFile(sourcePath, config.locale, config.folder);
        totalMigrated++;
      } catch (error) {
        console.error('  ERROR migrating ' + file + ': ' + error.message);
        totalErrors++;
      }
    }
  }

  console.log('\n=====================');
  console.log('Migration complete!');
  console.log('  Migrated: ' + totalMigrated + ' files');
  console.log('  Errors: ' + totalErrors + ' files');
  console.log('\nNext steps:');
  console.log('1. Review generated MDX files for content accuracy');
  console.log('2. Update dynamic routes to use Content Collections');
  console.log('3. Update index pages to use getBlogPostsByLocale()');
  console.log('4. Run npm run build to validate');
}

migrate();
