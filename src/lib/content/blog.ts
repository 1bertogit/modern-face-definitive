/**
 * Blog page content centralized for all locales
 */
import type { Locale } from '@lib/i18n';

interface BlogIndexContent {
  breadcrumbs: {
    home: string;
    blog: string;
  };
  title: string;
  description: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
    href: string;
  };
  categoryParam: string; // URL param name for category filter
}

interface BlogPostLabels {
  home: string;
  blog: string;
  readTime: string;
  creator: string;
  updated: string;
  faqTitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaContact: string;
  related: string;
  dateLocale: string; // For toLocaleDateString
  paths: {
    home: string;
    blog: string;
    education: string;
    contact: string;
  };
}

export const blogIndexContent: Record<Locale, BlogIndexContent> = {
  pt: {
    breadcrumbs: {
      home: 'Início',
      blog: 'Blog',
    },
    title: 'Blog',
    description:
      'Artigos técnicos sobre cirurgia facial, filosofia Face Moderna, técnicas avançadas e educação médica continuada.',
    seo: {
      title: 'Blog | Modern Face Institute | Dr. Robério Brandão',
      description:
        'Artigos técnicos sobre cirurgia facial, técnicas da Face Moderna, Endomidface, anatomia aplicada e educação médica continuada. Conteúdo para cirurgiões plásticos.',
      keywords: [
        'blog cirurgia facial',
        'artigos Face Moderna',
        'Endomidface artigos',
        'Dr Robério Brandão blog',
      ],
    },
    cta: {
      title: 'Aprenda Diretamente com Dr. Robério',
      subtitle:
        'Os artigos são apenas o começo. A mentoria oferece aprendizado completo com casos ao vivo e acompanhamento personalizado.',
      button: 'Ver Programas de Mentoria',
      href: '/pt/educacao',
    },
    categoryParam: 'categoria',
  },
  en: {
    breadcrumbs: {
      home: 'Home',
      blog: 'Blog',
    },
    title: 'Blog',
    description:
      'Technical articles on facial surgery, Modern Face philosophy, advanced techniques and continuing medical education.',
    seo: {
      title: 'Blog | Modern Face Institute | Dr. Robério Brandão',
      description:
        'Technical articles on facial surgery, Modern Face techniques, Endomidface, applied anatomy and continuing medical education. Content for plastic surgeons.',
      keywords: [
        'facial surgery blog',
        'Modern Face articles',
        'Endomidface articles',
        'Dr Robério Brandão blog',
      ],
    },
    cta: {
      title: 'Learn Directly from Dr. Robério',
      subtitle:
        'The articles are just the beginning. Mentorship offers complete learning with live cases and personalized follow-up.',
      button: 'View Mentorship Programs',
      href: '/education',
    },
    categoryParam: 'category',
  },
  es: {
    breadcrumbs: {
      home: 'Inicio',
      blog: 'Blog',
    },
    title: 'Blog',
    description:
      'Artículos técnicos sobre cirugía facial, filosofía Modern Face, técnicas avanzadas y educación médica continua.',
    seo: {
      title: 'Blog | Modern Face Institute | Dr. Robério Brandão',
      description:
        'Artículos técnicos sobre cirugía facial, técnicas Modern Face, Endomidface, anatomía aplicada y educación médica continua. Contenido para cirujanos plásticos.',
      keywords: [
        'blog cirugía facial',
        'artículos Modern Face',
        'artículos Endomidface',
        'blog Dr Robério Brandão',
      ],
    },
    cta: {
      title: 'Aprende Directamente con Dr. Robério',
      subtitle:
        'Los artículos son solo el comienzo. La mentoría ofrece aprendizaje completo con casos en vivo y seguimiento personalizado.',
      button: 'Ver Programas de Mentoría',
      href: '/es/educacion',
    },
    categoryParam: 'categoria',
  },
};

export const blogPostLabels: Record<Locale, BlogPostLabels> = {
  pt: {
    home: 'Início',
    blog: 'Blog',
    readTime: 'de leitura',
    creator: 'Criador da Face Moderna®',
    updated: 'Atualizado em',
    faqTitle: 'Perguntas Frequentes',
    ctaTitle: 'Quer Dominar Essas Técnicas?',
    ctaSubtitle:
      'Aprenda diretamente com Dr. Robério Brandão em nossos cursos de especialização.',
    ctaButton: 'Conheça a Formação',
    ctaContact: 'Entre em Contato',
    related: 'Artigos Relacionados',
    dateLocale: 'pt-BR',
    paths: {
      home: '/pt',
      blog: '/pt/blog',
      education: '/pt/educacao',
      contact: '/pt/contato',
    },
  },
  en: {
    home: 'Home',
    blog: 'Blog',
    readTime: 'read',
    creator: 'Creator of Face Moderna®',
    updated: 'Updated',
    faqTitle: 'Frequently Asked Questions',
    ctaTitle: 'Want to Master These Techniques?',
    ctaSubtitle:
      'Learn directly from Dr. Robério Brandão in our specialized training programs.',
    ctaButton: 'Explore Training',
    ctaContact: 'Contact Us',
    related: 'Related Articles',
    dateLocale: 'en-US',
    paths: {
      home: '/',
      blog: '/blog',
      education: '/education',
      contact: '/contact',
    },
  },
  es: {
    home: 'Inicio',
    blog: 'Blog',
    readTime: 'de lectura',
    creator: 'Creador de Face Moderna®',
    updated: 'Actualizado',
    faqTitle: 'Preguntas Frecuentes',
    ctaTitle: '¿Quieres Dominar Estas Técnicas?',
    ctaSubtitle:
      'Aprende directamente con el Dr. Robério Brandão en nuestros programas de formación.',
    ctaButton: 'Explorar Formación',
    ctaContact: 'Contáctenos',
    related: 'Artículos Relacionados',
    dateLocale: 'es-ES',
    paths: {
      home: '/es',
      blog: '/es/blog',
      education: '/es/educacion',
      contact: '/es/contacto',
    },
  },
};

/**
 * Get blog index content for a given locale
 */
export function getBlogIndexContent(locale: Locale): BlogIndexContent {
  return blogIndexContent[locale];
}

/**
 * Get blog post labels for a given locale
 */
export function getBlogPostLabels(locale: Locale): BlogPostLabels {
  return blogPostLabels[locale];
}

/**
 * Get URL prefix for a given locale
 */
export function getLocaleUrlPrefix(locale: Locale): string {
  return locale === 'en' ? '' : `/${locale}`;
}

/**
 * Get blog index breadcrumbs for a given locale
 */
export function getBlogIndexBreadcrumbs(locale: Locale) {
  const content = blogIndexContent[locale];
  const prefix = getLocaleUrlPrefix(locale);
  return [
    { name: content.breadcrumbs.home, url: prefix || '/' },
    { name: content.breadcrumbs.blog, url: `${prefix}/blog` },
  ];
}
