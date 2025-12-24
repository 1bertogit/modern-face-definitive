SEO Implementado - Análise Completa
Arquitetura de SEO em 5 Camadas

┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA 1: META TAGS                          │
│  SEO.astro → title, description, robots, canonical, keywords    │
├─────────────────────────────────────────────────────────────────┤
│                    CAMADA 2: OPEN GRAPH                         │
│  og:title, og:description, og:image, og:locale, twitter:card    │
├─────────────────────────────────────────────────────────────────┤
│                    CAMADA 3: SCHEMA.ORG (JSON-LD)               │
│  Person, Organization, Article, FAQ, Course, LocalBusiness     │
├─────────────────────────────────────────────────────────────────┤
│                    CAMADA 4: INTERNACIONAL (i18n)               │
│  hreflang, x-default, URLs traduzidas, og:locale:alternate     │
├─────────────────────────────────────────────────────────────────┤
│                    CAMADA 5: TÉCNICO                            │
│  robots.txt, sitemap.xml, llms.txt, IndexNow                   │
└─────────────────────────────────────────────────────────────────┘
1. Meta Tags Básicas (SEO.astro)

<!-- Título e Descrição -->
<title>Endomidface por Visão Direta | Dr. Robério Brandão</title>
<meta name="description" content="Técnica exclusiva de rejuvenescimento..." />

<!-- Controle de Indexação -->
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />

<!-- URL Canônica (evita duplicação) -->
<link rel="canonical" href="https://drroberiobrandao.com/pt/tecnicas/endomidface" />

<!-- Keywords (ainda útil para alguns buscadores) -->
<meta name="keywords" content="endomidface, lifting facial, cirurgia plástica" />

<!-- Autoria -->
<meta name="author" content="Dr. Robério Brandão" />
<meta name="publisher" content="Modern Face Institute" />

<!-- Geo-targeting (SEO local) -->
<meta name="geo.region" content="BR-CE" />
<meta name="geo.placename" content="Fortaleza, Brazil" />
★ Insight ─────────────────────────────────────
O max-image-preview:large permite que o Google mostre imagens grandes nos resultados. O max-snippet:-1 remove limite de caracteres do snippet.
─────────────────────────────────────────────────
2. Open Graph + Twitter Cards

<!-- Facebook/LinkedIn/WhatsApp -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://drroberiobrandao.com/..." />
<meta property="og:title" content="Título da Página" />
<meta property="og:description" content="Descrição..." />
<meta property="og:image" content="https://drroberiobrandao.com/images/og-default.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:locale:alternate" content="en_US" />
<meta property="og:locale:alternate" content="es_ES" />
<meta property="og:site_name" content="Dr. Robério Brandão | Modern Face Institute" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content="@drroberiobrandao" />
<meta name="twitter:site" content="@drroberiobrandao" />
Dimensões OG Image: 1200x630px (padrão recomendado)
3. Schema.org (Dados Estruturados JSON-LD)
O projeto implementa 7 tipos de schema:
3.1 SchemaPerson (Autoria)

{
  "@type": "Person",
  "@id": "https://drroberiobrandao.com/#person-dr-roberio",
  "name": "Dr. Robério Brandão",
  "jobTitle": "Facial Plastic Surgeon",
  "description": "Creator of ENDOMIDFACE® by Direct Vision...",
  "knowsAbout": ["ENDOMIDFACE", "Deep Neck Surgery", "Midface Lift"],
  "hasCredential": [{ "@type": "EducationalOccupationalCredential", "name": "Plastic Surgery Specialist" }],
  "award": ["Invited Speaker - SBCP National Congress 2023"],
  "sameAs": ["instagram.com/...", "linkedin.com/...", "youtube.com/..."]
}
★ Insight ─────────────────────────────────────
O @id cria uma entidade única que pode ser referenciada em outros schemas. Isso ajuda o Google a construir o Knowledge Graph do médico.
─────────────────────────────────────────────────
3.2 SchemaOrganization (Instituto)

{
  "@type": "MedicalOrganization",
  "@id": "https://drroberiobrandao.com/#organization",
  "name": "Modern Face Institute",
  "alternateName": ["Brandão Facial Institute", "Instituto Face Moderna"],
  "medicalSpecialty": ["Plastic Surgery", "Facial Surgery"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "itemListElement": [
      { "@type": "Course", "name": "ENDOMIDFACE® Mentorship" },
      { "@type": "Course", "name": "Deep Neck Mastery" }
    ]
  },
  "founder": { "@id": ".../#person-dr-roberio" }
}
3.3 SchemaLocalBusiness (SEO Local)

{
  "@type": "MedicalBusiness",
  "name": "Dr. Robério Brandão - Cirurgia Plástica Facial",
  "address": {
    "streetAddress": "Av. Prudente de Morais",
    "addressLocality": "Natal",
    "addressRegion": "RN",
    "postalCode": "59020-000",
    "addressCountry": "BR"
  },
  "geo": { "latitude": -5.7945, "longitude": -35.211 },
  "openingHoursSpecification": [
    { "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "08:00", "closes": "18:00" }
  ],
  "availableService": [
    { "@type": "MedicalProcedure", "name": "ENDOMIDFACE por Visão Direta" },
    { "@type": "MedicalProcedure", "name": "Deep Neck Lift" }
  ]
}
Carregamento: Apenas em páginas PT (SEO local brasileiro).
3.4 SchemaArticle (Blog/Artigos)

{
  "@type": "MedicalWebPage",
  "headline": "Lifting Facial aos 40 Anos",
  "author": { "@id": ".../#person-dr-roberio" },
  "publisher": { "@id": ".../#organization" },
  "datePublished": "2024-12-20",
  "dateModified": "2024-12-23",
  "articleSection": "Facial Surgery",
  "speakable": { "cssSelector": ["article", ".content", "h1", "h2"] },
  "medicalAudience": { "audienceType": "Clinician" }
}
★ Insight ─────────────────────────────────────
O speakable define quais partes da página podem ser lidas por assistentes de voz (Google Assistant, Alexa). O medicalAudience: Clinician indica que é conteúdo para profissionais.
─────────────────────────────────────────────────
3.5 SchemaFAQ (Rich Snippets)

{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "O que é Endomidface?",
      "acceptedAnswer": { "@type": "Answer", "text": "Técnica de rejuvenescimento..." }
    }
  ]
}
Benefício: Aparece diretamente nos resultados do Google como accordion.
3.6 SchemaCourse (Treinamentos)

{
  "@type": "Course",
  "name": "ENDOMIDFACE® Mentorship",
  "provider": { "@id": ".../#organization" },
  "instructor": { "@id": ".../#person-dr-roberio" },
  "educationalLevel": "Advanced",
  "teaches": ["ENDOMIDFACE by Direct Vision technique", "Deep Neck surgery"],
  "competencyRequired": "Medical degree with surgical training",
  "audience": { "audienceType": "Plastic Surgeons, Facial Surgeons" }
}
3.7 SchemaBreadcrumb (Navegação)

{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Home", "item": "https://..." },
    { "position": 2, "name": "Técnicas", "item": "https://.../tecnicas" },
    { "position": 3, "name": "Endomidface", "item": "https://.../tecnicas/endomidface" }
  ]
}
4. SEO Internacional (i18n)
4.1 Hreflang Tags

<!-- Alternativas de idioma -->
<link rel="alternate" hreflang="en" href="https://drroberiobrandao.com/techniques/endomidface" />
<link rel="alternate" hreflang="pt-BR" href="https://drroberiobrandao.com/pt/tecnicas/endomidface" />
<link rel="alternate" hreflang="es" href="https://drroberiobrandao.com/es/tecnicas/endomidface" />
<link rel="alternate" hreflang="x-default" href="https://drroberiobrandao.com/techniques/endomidface" />
4.2 Tradução de URLs (Slugs Traduzidos)
Inglês (default)	Português	Espanhol
/techniques/endomidface	/pt/tecnicas/endomidface	/es/tecnicas/endomidface
/modern-face/what-is-it	/pt/face-moderna/o-que-e	/es/face-moderna/que-es
/blog/facelift-at-40	/pt/blog/lifting-facial-40-anos	/es/blog/lifting-facial-40-anos
Mapeamento: ~39KB de traduções em paths.ts
4.3 og:locale

<meta property="og:locale" content="pt_BR" />
<meta property="og:locale:alternate" content="en_US" />
<meta property="og:locale:alternate" content="es_ES" />
5. SEO Técnico
5.1 robots.txt

User-agent: *
Allow: /

# Bloqueios
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/
Disallow: /*?*utm_     # Parâmetros de tracking
Disallow: /*?*fbclid=  # Facebook click ID

# Bots de IA permitidos
User-agent: GPTBot
Allow: /llms.txt

User-agent: Claude-Web
Allow: /llms.txt

# Bots bloqueados (scrapers)
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /
5.2 llms.txt (Para IAs)
Arquivo especial em public/llms.txt com:
Informações corretas sobre Dr. Robério Brandão
Estatísticas de segurança (0% lesão nervosa)
Definições técnicas (Endomidface, Modern Face, etc.)
FAQs para IAs responderem corretamente
★ Insight ─────────────────────────────────────
O llms.txt é um padrão emergente para fornecer contexto a LLMs. Evita que ChatGPT, Claude, Perplexity inventem informações incorretas sobre o médico.
─────────────────────────────────────────────────
5.3 Sitemaps

/sitemap-index.xml          # Índice principal
/sitemap-blog.xml.astro     # Blog posts dinâmico
/sitemap-education.xml.astro # Páginas educação
/sitemap-techniques.xml.astro # Páginas técnicas
/sitemap-es.xml.astro       # Conteúdo espanhol
5.4 IndexNow
Arquivo src/lib/indexnow.ts para notificar Bing/Yandex sobre novas páginas instantaneamente.
6. Componentes por Tipo de Página
Tipo de Página	Schemas Usados
Homepage	Organization + LocalBusiness (PT)
Blog Post	Article + FAQ (se tiver) + Person (autor)
Técnicas	MedicalWebPage + Breadcrumb
Cursos	Course + Organization
FAQ	FAQPage
Sobre Dr.	Person (extended)
7. Fluxo de Dados SEO

BaseLayout.astro
    │
    ├── SEO.astro (meta tags, OG, hreflang)
    │       │
    │       └── getAlternateUrls() → gera hreflang automático
    │
    ├── SchemaOrganization (homepage)
    │
    ├── SchemaLocalBusiness (apenas PT)
    │
    └── [Page-specific schemas]
            │
            ├── SchemaArticle (blog)
            ├── SchemaFAQ (páginas FAQ)
            ├── SchemaCourse (cursos)
            └── SchemaPerson (sobre)
8. Checklist SEO por Página
Quando criar uma nova página:
 Passar title (50-60 chars) para BaseLayout
 Passar description (150-160 chars)
 Adicionar keywords array
 Incluir schema apropriado (Article, FAQ, Course, etc.)
 Adicionar Breadcrumb se tiver hierarquia
 Criar versões em PT e ES com slugs traduzidos
 Verificar hreflang gerado automaticamente
 Testar com Rich Results Test
9. Métricas de Sucesso
O projeto está otimizado para:
Métrica	Objetivo	Como
Rich Snippets	FAQ, Course, Person no SERP	Schemas JSON-LD
Knowledge Graph	Dr. Robério como entidade	Person + sameAs + @id
Local Pack	Aparecer em buscas locais BR	LocalBusiness + geo
International SEO	Ranking em 3 idiomas	hreflang + slugs traduzidos
E-E-A-T	Expertise, Experience, Authority, Trust	Author schemas, credentials
★ Insight ─────────────────────────────────────
E-E-A-T é crítico para sites médicos (YMYL - Your Money Your Life). O projeto implementa isso através de: credenciais no SchemaPerson, afiliação com SBCP, prêmios, e links verificáveis para redes sociais.