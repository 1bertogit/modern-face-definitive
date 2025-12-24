import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GlossarySearch from './GlossarySearch';

const mockTerms = [
  {
    category: 'Anatomia',
    term: 'SMAS',
    definition: 'Sistema Musculoaponeurótico Superficial, camada fundamental na cirurgia facial.',
    slug: 'smas',
  },
  {
    category: 'Técnica',
    term: 'Endomidface',
    definition: 'Técnica revolucionária de rejuvenescimento do terço médio por visão direta.',
    slug: 'endomidface',
  },
  {
    category: 'Anatomia',
    term: 'Platisma',
    definition: 'Músculo superficial do pescoço, foco principal da cirurgia cervical.',
    slug: 'platisma',
  },
  {
    category: 'Técnica',
    term: 'Deep Neck',
    definition: 'Abordagem avançada do pescoço que trata estruturas profundas.',
    slug: 'deep-neck',
  },
];

describe('GlossarySearch', () => {
  it('renders all terms initially', () => {
    render(<GlossarySearch terms={mockTerms} />);

    mockTerms.forEach((term) => {
      expect(screen.getByText(term.term)).toBeInTheDocument();
    });
  });

  it('renders search input', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('filters terms by search input', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    expect(screen.getByText('SMAS')).toBeInTheDocument();
    expect(screen.queryByText('Endomidface')).not.toBeInTheDocument();
    expect(screen.queryByText('Platisma')).not.toBeInTheDocument();
  });

  it('filters terms by definition content', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'revolucionária' } });

    expect(screen.getByText('Endomidface')).toBeInTheDocument();
    expect(screen.queryByText('SMAS')).not.toBeInTheDocument();
  });

  it('search is case insensitive', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'smas' } });

    expect(screen.getByText('SMAS')).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    render(<GlossarySearch terms={mockTerms} />);

    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    // Anatomia and Técnica appear both in buttons and badges, so we check buttons exist
    const buttons = screen.getAllByRole('button');
    const buttonTexts = buttons.map((btn) => btn.textContent);
    expect(buttonTexts).toContain('Anatomia');
    expect(buttonTexts).toContain('Técnica');
  });

  it('filters terms by category', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const anatomiaButton = screen.getByRole('button', { name: 'Anatomia' });
    fireEvent.click(anatomiaButton);

    expect(screen.getByText('SMAS')).toBeInTheDocument();
    expect(screen.getByText('Platisma')).toBeInTheDocument();
    expect(screen.queryByText('Endomidface')).not.toBeInTheDocument();
    expect(screen.queryByText('Deep Neck')).not.toBeInTheDocument();
  });

  it('filters by category Técnica', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const tecnicaButton = screen.getByRole('button', { name: 'Técnica' });
    fireEvent.click(tecnicaButton);

    expect(screen.getByText('Endomidface')).toBeInTheDocument();
    expect(screen.getByText('Deep Neck')).toBeInTheDocument();
    expect(screen.queryByText('SMAS')).not.toBeInTheDocument();
    expect(screen.queryByText('Platisma')).not.toBeInTheDocument();
  });

  it('shows all terms when Todos category is selected', () => {
    render(<GlossarySearch terms={mockTerms} />);

    // First filter by a category
    const anatomiaButton = screen.getByRole('button', { name: 'Anatomia' });
    fireEvent.click(anatomiaButton);

    // Then select Todos
    const todosButton = screen.getByRole('button', { name: 'Todos' });
    fireEvent.click(todosButton);

    mockTerms.forEach((term) => {
      expect(screen.getByText(term.term)).toBeInTheDocument();
    });
  });

  it('combines search and category filters', () => {
    render(<GlossarySearch terms={mockTerms} />);

    // Filter by category first
    const anatomiaButton = screen.getByRole('button', { name: 'Anatomia' });
    fireEvent.click(anatomiaButton);

    // Then search
    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    expect(screen.getByText('SMAS')).toBeInTheDocument();
    expect(screen.queryByText('Platisma')).not.toBeInTheDocument();
  });

  it('renders alphabet filter buttons', () => {
    render(<GlossarySearch terms={mockTerms} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Z')).toBeInTheDocument();
  });

  it('filters by alphabet letter', () => {
    render(<GlossarySearch terms={mockTerms} />);

    // Clicking a letter sets searchTerm to that letter
    // This filters terms where letter appears in term OR definition
    const letterK = screen.getByText('K');
    fireEvent.click(letterK);

    // "Deep Neck" contains 'k' in the term
    expect(screen.getByText('Deep Neck')).toBeInTheDocument();
    // Other terms don't contain 'k' in term or definition
    expect(screen.queryByText('SMAS')).not.toBeInTheDocument();
    expect(screen.queryByText('Endomidface')).not.toBeInTheDocument();
    expect(screen.queryByText('Platisma')).not.toBeInTheDocument();
  });

  it('clears search when All button is clicked', () => {
    render(<GlossarySearch terms={mockTerms} />);

    // First search for something
    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    expect(screen.queryByText('Endomidface')).not.toBeInTheDocument();

    // Click All button
    const allButton = screen.getByText('All');
    fireEvent.click(allButton);

    // All terms should be visible again
    mockTerms.forEach((term) => {
      expect(screen.getByText(term.term)).toBeInTheDocument();
    });
  });

  it('shows empty state when no terms match', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });

    expect(screen.getByText(/nenhum termo encontrado/i)).toBeInTheDocument();
    expect(screen.getByText(/limpar busca/i)).toBeInTheDocument();
  });

  it('shows clear search button in empty state', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });

    const clearButton = screen.getByText(/limpar busca/i);
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    // All terms should be visible again
    mockTerms.forEach((term) => {
      expect(screen.getByText(term.term)).toBeInTheDocument();
    });
  });

  it('sorts terms alphabetically', () => {
    render(<GlossarySearch terms={mockTerms} />);

    const termElements = screen.getAllByRole('article');
    const termTitles = termElements.map((el) => el.querySelector('h3')?.textContent);

    // Should be sorted: Deep Neck, Endomidface, Platisma, SMAS
    expect(termTitles).toEqual(['Deep Neck', 'Endomidface', 'Platisma', 'SMAS']);
  });

  it('renders term definitions', () => {
    render(<GlossarySearch terms={mockTerms} />);

    mockTerms.forEach((term) => {
      expect(screen.getByText(term.definition)).toBeInTheDocument();
    });
  });

  it('renders category badge for each term', () => {
    render(<GlossarySearch terms={mockTerms} />);

    // Should have 2 Anatomia badges and 2 Técnica badges
    const anatomiaBadges = screen.getAllByText('Anatomia');
    const tecnicaBadges = screen.getAllByText('Técnica');

    // Filter buttons + term badges
    expect(anatomiaBadges.length).toBeGreaterThan(1);
    expect(tecnicaBadges.length).toBeGreaterThan(1);
  });

  it('renders empty state gracefully with no terms', () => {
    render(<GlossarySearch terms={[]} />);

    // Category filter should only have "Todos"
    expect(screen.getByText('Todos')).toBeInTheDocument();

    // Empty state should show
    const searchInput = screen.getByPlaceholderText(/busque por um termo/i);
    expect(searchInput).toBeInTheDocument();
  });
});
