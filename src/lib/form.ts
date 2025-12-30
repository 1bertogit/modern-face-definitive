/**
 * Contact Form Configuration
 *
 * This module handles form submissions for the contact pages.
 * Uses Web3Forms API for serverless form handling.
 *
 * Features:
 * - Zod validation for type-safe input
 * - XSS sanitization for security
 * - Automatic retry with exponential backoff
 * - Structured error handling with specific error types
 * - Conditional logging (dev only)
 *
 * Setup:
 * 1. Create a free account at https://web3forms.com
 * 2. Get your Access Key from the dashboard
 * 3. Set PUBLIC_WEB3FORMS_KEY in .env
 */

import { z } from 'zod';

// ============================================================================
// Configuration
// ============================================================================

export const FORM_CONFIG = {
  /** Web3Forms endpoint */
  endpoint: 'https://api.web3forms.com/submit',

  /** Access key from environment or empty string (will trigger WhatsApp fallback) */
  accessKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || '',

  /** Redirect after submission (optional) */
  redirectUrl: '',

  /** Email to receive submissions */
  toEmail: 'contato@drroberiobrandao.com',

  /** Subject prefix for email organization */
  subjectPrefix: '[Dr. Robério Brandão Website]',

  /** Maximum retry attempts */
  maxRetries: 3,

  /** Base delay for exponential backoff (ms) */
  retryBaseDelay: 1000,
} as const;

/**
 * WhatsApp contact configuration
 */
export const WHATSAPP_CONFIG = {
  /** Clinic WhatsApp (consultations) */
  clinic: {
    number: '5584920013480',
    url: 'https://api.whatsapp.com/send?phone=5584920013480',
    defaultMessage: {
      'pt': 'Olá! Gostaria de mais informações sobre consultas.',
      en: 'Hello! I would like more information about consultations.',
      es: '¡Hola! Me gustaría más información sobre consultas.',
    },
  },

  /** Courses WhatsApp */
  courses: {
    url: 'https://link.drroberiobrandao.com/personal-website',
    defaultMessage: {
      'pt': 'Olá! Gostaria de informações sobre os cursos de formação.',
      en: 'Hello! I would like information about training courses.',
      es: '¡Hola! Me gustaría información sobre los cursos de formación.',
    },
  },
} as const;

// ============================================================================
// Types & Schemas
// ============================================================================

/**
 * Error types for specific handling
 */
export type FormErrorType =
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'CONFIGURATION_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Structured form error with type information
 */
export interface FormError {
  type: FormErrorType;
  message: string;
  field?: string;
  retryable: boolean;
}

/**
 * Zod schema for form validation
 * Includes XSS protection via regex and size limits
 */
export const formDataSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[^<>{}]*$/, 'Nome contém caracteres inválidos')
    .transform((val) => sanitizeInput(val)),

  email: z
    .string()
    .email('E-mail inválido')
    .max(254, 'E-mail muito longo')
    .toLowerCase()
    .transform((val) => sanitizeInput(val)),

  phone: z
    .string()
    .max(20, 'Telefone muito longo')
    .regex(/^[0-9+\-() ]*$/, 'Telefone contém caracteres inválidos')
    .optional()
    .transform((val) => (val ? sanitizeInput(val) : undefined)),

  subject: z
    .string()
    .min(1, 'Assunto é obrigatório')
    .max(200, 'Assunto muito longo')
    .regex(/^[^<>{}]*$/, 'Assunto contém caracteres inválidos')
    .transform((val) => sanitizeInput(val)),

  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(5000, 'Mensagem deve ter no máximo 5000 caracteres')
    .transform((val) => sanitizeInput(val)),
});

/** Inferred type from Zod schema */
export type FormData = z.infer<typeof formDataSchema>;

/** Raw form data before validation */
export interface RawFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface FormResponse {
  success: boolean;
  message: string;
  error?: FormError;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Conditional logger - only logs in development
 * Uses console methods intentionally for dev-only debugging
 */
/* eslint-disable no-console */
const logger = {
  warn: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn(`[Form] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error(`[Form] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.info(`[Form] ${message}`, ...args);
    }
  },
};
/* eslint-enable no-console */

/**
 * Sanitize input to prevent XSS attacks
 * Removes potentially dangerous HTML/script content
 * Optimized to use fewer regex passes
 */
export function sanitizeInput(input: string): string {
  // Single pass for HTML entities and dangerous patterns
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>|javascript:|on\w+\s*=/gi, '')
    .replace(/&(lt|gt|amp);/g, (match, entity) => {
      switch (entity) {
        case 'lt': return '<';
        case 'gt': return '>';
        case 'amp': return '&';
        default: return match;
      }
    });
  
  return sanitized.trim();
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function getWhatsAppUrl(
  type: 'clinic' | 'courses',
  locale: 'pt' | 'en' | 'es' = 'pt',
  customMessage?: string
): string {
  const config = WHATSAPP_CONFIG[type];
  const message = customMessage || config.defaultMessage[locale];

  if (type === 'courses') {
    return config.url;
  }

  return `${config.url}&text=${encodeURIComponent(message)}`;
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create structured error from caught exception
 */
function createFormError(error: unknown, defaultType: FormErrorType = 'UNKNOWN_ERROR'): FormError {
  if (error instanceof z.ZodError) {
    const firstError = error.errors[0];
    return {
      type: 'VALIDATION_ERROR',
      message: firstError?.message || 'Dados inválidos',
      field: firstError?.path.join('.'),
      retryable: false,
    };
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Erro de conexão. Verifique sua internet.',
      retryable: true,
    };
  }

  if (error instanceof Error) {
    // Check for rate limiting
    if (error.message.includes('429') || error.message.toLowerCase().includes('rate limit')) {
      return {
        type: 'RATE_LIMIT_ERROR',
        message: 'Muitas tentativas. Aguarde alguns minutos.',
        retryable: true,
      };
    }

    return {
      type: defaultType,
      message: error.message || 'Erro desconhecido',
      retryable: defaultType !== 'VALIDATION_ERROR',
    };
  }

  return {
    type: 'UNKNOWN_ERROR',
    message: 'Erro inesperado. Tente novamente.',
    retryable: true,
  };
}

// ============================================================================
// Form Submission
// ============================================================================

/**
 * Validate form data using Zod schema
 */
export function validateFormData(data: RawFormData): {
  success: boolean;
  data?: FormData;
  error?: FormError;
} {
  try {
    const validatedData = formDataSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error: createFormError(error),
    };
  }
}

/**
 * Submit form to Web3Forms with validation and retry logic
 *
 * @param rawData - Raw form data (will be validated)
 * @param options - Submission options
 * @returns Promise with success status and message
 */
export async function submitForm(
  rawData: RawFormData,
  options: { retries?: number } = {}
): Promise<FormResponse> {
  const maxRetries = options.retries ?? FORM_CONFIG.maxRetries;

  // Check configuration
  if (!FORM_CONFIG.accessKey) {
    logger.warn('Web3Forms not configured. Use WhatsApp for contact.');
    return {
      success: false,
      message: 'Formulário não configurado. Use o WhatsApp.',
      error: {
        type: 'CONFIGURATION_ERROR',
        message: 'Web3Forms access key not configured',
        retryable: false,
      },
    };
  }

  // Validate input
  const validation = validateFormData(rawData);
  if (!validation.success || !validation.data) {
    return {
      success: false,
      message: validation.error?.message || 'Dados inválidos',
      error: validation.error,
    };
  }

  const data = validation.data;

  // Attempt submission with retries
  let lastError: FormError | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = FORM_CONFIG.retryBaseDelay * Math.pow(2, attempt - 1);
        logger.info(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
        await sleep(delay);
      }

      const response = await fetch(FORM_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: FORM_CONFIG.accessKey,
          subject: `${FORM_CONFIG.subjectPrefix} ${data.subject}`,
          from_name: data.name,
          email: data.email,
          phone: data.phone || 'Não informado',
          message: data.message,
          // Honeypot for spam protection
          botcheck: '',
        }),
      });

      // Handle rate limiting
      if (response.status === 429) {
        lastError = {
          type: 'RATE_LIMIT_ERROR',
          message: 'Muitas tentativas. Aguarde alguns minutos.',
          retryable: true,
        };
        continue;
      }

      // Handle server errors
      if (response.status >= 500) {
        lastError = {
          type: 'SERVER_ERROR',
          message: 'Servidor indisponível. Tente novamente.',
          retryable: true,
        };
        continue;
      }

      const result = await response.json();

      if (result.success) {
        logger.info('Form submitted successfully');
        return {
          success: true,
          message: 'Mensagem enviada com sucesso!',
        };
      }

      // API returned error
      return {
        success: false,
        message: result.message || 'Erro ao enviar mensagem.',
        error: {
          type: 'SERVER_ERROR',
          message: result.message || 'API error',
          retryable: false,
        },
      };
    } catch (error) {
      lastError = createFormError(error, 'NETWORK_ERROR');
      logger.error('Form submission attempt failed:', error);

      // Don't retry non-retryable errors
      if (!lastError.retryable) {
        break;
      }
    }
  }

  // All retries exhausted
  return {
    success: false,
    message: lastError?.message || 'Erro de conexão. Tente novamente.',
    error: lastError || {
      type: 'NETWORK_ERROR',
      message: 'Connection failed after retries',
      retryable: false,
    },
  };
}

/**
 * Get user-friendly error message by locale
 */
export function getErrorMessage(error: FormError, locale: 'pt' | 'en' | 'es' = 'pt'): string {
  const messages: Record<FormErrorType, Record<string, string>> = {
    VALIDATION_ERROR: {
      'pt': error.message,
      en: error.message,
      es: error.message,
    },
    NETWORK_ERROR: {
      'pt': 'Erro de conexão. Verifique sua internet e tente novamente.',
      en: 'Connection error. Check your internet and try again.',
      es: 'Error de conexión. Verifique su internet e intente nuevamente.',
    },
    SERVER_ERROR: {
      'pt': 'Servidor indisponível. Tente novamente em alguns minutos.',
      en: 'Server unavailable. Try again in a few minutes.',
      es: 'Servidor no disponible. Intente nuevamente en unos minutos.',
    },
    CONFIGURATION_ERROR: {
      'pt': 'Formulário não configurado. Use o WhatsApp para contato.',
      en: 'Form not configured. Use WhatsApp to contact us.',
      es: 'Formulario no configurado. Use WhatsApp para contactarnos.',
    },
    RATE_LIMIT_ERROR: {
      'pt': 'Muitas tentativas. Aguarde alguns minutos.',
      en: 'Too many attempts. Wait a few minutes.',
      es: 'Demasiados intentos. Espere unos minutos.',
    },
    UNKNOWN_ERROR: {
      'pt': 'Erro inesperado. Tente novamente ou use o WhatsApp.',
      en: 'Unexpected error. Try again or use WhatsApp.',
      es: 'Error inesperado. Intente nuevamente o use WhatsApp.',
    },
  };

  return messages[error.type]?.[locale] || messages[error.type]?.['pt'] || error.message;
}
