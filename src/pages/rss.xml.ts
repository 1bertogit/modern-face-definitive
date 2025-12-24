/**
 * Dynamic RSS Feed - Modern Face Institute
 * Generates RSS from Content Collections blog posts (PT-BR)
 */
import type { APIRoute } from 'astro';
import { getArticlesForLocale } from '@lib/blog-utils';

const siteUrl = 'https://drroberiobrandao.com';
const siteName = 'Modern Face Institute';
const siteDescription =
  'Artigos técnicos sobre cirurgia facial, técnicas da Face Moderna, Endomidface, anatomia aplicada e educação médica continuada por Dr. Robério Brandão.';

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  // Get all PT-BR articles sorted by date (newest first)
  const articles = await getArticlesForLocale('pt');

  const buildDate = new Date().toUTCString();

  // Build RSS XML content
  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${siteUrl}</link>
    <language>pt-BR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/images/logo.png</url>
      <title>${escapeXml(siteName)}</title>
      <link>${siteUrl}</link>
    </image>
    <managingEditor>contato@drroberiobrandao.com (Dr. Robério Brandão)</managingEditor>
    <webMaster>contato@drroberiobrandao.com</webMaster>
    <copyright>© ${new Date().getFullYear()} Modern Face Institute. Todos os direitos reservados.</copyright>
    <category>Educação Médica</category>
    <category>Cirurgia Plástica</category>
    <category>Cirurgia Facial</category>
    <ttl>60</ttl>
${articles
  .map(
    (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${article.slug}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <dc:creator>Dr. Robério Brandão</dc:creator>
      <category>${escapeXml(article.category)}</category>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

  return new Response(rssContent, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
