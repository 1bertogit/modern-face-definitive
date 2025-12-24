/**
 * Featured Term Card Component
 * Displays a highlighted glossary term with image and details
 * Note: Uses DOMPurify for XSS protection when rendering HTML content
 */
import DOMPurify from 'isomorphic-dompurify';
import type { TermoDestaque } from './types';

interface FeaturedTermCardProps {
  termo: TermoDestaque;
}

export default function FeaturedTermCard({ termo }: FeaturedTermCardProps) {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedDescription = DOMPurify.sanitize(termo.description);

  return (
    <article className="flex flex-col md:flex-row items-center md:items-start gap-10 lg:gap-16 border-b border-gray-100 pb-12 mb-12">
      {/* Image Card */}
      <div className="shrink-0 w-full md:w-[250px] lg:w-[320px] bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
        <img
          src={termo.image}
          alt={`Ilustração de ${termo.term}`}
          className="w-36 h-36 object-contain mb-4 grayscale-[80%] brightness-105 contrast-105"
          loading="lazy"
        />
        <span className="text-[10px] font-medium text-softGray uppercase tracking-[0.15em]">
          {termo.category}
        </span>
        <span className="text-[10px] font-light text-softGray">{termo.subcategory}</span>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        <h3 className="text-3xl md:text-4xl font-serif font-normal text-primary-900 leading-tight">
          {termo.term}
        </h3>
        <p
          className="text-base text-warmGray leading-relaxed font-light first-letter:float-left first-letter:font-serif first-letter:text-[4rem] first-letter:leading-[0.8] first-letter:mr-2 first-letter:text-accent-600 first-letter:font-normal"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />

        {termo.additionalText && (
          <p className="text-base text-warmGray leading-relaxed font-light">
            {termo.additionalText}
          </p>
        )}

        {termo.benefits && (
          <div className="bg-ivory p-6 rounded-lg border border-gray-100">
            <h4 className="text-base font-medium text-primary-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-accent-600">info</span>
              Benefícios principais
            </h4>
            <ul className="list-disc list-inside text-warmGray text-sm space-y-2 ml-4 font-light leading-relaxed">
              {termo.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
