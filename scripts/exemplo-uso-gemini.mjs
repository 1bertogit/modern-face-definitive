/**
 * EXEMPLOS PRÁTICOS de como usar o Gemini no projeto
 * Execute: node scripts/exemplo-uso-gemini.mjs
 */

import { 
  generateContent, 
  translateText, 
  summarizeText,
  generateTitle,
  generateMetaDescription,
  generateKeywords 
} from "./gemini-helper.mjs";

async function exemplo1_GerarConteudo() {
  console.log("📝 Exemplo 1: Gerar conteúdo sobre uma técnica\n");
  
  const prompt = `
Escreva um parágrafo introdutório (3-4 frases) sobre a técnica Endomidface.
Contexto: Blog médico sobre cirurgia facial.
Estilo: Profissional, técnico mas acessível para cirurgiões plásticos.
`;
  
  const conteudo = await generateContent(prompt);
  console.log(conteudo);
  console.log("\n" + "─".repeat(60) + "\n");
}

async function exemplo2_Traduzir() {
  console.log("🌍 Exemplo 2: Traduzir conteúdo\n");
  
  const textoPT = "A técnica Endomidface utiliza visão direta ao invés de endoscopia.";
  
  console.log("📌 Português:", textoPT);
  
  const textoEN = await translateText(textoPT, "en");
  console.log("📌 Inglês:", textoEN);
  
  const textoES = await translateText(textoPT, "es");
  console.log("📌 Espanhol:", textoES);
  
  console.log("\n" + "─".repeat(60) + "\n");
}

async function exemplo3_Resumir() {
  console.log("📋 Exemplo 3: Resumir texto longo\n");
  
  const textoLongo = `
A técnica Endomidface foi desenvolvida pelo Dr. Robério Brandão como uma alternativa 
à endoscopia tradicional. Utiliza visão direta através de incisões pequenas, oferecendo 
maior segurança ao trabalhar no plano subperiósteo. A técnica é especialmente indicada 
para pacientes que já receberam bioestimuladores, pois respeita a anatomia alterada. 
O aprendizado é mais rápido que técnicas endoscópicas e não requer equipamentos caros.
`;
  
  console.log("📄 Texto original:", textoLongo.substring(0, 100) + "...\n");
  
  const resumo = await summarizeText(textoLongo, 30);
  console.log("📝 Resumo (30 palavras):", resumo);
  
  console.log("\n" + "─".repeat(60) + "\n");
}

async function exemplo4_GerarTitulo() {
  console.log("📌 Exemplo 4: Gerar título para artigo\n");
  
  const conteudo = `
Artigo sobre a técnica Endomidface por Visão Direta, desenvolvida pelo Dr. Robério Brandão.
Aborda indicações, contraindicações, técnica cirúrgica passo a passo, e comparação com 
outras técnicas de rejuvenescimento facial.
`;
  
  const titulo = await generateTitle(conteudo, "technical");
  console.log("✅ Título gerado:", titulo);
  
  console.log("\n" + "─".repeat(60) + "\n");
}

async function exemplo5_SeoCompleto() {
  console.log("🔍 Exemplo 5: Gerar SEO completo (título + meta + keywords)\n");
  
  const conteudo = `
Artigo completo sobre Deep Neck, técnica de rejuvenescimento cervical que inclui
platismorrafia, shaving digástrico e alça glandular. Desenvolvida para preservar
a glândula submandibular enquanto redefine o contorno cervical.
`;
  
  console.log("⏳ Gerando SEO completo...\n");
  
  const titulo = await generateTitle(conteudo, "descriptive");
  const metaDesc = await generateMetaDescription(titulo, conteudo);
  const keywords = await generateKeywords(conteudo, 5);
  
  console.log("📌 Título:", titulo);
  console.log("\n📝 Meta Description:", metaDesc);
  console.log("\n🏷️  Keywords:", keywords.join(", "));
  
  console.log("\n" + "─".repeat(60) + "\n");
}

async function exemplo6_UsoPersonalizado() {
  console.log("🎯 Exemplo 6: Uso personalizado - Analisar código\n");
  
  const prompt = `
Analise este código JavaScript e sugira melhorias:
\`\`\`javascript
function soma(a, b) {
  return a + b;
}
\`\`\`
`;
  
  const analise = await generateContent(prompt);
  console.log(analise);
  
  console.log("\n" + "─".repeat(60) + "\n");
}

// Executar todos os exemplos
async function main() {
  console.log("🚀 Exemplos Práticos de Uso do Gemini\n");
  console.log("=" .repeat(60) + "\n");
  
  try {
    await exemplo1_GerarConteudo();
    await exemplo2_Traduzir();
    await exemplo3_Resumir();
    await exemplo4_GerarTitulo();
    await exemplo5_SeoCompleto();
    await exemplo6_UsoPersonalizado();
    
    console.log("✅ Todos os exemplos executados com sucesso!\n");
    console.log("💡 Dica: Veja scripts/gemini-helper.mjs para todas as funções disponíveis");
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

main();

