/**
 * Tests for urlBuilders.ts - Locale-aware URL Generation
 *
 * Covers all URL builder functions for PT-BR, EN, and ES locales
 */

import { describe, it, expect } from 'vitest';
import {
  getBlogPostUrl,
  getBlogIndexUrl,
  getBlogCategoryUrl,
  getHomeUrl,
  getLocalizedUrl,
} from './urlBuilders';

// ============================================================================
// getBlogPostUrl Tests
// ============================================================================

describe('getBlogPostUrl', () => {
  const ptSlug = 'o-que-e-endomidface';
  const enSlug = 'what-is-endomidface';

  describe('EN locale (default)', () => {
    it('returns URL without locale prefix', () => {
      expect(getBlogPostUrl(enSlug, 'en')).toBe('/blog/what-is-endomidface');
    });

    it('defaults to EN when no locale specified', () => {
      expect(getBlogPostUrl(enSlug)).toBe('/blog/what-is-endomidface');
    });
  });

  describe('PT-BR locale', () => {
    it('returns URL with /pt prefix', () => {
      expect(getBlogPostUrl(ptSlug, 'pt')).toBe('/pt/blog/o-que-e-endomidface');
    });
  });

  describe('ES locale', () => {
    it('returns URL with /es prefix', () => {
      expect(getBlogPostUrl('que-es-endomidface', 'es')).toBe('/es/blog/que-es-endomidface');
    });
  });

  describe('edge cases', () => {
    it('handles empty slug', () => {
      expect(getBlogPostUrl('', 'en')).toBe('/blog/');
      expect(getBlogPostUrl('', 'pt')).toBe('/pt/blog/');
    });

    it('handles slug with special characters', () => {
      expect(getBlogPostUrl('técnicas-avançadas', 'pt')).toBe('/pt/blog/técnicas-avançadas');
    });

    it('handles slug with numbers', () => {
      expect(getBlogPostUrl('top-10-dicas', 'pt')).toBe('/pt/blog/top-10-dicas');
    });
  });
});

// ============================================================================
// getBlogIndexUrl Tests
// ============================================================================

describe('getBlogIndexUrl', () => {
  describe('EN locale (default)', () => {
    it('returns /blog without locale prefix', () => {
      expect(getBlogIndexUrl('en')).toBe('/blog');
    });

    it('defaults to EN when no locale specified', () => {
      expect(getBlogIndexUrl()).toBe('/blog');
    });
  });

  describe('PT-BR locale', () => {
    it('returns /pt/blog', () => {
      expect(getBlogIndexUrl('pt')).toBe('/pt/blog');
    });
  });

  describe('ES locale', () => {
    it('returns /es/blog', () => {
      expect(getBlogIndexUrl('es')).toBe('/es/blog');
    });
  });
});

// ============================================================================
// getBlogCategoryUrl Tests
// ============================================================================

describe('getBlogCategoryUrl', () => {
  describe('EN locale (default)', () => {
    it('returns blog URL with category query param', () => {
      expect(getBlogCategoryUrl('techniques', 'en')).toBe('/blog?categoria=techniques');
    });

    it('defaults to EN when no locale specified', () => {
      expect(getBlogCategoryUrl('education')).toBe('/blog?categoria=education');
    });
  });

  describe('PT-BR locale', () => {
    it('returns /pt/blog with category query param', () => {
      expect(getBlogCategoryUrl('tecnicas', 'pt')).toBe('/pt/blog?categoria=tecnicas');
    });
  });

  describe('ES locale', () => {
    it('returns /es/blog with category query param', () => {
      expect(getBlogCategoryUrl('tecnicas', 'es')).toBe('/es/blog?categoria=tecnicas');
    });
  });

  describe('edge cases', () => {
    it('handles category with spaces', () => {
      expect(getBlogCategoryUrl('face moderna', 'pt')).toBe('/pt/blog?categoria=face moderna');
    });

    it('handles empty category', () => {
      expect(getBlogCategoryUrl('', 'pt')).toBe('/pt/blog?categoria=');
    });
  });
});

// ============================================================================
// getHomeUrl Tests
// ============================================================================

describe('getHomeUrl', () => {
  describe('EN locale (default)', () => {
    it('returns / without locale prefix', () => {
      expect(getHomeUrl('en')).toBe('/');
    });

    it('defaults to EN when no locale specified', () => {
      expect(getHomeUrl()).toBe('/');
    });
  });

  describe('PT-BR locale', () => {
    it('returns /pt', () => {
      expect(getHomeUrl('pt')).toBe('/pt');
    });
  });

  describe('ES locale', () => {
    it('returns /es', () => {
      expect(getHomeUrl('es')).toBe('/es');
    });
  });
});

// ============================================================================
// getLocalizedUrl Tests
// ============================================================================

describe('getLocalizedUrl', () => {
  describe('EN locale (default)', () => {
    it('returns path without locale prefix', () => {
      expect(getLocalizedUrl('/contact', 'en')).toBe('/contact');
    });

    it('defaults to EN when no locale specified', () => {
      expect(getLocalizedUrl('/about')).toBe('/about');
    });
  });

  describe('ES locale', () => {
    it('returns path with /es prefix', () => {
      expect(getLocalizedUrl('/contacto', 'es')).toBe('/es/contacto');
    });
  });

  describe('path normalization', () => {
    it('adds leading slash if missing', () => {
      expect(getLocalizedUrl('contato', 'pt')).toBe('/pt/contato');
    });

    it('adds leading slash for EN locale', () => {
      expect(getLocalizedUrl('contact', 'en')).toBe('/contact');
    });

    it('handles path already starting with slash', () => {
      expect(getLocalizedUrl('/sobre', 'pt')).toBe('/pt/sobre');
    });

    it('handles root path', () => {
      expect(getLocalizedUrl('/', 'pt')).toBe('/pt');
      expect(getLocalizedUrl('/', 'en')).toBe('/');
    });

    it('handles empty path', () => {
      expect(getLocalizedUrl('', 'pt')).toBe('/pt');
      expect(getLocalizedUrl('', 'en')).toBe('/');
    });
  });

  describe('complex paths', () => {
    it('handles paths with query strings', () => {
      expect(getLocalizedUrl('/search?q=test', 'en')).toBe('/search?q=test');
    });

    it('handles paths with hash', () => {
      expect(getLocalizedUrl('/page#section', 'es')).toBe('/es/page#section');
    });

    it('handles deeply nested paths', () => {
      expect(getLocalizedUrl('/a/b/c/d', 'en')).toBe('/a/b/c/d');
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('URL consistency across functions', () => {
  it('getHomeUrl is consistent with getLocalizedUrl for root', () => {
    expect(getHomeUrl('en')).toBe('/');
    expect(getLocalizedUrl('', 'en')).toBe('/');
  });

  it('getBlogIndexUrl is consistent with getLocalizedUrl', () => {
    expect(getBlogIndexUrl('pt')).toBe(getLocalizedUrl('/blog', 'pt'));
    expect(getBlogIndexUrl('es')).toBe(getLocalizedUrl('/blog', 'es'));
  });

  it('all locales produce valid URLs', () => {
    const locales = ['pt', 'en', 'es'] as const;
    const slug = 'test-post';

    locales.forEach((locale) => {
      const blogPostUrl = getBlogPostUrl(slug, locale);
      const blogIndexUrl = getBlogIndexUrl(locale);
      const homeUrl = getHomeUrl(locale);

      // All URLs should start with /
      expect(blogPostUrl).toMatch(/^\//);
      expect(blogIndexUrl).toMatch(/^\//);
      expect(homeUrl).toMatch(/^\//);

      const prefix = locale === 'en' ? '' : locale === 'pt' ? '/pt' : `/${locale}`;
      if (prefix) {
        expect(blogPostUrl.startsWith(`${prefix}/blog`)).toBe(true);
        expect(blogIndexUrl.startsWith(`${prefix}/blog`)).toBe(true);
        expect(homeUrl).toBe(prefix);
      } else {
        expect(blogPostUrl.startsWith('/blog')).toBe(true);
        expect(blogIndexUrl).toBe('/blog');
        expect(homeUrl).toBe('/');
      }
    });
  });
});
