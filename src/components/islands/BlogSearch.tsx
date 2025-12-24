/**
 * BlogSearch.tsx
 * Componente React para busca client-side em artigos do blog
 * Filtra por título e descrição em tempo real com debounce
 */

import { useState, useCallback, useId, useMemo, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { getBlogPostUrl } from '@/lib/urlBuilders';

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
}

interface Props {
  articles: Article[];
  locale?: 'pt' | 'en' | 'es';
  onResults?: (results: Article[]) => void;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
}

const translations = {
  'pt': {
    placeholder: 'Buscar artigos...',
    noResults: 'Nenhum resultado encontrado',
    resultsCount: (count: number) =>
      `${count} artigo${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`,
  },
  en: {
    placeholder: 'Search articles...',
    noResults: 'No results found',
    resultsCount: (count: number) => `${count} article${count !== 1 ? 's' : ''} found`,
  },
  es: {
    placeholder: 'Buscar artículos...',
    noResults: 'No se encontraron resultados',
    resultsCount: (count: number) =>
      `${count} artículo${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`,
  },
};

export default function BlogSearch({
  articles,
  locale = 'en',
  onResults,
  debounceMs = 300,
}: Props) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const inputId = useId();
  const t = translations[locale] || translations.en;

  // Debounce the search query for better performance
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  // Memoized filtered results based on debounced query
  const results = useMemo(() => {
    if (debouncedQuery.trim().length < 2) {
      return [];
    }

    const searchTerm = debouncedQuery.toLowerCase().trim();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.description.toLowerCase().includes(searchTerm) ||
        article.category.toLowerCase().includes(searchTerm)
    );
  }, [articles, debouncedQuery]);

  // Notify parent when results change
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      onResults?.(articles);
    } else {
      onResults?.(results);
    }
  }, [results, articles, debouncedQuery, onResults]);

  const getUrl = useCallback((slug: string) => getBlogPostUrl(slug, locale), [locale]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setShowResults(false);
  }, []);

  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        {t.placeholder}
      </label>

      <div className="relative">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-softGray material-symbols-outlined text-lg pointer-events-none"
          aria-hidden="true"
        >
          search
        </span>

        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder={t.placeholder}
          className="w-full pl-12 pr-10 py-3 bg-ivory border border-gray-200 rounded-lg
                     text-sm text-warmGray placeholder:text-softGray
                     focus:outline-none focus:ring-2 focus:ring-accent-600/20 focus:border-accent-600
                     transition-all duration-300"
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-softGray
                       hover:text-primary-900 transition-colors duration-300"
            aria-label={
              locale === 'pt'
                ? 'Limpar busca'
                : locale === 'en'
                  ? 'Clear search'
                  : 'Limpiar búsqueda'
            }
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showResults && query.length >= 2 && (
        <div
          className="absolute z-50 top-full left-0 right-0 mt-2
                     bg-white rounded-xl border border-gray-100 shadow-xl shadow-primary-900/10
                     max-h-80 overflow-y-auto"
          role="listbox"
          aria-label="Resultados da busca"
        >
          {results.length > 0 ? (
            <>
              <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-softGray border-b border-gray-100">
                {t.resultsCount(results.length)}
              </div>
              <ul className="py-2">
                {results.slice(0, 8).map((article) => (
                  <li key={article.slug}>
                    <a
                      href={getUrl(article.slug)}
                      className="flex items-start gap-3 px-4 py-3
                                 hover:bg-ivory transition-colors duration-200
                                 group"
                      role="option"
                    >
                      <span
                        className="material-symbols-outlined text-primary-300 group-hover:text-accent-600
                                   transition-colors duration-200 text-lg mt-0.5"
                        aria-hidden="true"
                      >
                        article
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm text-primary-900 font-medium truncate group-hover:text-accent-600 transition-colors duration-200">
                          {article.title}
                        </span>
                        <span className="block text-xs text-softGray mt-0.5">
                          {article.category} · {article.readTime}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
              {results.length > 8 && (
                <div className="px-4 py-2 text-xs text-center text-softGray border-t border-gray-100">
                  + {results.length - 8} mais resultados
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <span
                className="material-symbols-outlined text-3xl text-primary-200 mb-2 block"
                aria-hidden="true"
              >
                search_off
              </span>
              <p className="text-sm text-softGray">{t.noResults}</p>
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar ao clicar fora */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
