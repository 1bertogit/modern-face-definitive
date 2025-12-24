import { useState } from 'react';

interface NavLink {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
}

interface LanguageOption {
  locale: string;
  name: string;
  path: string;
  isActive: boolean;
}

interface MobileMenuProps {
  navLinks: NavLink[];
  currentPath: string;
  locale?: string;
  languageSwitcher?: LanguageOption[];
}

// Aria labels by locale
const ariaLabels: Record<string, { open: string; close: string }> = {
  'pt': { open: 'Abrir menu', close: 'Fechar menu' },
  en: { open: 'Open menu', close: 'Close menu' },
  es: { open: 'Abrir menú', close: 'Cerrar menú' },
};

export default function MobileMenu({
  navLinks,
  currentPath,
  locale = 'pt',
  languageSwitcher = [],
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const labels = ariaLabels[locale] || ariaLabels['pt'];

  const toggleExpanded = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isExpanded = (path: string) => expandedItems.includes(path);

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary-900 hover:text-accent-700 focus:outline-none transition-colors p-2"
        aria-label={isOpen ? labels.close : labels.open}
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-3xl font-light">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-x-0 top-20 h-[calc(100vh-5rem)] bg-ivory z-[999] animate-fade-in overflow-y-auto pb-24">
          <nav className="px-6 pt-6 pb-3">
            {navLinks.map((link) => (
              <div key={link.path} className="border-b border-gray-100">
                {/* Main link */}
                <div className="flex items-center justify-between">
                  <a
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex-1 text-lg font-serif py-3 ${
                      currentPath === link.path ||
                      (link.path !== '/' &&
                        link.path !== '/en' &&
                        link.path !== '/es' &&
                        currentPath.startsWith(link.path))
                        ? 'text-accent-700'
                        : 'text-primary-900 hover:text-accent-700'
                    } transition-colors`}
                  >
                    {link.label}
                  </a>

                  {/* Expand button for items with children */}
                  {link.children && link.children.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleExpanded(link.path);
                      }}
                      className="p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-warmGray hover:text-accent-700 active:text-accent-800 transition-colors touch-manipulation"
                      aria-label={isExpanded(link.path) ? 'Collapse submenu' : 'Expand submenu'}
                      aria-expanded={isExpanded(link.path)}
                    >
                      <span
                        className={`material-symbols-outlined text-xl transition-transform duration-200 ${isExpanded(link.path) ? 'rotate-180' : ''}`}
                      >
                        expand_more
                      </span>
                    </button>
                  )}
                </div>

                {/* Children accordion */}
                {link.children && link.children.length > 0 && isExpanded(link.path) && (
                  <div className="pl-4 pb-3 space-y-1 animate-fade-in">
                    {link.children.map((child) => (
                      <a
                        key={child.path}
                        href={child.path}
                        onClick={() => setIsOpen(false)}
                        className={`block py-2 text-sm ${
                          currentPath === child.path
                            ? 'text-accent-700 font-medium'
                            : 'text-warmGray hover:text-primary-900'
                        } transition-colors`}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Language Switcher in mobile menu */}
          {languageSwitcher.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-xs uppercase tracking-[0.2em] text-warmGray mb-3">
                {locale === 'pt' ? 'Idioma' : locale === 'en' ? 'Language' : 'Idioma'}
              </p>
              <div className="flex gap-3">
                {languageSwitcher.map((lang) => (
                  <a
                    key={lang.locale}
                    href={lang.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      lang.isActive
                        ? 'bg-accent-700 text-white border-accent-700'
                        : 'bg-white text-warmGray border-gray-200 hover:border-accent-700 hover:text-accent-700'
                    }`}
                  >
                    {lang.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
