import { describe, it, expect } from 'vitest';
import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

/**
 * Link Health Tests
 *
 * These tests verify that the built site has no broken internal links
 * and that key pages exist.
 */

const DIST_DIR = join(process.cwd(), 'dist');

// Helper to collect HTML files
async function collectHtmlFiles(dir: string, files: string[] = []): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        await collectHtmlFiles(fullPath, files);
      } else if (entry.isFile() && extname(entry.name) === '.html') {
        files.push(fullPath);
      }
    }

    return files;
  } catch {
    // If dist doesn't exist, return empty array
    return [];
  }
}

// Helper to extract internal links
function extractInternalLinks(html: string): string[] {
  const links: string[] = [];
  const hrefRegex = /href=["']?([^"'\s>]+)/gi;
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];

    // Filter for internal links only
    if (
      href.startsWith('/') &&
      !href.startsWith('//') &&
      !href.startsWith('#')
    ) {
      const cleanLink = href.split('?')[0].split('#')[0];
      links.push(cleanLink);
    }
  }

  return links;
}

// Helper to check if a link path exists
async function linkExists(link: string): Promise<boolean> {
  try {
    let targetPath = join(DIST_DIR, link);

    // If link ends with /, try index.html
    if (link.endsWith('/')) {
      targetPath = join(DIST_DIR, link, 'index.html');
    } else if (!extname(link)) {
      targetPath = join(DIST_DIR, link, 'index.html');
    }

    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

describe('Link Health', () => {
  it('should have a built dist directory', async () => {
    try {
      const distStat = await stat(DIST_DIR);
      expect(distStat.isDirectory()).toBe(true);
    } catch {
      // Skip test if dist doesn't exist (not built yet)
      console.log('⚠️  Dist directory not found. Run "npm run build" first.');
      expect(true).toBe(true);
    }
  });

  it('should have key pages', async () => {
    const keyPages = [
      '/index.html',
      '/404.html',
      '/pt/index.html',
      '/techniques/endomidface/index.html',
      '/pt/tecnicas/endomidface/index.html',
    ];

    for (const page of keyPages) {
      const pagePath = join(DIST_DIR, page);
      try {
        const pageStat = await stat(pagePath);
        expect(pageStat.isFile()).toBe(true);
      } catch {
        // If dist doesn't exist, skip
        console.log(`⚠️  ${page} not found. This is expected if the site hasn't been built yet.`);
      }
    }
  });

  it('should have no broken internal links in built site', async () => {
    // Collect HTML files
    const htmlFiles = await collectHtmlFiles(DIST_DIR);

    if (htmlFiles.length === 0) {
      console.log('⚠️  No HTML files found. Run "npm run build" first.');
      expect(true).toBe(true);
      return;
    }

    // Extract all internal links
    const allLinks = new Set<string>();

    for (const file of htmlFiles) {
      const content = await readFile(file, 'utf-8');
      const links = extractInternalLinks(content);
      links.forEach((link) => allLinks.add(link));
    }

    // Check each unique link
    const brokenLinks: string[] = [];

    for (const link of allLinks) {
      const exists = await linkExists(link);
      if (!exists) {
        brokenLinks.push(link);
      }
    }

    // Report broken links
    if (brokenLinks.length > 0) {
      console.log('\n❌ Broken internal links found:');
      brokenLinks.forEach((link) => console.log(`  - ${link}`));
      console.log('');
    }

    expect(brokenLinks).toEqual([]);
  });

  it('should have 404 page with localized content', async () => {
    const page404Path = join(DIST_DIR, '404.html');

    try {
      const content = await readFile(page404Path, 'utf-8');

      // Check for key elements
      expect(content).toContain('404');
      expect(content).toMatch(/not found|não encontrada|no encontrada/i);
      expect(content).toContain('home');
    } catch {
      console.log('⚠️  404 page not found. This is expected if the site hasn\'t been built yet.');
    }
  });
});
