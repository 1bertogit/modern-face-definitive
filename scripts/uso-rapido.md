# 🚀 Como Usar o Gemini - Guia Rápido

## ⚡ Uso Imediato

### 1. Testar se está funcionando

```bash
npm run test:gemini

```

### 2. Ver exemplos práticos

```bash
node scripts/exemplo-uso-gemini.mjs

```

## 💡 Usos Mais Comuns

### 📝 Gerar Conteúdo

```javascript
import { generateContent } from './scripts/gemini-helper.mjs';

const texto = await generateContent(
  "Escreva sobre cirurgia facial em 3 frases"
);

```

### 🌍 Traduzir

```javascript
import { translateText } from './scripts/gemini-helper.mjs';

const ingles = await translateText("Olá mundo", "en");
const espanhol = await translateText("Olá mundo", "es");

```

### 📋 Resumir

```javascript
import { summarizeText } from './scripts/gemini-helper.mjs';

const resumo = await summarizeText(textoLongo, 100);

```

### 🔍 Gerar SEO

```javascript
import { generateTitle, generateMetaDescription, generateKeywords } from './scripts/gemini-helper.mjs';

const titulo = await generateTitle(conteudo, "technical");
const desc = await generateMetaDescription(titulo, conteudo);
const keywords = await generateKeywords(conteudo, 5);

```

## 🎯 Casos de Uso no Projeto

### 1. Gerar conteúdo para posts do blog

### 2. Traduzir posts entre PT/EN/ES

### 3. Gerar meta descriptions SEO

### 4. Criar keywords para SEO

### 5. Resumir artigos longos

### 6. Gerar títulos alternativos

## 📚 Mais Informações

Veja `scripts/GEMINI_USAGE.md` para documentação completa.
