/**
 * Blog utility functions
 * Helpers for blog post filtering, sorting, and URL generation
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { blogPostLabels } from './content/blog';

export type Locale = 'en' | 'pt' | 'es';

/**
 * Get blog labels for a given locale
 * Re-exports from centralized content for backwards compatibility
 */
export function getBlogLabels(locale: Locale) {
  const labels = blogPostLabels[locale] || blogPostLabels['en'];
  // Return format compatible with existing code
  return {
    home: labels.home,
    blog: labels.blog,
    readTime: labels.readTime,
    creator: labels.creator,
    updated: labels.updated,
    faqTitle: labels.faqTitle,
    ctaTitle: labels.ctaTitle,
    ctaSubtitle: labels.ctaSubtitle,
    ctaButton: labels.ctaButton,
    ctaContact: labels.ctaContact,
    related: labels.related,
  };
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
    image: typeof post.data.image === 'string' 
      ? post.data.image 
      : post.data.image?.src,
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
 */
export async function getBlogPostBySlug(
  slug: string,
  locale: Locale
): Promise<CollectionEntry<'blog'> | undefined> {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.locale === locale && !data.draft
  );

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
 */
export async function getRelatedPosts(
  post: CollectionEntry<'blog'>,
  limit: number = 3
): Promise<CollectionEntry<'blog'>[]> {
  const locale = post.data.locale as Locale;
  const posts = await getCollection(
    'blog',
    ({ data }) => data.locale === locale && !data.draft
  );

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

  // Fallback: same category
  const sameCategory = otherPosts
    .filter((p) => p.data.category === post.data.category)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return sameCategory.slice(0, limit);
}

/**
 * Get blog posts by locale
 */
export async function getBlogPostsByLocale(
  locale: Locale
): Promise<CollectionEntry<'blog'>[]> {
  // Debug: obter todos os posts primeiro
  const allPosts = await getCollection('blog');
  
  // Filtrar manualmente para debug
  const postsWithLocale = allPosts.filter(({ data }) => {
    const postLocale = data.locale as Locale;
    return postLocale === locale;
  });
  
  const postsNoDraft = postsWithLocale.filter(({ data }) => !data.draft);
  
  // Debug: Log para inglês e português (para diagnóstico)
  // Remover após diagnóstico
  if ((locale === 'en' || locale === 'pt') && typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(`[DEBUG getBlogPostsByLocale] Locale: ${locale}`);
    console.warn(`[DEBUG] Total posts na collection: ${allPosts.length}`);
    console.warn(`[DEBUG] Posts com locale='${locale}': ${postsWithLocale.length}`);
    console.warn(`[DEBUG] Posts com locale='${locale}' e !draft: ${postsNoDraft.length}`);
    
    // Verificar posts com locale diferente
    const postsPt = allPosts.filter(({ data }) => data.locale === 'pt' && !data.draft);
    const postsEs = allPosts.filter(({ data }) => data.locale === 'es' && !data.draft);
    const postsOther = allPosts.filter(({ data }) => {
      const loc = data.locale as Locale;
      return loc !== 'en' && loc !== 'pt' && loc !== 'es' && !data.draft;
    });
    const postsNoLocale = allPosts.filter(({ data }) => !data.locale && !data.draft);
    
    console.warn(`[DEBUG] Posts pt: ${postsPt.length}`);
    console.warn(`[DEBUG] Posts es: ${postsEs.length}`);
    console.warn(`[DEBUG] Posts outro locale: ${postsOther.length}`);
    console.warn(`[DEBUG] Posts sem locale: ${postsNoLocale.length}`);
    
    // Verificar posts com draft
    const postsDraft = allPosts.filter(({ data }) => data.draft === true);
    console.warn(`[DEBUG] Posts com draft=true: ${postsDraft.length}`);
  }

  return postsNoDraft.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(
  locale: Locale,
  limit: number = 3
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.locale === locale && !data.draft && data.featured
  );

  return posts
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, limit);
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(
  locale: Locale,
  category: string
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.locale === locale && !data.draft && data.category === category
  );

  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Get all categories with post counts
 * Returns format: { name: string; slug: string; count: number }[]
 */
export async function getCategories(
  locale: Locale
): Promise<{ name: string; slug: string; count: number }[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.locale === locale && !data.draft
  );

  const categoryMap = new Map<string, number>();

  posts.forEach((post) => {
    const category = post.data.category;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  // Converter para slug: lowercase, substituir espaços por hífen
  const slugify = (text: string): string => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
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
 */
export async function getPopularPosts(
  locale: Locale,
  limit: number = 5
): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection(
    'blog',
    ({ data }) => data.locale === locale && !data.draft
  );

  // Prioritize featured, then sort by date
  return posts
    .sort((a, b) => {
      if (a.data.featured && !b.data.featured) return -1;
      if (!a.data.featured && b.data.featured) return 1;
      return b.data.date.getTime() - a.data.date.getTime();
    })
    .slice(0, limit);
}

/**
 * Get articles for locale (returns Article[] format)
 */
export async function getArticlesForLocale(locale: Locale): Promise<Article[]> {
  const posts = await getBlogPostsByLocale(locale);
  
  // Debug: verificar conversão (remover após diagnóstico)
  if ((locale === 'en' || locale === 'pt') && typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(`[DEBUG getArticlesForLocale] Posts recebidos: ${posts.length}`);
    
    // Tentar converter e verificar erros
    const articles: Article[] = [];
    const errors: string[] = [];
    
    for (const post of posts) {
      try {
        const article = postToArticle(post);
        articles.push(article);
      } catch (error) {
        errors.push(`${post.slug}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    console.warn(`[DEBUG] Artigos convertidos com sucesso: ${articles.length}`);
    if (errors.length > 0) {
      console.warn(`[DEBUG] Erros na conversão: ${errors.length}`);
      errors.slice(0, 5).forEach(err => console.warn(`  - ${err}`));
    }
    
    return articles;
  }
  
  return posts.map(postToArticle);
}

/**
 * Get popular articles (returns Article[] format)
 */
export async function getPopularArticles(
  locale: Locale,
  limit: number = 5
): Promise<Article[]> {
  const posts = await getPopularPosts(locale, limit);
  return posts.map(postToArticle);
}
