# 🚀 Como Usar o Gemini no Projeto - Guia Rápido

## ✅ Tudo já está configurado

- ✅ API Key configurada no `.env`
- ✅ Biblioteca instalada (`@google/generative-ai`)
- ✅ Scripts prontos para usar

## 🎯 3 Formas de Usar

### 1️⃣ **Via Script de Teste** (Testar se funciona)

```bash
npm run test:gemini

```

### 2️⃣ **Ver Exemplos Práticos** (Aprender como usar)

```bash
node scripts/exemplo-uso-gemini.mjs

```

### 3️⃣ **Usar no Seu Código** (Integrar no projeto)

```javascript
// Importar as funções
import { generateContent, translateText } from './scripts/gemini-helper.mjs';

// Gerar conteúdo
const texto = await generateContent("Escreva sobre cirurgia facial");

// Traduzir
const ingles = await translateText("Olá", "en");

```

## 📝 Exemplos Rápidos

### Gerar conteúdo

```javascript
const conteudo = await generateContent(
  "Explique a técnica Endomidface em 3 frases"
);

```

### Traduzir post do blog

```javascript
const textoEN = await translateText(
  "A técnica Endomidface utiliza visão direta",
  "en"
);

```

### Gerar SEO completo

```javascript
const titulo = await generateTitle(conteudo, "technical");
const desc = await generateMetaDescription(titulo, conteudo);
const keywords = await generateKeywords(conteudo, 5);

```

## 📚 Funções Disponíveis

Todas estão em `scripts/gemini-helper.mjs`:

- `generateContent(prompt)` - Gera qualquer conteúdo
- `translateText(text, lang)` - Traduz entre PT/EN/ES
- `summarizeText(text, words)` - Resumir texto
- `generateTitle(content, style)` - Gerar títulos
- `generateMetaDescription(title, content)` - Meta description SEO
- `generateKeywords(content, count)` - Keywords SEO
- `streamContent(prompt, callback)` - Stream em tempo real

## 🎯 Casos de Uso Práticos

1. **Gerar conteúdo para posts do blog**
2. **Traduzir posts entre idiomas (PT/EN/ES)**
3. **Gerar meta descriptions para SEO**
4. **Criar keywords automaticamente**
5. **Resumir artigos longos**
6. **Gerar títulos alternativos**

## 💡 Dica

Execute `node scripts/exemplo-uso-gemini.mjs` para ver todos os exemplos funcionando!
