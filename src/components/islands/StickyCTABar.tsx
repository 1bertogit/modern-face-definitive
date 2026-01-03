import { useEffect, useState, useRef } from 'react';

interface StickyCTABarProps {
  originalPrice?: string;
  currentPrice: string;
  ctaText: string;
  ctaHref: string;
  showAfterScroll?: number;
  hideAtSectionId?: string;
}

export default function StickyCTABar({
  originalPrice,
  currentPrice,
  ctaText,
  ctaHref,
  showAfterScroll = 500,
  hideAtSectionId = 'pricing',
}: StickyCTABarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtPricing, setIsAtPricing] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  useEffect(() => {
    const pricingSection = document.getElementById(hideAtSectionId);
    if (!pricingSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtPricing(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(pricingSection);

    return () => observer.disconnect();
  }, [hideAtSectionId]);

  const shouldShow = isVisible && !isAtPricing;

  return (
    <div
      ref={barRef}
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        shouldShow ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-primary-900 border-t border-accent-500/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {originalPrice && (
                <span className="text-gray-400 line-through text-sm">De {originalPrice}</span>
              )}
              <span className="text-white font-semibold text-lg">{currentPrice}</span>
            </div>
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-300"
            >
              {ctaText}
              <span className="material-symbols-outlined text-base" aria-hidden="true">
                arrow_forward
              </span>
            </a>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            <a
              href={ctaHref}
              className="flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white w-full py-4 text-xs uppercase tracking-widest font-medium transition-colors duration-300"
            >
              {ctaText} — {currentPrice}
              <span className="material-symbols-outlined text-base" aria-hidden="true">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
