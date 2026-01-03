import { useRef, useState, useEffect } from 'react';

interface CardItem {
  number: number;
  title: string;
  description: string;
}

interface HorizontalCardsProps {
  cards: CardItem[];
  className?: string;
}

export default function HorizontalCards({ cards, className = '' }: HorizontalCardsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollIndicators = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollIndicators, { passive: true });
    updateScrollIndicators();

    const resizeObserver = new ResizeObserver(updateScrollIndicators);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollIndicators);
      resizeObserver.disconnect();
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 320;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Scroll instruction for mobile */}
      <p className="text-sm text-neutral-graphite mb-4 flex items-center gap-2 md:hidden">
        <span className="material-symbols-outlined text-accent-500" aria-hidden="true">
          swipe
        </span>
        Arraste para ver todos os temas
      </p>

      {/* Navigation arrows - desktop only */}
      <button
        onClick={() => scroll('left')}
        className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center bg-white shadow-lg rounded-full border border-gray-200 transition-opacity duration-300 hover:bg-ivory ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Anterior"
      >
        <span className="material-symbols-outlined text-primary-900">chevron_left</span>
      </button>

      <button
        onClick={() => scroll('right')}
        className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center bg-white shadow-lg rounded-full border border-gray-200 transition-opacity duration-300 hover:bg-ivory ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Próximo"
      >
        <span className="material-symbols-outlined text-primary-900">chevron_right</span>
      </button>

      {/* Fade indicators */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-ivory to-transparent pointer-events-none z-[5] transition-opacity duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-ivory to-transparent pointer-events-none z-[5] transition-opacity duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {cards.map((card) => (
          <article
            key={card.number}
            className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start bg-white rounded-lg border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-8 h-8 bg-accent-500 text-white text-sm font-medium rounded-full">
                {card.number.toString().padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl text-primary-900 mb-3">{card.title}</h3>
            <p className="text-sm text-neutral-graphite leading-relaxed">{card.description}</p>
          </article>
        ))}
      </div>

      {/* Custom scrollbar hide CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
