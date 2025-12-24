# Guia de Instruções para IA - Blog Modern Face Institute

Este documento contém todas as instruções necessárias para escrever artigos do blog corretamente.

---

## 1. REGRA CRÍTICA: Prefixo de Locale nos Paths

### A Regra de Ouro

| Idioma | Prefixo | Exemplo de Link |
|--------|---------|-----------------|
| **EN** (Inglês) | SEM prefixo | `/blog/facelift-at-40` |
| **PT** (Português) | `/pt/` | `/pt/blog/lifting-facial-40-anos` |
| **ES** (Espanhol) | `/es/` | `/es/blog/lifting-facial-40-anos` |

### Exemplos Corretos vs Incorretos

```markdown
# ❌ ERRADO (artigo PT com links sem prefixo)
[Veja nosso guia de técnicas](/tecnicas/endomidface)
[Entre em contato](/contato)

# ✅ CORRETO (artigo PT com prefixo /pt/)
[Veja nosso guia de técnicas](/pt/tecnicas/endomidface)
[Entre em contato](/pt/contato)
```

```markdown
# ❌ ERRADO (artigo EN com prefixo desnecessário)
[See our technique guide](/en/techniques/endomidface)

# ✅ CORRETO (artigo EN sem prefixo)
[See our technique guide](/techniques/endomidface)
```

---

## 2. Estrutura do Arquivo MDX

### Localização dos Arquivos

```
src/content/blog/
├── en/           ← Artigos em inglês
│   └── article-slug.mdx
├── pt/           ← Artigos em português
│   └── artigo-slug.mdx
└── es/           ← Artigos em espanhol
    └── articulo-slug.mdx
```

### Template de Frontmatter

```yaml
---
title: "Título do Artigo (máx 150 caracteres)"
description: "Descrição meta para SEO (máx 300 caracteres)"
category: "Categoria"  # Técnicas, Indicações, Recuperação, Educação, Filosofia, etc.
date: 2024-12-20
author: "Dr. Robério Brandão"
readTime: "10 min"
featured: false
draft: false
locale: "pt"  # IMPORTANTE: "pt", "en" ou "es"
canonicalSlug: "lifting-facial-40-anos"  # Conecta traduções entre idiomas
keywords:
  - "palavra-chave 1"
  - "palavra-chave 2"
  - "Dr Robério Brandão"
  - "Face Moderna"
articleType: "MedicalWebPage"
image: "/images/blog/pt/nome-do-artigo.webp"
faq:
  - question: "Pergunta frequente 1?"
    answer: "Resposta completa e detalhada."
  - question: "Pergunta frequente 2?"
    answer: "Resposta completa e detalhada."
---
```

### Campos Obrigatórios

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `title` | Título (máx 150 chars) | "Lifting Facial aos 40 Anos" |
| `description` | Meta description (máx 300 chars) | "Lifting aos 40 é cedo?" |
| `category` | Categoria do artigo | "Indicações" |
| `date` | Data de publicação | 2024-12-20 |
| `locale` | **CRÍTICO**: Idioma do artigo | "pt", "en" ou "es" |

### Campos Opcionais Importantes

| Campo | Descrição | Default |
|-------|-----------|---------|
| `canonicalSlug` | Liga traduções entre idiomas | - |
| `faq` | Array de perguntas/respostas para SEO | - |
| `keywords` | Palavras-chave para SEO | [] |
| `image` | Imagem de destaque | - |
| `readTime` | Tempo de leitura estimado | "5 min" |

---

## 3. URLs Válidas por Idioma

### Páginas Principais - INGLÊS (sem prefixo)

```
/                              # Homepage
/about                         # Sobre
/about/dr-roberio-brandao      # Sobre o Dr.
/contact                       # Contato
/education                     # Educação/Treinamentos
/blog                          # Blog index
/blog/[slug]                   # Artigo do blog
/techniques                    # Técnicas (index)
/techniques/endomidface        # Endomidface
/techniques/deep-neck          # Deep Neck
/techniques/browlift           # Browlift
/modern-face                   # Face Moderna
/modern-face/what-is-it        # O que é Face Moderna
/modern-face/philosophy        # Filosofia
/modern-face/principles        # Princípios
/faq                           # FAQ
/cases                         # Casos
/library                       # Biblioteca
```

### Páginas Principais - PORTUGUÊS (prefixo /pt/)

```
/pt                            # Homepage
/pt/sobre                      # Sobre
/pt/sobre/dr-roberio-brandao   # Sobre o Dr.
/pt/contato                    # Contato
/pt/educacao                   # Educação/Treinamentos
/pt/blog                       # Blog index
/pt/blog/[slug]                # Artigo do blog
/pt/tecnicas                   # Técnicas (index)
/pt/tecnicas/endomidface       # Endomidface
/pt/tecnicas/deep-neck         # Deep Neck
/pt/tecnicas/browlift          # Browlift
/pt/face-moderna               # Face Moderna
/pt/face-moderna/o-que-e       # O que é Face Moderna
/pt/face-moderna/filosofia     # Filosofia
/pt/face-moderna/principios    # Princípios
/pt/faq                        # FAQ
/pt/casos                      # Casos
/pt/biblioteca                 # Biblioteca
```

### Páginas Principais - ESPANHOL (prefixo /es/)

```
/es                            # Homepage
/es/sobre                      # Sobre
/es/sobre/dr-roberio-brandao   # Sobre o Dr.
/es/contacto                   # Contato
/es/educacion                  # Educação/Treinamentos
/es/blog                       # Blog index
/es/blog/[slug]                # Artigo do blog
/es/tecnicas                   # Técnicas (index)
/es/tecnicas/endomidface       # Endomidface
/es/tecnicas/deep-neck         # Deep Neck
/es/tecnicas/browlift          # Browlift
/es/face-moderna               # Face Moderna
/es/face-moderna/que-es        # O que é Face Moderna
/es/face-moderna/filosofia     # Filosofia
/es/face-moderna/principios    # Princípios
/es/faq                        # FAQ
/es/casos                      # Casos
/es/biblioteca                 # Biblioteca
```

---

## 4. Padrões de Links Internos

### Links de CTA (Call-to-Action)

```markdown
# Em artigo PORTUGUÊS:
[Ver Programas de Formação](/pt/educacao)
[Conheça o Dr. Robério](/pt/sobre/dr-roberio-brandao)
[Entre em Contato](/pt/contato)
[Saiba mais sobre Endomidface](/pt/tecnicas/endomidface)

# Em artigo INGLÊS:
[View Training Programs](/education)
[Meet Dr. Robério](/about/dr-roberio-brandao)
[Contact Us](/contact)
[Learn about Endomidface](/techniques/endomidface)

# Em artigo ESPANHOL:
[Ver Programas de Formación](/es/educacion)
[Conozca al Dr. Robério](/es/sobre/dr-roberio-brandao)
[Contáctenos](/es/contacto)
[Conozca más sobre Endomidface](/es/tecnicas/endomidface)
```

### Links para Outros Artigos do Blog

```markdown
# Em artigo PORTUGUÊS linkando para outro artigo PT:
[Veja também: Deep Neck](/pt/blog/deep-neck-guia-completo)

# Em artigo INGLÊS linkando para outro artigo EN:
[See also: Deep Neck](/blog/deep-neck-complete-guide)

# Em artigo ESPANHOL linkando para outro artigo ES:
[Vea también: Deep Neck](/es/blog/deep-neck-guia-completo)
```

---

## 5. Categorias Válidas

| Categoria PT | Categoria EN | Categoria ES | Descrição |
|--------------|--------------|--------------|-----------|
| Técnicas | Techniques | Técnicas | Detalhes técnicos de procedimentos |
| Indicações | Indications | Indicaciones | Quando/para quem é indicado |
| Recuperação | Recovery | Recuperación | Pós-operatório |
| Resultados | Results | Resultados | Casos e resultados |
| Educação | Education | Educación | Formação de cirurgiões |
| Filosofia | Philosophy | Filosofía | Filosofia Face Moderna |
| Anatomia | Anatomy | Anatomía | Conteúdo anatômico |
| Segurança | Safety | Seguridad | Segurança e complicações |
| Geral | General | General | Conteúdo geral |

---

## 6. Formatação do Conteúdo

### Citações do Dr. Robério

```markdown
> "É mais fácil manter do que restaurar. Um procedimento mais leve aos 40 pode evitar cirurgia mais extensa aos 55."
>
> — Dr. Robério Brandão
```

### Listas com Dados

```markdown
## Vantagens da Técnica

1. **Taxa de lesão nervosa permanente:** 0% em 212 casos documentados
2. **Tempo de recuperação:** 7 dias (vs 21 dias tradicional)
3. **Taxa de complicação geral:** 3% (vs 12% na literatura)
```

### Seções Estruturadas

```markdown
## 🎯 Resumo Executivo

**A pergunta:** [Pergunta principal do artigo]

**A resposta:** [Resposta concisa e direta]

---

## Conteúdo Detalhado

[Desenvolvimento do tema...]

---

## Conclusão

[Fechamento do artigo...]

---

## Para Cirurgiões

[CTA para formação se aplicável]
```

---

## 7. FAQ para SEO (Schema.org)

Cada artigo deve ter 3-7 FAQs estruturadas:

```yaml
faq:
  - question: "Lifting aos 40 anos é cedo demais?"
    answer: "Não se há indicação anatômica. A decisão baseia-se em ptose (não idade). Em 1.500+ casos, 15% tinham menos de 50 anos."
  - question: "O que é lifting preventivo?"
    answer: "Procedimento que aborda ptose precoce antes de se tornar severa, resultando em intervenções menos extensas."
  - question: "Quanto tempo dura o resultado?"
    answer: "Em média 10-12 anos. Pacientes mais jovens tendem a ter longevidade superior devido à melhor qualidade da pele."
```

**Regras para FAQs:**
- Perguntas devem terminar com "?"
- Respostas devem ser completas mas concisas
- Incluir dados quando disponíveis
- 3-7 perguntas por artigo

---

## 8. Imagens

### Convenção de Nomenclatura

```
/images/blog/[locale]/[slug-do-artigo].webp

Exemplos:
/images/blog/pt/lifting-facial-40-anos.webp
/images/blog/en/facelift-at-40.webp
/images/blog/es/lifting-facial-40-anos.webp
```

### No Frontmatter

```yaml
image: "/images/blog/pt/lifting-facial-40-anos.webp"
```

---

## 9. Keywords (SEO)

Incluir 5-10 keywords relevantes:

```yaml
keywords:
  - "lifting facial 40 anos"      # Principal
  - "lifting preventivo"           # Variação
  - "rejuvenescimento facial"      # Relacionado
  - "cirurgia facial jovem"        # Long-tail
  - "quando fazer lifting"         # Pergunta comum
  - "Dr Robério Brandão"           # Autor
  - "Face Moderna"                 # Marca
  - "Endomidface"                  # Técnica (se relevante)
```

---

## 10. Checklist Antes de Publicar

### ✅ Frontmatter
- [ ] `locale` está correto ("pt", "en" ou "es")
- [ ] `title` tem menos de 150 caracteres
- [ ] `description` tem menos de 300 caracteres
- [ ] `date` está no formato YYYY-MM-DD
- [ ] `canonicalSlug` está definido (se há versões em outros idiomas)
- [ ] `keywords` inclui pelo menos 5 termos relevantes
- [ ] `faq` tem 3-7 perguntas bem estruturadas

### ✅ Links Internos
- [ ] **PT**: TODOS os links internos começam com `/pt/`
- [ ] **EN**: NENHUM link interno começa com `/en/` (sem prefixo)
- [ ] **ES**: TODOS os links internos começam com `/es/`
- [ ] Links apontam para páginas que existem
- [ ] CTAs usam paths corretos

### ✅ Conteúdo
- [ ] Citações do Dr. Robério estão formatadas corretamente
- [ ] Listas e tabelas estão bem estruturadas
- [ ] Dados e estatísticas estão incluídos quando relevante
- [ ] Seção para cirurgiões (CTA de formação) está presente

### ✅ Arquivo
- [ ] Arquivo está na pasta correta (`src/content/blog/[locale]/`)
- [ ] Nome do arquivo usa kebab-case (palavras-separadas-por-hifen.mdx)
- [ ] Extensão é `.mdx`

---

## 11. Exemplo Completo - Artigo PT

```mdx
---
title: "Lifting Facial aos 40 Anos: Prevenção Inteligente"
description: "Lifting aos 40 é cedo? Dados de 1.500+ casos mostram que 15% tinham menos de 50 anos. Quando lifting preventivo faz sentido."
category: "Indicações"
date: 2024-12-20
author: "Dr. Robério Brandão"
readTime: "12 min"
featured: false
draft: false
locale: "pt"
canonicalSlug: "lifting-facial-40-anos"
keywords:
  - "lifting facial 40 anos"
  - "lifting preventivo"
  - "rejuvenescimento 40 anos"
  - "Dr Robério Brandão"
  - "Face Moderna"
articleType: "MedicalWebPage"
image: "/images/blog/pt/lifting-facial-40-anos.webp"
faq:
  - question: "Lifting aos 40 anos é cedo demais?"
    answer: "Não se há indicação anatômica. A decisão baseia-se em ptose, não idade."
  - question: "Quanto tempo dura o resultado aos 40?"
    answer: "Em média 11 anos, superior à média geral de 10 anos."
  - question: "Qual técnica é indicada aos 40 anos?"
    answer: "Depende da anatomia. Ptose terço médio: Endomidface. Ptose inferior + pescoço: Deep Plane + Deep Neck."
---

# Lifting Facial aos 40 Anos: Prevenção Inteligente

Aos 40 anos, a pergunta surge: **"Não é cedo demais para lifting?"**

> "É mais fácil manter do que restaurar."
>
> — Dr. Robério Brandão

## 🎯 Resumo Executivo

**A pergunta:** Lifting aos 40 é cedo demais?

**A resposta:** Não, se há ptose. A decisão baseia-se em anatomia, não idade.

## Dados da Casuística

Em **1.500+ cirurgias**:
- **15%** dos pacientes tinham menos de 50 anos
- **Satisfação:** 98% (vs 96% geral)
- **Longevidade:** 11 anos (vs 10 anos geral)

## Técnicas Indicadas

Para pacientes de 40-45 anos, a distribuição é:
- **60%** Endomidface isolado
- **30%** Endomidface + Deep Neck
- **10%** Deep Plane completo

[Saiba mais sobre Endomidface](/pt/tecnicas/endomidface)

## Para Cirurgiões

Aprenda a oferecer resultados naturais em nossas mentorias.

[Ver Programas de Formação](/pt/educacao)

[Entre em Contato](/pt/contato)
```

---

## 12. Termos e Conceitos Importantes

### Técnicas Proprietárias

| Termo | Descrição |
|-------|-----------|
| **Endomidface** | Técnica de rejuvenescimento do terço médio facial criada por Dr. Robério |
| **Endomidface por Visão Direta** | Variante sem endoscópio (mais acessível) |
| **Deep Neck** | Técnica de rejuvenescimento cervical com preservação glandular |
| **Alça Glandular** | Técnica de suspensão da glândula submandibular |
| **GPS Tátil** | Sistema de navegação sensorial para faces fibrosadas |

### Filosofia Face Moderna

| Conceito | Significado |
|----------|-------------|
| **Face Moderna** | Filosofia que reconhece que faces contemporâneas (com bioestimuladores, preenchimentos) requerem técnicas adaptadas |
| **Três Pilares** | Segurança Máxima, Resultados Elegantes, Recuperação Otimizada |

---

## 13. Sobre o Dr. Robério Brandão

Sempre referenciar como:
- **Nome completo:** Dr. Robério Brandão
- **Credenciais:** CRM-CE 8596, RQE 3918, Membro SBCP
- **Experiência:** 20+ anos, 1.500+ cirurgias faciais
- **Criador de:** Endomidface (2018), Deep Neck com Preservação (2020), Filosofia Face Moderna (2022)
- **Série documentada:** 212 casos consecutivos, 0% lesão nervosa permanente

---

## 14. Prompt para a IA

Quando for escrever um artigo, use este prompt inicial:

```
Estou escrevendo um artigo para o blog do Modern Face Institute.

IDIOMA: [PT/EN/ES]
TEMA: [Descrição do tema]
CATEGORIA: [Categoria]

LEMBRE-SE:
1. Locale no frontmatter: "[pt/en/es]"
2. Links internos: [com /pt/ | sem prefixo | com /es/]
3. Incluir FAQs estruturadas (3-7)
4. Incluir dados da casuística quando relevante
5. CTA para /[pt/es]/educacao ou /education no final
6. Citar Dr. Robério Brandão corretamente
```

---

**Última atualização:** 2025-12-23
