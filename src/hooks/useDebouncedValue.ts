/**
 * useDebouncedValue Hook
 *
 * Delays updating a value until after a specified delay has passed
 * since the last change. Useful for search inputs to prevent
 * excessive filtering/API calls on every keystroke.
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebouncedValue(query, 300);
 *
 * // debouncedQuery updates 300ms after query stops changing
 * const results = useMemo(() => {
 *   return items.filter(item => item.includes(debouncedQuery));
 * }, [items, debouncedQuery]);
 * ```
 */

import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the provided value.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
