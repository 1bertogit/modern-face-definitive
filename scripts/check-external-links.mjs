#!/usr/bin/env node

/**
 * External Link Validator for Astro Static Build
 *
 * Validates external links in the generated static site
 * to detect broken or unreachable external resources.
 *
 * Usage:
 *   node scripts/check-external-links.mjs
 *   node scripts/check-external-links.mjs --timeout 5000
 *   node scripts/check-external-links.mjs --sample 10
 */

import { readdir, readFile } from 'fs/promises';
import { join, extname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(__dirname, '../dist');

// Parse CLI arguments
const args = process.argv.slice(2);
const TIMEOUT = parseInt(args.find((arg) => arg.startsWith('--timeout='))?.split('=')[1]) || 5000;
const SAMPLE_SIZE = parseInt(args.find((arg) => arg.startsWith('--sample='))?.split('=')[1]) || 0;

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
 * Extract all external links from HTML content
 */
function extractExternalLinks(html) {
  const links = new Set();

  // Match href attributes in anchor tags
  const hrefRegex = /href=["']?([^"'\s>]+)/gi;
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];

    // Filter for external HTTP(S) links only
    if (/^https?:\/\//.test(href)) {
      // Clean URL (remove fragments)
      const cleanUrl = href.split('#')[0];
      links.add(cleanUrl);
    }
  }

  return Array.from(links);
}

/**
 * Check if an external link is reachable
 */
async function checkExternalLink(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    return {
      url,
      status: response.status,
      ok: response.ok,
    };
  } catch (error) {
    return {
      url,
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

/**
 * Main validation function
 */
async function validateExternalLinks() {
  console.log(`${colors.cyan}⚡ Checking external links in ${colors.dim}./dist${colors.reset}`);
  console.log(`${colors.dim}Timeout: ${TIMEOUT}ms${colors.reset}\n`);

  // Collect all HTML files
  const htmlFiles = await collectHtmlFiles(DIST_DIR);
  console.log(`${colors.green}✓${colors.reset} Found ${htmlFiles.length} HTML files`);

  // Extract all external links
  const allLinks = new Set();

  for (const file of htmlFiles) {
    const content = await readFile(file, 'utf-8');
    const links = extractExternalLinks(content);
    links.forEach((link) => allLinks.add(link));
  }

  let linksToCheck = Array.from(allLinks);

  // Apply sampling if requested
  if (SAMPLE_SIZE > 0 && linksToCheck.length > SAMPLE_SIZE) {
    console.log(
      `${colors.yellow}⚠️  Sampling ${SAMPLE_SIZE} links out of ${linksToCheck.length}${colors.reset}\n`
    );
    linksToCheck = linksToCheck.slice(0, SAMPLE_SIZE);
  }

  console.log(`${colors.green}✓${colors.reset} Found ${allLinks.size} unique external links`);
  console.log(`${colors.cyan}⏳ Checking ${linksToCheck.length} links...${colors.reset}\n`);

  // Check each unique link
  const results = [];
  let checked = 0;

  for (const link of linksToCheck) {
    const result = await checkExternalLink(link);
    results.push(result);
    checked++;

    if (checked % 10 === 0 || checked === linksToCheck.length) {
      process.stdout.write(`\r${colors.dim}Progress: ${checked}/${linksToCheck.length}${colors.reset}`);
    }
  }

  console.log('\n');

  // Categorize results
  const broken = results.filter((r) => !r.ok);
  const working = results.filter((r) => r.ok);

  // Report results
  if (broken.length === 0) {
    console.log(`${colors.green}✓ All checked external links are reachable!${colors.reset}\n`);
    return 0;
  } else {
    console.log(`${colors.yellow}⚠️  Found ${broken.length} unreachable external link${broken.length > 1 ? 's' : ''}:${colors.reset}\n`);

    for (const { url, status, error } of broken) {
      console.log(`${colors.red}  ✗ ${url}${colors.reset}`);
      if (error) {
        console.log(`${colors.dim}    Error: ${error}${colors.reset}`);
      } else {
        console.log(`${colors.dim}    Status: ${status}${colors.reset}`);
      }
      console.log();
    }

    console.log(`${colors.yellow}Summary: ${working.length} working, ${broken.length} broken${colors.reset}\n`);
    console.log(`${colors.dim}Note: Some links may be blocked by CORS or rate limiting${colors.reset}\n`);
    return 1;
  }
}

// Run validation
try {
  const exitCode = await validateExternalLinks();
  process.exit(exitCode);
} catch (error) {
  console.error(`${colors.red}Error during link validation:${colors.reset}`, error);
  process.exit(1);
}
