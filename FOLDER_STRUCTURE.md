# FOLDER_STRUCTURE.md

Documentacao Completa da Estrutura de Pastas do Projeto Face Moderna

**Projeto:** Site medico estetico para Dr. Roberio Brandao
**Stack:** Astro 5.0 + React 19 + Tailwind CSS + TypeScript
**Arquitetura:** Island Architecture (SSG)
**Idiomas:** EN (default), PT-BR, ES

---

## Indice

1. [Visao Geral da Arquitetura](#visao-geral-da-arquitetura)
2. [Raiz do Projeto](#raiz-do-projeto)
3. [src/ - Codigo-Fonte](#src---codigo-fonte)
4. [public/ - Assets Estaticos](#public---assets-estaticos)
5. [scripts/ - Automacao](#scripts---automacao)
6. [.claude/ - Configuracoes Claude Code](#claude---configuracoes-claude-code)
7. [Arquivos de Configuracao](#arquivos-de-configuracao)
8. [Diagrama Visual](#diagrama-visual)

---

## Visao Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                      ASTRO 5.0 (SSG)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │   Layouts   │  │      Components         │  │
│  │  (Routes)   │──│ (BaseLayout)│──│  ┌─────┐ ┌──────────┐   │  │
│  │  .astro     │  │   .astro    │  │  │ UI  │ │ Islands  │   │  │
│  └─────────────┘  └─────────────┘  │  │.astro│ │  .tsx    │   │  │
│         │                          │  └─────┘ └──────────┘   │  │
│         ▼                          └─────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               Content Collections (MDX)                  │    │
│  │   blog/en  │  blog/pt  │  blog/es  │  cases  │ glossary │    │
│  └─────────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐   │
│  │   lib/i18n      │  │   lib/content   │  │  lib/utils     │   │
│  │ (Traducoes)     │  │ (Conteudo)      │  │ (Helpers)      │   │
│  └─────────────────┘  └─────────────────┘  └────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                        BUILD OUTPUT                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    dist/ (Static HTML)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Raiz do Projeto

```
/
├── .astro/              # Cache Astro (auto-gerado)
├── .claude/             # Configuracoes Claude Code
├── .cursor/             # Configuracoes Cursor IDE
├── .playwright-mcp/     # Configuracoes Playwright MCP
├── .qodo/               # Configuracoes Qodo AI
├── dist/                # Build output (gitignored)
├── node_modules/        # Dependencias NPM (gitignored)
├── public/              # Assets estaticos
├── scripts/             # Scripts de automacao
├── src/                 # Codigo-fonte principal
└── [arquivos config]    # Configuracoes na raiz
```

### Arquivos na Raiz

| Arquivo | Proposito | Quando Editar |
|---------|-----------|---------------|
| `astro.config.mjs` | Config Astro (i18n, integracao, redirects) | Adicionar integracao, rota, redirect |
| `tailwind.config.mjs` | Design system (cores, tipografia) | Alterar paleta, fontes, tokens |
| `tsconfig.json` | TypeScript + path aliases | Adicionar alias, alterar strict mode |
| `package.json` | Dependencias e scripts | Instalar pacote, criar script |
| `package-lock.json` | Lock de versoes | NUNCA editar manualmente |
| `netlify.toml` | Deploy Netlify | Alterar headers, redirects, build |
| `vercel.json` | Deploy Vercel | Alterar headers, redirects, build |
| `vitest.config.ts` | Configuracao testes | Adicionar setup, alterar coverage |
| `eslint.config.js` | Regras de linting | Adicionar/desativar regras |
| `.eslintrc.json` | Config ESLint legado | Migrar para eslint.config.js |
| `.prettierrc.json` | Formatacao codigo | Alterar tabs, quotes, etc |
| `.prettierignore` | Ignorar formatacao | Adicionar paths para ignorar |
| `.markdownlint.json` | Regras Markdown | Alterar regras MD |
| `.gitignore` | Arquivos ignorados Git | Adicionar patterns |
| `.nvmrc` | Versao Node.js | Atualizar versao Node |
| `.env.example` | Template variaveis ambiente | Documentar novas vars |
| `CLAUDE.md` | Instrucoes Claude Code | Documentar padroes do projeto |
| `CONTRIBUTING.md` | Guia contribuicao | Atualizar processo PR |
| `README.md` | Documentacao principal | Atualizar docs |
| `SECURITY.md` | Politica seguranca | Atualizar contatos |
| `postcss.config.cjs` | Config PostCSS | Adicionar plugins |

### Scripts NPM Disponiveis

```bash
# === DESENVOLVIMENTO ===
npm run dev              # Servidor dev localhost:3000
npm run start            # Alias para dev
npm run preview          # Preview do build

# === BUILD ===
npm run build            # Gera site estatico em ./dist
npm run build:check      # Build + verifica links internos

# === QUALIDADE ===
npm run lint             # ESLint (sem warnings permitidos)
npm run lint:fix         # Corrige erros automaticamente
npm run format           # Prettier em src/**/*
npm run format:check     # Verifica formatacao
npm run typecheck        # Verifica tipos TypeScript
npm run quality          # Roda TODOS (typecheck + lint + format + test)

# === TESTES ===
npm run test             # Vitest em watch mode
npm run test:run         # Single run
npm run test:coverage    # Relatorio de cobertura
npm run test:gemini      # Testa integracao Gemini AI

# === LINKS E SEO ===
npm run check-links      # Verifica links internos quebrados
npm run check-links:strict # Modo strict
npm run check-links:pt   # Ignora traducoes faltantes
npm run pagespeed        # PageSpeed Insights report

# === IMAGENS ===
npm run image            # Gera uma imagem
npm run images:all       # Gera todas as imagens
npm run images:optimize  # Otimiza imagens do blog

# === MARKDOWN ===
npm run markdownlint     # Verifica markdown
npm run markdownlint:fix # Corrige markdown
```

### Problemas Comuns na Raiz

| Problema | Sintoma | Solucao |
|----------|---------|---------|
| Node incompativel | `engine "node" is incompatible` | `nvm use 20` ou instale Node 20+ |
| Dependencias quebradas | Build falha com erros modulo | `rm -rf node_modules package-lock.json && npm install` |
| Porta ocupada | `Port 3000 already in use` | `npm run dev -- --port 3001` |
| Cache corrompido | Comportamento estranho | `rm -rf .astro dist && npm run build` |
| TypeScript lento | Demora no typecheck | Reinicie o TS server na IDE |

---

## src/ - Codigo-Fonte

```
src/
├── components/          # Componentes reutilizaveis
│   ├── blog/            # Componentes do blog
│   ├── islands/         # React islands (interativos)
│   ├── layout/          # Header, Footer
│   ├── seo/             # SEO e Schema.org
│   └── ui/              # UI estatica
├── content/             # Content Collections (MDX)
│   ├── blog/            # Posts do blog
│   ├── cases/           # Casos clinicos
│   └── glossary/        # Termos glossario
├── hooks/               # React hooks customizados
├── layouts/             # Layouts de pagina
├── lib/                 # Utilitarios e helpers
│   ├── content/         # Conteudo centralizado
│   └── i18n/            # Internacionalizacao
├── pages/               # Rotas (file-based routing)
├── styles/              # CSS global
├── tests/               # Configuracao testes
└── env.d.ts             # Types ambiente Astro
```

---

### src/components/

**Descricao:** Componentes reutilizaveis organizados por responsabilidade.

**Importancia:** Promove DRY, consistencia visual, e separacao de preocupacoes.

---

#### src/components/islands/

**Descricao:** Componentes React que requerem JavaScript no cliente (hidratacao).

**Importancia:** Implementa Island Architecture - APENAS estes componentes adicionam JS ao bundle cliente.

**Arquivos:**

| Arquivo | Proposito | Hidratacao Recomendada |
|---------|-----------|------------------------|
| `MobileMenu.tsx` | Menu hamburger responsivo | `client:load` |
| `MobileMenu.test.tsx` | Testes do MobileMenu | - |
| `FAQAccordion.tsx` | Accordion expansivel FAQ | `client:visible` |
| `FAQAccordion.test.tsx` | Testes do FAQ | - |
| `BlogSearch.tsx` | Busca posts do blog | `client:load` |
| `BlogSearch.test.tsx` | Testes do BlogSearch | - |
| `GlossaryEditorial.tsx` | Glossario interativo | `client:visible` |
| `GlossaryEditorial.test.tsx` | Testes | - |
| `GlossarySearch.tsx` | Busca no glossario | `client:load` |
| `GlossarySearch.test.tsx` | Testes | - |
| `TimelineInteractive.tsx` | Timeline animada | `client:visible` |
| `TimelineInteractive.test.tsx` | Testes | - |
| `ErrorBoundary.tsx` | Captura erros React | `client:load` |
| `ErrorBoundary.test.tsx` | Testes | - |
| `glossary/` | Sub-componentes glossario | - |

**Como usar em Astro:**
```astro
---
import MobileMenu from '@components/islands/MobileMenu.tsx';
---

<!-- Hidrata imediatamente (necessario para navegacao) -->
<MobileMenu client:load />

<!-- Hidrata quando visivel (lazy loading) -->
<FAQAccordion client:visible items={faqItems} />
```

**Problemas Comuns:**

| Problema | Causa | Solucao |
|----------|-------|---------|
| Componente nao interativo | Faltou diretiva `client:*` | Adicione `client:load` ou `client:visible` |
| Hydration mismatch | Server/client divergem | Evite `Math.random()`, `Date.now()` sem estado |
| Erro "window is not defined" | Codigo SSR acessando browser | Use `typeof window !== 'undefined'` |
| Bundle muito grande | Muitos islands | Use `client:visible` para lazy load |

---

#### src/components/ui/

**Descricao:** Componentes Astro estaticos (zero JavaScript cliente).

**Importancia:** Componentes leves renderizados em build-time.

**Arquivos:**

| Arquivo | Proposito |
|---------|-----------|
| `Button.astro` | Botao com variantes (primary, secondary, outline) |
| `Breadcrumb.astro` | Navegacao breadcrumb com schema |
| `EditorialHero.astro` | Hero section editorial luxo |
| `PremiumHero.astro` | Hero section premium |
| `Icon.astro` | Wrapper para icones SVG |
| `CategoryIcon.astro` | Icone de categoria |

**Uso:**
```astro
---
import Button from '@components/ui/Button.astro';
import Breadcrumb from '@components/ui/Breadcrumb.astro';
---

<Button href="/contact" variant="primary">Contato</Button>
<Breadcrumb items={[{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }]} />
```

---

#### src/components/seo/

**Descricao:** Componentes para SEO e dados estruturados Schema.org.

**Importancia:** CRITICO para SEO - meta tags, Open Graph, JSON-LD.

**Arquivos:**

| Arquivo | Schema Type | Uso |
|---------|-------------|-----|
| `SEO.astro` | - | Meta tags, OG, hreflang |
| `SchemaArticle.astro` | Article | Posts do blog |
| `SchemaBreadcrumb.astro` | BreadcrumbList | Navegacao |
| `SchemaCourse.astro` | Course | Cursos/treinamentos |
| `SchemaFAQ.astro` | FAQPage | Paginas com FAQ |
| `SchemaLocalBusiness.astro` | LocalBusiness | SEO local Brasil |
| `SchemaMarkup.astro` | Custom | Schema generico |
| `SchemaOrganization.astro` | Organization | Homepage |
| `SchemaPerson.astro` | Person | Dr. Roberio |
| `VerificationMeta.astro` | - | Google/Bing verification |
| `GoogleTagManagerNoScript.astro` | - | GTM noscript fallback |

**Uso tipico:**
```astro
---
import SchemaArticle from '@components/seo/SchemaArticle.astro';
import SchemaFAQ from '@components/seo/SchemaFAQ.astro';

const faqItems = [
  { question: "Pergunta 1?", answer: "Resposta 1" },
  { question: "Pergunta 2?", answer: "Resposta 2" }
];
---

<SchemaArticle
  title="Titulo do Artigo"
  author="Dr. Roberio Brandao"
  publishDate={new Date('2024-01-15')}
/>
<SchemaFAQ items={faqItems} />
```

---

#### src/components/blog/

**Descricao:** Componentes especificos para o blog.

**Arquivos:**

| Arquivo | Proposito |
|---------|-----------|
| `BlogCard.astro` | Card de preview do post |
| `BlogGrid.astro` | Grid de posts |
| `BlogPostLayout.astro` | Layout completo do post |
| `BlogSidebar.astro` | Sidebar com categorias/tags |

---

#### src/components/layout/

**Descricao:** Componentes estruturais de layout.

**Arquivos:**
- `Header.astro` - Cabecalho com navegacao
- `Footer.astro` - Rodape com links e copyright

---

### src/content/

**Descricao:** Content Collections do Astro - conteudo MDX com frontmatter tipado.

**Importancia:** Centraliza conteudo editorial com validacao TypeScript via Zod.

```
content/
├── config.ts            # Schemas das collections (Zod)
├── blog/
│   ├── en/              # 75 posts em ingles
│   ├── pt/              # 76 posts em portugues
│   └── es/              # 75 posts em espanhol
├── cases/               # Casos clinicos
│   └── *.mdx
└── glossary/            # Termos medicos
    └── *.mdx
```

**Schema Blog (config.ts):**
```typescript
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Campos obrigatorios
    title: z.string().max(150),
    description: z.string().max(300),
    category: z.string(),
    date: z.coerce.date(),

    // Campos opcionais
    author: z.string().default('Dr. Roberio Brandao'),
    readTime: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    keywords: z.array(z.string()).optional(),
    image: z.union([z.string(), z.object({ src: z.string(), alt: z.string() })]).optional(),

    // i18n
    locale: z.enum(['pt', 'en', 'es']).default('pt'),
    canonicalSlug: z.string().optional(), // Liga traducoes

    // Schema.org
    articleType: z.enum(['Article', 'MedicalWebPage', 'BlogPosting', 'NewsArticle']).default('MedicalWebPage'),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  }),
});
```

**Exemplo frontmatter MDX:**
```yaml
---
title: "Lifting Facial aos 40 Anos: Guia Completo"
description: "Entenda quando e por que considerar um lifting facial na quarta decada de vida"
category: "Cirurgia Facial"
date: 2024-12-20
author: "Dr. Roberio Brandao"
readTime: "8 min"
locale: pt
canonicalSlug: "face-lift-at-40"
keywords:
  - lifting facial
  - rejuvenescimento
  - cirurgia plastica
image: "/images/blog/pt/lifting-40-anos.webp"
---

# Conteudo do artigo aqui...
```

**Problemas Comuns:**

| Problema | Sintoma | Solucao |
|----------|---------|---------|
| Schema invalido | `ZodError: Required field missing` | Verifique frontmatter contra config.ts |
| Data invalida | `Invalid date` | Use formato `YYYY-MM-DD` |
| Imagem nao encontrada | 404 na imagem | Confirme path em `public/images/` |
| Slug duplicado | Build warning | Renomeie arquivo ou use `canonicalSlug` |

---

### src/layouts/

**Descricao:** Layouts que envolvem todas as paginas.

**Arquivo Principal:** `BaseLayout.astro`

**Responsabilidades:**
- HTML base (`<!doctype html>`, `<html>`, `<head>`, `<body>`)
- Componente `<SEO />` com meta tags
- Fonts (Playfair Display, Inter, Material Symbols)
- Analytics (GTM, Vercel Speed Insights, Web Vitals)
- Schema Organization/LocalBusiness na homepage
- Skip link para acessibilidade
- Header e Footer
- Deteccao automatica de locale

**Props aceitas:**
```typescript
interface Props {
  title: string;                    // Titulo da pagina
  description: string;              // Meta description
  image?: string;                   // OG image (default: /images/og-default.webp)
  noIndex?: boolean;                // Bloquear indexacao
  schema?: object;                  // JSON-LD custom
  lang?: Locale;                    // en | pt | es
  keywords?: string[];              // Meta keywords
  includeOrgSchema?: boolean;       // Forcar schema Organization
  customAlternates?: AlternateUrl[]; // Hreflang customizado
}
```

**Uso:**
```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout
  title="Endomidface por Visao Direta"
  description="Tecnica exclusiva desenvolvida pelo Dr. Roberio Brandao"
  lang="pt"
  keywords={['endomidface', 'lifting facial', 'cirurgia plastica']}
>
  <h1>Conteudo da pagina</h1>
</BaseLayout>
```

---

### src/lib/

**Descricao:** Utilitarios, helpers e logica compartilhada.

```
lib/
├── i18n/                # Sistema de internacionalizacao
│   ├── index.ts         # Re-exports
│   ├── types.ts         # Tipos (Locale, etc)
│   ├── locales.ts       # Constantes de locales
│   ├── paths.ts         # Traducao de URLs (~39KB)
│   ├── navigation.ts    # Menus por locale
│   └── components.ts    # Textos UI por locale
├── content/             # Conteudo centralizado
│   ├── home.ts          # Textos homepage
│   ├── home.test.ts     # Testes
│   ├── techniques.ts    # Textos pagina tecnicas
│   ├── contact.ts       # Textos contato
│   ├── cases.ts         # Textos casos
│   └── glossary.ts      # Textos glossario
├── i18n.ts              # Re-export principal
├── analytics.ts         # Tracking e eventos
├── analytics.test.ts    # Testes
├── blog-utils.ts        # Funcoes para blog
├── dateFormatter.ts     # Formatacao datas
├── env.ts               # Variaveis ambiente tipadas
├── form.ts              # Validacao formularios
├── form.test.ts         # Testes
├── icons.ts             # Definicoes de icones
├── indexnow.ts          # IndexNow API
├── siteUrl.ts           # Helper URL do site
├── urlBuilders.ts       # Construtores URL
└── urlBuilders.test.ts  # Testes
```

---

#### src/lib/i18n/

**Descricao:** Sistema completo de internacionalizacao para 3 idiomas.

**Importancia:** CRITICO - controla URLs, traducoes, navegacao.

**Arquivos detalhados:**

| Arquivo | Tamanho | Proposito |
|---------|---------|-----------|
| `index.ts` | 1KB | Re-exports de todos modulos |
| `types.ts` | ~1KB | `type Locale = 'en' \| 'pt' \| 'es'` |
| `locales.ts` | ~1KB | Constantes: `locales`, `defaultLocale`, `htmlLang` |
| `paths.ts` | ~39KB | Mapeamento completo de traducao de URLs |
| `navigation.ts` | ~16KB | Menus e links por locale |
| `components.ts` | ~8KB | Textos UI (botoes, labels, etc) |

**Padrao de URL:**
```
Ingles (default):  /techniques/endomidface
Portugues:         /pt/tecnicas/endomidface
Espanhol:          /es/tecnicas/endomidface
```

**Funcoes principais:**
```typescript
// Detectar locale da URL
getLocaleFromUrl(url: URL): Locale

// Gerar path localizado
localizedPath('/about', 'pt') // → '/pt/sobre'
localizedPath('/about', 'en') // → '/about'

// Traduzir path conhecido
translatePath('/modern-face', 'pt') // → '/pt/face-moderna'

// Gerar alternates para hreflang
getAlternateUrls('/techniques', siteUrl) // → [{ locale, url, hreflang }...]

// HTML lang attribute
htmlLang['pt'] // → 'pt-BR'
```

**IMPORTANTE:** Locale interno e `'pt'`, mas HTML/SEO usam `'pt-BR'`:
```typescript
// Interno
type Locale = 'en' | 'pt' | 'es';

// HTML
<html lang="pt-BR">

// hreflang
<link rel="alternate" hreflang="pt-BR" href="..." />
```

**Problemas Comuns:**

| Problema | Causa | Solucao |
|----------|-------|---------|
| Link 404 | Path nao traduzido em paths.ts | Adicione entrada no `pathTranslations` |
| Hreflang errado | Usando 'pt' em vez de 'pt-BR' | Use `htmlLang[locale]` ou `getAlternateUrls()` |
| Navegacao errada | Menu nao atualizado | Atualize `navigation.ts` |

---

#### src/lib/content/

**Descricao:** Conteudo estatico centralizado por locale.

**Importancia:** Separa textos traduzidos do codigo.

**Padrao:**
```typescript
// src/lib/content/home.ts
import type { Locale } from '../i18n';

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
  };
  cta: {
    button: string;
  };
}

export const homeContent: Record<Locale, HomeContent> = {
  'en': {
    hero: { title: 'Master It in 30 Cases...', subtitle: '...' },
    cta: { button: 'Start Learning' }
  },
  'pt': {
    hero: { title: 'Domine em 30 Casos...', subtitle: '...' },
    cta: { button: 'Comece a Aprender' }
  },
  'es': {
    hero: { title: 'Dominalo en 30 Casos...', subtitle: '...' },
    cta: { button: 'Empieza a Aprender' }
  }
};

// Helper para schema
export function getHomeSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": homeContent[locale].hero.title,
    "inLanguage": locale
  };
}
```

---

### src/pages/

**Descricao:** Rotas da aplicacao usando file-based routing do Astro.

**Importancia:** Cada arquivo `.astro` = uma rota publica.

**Estatisticas:**
- ~60 paginas EN (default, sem prefixo)
- ~87 paginas PT (prefixo `/pt/`)
- Paginas ES parcialmente implementadas

```
pages/
├── index.astro                    # / (homepage EN)
├── 404.astro                      # Pagina de erro
├── privacy.astro                  # /privacy
├── terms.astro                    # /terms
├── anatomy.astro                  # /anatomy
│
├── about/                         # /about/*
│   ├── index.astro                # /about
│   ├── dr-roberio-brandao.astro   # /about/dr-roberio-brandao
│   ├── case-studies.astro         # /about/case-studies
│   ├── ethical-principles.astro   # /about/ethical-principles
│   ├── future-vision.astro        # /about/future-vision
│   └── timeline.astro             # /about/timeline
│
├── applied-anatomy/               # /applied-anatomy/*
│   ├── index.astro
│   ├── cervical-region.astro
│   ├── facial-nerves.astro
│   ├── lower-third.astro
│   ├── middle-third.astro
│   ├── retaining-ligaments.astro
│   ├── surgical-spaces.astro
│   └── upper-third.astro
│
├── blog/                          # /blog/* (EN)
│   ├── index.astro                # /blog
│   └── [...slug].astro            # /blog/[slug] (dynamic)
│
├── cases/                         # /cases/*
│   ├── index.astro
│   ├── students/index.astro
│   └── surgical/index.astro
│
├── clinical-technology/           # /clinical-technology/*
│   ├── index.astro
│   ├── ai-copilot/index.astro
│   └── faceos/
│       ├── index.astro
│       ├── checklists.astro
│       ├── records.astro
│       ├── spe-m.astro
│       └── vector-planning.astro
│
├── creator/                       # /creator/*
│   ├── index.astro
│   ├── case-series-safety.astro
│   ├── faq-authorship.astro
│   └── timeline.astro
│
├── education/                     # /education/*
│   ├── index.astro
│   ├── advanced-training/index.astro
│   ├── core-programs/
│   │   ├── deep-neck-mastery.astro
│   │   └── endomidface-direct-vision.astro
│   └── satellite-courses/index.astro
│
├── faq/index.astro                # /faq
│
├── library/                       # /library/*
│   ├── index.astro
│   ├── clinical-studies/index.astro
│   ├── ebooks/index.astro
│   ├── infographics/index.astro
│   ├── practical-guides/index.astro
│   └── publications/index.astro
│
├── methods/                       # /methods/*
│   ├── index.astro
│   ├── endomidface-direct-vision.astro
│   ├── deep-neck/index.astro
│   └── endomidface/
│       └── direct-vision-vs-endoscopic.astro
│
├── modern-face/                   # /modern-face/*
│   ├── index.astro
│   ├── timeline.astro
│   └── what-is-it.astro
│
├── surgical-planning/             # (parcial)
│
├── training/                      # /training/*
│   ├── application.astro
│   ├── combo-legacy.astro
│   ├── endomidface-course.astro
│   └── endomidface-mentorship.astro
│
├── pt/                            # /pt/* (Portugues)
│   ├── index.astro                # /pt (homepage PT)
│   ├── anatomia.astro
│   ├── anatomia-aplicada.astro
│   ├── cirurgia-facial-natal.astro
│   ├── contato.astro
│   ├── formacao.astro
│   ├── glossario.astro
│   ├── privacidade.astro
│   ├── termos.astro
│   │
│   ├── blog/
│   │   ├── index.astro            # /pt/blog
│   │   └── [...slug].astro        # /pt/blog/[slug]
│   │
│   ├── casos/
│   │   ├── index.astro
│   │   ├── alunos/index.astro
│   │   └── cirurgicos/index.astro
│   │
│   ├── educacao/
│   │   ├── index.astro
│   │   ├── cursos-satelites/index.astro
│   │   ├── formacao-avancada/index.astro
│   │   └── programas-nucleo/
│   │       ├── deep-neck-mastery.astro
│   │       └── endomidface-visao-direta.astro
│   │
│   ├── face-moderna/
│   │   ├── index.astro
│   │   ├── evolucao-da-cirurgia-facial.astro
│   │   ├── filosofia.astro
│   │   ├── linha-do-tempo.astro
│   │   ├── o-que-e.astro
│   │   ├── por-que-visao-direta.astro
│   │   ├── principios.astro
│   │   └── socializacao-do-conhecimento.astro
│   │
│   ├── faq/index.astro
│   │
│   ├── sobre/
│   │   ├── index.astro
│   │   ├── casuistica.astro
│   │   ├── dr-roberio-brandao.astro
│   │   ├── linha-do-tempo.astro
│   │   ├── principios-eticos.astro
│   │   └── visao-de-futuro.astro
│   │
│   ├── tecnicas/
│   │   ├── index.astro
│   │   ├── anatomia/
│   │   │   ├── index.astro
│   │   │   ├── espacos-cirurgicos.astro
│   │   │   ├── ligamentos-retentores.astro
│   │   │   ├── nervos-faciais.astro
│   │   │   ├── regiao-cervical.astro
│   │   │   ├── terco-inferior.astro
│   │   │   ├── terco-medio.astro
│   │   │   └── terco-superior.astro
│   │   ├── browlift/index.astro
│   │   ├── deep-neck/
│   │   │   ├── index.astro
│   │   │   ├── anatomia.astro
│   │   │   ├── casos.astro
│   │   │   ├── erros-comuns.astro
│   │   │   ├── indicacoes.astro
│   │   │   ├── o-que-e.astro
│   │   │   ├── passo-a-passo.astro
│   │   │   ├── pilares.astro
│   │   │   └── resultados.astro
│   │   ├── endomidface/
│   │   │   ├── index.astro
│   │   │   ├── anatomia.astro
│   │   │   ├── erros-comuns.astro
│   │   │   ├── indicacoes.astro
│   │   │   ├── limitacoes.astro
│   │   │   ├── o-que-e.astro
│   │   │   ├── passo-a-passo.astro
│   │   │   ├── recuperacao.astro
│   │   │   ├── resultados.astro
│   │   │   └── vetores.astro
│   │   └── planejamento-cirurgico/
│   │       ├── index.astro
│   │       ├── avaliacao-inicial.astro
│   │       ├── checklist.astro
│   │       ├── consentimento.astro
│   │       ├── fotografia.astro
│   │       ├── sistema-spe-m.astro
│   │       └── vetores.astro
│   │
│   └── tecnologia-clinica/
│       ├── index.astro
│       ├── ai-copilot/index.astro
│       └── faceos/
│           ├── index.astro
│           ├── checklists.astro
│           ├── planejamento-vetores.astro
│           ├── prontuario.astro
│           └── spe-m.astro
│
├── sitemap-blog.xml.astro         # Sitemap dinamico blog
├── sitemap-education.xml.astro    # Sitemap educacao
├── sitemap-es.xml.astro           # Sitemap espanhol
└── sitemap-techniques.xml.astro   # Sitemap tecnicas
```

**Problemas Comuns:**

| Problema | Causa | Solucao |
|----------|-------|---------|
| 404 em pagina | Arquivo nao existe | Verifique nome e estrutura |
| Locale misturado | Import errado de content | Use `const locale = 'pt'` consistente |
| Build falha | Frontmatter MDX invalido | Verifique erro detalhado |
| Rota dinamica vazia | `getStaticPaths` incorreto | Retorne array com todos params |

---

### src/styles/

**Descricao:** CSS global e utilitarios.

**Arquivo:** `global.css`

**Conteudo:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Drop Cap - Primeira letra grande em artigos */
.drop-cap::first-letter {
  float: left;
  font-family: "Playfair Display", serif;
  font-size: 4.5rem;
  line-height: 0.8;
  margin-right: 0.5rem;
  color: theme("colors.accent.700"); /* #9d7f5c */
}

/* Animacoes, transicoes, etc */
```

---

### src/hooks/

**Descricao:** React hooks customizados.

**Uso:** Encapsular logica stateful em componentes islands.

---

### src/tests/

**Descricao:** Configuracao e setup de testes Vitest.

---

## public/ - Assets Estaticos

**Descricao:** Arquivos servidos diretamente (nao processados pelo build).

**Importancia:** Imagens, favicons, robots.txt acessiveis via URL raiz.

```
public/
├── favicon.svg                    # Favicon do site
├── robots.txt                     # Instrucoes crawlers
├── llms.txt                       # Contexto para LLMs
├── _headers                       # Headers HTTP (Netlify)
├── drroberiobrandao2024indexnow.txt # Chave IndexNow
├── image-dr-roberio-brandao.webp  # Imagem principal Dr.
│
└── images/                        # ~384 arquivos de imagem
    ├── og-default.svg             # OG image default (SVG)
    ├── og-default.webp            # OG image default (WebP)
    ├── logo-face-moderna.svg      # Logo do instituto
    ├── hero-placeholder.svg       # Placeholder hero
    │
    ├── blog/                      # Imagens do blog
    │   ├── en/                    # Imagens posts EN
    │   ├── pt/                    # Imagens posts PT
    │   └── es/                    # Imagens posts ES
    │
    ├── casos/                     # Imagens casos clinicos
    │   ├── before-after/          # Fotos antes/depois
    │   ├── students/              # Resultados alunos
    │   ├── techniques/            # Por tecnica
    │   ├── before-after-placeholder-[1-6].svg
    │   ├── case-browlift-placeholder.svg
    │   ├── case-deep-neck-placeholder.svg
    │   ├── case-endomidface-placeholder.svg
    │   ├── case-face-completa-placeholder.svg
    │   └── student-result-placeholder-[1-4].svg
    │
    ├── hero/                      # Imagens hero sections
    │
    ├── icons/                     # ~22 icones SVG
    │
    ├── techniques/                # Imagens tecnicas
    │
    └── testimonials/              # Depoimentos
        └── avatars/               # Avatares alunos
```

**Padrao de nomes SVG placeholder:**
- `before-after-placeholder-[n].svg` - Before/after generico
- `case-[tecnica]-placeholder.svg` - Caso por tecnica
- `student-result-placeholder-[n].svg` - Resultado aluno
- `alumni-avatar-[n].svg` - Avatar de ex-aluno

**Cores dos placeholders:**
- `#1e293b` - primary-900 (Deep Petrol)
- `#9d7f5c` - accent-700 (Bronze)
- `#fafaf8` - ivory (Background)

**Problemas Comuns:**

| Problema | Causa | Solucao |
|----------|-------|---------|
| Imagem 404 | Path incorreto | Use `/images/...` (com barra inicial) |
| Case-sensitivity | macOS vs Linux | Use exatamente o nome do arquivo |
| Imagem muito grande | Nao otimizada | `npm run images:optimize` ou converta WebP |
| SVG nao renderiza | XML invalido | Valide o SVG |

---

## scripts/ - Automacao

**Descricao:** Scripts utilitarios para manutencao, auditoria e automacao.

```
scripts/
├── README.md                      # Documentacao completa
├── ARCHITECTURE.md                # Arquitetura do projeto
├── COMO-USAR.md                   # Guia rapido PT
├── QUICK_REFERENCE.md             # Referencia rapida
├── GEMINI_USAGE.md                # Uso API Gemini
├── GEMINI_REUSABLE_GUIDE.md       # Guia reutilizavel
├── DIAGNOSTICO-BLOG.md            # Diagnostico blog
├── uso-rapido.md                  # Uso rapido
│
├── check-internal-links.mjs       # Verifica links quebrados
├── check-i18n-errors.sh           # Verifica erros i18n
├── check-blog-validation.mjs      # Valida posts blog
├── blog-audit.mjs                 # Auditoria completa blog
├── seo-quick-check.mjs            # Check rapido SEO
├── pagespeed-insights.mjs         # Metricas PageSpeed
│
├── migrate-blog.mjs               # Migra posts
├── migrate-pt-BR-to-pt.mjs        # Migra pt-BR para pt
├── fix-canonical-slugs.mjs        # Corrige slugs canonicos
├── fix-mdx-comparisons.mjs        # Corrige comparacoes MDX
├── fix-mdx.mjs                    # Correcoes gerais MDX
├── replace-emojis.mjs             # Remove emojis
├── replace-svg-placeholders.mjs   # Substitui placeholders
│
├── add-blog-images.mjs            # Adiciona imagens blog
├── optimize-blog-images.mjs       # Otimiza imagens
├── generate-blog-helper.mjs       # Helpers geracao
├── generate-hero-images.mjs       # Gera imagens hero
├── generate-og-image.mjs          # Gera OG images
│
├── debug-astro-collection.mjs     # Debug collections
├── debug-blog-articles.mjs        # Debug artigos
├── debug-blog-posts.mjs           # Debug posts
├── debug-blog-posts-v2.mjs        # Debug posts v2
├── test-astro-collection.mjs      # Testa collections
│
├── gemini-helper.mjs              # Helper Gemini AI
├── exemplo-uso-gemini.mjs         # Exemplo Gemini
├── test-gemini.mjs                # Testa Gemini
├── test-gemini-direct.mjs         # Teste direto
├── list-gemini-models.mjs         # Lista modelos
└── list-models-direct.mjs         # Lista direta
```

**Scripts Principais:**

| Script | Comando | Proposito |
|--------|---------|-----------|
| `check-internal-links.mjs` | `npm run check-links` | Verifica links internos quebrados |
| `blog-audit.mjs` | `node scripts/blog-audit.mjs` | Auditoria completa do blog |
| `optimize-blog-images.mjs` | `npm run images:optimize` | Otimiza imagens do blog |
| `seo-quick-check.mjs` | `node scripts/seo-quick-check.mjs` | Verificacao rapida SEO |
| `pagespeed-insights.mjs` | `npm run pagespeed` | Metricas PageSpeed |
| `fix-canonical-slugs.mjs` | `node scripts/fix-canonical-slugs.mjs` | Corrige slugs |
| `migrate-blog.mjs` | `node scripts/migrate-blog.mjs` | Migra posts |

**Quando usar cada script:**

| Situacao | Script |
|----------|--------|
| Antes de commit/PR | `npm run check-links` |
| Apos adicionar posts | `node scripts/blog-audit.mjs` |
| Imagens novas | `npm run images:optimize` |
| Verificar SEO | `node scripts/seo-quick-check.mjs` |
| Medir performance | `npm run pagespeed` |
| Debug collection | `node scripts/debug-astro-collection.mjs` |

---

## .claude/ - Configuracoes Claude Code

**Descricao:** Configuracoes e extensoes para Claude Code.

```
.claude/
├── settings.json          # Configuracoes do projeto
├── settings.local.json    # Configuracoes locais (gitignored)
├── commands/              # Comandos customizados
└── skills/                # Skills especializadas
    ├── pele-seo-auditor/  # Skill auditoria SEO
    └── seo-copywriter-pro/ # Skill copywriting
        ├── references/    # Referencias
        └── scripts/       # Scripts
```

**Arquivos:**

| Arquivo | Proposito | Editar Quando |
|---------|-----------|---------------|
| `settings.json` | Config compartilhada | Alterar comportamento global |
| `settings.local.json` | Config local (nao commitado) | API keys, preferencias pessoais |
| `commands/` | Slash commands customizados | Criar novo comando |
| `skills/` | Skills especializadas | Adicionar expertise |

---

## Arquivos de Configuracao

### astro.config.mjs

**Proposito:** Configuracao principal do Astro.

**Conteudo critico:**
```javascript
export default defineConfig({
  server: { port: 3000 },
  site: 'https://drroberiobrandao.com',
  trailingSlash: 'never',

  integrations: [
    mdx(),
    react(),
    tailwind(),
    sitemap({ i18n: { defaultLocale: 'en', locales: { pt: 'pt', en: 'en', es: 'es' } } }),
    compress({ CSS: true, HTML: {...}, JavaScript: true, SVG: true }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    routing: { prefixDefaultLocale: false },
  },

  output: 'static',
  build: { format: 'directory' },

  redirects: {
    '/tecnicas': '/pt/tecnicas',
    '/face-moderna': '/pt/face-moderna',
    // ...
  },
});
```

### tailwind.config.mjs

**Proposito:** Design system do projeto.

**Cores principais:**
```javascript
colors: {
  primary: {
    900: '#1e293b',  // Deep Petrol - cor principal
    // ... escala completa
  },
  accent: {
    600: '#b8956c',  // Gold/Bronze
    700: '#9d7f5c',  // WCAG compliant para texto
    // ...
  },
  ivory: '#fafaf8',   // Background editorial
  warmGray: '#4a4a48', // Texto corpo
  softGray: '#8a8a88', // Texto secundario (cuidado WCAG)
}
```

**Fontes:**
```javascript
fontFamily: {
  serif: ['Playfair Display', 'Georgia', 'serif'],  // Headings
  sans: ['Inter', 'system-ui', 'sans-serif'],       // Body
}
```

### tsconfig.json

**Proposito:** TypeScript + path aliases.

**Aliases:**
```json
{
  "paths": {
    "@/*": ["src/*"],
    "@components/*": ["src/components/*"],
    "@layouts/*": ["src/layouts/*"],
    "@lib/*": ["src/lib/*"]
  }
}
```

---

## Diagrama Visual

```
┌────────────────────────────────────────────────────────────────────────┐
│                           PROJETO FACE MODERNA                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         src/ (Codigo-Fonte)                       │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │                                                                   │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │  │
│  │  │    pages/       │  │    layouts/     │  │   components/    │  │  │
│  │  │  (87+ rotas)    │  │  (BaseLayout)   │  │  (UI + Islands)  │  │  │
│  │  └────────┬────────┘  └────────┬────────┘  └────────┬─────────┘  │  │
│  │           │                    │                    │            │  │
│  │           └────────────────────┼────────────────────┘            │  │
│  │                                │                                 │  │
│  │  ┌─────────────────────────────┼──────────────────────────────┐  │  │
│  │  │                             │                               │  │  │
│  │  │  ┌──────────────┐  ┌───────┴───────┐  ┌─────────────────┐  │  │  │
│  │  │  │  content/    │  │     lib/      │  │    styles/      │  │  │  │
│  │  │  │  (229 MDX)   │  │ (i18n+utils)  │  │  (global.css)   │  │  │  │
│  │  │  └──────────────┘  └───────────────┘  └─────────────────┘  │  │  │
│  │  │                                                             │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌────────────────────────┐  ┌────────────────────────────────────┐    │
│  │      public/           │  │           scripts/                 │    │
│  │  (384 images/assets)   │  │  (37 scripts automacao)           │    │
│  └────────────────────────┘  └────────────────────────────────────┘    │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    Arquivos de Configuracao                     │    │
│  ├────────────────────────────────────────────────────────────────┤    │
│  │  astro.config.mjs │ tailwind.config.mjs │ tsconfig.json        │    │
│  │  package.json     │ netlify.toml        │ vercel.json          │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘

                              BUILD
                                │
                                ▼
                    ┌───────────────────────┐
                    │        dist/          │
                    │   (Site Estatico)     │
                    │   HTML + CSS + JS     │
                    └───────────────────────┘
```

---

## Checklist de Verificacao

### Antes de Commitar

- [ ] `npm run quality` passa
- [ ] `npm run check-links` sem erros
- [ ] Paginas novas tem SEO completo
- [ ] Imagens otimizadas (WebP, <500KB)
- [ ] Frontmatter MDX validado
- [ ] Traducoes em todos os locales

### Antes de Deploy

- [ ] `npm run build` sem erros
- [ ] `npm run preview` funciona
- [ ] Pagespeed score >90
- [ ] hreflang correto
- [ ] robots.txt atualizado
- [ ] Sitemap inclui novas paginas

---

**Ultima atualizacao:** 2024-12-23
**Versao do projeto:** 1.0.0
**Autor:** Claude Code (documentacao automatizada)






