# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medical aesthetic website for Dr. Robério Brandão's "Face Moderna®" practice. Built with Astro 5.0, React 19, and Tailwind CSS for a premium editorial design.

## Development Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Build static site to ./dist
npm run preview  # Preview production build locally

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
│   ├── islands/     # React components (MobileMenu, FAQAccordion, GlossaryEditorial, TimelineInteractive)
│   ├── layout/      # Header, Footer
│   ├── seo/         # SEO, SchemaMarkup, SchemaArticle, SchemaFAQ, SchemaPerson
│   └── ui/          # Button, EditorialHero, Breadcrumb, PremiumHero
├── layouts/         # BaseLayout (wraps all pages)
├── lib/
│   ├── content/     # Centralized i18n content (home.ts, techniques.ts)
│   └── i18n.ts      # i18n utilities, translations, path mapping
├── pages/
│   ├── blog/        # EN blog posts (default locale, no prefix)
│   ├── pt/          # Portuguese pages (prefixed /pt/...)
│   │   └── blog/    # PT blog index
│   ├── es/          # Spanish pages (prefixed /es/...)
│   │   └── blog/    # ES blog index
│   ├── techniques/  # EN technique pages (default)
│   └── ...          # Other EN pages
└── styles/          # Global CSS

```

### TypeScript Path Aliases

```typescript
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@lib/*        → src/lib/*

```

## Key Conventions

### Design System

The project uses an editorial luxury palette defined in `tailwind.config.mjs`:

- **Primary**: Deep petrol scale (`primary-50` to `primary-950`)
- **Accent**: Gold/bronze scale (`accent-50` to `accent-950`)
- **Neutral**: `ivory`, `warmGray`, `softGray`
- **Typography**: Playfair Display (headings), Inter (body)

#### Typography Scale (Design System Classes)

**ALWAYS use these standardized classes instead of raw Tailwind utilities:**

**Headings:**

- `.heading-1` / `.heading-1-white` - H1 (36px mobile, 48px desktop)
- `.heading-2` / `.heading-2-white` - H2 (30px mobile, 36px desktop)
- `.heading-3` / `.heading-3-white` - H3 (20px mobile, 24px desktop)
- `.heading-4` - H4 (18px mobile, 20px desktop)

**Body Text:**

- `.body-large` / `.body-large-light` - 18px, relaxed line-height
- `.body-base` / `.body-base-light` - 16px, relaxed line-height
- `.body-small` - 14px, relaxed line-height

**Labels:**

- `.label-eyebrow` / `.label-eyebrow-white` - 10px, uppercase, tracking 0.2em
- `.label-caption` - 12px, secondary text

**Section Spacing:**

- `.section-xs` - 32px vertical padding
- `.section-sm` - 48px vertical padding
- `.section-md` - 64px vertical padding
- `.section-lg` - 80px vertical padding
- `.section-xl` - 128px vertical padding (heroes)

**Containers:**

- `.prose-narrow` - max-width ~768px (long-form text)
- `.prose-base` - max-width ~896px (editorial content)
- `.prose-wide` - max-width ~1024px (content with images)

**See `DESIGN_SYSTEM.md` for complete documentation.**

### SEO-First Approach

- All pages must use `BaseLayout` which includes the `SEO` component
- Pass `title`, `description`, and optional `schema` (JSON-LD) to BaseLayout
- OpenGraph and Twitter meta tags auto-generated from props

### Static Output

Site generates as static HTML (`output: 'static'`). No server-side rendering at runtime.

## Editorial Content Patterns

### Typography Plugin (CRÍTICO)

O projeto usa `@tailwindcss/typography`. Verificar se está em `tailwind.config.mjs`:

```js
plugins: [require('@tailwindcss/typography')],
typography: {
  DEFAULT: {
    css: {
      color: '#4a4a48',
      maxWidth: 'none',
      h2: { fontFamily: 'Playfair Display, serif', fontWeight: '400', color: '#1e293b' },
      h3: { fontFamily: 'Playfair Display, serif', fontWeight: '400', color: '#1e293b' },
      strong: { color: '#1e293b' },
      a: { color: '#9d7f5c', '&:hover': { color: '#82694d' } }, // accent-700/800 for WCAG contrast
      blockquote: { borderLeftColor: '#9d7f5c', fontStyle: 'italic' },
      'ul > li::marker': { color: '#9d7f5c' },
      'ol > li::marker': { color: '#9d7f5c' },
    },
  },
},

```

### Prose Blocks

```astro
<div class="prose prose-lg max-w-none text-warmGray">
  <p class="drop-cap">Primeiro parágrafo com capitular...</p>
  <p>Parágrafos seguintes...</p>
  <h2 class="font-serif text-primary-900">Subtítulo</h2>
</div>

```

### Drop Cap

Definido em `src/styles/global.css`:

```css
.drop-cap::first-letter {
  float: left;
  font-family: "Playfair Display", serif;
  font-size: 4.5rem;
  line-height: 0.8;
  margin-right: 0.5rem;
  color: theme("colors.accent.700"); /* #9d7f5c - WCAG compliant */
}

```

### Blockquotes Editoriais

```astro
<blockquote class="border-l-4 border-accent-700 pl-6 my-12 not-prose">
  <p class="text-xl font-serif italic text-primary-900">"Citação"</p>
  <p class="text-sm text-warmGray mt-4">— Autor</p>
</blockquote>

```

### Listas com Títulos

```astro
<ul class="space-y-4">
  <li>
    <strong class="text-primary-900">Título do item:</strong>
    Descrição do conteúdo.
  </li>
</ul>

```

## Strict Rules

### NUNCA

- `font-bold` em headings serif (Playfair é elegante sem bold)
- Hex direto em classes (usar tokens: `text-primary-900`, `bg-accent-700`)
- `text-accent-600` em fundos claros (usar `accent-700` para WCAG contrast)
- `text-softGray` para texto importante (usar `warmGray` para melhor contraste)
- `.prose` sem typography plugin configurado
- Espaçamento inconsistente (usar múltiplos de 4: mb-4, mb-8, mb-12, mb-16)

### SEMPRE

- Testar responsividade mobile-first
- `transition-colors duration-300` em elementos interativos
- Semantic HTML: `<article>`, `<section>`, `<nav>`, `<header>`
- Drop-cap apenas no primeiro parágrafo de artigos
- Verificar que `.prose` está gerando estilos antes de usar

## Icons (Regra Universal)

### NUNCA usar emojis no código

Use **Material Symbols** (glass icons) para todos os ícones:

```astro
<!-- ✅ CORRETO: Material Symbols -->
<span class="material-symbols-outlined text-accent-600">check_circle</span>
<span class="material-symbols-outlined text-primary-900">info</span>
<span class="material-symbols-outlined text-xl">arrow_forward</span>

<!-- ❌ ERRADO: Emojis -->
<span>✅</span>
<span>ℹ️</span>
<span>→</span>
```

### Classes de tamanho para icons

| Tamanho | Classe | Uso |
|---------|--------|-----|
| Small | `text-base` (16px) | Inline com texto |
| Medium | `text-xl` (20px) | Botões, cards |
| Large | `text-2xl` (24px) | Headers, destaque |
| XL | `text-4xl` (36px) | Hero sections |

### Icons comuns do projeto

| Contexto | Icon Name |
|----------|-----------|
| Sucesso | `check_circle` |
| Info | `info` |
| Alerta | `warning` |
| Erro | `error` |
| Seta direita | `arrow_forward` |
| Seta esquerda | `arrow_back` |
| Menu | `menu` |
| Fechar | `close` |
| Expandir | `expand_more` |
| Citação | `format_quote` |
| Busca | `search` |
| Busca vazia | `search_off` |

### Estilização padrão

```astro
<!-- Icon com cor do design system -->
<span class="material-symbols-outlined text-accent-600">icon_name</span>

<!-- Icon com transição hover -->
<span class="material-symbols-outlined text-primary-900 hover:text-accent-600 transition-colors">icon_name</span>

<!-- Icon vertical align com texto -->
<span class="inline-flex items-center gap-2">
  <span class="material-symbols-outlined text-base">check_circle</span>
  Texto ao lado
</span>
```

## Internationalization (i18n)

### Locale System

Three locales configured in `astro.config.mjs`:

- `en` (default, no URL prefix)
- `pt` (prefixed: `/pt/...`) - **Note:** Internally uses `'pt'`, but HTML/SEO uses `'pt-BR'`
- `es` (prefixed: `/es/...`)

Type definition in `src/lib/i18n.ts`:

```typescript
export type Locale = 'en' | 'pt' | 'es';

```

**Important:** While the internal locale is `'pt'`, the following maintain `'pt-BR'` for standards compliance:
- HTML `lang` attribute: `lang="pt-BR"`
- SEO `hreflang`: `hreflang="pt-BR"`
- HTTP headers: `Content-Language: pt-BR`
- Date formatting: `toLocaleDateString('pt-BR', ...)`
- RSS language tag: `<language>pt-BR</language>`

### URL Structure Pattern

```text
en (default):     /techniques/endomidface
pt:               /pt/tecnicas/endomidface
es:               /es/tecnicas/endomidface

```

**CRITICAL**: Slugs are TRANSLATED, not kept in original language:

- EN: `/modern-face/what-is-it`
- PT: `/pt/face-moderna/o-que-e`
- ES: `/es/face-moderna/que-es`

### Content Centralization Pattern

All translatable content lives in `src/lib/content/*.ts` using `Record<Locale, T>`:

```typescript
// src/lib/content/home.ts
export const homeContent: Record<Locale, HomeContent> = {
  'en': { hero: { title: 'Master It in 30 Cases...' }, ... },
  'pt': { hero: { title: 'Domine em 30 Casos...' }, ... },
  'es': { hero: { title: 'Domínalo en 30 Casos...' }, ... }
};

```

### Page Structure (i18n-enabled)

```astro
---
import { homeContent, getHomeSchema, getHomePaths } from '@lib/content/home';

const locale = 'en'; // or 'pt' or 'es'
const content = homeContent[locale];
const schema = getHomeSchema(locale);
const paths = getHomePaths(locale);
---

<BaseLayout title={content.hero.title} lang="en">
  <h1>{content.hero.title}</h1>
  <a href={paths.training}>{content.cta.button}</a>
</BaseLayout>

```

### i18n Utilities (`src/lib/i18n.ts`)

```typescript
// Get locale from URL
getLocaleFromUrl(url: URL): Locale

// Generate localized paths
localizedPath('/about', 'pt') → '/pt/sobre'
localizedPath('/about', 'en') → '/about'

// Translate known paths (slug translation)
translatePath('/modern-face', 'pt') → '/pt/face-moderna'

// Get hreflang alternates for SEO
getAlternateUrls('/techniques', siteUrl) → [
  { locale: 'en', url: '...', hreflang: 'en' },
  { locale: 'pt', url: '...', hreflang: 'pt-BR' }, // Note: locale is 'pt', but hreflang is 'pt-BR'
  { locale: 'es', url: '...', hreflang: 'es' }
]

```

### Translation Files Structure

```text
src/lib/
├── i18n.ts              # Core i18n utilities + UI translations
├── content/
│   ├── home.ts          # Homepage content per locale
│   └── techniques.ts    # Techniques page content per locale

```

### Creating New i18n Page

1. Create content file in `src/lib/content/[page].ts`
2. Export `Record<Locale, PageContent>` with all translations
3. Export helper functions: `getPageSchema(locale)`, `getPagePaths(locale)`
4. Create page files: `/pages/[page].astro` (EN default), `/pages/pt/[page].astro`, `/pages/es/[page].astro`
5. Import content and select by locale in each page

## SEO & Schema Markup

### SEO Component Props

All pages use `BaseLayout` which accepts:

```astro
<BaseLayout
  title="Page Title | Face Moderna"
  description="Meta description (150-160 chars)"
  keywords={['keyword1', 'keyword2']}
  schema={jsonLdSchema}
  lang="en"
>

```

### Schema.org Types Used

| Schema Type | Use Case |
|------------|----------|
| `Person` | Dr. Robério Brandão pages |
| `MedicalWebPage` | Medical/technique pages |
| `FAQPage` | Pages with FAQ sections |
| `ItemList` | Technique listings |
| `Article` | Blog posts |
| `BreadcrumbList` | Navigation breadcrumbs |

### Blog Post SEO Pattern

```astro
---
// EN (default locale - no prefix)
const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: 'Article Title', url: '/blog/article-slug' }
];

// PT (prefixed /pt/)
const breadcrumbsPT = [
  { name: 'Início', url: '/pt' },
  { name: 'Blog', url: '/pt/blog' },
  { name: 'Título do Artigo', url: '/pt/blog/slug-do-artigo' }
];

const keywords = [
  'primary keyword',
  'secondary keyword',
  'Dr Robério Brandão'
];

const faqItems = [
  { question: "Question 1?", answer: "Complete answer..." },
  { question: "Question 2?", answer: "Complete answer..." }
];
---

<BaseLayout
  title="Article Title | Dr. Robério Brandão"
  description="Compelling meta description..."
  keywords={keywords}
  lang="en"
>
  <Breadcrumb items={breadcrumbs} />
  <SchemaArticle title="..." />
  <SchemaFAQ items={faqItems} />
  <!-- Content -->
</BaseLayout>

```

### Schema Components

```astro
<!-- Article schema -->
<SchemaArticle title="..." author="Dr. Robério Brandão" />

<!-- FAQ schema (auto-generates from items) -->
<SchemaFAQ items={faqItems} />

<!-- Person schema -->
<SchemaPerson />

<!-- Generic schema -->
<SchemaMarkup schema={customSchema} />

```

### Localized Schema Pattern

```typescript
export function getPageSchema(locale: Locale) {
  const descriptions: Record<Locale, string> = {
    'en': 'Description in English...',
    'pt': 'Descrição em português...',
    'es': 'Descripción en español...'
  };

  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "description": descriptions[locale],
    "inLanguage": locale
  };
}

```

### hreflang Implementation

Automatic via `src/lib/i18n.ts`:

```typescript
const alternates = getAlternateUrls(Astro.url.pathname, 'https://drroberiobrandao.com');
// Returns array for all 3 locales with proper hreflang values

```

### SEO Checklist for New Pages

- [ ] Unique `title` (50-60 chars)
- [ ] Unique `description` (150-160 chars)
- [ ] Relevant `keywords` array
- [ ] Appropriate schema type
- [ ] Breadcrumbs for navigation
- [ ] hreflang alternates (if multi-language)
- [ ] OpenGraph image (auto from BaseLayout)

## Image Assets

### SVG Placeholders

Professional placeholders in brand colors for development:

```text
public/images/
├── casos/                    # Surgical case placeholders
│   ├── before-after-placeholder-[1-6].svg
│   ├── case-endomidface-placeholder.svg
│   ├── case-deep-neck-placeholder.svg
│   ├── case-browlift-placeholder.svg
│   └── case-face-completa-placeholder.svg
├── testimonials/             # Alumni avatar placeholders
│   └── alumni-avatar-[1-10].svg
└── techniques/               # Technique placeholders
    └── [technique]-placeholder.svg

```

### SVG Placeholder Style

Brand colors: `#1e293b` (primary-900), `#9d7f5c` (accent-700), `#fafaf8` (ivory)

- Medical/clinical aesthetic
- Abstract face silhouettes
- Before/after split designs
- Consistent 400×500 or 300×300 dimensions

## Accessibility (WCAG Compliance)

### Color Contrast Requirements

Use these color combinations for WCAG 2.1 AA compliance (4.5:1 ratio):

| Context | Text Color | Background | Ratio |
|---------|-----------|------------|-------|
| Light bg | `text-accent-700` | ivory/white | ≈4.5:1 ✅ |
| Light bg | `text-warmGray` | ivory/white | ≈4.8:1 ✅ |
| Dark bg | `text-primary-200` | primary-900 | ≈6.5:1 ✅ |
| Dark bg | `text-accent-400` | primary-900 | ≈5.2:1 ✅ |

### Avoid These Combinations

- `text-accent-600` on light backgrounds (≈2.8:1 ❌)
- `text-softGray` on light backgrounds (≈2.9:1 ❌)
- `text-primary-400` on dark backgrounds (≈3.5:1 ❌)
