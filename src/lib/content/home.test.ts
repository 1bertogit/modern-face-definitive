import { describe, it, expect } from 'vitest';
import { homeContent, getHomeSchema, getHomePaths } from './home';

describe('homeContent', () => {
  it('has content for all locales', () => {
    expect(homeContent['pt']).toBeDefined();
    expect(homeContent['en']).toBeDefined();
    expect(homeContent['es']).toBeDefined();
  });

  it('each locale has required fields', () => {
    const locales = ['pt', 'en', 'es'] as const;

    locales.forEach((locale) => {
      const content = homeContent[locale];

      // Check hero
      expect(content.hero.badge).toBeTruthy();
      expect(content.hero.title).toBeTruthy();
      expect(content.hero.titleAccent).toBeTruthy();
      expect(content.hero.subtitle).toBeTruthy();
      expect(content.hero.ctaPrimary).toBeTruthy();
      expect(content.hero.ctaSecondary).toBeTruthy();

      // Check quote
      expect(content.quote).toBeTruthy();

      // Check stats
      expect(content.stats).toHaveLength(4);
      content.stats.forEach((stat) => {
        expect(stat.value).toBeTruthy();
        expect(stat.label).toBeTruthy();
      });

      // Check techniques
      expect(content.techniques).toHaveLength(3);
      content.techniques.forEach((tech) => {
        expect(tech.title).toBeTruthy();
        expect(tech.description).toBeTruthy();
        expect(tech.image).toBeTruthy();
        expect(tech.href).toBeTruthy();
      });

      // Check CTA
      expect(content.cta.title).toBeTruthy();
      expect(content.cta.subtitle).toBeTruthy();
      expect(content.cta.button).toBeTruthy();
    });
  });

  it('techniques have valid href paths', () => {
    // PT-BR uses /pt prefix (not default locale)
    expect(homeContent['pt'].techniques[0].href).toBe('/pt/tecnicas/endomidface');
    // EN is default locale (no prefix)
    expect(homeContent['en'].techniques[0].href).toBe('/techniques/endomidface');
    // ES uses /es prefix
    expect(homeContent['es'].techniques[0].href).toBe('/es/tecnicas/endomidface');
  });
});

describe('getHomeSchema', () => {
  it('returns valid schema for each locale', () => {
    const locales = ['pt', 'en', 'es'] as const;

    locales.forEach((locale) => {
      const schema = getHomeSchema(locale);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Person');
      expect(schema.name).toBe('Dr. Robério Brandão');
      expect(schema.alternateName).toBeTruthy();
      expect(schema.jobTitle).toBeTruthy();
      expect(schema.description).toBeTruthy();
      expect(schema.knowsAbout).toBeInstanceOf(Array);
      expect(schema.url).toContain('drroberiobrandao.com');
    });
  });

  it('PT-BR schema has correct URL with /pt prefix', () => {
    const schema = getHomeSchema('pt');
    expect(schema.url).toBe('https://drroberiobrandao.com/pt');
  });

  it('EN schema has correct URL without prefix (default locale)', () => {
    const schema = getHomeSchema('en');
    expect(schema.url).toBe('https://drroberiobrandao.com');
  });

  it('ES schema has correct URL with prefix', () => {
    const schema = getHomeSchema('es');
    expect(schema.url).toBe('https://drroberiobrandao.com/es');
  });
});

describe('getHomePaths', () => {
  it('returns correct paths for PT-BR (with /pt prefix)', () => {
    const paths = getHomePaths('pt');
    expect(paths.training).toBe('/pt/formacao');
    expect(paths.method).toBe('/pt/face-moderna');
  });

  it('returns correct paths for EN (no prefix - default locale)', () => {
    const paths = getHomePaths('en');
    expect(paths.training).toBe('/training/endomidface-course');
    expect(paths.method).toBe('/modern-face');
  });

  it('returns correct paths for ES (with /es prefix)', () => {
    const paths = getHomePaths('es');
    expect(paths.training).toBe('/es/formacion/curso-endomidface');
    expect(paths.method).toBe('/es/face-moderna');
  });
});
