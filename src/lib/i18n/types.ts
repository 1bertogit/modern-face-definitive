/**
 * i18n Type Definitions
 *
 * Shared types used across all i18n modules.
 */

/** Supported locales */
export type Locale = 'pt' | 'en' | 'es';

/** Navigation link with optional dropdown children */
export interface NavLink {
  label: string;
  path: string;
  children?: NavLinkChild[];
}

/** Child link for navigation dropdowns */
export interface NavLinkChild {
  label: string;
  path: string;
}

/** Footer links organized by section */
export interface FooterLinks {
  tecnicas: NavLinkChild[];
  recursos: NavLinkChild[];
  institucional: NavLinkChild[];
}

/** Language option for switcher */
export interface LanguageOption {
  locale: Locale;
  name: string;
  path: string;
  isActive: boolean;
}
