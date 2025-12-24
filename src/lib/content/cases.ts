/**
 * Cases/Clinical Cases Content
 * Centralized translations for cases pages
 */

import type { Locale } from '../i18n';

export interface CaseCategory {
  titulo: string;
  descricao: string;
  href: string;
  icone: string;
  stats: string;
}

export interface CasesContent {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    subtitle: string;
    title: string;
    description: string;
  };
  quote: {
    text: string;
    author: string;
  };
  categories: CaseCategory[];
  stats: {
    nerveDamage: { value: string; label: string };
    documented: { value: string; label: string };
    recovery: { value: string; label: string };
    experience: { value: string; label: string };
  };
  cta: {
    title: string;
    description: string;
    button: string;
    href: string;
  };
  ui: {
    viewCases: string;
    allFilter: string;
    breadcrumb: {
      home: string;
      cases: string;
      surgical: string;
      students: string;
    };
  };
}

export const casesContent: Record<Locale, CasesContent> = {
  'pt': {
    meta: {
      title: 'Casos Clínicos | Resultados Face Moderna®',
      description:
        'Galeria de casos cirúrgicos da Face Moderna®. Resultados do Dr. Robério Brandão e de cirurgiões formados na metodologia.',
      keywords: [
        'casos clínicos Face Moderna',
        'resultados cirurgia facial',
        'antes depois lifting',
        'casos Dr Robério Brandão',
      ],
    },
    hero: {
      subtitle: 'Evidência Clínica',
      title: 'Casos Clínicos',
      description:
        'A melhor prova de uma técnica é sua reprodutibilidade. Veja os resultados do criador e de seus alunos.',
    },
    quote: {
      text: '"212 casos documentados. Zero lesões nervosas permanentes. A segurança não é acaso — é método."',
      author: '— Dr. Robério Brandão',
    },
    categories: [
      {
        titulo: 'Casos Cirúrgicos',
        descricao:
          'Resultados de procedimentos realizados pelo Dr. Robério Brandão. Documentação completa com antes, durante e depois.',
        href: '/casos/cirurgicos',
        icone: 'medical_services',
        stats: '212+ casos documentados',
      },
      {
        titulo: 'Casos de Alunos',
        descricao:
          'Resultados de cirurgiões formados na metodologia Face Moderna®. Prova da reprodutibilidade da técnica.',
        href: '/casos/alunos',
        icone: 'school',
        stats: 'Múltiplos cirurgiões',
      },
    ],
    stats: {
      nerveDamage: { value: '0%', label: 'Lesão Nervosa Permanente' },
      documented: { value: '212+', label: 'Casos Documentados' },
      recovery: { value: '7d', label: 'Recuperação Média' },
      experience: { value: '18+', label: 'Anos de Experiência' },
    },
    cta: {
      title: 'Aprenda a Técnica',
      description:
        'Junte-se aos cirurgiões que estão alcançando estes resultados com a metodologia Face Moderna®.',
      button: 'Ver Programas de Formação',
      href: '/educacao',
    },
    ui: {
      viewCases: 'Ver casos',
      allFilter: 'Todos',
      breadcrumb: {
        home: 'Home',
        cases: 'Casos',
        surgical: 'Casos Cirúrgicos',
        students: 'Casos de Alunos',
      },
    },
  },
  en: {
    meta: {
      title: 'Clinical Cases | Face Moderna® Results',
      description:
        'Gallery of Face Moderna® surgical cases. Results from Dr. Robério Brandão and surgeons trained in the methodology.',
      keywords: [
        'Face Moderna clinical cases',
        'facial surgery results',
        'before after facelift',
        'Dr Robério Brandão cases',
      ],
    },
    hero: {
      subtitle: 'Clinical Evidence',
      title: 'Clinical Cases',
      description:
        'The best proof of a technique is its reproducibility. See results from the creator and his students.',
    },
    quote: {
      text: '"212 documented cases. Zero permanent nerve damage. Safety is not chance — it\'s method."',
      author: '— Dr. Robério Brandão',
    },
    categories: [
      {
        titulo: 'Surgical Cases',
        descricao:
          'Results from procedures performed by Dr. Robério Brandão. Complete documentation with before, during, and after.',
        href: '/cases/surgical',
        icone: 'medical_services',
        stats: '212+ documented cases',
      },
      {
        titulo: 'Student Cases',
        descricao:
          'Results from surgeons trained in the Face Moderna® methodology. Proof of technique reproducibility.',
        href: '/cases/students',
        icone: 'school',
        stats: 'Multiple surgeons',
      },
    ],
    stats: {
      nerveDamage: { value: '0%', label: 'Permanent Nerve Damage' },
      documented: { value: '212+', label: 'Documented Cases' },
      recovery: { value: '7d', label: 'Average Recovery' },
      experience: { value: '18+', label: 'Years of Experience' },
    },
    cta: {
      title: 'Learn the Technique',
      description: 'Join the surgeons achieving these results with the Face Moderna® methodology.',
      button: 'View Training Programs',
      href: '/education',
    },
    ui: {
      viewCases: 'View cases',
      allFilter: 'All',
      breadcrumb: {
        home: 'Home',
        cases: 'Cases',
        surgical: 'Surgical Cases',
        students: 'Student Cases',
      },
    },
  },
  es: {
    meta: {
      title: 'Casos Clínicos | Resultados Face Moderna®',
      description:
        'Galería de casos quirúrgicos de Face Moderna®. Resultados del Dr. Robério Brandão y de cirujanos formados en la metodología.',
      keywords: [
        'casos clínicos Face Moderna',
        'resultados cirugía facial',
        'antes después lifting',
        'casos Dr Robério Brandão',
      ],
    },
    hero: {
      subtitle: 'Evidencia Clínica',
      title: 'Casos Clínicos',
      description:
        'La mejor prueba de una técnica es su reproducibilidad. Vea los resultados del creador y de sus alumnos.',
    },
    quote: {
      text: '"212 casos documentados. Cero lesiones nerviosas permanentes. La seguridad no es casualidad — es método."',
      author: '— Dr. Robério Brandão',
    },
    categories: [
      {
        titulo: 'Casos Quirúrgicos',
        descricao:
          'Resultados de procedimientos realizados por el Dr. Robério Brandão. Documentación completa con antes, durante y después.',
        href: '/es/casos/quirurgicos',
        icone: 'medical_services',
        stats: '212+ casos documentados',
      },
      {
        titulo: 'Casos de Alumnos',
        descricao:
          'Resultados de cirujanos formados en la metodología Face Moderna®. Prueba de la reproducibilidad de la técnica.',
        href: '/es/casos/alumnos',
        icone: 'school',
        stats: 'Múltiples cirujanos',
      },
    ],
    stats: {
      nerveDamage: { value: '0%', label: 'Lesión Nerviosa Permanente' },
      documented: { value: '212+', label: 'Casos Documentados' },
      recovery: { value: '7d', label: 'Recuperación Media' },
      experience: { value: '18+', label: 'Años de Experiencia' },
    },
    cta: {
      title: 'Aprenda la Técnica',
      description:
        'Únase a los cirujanos que están logrando estos resultados con la metodología Face Moderna®.',
      button: 'Ver Programas de Formación',
      href: '/es/educacion',
    },
    ui: {
      viewCases: 'Ver casos',
      allFilter: 'Todos',
      breadcrumb: {
        home: 'Inicio',
        cases: 'Casos',
        surgical: 'Casos Quirúrgicos',
        students: 'Casos de Alumnos',
      },
    },
  },
};

export function getCasesSchema(locale: Locale) {
  const content = casesContent[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: content.meta.title,
    description: content.meta.description,
    inLanguage: locale === 'pt' ? 'pt': locale,
  };
}
