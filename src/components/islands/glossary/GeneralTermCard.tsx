/**
 * General Term Card Component
 * Displays a general glossary term in a compact card format
 */
import type { TermoGeral } from './types';

interface GeneralTermCardProps {
  item: TermoGeral;
}

export default function GeneralTermCard({ item }: GeneralTermCardProps) {
  return (
    <article className="bg-white rounded-lg p-8 border border-gray-100 hover:border-accent-600 transition-colors duration-300 group shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-serif font-normal text-primary-900 group-hover:text-accent-600 transition-colors duration-300 leading-tight">
          {item.term}
        </h3>
        <span className="bg-ivory text-[10px] font-medium px-3 py-1 rounded text-softGray border border-gray-100 uppercase">
          {item.letter}
        </span>
      </div>
      <p className="text-sm text-warmGray leading-relaxed mb-6 flex-1 font-light">
        {item.description}
      </p>
      <a
        href={item.link}
        className="inline-flex items-center text-xs font-medium text-primary-900 hover:text-accent-600 transition-colors duration-300 tracking-[0.1em] uppercase"
      >
        {item.linkText}
        <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
      </a>
    </article>
  );
}
