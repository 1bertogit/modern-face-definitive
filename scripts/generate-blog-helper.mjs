/**
 * Exemplo prático: Gerar conteúdo para blog usando Gemini
 * Uso: node scripts/generate-blog-helper.mjs
 */

import { generateContent, generateTitle, generateMetaDescription, generateKeywords } from "./gemini-helper.mjs";

async function exemploGerarConteudoBlog() {
  console.log("📝 Exemplo: Gerando conteúdo para blog com Gemini\n");
  
  const topico = "Endomidface por Visão Direta";
  
  console.log(`Tópico: ${topico}\n`);
  console.log("⏳ Gerando conteúdo...\n");
  
  try {
    // 1. Gerar título
    const titulo = await generateTitle(
      `Artigo sobre ${topico}, técnica cirúrgica facial para terço médio`,
      "technical"
    );
    console.log("📌 Título gerado:");
    console.log(`   ${titulo}\n`);
    
    // 2. Gerar meta description
    const descricao = await generateMetaDescription(
      titulo,
      `${topico} é uma técnica cirúrgica inovadora para rejuvenescimento facial que utiliza visão direta ao invés de endoscopia. Desenvolvida pelo Dr. Robério Brandão, oferece maior segurança e resultados mais previsíveis.`
    );
    console.log("🔍 Meta Description:");
    console.log(`   ${descricao}\n`);
    
    // 3. Gerar keywords
    const keywords = await generateKeywords(
      `Artigo sobre ${topico}, técnica cirúrgica facial, rejuvenescimento facial, cirurgia plástica`,
      6
    );
    console.log("🏷️  Keywords:");
    console.log(`   ${keywords.join(", ")}\n`);
    
    console.log("✅ Conteúdo gerado com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
}

// Executar exemplo
exemploGerarConteudoBlog();

