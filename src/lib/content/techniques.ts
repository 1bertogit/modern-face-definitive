/**
 * Techniques page content centralized for all locales
 */
import type { Locale } from '@lib/i18n';

interface TechniqueStat {
  label: string;
  value: string;
}

interface Technique {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  stats: TechniqueStat[];
  image: string;
}

interface TechniquesContent {
  hero: {
    label: string;
    title: string;
    subtitle: string;
  };
  learnButton: string;
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  techniques: Technique[];
  trainingPath: string;
}

export const techniquesContent: Record<Locale, TechniquesContent> = {
  'pt': {
    hero: {
      label: 'Técnicas',
      title: 'Excelência em Cada Procedimento',
      subtitle:
        'Três técnicas integradas que formam o pilar da metodologia Face Moderna®. Segurança, naturalidade e resultados duradouros.',
    },
    learnButton: 'Aprender Esta Técnica',
    cta: {
      title: 'Domine Todas as Técnicas',
      subtitle: 'Na formação Face Moderna®, você aprende todas as técnicas de forma integrada.',
      button: 'Iniciar Formação',
    },
    techniques: [
      {
        id: 'endomidface',
        title: 'Endomidface por Visão Direta',
        subtitle: 'Rejuvenescimento do terço médio sem vídeo',
        description:
          'A técnica revolucionária que permite tratar o terço médio da face com segurança absoluta, visualização direta das estruturas e sem a necessidade de equipamentos endoscópicos caros.',
        benefits: [
          'Visão direta das estruturas nobres',
          'Curva de aprendizado reduzida (15-30 casos)',
          'Menor custo operacional (sem torre de vídeo)',
          'Resultados naturais e duradouros',
        ],
        stats: [
          { label: 'Recuperação', value: '7 Dias' },
          { label: 'Lesão Nervosa', value: '0%' },
          { label: 'Casos Realizados', value: '1500+' },
        ],
        image: '/images/techniques/endomidface-hero.png',
      },
      {
        id: 'browlift',
        title: 'Browlift Evolutivo',
        subtitle: 'Posicionamento natural das sobrancelhas',
        description:
          'Uma abordagem refinada para o reposicionamento do terço superior, focando na naturalidade da expressão e na harmonia com o restante da face.',
        benefits: [
          'Sem o aspecto de "surpresa"',
          'Cicatrizes imperceptíveis',
          'Harmonia com o Endomidface',
          'Preservação da mímica facial',
        ],
        stats: [
          { label: 'Tempo Cirúrgico', value: '45 min' },
          { label: 'Satisfação', value: '98%' },
          { label: 'Durabilidade', value: '8-10 Anos' },
        ],
        image: '/images/techniques/browlift-hero.png',
      },
      {
        id: 'deep-neck',
        title: 'Deep Neck',
        subtitle: 'Definição cervical sem remover a glândula',
        description:
          'Tratamento avançado do pescoço que redefine o contorno mandibular e cervical, tratando estruturas profundas com máxima segurança.',
        benefits: [
          'Definição mandibular HD',
          'Tratamento dos compartimentos de gordura',
          'Preservação da glândula submandibular',
          'Recuperação acelerada',
        ],
        stats: [
          { label: 'Definição', value: 'Alta' },
          { label: 'Complicações', value: '< 1%' },
          { label: 'Retorno Social', value: '10 Dias' },
        ],
        image: '/images/techniques/deep-neck-hero.png',
      },
    ],
    trainingPath: '/formacao',
  },
  en: {
    hero: {
      label: 'Techniques',
      title: 'Excellence in Every Procedure',
      subtitle:
        'Three integrated techniques that form the pillar of the Face Moderna® methodology. Safety, naturalness, and lasting results.',
    },
    learnButton: 'Learn This Technique',
    cta: {
      title: 'Master All Techniques',
      subtitle: 'In the Face Moderna® training, you learn all techniques in an integrated way.',
      button: 'Start Training',
    },
    techniques: [
      {
        id: 'endomidface',
        title: 'Endomidface by Direct Vision',
        subtitle: 'Midface rejuvenation without video',
        description:
          'The revolutionary technique that allows treating the midface with absolute safety, direct visualization of structures, and without the need for expensive endoscopic equipment.',
        benefits: [
          'Direct vision of noble structures',
          'Reduced learning curve (15-30 cases)',
          'Lower operational cost (no video tower)',
          'Natural and lasting results',
        ],
        stats: [
          { label: 'Recovery', value: '7 Days' },
          { label: 'Nerve Damage', value: '0%' },
          { label: 'Cases Performed', value: '1500+' },
        ],
        image: '/images/techniques/endomidface-hero.png',
      },
      {
        id: 'browlift',
        title: 'Evolutionary Browlift',
        subtitle: 'Natural eyebrow positioning',
        description:
          'A refined approach to repositioning the upper third, focusing on natural expression and harmony with the rest of the face.',
        benefits: [
          'No "surprised" look',
          'Imperceptible scars',
          'Harmony with Endomidface',
          'Facial mimics preservation',
        ],
        stats: [
          { label: 'Surgery Time', value: '45 min' },
          { label: 'Satisfaction', value: '98%' },
          { label: 'Durability', value: '8-10 Years' },
        ],
        image: '/images/techniques/browlift-hero.png',
      },
      {
        id: 'deep-neck',
        title: 'Deep Neck',
        subtitle: 'Cervical definition without gland removal',
        description:
          'Advanced neck treatment that redefines the mandibular and cervical contour, treating deep structures with maximum safety.',
        benefits: [
          'HD mandibular definition',
          'Fat compartment treatment',
          'Submandibular gland preservation',
          'Accelerated recovery',
        ],
        stats: [
          { label: 'Definition', value: 'High' },
          { label: 'Complications', value: '< 1%' },
          { label: 'Social Return', value: '10 Days' },
        ],
        image: '/images/techniques/deep-neck-hero.png',
      },
    ],
    trainingPath: '/education/core-programs/endomidface-direct-vision',
  },
  es: {
    hero: {
      label: 'Técnicas',
      title: 'Excelencia en Cada Procedimiento',
      subtitle:
        'Tres técnicas integradas que forman el pilar de la metodología Face Moderna®. Seguridad, naturalidad y resultados duraderos.',
    },
    learnButton: 'Aprender Esta Técnica',
    cta: {
      title: 'Domina Todas las Técnicas',
      subtitle: 'En la formación Face Moderna®, aprendes todas las técnicas de forma integrada.',
      button: 'Iniciar Formación',
    },
    techniques: [
      {
        id: 'endomidface',
        title: 'Endomidface por Visión Directa',
        subtitle: 'Rejuvenecimiento del tercio medio sin vídeo',
        description:
          'La técnica revolucionaria que permite tratar el tercio medio de la cara con seguridad absoluta, visualización directa de las estructuras y sin necesidad de equipos endoscópicos costosos.',
        benefits: [
          'Visión directa de estructuras nobles',
          'Curva de aprendizaje reducida (15-30 casos)',
          'Menor costo operativo (sin torre de vídeo)',
          'Resultados naturales y duraderos',
        ],
        stats: [
          { label: 'Recuperación', value: '7 Días' },
          { label: 'Lesión Nerviosa', value: '0%' },
          { label: 'Casos Realizados', value: '1500+' },
        ],
        image: '/images/techniques/endomidface-hero.png',
      },
      {
        id: 'browlift',
        title: 'Browlift Evolutivo',
        subtitle: 'Posicionamiento natural de las cejas',
        description:
          'Un enfoque refinado para el reposicionamiento del tercio superior, centrándose en la naturalidad de la expresión y la armonía con el resto de la cara.',
        benefits: [
          'Sin aspecto de "sorpresa"',
          'Cicatrices imperceptibles',
          'Armonía con el Endomidface',
          'Preservación de la mímica facial',
        ],
        stats: [
          { label: 'Tiempo Quirúrgico', value: '45 min' },
          { label: 'Satisfacción', value: '98%' },
          { label: 'Durabilidad', value: '8-10 Años' },
        ],
        image: '/images/techniques/browlift-hero.png',
      },
      {
        id: 'deep-neck',
        title: 'Deep Neck',
        subtitle: 'Definición cervical sin remover la glándula',
        description:
          'Tratamiento avanzado del cuello que redefine el contorno mandibular y cervical, tratando estructuras profundas con máxima seguridad.',
        benefits: [
          'Definición mandibular HD',
          'Tratamiento de compartimentos de grasa',
          'Preservación de la glándula submandibular',
          'Recuperación acelerada',
        ],
        stats: [
          { label: 'Definición', value: 'Alta' },
          { label: 'Complicaciones', value: '< 1%' },
          { label: 'Retorno Social', value: '10 Días' },
        ],
        image: '/images/techniques/deep-neck-hero.png',
      },
    ],
    trainingPath: '/es/formacion',
  },
};

/**
 * Get techniques schema
 */
export function getTechniquesSchema(locale: Locale) {
  const content = techniquesContent[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'en' ? 'Face Moderna® Techniques' : 'Técnicas Face Moderna®',
    description:
      locale === 'en'
        ? 'Advanced facial rejuvenation techniques'
        : 'Técnicas avançadas de rejuvenescimento facial',
    itemListElement: content.techniques.map((tech, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tech.title,
      description: tech.description,
    })),
  };
}
