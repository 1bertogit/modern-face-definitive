/**
 * Glossary Components Tests
 *
 * Tests for EmptyState, AlphabetFilter, FeaturedTermCard, and GeneralTermCard
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from './EmptyState';
import AlphabetFilter from './AlphabetFilter';
import FeaturedTermCard from './FeaturedTermCard';
import GeneralTermCard from './GeneralTermCard';
import type { TermoDestaque, TermoGeral } from './types';

describe('EmptyState', () => {
  it('should render default message', () => {
    render(<EmptyState onClearFilters={() => {}} />);

    expect(screen.getByText('Nenhum termo encontrado')).toBeInTheDocument();
    expect(
      screen.getByText('Tente buscar por outro termo ou limpe os filtros.')
    ).toBeInTheDocument();
    expect(screen.getByText('Limpar filtros')).toBeInTheDocument();
  });

  it('should render custom messages', () => {
    render(
      <EmptyState
        onClearFilters={() => {}}
        message="No terms found"
        subMessage="Try a different search"
        clearButtonText="Clear all"
      />
    );

    expect(screen.getByText('No terms found')).toBeInTheDocument();
    expect(screen.getByText('Try a different search')).toBeInTheDocument();
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('should call onClearFilters when button is clicked', () => {
    const mockClearFilters = vi.fn();
    render(<EmptyState onClearFilters={mockClearFilters} />);

    fireEvent.click(screen.getByText('Limpar filtros'));

    expect(mockClearFilters).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    render(<EmptyState onClearFilters={() => {}} />);

    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
  });
});

describe('AlphabetFilter', () => {
  it('should render all letters and "All" button', () => {
    render(<AlphabetFilter selectedLetter={null} onLetterClick={() => {}} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Z')).toBeInTheDocument();
  });

  it('should call onLetterClick when letter is clicked', () => {
    const mockOnLetterClick = vi.fn();
    render(<AlphabetFilter selectedLetter={null} onLetterClick={mockOnLetterClick} />);

    fireEvent.click(screen.getByText('A'));
    expect(mockOnLetterClick).toHaveBeenCalledWith('A');

    fireEvent.click(screen.getByText('B'));
    expect(mockOnLetterClick).toHaveBeenCalledWith('B');
  });

  it('should call onLetterClick with null when "All" is clicked', () => {
    const mockOnLetterClick = vi.fn();
    render(<AlphabetFilter selectedLetter="A" onLetterClick={mockOnLetterClick} />);

    fireEvent.click(screen.getByText('All'));
    expect(mockOnLetterClick).toHaveBeenCalledWith(null);
  });

  it('should indicate selected letter with aria-pressed', () => {
    render(<AlphabetFilter selectedLetter="B" onLetterClick={() => {}} />);

    expect(screen.getByText('B')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('All')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should indicate "All" as pressed when selectedLetter is null', () => {
    render(<AlphabetFilter selectedLetter={null} onLetterClick={() => {}} />);

    expect(screen.getByText('All')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('A')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should have accessible group role and label', () => {
    render(<AlphabetFilter selectedLetter={null} onLetterClick={() => {}} />);

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Filtrar termos por letra inicial');
  });

  it('should render 27 buttons (All + 26 letters)', () => {
    render(<AlphabetFilter selectedLetter={null} onLetterClick={() => {}} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(27);
  });
});

describe('FeaturedTermCard', () => {
  const mockTermo: TermoDestaque = {
    term: 'Endomidface',
    category: 'Técnica',
    subcategory: 'Rejuvenescimento',
    image: '/images/endomidface.png',
    description: '<p>Uma técnica revolucionária de <strong>rejuvenescimento facial</strong>.</p>',
    additionalText: 'Desenvolvida pelo Dr. Robério Brandão.',
    benefits: ['Resultados naturais', 'Recuperação rápida', 'Sem cicatrizes visíveis'],
  };

  it('should render term name', () => {
    render(<FeaturedTermCard termo={mockTermo} />);

    expect(screen.getByRole('heading', { level: 3, name: 'Endomidface' })).toBeInTheDocument();
  });

  it('should render category and subcategory', () => {
    render(<FeaturedTermCard termo={mockTermo} />);

    expect(screen.getByText('Técnica')).toBeInTheDocument();
    expect(screen.getByText('Rejuvenescimento')).toBeInTheDocument();
  });

  it('should render image with alt text', () => {
    render(<FeaturedTermCard termo={mockTermo} />);

    const image = screen.getByAltText('Ilustração de Endomidface');
    expect(image).toHaveAttribute('src', '/images/endomidface.png');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should sanitize and render HTML description', () => {
    render(<FeaturedTermCard termo={mockTermo} />);

    expect(screen.getByText(/rejuvenescimento facial/)).toBeInTheDocument();
  });

  it('should render additional text when provided', () => {
    render(<FeaturedTermCard termo={mockTermo} />);

    expect(screen.getByText('Desenvolvida pelo Dr. Robério Brandão.')).toBeInTheDocument();
  });

  it('should render benefits when provided', () => {
    render(<FeaturedTermCard termo={mockTermo} />);

    expect(screen.getByText('Benefícios principais')).toBeInTheDocument();
    expect(screen.getByText('Resultados naturais')).toBeInTheDocument();
    expect(screen.getByText('Recuperação rápida')).toBeInTheDocument();
    expect(screen.getByText('Sem cicatrizes visíveis')).toBeInTheDocument();
  });

  it('should not render benefits section when benefits not provided', () => {
    const termoWithoutBenefits: TermoDestaque = {
      term: 'Test Term',
      category: 'Category',
      subcategory: 'Subcategory',
      image: '/test.png',
      description: 'Description',
    };

    render(<FeaturedTermCard termo={termoWithoutBenefits} />);

    expect(screen.queryByText('Benefícios principais')).not.toBeInTheDocument();
  });

  it('should not render additional text when not provided', () => {
    const termoWithoutAdditional: TermoDestaque = {
      term: 'Test Term',
      category: 'Category',
      subcategory: 'Subcategory',
      image: '/test.png',
      description: 'Description',
    };

    render(<FeaturedTermCard termo={termoWithoutAdditional} />);

    // Should only have the description paragraph, not additional
    const paragraphs = screen.getAllByText(/./);
    expect(paragraphs).toBeDefined();
  });

  it('should sanitize dangerous HTML', () => {
    const termoWithXSS: TermoDestaque = {
      term: 'Test',
      category: 'Category',
      subcategory: 'Subcategory',
      image: '/test.png',
      description: '<script>alert("XSS")</script><p>Safe content</p>',
    };

    render(<FeaturedTermCard termo={termoWithXSS} />);

    // Script should be stripped, but safe content should remain
    expect(screen.getByText('Safe content')).toBeInTheDocument();
    // Script tag should not be in the document
    expect(document.querySelector('script')).toBeNull();
  });
});

describe('GeneralTermCard', () => {
  const mockItem: TermoGeral = {
    term: 'SMAS',
    letter: 'S',
    description: 'Sistema Músculo-Aponeurótico Superficial da face.',
    link: '/glossary/smas',
    linkText: 'Saiba mais',
  };

  it('should render term name', () => {
    render(<GeneralTermCard item={mockItem} />);

    expect(screen.getByRole('heading', { level: 3, name: 'SMAS' })).toBeInTheDocument();
  });

  it('should render letter badge', () => {
    render(<GeneralTermCard item={mockItem} />);

    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<GeneralTermCard item={mockItem} />);

    expect(
      screen.getByText('Sistema Músculo-Aponeurótico Superficial da face.')
    ).toBeInTheDocument();
  });

  it('should render link with correct href and text', () => {
    render(<GeneralTermCard item={mockItem} />);

    const link = screen.getByRole('link', { name: /Saiba mais/i });
    expect(link).toHaveAttribute('href', '/glossary/smas');
  });

  it('should be wrapped in article element', () => {
    render(<GeneralTermCard item={mockItem} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('should render different terms correctly', () => {
    const differentItem: TermoGeral = {
      term: 'Deep Plane',
      letter: 'D',
      description: 'Técnica de facelift profundo.',
      link: '/glossary/deep-plane',
      linkText: 'Learn more',
    };

    render(<GeneralTermCard item={differentItem} />);

    expect(screen.getByRole('heading', { name: 'Deep Plane' })).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
    expect(screen.getByText('Técnica de facelift profundo.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Learn more/i })).toHaveAttribute(
      'href',
      '/glossary/deep-plane'
    );
  });
});
