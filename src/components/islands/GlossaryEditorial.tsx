import { useState, useEffect, useRef, useMemo } from 'react';
import {
  AlphabetFilter,
  FeaturedTermCard,
  GeneralTermCard,
  GlossaryCTA,
  EmptyState,
  type TermoDestaque,
  type TermoGeral,
} from './glossary';

interface GlossaryEditorialProps {
  termosDestaque: TermoDestaque[];
  glossarioGeral: TermoGeral[];
}

export default function GlossaryEditorial({
  termosDestaque,
  glossarioGeral,
}: GlossaryEditorialProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Memoize filtered featured terms for performance
  const filteredDestaque = useMemo(() => {
    return termosDestaque.filter((termo) => {
      const matchesSearch =
        searchTerm === '' ||
        termo.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        termo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter =
        !selectedLetter || termo.term.charAt(0).toUpperCase() === selectedLetter;
      return matchesSearch && matchesLetter;
    });
  }, [termosDestaque, searchTerm, selectedLetter]);

  // Memoize filtered general terms for performance
  const filteredGeral = useMemo(() => {
    return glossarioGeral.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = !selectedLetter || item.letter === selectedLetter;
      return matchesSearch && matchesLetter;
    });
  }, [glossarioGeral, searchTerm, selectedLetter]);

  const visibleGeral = filteredGeral.slice(0, visibleCount);
  const hasMore = filteredGeral.length > visibleCount;

  const handleLetterClick = (letter: string | null) => {
    setSelectedLetter(letter);
    setVisibleCount(6);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLetter(null);
    setVisibleCount(6);
  };

  const totalResults = filteredDestaque.length + filteredGeral.length;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-ivory border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-20 flex flex-col items-center justify-center text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-softGray mb-6 font-light">
            <a href="/" className="hover:text-primary-900 transition-colors duration-300">
              Início
            </a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Recursos</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary-900 font-normal">Glossário</span>
          </nav>

          <h1 className="text-5xl md:text-6xl font-serif font-normal text-primary-900 leading-tight mb-4">
            Glossário Técnico Face Moderna®
          </h1>
          <p className="text-base text-softGray max-w-3xl mb-12 leading-relaxed font-light">
            Explore o vocabulário da cirurgia facial avançada. Entenda os termos técnicos, as
            estruturas anatômicas e os conceitos fundamentais da nossa metodologia.
          </p>

          {/* Search */}
          <div className="w-full max-w-xl relative group">
            <label htmlFor="glossary-editorial-search" className="sr-only">
              Buscar termo no glossário técnico
            </label>
            <div
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-softGray group-focus-within:text-primary-900 transition-colors duration-300">
                search
              </span>
            </div>
            <input
              id="glossary-editorial-search"
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busque por um termo (ex: SMAS, Endomidface, Platisma)..."
              className="block w-full pl-12 pr-20 py-4 rounded-xl border border-gray-200 bg-white text-warmGray shadow-sm focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-colors duration-300 text-sm placeholder-softGray/70 font-light focus:outline-none"
            />
            <div className="absolute inset-y-0 right-2 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-softGray hover:text-primary-900 transition-colors duration-300"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-medium text-softGray bg-ivory border border-gray-200 rounded-lg">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Search Results Count */}
          {(searchTerm || selectedLetter) && (
            <div
              className="mt-4 flex items-center gap-4"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="text-sm text-softGray font-light">
                {totalResults}{' '}
                {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                {selectedLetter && ` para letra "${selectedLetter}"`}
                {searchTerm && ` contendo "${searchTerm}"`}
              </p>
              <button
                onClick={clearFilters}
                className="text-xs text-accent-600 hover:text-primary-900 transition-colors duration-300 font-medium"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto px-4 py-20 flex flex-col gap-16">
        {/* Alphabet Filter */}
        <AlphabetFilter selectedLetter={selectedLetter} onLetterClick={handleLetterClick} />

        {/* No Results */}
        {totalResults === 0 && <EmptyState onClearFilters={clearFilters} />}

        {/* Termos em Destaque */}
        {filteredDestaque.length > 0 && (
          <section className="space-y-12" id="section-topicos">
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 text-center mb-16">
              Termos em Destaque
            </h2>

            {filteredDestaque.map((termo) => (
              <FeaturedTermCard key={termo.term} termo={termo} />
            ))}
          </section>
        )}

        {/* Glossário Geral */}
        {visibleGeral.length > 0 && (
          <section className="mt-8 space-y-12" id="section-geral">
            <h2 className="text-4xl md:text-5xl font-serif font-normal text-primary-900 text-center mb-16">
              Glossário Geral
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
              {visibleGeral.map((item) => (
                <GeneralTermCard key={item.term} item={item} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 px-8 py-4 bg-white rounded-lg text-xs font-medium text-warmGray hover:bg-ivory transition-colors duration-300 border border-gray-100 shadow-sm uppercase tracking-[0.1em]"
                >
                  Carregar mais termos ({filteredGeral.length - visibleCount} restantes)
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* CTA Section */}
      <GlossaryCTA />
    </div>
  );
}
