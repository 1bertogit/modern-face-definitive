/**
 * Site URL utilities
 * Centralized site URL handling to avoid duplication across schema components
 */

/** Default site URL for Face Moderna website */
export const DEFAULT_SITE_URL = 'https://drroberiobrandao.com';

/**
 * Get the site URL from Astro's site config or fallback to default
 * @param astroSite - Astro.site value (may be undefined)
 * @returns Normalized site URL without trailing slash
 */
export function getSiteUrl(astroSite: URL | undefined): string {
  return astroSite?.toString().replace(/\/$/, '') || DEFAULT_SITE_URL;
}

/**
 * Build a full URL from a path
 * @param siteUrl - Base site URL
 * @param path - Path to append (should start with /)
 * @returns Full URL
 */
export function buildFullUrl(siteUrl: string, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}
