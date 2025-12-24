/**
 * Environment Variable Validation
 *
 * Provides type-safe access to environment variables with validation.
 * Logs warnings in development for missing optional variables.
 */

import { z } from 'zod';

// ============================================================================
// Environment Variable Schema
// ============================================================================

/**
 * Schema for public environment variables (exposed to client)
 */
const publicEnvSchema = z.object({
  PUBLIC_SITE_URL: z.string().url().default('https://drroberiobrandao.com'),
  PUBLIC_GA_ID: z.string().optional(),
  PUBLIC_GTM_ID: z.string().optional(),
  PUBLIC_GSC_VERIFICATION: z.string().optional(),
  PUBLIC_BING_VERIFICATION: z.string().optional(),
  PUBLIC_YANDEX_VERIFICATION: z.string().optional(),
  PUBLIC_INDEXNOW_KEY: z.string().optional(),
  PUBLIC_WEB3FORMS_KEY: z.string().optional(),
});

/**
 * Schema for server-only environment variables (never exposed to client)
 */
const serverEnvSchema = z.object({
  GOOGLE_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Combined schema
const envSchema = publicEnvSchema.merge(serverEnvSchema);

// ============================================================================
// Types
// ============================================================================

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type Env = z.infer<typeof envSchema>;

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate and return typed environment variables
 * Only validates at runtime in Node.js environment
 */
export function validateEnv(): Env {
  // Get environment variables from import.meta.env (Astro/Vite)
  const env = {
    PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL,
    PUBLIC_GA_ID: import.meta.env.PUBLIC_GA_ID,
    PUBLIC_GTM_ID: import.meta.env.PUBLIC_GTM_ID,
    PUBLIC_GSC_VERIFICATION: import.meta.env.PUBLIC_GSC_VERIFICATION,
    PUBLIC_BING_VERIFICATION: import.meta.env.PUBLIC_BING_VERIFICATION,
    PUBLIC_YANDEX_VERIFICATION: import.meta.env.PUBLIC_YANDEX_VERIFICATION,
    PUBLIC_INDEXNOW_KEY: import.meta.env.PUBLIC_INDEXNOW_KEY,
    PUBLIC_WEB3FORMS_KEY: import.meta.env.PUBLIC_WEB3FORMS_KEY,
    GOOGLE_API_KEY: import.meta.env.GOOGLE_API_KEY,
    OPENAI_API_KEY: import.meta.env.OPENAI_API_KEY,
    NODE_ENV: import.meta.env.MODE || 'development',
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  return result.data;
}

/**
 * Check if required environment variables are set
 * Logs warnings for missing optional variables in development
 */
export function checkEnvSetup(): {
  isValid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Required in production
  if (!import.meta.env.PUBLIC_SITE_URL) {
    missing.push('PUBLIC_SITE_URL');
  }

  // Recommended for analytics
  if (!import.meta.env.PUBLIC_GA_ID && !import.meta.env.PUBLIC_GTM_ID) {
    warnings.push('No analytics configured (PUBLIC_GA_ID or PUBLIC_GTM_ID)');
  }

  // Recommended for SEO
  if (!import.meta.env.PUBLIC_GSC_VERIFICATION) {
    warnings.push('Google Search Console verification not set (PUBLIC_GSC_VERIFICATION)');
  }

  // Recommended for contact form
  if (!import.meta.env.PUBLIC_WEB3FORMS_KEY) {
    warnings.push('Contact form API key not set (PUBLIC_WEB3FORMS_KEY)');
  }

  // Log warnings in development
  if (import.meta.env.DEV && warnings.length > 0) {
    // Using console for development warnings
    console.warn('[Env] Missing recommended environment variables:');
    warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

// ============================================================================
// Typed Environment Access
// ============================================================================

/**
 * Get site URL with fallback
 */
export function getSiteUrl(): string {
  return import.meta.env.PUBLIC_SITE_URL || 'https://drroberiobrandao.com';
}

/**
 * Check if analytics is configured
 */
export function isAnalyticsEnabled(): boolean {
  return !!(import.meta.env.PUBLIC_GA_ID || import.meta.env.PUBLIC_GTM_ID);
}

/**
 * Check if contact form is configured
 */
export function isContactFormEnabled(): boolean {
  return !!import.meta.env.PUBLIC_WEB3FORMS_KEY;
}

/**
 * Check if we're in development mode
 */
export function isDev(): boolean {
  return import.meta.env.DEV === true;
}

/**
 * Check if we're in production mode
 */
export function isProd(): boolean {
  return import.meta.env.PROD === true;
}
