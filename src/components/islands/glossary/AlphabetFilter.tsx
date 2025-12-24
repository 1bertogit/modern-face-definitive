/**
 * Alphabet Filter Component
 * Allows filtering glossary terms by first letter
 */

interface AlphabetFilterProps {
  selectedLetter: string | null;
  onLetterClick: (letter: string | null) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AlphabetFilter({ selectedLetter, onLetterClick }: AlphabetFilterProps) {
  return (
    <div className="overflow-x-auto hide-scrollbar">
      <div
        className="flex gap-2 min-w-max pb-2 justify-center flex-wrap"
        role="group"
        aria-label="Filtrar termos por letra inicial"
      >
        <button
          onClick={() => onLetterClick(null)}
          aria-pressed={selectedLetter === null}
          aria-label="Mostrar todos os termos"
          className={`size-9 rounded-full text-xs font-normal flex items-center justify-center transition-colors duration-300 ${
            selectedLetter === null
              ? 'bg-primary-900 text-white shadow-md'
              : 'bg-ivory border border-gray-200 text-softGray hover:bg-gray-50 hover:text-primary-900'
          }`}
        >
          All
        </button>
        {ALPHABET.map((char) => (
          <button
            key={char}
            onClick={() => onLetterClick(char)}
            aria-pressed={selectedLetter === char}
            aria-label={`Filtrar termos que começam com ${char}`}
            className={`size-9 rounded-full text-xs font-normal flex items-center justify-center transition-colors duration-300 ${
              selectedLetter === char
                ? 'bg-primary-900 text-white shadow-md'
                : 'bg-ivory border border-gray-200 text-softGray hover:bg-gray-50 hover:text-primary-900'
            }`}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
}
