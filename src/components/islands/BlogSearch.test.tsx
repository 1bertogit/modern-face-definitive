/**
 * BlogSearch component tests
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogSearch from './BlogSearch';

const mockArticles = [
  {
    slug: 'endomidface-tecnica',
    title: 'Endomidface: A Técnica Revolucionária',
    description: 'Descubra como o Endomidface está transformando a cirurgia facial.',
    category: 'Técnicas',
    readTime: '5 min',
  },
  {
    slug: 'deep-neck-lift',
    title: 'Deep Neck Lift: Rejuvenescimento Cervical',
    description: 'Tudo sobre o procedimento de rejuvenescimento do pescoço.',
    category: 'Procedimentos',
    readTime: '8 min',
  },
  {
    slug: 'browlift-evolutivo',
    title: 'Browlift Evolutivo: Elevação Natural',
    description: 'A técnica de elevação de sobrancelhas com resultados naturais.',
    category: 'Técnicas',
    readTime: '6 min',
  },
  {
    slug: 'anatomia-facial',
    title: 'Anatomia Facial para Cirurgiões',
    description: 'Guia completo de anatomia facial aplicada.',
    category: 'Educação',
    readTime: '12 min',
  },
];

describe('BlogSearch', () => {
  describe('rendering', () => {
    it('should render search input', () => {
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      expect(input).toBeInTheDocument();
    });

    it('should render with correct placeholder for pt', () => {
      render(<BlogSearch articles={mockArticles} locale = 'pt' />);

      const input = screen.getByPlaceholderText('Buscar artigos...');
      expect(input).toBeInTheDocument();
    });

    it('should render with correct placeholder for en', () => {
      render(<BlogSearch articles={mockArticles} locale="en" />);

      const input = screen.getByPlaceholderText('Search articles...');
      expect(input).toBeInTheDocument();
    });

    it('should render with correct placeholder for es', () => {
      render(<BlogSearch articles={mockArticles} locale="es" />);

      const input = screen.getByPlaceholderText('Buscar artículos...');
      expect(input).toBeInTheDocument();
    });

    it('should have accessible label', () => {
      render(<BlogSearch articles={mockArticles} />);

      // Screen reader only label (default locale is EN)
      expect(screen.getByText('Search articles...')).toBeInTheDocument();
    });

    it('should not show results dropdown initially', () => {
      render(<BlogSearch articles={mockArticles} />);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should not show clear button when input is empty', () => {
      render(<BlogSearch articles={mockArticles} />);

      // Default locale is EN
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('should not show results for queries less than 2 characters', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'e');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should show results for queries with 2 or more characters', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'end');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('should filter articles by title', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        expect(screen.getByText('Endomidface: A Técnica Revolucionária')).toBeInTheDocument();
      });

      expect(
        screen.queryByText('Deep Neck Lift: Rejuvenescimento Cervical')
      ).not.toBeInTheDocument();
    });

    it('should filter articles by description', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'pescoço');

      await waitFor(() => {
        expect(screen.getByText('Deep Neck Lift: Rejuvenescimento Cervical')).toBeInTheDocument();
      });
    });

    it('should filter articles by category', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Técnicas');

      await waitFor(() => {
        expect(screen.getByText('Endomidface: A Técnica Revolucionária')).toBeInTheDocument();
        expect(screen.getByText('Browlift Evolutivo: Elevação Natural')).toBeInTheDocument();
      });
    });

    it('should be case-insensitive', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'ENDOMIDFACE');

      await waitFor(() => {
        expect(screen.getByText('Endomidface: A Técnica Revolucionária')).toBeInTheDocument();
      });
    });

    it('should show no results message when no matches found', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'xyz123');

      // Default locale is EN
      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
      });
    });

    it('should show no results message in English when locale is en', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} locale="en" />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'xyz123');

      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
      });
    });
  });

  describe('results count', () => {
    it('should show correct count for single result in pt', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} locale = 'pt' />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        expect(screen.getByText('1 artigo encontrado')).toBeInTheDocument();
      });
    });

    it('should show correct count for multiple results in pt', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} locale = 'pt' />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Técnicas');

      await waitFor(() => {
        expect(screen.getByText('2 artigos encontrados')).toBeInTheDocument();
      });
    });

    it('should show correct count for single result in en', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} locale="en" />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        expect(screen.getByText('1 article found')).toBeInTheDocument();
      });
    });

    it('should show correct count for multiple results in en', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} locale="en" />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Técnicas');

      await waitFor(() => {
        expect(screen.getByText('2 articles found')).toBeInTheDocument();
      });
    });
  });

  describe('clear functionality', () => {
    it('should show clear button when there is input', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');

      // Default locale is EN
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('should clear input when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');

      // Default locale is EN
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);

      expect(input).toHaveValue('');
    });

    it('should hide results when clear button is clicked', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // Default locale is EN
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('callback functionality', () => {
    it('should call onResults with filtered results', async () => {
      const onResults = vi.fn();
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} onResults={onResults} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        expect(onResults).toHaveBeenCalledWith([mockArticles[0]]);
      });
    });

    it('should call onResults with all articles when cleared', async () => {
      const onResults = vi.fn();
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} onResults={onResults} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      // Default locale is EN
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);

      await waitFor(() => {
        expect(onResults).toHaveBeenLastCalledWith(mockArticles);
      });
    });

    it('should call onResults with all articles when query is too short', async () => {
      const onResults = vi.fn();
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} onResults={onResults} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'e');

      await waitFor(() => {
        expect(onResults).toHaveBeenCalledWith(mockArticles);
      });
    });
  });

  describe('URL generation', () => {
    it('should generate correct URLs for pt locale', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} locale = 'pt' />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        const link = screen.getByRole('option');
        // PT-BR uses /pt/ prefix
        expect(link).toHaveAttribute('href', '/pt/blog/endomidface-tecnica');
      });
    });

    it('should generate correct URLs for en locale', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} locale="en" />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        const link = screen.getByRole('option');
        // EN is default locale - no prefix
        expect(link).toHaveAttribute('href', '/blog/endomidface-tecnica');
      });
    });

    it('should generate correct URLs for es locale', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} locale="es" />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        const link = screen.getByRole('option');
        // ES uses /es/ prefix
        expect(link).toHaveAttribute('href', '/es/blog/endomidface-tecnica');
      });
    });
  });

  describe('results limit', () => {
    it('should only show first 8 results', async () => {
      const manyArticles = Array.from({ length: 12 }, (_, i) => ({
        slug: `article-${i}`,
        title: `Article Test ${i}`,
        description: 'Test description',
        category: 'Test',
        readTime: '5 min',
      }));

      const user = userEvent.setup();
      render(<BlogSearch articles={manyArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Test');

      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(8);
      });
    });

    it('should show more results indicator when there are more than 8 results', async () => {
      const manyArticles = Array.from({ length: 12 }, (_, i) => ({
        slug: `article-${i}`,
        title: `Article Test ${i}`,
        description: 'Test description',
        category: 'Test',
        readTime: '5 min',
      }));

      const user = userEvent.setup();
      render(<BlogSearch articles={manyArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Test');

      await waitFor(() => {
        expect(screen.getByText('+ 4 mais resultados')).toBeInTheDocument();
      });
    });
  });

  describe('focus behavior', () => {
    it('should show results on focus if query is 2+ characters', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'End');

      // Click outside to hide results
      await user.click(document.body);

      // Focus again should show results
      await user.click(input);

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });
  });

  describe('overlay', () => {
    it('should close results when clicking overlay', async () => {
      const user = userEvent.setup();
      render(<BlogSearch articles={mockArticles} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'Endomidface');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      // The overlay is a fixed div that covers the entire screen
      // We simulate clicking outside by clicking on the overlay
      const overlay = document.querySelector('.fixed.inset-0');
      if (overlay) {
        fireEvent.click(overlay);
      }

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });
});
