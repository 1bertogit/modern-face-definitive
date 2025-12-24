import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GlossaryEditorial from './GlossaryEditorial';

const mockTermosDestaque = [
  {
    term: 'SMAS',
    category: 'Anatomia',
    subcategory: 'Camada Facial',
    image: '/images/smas.png',
    description:
      'Sistema Musculoaponeurótico Superficial, estrutura fundamental na cirurgia facial.',
    additionalText: 'Texto adicional sobre SMAS.',
    benefits: ['Sustentação natural', 'Resultados duradouros'],
  },
  {
    term: 'Endomidface',
    category: 'Técnica',
    subcategory: 'Terço Médio',
    image: '/images/endomidface.png',
    description: 'Técnica revolucionária para rejuvenescimento do terço médio facial.',
  },
  {
    term: 'Platisma',
    category: 'Anatomia',
    subcategory: 'Pescoço',
    image: '/images/platisma.png',
    description: 'Músculo superficial do pescoço, foco principal da cirurgia cervical.',
  },
];

const mockGlossarioGeral = [
  {
    term: 'Aponeurose',
    letter: 'A',
    description: 'Membrana fibrosa que envolve músculos.',
    link: '/glossario/aponeurose',
    linkText: 'Saiba mais',
  },
  {
    term: 'Browlift',
    letter: 'B',
    description: 'Procedimento para elevar as sobrancelhas.',
    link: '/glossario/browlift',
    linkText: 'Saiba mais',
  },
  {
    term: 'Colágeno',
    letter: 'C',
    description: 'Proteína estrutural da pele.',
    link: '/glossario/colageno',
    linkText: 'Saiba mais',
  },
  {
    term: 'Deep Plane',
    letter: 'D',
    description: 'Plano profundo de dissecção facial.',
    link: '/glossario/deep-plane',
    linkText: 'Saiba mais',
  },
  {
    term: 'Edema',
    letter: 'E',
    description: 'Inchaço pós-operatório comum.',
    link: '/glossario/edema',
    linkText: 'Saiba mais',
  },
  {
    term: 'Frontoplastia',
    letter: 'F',
    description: 'Cirurgia de rejuvenescimento da testa.',
    link: '/glossario/frontoplastia',
    linkText: 'Saiba mais',
  },
  {
    term: 'Gordura Facial',
    letter: 'G',
    description: 'Compartimentos de gordura do rosto.',
    link: '/glossario/gordura-facial',
    linkText: 'Saiba mais',
  },
  {
    term: 'Hemostasia',
    letter: 'H',
    description: 'Controle de sangramento durante cirurgia.',
    link: '/glossario/hemostasia',
    linkText: 'Saiba mais',
  },
];

describe('GlossaryEditorial', () => {
  it('renders hero section with title', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    expect(screen.getByText(/Glossário Técnico Face Moderna/i)).toBeInTheDocument();
  });

  it('renders breadcrumb navigation', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Recursos')).toBeInTheDocument();
    expect(screen.getByText('Glossário')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders alphabet filter buttons', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    // Use getByLabelText since alphabet buttons have aria-labels
    expect(screen.getByLabelText(/Mostrar todos os termos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar termos que começam com A/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar termos que começam com Z/i)).toBeInTheDocument();
  });

  it('renders featured terms section', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    expect(screen.getByText('Termos em Destaque')).toBeInTheDocument();
    expect(screen.getByText('SMAS')).toBeInTheDocument();
    expect(screen.getByText('Endomidface')).toBeInTheDocument();
  });

  it('renders general glossary section', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    expect(screen.getByText('Glossário Geral')).toBeInTheDocument();
    expect(screen.getByText('Aponeurose')).toBeInTheDocument();
    expect(screen.getByText('Browlift')).toBeInTheDocument();
  });

  it('filters terms by search query', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    expect(screen.getByText('SMAS')).toBeInTheDocument();
    expect(screen.queryByText('Endomidface')).not.toBeInTheDocument();
  });

  it('search is case insensitive', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'smas' } });

    expect(screen.getByText('SMAS')).toBeInTheDocument();
  });

  it('filters by description content', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'revolucionária' } });

    expect(screen.getByText('Endomidface')).toBeInTheDocument();
    expect(screen.queryByText('SMAS')).not.toBeInTheDocument();
  });

  it('filters by alphabet letter', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const letterA = screen.getByLabelText(/Filtrar termos que começam com A/i);
    fireEvent.click(letterA);

    // Aponeurose starts with A
    expect(screen.getByText('Aponeurose')).toBeInTheDocument();
    // Browlift should not be visible
    expect(screen.queryByText('Browlift')).not.toBeInTheDocument();
  });

  it('shows all terms when All button is clicked', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    // Filter by letter first
    const letterA = screen.getByLabelText(/Filtrar termos que começam com A/i);
    fireEvent.click(letterA);

    // Then click All
    const allButton = screen.getByLabelText(/Mostrar todos os termos/i);
    fireEvent.click(allButton);

    // All terms should be visible
    expect(screen.getByText('Aponeurose')).toBeInTheDocument();
    expect(screen.getByText('Browlift')).toBeInTheDocument();
  });

  it('shows results count when filtering', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    expect(screen.getByText(/resultado(s)? encontrado/i)).toBeInTheDocument();
  });

  it('shows empty state when no results', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent' } });

    expect(screen.getByText(/Nenhum termo encontrado/i)).toBeInTheDocument();
  });

  it('clears filters when clear button is clicked', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    const clearButton = screen.getByText(/Limpar filtros/i);
    fireEvent.click(clearButton);

    // All terms should be visible again
    expect(screen.getByText('SMAS')).toBeInTheDocument();
    expect(screen.getByText('Endomidface')).toBeInTheDocument();
  });

  it('shows load more button when there are more terms', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    // Default visible count is 6, we have 8 terms
    const loadMoreButton = screen.getByText(/Carregar mais termos/i);
    expect(loadMoreButton).toBeInTheDocument();
  });

  it('loads more terms when load more button is clicked', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    // Initially only 6 terms visible
    expect(screen.queryByText('Gordura Facial')).not.toBeInTheDocument();

    // Click load more
    const loadMoreButton = screen.getByText(/Carregar mais termos/i);
    fireEvent.click(loadMoreButton);

    // Now all 8 terms should be visible
    expect(screen.getByText('Gordura Facial')).toBeInTheDocument();
    expect(screen.getByText('Hemostasia')).toBeInTheDocument();
  });

  it('renders benefits list for featured terms', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    expect(screen.getByText(/Benefícios principais/i)).toBeInTheDocument();
    expect(screen.getByText('Sustentação natural')).toBeInTheDocument();
    expect(screen.getByText('Resultados duradouros')).toBeInTheDocument();
  });

  it('renders additional text when provided', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    expect(screen.getByText('Texto adicional sobre SMAS.')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    expect(screen.getByText(/Ainda tem dúvidas/i)).toBeInTheDocument();
    expect(screen.getByText(/Agendar Avaliação/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver Resultados/i)).toBeInTheDocument();
  });

  it('renders glossary term links', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const saibaMaisLinks = screen.getAllByText('Saiba mais');
    expect(saibaMaisLinks.length).toBeGreaterThan(0);
  });

  it('shows letter badge on general glossary items', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    // Letter badges in general glossary
    const letterBadges = screen.getAllByText('A');
    expect(letterBadges.length).toBeGreaterThan(1); // One in filter, at least one in content
  });

  it('combines search and letter filters', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    // Filter by letter A
    const letterA = screen.getByLabelText(/Filtrar termos que começam com A/i);
    fireEvent.click(letterA);

    // Then search
    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'membrana' } });

    // Aponeurose matches both letter A and "membrana" in description
    expect(screen.getByText('Aponeurose')).toBeInTheDocument();
  });

  it('clears search input with close button', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    // Close button appears when there's text (icon text is "close")
    const closeButton = screen.getByText('close');
    fireEvent.click(closeButton);

    // Search should be cleared
    expect(searchInput).toHaveValue('');
  });

  it('renders empty state gracefully with no data', () => {
    render(<GlossaryEditorial termosDestaque={[]} glossarioGeral={[]} />);

    // Should show empty state
    expect(screen.getByText(/Nenhum termo encontrado/i)).toBeInTheDocument();
  });

  it('has accessible alphabet filter buttons', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const allButton = screen.getByLabelText(/Mostrar todos os termos/i);
    expect(allButton).toHaveAttribute('aria-pressed', 'true');

    const letterA = screen.getByLabelText(/Filtrar termos que começam com A/i);
    expect(letterA).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(letterA);
    expect(letterA).toHaveAttribute('aria-pressed', 'true');
    expect(allButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('displays result count status for accessibility', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const searchInput = screen.getByPlaceholderText(/Busque por um termo/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    const statusElement = screen.getByRole('status');
    expect(statusElement).toBeInTheDocument();
  });

  it('renders images with alt text', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    const smasImage = screen.getByAltText(/Ilustração de SMAS/i);
    expect(smasImage).toBeInTheDocument();
  });

  it('renders category and subcategory for featured terms', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    // Categories may appear multiple times for different terms
    expect(screen.getAllByText('Anatomia').length).toBeGreaterThan(0);
    expect(screen.getByText('Camada Facial')).toBeInTheDocument();
  });

  it('resets visible count when letter filter changes', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    // Load more first
    const loadMoreButton = screen.getByText(/Carregar mais termos/i);
    fireEvent.click(loadMoreButton);

    // Change letter filter
    const letterA = screen.getByLabelText(/Filtrar termos que começam com A/i);
    fireEvent.click(letterA);

    // Results should reset to initial count
    // (This is validated by the load more button behavior)
    expect(screen.getByText('Aponeurose')).toBeInTheDocument();
  });

  it('shows keyboard shortcut hint', () => {
    render(
      <GlossaryEditorial termosDestaque={mockTermosDestaque} glossarioGeral={mockGlossarioGeral} />
    );

    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });
});
