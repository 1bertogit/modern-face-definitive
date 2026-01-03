/**
 * sitemap-index.xml - Main sitemap index
 * References all individual sitemaps
 * This file OVERRIDES the auto-generated sitemap-index.xml from @astrojs/sitemap plugin
 */
import type { APIRoute } from 'astro';

const siteUrl = 'https://drroberiobrandao.com';
const lastmod = new Date().toISOString().split('T')[0];

// List of available sitemaps
const sitemaps = [
  { loc: '/sitemap-pages.xml', name: 'Main Pages' },
  { loc: '/sitemap-blog.xml', name: 'Blog and Articles' },
  { loc: '/sitemap-techniques.xml', name: 'Surgical Techniques' },
  { loc: '/sitemap-education.xml', name: 'Training Programs' },
  { loc: '/sitemap-pt.xml', name: 'Portuguese Pages' },
  { loc: '/sitemap-es.xml', name: 'Spanish Pages' },
];

export const GET: APIRoute = async () => {
  // Generate XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((sitemap) => `  <sitemap>
    <loc>${siteUrl}${sitemap.loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

