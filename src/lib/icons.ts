/**
 * Icon mapping utilities for categories and UI elements
 * Replaces emojis with professional SVG icons
 */

export const categoryIcons: Record<string, string> = {
  // Portuguese categories
  'Técnicas Cirúrgicas': '/images/icons/category-surgical-techniques.svg',
  Anatomia: '/images/icons/category-anatomy.svg',
  Indicações: '/images/icons/category-indications.svg',
  Planejamento: '/images/icons/category-planning.svg',
  'Pós-Operatório': '/images/icons/category-post-operative.svg',
  'Face Moderna': '/images/icons/category-face-moderna.svg',
  'Segurança Cirúrgica': '/images/icons/category-safety.svg',
  Educação: '/images/icons/category-education.svg',
  Filosofia: '/images/icons/category-philosophy.svg',
  Resultados: '/images/icons/category-results.svg',
  Tecnologia: '/images/icons/category-technology.svg',
  Geral: '/images/icons/category-general.svg',
  'Técnicas Combinadas': '/images/icons/category-surgical-techniques.svg',
  'Técnica Cirúrgica': '/images/icons/category-surgical-techniques.svg',
  Comparativos: '/images/icons/category-indications.svg',

  // English categories
  'Surgical Techniques': '/images/icons/category-surgical-techniques.svg',
  Anatomy: '/images/icons/category-anatomy.svg',
  Indications: '/images/icons/category-indications.svg',
  Planning: '/images/icons/category-planning.svg',
  'Post-Operative': '/images/icons/category-post-operative.svg',
  'Surgical Safety': '/images/icons/category-safety.svg',
  Education: '/images/icons/category-education.svg',
  Philosophy: '/images/icons/category-philosophy.svg',
  Results: '/images/icons/category-results.svg',
  Technology: '/images/icons/category-technology.svg',
  General: '/images/icons/category-general.svg',

  // Spanish categories
  'Técnicas Quirúrgicas': '/images/icons/category-surgical-techniques.svg',
  Anatomía: '/images/icons/category-anatomy.svg',
  Indicaciones: '/images/icons/category-indications.svg',
  Planificación: '/images/icons/category-planning.svg',
  Postoperatorio: '/images/icons/category-post-operative.svg',
  'Seguridad Quirúrgica': '/images/icons/category-safety.svg',
  Educación: '/images/icons/category-education.svg',
  Filosofía: '/images/icons/category-philosophy.svg',
  Tecnología: '/images/icons/category-technology.svg',
};

/**
 * Get icon path for a category
 */
export function getCategoryIcon(category: string): string {
  return categoryIcons[category] || '/images/icons/category-general.svg';
}

/**
 * UI utility icons
 */
export const utilityIcons = {
  executiveSummary: '/images/icons/icon-executive-summary.svg',
  checkPositive: '/images/icons/icon-check-positive.svg',
  checkNegative: '/images/icons/icon-check-negative.svg',
  note: '/images/icons/icon-note.svg', // 💡
  location: '/images/icons/icon-location.svg', // 📍
  combine: '/images/icons/icon-combine.svg', // 🔄
  warning: '/images/icons/icon-warning.svg', // ⚠️
  star: '/images/icons/icon-star.svg', // ⭐
} as const;

/**
 * Logo paths
 */
export const logos = {
  faceModerna: '/images/logo-face-moderna.svg',
  favicon: '/favicon.svg',
} as const;
