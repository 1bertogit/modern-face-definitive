/**
 * Internationalization (i18n) Module
 *
 * Centralized exports for all i18n functionality.
 *
 * This module is organized into:
 * - types: Type definitions (Locale, NavLink, etc.)
 * - locales: Basic locale configuration
 * - paths: URL path utilities
 * - navigation: Nav and footer translations
 * - components: Component-specific translations
 */

// Types
export type { Locale, NavLink, NavLinkChild, FooterLinks, LanguageOption } from './types';

// Locale configuration
export { locales, defaultLocale, localeNames, localeFlags, ogLocales, htmlLang } from './locales';

// Path utilities
export {
  getLocaleFromUrl,
  getLocalePrefix,
  localizedPath,
  removeLocaleFromPath,
  translatePath,
  getAlternateUrls,
} from './paths';

// Navigation
export {
  navTranslations,
  footerTranslations,
  headerTranslations,
  menuAriaLabels,
  getNavLinks,
  getFooterLinks,
} from './navigation';

// Component translations
export { glossaryTranslations, timelineTranslations, commonTranslations } from './components';
