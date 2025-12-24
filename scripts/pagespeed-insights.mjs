#!/usr/bin/env node

/**
 * Script para testar performance usando PageSpeed Insights API
 * 
 * Uso:
 *   node scripts/pagespeed-insights.mjs <url> [--mobile] [--categories=performance,accessibility]
 * 
 * Exemplos:
 *   node scripts/pagespeed-insights.mjs https://drroberiobrandao.com
 *   node scripts/pagespeed-insights.mjs https://drroberiobrandao.com --mobile
 *   node scripts/pagespeed-insights.mjs https://drroberiobrandao.com --categories=performance,seo
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Carregar variáveis de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

config({ path: join(projectRoot, '.env') });

// Parse argumentos
const args = process.argv.slice(2);
const url = args.find(arg => !arg.startsWith('--'));
const isMobile = args.includes('--mobile');
const categoriesArg = args.find(arg => arg.startsWith('--categories='));
const categories = categoriesArg 
  ? categoriesArg.split('=')[1].split(',')
  : ['performance', 'accessibility', 'best-practices', 'seo'];

// Validar URL
if (!url) {
  console.error('❌ Erro: URL é obrigatória');
  console.log('\nUso:');
  console.log('  node scripts/pagespeed-insights.mjs <url> [--mobile] [--categories=performance,accessibility]');
  console.log('\nExemplos:');
  console.log('  node scripts/pagespeed-insights.mjs https://drroberiobrandao.com');
  console.log('  node scripts/pagespeed-insights.mjs https://drroberiobrandao.com --mobile');
  console.log('  node scripts/pagespeed-insights.mjs https://drroberiobrandao.com --categories=performance,seo');
  process.exit(1);
}

// Validar URL format
try {
  new URL(url);
} catch {
  console.error('❌ Erro: URL inválida');
  process.exit(1);
}

// Obter API key
const apiKey = process.env.PAGESPEED_API_KEY;

if (!apiKey) {
  console.error('❌ Erro: PAGESPEED_API_KEY não encontrada');
  console.log('\nPara configurar:');
  console.log('1. Obtenha uma API key em: https://console.cloud.google.com/apis/credentials');
  console.log('2. Adicione ao arquivo .env (sem aspas):');
  console.log('   PAGESPEED_API_KEY=sua-chave-aqui');
  console.log('\nOu exporte como variável de ambiente (com aspas):');
  console.log('   export PAGESPEED_API_KEY="sua-chave-aqui"');
  process.exit(1);
}

// Construir URL da API
const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
apiUrl.searchParams.set('url', url);
apiUrl.searchParams.set('key', apiKey);
apiUrl.searchParams.set('strategy', isMobile ? 'mobile' : 'desktop');
categories.forEach(cat => {
  apiUrl.searchParams.append('category', cat);
});

console.log('🔍 Analisando performance...\n');
console.log(`URL: ${url}`);
console.log(`Estratégia: ${isMobile ? 'Mobile' : 'Desktop'}`);
console.log(`Categorias: ${categories.join(', ')}\n`);

try {
  const response = await fetch(apiUrl.toString());
  
  if (!response.ok) {
    const error = await response.json();
    console.error('❌ Erro na API:', error.error?.message || response.statusText);
    if (error.error?.status === 'INVALID_ARGUMENT') {
      console.log('\n💡 Dica: Verifique se a URL está acessível publicamente');
    }
    process.exit(1);
  }

  const data = await response.json();
  
  // Extrair métricas principais
  const lighthouseResult = data.lighthouseResult;
  const categories = lighthouseResult.categories;
  const audits = lighthouseResult.audits;
  
  console.log('📊 RESULTADOS DO PAGESPEED INSIGHTS\n');
  console.log('═'.repeat(60));
  
  // Scores por categoria
  console.log('\n📈 SCORES:');
  Object.entries(categories).forEach(([key, category]) => {
    const score = Math.round(category.score * 100);
    const emoji = score >= 90 ? '✅' : score >= 50 ? '⚠️' : '❌';
    console.log(`  ${emoji} ${category.title}: ${score}/100`);
  });
  
  // Core Web Vitals
  console.log('\n⚡ CORE WEB VITALS:');
  const lcp = audits['largest-contentful-paint'];
  const fid = audits['max-potential-fid'];
  const cls = audits['cumulative-layout-shift'];
  const fcp = audits['first-contentful-paint'];
  const tti = audits['interactive'];
  
  const formatMetric = (audit, threshold) => {
    if (!audit || !audit.numericValue) return 'N/A';
    const value = audit.numericValue;
    const displayValue = value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`;
    const status = value <= threshold ? '✅' : '⚠️';
    return `${status} ${displayValue} (${audit.displayValue})`;
  };
  
  console.log(`  ${formatMetric(lcp, 2500)} - LCP (Largest Contentful Paint)`);
  console.log(`  ${formatMetric(fid, 100)} - FID (First Input Delay)`);
  console.log(`  ${formatMetric(cls, 0.1)} - CLS (Cumulative Layout Shift)`);
  console.log(`  ${formatMetric(fcp, 1800)} - FCP (First Contentful Paint)`);
  console.log(`  ${formatMetric(tti, 3800)} - TTI (Time to Interactive)`);
  
  // Métricas de campo (se disponíveis)
  if (data.loadingExperience && data.loadingExperience.metrics) {
    console.log('\n🌐 MÉTRICAS DE CAMPO (RUM):');
    const metrics = data.loadingExperience.metrics;
    
    const formatFieldMetric = (metric) => {
      if (!metric || !metric.percentile) return 'N/A';
      const percentile = metric.percentile;
      const category = metric.category || 'UNKNOWN';
      const emoji = category === 'FAST' ? '✅' : category === 'AVERAGE' ? '⚠️' : '❌';
      return `${emoji} ${percentile}ms (${category})`;
    };
    
    if (metrics.LARGEST_CONTENTFUL_PAINT_MS) {
      console.log(`  LCP: ${formatFieldMetric(metrics.LARGEST_CONTENTFUL_PAINT_MS)}`);
    }
    if (metrics.FIRST_INPUT_DELAY_MS) {
      console.log(`  FID: ${formatFieldMetric(metrics.FIRST_INPUT_DELAY_MS)}`);
    }
    if (metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE) {
      console.log(`  CLS: ${formatFieldMetric(metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE)}`);
    }
    if (metrics.FIRST_CONTENTFUL_PAINT_MS) {
      console.log(`  FCP: ${formatFieldMetric(metrics.FIRST_CONTENTFUL_PAINT_MS)}`);
    }
  } else if (data.loadingExperience) {
    console.log('\n🌐 MÉTRICAS DE CAMPO (RUM):');
    console.log('  ⚠️  Métricas de campo não disponíveis (dados insuficientes)');
  }
  
  // Principais oportunidades
  const opportunities = Object.entries(audits)
    .filter(([_, audit]) => audit.details?.type === 'opportunity' && audit.numericValue)
    .sort(([_, a], [__, b]) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, 5);
  
  if (opportunities.length > 0) {
    console.log('\n💡 PRINCIPAIS OPORTUNIDADES:');
    opportunities.forEach(([key, audit]) => {
      const savings = audit.numericValue >= 1000 
        ? `${(audit.numericValue / 1000).toFixed(2)}s`
        : `${Math.round(audit.numericValue)}ms`;
      console.log(`  ⚠️  ${audit.title}: Economia potencial de ${savings}`);
    });
  }
  
  // Principais problemas
  const diagnostics = Object.entries(audits)
    .filter(([_, audit]) => audit.score !== null && audit.score < 0.9 && audit.details?.type === 'table')
    .slice(0, 3);
  
  if (diagnostics.length > 0) {
    console.log('\n🔧 PRINCIPAIS PROBLEMAS:');
    diagnostics.forEach(([key, audit]) => {
      const score = Math.round((audit.score || 0) * 100);
      console.log(`  ❌ ${audit.title}: Score ${score}/100`);
    });
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n📄 Relatório completo disponível em:');
  console.log(`   https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`);
  console.log('\n💾 Para salvar JSON completo, use:');
  console.log(`   curl "${apiUrl.toString()}" > psi-report.json`);
  
} catch (error) {
  console.error('❌ Erro ao executar análise:', error.message);
  if (error.code === 'ENOTFOUND') {
    console.log('\n💡 Verifique sua conexão com a internet');
  }
  process.exit(1);
}

