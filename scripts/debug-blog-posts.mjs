import fs from 'fs';
import path from 'path';

const blogDir = 'src/content/blog/pt';
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

console.log(`Checking ${files.length} files in ${blogDir}...`);

let validCount = 0;
let invalidCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    console.error(`[ERROR] ${file}: No frontmatter found`);
    invalidCount++;
    return;
  }

  const frontmatter = frontmatterMatch[1];
  const lines = frontmatter.split('\n');
  const data = {};

  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Basic cleanup of quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'" ) && value.endsWith("'" ))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });

  const issues = [];

  // Check required fields based on schema
  if (!data.title) issues.push('Missing title');
  if (data.title && data.title.length > 150) issues.push(`Title too long (${data.title.length} > 150)`);
  
  if (!data.description) issues.push('Missing description');
  if (data.description && data.description.length > 300) issues.push(`Description too long (${data.description.length} > 300)`);
  
  if (!data.category) issues.push('Missing category');
  
  if (!data.date) issues.push('Missing date');
  // Simple date check
  if (data.date && isNaN(Date.parse(data.date))) issues.push(`Invalid date: ${data.date}`);

  // Locale check
  // Note: Schema default is 'pt', but if it's explicit it must be 'pt'
  if (data.locale && data.locale !== 'pt') {
     // Check if it's just a quoting issue not handled by my simple parser
     if (data.locale !== '"pt"' && data.locale !== "'pt'") {
         // It might be okay if my parser stripped quotes, but let's see
     }
  }

  // Draft check
  if (data.draft === 'true') {
      issues.push('Draft is true');
  }

  if (issues.length > 0) {
    console.log(`[ISSUE] ${file}: ${issues.join(', ')}`);
    invalidCount++;
  } else {
    validCount++;
  }
});

console.log(`\nSummary: ${validCount} seemingly valid, ${invalidCount} with potential issues.`);
