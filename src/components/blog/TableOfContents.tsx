/**
 * TableOfContents.tsx
 * Sticky sidebar table of contents for blog articles
 * Extracts h2/h3 headings and highlights current section on scroll
 */

import { useState, useEffect, useCallback } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  locale?: 'pt' | 'en' | 'es';
}

const translations = {
  pt: {
    title: 'Neste artigo',
    expand: 'Ver sumário',
    collapse: 'Ocultar sumário',
  },
  en: {
    title: 'In this article',
    expand: 'Show contents',
    collapse: 'Hide contents',
  },
  es: {
    title: 'En este artículo',
    expand: 'Ver contenido',
    collapse: 'Ocultar contenido',
  },
};

export default function TableOfContents({ locale = 'en' }: Props) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const t = translations[locale] || translations.en;

  // Extract headings from article on mount
  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TOCItem[] = [];

    elements.forEach((el, index) => {
      // Generate ID if not present
      if (!el.id) {
        el.id = `heading-${index}`;
      }

      items.push({
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
      setIsExpanded(false); // Collapse on mobile after click
    }
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav
      className="bg-white rounded-xl border border-gray-100 overflow-hidden"
      aria-label={t.title}
    >
      {/* Mobile Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 lg:hidden text-left"
        aria-expanded={isExpanded}
      >
        <span className="label-eyebrow mb-0">{t.title}</span>
        <span className="material-symbols-outlined text-primary-400 transition-transform duration-300">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Desktop Header */}
      <div className="hidden lg:block p-4 pb-2">
        <h3 className="label-eyebrow mb-0">{t.title}</h3>
      </div>

      {/* TOC List */}
      <ul
        className={`px-4 pb-4 space-y-1 lg:block transition-all duration-300 ${
          isExpanded ? 'block' : 'hidden'
        }`}
        role="list"
      >
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => scrollToHeading(id)}
              className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-300 ${
                level === 3 ? 'pl-6' : ''
              } ${
                activeId === id
                  ? 'bg-accent-50 text-accent-700 font-medium border-l-2 border-accent-500 -ml-px'
                  : 'text-neutral-graphite hover:bg-ivory hover:text-primary-900'
              }`}
            >
              <span className="line-clamp-2">{text}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
