import { useState, useId, useRef, useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getButtonId = (index: number) => `${baseId}-button-${index}`;
  const getPanelId = (index: number) => `${baseId}-panel-${index}`;

  return (
    <div className="space-y-4" role="region" aria-label="Perguntas Frequentes">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = getButtonId(index);
        const panelId = getPanelId(index);

        return (
          <div
            key={item.question}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white transition-shadow hover:shadow-sm"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-ivory transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-inset"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-serif text-base text-primary-900 font-normal">
                  {item.question}
                </span>
                <span
                  className={`material-symbols-outlined text-accent-600 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                >
                  expand_more
                </span>
              </button>
            </h3>

            <AccordionPanel id={panelId} buttonId={buttonId} isOpen={isOpen} answer={item.answer} />
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Accordion Panel Component
// Uses CSS Grid animation technique for smooth height transitions
// ============================================================================

interface AccordionPanelProps {
  id: string;
  buttonId: string;
  isOpen: boolean;
  answer: string;
}

function AccordionPanel({ id, buttonId, isOpen, answer }: AccordionPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);

  // Update height when isOpen changes
  useEffect(() => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight ?? 0;
      setHeight(contentHeight);
      // After animation completes, set to auto for dynamic content
      const timer = setTimeout(() => setHeight('auto'), 300);
      return () => clearTimeout(timer);
    } else {
      // First set explicit height, then animate to 0
      const contentHeight = contentRef.current?.scrollHeight ?? 0;
      setHeight(contentHeight);
      // Use requestAnimationFrame to ensure the explicit height is applied before animating to 0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
        });
      });
    }
  }, [isOpen]);

  return (
    <div
      id={id}
      role="region"
      aria-labelledby={buttonId}
      aria-hidden={!isOpen}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        overflow: 'hidden',
        transition: 'height 300ms ease-in-out',
      }}
    >
      <div ref={contentRef} className="px-6 pb-5 pt-0">
        <p className="text-warmGray leading-relaxed text-sm font-light">{answer}</p>
      </div>
    </div>
  );
}
