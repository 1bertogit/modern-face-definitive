/**
 * Lista modelos disponíveis no Gemini API
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY não encontrada");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log("🔍 Listando modelos disponíveis...\n");
    const models = await genAI.listModels();
    
    console.log("✅ Modelos disponíveis:\n");
    for await (const model of models) {
      console.log(`   📌 ${model.name}`);
      console.log(`      Suporta generateContent: ${model.supportedGenerationMethods?.includes("generateContent") || "N/A"}`);
      console.log("");
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

listModels();

