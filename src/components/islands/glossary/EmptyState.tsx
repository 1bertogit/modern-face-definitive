/**
 * Empty State Component
 * Displays when no glossary terms match the current filters
 */

interface EmptyStateProps {
  onClearFilters: () => void;
  message?: string;
  subMessage?: string;
  clearButtonText?: string;
}

export default function EmptyState({
  onClearFilters,
  message = 'Nenhum termo encontrado',
  subMessage = 'Tente buscar por outro termo ou limpe os filtros.',
  clearButtonText = 'Limpar filtros',
}: EmptyStateProps) {
  return (
    <div
      className="text-center py-20 bg-white border border-gray-100 rounded-lg"
      role="status"
      aria-live="polite"
    >
      <span className="material-symbols-outlined text-4xl text-softGray mb-4" aria-hidden="true">
        search_off
      </span>
      <p className="text-xl text-softGray font-light mb-2">{message}</p>
      <p className="text-sm text-softGray font-light mb-4">{subMessage}</p>
      <button onClick={onClearFilters} className="text-primary-900 font-medium underline text-sm">
        {clearButtonText}
      </button>
    </div>
  );
}
