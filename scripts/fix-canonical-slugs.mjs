#!/usr/bin/env node
/**
 * Script para unificar canonicalSlug entre posts traduzidos
 * Isso permite que o seletor de idioma funcione corretamente
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, '../src/content/blog');

// Mapeamento semântico de posts equivalentes entre idiomas
// Chave: canonicalSlug unificado (usando EN como base)
// Valor: slugs em cada idioma
const postMappings = {
  // Anatomia SMAS
  'smas-anatomy-fundamentals': {
    en: 'smas-anatomy-fundamentals',
    pt: 'anatomia-smas-fundamentos',
    es: 'anatomia-smas-fundamentos'
  },
  // What is Modern Face
  'what-is-modern-face': {
    en: 'what-is-modern-face',
    pt: 'o-que-e-face-moderna',
    es: 'que-es-face-moderna'
  },
  // Biostimulators
  'biostimulators-facial-surgery': {
    en: 'biostimulators-facial-surgery',
    pt: 'bioestimuladores-cirurgia-facial',
    es: 'bioestimuladores-cirugia-facial'
  },
  // Deep Neck Guide
  'deep-neck-complete-guide': {
    en: 'deep-neck-complete-guide',
    pt: 'deep-neck-guia-completo',
    es: 'deep-neck-guia-completo'
  },
  // Deep Neck Preserving Gland
  'deep-neck-preserving-submandibular': {
    en: 'deep-neck-preserving-submandibular',
    pt: 'deep-neck-preservando-glandula-submandibular',
    es: 'deep-neck-preservando-glandula-submandibular'
  },
  // Endomidface Guide
  'endomidface-complete-guide': {
    en: 'endomidface-complete-guide',
    pt: 'endomidface-guia-completo',
    es: 'endomidface-guia-completo'
  },
  // Endomidface Direct Vision
  'endomidface-direct-vision-technique': {
    en: 'endomidface-direct-vision-technique',
    pt: 'endomidface-por-visao-direta-tecnica',
    es: 'endomidface-por-vision-directa-tecnica'
  },
  // Endomidface vs Deep Plane
  'endomidface-vs-deep-plane': {
    en: 'endomidface-vs-deep-plane',
    pt: 'endomidface-vs-deep-plane',
    es: 'endomidface-vs-deep-plane'
  },
  // Endomidface Candidates
  'endomidface-ideal-candidates': {
    en: 'endomidface-ideal-candidates',
    pt: 'indicacoes-endomidface-casos-ideais',
    es: 'indicaciones-endomidface-casos-ideales'
  },
  // Dr Roberio Creator
  'dr-roberio-brandao-creator-endomidface': {
    en: 'dr-roberio-brandao-creator-endomidface',
    pt: 'dr-roberio-brandao-criador-endomidface',
    es: 'dr-roberio-brandao-creador-endomidface'
  },
  // Become Modern Face Surgeon
  'become-modern-face-surgeon': {
    en: 'become-modern-face-surgeon',
    pt: 'como-se-tornar-cirurgiao-face-moderna',
    es: 'convertirse-cirujano-face-moderna'
  },
  // Browlift Direct Vision
  'browlift-direct-vision-evolutionary-frontoplasty': {
    en: 'browlift-direct-vision-evolutionary-frontoplasty',
    pt: 'browlift-visao-direta-frontoplastia-evolutiva',
    es: 'browlift-vision-directa-frontoplastia'
  },
  // Frontoplasty Guide
  'frontoplasty-browlift-complete-guide': {
    en: 'frontoplasty-browlift-complete-guide',
    pt: 'frontoplastia-browlift-guia-completo',
    es: 'frontoplastia-browlift-guia-completo'
  },
  // Deep Plane Without Endoscope
  'deep-plane-without-endoscope': {
    en: 'deep-plane-without-endoscope',
    pt: 'deep-plane-sem-endoscopio-alternativa',
    es: 'deep-plane-sin-endoscopio-alternativa'
  },
  // Facelift Recovery Timeline
  'facelift-recovery-timeline': {
    en: 'facelift-recovery-timeline',
    pt: 'recuperacao-lifting-timeline',
    es: 'recuperacion-post-lifting-timeline'
  },
  // Facelift Complications
  'facelift-complications-prevention': {
    en: 'facelift-complications-prevention',
    pt: 'complicacoes-lifting-facial-prevencao',
    es: 'complicaciones-lifting-facial-prevencion'
  },
  // Facelift Contraindications
  'facelift-contraindications': {
    en: 'facelift-contraindications',
    pt: 'contraindicacoes-lifting-facial',
    es: 'contraindicaciones-lifting-facial'
  },
  // Facelift Learning Curve
  'facelift-learning-curve': {
    en: 'facelift-learning-curve',
    pt: 'curva-aprendizado-lifting-facial',
    es: 'curva-aprendizaje-lifting-facial'
  },
  // Facelift Cost Benefit
  'facelift-cost-benefit': {
    en: 'facelift-cost-benefit',
    pt: 'custo-beneficio-lifting-facial',
    es: 'costo-beneficio-lifting-facial'
  },
  // Facelift Scar Care
  'facelift-scar-care': {
    en: 'facelift-scar-care',
    pt: 'cicatriz-lifting-facial-cuidados',
    es: 'cicatriz-lifting-facial-cuidados'
  },
  // Facelift At 40
  'facelift-at-40': {
    en: 'facelift-at-40',
    pt: 'lifting-facial-40-anos',
    es: 'lifting-facial-40-anos'
  },
  // Facelift At 60
  'facelift-at-60': {
    en: 'facelift-at-60',
    pt: 'lifting-facial-60-anos',
    es: 'lifting-facial-60-anos'
  },
  // Facelift After Weight Loss
  'facelift-after-weight-loss': {
    en: 'facelift-after-weight-loss',
    pt: 'lifting-facial-apos-perda-peso',
    es: 'lifting-facial-despues-perdida-peso'
  },
  // Facelift Smokers
  'facelift-smokers': {
    en: 'facelift-smokers',
    pt: 'lifting-facial-fumantes',
    es: 'lifting-facial-fumadores'
  },
  // Facelift Diabetic
  'facelift-diabetic-patients': {
    en: 'facelift-diabetic-patients',
    pt: 'lifting-facial-diabeticos',
    es: 'lifting-facial-diabeticos'
  },
  // Facelift vs Fillers
  'facelift-vs-fillers': {
    en: 'facelift-vs-fillers',
    pt: 'lifting-facial-vs-preenchedores',
    es: 'lifting-facial-vs-rellenos'
  },
  // Facelift Hematoma
  'facelift-hematoma-prevention': {
    en: 'facelift-hematoma-prevention',
    pt: 'hematoma-lifting-facial-prevencao',
    es: 'hematoma-lifting-facial-prevencion'
  },
  // Facelift Self Esteem
  'facelift-self-esteem-psychology': {
    en: 'facelift-self-esteem-psychology',
    pt: 'lifting-facial-autoestima-psicologia',
    es: 'lifting-facial-autoestima-psicologia'
  },
  // Facelift Myths
  'facelift-myths-truths': {
    en: 'facelift-myths-truths',
    pt: 'mitos-lifting-facial-verdades',
    es: 'mitos-lifting-facial-verdades'
  },
  // Facelift Recovery Nutrition
  'facelift-recovery-nutrition': {
    en: 'facelift-recovery-nutrition',
    pt: 'alimentacao-recuperacao-lifting',
    es: 'alimentacion-recuperacion-lifting'
  },
  // Facelift Result Duration
  'facelift-result-duration': {
    en: 'facelift-result-duration',
    pt: 'tempo-duracao-resultado-lifting',
    es: 'tiempo-duracion-resultado-lifting'
  },
  // Facelift Consultation Questions
  'facelift-consultation-questions': {
    en: 'facelift-consultation-questions',
    pt: 'perguntas-consulta-lifting-facial',
    es: 'preguntas-consulta-lifting'
  },
  // Facelift History Evolution
  'facelift-history-evolution': {
    en: 'facelift-history-evolution',
    pt: 'historia-lifting-facial-evolucao',
    es: 'historia-lifting-facial-evolucion'
  },
  // History Facial Surgery
  'history-facial-surgery-evolution': {
    en: 'history-facial-surgery-evolution',
    pt: 'historia-cirurgia-facial-evolucao',
    es: 'historia-cirugia-facial-evolucion'
  },
  // Choosing Facelift Surgeon
  'choosing-facelift-surgeon': {
    en: 'choosing-facelift-surgeon',
    pt: 'escolhendo-cirurgiao-lifting-facial',
    es: 'elegir-cirujano-lifting-facial'
  },
  // Before After Photos
  'before-after-photos-importance': {
    en: 'before-after-photos-importance',
    pt: 'fotos-antes-depois-importancia',
    es: 'importancia-fotos-antes-despues'
  },
  // Blepharoplasty Facelift
  'blepharoplasty-facelift-combined': {
    en: 'blepharoplasty-facelift-combined',
    pt: 'blefaroplastia-lifting-combinados',
    es: 'blefaroplastia-lifting-combinados'
  },
  // Cervicomental Angle
  'cervicomental-angle-definition': {
    en: 'cervicomental-angle-definition',
    pt: 'angulo-cervicomental-definicao',
    es: 'angulo-cervicomental-definicion'
  },
  // Platysmal Bands
  'platysmal-bands-correction': {
    en: 'platysmal-bands-correction',
    pt: 'bandas-platismais-correcao',
    es: 'bandas-platismales-correccion'
  },
  // Facial Fat Aging
  'facial-fat-aging-compartments': {
    en: 'facial-fat-aging-compartments',
    pt: 'gordura-facial-envelhecimento-compartimentos',
    es: 'grasa-facial-envejecimiento-compartimentos'
  },
  // Facial Fat Aging Simple
  'facial-fat-aging': {
    en: 'facial-fat-aging',
    pt: 'gordura-facial-envelhecimento',
    es: 'grasa-facial-envejecimiento'
  },
  // Deep Plane Facial Surgery
  'deep-plane-facial-surgery': {
    en: 'deep-plane-facial-surgery',
    pt: 'plano-profundo-cirurgia-facial',
    es: 'plano-profundo-cirugia-facial'
  },
  // Facelift Injected Face
  'facelift-injected-face-biostimulators': {
    en: 'facelift-injected-face-biostimulators',
    pt: 'lifting-face-injetada-bioestimuladores',
    es: 'lifting-rostro-inyectado-bioestimuladores'
  },
  // Facelift Without Equipment
  'facelift-without-expensive-equipment': {
    en: 'facelift-without-expensive-equipment',
    pt: 'lifting-sem-equipamento-caro',
    es: 'lifting-sin-equipamiento-caro'
  },
  // Facial Exercises Myth
  'facial-exercises-facelift-myth': {
    en: 'facial-exercises-facelift-myth',
    pt: 'exercicios-faciais-lifting-mito',
    es: 'ejercicios-faciales-lifting-mito'
  },
  // Numbness Post Facelift
  'numbness-sensitivity-post-facelift': {
    en: 'numbness-sensitivity-post-facelift',
    pt: 'dormencia-sensibilidade-pos-lifting',
    es: 'dormencia-sensibilidad-post-lifting'
  },
  // Massage Drainage Post Facelift
  'massage-drainage-post-facelift': {
    en: 'massage-drainage-post-facelift',
    pt: 'massagem-facial-drenagem-pos-lifting',
    es: 'masaje-facial-drenaje-post-lifting'
  },
  // Mini Facelift vs Full
  'mini-facelift-vs-full-facelift': {
    en: 'mini-facelift-vs-full-facelift',
    pt: 'mini-lifting-vs-lifting-completo',
    es: 'mini-lifting-vs-lifting-completo'
  },
  // When See Final Result
  'when-see-final-facelift-result': {
    en: 'when-see-final-facelift-result',
    pt: 'quando-ver-resultado-final-lifting',
    es: 'cuando-ver-resultado-final-lifting'
  },
  // Skincare Post Facelift
  'skincare-post-facelift': {
    en: 'skincare-post-facelift',
    pt: 'skincare-pos-lifting',
    es: 'skincare-post-lifting'
  },
  // Facelift Trends 2025
  'facial-surgery-trends-2025': {
    en: 'facial-surgery-trends-2025',
    pt: 'tendencias-cirurgia-facial-2025',
    es: 'tendencias-cirugia-facial-2025'
  },
  // Ultrasound vs Facelift
  'microfocused-ultrasound-vs-facelift': {
    en: 'microfocused-ultrasound-vs-facelift',
    pt: 'ultrassom-microfocado-vs-lifting',
    es: 'ultrasonido-microfocalizado-vs-lifting'
  },
  // Vertical vs Lateral Vector
  'vertical-vs-lateral-vector-facelift': {
    en: 'vertical-vs-lateral-vector-facelift',
    pt: 'vetor-vertical-vs-lateral-lifting',
    es: 'vector-vertical-vs-lateral-lifting'
  },
  // Modern Face Concept
  'modern-face-concept-philosophy': {
    en: 'modern-face-concept-philosophy',
    pt: 'face-moderna-conceito-filosofia',
    es: 'face-moderna-concepto-filosofia'
  },
  // Institute About
  'modern-face-institute-about': {
    en: 'modern-face-institute-about',
    pt: 'instituto-face-moderna-sobre',
    es: 'instituto-face-moderna-sobre'
  },
  // Patient Selection
  'patient-selection-facial-surgery': {
    en: 'patient-selection-facial-surgery',
    pt: 'selecao-pacientes-cirurgia-facial',
    es: 'seleccion-pacientes-cirugia-facial'
  },
  // Complete Surgical Planning
  'complete-facial-surgery-planning': {
    en: 'complete-facial-surgery-planning',
    pt: 'planejamento-cirurgico-facial-completo',
    es: 'planificacion-quirurgica-facial-completa'
  },
  // Preoperative Planning
  'preoperative-facelift-planning': {
    en: 'preoperative-facelift-planning',
    pt: 'planejamento-pre-operatorio-lifting',
    es: 'planificacion-preoperatoria-lifting'
  },
  // Local Anesthesia
  'local-anesthesia-facial-surgery': {
    en: 'local-anesthesia-facial-surgery',
    pt: 'anestesia-local-cirurgia-facial',
    es: 'anestesia-local-cirugia-facial'
  },
  // Technology Facial Surgery
  'technology-facial-surgery-modern': {
    en: 'technology-facial-surgery-modern',
    pt: 'tecnologia-cirurgia-facial-moderna',
    es: 'tecnologia-cirugia-facial-moderna'
  },
  // Natural Results
  'natural-results-facelift': {
    en: 'natural-results-facelift',
    pt: 'resultados-naturais-lifting-facial',
    es: 'resultados-naturales-lifting-facial'
  },
  // Facelift Male
  'facelift-male-differences': {
    en: 'facelift-male-differences',
    pt: 'lifting-facial-masculino-diferencas',
    es: 'lifting-facial-masculino-diferencias'
  },
  // Second Facelift
  'second-facelift-revision': {
    en: 'second-facelift-revision',
    pt: 'lifting-facial-segunda-vez-revisao',
    es: 'lifting-facial-segunda-vez-revision'
  },
  // First Facelift 50
  'first-facelift-50-years': {
    en: 'first-facelift-50-years',
    pt: 'primeiro-lifting-50-anos-guia',
    es: 'primer-lifting-50-anos-guia'
  },
  // Lymphatic Drainage
  'lymphatic-drainage-post-facelift': {
    en: 'lymphatic-drainage-post-facelift',
    pt: 'drenagem-linfatica-pos-lifting-facial',
    es: 'drenaje-linfatico-post-lifting-facial'
  },
  // Edema Evolution
  'edema-swelling-post-facelift-evolution': {
    en: 'edema-swelling-post-facelift-evolution',
    pt: 'edema-inchaco-pos-lifting-evolucao',
    es: 'edema-hinchazon-post-lifting-evolucion'
  },
  // Retaining Ligaments
  'facial-retaining-ligaments': {
    en: 'facial-retaining-ligaments',
    pt: 'ligamentos-retentores-faciais',
    es: 'ligamentos-retentores-faciales'
  },
  // Facial Nerve Protection
  'facial-nerve-surgery-protection': {
    en: 'facial-nerve-surgery-protection',
    pt: 'nervo-facial-cirurgia-protecao',
    es: 'nervio-facial-cirugia-proteccion'
  },
  // Pre-zygomatic Space
  'prezygomatic-space-anatomy': {
    en: 'prezygomatic-space-anatomy',
    pt: 'espaco-pre-zigomatico-anatomia',
    es: 'espacio-pre-zigomatico-anatomia'
  },
  // Jowls Treatment
  'jowls-treatment': {
    en: 'jowls-treatment',
    pt: 'tratamento-jowls-papada',
    es: 'tratamiento-jowls-papada'
  },
  // Malar Ptosis
  'malar-ptosis-treatment': {
    en: 'malar-ptosis-treatment',
    pt: 'tratamento-ptose-malar',
    es: 'tratamiento-ptosis-malar'
  },
  // Nasolabial Fold
  'nasolabial-fold-correction': {
    en: 'nasolabial-fold-correction',
    pt: 'correcao-sulco-nasogeniano',
    es: 'correccion-surco-nasogeniano'
  },
  // SMAS What Is
  'smas-what-is-importance': {
    en: 'smas-what-is-importance',
    pt: 'smas-o-que-e-importancia',
    es: 'smas-que-es-importancia'
  },
  // Fat Grafting
  'fat-grafting-facelift': {
    en: 'fat-grafting-facelift',
    pt: 'fat-grafting-lifting-facial',
    es: 'fat-grafting-lifting-facial'
  },
  // PDO Threads
  'pdo-threads-vs-surgical-facelift': {
    en: 'pdo-threads-vs-surgical-facelift',
    pt: 'fios-pdo-vs-lifting-cirurgico',
    es: 'hilos-pdo-vs-lifting-quirurgico'
  },
};

// Gerar o mapeamento para paths.ts
function generateBlogSlugTranslations() {
  const result = {};
  
  for (const [canonical, slugs] of Object.entries(postMappings)) {
    // Usar o slug EN como chave no mapeamento
    const enSlug = slugs.en;
    result[enSlug] = {
      en: slugs.en,
      'pt': slugs.pt,
      es: slugs.es
    };
    
    // Também mapear os slugs PT e ES para o mesmo canonical
    if (slugs.pt !== slugs.en) {
      result[slugs.pt] = {
        en: slugs.en,
        'pt': slugs.pt,
        es: slugs.es
      };
    }
    if (slugs.es !== slugs.en && slugs.es !== slugs.pt) {
      result[slugs.es] = {
        en: slugs.en,
        'pt': slugs.pt,
        es: slugs.es
      };
    }
  }
  
  return result;
}

// Atualizar canonicalSlug nos arquivos MDX
function updateCanonicalSlug(filePath, newCanonicalSlug) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const updated = content.replace(
    /canonicalSlug:\s*["']([^"']+)["']/,
    `canonicalSlug: "${newCanonicalSlug}"`
  );
  
  if (content !== updated) {
    fs.writeFileSync(filePath, updated);
    return true;
  }
  return false;
}

// Main
console.log('🔄 Gerando mapeamento de slugs para paths.ts...\n');

const blogSlugTranslations = generateBlogSlugTranslations();

console.log('/**');
console.log(' * Blog path mapping - maps slug to localized slugs');
console.log(' * Auto-generated by fix-canonical-slugs.mjs');
console.log(' */');
console.log('const blogSlugTranslations: Record<string, Record<Locale, string>> = {');

for (const [slug, translations] of Object.entries(blogSlugTranslations)) {
  console.log(`  '${slug}': {`);
  console.log(`    en: '${translations.en}',`);
  console.log(`    'pt': '${translations['pt']}',`);
  console.log(`    es: '${translations.es}'`);
  console.log('  },');
}

console.log('};');

console.log('\n✅ Copie o código acima para src/lib/i18n/paths.ts');

