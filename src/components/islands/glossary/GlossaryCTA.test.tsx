/**
 * GlossaryCTA Component Tests
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GlossaryCTA from './GlossaryCTA';

describe('GlossaryCTA', () => {
  it('renders with default props', () => {
    render(<GlossaryCTA />);

    expect(screen.getByText('Ainda tem dúvidas sobre algum termo?')).toBeDefined();
    expect(screen.getByText('Agendar Avaliação')).toBeDefined();
    expect(screen.getByText('Ver Resultados')).toBeDefined();
  });

  it('renders with custom title', () => {
    render(<GlossaryCTA title="Custom Title" />);

    expect(screen.getByText('Custom Title')).toBeDefined();
  });

  it('renders with custom description', () => {
    render(<GlossaryCTA description="Custom description text" />);

    expect(screen.getByText('Custom description text')).toBeDefined();
  });

  it('renders primary button with custom text and href', () => {
    render(<GlossaryCTA primaryButtonText="Schedule Now" primaryButtonHref="/schedule" />);

    const button = screen.getByText('Schedule Now');
    expect(button).toBeDefined();
    expect(button.closest('a')).toHaveProperty('href');
    expect(button.closest('a')?.getAttribute('href')).toBe('/schedule');
  });

  it('renders secondary button with custom text and href', () => {
    render(<GlossaryCTA secondaryButtonText="See Cases" secondaryButtonHref="/cases" />);

    const button = screen.getByText('See Cases');
    expect(button).toBeDefined();
    expect(button.closest('a')).toHaveProperty('href');
    expect(button.closest('a')?.getAttribute('href')).toBe('/cases');
  });

  it('renders anatomy image with lazy loading', () => {
    render(<GlossaryCTA />);

    const img = screen.getByAltText('Anatomia Facial');
    expect(img).toBeDefined();
    expect(img.getAttribute('loading')).toBe('lazy');
  });

  it('has correct styling for section', () => {
    const { container } = render(<GlossaryCTA />);

    const section = container.querySelector('section');
    expect(section).toBeDefined();
    expect(section?.className).toContain('bg-primary-900');
    expect(section?.className).toContain('text-white');
  });

  it('renders with all custom props', () => {
    render(
      <GlossaryCTA
        title="Have Questions?"
        description="Contact us for more information."
        primaryButtonText="Contact"
        primaryButtonHref="/contact"
        secondaryButtonText="Learn More"
        secondaryButtonHref="/about"
      />
    );

    expect(screen.getByText('Have Questions?')).toBeDefined();
    expect(screen.getByText('Contact us for more information.')).toBeDefined();
    expect(screen.getByText('Contact')).toBeDefined();
    expect(screen.getByText('Learn More')).toBeDefined();

    const contactLink = screen.getByText('Contact').closest('a');
    const learnMoreLink = screen.getByText('Learn More').closest('a');

    expect(contactLink?.getAttribute('href')).toBe('/contact');
    expect(learnMoreLink?.getAttribute('href')).toBe('/about');
  });
});
