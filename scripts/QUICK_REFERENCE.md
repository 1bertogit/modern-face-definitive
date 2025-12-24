# Link Validator - Quick Reference

## Commands

```bash
# Development (ignore translations)

npm run check-links:pt

# Production (validate everything)

npm run check-links:strict

# Build + validate

npm run build:check

# Direct execution

node scripts/check-internal-links.mjs [--ignore-translations]

```

## Flags

| Flag | Description |
|------|-------------|
| `--ignore-translations` | Skip `/en/*` and `/es/*` links |
| `-i` | Alias for `--ignore-translations` |

## Exit Codes

- `0` = All links valid ✅
- `1` = Broken links found ❌

## What Gets Validated

✅ **Validated**

- `/blog/article/` - Internal absolute paths
- `/about` - Directory-style links
- `../page` - Relative links (converted to absolute)

❌ **Ignored**

- `https://external.com` - External links
- `mailto:email@example.com` - Email links
- `tel:+123` - Phone links
- `#section` - Anchor-only links

## Output Example

```text
⚡ Checking internal links in ./dist
⚠️  Ignoring translation links (/en/, /es/)

✓ Found 338 HTML files
✓ Extracted 11234 internal links (291 unique)

✗ Found 2 broken links:

  ✗ /rss.xml
    Referenced in:

      - index.html
      - blog/index.html
      ... and 325 more files

  ✗ /404/
    Referenced in:

      - 404.html

Build failed: 2 broken internal links found

```

## Common Fixes

| Error | Fix |
|-------|-----|
| `/rss.xml` not found | Create RSS feed or remove references |
| `/404/` not found | Change to `/404.html` |
| `/en/page/` not found | Create translation or use `--ignore-translations` |
| `{siteUrl}/path` | Ensure template variables resolve correctly |

## CI/CD Integration

```yaml
# .github/workflows/deploy.yml

- name: Build
  run: npm run build

- name: Validate Links
  run: npm run check-links:pt

```

## Typical Workflow

```bash
# 1. Make changes

vim src/pages/blog/new-post.astro

# 2. Build

npm run build

# 3. Check links (PT only)

npm run check-links:pt

# 4. Fix any issues
# ... edit files ...

# 5. Rebuild

npm run build

# 6. Recheck

npm run check-links:pt

# 7. Deploy when clean

npm run build:check && deploy.sh

```

## Performance

- **Speed**: 2-3 seconds for 338 HTML files
- **Memory**: ~50MB
- **Scales**: Linearly with file count

## Files

```text
scripts/
├── check-internal-links.mjs  ← Main script
├── README.md                 ← Full documentation
├── ARCHITECTURE.md           ← System design
└── QUICK_REFERENCE.md        ← This file

```

## Need Help?

1. Check `scripts/README.md` for detailed docs
2. Check `LINK_VALIDATION_SUMMARY.md` for current issues
3. Run with `-i` flag to skip translations during dev
4. Check exit code: `echo $?` after running

## Pro Tips

💡 Use `--ignore-translations` during development
💡 Run `check-links:strict` before production deploy
💡 Integrate into CI/CD for automatic validation
💡 Fix broken links in batches by category
💡 Check `dist/` manually if validation seems wrong
