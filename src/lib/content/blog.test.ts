/**
 * Tests for blog content centralization
 */
import { describe, it, expect } from 'vitest';
import {
  blogIndexContent,
  blogPostLabels,
  getBlogIndexContent,
  getBlogPostLabels,
  getLocaleUrlPrefix,
  getBlogIndexBreadcrumbs,
} from './blog';
import type { Locale } from '@lib/i18n';

const locales: Locale[] = ['en', 'pt', 'es'];

describe('Blog Content', () => {
  describe('blogIndexContent', () => {
    it('should have content for all locales', () => {
      locales.forEach((locale) => {
        expect(blogIndexContent[locale]).toBeDefined();
      });
    });

    it('should have required fields for each locale', () => {
      locales.forEach((locale) => {
        const content = blogIndexContent[locale];
        expect(content.breadcrumbs).toBeDefined();
        expect(content.breadcrumbs.home).toBeTruthy();
        expect(content.breadcrumbs.blog).toBeTruthy();
        expect(content.title).toBeTruthy();
        expect(content.description).toBeTruthy();
        expect(content.seo).toBeDefined();
        expect(content.seo.title).toBeTruthy();
        expect(content.seo.description).toBeTruthy();
        expect(content.seo.keywords).toBeInstanceOf(Array);
        expect(content.cta).toBeDefined();
        expect(content.cta.title).toBeTruthy();
        expect(content.cta.subtitle).toBeTruthy();
        expect(content.cta.button).toBeTruthy();
        expect(content.cta.href).toBeTruthy();
        expect(content.categoryParam).toBeTruthy();
      });
    });

    it('should have correct CTA hrefs per locale', () => {
      expect(blogIndexContent['en'].cta.href).toBe('/education');
      expect(blogIndexContent['pt'].cta.href).toBe('/pt/educacao');
      expect(blogIndexContent['es'].cta.href).toBe('/es/educacion');
    });
  });

  describe('blogPostLabels', () => {
    it('should have labels for all locales', () => {
      locales.forEach((locale) => {
        expect(blogPostLabels[locale]).toBeDefined();
      });
    });

    it('should have required fields for each locale', () => {
      locales.forEach((locale) => {
        const labels = blogPostLabels[locale];
        expect(labels.home).toBeTruthy();
        expect(labels.blog).toBeTruthy();
        expect(labels.readTime).toBeTruthy();
        expect(labels.creator).toBeTruthy();
        expect(labels.updated).toBeTruthy();
        expect(labels.faqTitle).toBeTruthy();
        expect(labels.ctaTitle).toBeTruthy();
        expect(labels.ctaSubtitle).toBeTruthy();
        expect(labels.ctaButton).toBeTruthy();
        expect(labels.ctaContact).toBeTruthy();
        expect(labels.related).toBeTruthy();
        expect(labels.dateLocale).toBeTruthy();
        expect(labels.paths).toBeDefined();
      });
    });

    it('should have correct paths per locale', () => {
      expect(blogPostLabels['en'].paths.home).toBe('/');
      expect(blogPostLabels['en'].paths.blog).toBe('/blog');
      expect(blogPostLabels['pt'].paths.home).toBe('/pt');
      expect(blogPostLabels['pt'].paths.blog).toBe('/pt/blog');
      expect(blogPostLabels['es'].paths.home).toBe('/es');
      expect(blogPostLabels['es'].paths.blog).toBe('/es/blog');
    });

    it('should have correct date locales', () => {
      expect(blogPostLabels['en'].dateLocale).toBe('en-US');
      expect(blogPostLabels['pt'].dateLocale).toBe('pt-BR');
      expect(blogPostLabels['es'].dateLocale).toBe('es-ES');
    });
  });

  describe('getBlogIndexContent', () => {
    it('should return correct content for each locale', () => {
      locales.forEach((locale) => {
        const content = getBlogIndexContent(locale);
        expect(content).toEqual(blogIndexContent[locale]);
      });
    });
  });

  describe('getBlogPostLabels', () => {
    it('should return correct labels for each locale', () => {
      locales.forEach((locale) => {
        const labels = getBlogPostLabels(locale);
        expect(labels).toEqual(blogPostLabels[locale]);
      });
    });
  });

  describe('getLocaleUrlPrefix', () => {
    it('should return empty string for English', () => {
      expect(getLocaleUrlPrefix('en')).toBe('');
    });

    it('should return /pt for Portuguese', () => {
      expect(getLocaleUrlPrefix('pt')).toBe('/pt');
    });

    it('should return /es for Spanish', () => {
      expect(getLocaleUrlPrefix('es')).toBe('/es');
    });
  });

  describe('getBlogIndexBreadcrumbs', () => {
    it('should return correct breadcrumbs for English', () => {
      const breadcrumbs = getBlogIndexBreadcrumbs('en');
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({ name: 'Home', url: '/' });
      expect(breadcrumbs[1]).toEqual({ name: 'Blog', url: '/blog' });
    });

    it('should return correct breadcrumbs for Portuguese', () => {
      const breadcrumbs = getBlogIndexBreadcrumbs('pt');
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({ name: 'Início', url: '/pt' });
      expect(breadcrumbs[1]).toEqual({ name: 'Blog', url: '/pt/blog' });
    });

    it('should return correct breadcrumbs for Spanish', () => {
      const breadcrumbs = getBlogIndexBreadcrumbs('es');
      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toEqual({ name: 'Inicio', url: '/es' });
      expect(breadcrumbs[1]).toEqual({ name: 'Blog', url: '/es/blog' });
    });
  });
});
