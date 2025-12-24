/**
 * Internationalization utilities for Dr. Robério Brandão website
 * UPDATED: English as default language
 */

export type Locale = 'en' | 'pt-BR' | 'es';

export const locales: Locale[] = ['en', 'pt-BR', 'es'];
export const defaultLocale: Locale = 'en'; // ← CHANGED: EN as default

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'pt-BR': 'Português',
  'es': 'Español'
};

export const localeFlags: Record<Locale, string> = {
  'en': '🇺🇸',
  'pt-BR': '🇧🇷',
  'es': '🇪🇸'
};

// OG locale format mapping
export const ogLocales: Record<Locale, string> = {
  'en': 'en_US',
  'pt-BR': 'pt_BR',
  'es': 'es_ES'
};

// HTML lang attribute mapping
export const htmlLang: Record<Locale, string> = {
  'en': 'en',
  'pt-BR': 'pt-BR',
  'es': 'es'
};

/**
 * Get the current locale from the URL
 * UPDATED: EN is default (no prefix), PT uses /pt, ES uses /es
 */
export function getLocaleFromUrl(url: URL): Locale {
  const pathname = url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments[0] === 'pt') return 'pt-BR';
  if (segments[0] === 'es') return 'es';
  return 'en'; // ← CHANGED: EN as default
}

/**
 * Get the locale prefix for URLs
 * UPDATED: EN has no prefix, PT uses /pt
 */
export function getLocalePrefix(locale: Locale): string {
  if (locale === 'en') return ''; // ← CHANGED: EN has no prefix
  if (locale === 'pt-BR') return '/pt';
  return `/${locale}`;
}

/**
 * Generate a localized path
 * UPDATED: EN is default (no prefix)
 * @param path - The path without locale prefix (e.g., '/about')
 * @param locale - Target locale
 */
export function localizedPath(path: string, locale: Locale): string {
  // Remove any existing locale prefix
  let cleanPath = path.replace(/^\/(pt|es)\//, '/').replace(/^\/(pt|es)$/, '/');
  
  // Ensure path starts with /
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  // Handle root path
  if (cleanPath === '/') {
    if (locale === 'en') return '/';
    if (locale === 'pt-BR') return '/pt';
    return `/${locale}`;
  }
  
  // Add locale prefix for non-default locales
  if (locale === 'en') {
    return cleanPath; // ← CHANGED: EN has no prefix
  }
  
  if (locale === 'pt-BR') {
    return `/pt${cleanPath}`;
  }
  
  return `/${locale}${cleanPath}`;
}

/**
 * Remove locale prefix from a path
 * UPDATED: Includes /pt
 */
export function removeLocaleFromPath(path: string): string {
  return path.replace(/^\/(pt|es)\//, '/').replace(/^\/(pt|es)$/, '/');
}

/**
 * Map canonical paths across locales
 * UPDATED: EN paths have no prefix, PT paths use /pt
 */
const pathTranslationByKey: Record<string, Record<Locale, string>> = {
  // Modern Face section
  'modern-face-root': {
    'en': '/modern-face',           // ← No prefix
    'pt-BR': '/pt/face-moderna',    // ← /pt prefix
    'es': '/es/cara-moderna'
  },
  'modern-face-what-is': {
    'en': '/modern-face/what-is',
    'pt-BR': '/pt/face-moderna/o-que-e',
    'es': '/es/cara-moderna/que-es'
  },
  'modern-face-philosophy': {
    'en': '/modern-face/philosophy',
    'pt-BR': '/pt/face-moderna/filosofia',
    'es': '/es/cara-moderna/filosofia'
  },
  'modern-face-principles': {
    'en': '/modern-face/principles',
    'pt-BR': '/pt/face-moderna/principios',
    'es': '/es/cara-moderna/principios'
  },
  'modern-face-why-direct-vision': {
    'en': '/modern-face/why-direct-vision',
    'pt-BR': '/pt/face-moderna/por-que-visao-direta',
    'es': '/es/cara-moderna/por-que-vision-directa'
  },
  
  // Techniques section
  'techniques-root': {
    'en': '/techniques',
    'pt-BR': '/pt/tecnicas',
    'es': '/es/tecnicas'
  },
  'techniques-endomidface': {
    'en': '/techniques/endomidface',
    'pt-BR': '/pt/tecnicas/endomidface',
    'es': '/es/tecnicas/endomidface'
  },
  'techniques-deep-neck': {
    'en': '/techniques/deep-neck',
    'pt-BR': '/pt/tecnicas/deep-neck',
    'es': '/es/tecnicas/deep-neck'
  },
  'techniques-browlift': {
    'en': '/techniques/browlift',
    'pt-BR': '/pt/tecnicas/browlift',
    'es': '/es/tecnicas/browlift'
  },
  
  // Education section
  'education-root': {
    'en': '/education',
    'pt-BR': '/pt/educacao',
    'es': '/es/educacion'
  },
  'education-endomidface': {
    'en': '/education/endomidface',
    'pt-BR': '/pt/educacao/endomidface',
    'es': '/es/educacion/endomidface'
  },
  'education-deep-neck': {
    'en': '/education/deep-neck',
    'pt-BR': '/pt/educacao/deep-neck',
    'es': '/es/educacion/deep-neck'
  },
  'education-combo-legacy': {
    'en': '/education/combo-legacy',
    'pt-BR': '/pt/educacao/combo-legacy',
    'es': '/es/educacion/combo-legacy'
  },
  
  // About section
  'about-root': {
    'en': '/about',
    'pt-BR': '/pt/sobre',
    'es': '/es/sobre'
  },
  'about-dr-roberio': {
    'en': '/about/dr-roberio-brandao',
    'pt-BR': '/pt/sobre/dr-roberio-brandao',
    'es': '/es/sobre/dr-roberio-brandao'
  },
  'about-institute': {
    'en': '/about/institute',
    'pt-BR': '/pt/sobre/instituto',
    'es': '/es/sobre/instituto'
  },
  
  // Blog section
  'blog-root': {
    'en': '/blog',
    'pt-BR': '/pt/blog',
    'es': '/es/blog'
  },
  
  // Contact
  'contact': {
    'en': '/contact',
    'pt-BR': '/pt/contato',
    'es': '/es/contacto'
  },
  
  // FAQ
  'faq': {
    'en': '/faq',
    'pt-BR': '/pt/faq',
    'es': '/es/faq'
  },
  
  // Legal
  'privacy': {
    'en': '/privacy',
    'pt-BR': '/pt/privacidade',
    'es': '/es/privacidad'
  },
  'terms': {
    'en': '/terms',
    'pt-BR': '/pt/termos',
    'es': '/es/terminos'
  }
};

// Lookup to resolve the canonical key from a localized path
const pathKeyByLocalePath: Record<Locale, Record<string, string>> = {
  'en': {
    '/modern-face': 'modern-face-root',
    '/modern-face/what-is': 'modern-face-what-is',
    '/modern-face/philosophy': 'modern-face-philosophy',
    '/modern-face/principles': 'modern-face-principles',
    '/modern-face/why-direct-vision': 'modern-face-why-direct-vision',
    '/techniques': 'techniques-root',
    '/techniques/endomidface': 'techniques-endomidface',
    '/techniques/deep-neck': 'techniques-deep-neck',
    '/techniques/browlift': 'techniques-browlift',
    '/education': 'education-root',
    '/education/endomidface': 'education-endomidface',
    '/education/deep-neck': 'education-deep-neck',
    '/education/combo-legacy': 'education-combo-legacy',
    '/about': 'about-root',
    '/about/dr-roberio-brandao': 'about-dr-roberio',
    '/about/institute': 'about-institute',
    '/blog': 'blog-root',
    '/contact': 'contact',
    '/faq': 'faq',
    '/privacy': 'privacy',
    '/terms': 'terms'
  },
  'pt-BR': {
    '/face-moderna': 'modern-face-root',
    '/face-moderna/o-que-e': 'modern-face-what-is',
    '/face-moderna/filosofia': 'modern-face-philosophy',
    '/face-moderna/principios': 'modern-face-principles',
    '/face-moderna/por-que-visao-direta': 'modern-face-why-direct-vision',
    '/tecnicas': 'techniques-root',
    '/tecnicas/endomidface': 'techniques-endomidface',
    '/tecnicas/deep-neck': 'techniques-deep-neck',
    '/tecnicas/browlift': 'techniques-browlift',
    '/educacao': 'education-root',
    '/educacao/endomidface': 'education-endomidface',
    '/educacao/deep-neck': 'education-deep-neck',
    '/educacao/combo-legacy': 'education-combo-legacy',
    '/sobre': 'about-root',
    '/sobre/dr-roberio-brandao': 'about-dr-roberio',
    '/sobre/instituto': 'about-institute',
    '/blog': 'blog-root',
    '/contato': 'contact',
    '/faq': 'faq',
    '/privacidade': 'privacy',
    '/termos': 'terms'
  },
  'es': {
    '/cara-moderna': 'modern-face-root',
    '/cara-moderna/que-es': 'modern-face-what-is',
    '/cara-moderna/filosofia': 'modern-face-philosophy',
    '/cara-moderna/principios': 'modern-face-principles',
    '/cara-moderna/por-que-vision-directa': 'modern-face-why-direct-vision',
    '/tecnicas': 'techniques-root',
    '/tecnicas/endomidface': 'techniques-endomidface',
    '/tecnicas/deep-neck': 'techniques-deep-neck',
    '/tecnicas/browlift': 'techniques-browlift',
    '/educacion': 'education-root',
    '/educacion/endomidface': 'education-endomidface',
    '/educacion/deep-neck': 'education-deep-neck',
    '/educacion/combo-legacy': 'education-combo-legacy',
    '/sobre': 'about-root',
    '/sobre/dr-roberio-brandao': 'about-dr-roberio',
    '/sobre/instituto': 'about-institute',
    '/blog': 'blog-root',
    '/contacto': 'contact',
    '/faq': 'faq',
    '/privacidad': 'privacy',
    '/terminos': 'terms'
  }
};

function normalizePath(path: string): string {
  const withoutLocale = removeLocaleFromPath(path);
  const trimmed = withoutLocale.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * Translate a path to the target locale, preserving known slugs
 * Falls back to simple prefixing when no mapping exists.
 */
export function translatePath(path: string, locale: Locale): string {
  const cleanPath = normalizePath(path);

  const key = (Object.entries(pathKeyByLocalePath) as [Locale, Record<string, string>][]).reduce<string | undefined>((found, [, mapping]) => {
    if (found) return found;
    return mapping[cleanPath];
  }, undefined);

  if (key && pathTranslationByKey[key]?.[locale]) {
    return pathTranslationByKey[key][locale];
  }

  return localizedPath(cleanPath, locale);
}

/**
 * Get all alternate URLs for hreflang tags
 * UPDATED: x-default points to EN
 */
export function getAlternateUrls(
  currentPath: string, 
  siteUrl: string
): { locale: Locale; url: string; hreflang: string }[] {
  return locales.map(locale => ({
    locale,
    url: `${siteUrl}${translatePath(currentPath, locale)}`,
    hreflang: locale === 'pt-BR' ? 'pt-BR' : locale
  }));
}

/**
 * Navigation translations
 */
export const navTranslations: Record<Locale, Record<string, string>> = {
  'en': {
    home: 'Home',
    about: 'About',
    modernFace: 'Modern Face®',
    techniques: 'Techniques',
    training: 'Training',
    blog: 'Blog',
    glossary: 'Glossary',
    faq: 'FAQ',
    contact: 'Contact'
  },
  'pt-BR': {
    home: 'Home',
    about: 'Sobre',
    modernFace: 'Face Moderna®',
    techniques: 'Técnicas',
    training: 'Formação',
    blog: 'Blog',
    glossary: 'Glossário',
    faq: 'FAQ',
    contact: 'Contato'
  },
  'es': {
    home: 'Inicio',
    about: 'Sobre',
    modernFace: 'Cara Moderna®',
    techniques: 'Técnicas',
    training: 'Formación',
    blog: 'Blog',
    glossary: 'Glosario',
    faq: 'FAQ',
    contact: 'Contacto'
  }
};

/**
 * Footer translations
 */
export const footerTranslations: Record<Locale, Record<string, string>> = {
  'en': {
    techniques: 'Techniques',
    resources: 'Resources',
    institutional: 'Institutional',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    allRightsReserved: 'All rights reserved',
    endomidface: 'Endomidface',
    browlift: 'Evolutionary Browlift',
    deepNeck: 'Deep Neck',
    anatomy: 'Applied Anatomy',
    surgicalPlanning: 'Surgical Planning',
    education: 'Training',
    clinicalTechnology: 'Clinical Technology',
    library: 'Library',
    glossary: 'Glossary',
    faq: 'FAQ',
    about: 'About',
    contact: 'Contact',
    crmInfo: 'CRM-CE 8596 | RQE 3918'
  },
  'pt-BR': {
    techniques: 'Técnicas',
    resources: 'Recursos',
    institutional: 'Institucional',
    privacyPolicy: 'Política de Privacidade',
    termsOfUse: 'Termos de Uso',
    allRightsReserved: 'Todos os direitos reservados',
    endomidface: 'Endomidface',
    browlift: 'Browlift Evolutivo',
    deepNeck: 'Deep Neck',
    anatomy: 'Anatomia Aplicada',
    surgicalPlanning: 'Planejamento Cirúrgico',
    education: 'Formação',
    clinicalTechnology: 'Tecnologia Clínica',
    library: 'Biblioteca',
    glossary: 'Glossário',
    faq: 'FAQ',
    about: 'Sobre',
    contact: 'Contato',
    crmInfo: 'CRM-CE 8596 | RQE 3918'
  },
  'es': {
    techniques: 'Técnicas',
    resources: 'Recursos',
    institutional: 'Institucional',
    privacyPolicy: 'Política de Privacidad',
    termsOfUse: 'Términos de Uso',
    allRightsReserved: 'Todos los derechos reservados',
    endomidface: 'Endomidface',
    browlift: 'Browlift Evolutivo',
    deepNeck: 'Deep Neck',
    anatomy: 'Anatomía Aplicada',
    surgicalPlanning: 'Planificación Quirúrgica',
    education: 'Formación',
    clinicalTechnology: 'Tecnología Clínica',
    library: 'Biblioteca',
    glossary: 'Glosario',
    faq: 'FAQ',
    about: 'Sobre',
    contact: 'Contacto',
    crmInfo: 'CRM-CE 8596 | RQE 3918'
  }
};

// ============================================================
// NOTE: Copy remaining translations from your original i18n.ts
// This file contains the core i18n logic updated for EN as default
// You may need to merge additional translations from the original
// ============================================================
