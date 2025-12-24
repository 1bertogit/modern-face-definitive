#!/usr/bin/env node
/**
 * Blog Audit Script
 * Analisa todos os posts do blog seguindo critérios do BLOG_ANALYSIS.md
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Critérios de auditoria
const CRITERIA = {
  MIN_WORDS: 2000,
  MIN_INTERNAL_LINKS: 5,
  MIN_FAQ: 5,
  MIN_KEYWORDS: 5,
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 160,
};

// Copy-bank headlines para verificar
const COPY_BANK_HEADLINES = [
  'Domine em 30 Casos',
  'Zero Lesão Nervosa',
  'Segurança Máxima Garantida',
  '3-4x MAIS SEGURO',
  '18 Anos em 30 Casos',
  'Juventude Restaurada',
  'Recuperação 50% mais rápida',
  'Bem vindo a Era da Face Moderna',
  'Mito Quebrado',
  'Taxa zero de lesão nervosa',
  'À prova de erros catastróficos',
  '3% complicações vs 12%',
];

// Dados/estatísticas esperados
const EXPECTED_STATS = [
  '212 casos',
  '0% lesão',
  '1.500+',
  '1500+',
  'zero lesão',
  'lesão nervosa permanente',
  'taxa de complicações',
  '3%',
  '12%',
];

function countWords(text) {
  // Remove frontmatter, code blocks, markdown syntax
  const cleanText = text
    .replace(/^---[\s\S]*?---/m, '') // Remove frontmatter
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links but keep text
    .replace(/[#*\-_=]/g, '') // Remove markdown formatting
    .replace(/\n+/g, ' ')
    .trim();
  
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
  if (!frontmatterMatch) return null;
  
  const frontmatterText = frontmatterMatch[1];
  const frontmatter = {};
  
  // Parse básico do YAML
  const lines = frontmatterText.split('\n');
  let currentKey = null;
  let currentValue = [];
  let inArray = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    if (trimmed.startsWith('- ')) {
      // Array item
      if (currentKey) {
        if (!Array.isArray(frontmatter[currentKey])) {
          frontmatter[currentKey] = [];
        }
        frontmatter[currentKey].push(trimmed.substring(2).replace(/^["']|["']$/g, ''));
      }
    } else if (trimmed.includes(':')) {
      // Key-value pair
      const [key, ...valueParts] = trimmed.split(':');
      const cleanKey = key.trim();
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      
      if (value === '' || value === '[]') {
        frontmatter[cleanKey] = [];
      } else if (value.startsWith('[')) {
        frontmatter[cleanKey] = [];
      } else {
        frontmatter[cleanKey] = value;
        currentKey = cleanKey;
      }
    }
  }
  
  return frontmatter;
}

function countInternalLinks(content) {
  // Remove frontmatter
  const body = content.replace(/^---[\s\S]*?---/m, '');
  
  // Find markdown links
  const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(body)) !== null) {
    const url = match[2];
    // Internal links (relative paths or blog paths)
    if (url.startsWith('/') || url.startsWith('./') || url.includes('/blog/') || url.includes('/tecnicas/')) {
      links.push({ text: match[1], url });
    }
  }
  
  return links;
}

function analyzeStructure(content) {
  const body = content.replace(/^---[\s\S]*?---/m, '');
  
  // Match H1s - can be at start of line or after blank lines
  const h1Matches = body.match(/^#\s+.+$/gm) || [];
  // Also check for H1s that might be indented or have different spacing
  const h1MatchesAlt = body.match(/\n#\s+.+$/gm) || [];
  const allH1s = [...new Set([...h1Matches, ...h1MatchesAlt])];
  
  const h2Matches = body.match(/^##\s+.+$/gm) || [];
  const h3Matches = body.match(/^###\s+.+$/gm) || [];
  
  return {
    h1Count: allH1s.length,
    h2Count: h2Matches.length,
    h3Count: h3Matches.length,
    h1s: allH1s.map(h => h.replace(/^[\n#]*\s*#\s+/, '').trim()),
    h2s: h2Matches.map(h => h.replace(/^##\s+/, '')),
  };
}

function checkForStats(content) {
  const lowerContent = content.toLowerCase();
  return EXPECTED_STATS.some(stat => lowerContent.includes(stat.toLowerCase()));
}

function checkForCopyBank(content) {
  const lowerContent = content.toLowerCase();
  return COPY_BANK_HEADLINES.some(headline => 
    lowerContent.includes(headline.toLowerCase())
  );
}

function checkCTAs(content) {
  const body = content.replace(/^---[\s\S]*?---/m, '').toLowerCase();
  
  const ctaPatterns = [
    /conhecer programa/i,
    /conhecer programas/i,
    /tirar dúvidas/i,
    /saiba mais/i,
    /conhecer mentoria/i,
    /conhecer formação/i,
    /educacao/i,
    /contato/i,
  ];
  
  const hasCTA = ctaPatterns.some(pattern => pattern.test(body));
  const hasCopyBank = checkForCopyBank(content);
  
  return { hasCTA, hasCopyBank, ctaQuality: hasCTA && hasCopyBank ? 'good' : hasCTA ? 'weak' : 'missing' };
}

function analyzePost(filePath, locale) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const frontmatter = extractFrontmatter(content);
    
    if (!frontmatter) {
      return {
        file: filePath,
        error: 'No frontmatter found',
      };
    }
    
    const wordCount = countWords(content);
    const internalLinks = countInternalLinks(content);
    const structure = analyzeStructure(content);
    const hasStats = checkForStats(content);
    const ctaAnalysis = checkCTAs(content);
    
    const issues = [];
    const warnings = [];
    
    // Word count
    if (wordCount < CRITERIA.MIN_WORDS) {
      issues.push(`Word count insuficiente: ${wordCount} (meta: ${CRITERIA.MIN_WORDS}+)`);
    }
    
    // Internal links
    if (internalLinks.length < CRITERIA.MIN_INTERNAL_LINKS) {
      issues.push(`Internal links insuficientes: ${internalLinks.length} (meta: ${CRITERIA.MIN_INTERNAL_LINKS}+)`);
    }
    
    // Structure
    if (structure.h1Count === 0) {
      issues.push('H1 ausente');
    } else if (structure.h1Count > 1) {
      warnings.push(`Múltiplos H1s encontrados: ${structure.h1Count}`);
    }
    
    if (structure.h2Count < 4) {
      warnings.push(`Poucos H2s: ${structure.h2Count} (recomendado: 4-6)`);
    }
    
    // Frontmatter
    if (!frontmatter.title) {
      issues.push('Title ausente no frontmatter');
    } else if (frontmatter.title.length > CRITERIA.MAX_TITLE_LENGTH) {
      warnings.push(`Title muito longo: ${frontmatter.title.length} chars (max: ${CRITERIA.MAX_TITLE_LENGTH})`);
    }
    
    if (!frontmatter.description) {
      issues.push('Description ausente no frontmatter');
    } else if (frontmatter.description.length > CRITERIA.MAX_DESCRIPTION_LENGTH) {
      warnings.push(`Description muito longa: ${frontmatter.description.length} chars (max: ${CRITERIA.MAX_DESCRIPTION_LENGTH})`);
    }
    
    const faqCount = Array.isArray(frontmatter.faq) ? frontmatter.faq.length : 0;
    if (faqCount < CRITERIA.MIN_FAQ) {
      warnings.push(`FAQ insuficiente: ${faqCount} (meta: ${CRITERIA.MIN_FAQ}+)`);
    }
    
    const keywordsCount = Array.isArray(frontmatter.keywords) ? frontmatter.keywords.length : 0;
    if (keywordsCount < CRITERIA.MIN_KEYWORDS) {
      warnings.push(`Keywords insuficientes: ${keywordsCount} (meta: ${CRITERIA.MIN_KEYWORDS}+)`);
    }
    
    // Stats
    if (!hasStats) {
      warnings.push('Não menciona dados/estatísticas (212 casos, 0% lesão, etc.)');
    }
    
    // CTAs
    if (ctaAnalysis.ctaQuality === 'missing') {
      issues.push('CTA ausente');
    } else if (ctaAnalysis.ctaQuality === 'weak') {
      warnings.push('CTA presente mas não usa copy-bank');
    }
    
    return {
      file: filePath.replace(rootDir + '/', ''),
      locale,
      title: frontmatter.title || 'N/A',
      wordCount,
      internalLinksCount: internalLinks.length,
      internalLinks: internalLinks.map(l => l.url),
      h1Count: structure.h1Count,
      h2Count: structure.h2Count,
      h3Count: structure.h3Count,
      faqCount,
      keywordsCount,
      hasStats,
      ctaQuality: ctaAnalysis.ctaQuality,
      issues,
      warnings,
      score: calculateScore({
        wordCount,
        internalLinksCount: internalLinks.length,
        h1Count: structure.h1Count,
        h2Count: structure.h2Count,
        faqCount,
        keywordsCount,
        hasStats,
        ctaQuality: ctaAnalysis.ctaQuality,
      }),
    };
  } catch (error) {
    return {
      file: filePath,
      error: error.message,
    };
  }
}

function calculateScore(metrics) {
  let score = 100;
  
  // Word count (30 points)
  if (metrics.wordCount < CRITERIA.MIN_WORDS) {
    const ratio = metrics.wordCount / CRITERIA.MIN_WORDS;
    score -= (1 - ratio) * 30;
  }
  
  // Internal links (20 points)
  if (metrics.internalLinksCount < CRITERIA.MIN_INTERNAL_LINKS) {
    const ratio = metrics.internalLinksCount / CRITERIA.MIN_INTERNAL_LINKS;
    score -= (1 - ratio) * 20;
  }
  
  // Structure (20 points)
  if (metrics.h1Count !== 1) score -= 10;
  if (metrics.h2Count < 4) score -= 10;
  
  // FAQ (10 points)
  if (metrics.faqCount < CRITERIA.MIN_FAQ) {
    const ratio = metrics.faqCount / CRITERIA.MIN_FAQ;
    score -= (1 - ratio) * 10;
  }
  
  // Keywords (5 points)
  if (metrics.keywordsCount < CRITERIA.MIN_KEYWORDS) {
    const ratio = metrics.keywordsCount / CRITERIA.MIN_KEYWORDS;
    score -= (1 - ratio) * 5;
  }
  
  // Stats (10 points)
  if (!metrics.hasStats) score -= 10;
  
  // CTA (5 points)
  if (metrics.ctaQuality === 'missing') score -= 5;
  else if (metrics.ctaQuality === 'weak') score -= 2;
  
  return Math.max(0, Math.round(score));
}

function getAllBlogPosts() {
  const posts = [];
  const blogDir = join(rootDir, 'src/content/blog');
  
  const locales = ['pt', 'en', 'es'];
  
  for (const locale of locales) {
    const localeDir = join(blogDir, locale);
    try {
      const files = readdirSync(localeDir);
      for (const file of files) {
        if (file.endsWith('.mdx')) {
          posts.push({
            path: join(localeDir, file),
            locale,
            slug: file.replace('.mdx', ''),
          });
        }
      }
    } catch (error) {
      // Directory might not exist
    }
  }
  
  // Also check root blog directory
  try {
    const rootFiles = readdirSync(blogDir);
    for (const file of rootFiles) {
      if (file.endsWith('.mdx')) {
        posts.push({
          path: join(blogDir, file),
          locale: 'pt',
          slug: file.replace('.mdx', ''),
        });
      }
    }
  } catch (error) {
    // Ignore
  }
  
  return posts;
}

function generateReport(analyses) {
  const validAnalyses = analyses.filter(a => !a.error);
  const totalPosts = validAnalyses.length;
  
  // Statistics
  const avgWordCount = validAnalyses.reduce((sum, a) => sum + a.wordCount, 0) / totalPosts;
  const avgInternalLinks = validAnalyses.reduce((sum, a) => sum + a.internalLinksCount, 0) / totalPosts;
  const avgScore = validAnalyses.reduce((sum, a) => sum + a.score, 0) / totalPosts;
  
  const postsWithIssues = validAnalyses.filter(a => a.issues.length > 0);
  const postsWithWarnings = validAnalyses.filter(a => a.warnings.length > 0);
  
  const postsBelowWordCount = validAnalyses.filter(a => a.wordCount < CRITERIA.MIN_WORDS);
  const postsBelowLinks = validAnalyses.filter(a => a.internalLinksCount < CRITERIA.MIN_INTERNAL_LINKS);
  const postsWithoutStats = validAnalyses.filter(a => !a.hasStats);
  const postsWeakCTAs = validAnalyses.filter(a => a.ctaQuality === 'weak' || a.ctaQuality === 'missing');
  
  // Group by locale
  const byLocale = {};
  validAnalyses.forEach(a => {
    if (!byLocale[a.locale]) byLocale[a.locale] = [];
    byLocale[a.locale].push(a);
  });
  
  return {
    summary: {
      totalPosts,
      avgWordCount: Math.round(avgWordCount),
      avgInternalLinks: Math.round(avgInternalLinks * 10) / 10,
      avgScore: Math.round(avgScore * 10) / 10,
      postsWithIssues: postsWithIssues.length,
      postsWithWarnings: postsWithWarnings.length,
      postsBelowWordCount: postsBelowWordCount.length,
      postsBelowLinks: postsBelowLinks.length,
      postsWithoutStats: postsWithoutStats.length,
      postsWeakCTAs: postsWeakCTAs.length,
    },
    byLocale,
    allAnalyses: validAnalyses.sort((a, b) => a.score - b.score), // Sort by score (worst first)
    topIssues: getTopIssues(validAnalyses),
  };
}

function getTopIssues(analyses) {
  const issueCounts = {};
  
  analyses.forEach(a => {
    a.issues.forEach(issue => {
      const key = issue.split(':')[0]; // Get issue type
      issueCounts[key] = (issueCounts[key] || 0) + 1;
    });
    
    a.warnings.forEach(warning => {
      const key = warning.split(':')[0];
      issueCounts[key] = (issueCounts[key] || 0) + 1;
    });
  });
  
  return Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([issue, count]) => ({ issue, count }));
}

// Main execution
const posts = getAllBlogPosts();
console.log(`Analisando ${posts.length} posts do blog...\n`);

const analyses = posts.map(post => analyzePost(post.path, post.locale));

const report = generateReport(analyses);

// Output report
console.log('='.repeat(80));
console.log('RELATÓRIO DE AUDITORIA DO BLOG');
console.log('='.repeat(80));
console.log();

console.log('📊 RESUMO GERAL');
console.log('-'.repeat(80));
console.log(`Total de posts analisados: ${report.summary.totalPosts}`);
console.log(`Média de palavras: ${report.summary.avgWordCount} (meta: ${CRITERIA.MIN_WORDS}+)`);
console.log(`Média de internal links: ${report.summary.avgInternalLinks} (meta: ${CRITERIA.MIN_INTERNAL_LINKS}+)`);
console.log(`Score médio: ${report.summary.avgScore}/100`);
console.log();

console.log('⚠️  PROBLEMAS IDENTIFICADOS');
console.log('-'.repeat(80));
console.log(`Posts com issues críticos: ${report.summary.postsWithIssues}`);
console.log(`Posts com warnings: ${report.summary.postsWithWarnings}`);
console.log(`Posts abaixo de ${CRITERIA.MIN_WORDS} palavras: ${report.summary.postsBelowWordCount} (${Math.round(report.summary.postsBelowWordCount / report.summary.totalPosts * 100)}%)`);
console.log(`Posts abaixo de ${CRITERIA.MIN_INTERNAL_LINKS} links: ${report.summary.postsBelowLinks} (${Math.round(report.summary.postsBelowLinks / report.summary.totalPosts * 100)}%)`);
console.log(`Posts sem dados/estatísticas: ${report.summary.postsWithoutStats} (${Math.round(report.summary.postsWithoutStats / report.summary.totalPosts * 100)}%)`);
console.log(`Posts com CTAs fracos/ausentes: ${report.summary.postsWeakCTAs} (${Math.round(report.summary.postsWeakCTAs / report.summary.totalPosts * 100)}%)`);
console.log();

console.log('🔝 TOP 10 PROBLEMAS MAIS COMUNS');
console.log('-'.repeat(80));
report.topIssues.forEach((item, idx) => {
  console.log(`${idx + 1}. ${item.issue}: ${item.count} posts`);
});
console.log();

console.log('📈 ANÁLISE POR IDIOMA');
console.log('-'.repeat(80));
Object.entries(report.byLocale).forEach(([locale, posts]) => {
  const avgWords = Math.round(posts.reduce((sum, p) => sum + p.wordCount, 0) / posts.length);
  const avgLinks = Math.round(posts.reduce((sum, p) => sum + p.internalLinksCount, 0) / posts.length * 10) / 10;
  const avgScore = Math.round(posts.reduce((sum, p) => sum + p.score, 0) / posts.length * 10) / 10;
  
  console.log(`\n${locale.toUpperCase()}:`);
  console.log(`  Posts: ${posts.length}`);
  console.log(`  Média palavras: ${avgWords}`);
  console.log(`  Média links: ${avgLinks}`);
  console.log(`  Score médio: ${avgScore}/100`);
});
console.log();

console.log('📋 POSTS COM MAIORES PROBLEMAS (Score < 50)');
console.log('-'.repeat(80));
const worstPosts = report.allAnalyses.filter(a => a.score < 50).slice(0, 20);
worstPosts.forEach((post, idx) => {
  console.log(`\n${idx + 1}. ${post.title}`);
  console.log(`   Arquivo: ${post.file}`);
  console.log(`   Score: ${post.score}/100`);
  console.log(`   Palavras: ${post.wordCount} | Links: ${post.internalLinksCount} | H2s: ${post.h2Count}`);
  if (post.issues.length > 0) {
    console.log(`   Issues: ${post.issues.join('; ')}`);
  }
  if (post.warnings.length > 0) {
    console.log(`   Warnings: ${post.warnings.slice(0, 3).join('; ')}`);
  }
});

console.log();
console.log('='.repeat(80));
console.log('Auditoria concluída!');
console.log('='.repeat(80));

// Save detailed report to JSON
import { writeFileSync } from 'fs';
writeFileSync(
  join(rootDir, 'BLOG_AUDIT_REPORT.json'),
  JSON.stringify(report, null, 2),
  'utf-8'
);
console.log('\nRelatório detalhado salvo em: BLOG_AUDIT_REPORT.json');

