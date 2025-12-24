/**
 * Component Translations
 *
 * Translations for interactive components (Glossary, Timeline, Common UI).
 */

import type { Locale } from './types';

/**
 * Glossary component translations
 */
export const glossaryTranslations: Record<
  Locale,
  {
    search: {
      placeholder: string;
      clearSearch: string;
      clearFilters: string;
    };
    empty: {
      title: string;
      subtitle: string;
      clearButton: string;
    };
    sections: {
      featured: string;
      general: string;
      benefits: string;
    };
    breadcrumb: {
      home: string;
      resources: string;
      glossary: string;
    };
    loadMore: string;
    resultsFound: string;
    cta: {
      title: string;
      description: string;
      scheduleButton: string;
      resultsButton: string;
    };
    alphabet: {
      all: string;
      filterByLetter: string;
      showAll: string;
    };
  }
> = {
  'pt': {
    search: {
      placeholder: 'Busque por um termo (ex: SMAS, Endomidface, Platisma)...',
      clearSearch: 'Limpar busca',
      clearFilters: 'Limpar filtros',
    },
    empty: {
      title: 'Nenhum termo encontrado',
      subtitle: 'Tente ajustar sua busca ou filtros',
      clearButton: 'Limpar filtros',
    },
    sections: {
      featured: 'Termos em Destaque',
      general: 'Glossário Geral',
      benefits: 'Benefícios principais',
    },
    breadcrumb: {
      home: 'Início',
      resources: 'Recursos',
      glossary: 'Glossário',
    },
    loadMore: 'Carregar mais termos',
    resultsFound: 'resultado(s) encontrado(s)',
    cta: {
      title: 'Ainda tem dúvidas sobre algum termo?',
      description: 'Entre em contato ou conheça nossos programas de formação',
      scheduleButton: 'Agendar Avaliação',
      resultsButton: 'Ver Resultados',
    },
    alphabet: {
      all: 'All',
      filterByLetter: 'Filtrar termos que começam com',
      showAll: 'Mostrar todos os termos',
    },
  },
  en: {
    search: {
      placeholder: 'Search for a term (e.g., SMAS, Endomidface, Platisma)...',
      clearSearch: 'Clear search',
      clearFilters: 'Clear filters',
    },
    empty: {
      title: 'No terms found',
      subtitle: 'Try adjusting your search or filters',
      clearButton: 'Clear filters',
    },
    sections: {
      featured: 'Featured Terms',
      general: 'General Glossary',
      benefits: 'Main benefits',
    },
    breadcrumb: {
      home: 'Home',
      resources: 'Resources',
      glossary: 'Glossary',
    },
    loadMore: 'Load more terms',
    resultsFound: 'result(s) found',
    cta: {
      title: 'Still have questions about a term?',
      description: 'Contact us or learn about our training programs',
      scheduleButton: 'Schedule Consultation',
      resultsButton: 'View Results',
    },
    alphabet: {
      all: 'All',
      filterByLetter: 'Filter terms starting with',
      showAll: 'Show all terms',
    },
  },
  es: {
    search: {
      placeholder: 'Busque un término (ej: SMAS, Endomidface, Platisma)...',
      clearSearch: 'Limpiar búsqueda',
      clearFilters: 'Limpiar filtros',
    },
    empty: {
      title: 'Ningún término encontrado',
      subtitle: 'Intente ajustar su búsqueda o filtros',
      clearButton: 'Limpiar filtros',
    },
    sections: {
      featured: 'Términos Destacados',
      general: 'Glosario General',
      benefits: 'Beneficios principales',
    },
    breadcrumb: {
      home: 'Inicio',
      resources: 'Recursos',
      glossary: 'Glosario',
    },
    loadMore: 'Cargar más términos',
    resultsFound: 'resultado(s) encontrado(s)',
    cta: {
      title: '¿Aún tiene dudas sobre algún término?',
      description: 'Contáctenos o conozca nuestros programas de formación',
      scheduleButton: 'Agendar Evaluación',
      resultsButton: 'Ver Resultados',
    },
    alphabet: {
      all: 'Todos',
      filterByLetter: 'Filtrar términos que empiezan con',
      showAll: 'Mostrar todos los términos',
    },
  },
};

/**
 * Timeline component translations
 */
export const timelineTranslations: Record<
  Locale,
  {
    filters: {
      title: string;
      search: string;
      criticalOnly: string;
      collapseAll: string;
      expandAll: string;
      events: string;
    };
    categories: {
      all: string;
      reconstruction: string;
      aesthetic: string;
      anatomy: string;
      technology: string;
      midface: string;
      volumetry: string;
      critical: string;
      era: string;
    };
    kpi: {
      criticalPoint: string;
      conceptualIntegrity: string;
      references: string;
    };
    aria: {
      expandDetails: string;
      collapseDetails: string;
    };
  }
> = {
  'pt': {
    filters: {
      title: 'Filtros',
      search: 'Buscar (ex.: SMAS, Hamra, midface)',
      criticalOnly: 'Mostrar apenas pontos críticos',
      collapseAll: 'Recolher tudo',
      expandAll: 'Expandir tudo',
      events: 'evento(s)',
    },
    categories: {
      all: 'Todos',
      reconstruction: 'Reconstrução',
      aesthetic: 'Estética',
      anatomy: 'Anatomia & Planos',
      technology: 'Tecnologia',
      midface: 'Terço médio (MIDFACE)',
      volumetry: 'Volumetria',
      critical: 'Marco crítico',
      era: 'Era / Conceito',
    },
    kpi: {
      criticalPoint: 'Ponto crítico',
      conceptualIntegrity: 'Integridade conceitual',
      references: 'Referências-chave',
    },
    aria: {
      expandDetails: 'Expandir detalhes de',
      collapseDetails: 'Recolher detalhes de',
    },
  },
  en: {
    filters: {
      title: 'Filters',
      search: 'Search (e.g., SMAS, Hamra, midface)',
      criticalOnly: 'Show critical points only',
      collapseAll: 'Collapse all',
      expandAll: 'Expand all',
      events: 'event(s)',
    },
    categories: {
      all: 'All',
      reconstruction: 'Reconstruction',
      aesthetic: 'Aesthetic',
      anatomy: 'Anatomy & Planes',
      technology: 'Technology',
      midface: 'Midface',
      volumetry: 'Volumetry',
      critical: 'Critical Milestone',
      era: 'Era / Concept',
    },
    kpi: {
      criticalPoint: 'Critical point',
      conceptualIntegrity: 'Conceptual integrity',
      references: 'Key references',
    },
    aria: {
      expandDetails: 'Expand details of',
      collapseDetails: 'Collapse details of',
    },
  },
  es: {
    filters: {
      title: 'Filtros',
      search: 'Buscar (ej.: SMAS, Hamra, midface)',
      criticalOnly: 'Mostrar solo puntos críticos',
      collapseAll: 'Contraer todo',
      expandAll: 'Expandir todo',
      events: 'evento(s)',
    },
    categories: {
      all: 'Todos',
      reconstruction: 'Reconstrucción',
      aesthetic: 'Estética',
      anatomy: 'Anatomía & Planos',
      technology: 'Tecnología',
      midface: 'Tercio medio (MIDFACE)',
      volumetry: 'Volumetría',
      critical: 'Hito crítico',
      era: 'Era / Concepto',
    },
    kpi: {
      criticalPoint: 'Punto crítico',
      conceptualIntegrity: 'Integridad conceptual',
      references: 'Referencias clave',
    },
    aria: {
      expandDetails: 'Expandir detalles de',
      collapseDetails: 'Contraer detalles de',
    },
  },
};

/**
 * Common UI translations (buttons, labels, etc.)
 */
export const commonTranslations: Record<
  Locale,
  {
    seeMore: string;
    learnMore: string;
    readMore: string;
    viewAll: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    loading: string;
  }
> = {
  'pt': {
    seeMore: 'Ver mais',
    learnMore: 'Saiba mais',
    readMore: 'Ler mais',
    viewAll: 'Ver todos',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    loading: 'Carregando...',
  },
  en: {
    seeMore: 'See more',
    learnMore: 'Learn more',
    readMore: 'Read more',
    viewAll: 'View all',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
  },
  es: {
    seeMore: 'Ver más',
    learnMore: 'Saber más',
    readMore: 'Leer más',
    viewAll: 'Ver todos',
    close: 'Cerrar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    loading: 'Cargando...',
  },
};
