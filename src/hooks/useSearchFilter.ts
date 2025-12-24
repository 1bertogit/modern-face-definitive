/**
 * useSearchFilter Hook
 *
 * Reusable hook for filtering arrays based on a search term.
 * Supports searching across multiple fields and includes debouncing.
 *
 * @example
 * ```tsx
 * const { filteredItems, setSearchTerm, searchTerm } = useSearchFilter({
 *   items: articles,
 *   searchFields: ['title', 'description'],
 *   debounceMs: 300,
 * });
 * ```
 */

import { useState, useMemo } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

interface UseSearchFilterOptions<T> {
  /** Array of items to filter */
  items: T[];
  /** Fields to search within (must be string fields) */
  searchFields: (keyof T)[];
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Minimum characters before filtering starts (default: 2) */
  minChars?: number;
  /** Initial search term (default: '') */
  initialTerm?: string;
}

interface UseSearchFilterResult<T> {
  /** Filtered items based on search term */
  filteredItems: T[];
  /** Current search term */
  searchTerm: string;
  /** Debounced search term */
  debouncedSearchTerm: string;
  /** Update search term */
  setSearchTerm: (term: string) => void;
  /** Clear search term */
  clearSearch: () => void;
  /** Whether search is active (has results) */
  isSearching: boolean;
  /** Number of filtered results */
  resultCount: number;
}

/**
 * Filter items based on search term across specified fields
 */
export function useSearchFilter<T extends Record<string, unknown>>({
  items,
  searchFields,
  debounceMs = 300,
  minChars = 2,
  initialTerm = '',
}: UseSearchFilterOptions<T>): UseSearchFilterResult<T> {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, debounceMs);

  const filteredItems = useMemo(() => {
    // Return all items if search term is too short
    if (debouncedSearchTerm.trim().length < minChars) {
      return items;
    }

    const term = debouncedSearchTerm.toLowerCase().trim();

    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (Array.isArray(value)) {
          return value.some((v) => typeof v === 'string' && v.toLowerCase().includes(term));
        }
        return false;
      })
    );
  }, [items, searchFields, debouncedSearchTerm, minChars]);

  const clearSearch = () => setSearchTerm('');

  const isSearching = debouncedSearchTerm.trim().length >= minChars;

  return {
    filteredItems,
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    clearSearch,
    isSearching,
    resultCount: filteredItems.length,
  };
}

export default useSearchFilter;
