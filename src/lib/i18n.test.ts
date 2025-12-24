/**
 * i18n utilities tests
 *
 * Updated to reflect EN as default locale (no prefix)
 * - EN: / (default, no prefix)
 * - PT-BR: /pt/...
 * - ES: /es/...
 */
import { describe, it, expect } from 'vitest';
import {
  locales,
  defaultLocale,
  localeNames,
  localeFlags,
  ogLocales,
  htmlLang,
  getLocaleFromUrl,
  getLocalePrefix,
  localizedPath,
  removeLocaleFromPath,
  translatePath,
  getAlternateUrls,
  getNavLinks,
  getFooterLinks,
  navTranslations,
  footerTranslations,
  headerTranslations,
  menuAriaLabels,
  glossaryTranslations,
  timelineTranslations,
  commonTranslations,
} from './i18n';

describe('i18n constants', () => {
  it('should have 3 locales defined', () => {
    expect(locales).toHaveLength(3);
    expect(locales).toContain('pt');
    expect(locales).toContain('en');
    expect(locales).toContain('es');
  });

  it('should have en as default locale', () => {
    expect(defaultLocale).toBe('en');
  });

  it('should have locale names for all locales', () => {
    expect(localeNames['pt']).toBe('Português');
    expect(localeNames['en']).toBe('English');
    expect(localeNames['es']).toBe('Español');
  });

  it('should have locale flags for all locales', () => {
    expect(localeFlags['pt']).toBe('🇧🇷');
    expect(localeFlags['en']).toBe('🇺🇸');
    expect(localeFlags['es']).toBe('🇪🇸');
  });

  it('should have OG locale mappings', () => {
    expect(ogLocales['pt']).toBe('pt_BR');
    expect(ogLocales['en']).toBe('en_US');
    expect(ogLocales['es']).toBe('es_ES');
  });

  it('should have HTML lang mappings', () => {
    // Note: PT uses 'pt-BR' per project standards for SEO compliance
    expect(htmlLang['pt']).toBe('pt-BR');
    expect(htmlLang['en']).toBe('en');
    expect(htmlLang['es']).toBe('es');
  });
});

describe('getLocaleFromUrl', () => {
  it('should return en for root path (default locale)', () => {
    const url = new URL('https://example.com/');
    expect(getLocaleFromUrl(url)).toBe('en');
  });

  it('should return pt for /pt paths', () => {
    const url = new URL('https://example.com/pt/sobre');
    expect(getLocaleFromUrl(url)).toBe('pt');
  });

  it('should return en for paths without locale prefix', () => {
    const url = new URL('https://example.com/about');
    expect(getLocaleFromUrl(url)).toBe('en');
  });

  it('should return es for /es paths', () => {
    const url = new URL('https://example.com/es/sobre');
    expect(getLocaleFromUrl(url)).toBe('es');
  });

  it('should return en for /pt root without trailing content', () => {
    const url = new URL('https://example.com/pt');
    expect(getLocaleFromUrl(url)).toBe('pt');
  });

  it('should return es for /es root', () => {
    const url = new URL('https://example.com/es');
    expect(getLocaleFromUrl(url)).toBe('es');
  });

  it('should handle nested paths correctly', () => {
    const url = new URL('https://example.com/techniques/endomidface');
    expect(getLocaleFromUrl(url)).toBe('en');
  });
});

describe('getLocalePrefix', () => {
  it('should return /pt for pt', () => {
    expect(getLocalePrefix('pt')).toBe('/pt');
  });

  it('should return empty string for en (default locale)', () => {
    expect(getLocalePrefix('en')).toBe('');
  });

  it('should return /es for es', () => {
    expect(getLocalePrefix('es')).toBe('/es');
  });
});

describe('localizedPath', () => {
  describe('pt locale (uses /pt prefix)', () => {
    it('should add /pt prefix for pt', () => {
      expect(localizedPath('/sobre', 'pt')).toBe('/pt/sobre');
    });

    it('should handle root path', () => {
      expect(localizedPath('/', 'pt')).toBe('/pt');
    });

    it('should handle existing /pt prefix', () => {
      expect(localizedPath('/pt/about', 'pt')).toBe('/pt/about');
    });
  });

  describe('en locale (no prefix - default)', () => {
    it('should not add prefix for en locale', () => {
      expect(localizedPath('/about', 'en')).toBe('/about');
    });

    it('should handle root path', () => {
      expect(localizedPath('/', 'en')).toBe('/');
    });

    it('should remove existing locale prefix when converting to en', () => {
      expect(localizedPath('/es/sobre', 'en')).toBe('/sobre');
    });
  });

  describe('es locale', () => {
    it('should add /es prefix', () => {
      expect(localizedPath('/sobre', 'es')).toBe('/es/sobre');
    });

    it('should handle root path', () => {
      expect(localizedPath('/', 'es')).toBe('/es');
    });
  });

  it('should add leading slash if missing', () => {
    expect(localizedPath('sobre', 'en')).toBe('/sobre');
  });
});

describe('removeLocaleFromPath', () => {
  it('should remove /pt prefix', () => {
    expect(removeLocaleFromPath('/pt/sobre')).toBe('/sobre');
  });

  it('should remove /es prefix', () => {
    expect(removeLocaleFromPath('/es/sobre')).toBe('/sobre');
  });

  it('should handle /pt root', () => {
    expect(removeLocaleFromPath('/pt')).toBe('/');
  });

  it('should handle /es root', () => {
    expect(removeLocaleFromPath('/es')).toBe('/');
  });

  it('should not modify en paths (no prefix)', () => {
    expect(removeLocaleFromPath('/about')).toBe('/about');
  });

  it('should not modify root path', () => {
    expect(removeLocaleFromPath('/')).toBe('/');
  });
});

describe('translatePath', () => {
  describe('Face Moderna paths', () => {
    it('should translate /pt/face-moderna to EN (no prefix)', () => {
      expect(translatePath('/pt/face-moderna', 'en')).toBe('/modern-face');
    });

    it('should translate /pt/face-moderna to ES', () => {
      expect(translatePath('/pt/face-moderna', 'es')).toBe('/es/face-moderna');
    });

    it('should translate /modern-face to PT', () => {
      expect(translatePath('/modern-face', 'pt')).toBe('/pt/face-moderna');
    });

    it('should translate /pt/face-moderna/o-que-e to EN', () => {
      expect(translatePath('/pt/face-moderna/o-que-e', 'en')).toBe('/modern-face/what-is-it');
    });

    it('should translate /modern-face/what-is-it to PT', () => {
      expect(translatePath('/modern-face/what-is-it', 'pt')).toBe('/pt/face-moderna/o-que-e');
    });

    it('should translate /pt/face-moderna/filosofia to EN', () => {
      expect(translatePath('/pt/face-moderna/filosofia', 'en')).toBe('/modern-face/philosophy');
    });

    it('should translate /pt/face-moderna/principios to EN', () => {
      expect(translatePath('/pt/face-moderna/principios', 'en')).toBe('/modern-face/principles');
    });
  });

  describe('fallback behavior', () => {
    it('should fall back to simple prefixing for unknown paths', () => {
      expect(translatePath('/blog', 'pt')).toBe('/pt/blog');
    });

    it('should handle paths without trailing slash', () => {
      expect(translatePath('/pt/face-moderna/', 'en')).toBe('/modern-face');
    });
  });
});

describe('getAlternateUrls', () => {
  const siteUrl = 'https://drroberiobrandao.com';

  it('should return alternate URLs for all 3 locales', () => {
    const alternates = getAlternateUrls('/modern-face', siteUrl);
    expect(alternates).toHaveLength(3);
  });

  it('should include correct hreflang values', () => {
    const alternates = getAlternateUrls('/modern-face', siteUrl);
    const ptAlternate = alternates.find((a) => a.locale === 'pt');
    const enAlternate = alternates.find((a) => a.locale === 'en');
    const esAlternate = alternates.find((a) => a.locale === 'es');

    expect(ptAlternate?.hreflang).toBe('pt-BR');
    expect(enAlternate?.hreflang).toBe('en');
    expect(esAlternate?.hreflang).toBe('es');
  });

  it('should translate paths correctly for EN source', () => {
    const alternates = getAlternateUrls('/modern-face', siteUrl);
    const ptAlternate = alternates.find((a) => a.locale === 'pt');
    const enAlternate = alternates.find((a) => a.locale === 'en');

    expect(enAlternate?.url).toBe('https://drroberiobrandao.com/modern-face');
    expect(ptAlternate?.url).toBe('https://drroberiobrandao.com/pt/face-moderna');
  });
});

describe('getNavLinks', () => {
  it('should return navigation links for pt', () => {
    const links = getNavLinks('pt');
    expect(links).toBeDefined();
    expect(links.length).toBeGreaterThan(0);
  });

  it('should return navigation links for en', () => {
    const links = getNavLinks('en');
    expect(links).toBeDefined();
    expect(links.length).toBeGreaterThan(0);
  });

  it('should return navigation links for es', () => {
    const links = getNavLinks('es');
    expect(links).toBeDefined();
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have correct Face Moderna path for pt (with /pt prefix)', () => {
    const links = getNavLinks('pt');
    const faceModerna = links.find((l) => l.path === '/pt/face-moderna');
    expect(faceModerna).toBeDefined();
    expect(faceModerna?.label).toBe('Face Moderna');
  });

  it('should have correct Modern Face path for en (no prefix)', () => {
    const links = getNavLinks('en');
    const modernFace = links.find((l) => l.path === '/modern-face');
    expect(modernFace).toBeDefined();
    expect(modernFace?.label).toBe('Modern Face');
  });

  it('should include children (dropdowns) for Face Moderna in pt', () => {
    const links = getNavLinks('pt');
    const faceModerna = links.find((l) => l.path === '/pt/face-moderna');
    expect(faceModerna?.children).toBeDefined();
    expect(faceModerna?.children?.length).toBeGreaterThan(0);
  });

  it('should include children (dropdowns) for Modern Face in en', () => {
    const links = getNavLinks('en');
    const modernFace = links.find((l) => l.path === '/modern-face');
    expect(modernFace?.children).toBeDefined();
    expect(modernFace?.children?.length).toBeGreaterThan(0);
  });

  it('should have Blog link in all locales', () => {
    expect(getNavLinks('pt').find((l) => l.label === 'Blog')).toBeDefined();
    expect(getNavLinks('en').find((l) => l.label === 'Blog')).toBeDefined();
    expect(getNavLinks('es').find((l) => l.label === 'Blog')).toBeDefined();
  });
});

describe('getFooterLinks', () => {
  it('should return footer links for all locales', () => {
    for (const locale of locales) {
      const links = getFooterLinks(locale);
      expect(links).toBeDefined();
      expect(links.tecnicas).toBeDefined();
      expect(links.recursos).toBeDefined();
      expect(links.institucional).toBeDefined();
    }
  });

  it('should have correct technique links for pt (with /pt prefix)', () => {
    const links = getFooterLinks('pt');
    expect(links.tecnicas.find((l) => l.path === '/pt/tecnicas/endomidface')).toBeDefined();
    expect(links.tecnicas.find((l) => l.path === '/pt/tecnicas/deep-neck')).toBeDefined();
  });

  it('should have correct technique links for en (no prefix)', () => {
    const links = getFooterLinks('en');
    expect(links.tecnicas.find((l) => l.path === '/techniques/endomidface')).toBeDefined();
    expect(links.tecnicas.find((l) => l.path === '/techniques/deep-neck')).toBeDefined();
  });
});

describe('translation objects', () => {
  describe('navTranslations', () => {
    it('should have translations for all locales', () => {
      for (const locale of locales) {
        expect(navTranslations[locale]).toBeDefined();
        expect(navTranslations[locale].home).toBeDefined();
        expect(navTranslations[locale].about).toBeDefined();
        expect(navTranslations[locale].techniques).toBeDefined();
      }
    });
  });

  describe('footerTranslations', () => {
    it('should have translations for all locales', () => {
      for (const locale of locales) {
        expect(footerTranslations[locale]).toBeDefined();
        expect(footerTranslations[locale].techniques).toBeDefined();
        expect(footerTranslations[locale].resources).toBeDefined();
        expect(footerTranslations[locale].privacyPolicy).toBeDefined();
      }
    });
  });

  describe('headerTranslations', () => {
    it('should have translations for all locales', () => {
      for (const locale of locales) {
        expect(headerTranslations[locale]).toBeDefined();
        expect(headerTranslations[locale].logoSubtitle).toBeDefined();
        expect(headerTranslations[locale].ctaText).toBeDefined();
      }
    });
  });

  describe('menuAriaLabels', () => {
    it('should have accessibility labels for all locales', () => {
      for (const locale of locales) {
        expect(menuAriaLabels[locale]).toBeDefined();
        expect(menuAriaLabels[locale].openMenu).toBeDefined();
        expect(menuAriaLabels[locale].closeMenu).toBeDefined();
        expect(menuAriaLabels[locale].navigation).toBeDefined();
      }
    });
  });

  describe('glossaryTranslations', () => {
    it('should have translations for all locales', () => {
      for (const locale of locales) {
        expect(glossaryTranslations[locale]).toBeDefined();
        expect(glossaryTranslations[locale].search).toBeDefined();
        expect(glossaryTranslations[locale].empty).toBeDefined();
        expect(glossaryTranslations[locale].sections).toBeDefined();
      }
    });
  });

  describe('timelineTranslations', () => {
    it('should have translations for all locales', () => {
      for (const locale of locales) {
        expect(timelineTranslations[locale]).toBeDefined();
        expect(timelineTranslations[locale].filters).toBeDefined();
        expect(timelineTranslations[locale].categories).toBeDefined();
        expect(timelineTranslations[locale].kpi).toBeDefined();
      }
    });
  });

  describe('commonTranslations', () => {
    it('should have translations for all locales', () => {
      for (const locale of locales) {
        expect(commonTranslations[locale]).toBeDefined();
        expect(commonTranslations[locale].seeMore).toBeDefined();
        expect(commonTranslations[locale].learnMore).toBeDefined();
        expect(commonTranslations[locale].close).toBeDefined();
      }
    });
  });
});
