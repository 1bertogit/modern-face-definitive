# 🤖 Guia de Integração: Google Gemini API em Projetos Node.js

Este guia fornece um passo a passo para integrar a inteligência artificial do Google Gemini em qualquer projeto JavaScript/Node.js.

## 1. Pré-requisitos

1. **Obtenha sua API Key:**
   - Acesse o [Google AI Studio](https://makersuite.google.com/app/apikey).
   - Clique em "Create API key".
   - Guarde esta chave em segurança.

## 2. Configuração do Ambiente

Instale as dependências necessárias no seu projeto:

```bash
npm install @google/generative-ai dotenv

```

Crie um arquivo `.env` na raiz do seu projeto:

```bash
GEMINI_API_KEY=sua_chave_aqui

```

Certifique-se de adicionar `.env` ao seu arquivo `.gitignore`.

## 3. Estrutura de Arquivos Recomendada

Para manter o projeto organizado, crie uma pasta `scripts/` ou `utils/` e adicione os seguintes arquivos:

- `gemini-helper.mjs`: Biblioteca de funções reutilizáveis.
- `test-gemini.mjs`: Script para validar a conexão.

## 4. Implementação do Helper (`gemini-helper.mjs`)

Copie este código para criar uma biblioteca de funções prontas para uso:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

// Inicializa variáveis de ambiente
config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY não configurada no .env");

const genAI = new GoogleGenerativeAI(apiKey);

/**

 * CONFIGURAÇÃO DO MODELO
 * gemini-2.5-flash: Mais rápido e econômico (recomendado para a maioria das tarefas)
 * gemini-2.5-pro: Mais inteligente e capaz (para tarefas complexas)
 */
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**

 * Função Base: Gerar Conteúdo
 */
export async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro Gemini:", error.message);
    throw error;
  }
}

/**

 * Função: Tradução Inteligente
 */
export async function translateText(text, targetLang = "en") {
  const prompt = `Traduza o texto a seguir para o idioma (${targetLang}), mantendo o tom original:\n\n${text}`;
  return await generateContent(prompt);
}

/**

 * Função: Resumo de Texto
 */
export async function summarizeText(text, maxWords = 100) {
  const prompt = `Resuma o texto abaixo em no máximo ${maxWords} palavras:\n\n${text}`;
  return await generateContent(prompt);
}

/**

 * Função: SEO (Meta Description e Keywords)
 */
export async function generateSEO(title, content) {
  const prompt = `Baseado no título "${title}" e no conteúdo "${content.substring(0, 500)}", gere:

  1. Uma meta description de 150 caracteres.
  2. Uma lista de 5 keywords separadas por vírgula.`;
  return await generateContent(prompt);
}

```

## 5. Script de Teste (`test-gemini.mjs`)

Use este script para verificar se tudo está configurado corretamente:

```javascript
import { generateContent } from "./gemini-helper.mjs";

async function runTest() {
  console.log("⏳ Testando conexão com Gemini...");
  try {
    const response = await generateContent("Diga 'Conexão OK' se estiver funcionando.");
    console.log("✅ Resposta:", response);
  } catch (error) {
    console.error("❌ Falha no teste:", error.message);
  }
}

runTest();

```

## 6. Como usar no seu código principal

```javascript
import { generateContent, translateText } from "./scripts/gemini-helper.mjs";

// Exemplo: Gerar um post
const novoPost = await generateContent("Escreva um parágrafo sobre tecnologia.");

// Exemplo: Traduzir
const ingles = await translateText("Olá, como vai?", "en");

```

## 7. Dicas e Boas Práticas

1. **Modelos:** O Google lança versões novas frequentemente. Verifique sempre o nome do modelo mais recente (ex: `gemini-1.5-flash`, `gemini-2.0-flash`).
2. **Prompts:** Seja específico. Quanto mais contexto você der (quem é o público, qual o tom de voz), melhor será a resposta.
3. **Limites:** APIs gratuitas têm limites de requisições por minuto. Para uso intenso, considere o plano pago ou implemente um delay entre chamadas.
4. **Segurança:** **NUNCA** envie sua API Key para o GitHub. Use sempre o arquivo `.env`.

---
*Guia criado para reutilização em projetos Node.js.*
