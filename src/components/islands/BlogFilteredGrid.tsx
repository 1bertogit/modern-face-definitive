/**
 * BlogFilteredGrid.tsx
 * Client-side filterable blog grid that handles both category and search filtering
 * Reads URL params on load and updates grid dynamically
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getBlogPostUrl } from '@/lib/urlBuilders';

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  image?: string;
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface Props {
  articles: Article[];
  categories: Category[];
  locale?: 'pt' | 'en' | 'es';
  showFeatured?: boolean;
}

const translations = {
  'pt': {
    allCategories: 'Todas as Categorias',
    noResults: 'Nenhum artigo encontrado nesta categoria.',
    showingArticles: (count: number, total: number) =>
      count === total ? `${count} artigos` : `${count} de ${total} artigos`,
    readMore: 'Continuar lendo',
    filterBy: 'Filtrar por:',
  },
  en: {
    allCategories: 'All Categories',
    noResults: 'No articles found in this category.',
    showingArticles: (count: number, total: number) =>
      count === total ? `${count} articles` : `${count} of ${total} articles`,
    readMore: 'Continue reading',
    filterBy: 'Filter by:',
  },
  es: {
    allCategories: 'Todas las Categorías',
    noResults: 'No se encontraron artículos en esta categoría.',
    showingArticles: (count: number, total: number) =>
      count === total ? `${count} artículos` : `${count} de ${total} artículos`,
    readMore: 'Seguir leyendo',
    filterBy: 'Filtrar por:',
  },
};

// Slugify function matching the one in blog-utils.ts
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

export default function BlogFilteredGrid({
  articles,
  categories,
  locale = 'en',
  showFeatured = true,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const t = translations[locale] || translations.en;

  // Read URL params on client mount
  useEffect(() => {
    setIsClient(true);
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('categoria');
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    }
  }, []);

  // Update URL when category changes (without page reload)
  const handleCategoryChange = useCallback(
    (categorySlug: string | null) => {
      setSelectedCategory(categorySlug);

      // Update URL without reload
      const url = new URL(window.location.href);
      if (categorySlug) {
        url.searchParams.set('categoria', categorySlug);
      } else {
        url.searchParams.delete('categoria');
      }
      window.history.pushState({}, '', url.toString());
    },
    []
  );

  // Filter articles based on selected category
  const filteredArticles = useMemo(() => {
    if (!selectedCategory) {
      return articles;
    }

    return articles.filter((article) => {
      const articleCategorySlug = slugify(article.category);
      return articleCategorySlug === selectedCategory.toLowerCase();
    });
  }, [articles, selectedCategory]);

  // Separate featured from regular articles
  const featuredArticle = showFeatured ? filteredArticles.find((a) => a.featured) : null;
  const regularArticles = showFeatured
    ? filteredArticles.filter((a) => !a.featured)
    : filteredArticles;

  const getUrl = useCallback((slug: string) => getBlogPostUrl(slug, locale), [locale]);

  // Show loading state during hydration to prevent flash
  if (!isClient) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-gray-100 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Category Filter - Editorial Style */}
      <div className="border-b border-gray-100">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-warmGray font-medium">
              {t.filterBy}
            </span>
            <span className="w-8 h-px bg-gray-200" aria-hidden="true" />
          </div>

          {selectedCategory && (
            <button
              onClick={() => handleCategoryChange(null)}
              className="group flex items-center gap-2 text-[11px] uppercase tracking-wider text-warmGray
                         hover:text-primary-900 transition-colors duration-300"
            >
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center
                             group-hover:bg-primary-900 group-hover:border-primary-900 group-hover:text-white
                             transition-all duration-300">
                <span className="text-[10px] leading-none">×</span>
              </span>
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Category Links - Horizontal Scroll on Mobile */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1 overflow-x-auto pb-4 hide-scrollbar sm:flex-wrap sm:gap-0">
            {/* All Categories */}
            <button
              onClick={() => handleCategoryChange(null)}
              className={`relative flex-shrink-0 px-4 py-2.5 text-[13px] tracking-wide transition-all duration-300
                ${
                  !selectedCategory
                    ? 'text-primary-900 font-medium'
                    : 'text-warmGray hover:text-primary-900'
                }`}
            >
              <span className="relative z-10">{t.allCategories}</span>
              {/* Active Indicator */}
              <span
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-accent-500 transition-all duration-300
                  ${!selectedCategory ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
              />
            </button>

            {/* Separator */}
            <span className="hidden sm:flex items-center px-2 text-gray-200">|</span>

            {/* Category Buttons */}
            {categories.map((category, index) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
                className={`relative flex-shrink-0 group px-4 py-2.5 text-[13px] tracking-wide transition-all duration-300
                  ${
                    selectedCategory === category.slug
                      ? 'text-primary-900 font-medium'
                      : 'text-warmGray hover:text-primary-900'
                  }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {category.name}
                  <span
                    className={`text-[10px] tabular-nums transition-colors duration-300
                      ${
                        selectedCategory === category.slug
                          ? 'text-accent-600'
                          : 'text-gray-300 group-hover:text-warmGray'
                      }`}
                  >
                    {category.count}
                  </span>
                </span>
                {/* Active Indicator */}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-0.5 bg-accent-500 transition-all duration-300
                    ${selectedCategory === category.slug ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                />
                {/* Hover Indicator */}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-px bg-gray-200 transition-opacity duration-300
                    ${selectedCategory === category.slug ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
                />
              </button>
            ))}
          </div>

          {/* Scroll Fade Indicators (mobile) */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-ivory to-transparent pointer-events-none sm:hidden" />
        </div>
      </div>

      {/* Results Count - Minimal */}
      <div className="flex items-center gap-4">
        <p className="text-[13px] text-warmGray">
          <span className="text-primary-900 font-medium">{filteredArticles.length}</span>
          <span className="mx-1">/</span>
          <span>{articles.length}</span>
          <span className="ml-1.5 text-warmGray">
            {locale === 'pt' ? 'artigos' : locale === 'es' ? 'artículos' : 'articles'}
          </span>
        </p>
        {selectedCategory && (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-50 rounded text-[11px] text-accent-700 font-medium uppercase tracking-wider">
            {categories.find(c => c.slug === selectedCategory)?.name}
          </span>
        )}
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <article className="group bg-ivory hover:bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <a href={getUrl(featuredArticle.slug)} className="flex flex-col lg:flex-row">
            {featuredArticle.image && (
              <div className="lg:w-1/2 aspect-[16/9] lg:aspect-auto overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] uppercase tracking-widest text-accent-600 font-medium">
                  Featured
                </span>
                <span className="text-[10px] uppercase tracking-widest text-warmGray">
                  {featuredArticle.category}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-serif text-primary-900 group-hover:text-accent-600 transition-colors duration-300 mb-4">
                {featuredArticle.title}
              </h2>
              <p className="text-warmGray leading-relaxed mb-4 line-clamp-2">
                {featuredArticle.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-warmGray">
                <span>{featuredArticle.readTime}</span>
                <span>{new Date(featuredArticle.date).toLocaleDateString(locale)}</span>
              </div>
            </div>
          </a>
        </article>
      )}

      {/* Regular Articles Grid */}
      {regularArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {regularArticles.map((article) => (
            <article
              key={article.slug}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <a href={getUrl(article.slug)} className="block">
                {article.image && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-widest text-accent-600 font-medium">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-serif text-primary-900 group-hover:text-accent-600 transition-colors duration-300 mt-2 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-warmGray line-clamp-2 mb-4">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-warmGray">
                    <span>{article.readTime}</span>
                    <span className="flex items-center gap-1 text-accent-600 group-hover:gap-2 transition-all duration-300">
                      {t.readMore}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span
            className="material-symbols-outlined text-6xl text-primary-200 mb-4 block"
            aria-hidden="true"
          >
            article
          </span>
          <p className="text-warmGray">{t.noResults}</p>
          <button
            onClick={() => handleCategoryChange(null)}
            className="mt-4 text-accent-600 hover:text-accent-700 hover:underline"
          >
            {t.allCategories}
          </button>
        </div>
      )}
    </div>
  );
}
