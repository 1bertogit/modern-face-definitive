/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the whole page.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback UI to show on error */
  fallback?: ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary for React islands
 *
 * Prevents errors in interactive components from breaking the entire page.
 * Falls back to a user-friendly error message.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo.componentStack);

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // In production, you could send to error tracking service
    if (import.meta.env.PROD) {
      // Example: sendToErrorTracking(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="p-6 bg-red-50 border border-red-200 rounded-lg text-center"
          role="alert"
          aria-live="assertive"
        >
          <span
            className="material-symbols-outlined text-3xl text-red-500 mb-2 block"
            aria-hidden="true"
          >
            error_outline
          </span>
          <h3 className="text-lg font-serif text-primary-900 mb-2">Algo deu errado</h3>
          <p className="text-sm text-warmGray mb-4">
            Ocorreu um erro inesperado. Por favor, tente novamente.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-primary-900 text-white text-sm rounded-lg
                       hover:bg-primary-800 transition-colors duration-300
                       focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Localized Error Boundary with translations
 */
interface LocalizedProps extends Props {
  locale?: 'pt' | 'en' | 'es';
}

const errorTranslations = {
  'pt': {
    title: 'Algo deu errado',
    description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    retry: 'Tentar novamente',
  },
  en: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
    retry: 'Try again',
  },
  es: {
    title: 'Algo salió mal',
    description: 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
    retry: 'Intentar de nuevo',
  },
};

export class LocalizedErrorBoundary extends Component<LocalizedProps, State> {
  constructor(props: LocalizedProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo.componentStack);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const locale = this.props.locale || 'pt';
      const t = errorTranslations[locale];

      return (
        <div
          className="p-6 bg-red-50 border border-red-200 rounded-lg text-center"
          role="alert"
          aria-live="assertive"
        >
          <span
            className="material-symbols-outlined text-3xl text-red-500 mb-2 block"
            aria-hidden="true"
          >
            error_outline
          </span>
          <h3 className="text-lg font-serif text-primary-900 mb-2">{t.title}</h3>
          <p className="text-sm text-warmGray mb-4">{t.description}</p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-primary-900 text-white text-sm rounded-lg
                       hover:bg-primary-800 transition-colors duration-300
                       focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {t.retry}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
