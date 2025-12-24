/**
 * Helper functions para usar Gemini API no projeto
 * Exemplo de uso:
 *   import { generateContent, translateText } from './scripts/gemini-helper.mjs';
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY não encontrada no .env");
}

const genAI = new GoogleGenerativeAI(apiKey);
// Usando gemini-2.5-flash (mais recente e rápido)
// Para listar modelos disponíveis: node scripts/list-models-direct.mjs
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Gera conteúdo usando Gemini
 * @param {string} prompt - O prompt para o modelo
 * @param {object} options - Opções adicionais
 * @returns {Promise<string>} Texto gerado
 */
export async function generateContent(prompt, options = {}) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error.message);
    throw error;
  }
}

/**
 * Traduz texto entre idiomas
 * @param {string} text - Texto a ser traduzido
 * @param {string} targetLang - Idioma de destino ('pt', 'en', 'es')
 * @returns {Promise<string>} Texto traduzido
 */
export async function translateText(text, targetLang = "en") {
  const langNames = {
    'pt': "português brasileiro",
    "en": "inglês",
    "es": "espanhol"
  };

  const prompt = `Traduza o seguinte texto para ${langNames[targetLang] || targetLang}:\n\n${text}`;
  return await generateContent(prompt);
}

/**
 * Gera resumo de texto
 * @param {string} text - Texto para resumir
 * @param {number} maxWords - Número máximo de palavras (padrão: 100)
 * @returns {Promise<string>} Resumo do texto
 */
export async function summarizeText(text, maxWords = 100) {
  const prompt = `Resuma o seguinte texto em no máximo ${maxWords} palavras, mantendo as informações principais:\n\n${text}`;
  return await generateContent(prompt);
}

/**
 * Gera título alternativo para artigo
 * @param {string} content - Conteúdo do artigo
 * @param {string} style - Estilo do título ('descriptive', 'catchy', 'technical')
 * @returns {Promise<string>} Título gerado
 */
export async function generateTitle(content, style = "descriptive") {
  const stylePrompts = {
    descriptive: "descritivo e informativo",
    catchy: "chamativo e atrativo",
    technical: "técnico e profissional"
  };

  const prompt = `Gere um título ${stylePrompts[style] || "descritivo"} baseado neste conteúdo:\n\n${content.substring(0, 500)}`;
  return await generateContent(prompt);
}

/**
 * Gera descrição meta para SEO
 * @param {string} title - Título do artigo
 * @param {string} content - Conteúdo do artigo
 * @returns {Promise<string>} Meta description (150-160 caracteres)
 */
export async function generateMetaDescription(title, content) {
  const prompt = `Gere uma meta description de 150-160 caracteres para SEO baseada neste título e conteúdo:\n\nTítulo: ${title}\n\nConteúdo: ${content.substring(0, 500)}\n\nMeta description:`;
  const result = await generateContent(prompt);
  return result.trim().substring(0, 160);
}

/**
 * Gera keywords para SEO
 * @param {string} content - Conteúdo do artigo
 * @param {number} count - Número de keywords (padrão: 5)
 * @returns {Promise<string[]>} Array de keywords
 */
export async function generateKeywords(content, count = 5) {
  const prompt = `Gere ${count} keywords relevantes para SEO baseadas neste conteúdo. Retorne apenas as palavras separadas por vírgula:\n\n${content.substring(0, 1000)}`;
  const result = await generateContent(prompt);
  return result.split(",").map(k => k.trim()).filter(Boolean);
}

/**
 * Stream de conteúdo (para respostas longas)
 * @param {string} prompt - O prompt para o modelo
 * @param {function} onChunk - Callback chamado para cada chunk recebido
 * @returns {Promise<void>}
 */
export async function streamContent(prompt, onChunk) {
  try {
    const result = await model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (onChunk) {
        onChunk(chunkText);
      } else {
        process.stdout.write(chunkText);
      }
    }
  } catch (error) {
    console.error("Erro no stream:", error.message);
    throw error;
  }
}

