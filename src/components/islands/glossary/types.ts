/**
 * Glossary component type definitions
 */

export interface TermoDestaque {
  term: string;
  category: string;
  subcategory: string;
  image: string;
  description: string;
  additionalText?: string;
  benefits?: string[];
}

export interface TermoGeral {
  term: string;
  letter: string;
  description: string;
  link: string;
  linkText: string;
}
