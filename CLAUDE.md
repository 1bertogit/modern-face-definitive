# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medical aesthetic website for Dr. Robério Brandão's "Face Moderna®" practice. Built with Astro 5.0, React 19, and Tailwind CSS with an Editorial Luxury · Medical Authority design system.

## Development Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build static site to ./dist
npm run preview      # Preview production build locally

# Quality checks
npm run quality      # Run all checks (typecheck + lint + format + tests)
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint (--max-warnings 0)
npm run lint:fix     # ESLint with auto-fix
npm run format:check # Prettier check
npm run format       # Prettier auto-format

# Testing
npm run test         # Vitest in watch mode
npm run test:run     # Vitest single run
npm run test:coverage # Vitest with coverage

# Build with link validation
npm run build:check           # Build + validate internal links (PT only)
npm run check-links:pt        # Validate existing build (PT only, recommended)
npm run check-links:strict    # Validate all locales (EN/PT/ES)
npm run check-links:external  # Check 50 sample external links (optional)
npm run check-links:external-all # Check all external links (slow, optional)
```

## Architecture

### Island Architecture Pattern

- **Astro components** (`.astro`) for static content and layouts
- **React islands** (`src/components/islands/*.tsx`) for interactive elements requiring client-side JavaScript
- React islands use `client:load` or `client:visible` directives in Astro templates

### Directory Structure

```text
src/
├── components/
│   ├── islands/     # React components (MobileMenu, FAQAccordion, GlossaryEditorial, BlogSearch, etc.)
│   ├── layout/      # Header, Footer
│   ├── seo/         # SEO, SchemaMarkup, SchemaArticle, SchemaFAQ, SchemaPerson
│   └── ui/          # Button, EditorialHero, Breadcrumb, PremiumHero
├── layouts/         # BaseLayout (wraps all pages)
├── lib/
│   ├── content/     # Centralized i18n content (home.ts, techniques.ts, cases.ts, etc.)
│   └── i18n/        # Modular i18n system (types, locales, paths, navigation, components)
├── pages/
│   ├── blog/        # EN blog posts (default locale, no prefix)
│   ├── pt/          # Portuguese pages (prefixed /pt/...)
│   ├── es/          # Spanish pages (prefixed /es/...)
│   └── ...          # Other EN pages (techniques/, etc.)
└── styles/          # Global CSS with Design System
```

### TypeScript Path Aliases

```typescript
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@lib/*        → src/lib/*
```

## Design System: Editorial Luxury · Medical Authority

Defined in `tailwind.config.mjs` and `src/styles/global.css`.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-900` | `#0A192F` | Navy - Primary brand color (headings, dark backgrounds) |
| `accent-500` | `#C5A059` | Gold - Primary accent (CTAs, highlights, links) |
| `accent-600` | `#9d8047` | Darker gold for hover states |
| `neutral-white` | `#FFFFFF` | Dominant background |
| `neutral-graphite` | `#2A2A2A` | Body text, technical lines |
| `neutral-greySoft` | `#F5F5F5` | Soft backgrounds |

**Legacy aliases:** `ivory` → white, `warmGray` → graphite, `softGray` → greySoft

### Typography Scale (Fixed)

**Use these classes instead of raw Tailwind utilities:**

| Class | Size | Usage |
|-------|------|-------|
| `.heading-1` / `.heading-1-white` | 64px | Page titles |
| `.heading-2` / `.heading-2-white` | 48px | Section headings |
| `.heading-3` / `.heading-3-white` | 32px | Subsections |
| `.heading-4` | 24px | Card titles |
| `.body-large` / `.body-base` | 18px | Body text |
| `.body-small` | 14px | Captions |
| `.label-eyebrow` / `.label-eyebrow-white` | 10px | Category labels (uppercase, tracking) |

**Fonts:** Playfair Display (headings), Inter (body)

### Section Spacing (Fixed Scale)

| Class | Padding |
|-------|---------|
| `.section-xs` | 8px |
| `.section-sm` | 16px |
| `.section-md` | 32px |
| `.section-lg` | 64px |
| `.section-xl` | 128px (heroes) |

### Container Widths

| Class | Max Width | Usage |
|-------|-----------|-------|
| `.prose-narrow` | ~768px | Long-form text |
| `.prose-base` | ~896px | Editorial content |
| `.prose-wide` | ~1024px | Content with images |

## Key Conventions

### SEO-First Approach

- All pages must use `BaseLayout` with `title`, `description`, and optional `schema` (JSON-LD)
- OpenGraph and Twitter meta tags auto-generated
- Static output (`output: 'static'`) - no SSR at runtime

### Editorial Content Patterns

```astro
<!-- Prose blocks -->
<div class="prose prose-lg max-w-none">
  <p class="drop-cap">First paragraph with drop cap...</p>
</div>

<!-- Editorial blockquote -->
<blockquote class="border-l-4 border-accent-500 pl-6 my-12 not-prose">
  <p class="text-xl font-serif italic text-primary-900">"Quote"</p>
</blockquote>
```

## Strict Rules

### NEVER

- `font-bold` on serif headings (Playfair is elegant without bold)
- Hex values in classes (use tokens: `text-primary-900`, `bg-accent-500`)
- Emojis in code (use Material Symbols icons)
- `.prose` without typography plugin configured
- Inconsistent spacing (use multiples of 8: mb-2, mb-4, mb-8, mb-16)

### ALWAYS

- Test mobile-first responsiveness
- `transition-colors duration-300` on interactive elements
- Semantic HTML: `<article>`, `<section>`, `<nav>`, `<header>`
- Drop-cap only on first paragraph of articles

## Icons (Material Symbols)

**NEVER use emojis** - use Material Symbols:

```astro
<span class="material-symbols-outlined text-accent-500">check_circle</span>
```

Common icons: `check_circle`, `info`, `warning`, `error`, `arrow_forward`, `arrow_back`, `menu`, `close`, `expand_more`, `format_quote`, `search`, `search_off`

Size classes: `text-base` (16px), `text-xl` (20px), `text-2xl` (24px), `text-4xl` (36px)

## Internationalization (i18n)

### Locale System

- `en` (default, no URL prefix)
- `pt` (prefixed: `/pt/...`) - HTML/SEO uses `pt-BR`
- `es` (prefixed: `/es/...`)

```typescript
export type Locale = 'en' | 'pt' | 'es';
```

### URL Structure

**CRITICAL:** Slugs are TRANSLATED:
- EN: `/techniques/endomidface`
- PT: `/pt/tecnicas/endomidface`
- ES: `/es/tecnicas/endomidface`

### i18n Module Structure (`src/lib/i18n/`)

```typescript
// Main exports from src/lib/i18n/index.ts
import {
  getLocaleFromUrl,    // Extract locale from URL
  localizedPath,       // Generate localized path
  translatePath,       // Translate known path slugs
  getAlternateUrls,    // Get hreflang alternates
  navTranslations,     // Navigation translations
  footerTranslations   // Footer translations
} from '@lib/i18n';
```

### Content Files Pattern

All translatable content in `src/lib/content/*.ts`:

```typescript
export const pageContent: Record<Locale, PageContent> = {
  'en': { ... },
  'pt': { ... },
  'es': { ... }
};
```

### Creating New i18n Page

1. Create content in `src/lib/content/[page].ts` with `Record<Locale, T>`
2. Export helpers: `getPageSchema(locale)`, `getPagePaths(locale)`
3. Create pages: `/pages/[page].astro` (EN), `/pages/pt/[page].astro`, `/pages/es/[page].astro`
4. Import content and select by locale

## SEO & Schema Markup

### Schema.org Types

| Type | Use Case |
|------|----------|
| `Person` | Dr. Robério Brandão pages |
| `MedicalWebPage` | Medical/technique pages |
| `FAQPage` | Pages with FAQ sections |
| `Article` | Blog posts |
| `BreadcrumbList` | Navigation |

### Blog Post Pattern

```astro
<BaseLayout title="..." description="..." lang="en">
  <Breadcrumb items={breadcrumbs} />
  <SchemaArticle title="..." author="Dr. Robério Brandão" />
  <SchemaFAQ items={faqItems} />
</BaseLayout>
```

## Testing

Tests use Vitest with React Testing Library. Test files are co-located with components (`.test.tsx`).

```bash
npm run test:run              # Run all tests
npm run test:coverage         # Run with coverage report
npx vitest run src/path/file  # Run specific test file
```

## Accessibility (WCAG 2.1 AA)

### Safe Color Combinations

| Context | Text | Background | Ratio |
|---------|------|------------|-------|
| Light bg | `text-primary-900` | white | ≈16:1 ✅ |
| Light bg | `text-neutral-graphite` | white | ≈12:1 ✅ |
| Light bg | `text-accent-600` | white | ≈4.5:1 ✅ |
| Dark bg | `text-neutral-white` | primary-900 | ≈16:1 ✅ |
| Dark bg | `text-accent-400` | primary-900 | ≈5:1 ✅ |

### Reduced Motion Support

CSS includes `@media (prefers-reduced-motion: reduce)` support.
