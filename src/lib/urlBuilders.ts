/**
 * URL builder utilities
 * Centralized locale-aware URL generation to avoid duplication
 */

import type { Locale } from './i18n';

/**
 * Build a blog post URL
 * @param slug - Blog post slug
 * @param locale - Target locale
 * @returns Localized blog post URL
 */
export function getBlogPostUrl(slug: string, locale:  Locale = 'en'): string {
  if (locale === 'en') return `/blog/${slug}`;
  if (locale === 'pt') return `/pt/blog/${slug}`;
  return `/${locale}/blog/${slug}`;
}

/**
 * Build a blog index URL
 * @param locale - Target locale
 * @returns Localized blog index URL
 */
export function getBlogIndexUrl(locale: Locale = 'en'): string {
  if (locale === 'en') return '/blog';
  if (locale === 'pt') return '/pt/blog';
  return `/${locale}/blog`;
}

/**
 * Build a blog category URL
 * @param categorySlug - Category slug for filtering
 * @param locale - Target locale
 * @returns Localized blog category URL with query parameter
 */
export function getBlogCategoryUrl(categorySlug: string, locale:  Locale = 'en'): string {
  const baseUrl = getBlogIndexUrl(locale);
  return `${baseUrl}?categoria=${categorySlug}`;
}

/**
 * Build the home URL
 * @param locale - Target locale
 * @returns Localized home URL
 */
export function getHomeUrl(locale: Locale = 'en'): string {
  if (locale === 'en') return '/';
  if (locale === 'pt') return '/pt';
  return `/${locale}`;
}

/**
 * Build a generic localized URL
 * @param path - Path without locale prefix (e.g., '/contato')
 * @param locale - Target locale
 * @returns Localized URL
 */
export function getLocalizedUrl(path: string, locale: Locale = 'en'): string {
  // Handle empty or root path
  if (!path || path === '/') {
    return getHomeUrl(locale);
  }

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (locale === 'en') return normalizedPath;
  if (locale === 'pt') return `/pt${normalizedPath}`;
  return `/${locale}${normalizedPath}`;
}