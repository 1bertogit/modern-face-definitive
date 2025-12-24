/**
 * Locale Configuration
 *
 * Basic locale settings and mappings.
 */

import type { Locale } from './types';

export const locales: Locale[] = ['en', 'pt', 'es'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  'pt': 'Português',
  en: 'English',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  'pt': '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸',
};

/** OpenGraph locale format mapping */
export const ogLocales: Record<Locale, string> = {
  'pt': 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
};

/** HTML lang attribute mapping */
export const htmlLang: Record<Locale, string> = {
  'pt': 'pt-BR',
  en: 'en',
  es: 'es',
};
