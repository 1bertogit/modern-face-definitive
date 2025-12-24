/**
 * Lista modelos disponíveis na API Gemini
 */

import { config } from "dotenv";

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY não encontrada");
  process.exit(1);
}

async function listModels() {
  console.log("🔍 Listando modelos disponíveis na API Gemini...\n");
  
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ Erro:", data.error?.message || "Erro desconhecido");
      process.exit(1);
    }
    
    console.log(`✅ Encontrados ${data.models?.length || 0} modelos:\n`);
    
    // Filtrar apenas modelos que suportam generateContent
    const modelosSuportados = data.models?.filter(model => 
      model.supportedGenerationMethods?.includes("generateContent")
    ) || [];
    
    console.log(`📌 Modelos que suportam generateContent (${modelosSuportados.length}):\n`);
    
    modelosSuportados.forEach(model => {
      console.log(`   ✅ ${model.name}`);
      console.log(`      Display Name: ${model.displayName || "N/A"}`);
      console.log(`      Description: ${model.description || "N/A"}`);
      console.log("");
    });
    
    if (modelosSuportados.length > 0) {
      const primeiroModelo = modelosSuportados[0].name.replace("models/", "");
      console.log(`💡 Sugestão: Use o modelo "${primeiroModelo}"`);
      console.log(`   Exemplo: model: "${primeiroModelo}"`);
    }
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

listModels();

