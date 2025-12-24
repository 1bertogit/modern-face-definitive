import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from './MobileMenu';

const mockNavLinks = [
  {
    label: 'Técnicas',
    path: '/tecnicas',
    children: [
      { label: 'Endomidface', path: '/tecnicas/endomidface' },
      { label: 'Deep Neck', path: '/tecnicas/deep-neck' },
    ],
  },
  {
    label: 'Formação',
    path: '/formacao',
  },
  {
    label: 'Sobre',
    path: '/sobre',
  },
];

const mockLanguageSwitcher = [
  { locale: 'pt', name: 'PT', path: '/', isActive: true },
  { locale: 'en', name: 'EN', path: '/en', isActive: false },
  { locale: 'es', name: 'ES', path: '/es', isActive: false },
];

describe('MobileMenu', () => {
  it('renders menu toggle button', () => {
    render(<MobileMenu navLinks={mockNavLinks} currentPath="/" />);

    const button = screen.getByRole('button', { name: /abrir menu/i });
    expect(button).toBeInTheDocument();
  });

  it('menu is closed by default', () => {
    render(<MobileMenu navLinks={mockNavLinks} currentPath="/" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens menu when toggle button is clicked', () => {
    render(<MobileMenu navLinks={mockNavLinks} currentPath="/" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Navigation links should now be visible
    expect(screen.getByText('Técnicas')).toBeInTheDocument();
    expect(screen.getByText('Formação')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
  });

  it('closes menu when toggle button is clicked again', () => {
    render(<MobileMenu navLinks={mockNavLinks} currentPath="/" />);

    const button = screen.getByRole('button');

    // Open menu
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Close menu
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands submenu when expand button is clicked', () => {
    render(<MobileMenu navLinks={mockNavLinks} currentPath="/" />);

    // Open menu first
    const menuButton = screen.getByRole('button', { name: /abrir menu/i });
    fireEvent.click(menuButton);

    // Click expand button for Técnicas
    const expandButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(expandButton);

    // Children should be visible
    expect(screen.getByText('Endomidface')).toBeInTheDocument();
    expect(screen.getByText('Deep Neck')).toBeInTheDocument();
  });

  it('collapses submenu when expand button is clicked again', () => {
    render(<MobileMenu navLinks={mockNavLinks} currentPath="/" />);

    // Open menu
    const menuButton = screen.getByRole('button', { name: /abrir menu/i });
    fireEvent.click(menuButton);

    // Expand submenu
    const expandButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(expandButton);

    expect(screen.getByText('Endomidface')).toBeInTheDocument();

    // Collapse submenu
    fireEvent.click(expandButton);

    expect(screen.queryByText('Endomidface')).not.toBeInTheDocument();
  });

  it('renders language switcher when provided', () => {
    render(
      <MobileMenu navLinks={mockNavLinks} currentPath="/" languageSwitcher={mockLanguageSwitcher} />
    );

    // Open menu
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    // Language options should be visible
    expect(screen.getByText('PT')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('ES')).toBeInTheDocument();
  });

  it('highlights active language', () => {
    render(
      <MobileMenu navLinks={mockNavLinks} currentPath="/" languageSwitcher={mockLanguageSwitcher} />
    );

    // Open menu
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const ptLink = screen.getByText('PT').closest('a');
    expect(ptLink).toHaveClass('bg-accent-700');
  });

  it('uses correct aria labels for different locales', () => {
    const { rerender } = render(
      <MobileMenu navLinks={mockNavLinks} currentPath="/" locale = 'pt' />
    );

    expect(screen.getByRole('button', { name: /abrir menu/i })).toBeInTheDocument();

    rerender(<MobileMenu navLinks={mockNavLinks} currentPath="/" locale="en" />);

    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('highlights current path in navigation', () => {
    render(<MobileMenu navLinks={mockNavLinks} currentPath="/formacao" />);

    // Open menu
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const formacaoLink = screen.getByText('Formação').closest('a');
    expect(formacaoLink).toHaveClass('text-accent-700');
  });

  it('renders empty state gracefully', () => {
    render(<MobileMenu navLinks={[]} currentPath="/" />);

    // Should still render the toggle button
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Open menu
    fireEvent.click(button);

    // No navigation links should exist
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
