/**
 * ErrorBoundary Tests
 *
 * Tests for error boundary component that catches React errors
 * and displays fallback UI.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary, LocalizedErrorBoundary } from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Suppress console.error during tests (ErrorBoundary logs errors)
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  describe('rendering', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('renders default fallback UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Check for error UI elements
      expect(screen.getByText(/Algo deu errado/i)).toBeInTheDocument();
      expect(screen.getByText(/Ocorreu um erro inesperado/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Tentar novamente/i })).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
      const customFallback = <div>Custom error message</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByText(/Algo deu errado/i)).not.toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('calls onError callback when error occurs', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Test error message'),
        }),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('logs error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('retry functionality', () => {
    it('resets error state when retry button is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error UI should be visible
      expect(screen.getByText(/Algo deu errado/i)).toBeInTheDocument();

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /Tentar novamente/i });
      retryButton.click();

      // Re-render with no error to simulate retry
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Should show content without error
      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByText(/Algo deu errado/i)).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = screen.getByRole('alert');
      expect(errorContainer).toBeInTheDocument();
      expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
    });

    it('has accessible retry button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: /Tentar novamente/i });
      expect(retryButton).toBeInTheDocument();
      // Button is focusable (can be focused programmatically)
      retryButton.focus();
      expect(retryButton).toHaveFocus();
    });
  });
});

describe('LocalizedErrorBoundary', () => {
  describe('localization', () => {
    it('renders Portuguese error message for pt locale', () => {
      render(
        <LocalizedErrorBoundary locale = 'pt'>
          <ThrowError shouldThrow={true} />
        </LocalizedErrorBoundary>
      );

      expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
      expect(screen.getByText(/Ocorreu um erro inesperado/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
    });

    it('renders English error message for en locale', () => {
      render(
        <LocalizedErrorBoundary locale="en">
          <ThrowError shouldThrow={true} />
        </LocalizedErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });

    it('renders Spanish error message for es locale', () => {
      render(
        <LocalizedErrorBoundary locale="es">
          <ThrowError shouldThrow={true} />
        </LocalizedErrorBoundary>
      );

      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
      expect(screen.getByText(/Ocurrió un error inesperado/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeInTheDocument();
    });

    it('defaults to Portuguese when locale is not provided', () => {
      render(
        <LocalizedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </LocalizedErrorBoundary>
      );

      expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    });
  });

  describe('custom fallback', () => {
    it('uses custom fallback when provided', () => {
      const customFallback = <div>Custom error</div>;

      render(
        <LocalizedErrorBoundary locale="en" fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </LocalizedErrorBoundary>
      );

      expect(screen.getByText('Custom error')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('error callback', () => {
    it('calls onError callback with error details', () => {
      const onError = vi.fn();

      render(
        <LocalizedErrorBoundary locale="en" onError={onError}>
          <ThrowError shouldThrow={true} />
        </LocalizedErrorBoundary>
      );

      expect(onError).toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Test error message'),
        }),
        expect.any(Object)
      );
    });
  });
});
