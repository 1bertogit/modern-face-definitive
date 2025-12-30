/**
 * Date formatting utilities
 * Centralized date formatting to avoid duplication across blog components
 */

import type { Locale } from './i18n';

/** Short month names by locale */
const SHORT_MONTHS: Record<Locale, string[]> = {
  'pt': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};

/** Locale mapping for Intl.DateTimeFormat */
const INTL_LOCALE_MAP: Record<Locale, string> = {
  'pt': 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

/**
 * Format date in short format (e.g., "15 Jan 2024")
 * @param dateInput - ISO date string or Date object
 * @param locale - Target locale
 * @returns Formatted date string
 */
export function formatDateShort(dateInput: string | Date, locale: Locale = 'pt'): string {
  const parsedDate = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const day = parsedDate.getDate();
  const month =
    SHORT_MONTHS[locale]?.[parsedDate.getMonth()] || SHORT_MONTHS['pt'][parsedDate.getMonth()];
  const year = parsedDate.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format date in long format using Intl.DateTimeFormat (e.g., "15 de janeiro de 2024")
 * @param dateInput - ISO date string or Date object
 * @param locale - Target locale
 * @returns Formatted date string
 */
export function formatDateLong(dateInput: string | Date, locale: Locale = 'pt'): string {
  const parsedDate = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return parsedDate.toLocaleDateString(INTL_LOCALE_MAP[locale] || 'pt-BR', options);
}

/**
 * Format date for machine-readable datetime attribute
 * @param dateInput - ISO date string or Date object
 * @returns ISO date string (YYYY-MM-DD)
 */
export function formatDateISO(dateInput: string | Date): string {
  const parsedDate = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return parsedDate.toISOString().split('T')[0];
}
