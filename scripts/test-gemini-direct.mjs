/**
 * Teste direto da API Gemini usando fetch (sem biblioteca)
 * Isso ajuda a diagnosticar se o problema é com a biblioteca ou com a API key
 */

import { config } from "dotenv";

config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY não encontrada no arquivo .env");
  process.exit(1);
}

async function testGeminiDirect() {
  console.log("🤖 Testando Gemini API diretamente (sem biblioteca)...\n");
  
  // Tentar v1 da API primeiro (mais estável)
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  
  const prompt = {
    contents: [{
      parts: [{
        text: "Explique o que é cirurgia facial em 2 frases curtas."
      }]
    }]
  };
  
  try {
    console.log("⏳ Enviando requisição para Gemini API...\n");
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("❌ Erro na API:");
      console.error(JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.error(`\n💡 Mensagem: ${data.error.message}`);
        if (data.error.message.includes("API_KEY")) {
          console.error("\n💡 Sua API key parece estar inválida ou expirada.");
          console.error("   Verifique em: https://makersuite.google.com/app/apikey");
        }
      }
      
      process.exit(1);
    }
    
    const text = data.candidates[0].content.parts[0].text;
    
    console.log("✅ API funcionando!\n");
    console.log("📝 Resposta do Gemini:");
    console.log("─".repeat(60));
    console.log(text);
    console.log("─".repeat(60));
    console.log("\n🎉 Sua API key está válida e funcionando!");
    console.log("💡 O problema pode estar na versão da biblioteca @google/generative-ai");
    console.log("   Tente atualizar: npm install @google/generative-ai@latest");
    
  } catch (error) {
    console.error("❌ Erro de conexão:");
    console.error(`   ${error.message}`);
    
    if (error.message.includes("fetch")) {
      console.error("\n💡 Problema de conexão com a internet ou bloqueio de firewall");
    }
  }
}

testGeminiDirect();

