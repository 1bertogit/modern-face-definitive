#!/usr/bin/env node

/**
 * Internal Link Validator for Astro Static Build
 *
 * Validates all internal links in the generated static site
 * to ensure no broken links exist before deployment.
 *
 * Usage:
 *   node scripts/check-internal-links.mjs
 *   node scripts/check-internal-links.mjs --ignore-translations
 *   npm run build:check
 *   npm run check-links
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, resolve, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(__dirname, '../dist');

// Parse CLI arguments
const args = process.argv.slice(2);
const IGNORE_TRANSLATIONS = args.includes('--ignore-translations') || args.includes('-i');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

/**
 * Recursively collect all HTML files from a directory
 */
async function collectHtmlFiles(dir, files = []) {
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
}

/**
 * Extract all internal links from HTML content
 */
function extractInternalLinks(html) {
  const links = [];

  // Match href attributes in anchor tags
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];

    // Filter for internal links only
    if (isInternalLink(href)) {
      links.push(normalizeLink(href));
    }
  }

  return links;
}

/**
 * Determine if a link is internal
 */
function isInternalLink(href) {
  // Exclude external protocols
  if (/^(https?|mailto|tel|ftp):/.test(href)) {
    return false;
  }

  // Exclude anchor-only links
  if (href.startsWith('#')) {
    return false;
  }

  // Include absolute internal links and relative links
  return href.startsWith('/') || !href.includes('://');
}

/**
 * Normalize link to consistent format
 */
function normalizeLink(href) {
  // Remove query strings and anchors
  let normalized = href.split('?')[0].split('#')[0];

  // Ensure trailing slash for directory-style links
  if (!extname(normalized) && !normalized.endsWith('/')) {
    normalized += '/';
  }

  return normalized;
}

/**
 * Check if a link is a translation link (starts with /en/ or /es/)
 */
function isTranslationLink(link) {
  return link.startsWith('/en/') || link.startsWith('/es/');
}

/**
 * Check if a link path exists in the dist directory
 */
async function linkExists(link) {
  try {
    // Try exact path
    let targetPath = join(DIST_DIR, link);

    // Special case: RSS feed and XML files
    if (link === '/rss.xml' || link.endsWith('.xml')) {
      // Try as directory with index.html (Astro format: directory)
      const dirPath = join(DIST_DIR, link, 'index.html');
      try {
        const stats = await stat(dirPath);
        if (stats.isFile()) return true;
      } catch {
        // Try as direct file
        const filePath = join(DIST_DIR, link);
        const stats = await stat(filePath);
        return stats.isFile();
      }
    }

    // If link ends with /, try index.html
    if (link.endsWith('/')) {
      targetPath = join(DIST_DIR, link, 'index.html');
    } else if (!extname(link)) {
      // Try as directory with index.html
      targetPath = join(DIST_DIR, link, 'index.html');
    }

    const stats = await stat(targetPath);
    return stats.isFile();
  } catch {
    // If original fails, try alternative formats
    try {
      // Try without trailing slash
      if (link.endsWith('/') && link !== '/') {
        const withoutSlash = link.slice(0, -1);
        const altPath = join(DIST_DIR, withoutSlash);
        const stats = await stat(altPath);
        return stats.isFile();
      }

      // Try with .html extension
      if (!extname(link)) {
        const htmlPath = join(DIST_DIR, `${link}.html`);
        const stats = await stat(htmlPath);
        return stats.isFile();
      }
    } catch {
      return false;
    }

    return false;
  }
}

/**
 * Main validation function
 */
async function validateInternalLinks() {
  console.log(`${colors.cyan}⚡ Checking internal links in ${colors.dim}./dist${colors.reset}`);
  
  if (IGNORE_TRANSLATIONS) {
    console.log(`${colors.yellow}⚠️  Ignoring translation links (/en/, /es/)${colors.reset}\n`);
  } else {
    console.log();
  }

  // Collect all HTML files
  const htmlFiles = await collectHtmlFiles(DIST_DIR);
  console.log(`${colors.green}✓${colors.reset} Found ${htmlFiles.length} HTML files`);

  // Extract all internal links with their source files
  const linkMap = new Map(); // link -> Set of source files
  let totalLinks = 0;

  for (const file of htmlFiles) {
    const content = await readFile(file, 'utf-8');
    const links = extractInternalLinks(content);
    const relativePath = relative(DIST_DIR, file);

    for (const link of links) {
      // Skip translation links if flag is set
      if (IGNORE_TRANSLATIONS && isTranslationLink(link)) {
        continue;
      }

      if (!linkMap.has(link)) {
        linkMap.set(link, new Set());
      }
      linkMap.get(link).add(relativePath);
      totalLinks++;
    }
  }

  console.log(`${colors.green}✓${colors.reset} Extracted ${totalLinks} internal links (${linkMap.size} unique)\n`);

  // Validate each unique link
  const brokenLinks = [];

  for (const [link, sources] of linkMap.entries()) {
    const exists = await linkExists(link);

    if (!exists) {
      brokenLinks.push({
        link,
        sources: Array.from(sources),
      });
    }
  }

  // Report results
  if (brokenLinks.length === 0) {
    console.log(`${colors.green}✓ All internal links are valid!${colors.reset}\n`);
    return 0;
  } else {
    console.log(`${colors.red}✗ Found ${brokenLinks.length} broken link${brokenLinks.length > 1 ? 's' : ''}:${colors.reset}\n`);

    for (const { link, sources } of brokenLinks) {
      console.log(`${colors.red}  ✗ ${link}${colors.reset}`);
      console.log(`${colors.dim}    Referenced in:${colors.reset}`);

      // Show first 5 sources, indicate if more exist
      const displaySources = sources.slice(0, 5);
      for (const source of displaySources) {
        console.log(`${colors.dim}      - ${source}${colors.reset}`);
      }

      if (sources.length > 5) {
        console.log(`${colors.dim}      ... and ${sources.length - 5} more file${sources.length - 5 > 1 ? 's' : ''}${colors.reset}`);
      }

      console.log();
    }

    console.log(`${colors.red}Build failed: ${brokenLinks.length} broken internal link${brokenLinks.length > 1 ? 's' : ''} found${colors.reset}\n`);
    return 1;
  }
}

// Run validation
try {
  const exitCode = await validateInternalLinks();
  process.exit(exitCode);
} catch (error) {
  console.error(`${colors.red}Error during link validation:${colors.reset}`, error);
  process.exit(1);
}
