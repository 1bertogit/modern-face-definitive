/**
 * Fix MDX Files Script
 * Cleans up broken JSX/HTML from migrated MDX files
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(currentDir, '..');
const blogDir = join(projectRoot, 'src/content/blog');

const folders = ['pt', 'en', 'es'];

function fixMdxContent(content) {
  let fixed = content;

  // Remove JSX comments
  fixed = fixed.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Remove ALL HTML anchor tags (broken or complete) - they're causing too many issues
  // Pattern: <a or < a at start of line or with spaces
  fixed = fixed.replace(/<a\s+href="[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
  fixed = fixed.replace(/<a[\s\n]+href="[^"]*"[\s\S]*?>/gi, '');
  fixed = fixed.replace(/<a\s*\n/gi, '');
  fixed = fixed.replace(/<\/a[\s\S]*?>/gi, '');
  fixed = fixed.replace(/<\/a/gi, '');

  // Remove broken strong/em/b/i tags
  fixed = fixed.replace(/<\/?strong[\s\n>]/gi, '');
  fixed = fixed.replace(/<\/?em[\s\n>]/gi, '');
  fixed = fixed.replace(/<\/?b[\s\n>]/gi, '');
  fixed = fixed.replace(/<\/?i[\s\n>]/gi, '');

  // Remove any remaining HTML tags
  fixed = fixed.replace(/<[a-z][^>]*>/gi, '');
  fixed = fixed.replace(/<\/[a-z]+>/gi, '');

  // Remove orphaned href attributes
  fixed = fixed.replace(/href="[^"]*"[^>]*>/gi, '');
  fixed = fixed.replace(/href="[^"]*"/gi, '');

  // Remove broken markdown link patterns
  fixed = fixed.replace(/^\s*\[\s*$/gm, '');  // Lines with just [
  fixed = fixed.replace(/^\s*\]\([^\)]*\)\s*$/gm, '');  // Lines with just ](url)
  fixed = fixed.replace(/^\s*\]\s*$/gm, '');  // Lines with just ]
  fixed = fixed.replace(/^\([^\)]*\)\s*$/gm, '');  // Lines with just (url)

  // Clean up multiple blank lines
  fixed = fixed.replace(/\n{4,}/g, '\n\n\n');

  // Clean up lines that are just whitespace
  fixed = fixed.replace(/^\s+$/gm, '');

  return fixed;
}

function processMdxFiles() {
  let totalFixed = 0;

  for (const folder of folders) {
    const folderPath = join(blogDir, folder);

    try {
      const files = readdirSync(folderPath).filter(f => f.endsWith('.mdx'));

      for (const file of files) {
        const filePath = join(folderPath, file);
        const content = readFileSync(filePath, 'utf-8');
        const fixed = fixMdxContent(content);

        if (fixed !== content) {
          writeFileSync(filePath, fixed);
          console.log('Fixed: ' + folder + '/' + file);
          totalFixed++;
        }
      }
    } catch (error) {
      console.error('Error processing ' + folder + ': ' + error.message);
    }
  }

  console.log('\nTotal fixed: ' + totalFixed + ' files');
}

processMdxFiles();
