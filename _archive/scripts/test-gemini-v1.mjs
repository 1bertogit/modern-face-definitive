/**
 * Script de teste para verificar se a API do Gemini está funcionando
 * Uso: node scripts/test-gemini.mjs
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";

// Carregar variáveis de ambiente
config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY não encontrada no arquivo .env");
  console.error("   Por favor, adicione GEMINI_API_KEY=sua_key no arquivo .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Modelos disponíveis (em ordem de preferência)
// Lista atualizada: node scripts/list-models-direct.mjs
const modelosParaTestar = [
  "gemini-2.5-flash",        // Mais recente e rápido
  "gemini-2.0-flash-001",    // Versão estável
  "gemini-2.5-pro",          // Mais poderoso
  "gemini-2.0-flash"         // Alternativa
];

async function testGemini() {
  console.log("🤖 Testando conexão com Gemini API...\n");
  
  const prompt = "Explique o que é cirurgia facial em 2 frases curtas.";
  console.log(`📝 Prompt: "${prompt}"\n`);
  
  // Tentar cada modelo até encontrar um que funcione
  for (const nomeModelo of modelosParaTestar) {
    try {
      console.log(`⏳ Tentando modelo: ${nomeModelo}...`);
      const model = genAI.getGenerativeModel({ model: nomeModelo });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log(`\n✅ Modelo ${nomeModelo} funcionando!\n`);
      console.log("📝 Resposta do Gemini:");
      console.log("─".repeat(60));
      console.log(text);
      console.log("─".repeat(60));
      console.log(`\n💡 Dica: Use o modelo "${nomeModelo}" nos seus scripts\n`);
      console.log("🎉 API do Gemini está funcionando corretamente!");
      return; // Sucesso, sair
      
    } catch (error) {
      // Se não for erro de modelo não encontrado, mostrar erro real
      if (!error.message.includes("not found") && !error.message.includes("404")) {
        console.error(`\n❌ Erro com modelo ${nomeModelo}:`);
        console.error(`   ${error.message}`);
        if (error.message.includes("API_KEY")) {
          console.error("\n💡 Dica: Verifique se sua API key está correta no arquivo .env");
        }
        process.exit(1);
      }
      // Se for erro 404, continuar tentando próximo modelo
      console.log(`   ❌ Modelo ${nomeModelo} não disponível`);
    }
  }
  
  // Se chegou aqui, nenhum modelo funcionou
  console.error("\n❌ Nenhum modelo funcionou. Possíveis causas:");
  console.error("   1. API key inválida ou expirada");
  console.error("   2. Modelos não disponíveis na sua região");
  console.error("   3. Versão da API desatualizada");
  console.error("\n💡 Tente verificar sua API key em: https://makersuite.google.com/app/apikey");
  process.exit(1);
}

testGemini();

