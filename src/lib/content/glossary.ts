/**
 * Glossary content for all locales
 */
import type { Locale } from '../i18n';

export interface FeaturedTerm {
  term: string;
  category: string;
  subcategory: string;
  image: string;
  description: string;
  benefits?: string[];
  additionalText?: string;
}

export interface GlossaryTerm {
  term: string;
  letter: string;
  description: string;
  link: string;
  linkText: string;
}

export interface GlossaryContent {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  schema: {
    name: string;
    description: string;
  };
  featuredTerms: FeaturedTerm[];
  generalTerms: GlossaryTerm[];
}

// Shared images across locales
const images = {
  endomidface:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBOD1I0VavoO9gjtebVif1TUbP3jTBAm6yGlbkFS4WuOS3QJzBQ732HFcMFSu7jJjCup0D6kF51LPbDpSbnN-xZ2g7HPLf0Gr85juIQV_keDVQGDsCtFl9btsNb0EaBEg3gN8ZBviSzD8UKe4HGZ2-LLGe0pB8YzHW-ikEHDQ7perFssbUHxSrk1R6Kcj5Tygj_TA6gqSFNIfr2Uyt7FvOQuPOVrnBhnBvjmMlYQdO_Bxud5ppylArB1O6iCoKdBmIubrw492Oi0al0',
  smas: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz9Vyg5yG_NDXWWKIL-fhoPTUozsmHn-JQDoMV9IUAh84fNaUO52hi5YQZ0gV76dAxK4_FaZwUmiRt14HjICaOlA9eORWoOEOekriRArRBXr7Yw5sMxIuautBgzj16GowvD1BDP-NqDRXk6kVJEMnqMhFUvYcEGZhB8_rEeh1CAdNsUGVGheGqUOpQ0VM6DuM8xhGqMpyeBcgjvPX-Er4CmLuk1imMpJ4EHO6pK3_1bDw1_dRN2iQuYtevnX--DmfuPR32jc6oPRZR',
  deepPlane:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCC94_IMhLdoYq72GRbGw_rP4c306xRozVUFFCn9J9oy47sM-BpWM0ItGL6nmk5NYPfQyKw76HToIKWLWK8fOW2sW1aMohuyvt5OnmuHBEW2HJ5iXEW_U_aiWRBbT09rEqSoqMRCSysg285ohOS2vObDjlDloiw0J0Q9_FIbwb8rND5jrmI23iAKmK6tvuMr2tr3-lJ5HvNDRi29m15EdHRNrM3yPueLp4e-3A1caERn0vVMXb8acj6Kciwiv4wKPqXe-EkkfMAdg8n',
};

export const glossaryContent: Record<Locale, GlossaryContent> = {
  pt: {
    meta: {
      title: 'Glossário Face Moderna®',
      description:
        'Dicionário completo de termos técnicos da cirurgia facial moderna. Anatomia, técnicas e conceitos.',
      keywords: [
        'glossário cirurgia facial',
        'termos técnicos lifting',
        'SMAS definição',
        'Deep Neck glossário',
        'Endomidface significado',
      ],
    },
    schema: {
      name: 'Glossário Face Moderna®',
      description: 'Dicionário de termos técnicos da cirurgia facial moderna',
    },
    featuredTerms: [
      {
        term: 'Endomidface',
        category: 'Técnica Exclusiva',
        subcategory: 'Terço Médio',
        image: images.endomidface,
        description:
          'Técnica inovadora de rejuvenescimento do terço médio da face por <strong class="text-[#1e293b] font-medium">visão direta</strong>, desenvolvida e aprimorada pelo Dr. Robério Brandão.',
        benefits: [
          'Correção do sulco nasogeniano (bigode chinês) de forma eficaz.',
          'Elevação da maçã do rosto (região malar), restaurando o contorno jovem da face.',
          'Menor tempo de recuperação comparado a liftings faciais mais invasivos.',
          'Resultados naturais sem o aspecto "esticado" ou artificial.',
        ],
      },
      {
        term: 'SMAS (Sistema Musculoaponeurótico Superficial)',
        category: 'Anatomia',
        subcategory: 'Estrutura de Sustentação',
        image: images.smas,
        description:
          'O SMAS é uma camada contínua e organizada de tecido fibroso e muscular que conecta os músculos da face e do pescoço à pele.',
        additionalText:
          'Ao tracionar e reposicionar o SMAS e não apenas a pele, o cirurgião consegue um resultado que aborda a causa subjacente da flacidez facial e cervical.',
      },
      {
        term: 'Deep Plane Facelift',
        category: 'Técnica Cirúrgica',
        subcategory: 'Avançado',
        image: images.deepPlane,
        description:
          'O Deep Plane Facelift (Lifting em Plano Profundo) é considerado o padrão ouro em rejuvenescimento facial.',
        additionalText:
          'Ao contrário de outras técnicas que apenas esticam a pele ou o SMAS superficialmente, o Deep Plane lida com as camadas mais profundas.',
      },
    ],
    generalTerms: [
      {
        term: 'Blefaroplastia',
        letter: 'B',
        description:
          'Cirurgia plástica das pálpebras destinada a remover o excesso de pele e bolsas de gordura.',
        link: '#blefaroplastia',
        linkText: 'Ver detalhes',
      },
      {
        term: 'Browlift',
        letter: 'B',
        description:
          'Lifting de sobrancelhas. Técnica para reposicionar o terço superior, abrindo o olhar.',
        link: '/tecnicas',
        linkText: 'Ver técnica',
      },
      {
        term: 'Deep Neck',
        letter: 'D',
        description:
          'Abordagem avançada do pescoço que trata as estruturas profundas para definir o ângulo cervico-mental.',
        link: '/tecnicas',
        linkText: 'Ver técnica',
      },
      {
        term: 'Face Moderna®',
        letter: 'F',
        description:
          'Conceito integrado desenvolvido pelo Dr. Robério Brandão que une técnicas cirúrgicas de visão direta.',
        link: '/face-moderna',
        linkText: 'Conhecer filosofia',
      },
      {
        term: 'Platisma',
        letter: 'P',
        description:
          'Músculo superficial do pescoço. Com o envelhecimento, pode formar bandas verticais.',
        link: '#platisma',
        linkText: 'Ver detalhes',
      },
      {
        term: 'SMAS',
        letter: 'S',
        description:
          'Sistema Musculoaponeurótico Superficial - estrutura fundamental manipulada durante facelift moderno.',
        link: '#smas',
        linkText: 'Ver detalhes',
      },
      {
        term: 'Vetor Vertical',
        letter: 'V',
        description:
          'Direção de tração dos tecidos que combate a gravidade diretamente, evitando o aspecto "esticado".',
        link: '/face-moderna',
        linkText: 'Conhecer conceito',
      },
      {
        term: 'Visão Direta',
        letter: 'V',
        description:
          'Filosofia cirúrgica que prioriza a visualização direta das estruturas anatômicas.',
        link: '/face-moderna',
        linkText: 'Conhecer filosofia',
      },
    ],
  },
  en: {
    meta: {
      title: 'Modern Face® Glossary',
      description:
        'Complete dictionary of modern facial surgery technical terms. Anatomy, techniques and concepts.',
      keywords: [
        'facial surgery glossary',
        'facelift terms',
        'SMAS definition',
        'Deep Neck glossary',
        'Endomidface meaning',
      ],
    },
    schema: {
      name: 'Modern Face® Glossary',
      description: 'Dictionary of modern facial surgery technical terms',
    },
    featuredTerms: [
      {
        term: 'Endomidface',
        category: 'Exclusive Technique',
        subcategory: 'Midface',
        image: images.endomidface,
        description:
          'Innovative midface rejuvenation technique using <strong class="text-[#1e293b] font-medium">direct vision</strong>, developed by Dr. Robério Brandão.',
        benefits: [
          'Effective correction of nasolabial fold.',
          'Cheekbone elevation (malar region), restoring youthful facial contour.',
          'Shorter recovery time compared to more invasive facelifts.',
          'Natural results without the "pulled" or artificial appearance.',
        ],
      },
      {
        term: 'SMAS (Superficial Musculoaponeurotic System)',
        category: 'Anatomy',
        subcategory: 'Support Structure',
        image: images.smas,
        description:
          'The SMAS is a continuous, organized layer of fibrous and muscular tissue connecting facial and neck muscles to the skin.',
        additionalText:
          'By repositioning the SMAS rather than just the skin, surgeons address the underlying cause of facial and cervical sagging.',
      },
      {
        term: 'Deep Plane Facelift',
        category: 'Surgical Technique',
        subcategory: 'Advanced',
        image: images.deepPlane,
        description:
          'The Deep Plane Facelift is considered the gold standard in facial rejuvenation.',
        additionalText:
          'Unlike techniques that only stretch the skin or superficial SMAS, Deep Plane addresses deeper layers.',
      },
    ],
    generalTerms: [
      {
        term: 'Blepharoplasty',
        letter: 'B',
        description: 'Eyelid surgery to remove excess skin and fat pockets.',
        link: '#blepharoplasty',
        linkText: 'See details',
      },
      {
        term: 'Browlift',
        letter: 'B',
        description: 'Eyebrow lift technique to reposition the upper third, opening the gaze.',
        link: '/techniques',
        linkText: 'See technique',
      },
      {
        term: 'Deep Neck',
        letter: 'D',
        description:
          'Advanced neck approach treating deep structures to define the cervicomental angle.',
        link: '/techniques',
        linkText: 'See technique',
      },
      {
        term: 'Modern Face®',
        letter: 'M',
        description:
          'Integrated concept developed by Dr. Robério Brandão combining direct vision surgical techniques.',
        link: '/modern-face',
        linkText: 'Learn philosophy',
      },
      {
        term: 'Platysma',
        letter: 'P',
        description: 'Superficial neck muscle. With aging, it can form vertical bands.',
        link: '#platysma',
        linkText: 'See details',
      },
      {
        term: 'SMAS',
        letter: 'S',
        description:
          'Superficial Musculoaponeurotic System - fundamental structure manipulated during modern facelift.',
        link: '#smas',
        linkText: 'See details',
      },
      {
        term: 'Vertical Vector',
        letter: 'V',
        description:
          'Tissue traction direction that combats gravity directly, avoiding the "pulled" look.',
        link: '/modern-face',
        linkText: 'Learn concept',
      },
      {
        term: 'Direct Vision',
        letter: 'D',
        description:
          'Surgical philosophy prioritizing direct visualization of anatomical structures.',
        link: '/modern-face',
        linkText: 'Learn philosophy',
      },
    ],
  },
  es: {
    meta: {
      title: 'Glosario Face Moderna®',
      description:
        'Diccionario completo de términos técnicos de cirugía facial moderna. Anatomía, técnicas y conceptos.',
      keywords: [
        'glosario cirugía facial',
        'términos lifting',
        'SMAS definición',
        'Deep Neck glosario',
        'Endomidface significado',
      ],
    },
    schema: {
      name: 'Glosario Face Moderna®',
      description: 'Diccionario de términos técnicos de cirugía facial moderna',
    },
    featuredTerms: [
      {
        term: 'Endomidface',
        category: 'Técnica Exclusiva',
        subcategory: 'Tercio Medio',
        image: images.endomidface,
        description:
          'Técnica innovadora de rejuvenecimiento del tercio medio facial por <strong class="text-[#1e293b] font-medium">visión directa</strong>, desarrollada por Dr. Robério Brandão.',
        benefits: [
          'Corrección eficaz del surco nasogeniano.',
          'Elevación del pómulo (región malar), restaurando el contorno facial joven.',
          'Menor tiempo de recuperación comparado con liftings más invasivos.',
          'Resultados naturales sin aspecto "estirado" o artificial.',
        ],
      },
      {
        term: 'SMAS (Sistema Músculo-Aponeurótico Superficial)',
        category: 'Anatomía',
        subcategory: 'Estructura de Soporte',
        image: images.smas,
        description:
          'El SMAS es una capa continua y organizada de tejido fibroso y muscular que conecta los músculos faciales y cervicales a la piel.',
        additionalText:
          'Al reposicionar el SMAS en lugar de solo la piel, el cirujano aborda la causa subyacente de la flacidez facial y cervical.',
      },
      {
        term: 'Deep Plane Facelift',
        category: 'Técnica Quirúrgica',
        subcategory: 'Avanzado',
        image: images.deepPlane,
        description:
          'El Deep Plane Facelift (Lifting en Plano Profundo) es considerado el estándar de oro en rejuvenecimiento facial.',
        additionalText:
          'A diferencia de técnicas que solo estiran la piel o el SMAS superficialmente, el Deep Plane trabaja las capas más profundas.',
      },
    ],
    generalTerms: [
      {
        term: 'Blefaroplastia',
        letter: 'B',
        description: 'Cirugía de párpados para eliminar exceso de piel y bolsas de grasa.',
        link: '#blefaroplastia',
        linkText: 'Ver detalles',
      },
      {
        term: 'Browlift',
        letter: 'B',
        description:
          'Lifting de cejas. Técnica para reposicionar el tercio superior, abriendo la mirada.',
        link: '/es/tecnicas',
        linkText: 'Ver técnica',
      },
      {
        term: 'Deep Neck',
        letter: 'D',
        description:
          'Abordaje avanzado del cuello que trata estructuras profundas para definir el ángulo cervicomental.',
        link: '/es/tecnicas',
        linkText: 'Ver técnica',
      },
      {
        term: 'Face Moderna®',
        letter: 'F',
        description:
          'Concepto integrado desarrollado por Dr. Robério Brandão que une técnicas quirúrgicas de visión directa.',
        link: '/es/face-moderna',
        linkText: 'Conocer filosofía',
      },
      {
        term: 'Platisma',
        letter: 'P',
        description:
          'Músculo superficial del cuello. Con el envejecimiento, puede formar bandas verticales.',
        link: '#platisma',
        linkText: 'Ver detalles',
      },
      {
        term: 'SMAS',
        letter: 'S',
        description:
          'Sistema Músculo-Aponeurótico Superficial - estructura fundamental manipulada en facelift moderno.',
        link: '#smas',
        linkText: 'Ver detalles',
      },
      {
        term: 'Vector Vertical',
        letter: 'V',
        description:
          'Dirección de tracción de tejidos que combate la gravedad directamente, evitando el aspecto "estirado".',
        link: '/es/face-moderna',
        linkText: 'Conocer concepto',
      },
      {
        term: 'Visión Directa',
        letter: 'V',
        description:
          'Filosofía quirúrgica que prioriza la visualización directa de estructuras anatómicas.',
        link: '/es/face-moderna',
        linkText: 'Conocer filosofía',
      },
    ],
  },
};

export function getGlossarySchema(locale: Locale) {
  const content = glossaryContent[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: content.schema.name,
    description: content.schema.description,
  };
}
