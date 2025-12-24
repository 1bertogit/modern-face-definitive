# 🔍 Guia de Diagnóstico: Por que apenas 34 posts aparecem?

## Métodos de Diagnóstico

### Método 1: Script de Análise Automática

Execute o script que analisa todos os arquivos:

```bash
node scripts/debug-blog-articles.mjs
```

Este script vai:
- Contar todos os arquivos `.mdx` na pasta `src/content/blog/en`
- Verificar se têm `locale: "en"` definido
- Verificar se têm `draft: true/false`
- Verificar se têm `date` válida
- Listar todos os problemas encontrados

### Método 2: Logs no Console do Build

Os logs de debug foram adicionados. Ao fazer build ou rodar o dev server, você verá no console:

```
[DEBUG getBlogPostsByLocale] Locale: en
[DEBUG] Total posts na collection: 150
[DEBUG] Posts com locale='en': 75
[DEBUG] Posts com locale='en' e !draft: 34
[DEBUG] Posts pt: 75
[DEBUG] Posts es: 75
[DEBUG] Posts com draft=true: 41
```

**Execute:**
```bash
npm run dev
# ou
npm run build
```

E verifique o console para ver os números.

### Método 3: Verificação Manual no Código

Verifique diretamente na função `getBlogPostsByLocale`:

1. Abra `src/lib/blog-utils.ts`
2. Veja a função `getBlogPostsByLocale` (linha ~217)
3. O filtro é: `({ data }) => data.locale === locale && !data.draft`

**Possíveis problemas:**

#### Problema 1: Posts com `locale` diferente de 'en'
Alguns posts podem ter:
- `locale: "pt"` (padrão do schema)
- `locale: "es"`
- `locale: undefined` (não definido)

**Solução:** Verificar todos os arquivos em `src/content/blog/en/` e garantir que têm `locale: "en"`

#### Problema 2: Posts com `draft: true`
Alguns posts podem estar marcados como draft.

**Solução:** Verificar se há `draft: true` nos frontmatters

#### Problema 3: Erro na conversão `postToArticle`
A função pode estar falhando silenciosamente.

**Solução:** Os logs de debug vão mostrar erros na conversão

### Método 4: Verificação Direta nos Arquivos

Execute este comando para verificar todos os posts:

```bash
# Verificar posts sem locale definido
grep -L "locale:" src/content/blog/en/*.mdx

# Verificar posts com draft: true
grep -l "draft: true" src/content/blog/en/*.mdx

# Verificar posts com locale diferente de 'en'
grep -l "locale: \"pt\"" src/content/blog/en/*.mdx
grep -l "locale: \"es\"" src/content/blog/en/*.mdx
```

### Método 5: Teste Direto no Código

Adicione este código temporário em `src/pages/blog/index.astro`:

```astro
---
// ... existing code ...

// DEBUG TEMPORÁRIO
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const enPosts = allPosts.filter(({ data }) => data.locale === 'en');
const enNoDraft = enPosts.filter(({ data }) => !data.draft);

console.warn('=== DEBUG BLOG EN ===');
console.warn('Total posts:', allPosts.length);
console.warn('Posts EN:', enPosts.length);
console.warn('Posts EN sem draft:', enNoDraft.length);

// Listar posts problemáticos
const problematic = allPosts.filter(({ data }) => {
  const slugParts = data.slug?.split('/') || [];
  const isInEnFolder = slugParts[0] === 'en' || slugParts.length === 1;
  return isInEnFolder && (data.locale !== 'en' || data.draft === true);
});

if (problematic.length > 0) {
  console.warn('Posts problemáticos:', problematic.length);
  problematic.slice(0, 10).forEach(p => {
    console.warn(`  - ${p.slug}: locale=${p.data.locale}, draft=${p.data.draft}`);
  });
}

// ... existing code ...
---
```

## Possíveis Causas e Soluções

### Causa 1: Schema Default
O schema em `src/content/config.ts` tem:
```typescript
locale: z.enum(['pt', 'en', 'es']).default('pt'),
```

**Problema:** Se um post não tem `locale` definido, recebe `pt` por padrão!

**Solução:** Verificar todos os posts em `en/` e garantir que têm `locale: "en"` explícito.

### Causa 2: Posts na Pasta Errada
Alguns posts podem estar em `src/content/blog/en/` mas ter `locale: "pt"` no frontmatter.

**Solução:** Verificar o frontmatter de cada arquivo.

### Causa 3: Erro Silencioso na Conversão
A função `postToArticle` pode estar falhando para alguns posts.

**Solução:** Os logs de debug vão mostrar isso.

## Checklist de Verificação

- [ ] Executar `node scripts/debug-blog-articles.mjs`
- [ ] Verificar logs no console do build/dev
- [ ] Verificar se todos os posts em `en/` têm `locale: "en"`
- [ ] Verificar se nenhum post tem `draft: true`
- [ ] Verificar se todos os posts têm `date` válida
- [ ] Verificar se não há erros na conversão `postToArticle`

## Próximos Passos

1. Execute o script de diagnóstico
2. Compartilhe os resultados
3. Com base nos resultados, aplicaremos a correção específica

