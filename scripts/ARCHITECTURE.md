# Link Validation Script - Architecture

## System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Build Process                                │
│                                                                  │
│  npm run build → astro build → ./dist/ (338 HTML files)        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              check-internal-links.mjs                            │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 1. File Collection                                     │    │
│  │    • Recursively scan ./dist                           │    │
│  │    • Find all .html files                              │    │
│  │    • Result: 338 files                                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 2. Link Extraction                                     │    │
│  │    • Parse HTML content                                │    │
│  │    • Regex: /href=["']([^"']+)["']/gi                 │    │
│  │    • Filter internal links only                        │    │
│  │    • Result: 11,234 links → 291 unique                │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 3. Link Filtering (Optional)                           │    │
│  │    • If --ignore-translations:                         │    │
│  │      Skip links starting with /en/ or /es/             │    │
│  │    • Result: 291 unique links to validate              │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 4. Link Validation                                     │    │
│  │    • For each unique link:                             │    │
│  │      - Try: ./dist{link}                               │    │
│  │      - Try: ./dist{link}/index.html                    │    │
│  │      - Try: ./dist{link}.html                          │    │
│  │    • Mark as broken if none exist                      │    │
│  │    • Result: 128 broken links found                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                             │                                    │
│                             ▼                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ 5. Report Generation                                   │    │
│  │    • Group by broken link                              │    │
│  │    • Show source files (max 5)                         │    │
│  │    • Colored terminal output                           │    │
│  │    • Exit code: 0 (pass) or 1 (fail)                  │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

```

## Data Flow

```text
HTML Files (338)
    │
    ├─ Read Content
    │
    ├─ Extract Links (regex)
    │
    ├─ Filter Internal Links
    │      │
    │      ├─ Exclude: http://, https://, mailto:, tel:
    │      ├─ Exclude: #anchors
    │      └─ Include: /absolute, relative paths
    │
    ├─ Normalize Links
    │      │
    │      ├─ Remove query strings: ?param=value
    │      ├─ Remove anchors: #section
    │      └─ Add trailing slash if needed
    │
    ├─ [Optional] Filter Translations
    │      │
    │      └─ Skip /en/* and /es/* if --ignore-translations
    │
    ├─ Deduplicate
    │      │
    │      └─ 11,234 links → 291 unique
    │
    ├─ Validate Each Link
    │      │
    │      ├─ File exists at path?
    │      ├─ Directory with index.html?
    │      └─ .html extension variant?
    │
    └─ Report Results
           │
           ├─ Success: Exit 0
           └─ Failure: Exit 1, Print broken links

```

## Link Classification

```text
┌─────────────────────────────────────────────────────────────┐
│                    Link Types                                │
└─────────────────────────────────────────────────────────────┘

External (Ignored)
├─ http://example.com
├─ https://example.com
├─ mailto:email@example.com
├─ tel:+1234567890
└─ ftp://files.example.com

Anchor-only (Ignored)
├─ #section
├─ #top
└─ #footer

Internal (Validated) ✓
├─ /blog/article/           → ./dist/blog/article/index.html
├─ /about                   → ./dist/about/index.html
├─ /sitemap.xml             → ./dist/sitemap.xml
└─ ../relative/path         → Resolved then validated

Translation (Conditionally Validated)
├─ /en/about/               → Validated unless --ignore-translations
├─ /es/tecnicas/            → Validated unless --ignore-translations
└─ /pt/* (N/A)           → No prefix, always validated

```

## Validation Strategy

```text
For link: /blog/article/

Try 1: ./dist/blog/article/
       ├─ Is file? → Valid ✓
       └─ Not file → Continue

Try 2: ./dist/blog/article/index.html
       ├─ Is file? → Valid ✓
       └─ Not file → Continue

Try 3: ./dist/blog/article.html
       ├─ Is file? → Valid ✓
       └─ Not file → Continue

Try 4: ./dist/blog/article (no slash)
       ├─ Is file? → Valid ✓
       └─ Not file → Mark as BROKEN ✗

Result: /blog/article/ is BROKEN

```

## Exit Codes

```text
0  →  All links valid
      ├─ Can proceed with deployment
      └─ CI/CD pipeline continues

1  →  Broken links found OR script error
      ├─ Build should fail
      ├─ Fix links before deployment
      └─ CI/CD pipeline halts

```

## Performance Characteristics

```text
Input:     338 HTML files
Process:   ~11,234 total links
Validate:  291 unique links
Time:      ~2-3 seconds
Memory:    ~50MB peak
CPU:       Single-threaded, I/O bound

```

## Integration Points

```text
┌──────────────┐
│  Developer   │
└──────┬───────┘
       │
       ├─ npm run dev
       ├─ npm run build
       ├─ npm run check-links:pt
       └─ npm run build:check
              │
              ▼
┌──────────────────────────────┐
│    check-internal-links.mjs   │
└──────────────┬───────────────┘
               │
               ├─ Exit 0 → Continue
               └─ Exit 1 → Halt
                      │
                      ▼
            ┌─────────────────┐
            │  Fix Broken Links │
            └─────────────────┘

```

## Error Reporting Format

```text
✗ Found 3 broken links:

  ✗ /blog/missing-article/
    Referenced in:

      - index.html
      - blog/index.html
      - en/blog/index.html

  ✗ /about/team/
    Referenced in:

      - about/index.html
      ... and 12 more files

```

## Configuration

```javascript
// Hardcoded constants
DIST_DIR = './dist'                    // Build output directory
MAX_SOURCES_DISPLAY = 5                // Max sources shown per link
IGNORE_TRANSLATIONS = CLI flag         // --ignore-translations or -i

// Configurable via CLI
--ignore-translations  →  Skip /en/* and /es/* links
-i                     →  Alias for --ignore-translations

```

## Future Extensions

Potential enhancements (not implemented):

- [ ] External link validation (with timeout)
- [ ] Anchor target validation (#section exists?)
- [ ] Link health scoring (200 OK, 404, etc.)
- [ ] JSON output format for CI/CD
- [ ] Parallel validation for large sites
- [ ] Cache validation results
- [ ] Custom ignore patterns
- [ ] Link statistics (most referenced, etc.)
- [ ] Auto-fix suggestions
- [ ] Integration with sitemap.xml
