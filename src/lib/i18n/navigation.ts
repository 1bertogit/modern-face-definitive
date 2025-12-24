/**
 * Navigation Translations
 *
 * Navigation links and menu translations for all locales.
 */

import type { Locale, NavLink, FooterLinks } from './types';

/**
 * Navigation translations
 */
export const navTranslations: Record<Locale, Record<string, string>> = {
  'pt': {
    home: 'Home',
    about: 'Sobre',
    faceModerna: 'Face Moderna®',
    techniques: 'Técnicas',
    training: 'Formação',
    blog: 'Blog',
    glossary: 'Glossário',
    faq: 'FAQ',
  },
  en: {
    home: 'Home',
    about: 'About',
    faceModerna: 'Face Moderna®',
    techniques: 'Techniques',
    training: 'Training',
    blog: 'Blog',
    glossary: 'Glossary',
    faq: 'FAQ',
  },
  es: {
    home: 'Inicio',
    about: 'Sobre',
    faceModerna: 'Face Moderna®',
    techniques: 'Técnicas',
    training: 'Formación',
    blog: 'Blog',
    glossary: 'Glosario',
    faq: 'FAQ',
  },
};

/**
 * Footer translations
 */
export const footerTranslations: Record<Locale, Record<string, string>> = {
  'pt': {
    techniques: 'Técnicas',
    resources: 'Recursos',
    institutional: 'Institucional',
    privacyPolicy: 'Política de Privacidade',
    termsOfUse: 'Termos de Uso',
    allRightsReserved: 'Todos os direitos reservados',
    endomidface: 'Endomidface',
    browlift: 'Browlift Evolutivo',
    deepNeck: 'Deep Neck',
    description:
      'Cirurgião Plástico especializado em rejuvenescimento facial. Criador do método Face Moderna® e Endomidface por Visão Direta.',
  },
  en: {
    techniques: 'Techniques',
    resources: 'Resources',
    institutional: 'Institutional',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    allRightsReserved: 'All rights reserved',
    endomidface: 'Endomidface',
    browlift: 'Evolutionary Browlift',
    deepNeck: 'Deep Neck',
    description:
      'Plastic Surgeon specialized in facial rejuvenation. Creator of the Face Moderna® method and Endomidface by Direct Vision.',
  },
  es: {
    techniques: 'Técnicas',
    resources: 'Recursos',
    institutional: 'Institucional',
    privacyPolicy: 'Política de Privacidad',
    termsOfUse: 'Términos de Uso',
    allRightsReserved: 'Todos los derechos reservados',
    endomidface: 'Endomidface',
    browlift: 'Browlift Evolutivo',
    deepNeck: 'Deep Neck',
    description:
      'Cirujano Plástico especializado en rejuvenecimiento facial. Creador del método Face Moderna® y Endomidface por Visión Directa.',
  },
};

/**
 * Header translations (branding and CTA)
 */
export const headerTranslations: Record<
  Locale,
  {
    logoSubtitle: string;
    ctaText: string;
  }
> = {
  'pt': {
    logoSubtitle: 'Instituto da Face Moderna',
    ctaText: 'Contato',
  },
  en: {
    logoSubtitle: 'Modern Face Institute',
    ctaText: 'Contact',
  },
  es: {
    logoSubtitle: 'Instituto de la Cara Moderna',
    ctaText: 'Contacto',
  },
};

/**
 * Mobile menu accessibility labels
 */
export const menuAriaLabels: Record<
  Locale,
  {
    openMenu: string;
    closeMenu: string;
    navigation: string;
  }
> = {
  'pt': {
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    navigation: 'Menu de navegação',
  },
  en: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    navigation: 'Navigation menu',
  },
  es: {
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    navigation: 'Menú de navegación',
  },
};

/**
 * Get navigation links for a specific locale (with dropdown support)
 */
export function getNavLinks(locale: Locale): NavLink[] {
  const links: Record<Locale, NavLink[]> = {
    'pt': [
      {
        label: 'Face Moderna',
        path: '/pt/face-moderna',
        children: [
          { label: 'O que é', path: '/pt/face-moderna/o-que-e' },
          { label: 'Filosofia', path: '/pt/face-moderna/filosofia' },
          { label: 'Princípios', path: '/pt/face-moderna/principios' },
          {
            label: 'Evolução da Cirurgia Facial',
            path: '/pt/face-moderna/evolucao-da-cirurgia-facial',
          },
          {
            label: 'Socialização do Conhecimento',
            path: '/pt/face-moderna/socializacao-do-conhecimento',
          },
          { label: 'Por que Visão Direta', path: '/pt/face-moderna/por-que-visao-direta' },
        ],
      },
      {
        label: 'Técnicas',
        path: '/pt/tecnicas',
        children: [
          { label: 'Endomidface', path: '/pt/tecnicas/endomidface' },
          { label: 'Deep Neck', path: '/pt/tecnicas/deep-neck' },
          { label: 'Browlift', path: '/pt/tecnicas/browlift' },
          { label: 'Anatomia', path: '/pt/tecnicas/anatomia' },
          { label: 'Planejamento Cirúrgico', path: '/pt/tecnicas/planejamento-cirurgico' },
        ],
      },
      {
        label: 'Educação',
        path: '/pt/educacao',
        children: [
          { label: 'Visão Educacional', path: '/pt/educacao' },
          {
            label: 'ENDOMIDFACE® por Visão Direta',
            path: '/pt/educacao/programas-nucleo/endomidface-visao-direta',
          },
          { label: 'Deep Neck Mastery', path: '/pt/educacao/programas-nucleo/deep-neck-mastery' },
          { label: 'Formação Avançada', path: '/pt/educacao/formacao-avancada' },
          { label: 'Cursos Satélites', path: '/pt/educacao/cursos-satelites' },
        ],
      },
      {
        label: 'Casos',
        path: '/pt/casos',
        children: [
          { label: 'Casos Cirúrgicos', path: '/pt/casos/cirurgicos' },
          { label: 'Casos de Alunos', path: '/pt/casos/alunos' },
        ],
      },
      {
        label: 'Tecnologia',
        path: '/pt/tecnologia-clinica',
        children: [
          { label: 'FaceOS', path: '/pt/tecnologia-clinica/faceos' },
          { label: 'AI Copilot', path: '/pt/tecnologia-clinica/ai-copilot' },
        ],
      },
      {
        label: 'Biblioteca',
        path: '/pt/biblioteca',
        children: [
          { label: 'E-books', path: '/pt/biblioteca/ebooks' },
          { label: 'Publicações Científicas', path: '/pt/biblioteca/publicacoes' },
          { label: 'Estudos Clínicos', path: '/pt/biblioteca/estudos-clinicos' },
          { label: 'Infográficos', path: '/pt/biblioteca/infograficos' },
          { label: 'Guias Práticos', path: '/pt/biblioteca/guias-praticos' },
        ],
      },
      { label: 'Blog', path: '/pt/blog' },
      {
        label: 'Sobre',
        path: '/pt/sobre',
        children: [
          { label: 'Dr. Robério Brandão', path: '/pt/sobre/dr-roberio-brandao' },
          { label: 'Casuística', path: '/pt/sobre/casuistica' },
          { label: 'Linha do Tempo', path: '/pt/sobre/linha-do-tempo' },
          { label: 'Princípios Éticos', path: '/pt/sobre/principios-eticos' },
          { label: 'Visão de Futuro', path: '/pt/sobre/visao-de-futuro' },
        ],
      },
    ],
    en: [
      {
        label: 'Modern Face',
        path: '/modern-face',
        children: [
          { label: 'What is it', path: '/modern-face/what-is-it' },
          { label: 'Philosophy', path: '/modern-face/philosophy' },
          { label: 'Principles', path: '/modern-face/principles' },
          {
            label: 'Evolution of Facial Surgery',
            path: '/modern-face/evolution-of-facial-surgery',
          },
          { label: 'Knowledge Sharing', path: '/modern-face/knowledge-sharing' },
          { label: 'Why Direct Vision', path: '/modern-face/why-direct-vision' },
        ],
      },
      {
        label: 'Techniques',
        path: '/techniques',
        children: [
          { label: 'Endomidface', path: '/techniques/endomidface' },
          { label: 'Deep Neck', path: '/techniques/deep-neck' },
          { label: 'Browlift', path: '/techniques/browlift' },
          { label: 'Anatomy', path: '/techniques/anatomy' },
          { label: 'Surgical Planning', path: '/techniques/surgical-planning' },
        ],
      },
      {
        label: 'Education',
        path: '/education',
        children: [
          { label: 'Educational Vision', path: '/education' },
          {
            label: 'ENDOMIDFACE® Direct Vision',
            path: '/education/core-programs/endomidface-direct-vision',
          },
          { label: 'Deep Neck Mastery', path: '/education/core-programs/deep-neck-mastery' },
          { label: 'Advanced Training', path: '/education/advanced-training' },
          { label: 'Satellite Courses', path: '/education/satellite-courses' },
        ],
      },
      {
        label: 'Cases',
        path: '/cases',
        children: [
          { label: 'Surgical Cases', path: '/cases/surgical' },
          { label: 'Student Cases', path: '/cases/students' },
        ],
      },
      {
        label: 'Technology',
        path: '/clinical-technology',
        children: [
          { label: 'FaceOS', path: '/clinical-technology/faceos' },
          { label: 'AI Copilot', path: '/clinical-technology/ai-copilot' },
        ],
      },
      {
        label: 'Library',
        path: '/library',
        children: [
          { label: 'E-books', path: '/library/ebooks' },
          { label: 'Scientific Publications', path: '/library/publications' },
          { label: 'Clinical Studies', path: '/library/clinical-studies' },
          { label: 'Infographics', path: '/library/infographics' },
          { label: 'Practical Guides', path: '/library/practical-guides' },
        ],
      },
      { label: 'Blog', path: '/blog' },
      {
        label: 'About',
        path: '/about',
        children: [
          { label: 'Dr. Robério Brandão', path: '/about/dr-roberio-brandao' },
          { label: 'Case Studies', path: '/about/case-studies' },
          { label: 'Timeline', path: '/about/timeline' },
          { label: 'Ethical Principles', path: '/about/ethical-principles' },
          { label: 'Future Vision', path: '/about/future-vision' },
        ],
      },
    ],
    es: [
      {
        label: 'Face Moderna',
        path: '/es/face-moderna',
        children: [
          { label: 'Qué es', path: '/es/face-moderna/que-es' },
          { label: 'Filosofía', path: '/es/face-moderna/filosofia' },
          { label: 'Principios', path: '/es/face-moderna/principios' },
          {
            label: 'Evolución de la Cirugía Facial',
            path: '/es/face-moderna/evolucion-de-la-cirugia-facial',
          },
          {
            label: 'Socialización del Conocimiento',
            path: '/es/face-moderna/socializacion-del-conocimiento',
          },
          { label: 'Por qué Visión Directa', path: '/es/face-moderna/por-que-vision-directa' },
        ],
      },
      {
        label: 'Técnicas',
        path: '/es/tecnicas',
        children: [
          { label: 'Endomidface', path: '/es/tecnicas/endomidface' },
          { label: 'Deep Neck', path: '/es/tecnicas/deep-neck' },
          { label: 'Browlift', path: '/es/tecnicas/browlift' },
          { label: 'Anatomía', path: '/es/tecnicas/anatomia' },
          { label: 'Planificación Quirúrgica', path: '/es/tecnicas/planificacion-quirurgica' },
        ],
      },
      {
        label: 'Educación',
        path: '/es/educacion',
        children: [
          { label: 'Visión Educativa', path: '/es/educacion' },
          {
            label: 'ENDOMIDFACE® Visión Directa',
            path: '/es/educacion/programas-nucleo/endomidface-vision-directa',
          },
          { label: 'Deep Neck Mastery', path: '/es/educacion/programas-nucleo/deep-neck-mastery' },
          { label: 'Formación Avanzada', path: '/es/educacion/formacion-avanzada' },
          { label: 'Cursos Satélites', path: '/es/educacion/cursos-satelites' },
        ],
      },
      {
        label: 'Casos',
        path: '/es/casos',
        children: [
          { label: 'Casos Quirúrgicos', path: '/es/casos/quirurgicos' },
          { label: 'Casos de Alumnos', path: '/es/casos/alumnos' },
        ],
      },
      {
        label: 'Tecnología',
        path: '/es/tecnologia-clinica',
        children: [
          { label: 'FaceOS', path: '/es/tecnologia-clinica/faceos' },
          { label: 'AI Copilot', path: '/es/tecnologia-clinica/ai-copilot' },
        ],
      },
      {
        label: 'Biblioteca',
        path: '/es/biblioteca',
        children: [
          { label: 'E-books', path: '/es/biblioteca/ebooks' },
          { label: 'Publicaciones Científicas', path: '/es/biblioteca/publicaciones' },
          { label: 'Estudios Clínicos', path: '/es/biblioteca/estudios-clinicos' },
          { label: 'Infográficos', path: '/es/biblioteca/infograficos' },
          { label: 'Guías Prácticas', path: '/es/biblioteca/guias-practicas' },
        ],
      },
      { label: 'Blog', path: '/es/blog' },
      {
        label: 'Sobre',
        path: '/es/sobre',
        children: [
          { label: 'Dr. Robério Brandão', path: '/es/sobre/dr-roberio-brandao' },
          { label: 'Casuística', path: '/es/sobre/casuistica' },
          { label: 'Línea del Tiempo', path: '/es/sobre/linea-del-tiempo' },
          { label: 'Principios Éticos', path: '/es/sobre/principios-eticos' },
          { label: 'Visión de Futuro', path: '/es/sobre/vision-de-futuro' },
        ],
      },
    ],
  };

  return links[locale];
}

/**
 * Get footer links for a specific locale
 */
export function getFooterLinks(locale: Locale): FooterLinks {
  const linkMappings: Record<Locale, FooterLinks> = {
    'pt': {
      tecnicas: [
        { label: 'Endomidface', path: '/pt/tecnicas/endomidface' },
        { label: 'Deep Neck', path: '/pt/tecnicas/deep-neck' },
        { label: 'Browlift', path: '/pt/tecnicas/browlift' },
        { label: 'Anatomia', path: '/pt/tecnicas/anatomia' },
        { label: 'Planejamento', path: '/pt/tecnicas/planejamento-cirurgico' },
      ],
      recursos: [
        { label: 'Blog', path: '/pt/blog' },
        { label: 'Glossário', path: '/pt/glossario' },
        { label: 'Casos', path: '/pt/casos' },
        { label: 'Biblioteca', path: '/pt/biblioteca' },
        { label: 'FAQ', path: '/pt/faq' },
      ],
      institucional: [
        { label: 'Sobre', path: '/pt/sobre' },
        { label: 'Educação', path: '/pt/educacao' },
        { label: 'Tecnologia', path: '/pt/tecnologia-clinica' },
        { label: 'Contato', path: '/pt/contato' },
      ],
    },
    en: {
      tecnicas: [
        { label: 'Endomidface', path: '/techniques/endomidface' },
        { label: 'Deep Neck', path: '/techniques/deep-neck' },
        { label: 'Browlift', path: '/techniques/browlift' },
        { label: 'Anatomy', path: '/techniques/anatomy' },
        { label: 'Surgical Planning', path: '/techniques/surgical-planning' },
      ],
      recursos: [
        { label: 'Blog', path: '/blog' },
        { label: 'Glossary', path: '/glossary' },
        { label: 'FAQ', path: '/faq' },
      ],
      institucional: [
        { label: 'About', path: '/about' },
        { label: 'Education', path: '/education' },
        { label: 'Contact', path: '/contact' },
      ],
    },
    es: {
      tecnicas: [
        { label: 'Endomidface', path: '/es/tecnicas/endomidface' },
        { label: 'Deep Neck', path: '/es/tecnicas/deep-neck' },
        { label: 'Browlift', path: '/es/tecnicas/browlift' },
        { label: 'Anatomía', path: '/es/tecnicas/anatomia' },
        { label: 'Planificación', path: '/es/tecnicas/planificacion-quirurgica' },
      ],
      recursos: [
        { label: 'Blog', path: '/es/blog' },
        { label: 'Glosario', path: '/es/glosario' },
        { label: 'FAQ', path: '/es/faq' },
      ],
      institucional: [
        { label: 'Sobre', path: '/es/sobre' },
        { label: 'Educación', path: '/es/educacion' },
        { label: 'Contacto', path: '/es/contacto' },
      ],
    },
  };

  return linkMappings[locale];
}
