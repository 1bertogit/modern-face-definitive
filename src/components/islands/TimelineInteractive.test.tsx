import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimelineInteractive from './TimelineInteractive';

describe('TimelineInteractive', () => {
  it('renders timeline events', () => {
    render(<TimelineInteractive />);

    // Check that events are rendered
    expect(screen.getByText(/Primeira cirurgia facial documentada/i)).toBeInTheDocument();
    // Date appears in multiple places (badge and content), so check it exists at least once
    expect(screen.getAllByText(/~600 a.C./i).length).toBeGreaterThan(0);
  });

  it('renders filter controls', () => {
    render(<TimelineInteractive />);

    // Search input
    const searchInput = screen.getByPlaceholderText(/Buscar/i);
    expect(searchInput).toBeInTheDocument();

    // Category filter buttons (use getByRole to avoid matching category badges)
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reconstrução' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Estética' })).toBeInTheDocument();
  });

  it('renders all category filter buttons', () => {
    render(<TimelineInteractive />);

    const categories = [
      'Todos',
      'Reconstrução',
      'Estética',
      'Anatomia & Planos',
      'Tecnologia',
      'Terço médio (MIDFACE)',
      'Volumetria',
      'Marco crítico',
      'Era / Conceito',
    ];

    // Use getByRole to specifically target filter buttons (not category badges)
    categories.forEach((cat) => {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument();
    });
  });

  it('filters events by category', () => {
    render(<TimelineInteractive />);

    // Click on "Estética" category filter button
    const esteticaButton = screen.getByRole('button', { name: 'Estética' });
    fireEvent.click(esteticaButton);

    // Should show aesthetic events
    expect(screen.getByText(/Holländer/i)).toBeInTheDocument();
    expect(screen.getByText(/Passot/i)).toBeInTheDocument();

    // Should not show reconstruction events
    expect(screen.queryByText(/Sushruta/i)).not.toBeInTheDocument();
  });

  it('filters events by search query', () => {
    render(<TimelineInteractive />);

    const searchInput = screen.getByPlaceholderText(/Buscar/i);
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });

    // Should show SMAS-related events (name appears in multiple places)
    expect(screen.getAllByText(/Mitz & Peyronie/i).length).toBeGreaterThan(0);

    // Should not show unrelated events
    expect(screen.queryByText(/Sushruta/i)).not.toBeInTheDocument();
  });

  it('search is case insensitive', () => {
    render(<TimelineInteractive />);

    const searchInput = screen.getByPlaceholderText(/Buscar/i);
    fireEvent.change(searchInput, { target: { value: 'smas' } });

    // Name appears in multiple places
    expect(screen.getAllByText(/Mitz & Peyronie/i).length).toBeGreaterThan(0);
  });

  it('shows only critical events when toggle is checked', () => {
    render(<TimelineInteractive />);

    const criticalToggle = screen.getByLabelText(/Mostrar apenas pontos críticos/i);
    fireEvent.click(criticalToggle);

    // Should show critical events
    expect(screen.getByText(/Sushruta/i)).toBeInTheDocument();

    // Should not show non-critical events
    expect(screen.queryByText(/Tagliacozzi/i)).not.toBeInTheDocument();
  });

  it('displays event count', () => {
    render(<TimelineInteractive />);

    // Should display count of events
    expect(screen.getByText(/evento\(s\)/i)).toBeInTheDocument();
  });

  it('expands event when clicked', () => {
    render(<TimelineInteractive />);

    // Find first event button (Sushruta is first chronologically)
    const eventButton = screen.getByRole('button', {
      name: /Expandir detalhes de Reconstrução nasal/i,
    });

    expect(eventButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(eventButton);

    expect(eventButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses event when clicked again', () => {
    render(<TimelineInteractive />);

    // Find and click event to expand
    const eventButton = screen.getByRole('button', {
      name: /Expandir detalhes de Reconstrução nasal/i,
    });

    fireEvent.click(eventButton);
    expect(eventButton).toHaveAttribute('aria-expanded', 'true');

    // Click again to collapse
    fireEvent.click(eventButton);
    expect(eventButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('collapses all events when collapse button is clicked', () => {
    render(<TimelineInteractive />);

    // Expand an event first
    const eventButton = screen.getByRole('button', {
      name: /Expandir detalhes de Reconstrução nasal/i,
    });
    fireEvent.click(eventButton);
    expect(eventButton).toHaveAttribute('aria-expanded', 'true');

    // Click collapse all
    const collapseAllButton = screen.getByText(/Recolher tudo/i);
    fireEvent.click(collapseAllButton);

    // Event should be collapsed
    expect(eventButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('combines category and search filters', () => {
    render(<TimelineInteractive />);

    // Filter by category first (use getByRole to target button)
    const reconstrucaoButton = screen.getByRole('button', { name: 'Reconstrução' });
    fireEvent.click(reconstrucaoButton);

    // Then search
    const searchInput = screen.getByPlaceholderText(/Buscar/i);
    fireEvent.change(searchInput, { target: { value: 'Gillies' } });

    // Should show only Gillies event
    expect(screen.getByText(/Gillies/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sushruta/i)).not.toBeInTheDocument();
  });

  it('renders references section', () => {
    render(<TimelineInteractive />);

    expect(screen.getByText(/Referências-chave/i)).toBeInTheDocument();
    // "rinoplastia reconstrutiva" appears in multiple places (reference list and event description)
    expect(screen.getAllByText(/rinoplastia reconstrutiva/i).length).toBeGreaterThan(0);
  });

  it('renders KPI sections', () => {
    render(<TimelineInteractive />);

    expect(screen.getByText(/Ponto crítico #1/i)).toBeInTheDocument();
    expect(screen.getByText(/Ponto crítico #2/i)).toBeInTheDocument();
  });

  it('shows expanded event details when expanded', () => {
    render(<TimelineInteractive />);

    // Find the SMAS event which has details
    const searchInput = screen.getByPlaceholderText(/Buscar/i);
    fireEvent.change(searchInput, { target: { value: 'Mitz' } });

    const smaseventButton = screen.getByRole('button', {
      name: /detalhes de Mitz/i,
    });

    fireEvent.click(smaseventButton);

    // Should show details
    expect(screen.getByText(/SMAS vira referência anatômica/i)).toBeInTheDocument();
  });

  it('shows critical badge for critical events', () => {
    render(<TimelineInteractive />);

    // Filter to show critical events
    const criticalToggle = screen.getByLabelText(/Mostrar apenas pontos críticos/i);
    fireEvent.click(criticalToggle);

    // Expand the Sushruta event
    const eventButton = screen.getByRole('button', {
      name: /detalhes de Reconstrução nasal/i,
    });
    fireEvent.click(eventButton);

    // Text appears in multiple places (KPI section and event description)
    expect(screen.getAllByText(/Primeira cirurgia facial documentada/i).length).toBeGreaterThan(0);
  });

  it('renders Face Moderna event', () => {
    render(<TimelineInteractive />);

    // Face Moderna appears in multiple places (title, events, KPI)
    expect(screen.getAllByText(/Face Moderna/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2020s/i).length).toBeGreaterThan(0);
  });

  it('events are sorted chronologically', () => {
    render(<TimelineInteractive />);

    // Get all year displays
    const yearElements = screen.getAllByText(/\d{4}|a\.C\./);

    // First should be ancient (600 a.C.)
    expect(yearElements[0].textContent).toContain('a.C.');
  });

  it('returns all events when Todos is selected after filtering', () => {
    render(<TimelineInteractive />);

    // Filter first (use getByRole to target button)
    const esteticaButton = screen.getByRole('button', { name: 'Estética' });
    fireEvent.click(esteticaButton);

    // Then select Todos (use getByRole to target button)
    const todosButton = screen.getByRole('button', { name: 'Todos' });
    fireEvent.click(todosButton);

    // All categories should be visible
    expect(screen.getByText(/Sushruta/i)).toBeInTheDocument();
    expect(screen.getByText(/Holländer/i)).toBeInTheDocument();
  });

  it('clears search and shows all events', () => {
    render(<TimelineInteractive />);

    const searchInput = screen.getByPlaceholderText(/Buscar/i);

    // Search for something
    fireEvent.change(searchInput, { target: { value: 'SMAS' } });
    expect(screen.queryByText(/Sushruta/i)).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText(/Sushruta/i)).toBeInTheDocument();
  });

  it('renders with default pt locale', () => {
    render(<TimelineInteractive />);

    // Portuguese labels should be present
    expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument();
    expect(screen.getByText(/Mostrar apenas pontos críticos/i)).toBeInTheDocument();
    expect(screen.getByText(/Recolher tudo/i)).toBeInTheDocument();
  });

  // Note: locale prop was removed as Timeline content is only available in Portuguese
  // This test is kept as documentation that the component renders consistently

  it('updates event count when filtering', () => {
    render(<TimelineInteractive />);

    // Get initial count
    const countElement = screen.getByText(/evento\(s\)/i);
    const initialCount = parseInt(countElement.textContent?.match(/\d+/)?.[0] || '0');

    // Filter by category (use getByRole to target button)
    const esteticaButton = screen.getByRole('button', { name: 'Estética' });
    fireEvent.click(esteticaButton);

    // Count should be smaller
    const newCount = parseInt(countElement.textContent?.match(/\d+/)?.[0] || '0');
    expect(newCount).toBeLessThan(initialCount);
  });
});
