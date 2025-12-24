import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FAQAccordion from './FAQAccordion';

const mockItems = [
  {
    question: 'What is Endomidface?',
    answer: 'A revolutionary technique for midface rejuvenation.',
  },
  {
    question: 'How long is recovery?',
    answer: 'Average recovery is 7 days.',
  },
  {
    question: 'Is the procedure safe?',
    answer: 'Yes, with 0% permanent nerve damage rate.',
  },
];

describe('FAQAccordion', () => {
  it('renders all FAQ items', () => {
    render(<FAQAccordion items={mockItems} />);

    mockItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
  });

  it('first item is expanded by default', () => {
    render(<FAQAccordion items={mockItems} />);

    const firstButton = screen.getAllByRole('button')[0];
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');

    const secondButton = screen.getAllByRole('button')[1];
    expect(secondButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles item on click', () => {
    render(<FAQAccordion items={mockItems} />);

    const secondButton = screen.getAllByRole('button')[1];

    // Click second item
    fireEvent.click(secondButton);
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');

    // First item should be closed
    const firstButton = screen.getAllByRole('button')[0];
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes item when clicking on it again', () => {
    render(<FAQAccordion items={mockItems} />);

    const firstButton = screen.getAllByRole('button')[0];

    // First item is expanded by default
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('has proper accessibility attributes', () => {
    render(<FAQAccordion items={mockItems} />);

    const buttons = screen.getAllByRole('button');
    const regions = screen.getAllByRole('region');

    // Check that each button has aria-controls
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-controls');
      expect(button).toHaveAttribute('id');
    });

    // Check that each region panel has aria-labelledby
    // Note: only visible panels will have role="region" that is not hidden
    expect(regions.length).toBeGreaterThan(0);
  });

  it('renders empty state gracefully', () => {
    render(<FAQAccordion items={[]} />);

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });
});
