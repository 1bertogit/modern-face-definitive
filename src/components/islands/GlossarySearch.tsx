import { useState, useMemo } from 'react';

interface GlossaryTerm {
  category: string;
  term: string;
  definition: string;
  slug: string;
}

interface GlossarySearchProps {
  terms: GlossaryTerm[];
}

export default function GlossarySearch({ terms }: GlossarySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Memoize categories extraction to avoid recalculating on every render
  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(terms.map((t) => t.category)))],
    [terms]
  );

  // Memoize filtered and sorted results for performance
  const filteredTerms = useMemo(() => {
    return terms
      .filter((term) => {
        const matchesSearch =
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || term.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [terms, searchTerm, selectedCategory]);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="bg-ivory min-h-screen">
      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-24 z-30">
        <div className="max-w-5xl mx-auto px-4">
          {/* Search Input */}
          <div className="relative mb-6">
            <label htmlFor="glossary-search" className="sr-only">
              Buscar termo no glossário
            </label>
            <span
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-softGray">search</span>
            </span>
            <input
              id="glossary-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busque por um termo (ex: SMAS, Endomidface, Platisma)..."
              className="block w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-warmGray shadow-sm focus:ring-2 focus:ring-primary-800 focus:border-transparent transition-all text-base placeholder-softGray/70 focus:outline-none"
            />
          </div>

          {/* Category Filters */}
          <div
            className="flex flex-wrap gap-2 justify-center"
            role="group"
            aria-label="Filtrar por categoria"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`px-4 py-2 text-xs font-normal rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-900 text-white'
                    : 'bg-ivory text-warmGray hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Alphabet Filter */}
          <div
            className="flex gap-1 justify-center mt-4 flex-wrap"
            role="group"
            aria-label="Filtrar por letra inicial"
          >
            <button
              onClick={() => setSearchTerm('')}
              aria-label="Mostrar todos os termos"
              aria-pressed={searchTerm === ''}
              className={`w-7 h-7 rounded-full text-[10px] font-normal flex items-center justify-center transition-colors ${
                searchTerm === ''
                  ? 'bg-primary-900 text-white'
                  : 'bg-ivory border border-gray-200 text-softGray hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {alphabet.map((char) => (
              <button
                key={char}
                onClick={() => setSearchTerm(char)}
                className="w-7 h-7 rounded-full bg-ivory border border-gray-200 text-softGray hover:bg-gray-100 text-[10px] font-normal flex items-center justify-center transition-colors"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTerms.map((term) => (
                <article
                  key={term.slug}
                  className="bg-white rounded-lg p-8 border border-gray-100 hover:border-accent-600 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-xl font-normal text-primary-900 group-hover:text-accent-600 transition-colors">
                      {term.term}
                    </h3>
                    <span className="bg-ivory text-[10px] font-medium px-3 py-1 rounded text-softGray border border-gray-100 uppercase tracking-[0.1em]">
                      {term.category}
                    </span>
                  </div>
                  <p className="text-warmGray leading-relaxed text-sm font-light">
                    {term.definition}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-lg">
              <span className="material-symbols-outlined text-4xl text-softGray mb-4">
                search_off
              </span>
              <p className="text-xl text-softGray">
                Nenhum termo encontrado para &ldquo;{searchTerm}&rdquo;.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary-900 font-bold underline"
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-serif text-3xl font-normal mb-4">
            Ainda tem dúvidas sobre algum termo?
          </h3>
          <p className="text-white/50 text-base leading-relaxed mb-8 max-w-xl mx-auto font-light">
            A cirurgia facial envolve conceitos complexos. Agende uma conversa para entender como
            esses conceitos se aplicam ao seu caso.
          </p>
          <a
            href="/formacao"
            className="inline-block bg-accent-600 text-white px-8 py-4 font-medium uppercase tracking-[0.15em] text-[11px] hover:bg-accent-700 transition-colors"
          >
            Ver Formação
          </a>
        </div>
      </section>
    </div>
  );
}
