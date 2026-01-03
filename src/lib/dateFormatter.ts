/**
 * Date formatting utilities
 * Centralized date formatting to avoid duplication across blog components
 */

import type { Locale } from './i18n';

/** Short month names by locale */
const SHORT_MONTHS: Record<Locale, string[]> = {
  pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};

/** Locale mapping for Intl.DateTimeFormat */
const INTL_LOCALE_MAP: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

/**
 * Format date in short format (e.g., "15 Jan 2024")
 * @param dateStr - ISO date string or Date object
 * @param locale - Target locale
 * @returns Formatted date string
 */
export function formatDateShort(dateStr: string | Date, locale: Locale = 'pt'): string {
  const dateObj = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const day = dateObj.getDate();
  const month =
    SHORT_MONTHS[locale]?.[dateObj.getMonth()] || SHORT_MONTHS['pt'][dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format date in long format using Intl.DateTimeFormat (e.g., "15 de janeiro de 2024")
 * @param dateStr - ISO date string or Date object
 * @param locale - Target locale
 * @returns Formatted date string
 */
export function formatDateLong(dateStr: string | Date, locale: Locale = 'pt'): string {
  const dateObj = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return dateObj.toLocaleDateString(INTL_LOCALE_MAP[locale] || 'pt-BR', options);
}

/**
 * Format date for machine-readable datetime attribute
 * @param dateStr - ISO date string or Date object
 * @returns ISO date string (YYYY-MM-DD)
 */
export function formatDateISO(dateStr: string | Date): string {
  const dateObj = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return dateObj.toISOString().split('T')[0];
}
