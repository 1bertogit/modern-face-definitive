/**
 * Blog utility functions
 * Helpers for blog post filtering, sorting, and URL generation
 */

import { getCollection, type CollectionEntry } from 'astro:content';

export type Locale = 'en' | 'pt' | 'es';

/**
 * Cache for blog posts to avoid repeated getCollection calls
 * Cleared on each build, so always fresh in production
 */
const blogPostsCache = new Map<Locale, CollectionEntry<'blog'>[]>();

/**
 * Blog labels for i18n
 */
const blogLabels: Record<
  Locale,
  {
    home: string;
    blog: string;
    readTime: string;
    creator: string;
    updated: string;
    faqTitle: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    ctaContact: string;
    related: string;
  }
> = {
  en: {
    home: 'Home',
    blog: 'Blog',
    readTime: 'read',
    creator: 'Creator of Face Moderna®',
    updated: 'Updated',
    faqTitle: 'Frequently Asked Questions',
    ctaTitle: 'Want to Master These Techniques?',
    ctaSubtitle: 'Learn directly from Dr. Robério Brandão in our specialized training programs.',
    ctaButton: 'Explore Training',
    ctaContact: 'Contact Us',
    related: 'Related Articles',
  },
  pt: {
    home: 'Início',
    blog: 'Blog',
    readTime: 'de leitura',
    creator: 'Criador da Face Moderna®',
    updated: 'Atualizado em',
    faqTitle: 'Perguntas Frequentes',
    ctaTitle: 'Quer Dominar Essas Técnicas?',
    ctaSubtitle: 'Aprenda diretamente com Dr. Robério Brandão em nossos cursos de especialização.',
    ctaButton: 'Conheça a Formação',
    ctaContact: 'Entre em Contato',
    related: 'Artigos Relacionados',
  },
  es: {
    home: 'Inicio',
    blog: 'Blog',
    readTime: 'de lectura',
    creator: 'Creador de Face Moderna®',
    updated: 'Actualizado',
    faqTitle: 'Preguntas Frecuentes',
    ctaTitle: '¿Quieres Dominar Estas Técnicas?',
    ctaSubtitle:
      'Aprende directamente con el Dr. Robério Brandão en nuestros programas de formación.',
    ctaButton: 'Explorar Formación',
    ctaContact: 'Contáctenos',
    related: 'Artículos Relacionados',
  },
};

/**
 * Get blog labels for a given locale
 */
export function getBlogLabels(locale: Locale) {
  return blogLabels[locale] || blogLabels['en'];
}

/**
 * Article type for display purposes
 */
export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string; // ISO string format
  author: string;
  image?: string;
  featured?: boolean;
}

/**
 * Convert a blog post to Article format
 */
export function postToArticle(post: CollectionEntry<'blog'>): Article {
  const slugParts = post.slug.split('/');
  const slug = slugParts.length > 1 ? slugParts.slice(1).join('/') : post.slug;

  // Converter Date para string ISO
  let dateStr: string;
  if (post.data.date instanceof Date) {
    dateStr = post.data.date.toISOString();
  } else if (typeof post.data.date === 'string') {
    dateStr = post.data.date;
  } else {
    // Fallback para data atual se inválida
    dateStr = new Date().toISOString();
  }

  return {
    slug,
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    readTime: post.data.readTime || '5 min',
    date: dateStr,
    author: post.data.author,
    image: typeof post.data.image === 'string' ? post.data.image : post.data.image?.src,
    featured: post.data.featured || false,
  };
}

/**
 * Get blog alternates for a given post (for hreflang)
 * Returns an array of locale-slug pairs
 */
export async function getBlogAlternates(
  canonicalSlug: string | undefined
): Promise<{ locale: Locale; slug: string; url: string }[]> {
  if (!canonicalSlug) return [];

  const posts = await getCollection(
    'blog',
    ({ data }) => data.canonicalSlug === canonicalSlug && !data.draft
  );

  return posts.map((post) => {
    const locale = post.data.locale as Locale;
    const slugParts = post.slug.split('/');
    const slug = slugParts.length > 1 ? slugParts.slice(1).join('/') : post.slug;

    // EN is default (no prefix), PT-BR uses /pt, ES uses /es
    let prefix = '';
    if (locale === 'pt') prefix = '/pt';
    else if (locale === 'es') prefix = '/es';

    return {
      locale,
      slug,
      url: `${prefix}/blog/${slug}`,
    };
  });
}

/**
 * Get a blog post by slug and locale
 * Uses cached blog posts for better performance
 */
export async function getBlogPostBySlug(
  slug: string,
  locale: Locale
): Promise<CollectionEntry<'blog'> | undefined> {
  const posts = await getBlogPostsByLocale(locale);

  // Try exact match first
  const exactMatch = posts.find((post) => {
    const slugParts = post.slug.split('/');
    const postSlug = slugParts.length > 1 ? slugParts.slice(1).join('/') : post.slug;
    return postSlug === slug;
  });

  if (exactMatch) return exactMatch;

  // Try canonicalSlug fallback
  return posts.find((post) => post.data.canonicalSlug === slug);
}

/**
 * Get related posts for a given post
 * Uses relatedPosts field or falls back to same category
 * Uses cached blog posts for better performance
 */
export async function getRelatedPosts(
  post: CollectionEntry<'blog'>,
  limit: number = 3
): Promise<CollectionEntry<'blog'>[]> {
  const locale = post.data.locale as Locale;
  const posts = await getBlogPostsByLocale(locale);

  // Exclude current post
  const otherPosts = posts.filter((p) => p.slug !== post.slug);

  // If post has relatedPosts, use those
  if (post.data.relatedPosts && post.data.relatedPosts.length > 0) {
    const related = otherPosts.filter((p) =>
      post.data.relatedPosts?.includes(p.data.canonicalSlug || '')
    );
    if (related.length > 0) {
      return related.slice(0, limit);
    }
  }

  // Fallback: same category (already sorted by date from cache)
  const sameCategory = otherPosts.filter((p) => p.data.category === post.data.category);

  return sameCategory.slice(0, limit);
}

/**
 * Get blog posts by locale
 * Results are cached for performance
 */
export async function getBlogPostsByLocale(locale: Locale): Promise<CollectionEntry<'blog'>[]> {
  // Check cache first
  const cached = blogPostsCache.get(locale);
  if (cached) {
    return cached;
  }

  // Fetch and cache
  const posts = await getCollection('blog', ({ data }) => data.locale === locale && !data.draft);

  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  blogPostsCache.set(locale, sorted);

  return sorted;
}

/**
 * Get featured posts
 * Uses cached blog posts for better performance
 */
export async function getFeaturedPosts(
  locale: Locale,
  limit: number = 3
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getBlogPostsByLocale(locale);

  return posts.filter((post) => post.data.featured).slice(0, limit);
}

/**
 * Get posts by category
 * Uses cached blog posts for better performance
 */
export async function getPostsByCategory(
  locale: Locale,
  category: string
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getBlogPostsByLocale(locale);

  return posts.filter((post) => post.data.category === category);
}

/**
 * Get all categories with post counts
 * Returns format: { name: string; slug: string; count: number }[]
 * Uses cached blog posts for better performance
 */
export async function getCategories(
  locale: Locale
): Promise<{ name: string; slug: string; count: number }[]> {
  const posts = await getBlogPostsByLocale(locale);

  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    const category = post.data.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  // Converter para slug: lowercase, substituir espaços por hífen
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({
      name: category,
      slug: slugify(category),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get popular posts (based on featured or recent)
 * Uses cached blog posts for better performance
 */
export async function getPopularPosts(
  locale: Locale,
  limit: number = 5
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getBlogPostsByLocale(locale);

  // Prioritize featured, then sort by date (already sorted from cache)
  return posts
    .sort((a, b) => {
      if (a.data.featured && !b.data.featured) return -1;
      if (!a.data.featured && b.data.featured) return 1;
      return 0; // Maintain existing date sort from cache
    })
    .slice(0, limit);
}

/**
 * Get articles for locale (returns Article[] format)
 */
export async function getArticlesForLocale(locale: Locale): Promise<Article[]> {
  const posts = await getBlogPostsByLocale(locale);
  return posts.map(postToArticle);
}

/**
 * Get popular articles (returns Article[] format)
 */
export async function getPopularArticles(locale: Locale, limit: number = 5): Promise<Article[]> {
  const posts = await getPopularPosts(locale, limit);
  return posts.map(postToArticle);
}
