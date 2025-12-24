# 📚 Como Usar a API do Gemini no Projeto

## ✅ Configuração Inicial

1. **Obtenha sua API Key:**
   - Acesse: <https://makersuite.google.com/app/apikey>
   - Crie uma nova API key

2. **Adicione no arquivo `.env`:**

   ```bash
   GEMINI_API_KEY=sua_api_key_aqui
   ```

## 🧪 Testar a Conexão

```bash
npm run test:gemini

```

## 📋 Listar Modelos Disponíveis

Para ver quais modelos estão disponíveis na sua API:

```bash
node scripts/list-models-direct.mjs

```

## 🛠️ Scripts Disponíveis

### 1. `scripts/test-gemini.mjs`

Testa a conexão com a API e identifica qual modelo funciona.

```bash
npm run test:gemini

```

### 2. `scripts/gemini-helper.mjs`

Biblioteca de funções úteis para usar Gemini no projeto.

**Exemplo de uso:**

```javascript
import { generateContent, translateText, summarizeText } from './scripts/gemini-helper.mjs';

// Gerar conteúdo
const texto = await generateContent("Explique Endomidface");

// Traduzir
const traduzido = await translateText("Hello", "pt");

// Resumir
const resumo = await summarizeText("Texto longo...", 100);

```

### 3. `scripts/generate-blog-helper.mjs`

Exemplo prático de como gerar conteúdo para blog.

```bash
node scripts/generate-blog-helper.mjs

```

## 🔧 Funções Disponíveis no Helper

### `generateContent(prompt, options)`

Gera conteúdo baseado em um prompt.

```javascript
const texto = await generateContent("Escreva sobre cirurgia facial");

```

### `translateText(text, targetLang)`

Traduz texto entre idiomas (pt, en, es).

```javascript
const traduzido = await translateText("Olá", "en");

```

### `summarizeText(text, maxWords)`

Gera resumo de texto.

```javascript
const resumo = await summarizeText("Texto longo...", 100);

```

### `generateTitle(content, style)`

Gera título para artigo.

```javascript
const titulo = await generateTitle(conteudo, "technical");
// styles: 'descriptive', 'catchy', 'technical'

```

### `generateMetaDescription(title, content)`

Gera meta description para SEO (150-160 caracteres).

```javascript
const desc = await generateMetaDescription("Título", "Conteúdo...");

```

### `generateKeywords(content, count)`

Gera keywords para SEO.

```javascript
const keywords = await generateKeywords("Conteúdo...", 5);
// Retorna: ['keyword1', 'keyword2', ...]

```

### `streamContent(prompt, onChunk)`

Stream de conteúdo (respostas em tempo real).

```javascript
await streamContent("Prompt", (chunk) => {
  console.log(chunk); // Recebe chunks conforme processa
});

```

## 🎯 Modelo Atual

O projeto está configurado para usar **`gemini-2.5-flash`** por padrão (mais rápido e recente).

Para usar outro modelo, edite `scripts/gemini-helper.mjs`:

```javascript
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

```

## 📝 Exemplos de Uso Prático

### Gerar conteúdo para post do blog

```javascript
import { generateContent } from './scripts/gemini-helper.mjs';

const prompt = `
Escreva um parágrafo introdutório sobre: Endomidface
Contexto: Blog sobre cirurgia facial, técnicas Modern Face.
Estilo: Profissional, técnico mas acessível.
`;

const conteudo = await generateContent(prompt);

```

### Traduzir conteúdo

```javascript
import { translateText } from './scripts/gemini-helper.mjs';

const textoPT = "A técnica Endomidface é inovadora.";
const textoEN = await translateText(textoPT, "en");
const textoES = await translateText(textoPT, "es");

```

### Gerar SEO completo

```javascript
import { generateTitle, generateMetaDescription, generateKeywords } from './scripts/gemini-helper.mjs';

const conteudo = "Artigo completo sobre...";
const titulo = await generateTitle(conteudo, "technical");
const desc = await generateMetaDescription(titulo, conteudo);
const keywords = await generateKeywords(conteudo, 5);

```

## ⚠️ Limites e Considerações

- A API tem limites de requisições por minuto/dia
- Modelos diferentes têm custos diferentes
- `gemini-2.5-flash` é mais rápido e barato
- `gemini-2.5-pro` é mais poderoso mas mais lento/caro

## 🔗 Links Úteis

- API Key: <https://makersuite.google.com/app/apikey>
- Documentação: <https://ai.google.dev/docs>
- Pricing: <https://ai.google.dev/pricing>
