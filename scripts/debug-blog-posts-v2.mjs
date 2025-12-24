import fs from 'fs';
import path from 'path';

// Try to import js-yaml
let yaml;
try {
  yaml = await import('js-yaml');
} catch (e) {
  console.log('js-yaml not found, falling back to simple parsing (less accurate)');
}

const blogDir = 'src/content/blog/pt';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

console.log(`Checking ${files.length} files in ${blogDir}...`);

let validCount = 0;
let invalidCount = 0;
let skippedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    console.error(`[ERROR] ${file}: No frontmatter found`);
    invalidCount++;
    continue;
  }

  let data = {};
  if (yaml) {
    try {
      data = yaml.load(frontmatterMatch[1]);
    } catch (e) {
      console.error(`[YAML ERROR] ${file}: ${e.message}`);
      invalidCount++;
      continue;
    }
  } else {
    // Fallback parser (same as before)
    const lines = frontmatterMatch[1].split('\n');
    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'" ) && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        data[key] = value;
        }
    });
  }

  const issues = [];

  // 1. Check Locale
  if (data.locale !== 'pt') {
    issues.push(`Invalid locale: '${data.locale}' (expected 'pt')`);
  }

  // 2. Check Draft
  if (data.draft === true) {
      // It's not an invalid file, but it will be filtered out.
      // The user says "missing posts", so drafts explain missing posts.
      // But my previous grep said 0 drafts.
      console.log(`[INFO] ${file} is a draft.`);
      skippedCount++;
      continue; 
  }

  // 3. Check Date
  if (!data.date) {
      issues.push('Missing date');
  } else {
      const d = new Date(data.date);
      if (isNaN(d.getTime())) {
          issues.push(`Invalid date: ${data.date}`);
      }
  }

  // 4. Check Title/Description limits (strict)
  if (data.title && data.title.length > 150) issues.push(`Title > 150 chars (${data.title.length})`);
  if (data.description && data.description.length > 300) issues.push(`Description > 300 chars (${data.description.length})`);

  if (issues.length > 0) {
    console.log(`[ISSUE] ${file}: ${issues.join(', ')}`);
    invalidCount++;
  } else {
    validCount++;
  }
}

console.log(`
Summary: ${validCount} valid/active, ${skippedCount} drafts, ${invalidCount} invalid.`);
