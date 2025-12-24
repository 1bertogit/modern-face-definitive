/**
 * Tests for form.ts - Contact Form Utilities
 *
 * Covers:
 * - sanitizeInput: XSS prevention
 * - formDataSchema: Zod validation
 * - validateFormData: Validation helper
 * - getWhatsAppUrl: URL generation
 * - submitForm: Form submission with mocking
 * - getErrorMessage: i18n error messages
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  sanitizeInput,
  formDataSchema,
  validateFormData,
  getWhatsAppUrl,
  submitForm,
  getErrorMessage,
  FORM_CONFIG,
  WHATSAPP_CONFIG,
  type FormError,
  type RawFormData,
} from './form';

// ============================================================================
// sanitizeInput Tests
// ============================================================================

describe('sanitizeInput', () => {
  it('removes script tags', () => {
    const input = 'Hello <script>alert("xss")</script> World';
    expect(sanitizeInput(input)).toBe('Hello  World');
  });

  it('removes HTML tags', () => {
    const input = '<div>Hello</div> <p>World</p>';
    expect(sanitizeInput(input)).toBe('Hello World');
  });

  it('removes javascript: protocol', () => {
    const input = 'Click javascript:alert("xss")';
    expect(sanitizeInput(input)).toBe('Click alert("xss")');
  });

  it('removes event handlers', () => {
    const input = 'Image onerror=alert("xss") src="x"';
    expect(sanitizeInput(input)).toBe('Image alert("xss") src="x"');
  });

  it('handles onclick handlers', () => {
    const input = 'Button onclick=doSomething()';
    expect(sanitizeInput(input)).toBe('Button doSomething()');
  });

  it('trims whitespace', () => {
    const input = '  Hello World  ';
    expect(sanitizeInput(input)).toBe('Hello World');
  });

  it('decodes HTML entities', () => {
    const input = '&lt;script&gt;';
    expect(sanitizeInput(input)).toBe('<script>');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('handles string with only spaces', () => {
    expect(sanitizeInput('   ')).toBe('');
  });

  it('preserves normal text', () => {
    const input = 'Dr. Robério Brandão - Cirurgião Plástico';
    expect(sanitizeInput(input)).toBe('Dr. Robério Brandão - Cirurgião Plástico');
  });

  it('handles multiple script tags', () => {
    const input = '<script>a</script>Hello<script>b</script>';
    expect(sanitizeInput(input)).toBe('Hello');
  });

  it('handles nested tags', () => {
    const input = '<div><span>Hello</span></div>';
    expect(sanitizeInput(input)).toBe('Hello');
  });
});

// ============================================================================
// formDataSchema Tests
// ============================================================================

describe('formDataSchema', () => {
  const validData: RawFormData = {
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '+55 84 99999-9999',
    subject: 'Informações sobre cursos',
    message: 'Gostaria de saber mais sobre os cursos de formação.',
  };

  describe('name field', () => {
    it('accepts valid name', () => {
      const result = formDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects name shorter than 2 characters', () => {
      const result = formDataSchema.safeParse({ ...validData, name: 'A' });
      expect(result.success).toBe(false);
    });

    it('rejects name longer than 100 characters', () => {
      const result = formDataSchema.safeParse({ ...validData, name: 'A'.repeat(101) });
      expect(result.success).toBe(false);
    });

    it('rejects name with HTML tags', () => {
      const result = formDataSchema.safeParse({ ...validData, name: 'João<script>' });
      expect(result.success).toBe(false);
    });

    it('rejects name with curly braces', () => {
      const result = formDataSchema.safeParse({ ...validData, name: 'João{test}' });
      expect(result.success).toBe(false);
    });
  });

  describe('email field', () => {
    it('accepts valid email', () => {
      const result = formDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const result = formDataSchema.safeParse({ ...validData, email: 'not-an-email' });
      expect(result.success).toBe(false);
    });

    it('converts email to lowercase', () => {
      const result = formDataSchema.safeParse({ ...validData, email: 'JOAO@EXAMPLE.COM' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('joao@example.com');
      }
    });

    it('rejects email longer than 254 characters', () => {
      const longEmail = 'a'.repeat(250) + '@x.com';
      const result = formDataSchema.safeParse({ ...validData, email: longEmail });
      expect(result.success).toBe(false);
    });
  });

  describe('phone field', () => {
    it('accepts valid phone number', () => {
      const result = formDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts phone as optional', () => {
      const { phone: _, ...dataWithoutPhone } = validData;
      const result = formDataSchema.safeParse(dataWithoutPhone);
      expect(result.success).toBe(true);
    });

    it('accepts international format', () => {
      const result = formDataSchema.safeParse({ ...validData, phone: '+1 (555) 123-4567' });
      expect(result.success).toBe(true);
    });

    it('rejects phone with letters', () => {
      const result = formDataSchema.safeParse({ ...validData, phone: '+55 84 ABC-1234' });
      expect(result.success).toBe(false);
    });

    it('rejects phone longer than 20 characters', () => {
      const result = formDataSchema.safeParse({ ...validData, phone: '+55 84 999999999999999999' });
      expect(result.success).toBe(false);
    });
  });

  describe('subject field', () => {
    it('accepts valid subject', () => {
      const result = formDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects empty subject', () => {
      const result = formDataSchema.safeParse({ ...validData, subject: '' });
      expect(result.success).toBe(false);
    });

    it('rejects subject longer than 200 characters', () => {
      const result = formDataSchema.safeParse({ ...validData, subject: 'A'.repeat(201) });
      expect(result.success).toBe(false);
    });

    it('rejects subject with HTML tags', () => {
      const result = formDataSchema.safeParse({ ...validData, subject: 'Test<br>' });
      expect(result.success).toBe(false);
    });
  });

  describe('message field', () => {
    it('accepts valid message', () => {
      const result = formDataSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects message shorter than 10 characters', () => {
      const result = formDataSchema.safeParse({ ...validData, message: 'Hi' });
      expect(result.success).toBe(false);
    });

    it('rejects message longer than 5000 characters', () => {
      const result = formDataSchema.safeParse({ ...validData, message: 'A'.repeat(5001) });
      expect(result.success).toBe(false);
    });

    it('sanitizes message content', () => {
      const result = formDataSchema.safeParse({
        ...validData,
        message: '<script>alert("xss")</script>Normal message here',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('Normal message here');
      }
    });
  });
});

// ============================================================================
// validateFormData Tests
// ============================================================================

describe('validateFormData', () => {
  const validData: RawFormData = {
    name: 'Maria Santos',
    email: 'maria@example.com',
    subject: 'Agendamento',
    message: 'Gostaria de agendar uma consulta para a próxima semana.',
  };

  it('returns success for valid data', () => {
    const result = validateFormData(validData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it('returns error for invalid data', () => {
    const result = validateFormData({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.type).toBe('VALIDATION_ERROR');
  });

  it('includes field name in validation error', () => {
    const result = validateFormData({ ...validData, email: 'invalid' });
    expect(result.error?.field).toBe('email');
  });

  it('marks validation errors as non-retryable', () => {
    const result = validateFormData({ ...validData, name: '' });
    expect(result.error?.retryable).toBe(false);
  });
});

// ============================================================================
// getWhatsAppUrl Tests
// ============================================================================

describe('getWhatsAppUrl', () => {
  describe('clinic type', () => {
    it('generates correct URL for PT-BR', () => {
      const url = getWhatsAppUrl('clinic', 'pt');
      expect(url).toContain(WHATSAPP_CONFIG.clinic.url);
      expect(url).toContain(encodeURIComponent('Olá!'));
    });

    it('generates correct URL for EN', () => {
      const url = getWhatsAppUrl('clinic', 'en');
      expect(url).toContain(encodeURIComponent('Hello!'));
    });

    it('generates correct URL for ES', () => {
      const url = getWhatsAppUrl('clinic', 'es');
      expect(url).toContain(encodeURIComponent('¡Hola!'));
    });

    it('uses custom message when provided', () => {
      const customMessage = 'Custom inquiry message';
      const url = getWhatsAppUrl('clinic', 'pt', customMessage);
      expect(url).toContain(encodeURIComponent(customMessage));
    });

    it('defaults to PT-BR when no locale specified', () => {
      const url = getWhatsAppUrl('clinic');
      expect(url).toContain(encodeURIComponent('Olá!'));
    });
  });

  describe('courses type', () => {
    it('returns direct link URL without message', () => {
      const url = getWhatsAppUrl('courses', 'pt');
      expect(url).toBe(WHATSAPP_CONFIG.courses.url);
    });

    it('ignores locale for courses (uses direct link)', () => {
      const urlPt = getWhatsAppUrl('courses', 'pt');
      const urlEn = getWhatsAppUrl('courses', 'en');
      const urlEs = getWhatsAppUrl('courses', 'es');
      expect(urlPt).toBe(urlEn);
      expect(urlEn).toBe(urlEs);
    });

    it('ignores custom message for courses', () => {
      const url = getWhatsAppUrl('courses', 'pt', 'Custom message');
      expect(url).toBe(WHATSAPP_CONFIG.courses.url);
    });
  });
});

// ============================================================================
// getErrorMessage Tests
// ============================================================================

describe('getErrorMessage', () => {
  const networkError: FormError = {
    type: 'NETWORK_ERROR',
    message: 'Connection failed',
    retryable: true,
  };

  const validationError: FormError = {
    type: 'VALIDATION_ERROR',
    message: 'E-mail inválido',
    field: 'email',
    retryable: false,
  };

  it('returns PT-BR message for network error', () => {
    const message = getErrorMessage(networkError, 'pt');
    expect(message).toContain('conexão');
  });

  it('returns EN message for network error', () => {
    const message = getErrorMessage(networkError, 'en');
    expect(message).toContain('Connection');
  });

  it('returns ES message for network error', () => {
    const message = getErrorMessage(networkError, 'es');
    expect(message).toContain('conexión');
  });

  it('returns original message for validation errors', () => {
    const message = getErrorMessage(validationError, 'pt');
    expect(message).toBe('E-mail inválido');
  });

  it('defaults to PT-BR when no locale specified', () => {
    const message = getErrorMessage(networkError);
    expect(message).toContain('conexão');
  });

  it('handles server error type', () => {
    const error: FormError = {
      type: 'SERVER_ERROR',
      message: 'Server error',
      retryable: true,
    };
    const message = getErrorMessage(error, 'pt');
    expect(message).toContain('Servidor');
  });

  it('handles configuration error type', () => {
    const error: FormError = {
      type: 'CONFIGURATION_ERROR',
      message: 'Not configured',
      retryable: false,
    };
    const message = getErrorMessage(error, 'pt');
    expect(message).toContain('WhatsApp');
  });

  it('handles rate limit error type', () => {
    const error: FormError = {
      type: 'RATE_LIMIT_ERROR',
      message: 'Rate limited',
      retryable: true,
    };
    const message = getErrorMessage(error, 'pt');
    expect(message).toContain('tentativas');
  });

  it('handles unknown error type', () => {
    const error: FormError = {
      type: 'UNKNOWN_ERROR',
      message: 'Unknown',
      retryable: true,
    };
    const message = getErrorMessage(error, 'pt');
    expect(message).toContain('inesperado');
  });
});

// ============================================================================
// submitForm Tests (with mocking)
// ============================================================================

describe('submitForm', () => {
  const validData: RawFormData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message for form submission.',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns configuration error when access key is not set', async () => {
    // Mock FORM_CONFIG.accessKey to be empty
    const originalAccessKey = FORM_CONFIG.accessKey;
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: '',
      writable: true,
      configurable: true,
    });

    const result = await submitForm(validData);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('CONFIGURATION_ERROR');

    // Restore
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: originalAccessKey,
      writable: true,
      configurable: true,
    });
  });

  it('returns validation error for invalid data', async () => {
    // Mock FORM_CONFIG.accessKey to have a value (so it doesn't fail on config check)
    const originalAccessKey = FORM_CONFIG.accessKey;
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: 'test-key',
      writable: true,
      configurable: true,
    });

    const result = await submitForm({ ...validData, email: 'invalid' });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('VALIDATION_ERROR');

    // Restore
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: originalAccessKey,
      writable: true,
      configurable: true,
    });
  });

  it('returns success for successful submission', async () => {
    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });

    // Mock FORM_CONFIG.accessKey to have a value
    const originalAccessKey = FORM_CONFIG.accessKey;
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: 'test-key',
      writable: true,
      configurable: true,
    });

    const result = await submitForm(validData);

    expect(result.success).toBe(true);
    expect(result.message).toContain('sucesso');

    // Restore
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: originalAccessKey,
      writable: true,
      configurable: true,
    });
  });

  it('handles API error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: false, message: 'Invalid email' }),
    });

    const originalAccessKey = FORM_CONFIG.accessKey;
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: 'test-key',
      writable: true,
      configurable: true,
    });

    const result = await submitForm(validData);

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('SERVER_ERROR');

    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: originalAccessKey,
      writable: true,
      configurable: true,
    });
  });

  it('handles rate limiting (429)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 429,
      json: () => Promise.resolve({ message: 'Rate limited' }),
    });

    const originalAccessKey = FORM_CONFIG.accessKey;
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: 'test-key',
      writable: true,
      configurable: true,
    });

    // Disable retries for faster test
    const result = await submitForm(validData, { retries: 0 });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('RATE_LIMIT_ERROR');

    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: originalAccessKey,
      writable: true,
      configurable: true,
    });
  });

  it('handles server errors (5xx)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 500,
      json: () => Promise.resolve({ message: 'Server error' }),
    });

    const originalAccessKey = FORM_CONFIG.accessKey;
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: 'test-key',
      writable: true,
      configurable: true,
    });

    const result = await submitForm(validData, { retries: 0 });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('SERVER_ERROR');

    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: originalAccessKey,
      writable: true,
      configurable: true,
    });
  });

  it('handles network errors', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'));

    const originalAccessKey = FORM_CONFIG.accessKey;
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: 'test-key',
      writable: true,
      configurable: true,
    });

    const result = await submitForm(validData, { retries: 0 });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('NETWORK_ERROR');

    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: originalAccessKey,
      writable: true,
      configurable: true,
    });
  });

  it('sends correct payload to API', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });
    global.fetch = mockFetch;

    const originalAccessKey = FORM_CONFIG.accessKey;
    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: 'test-key',
      writable: true,
      configurable: true,
    });

    await submitForm(validData);

    expect(mockFetch).toHaveBeenCalledWith(
      FORM_CONFIG.endpoint,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
    );

    // Check body contents
    const callArgs = mockFetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.access_key).toBe('test-key');
    expect(body.from_name).toBe('Test User');
    expect(body.email).toBe('test@example.com');
    expect(body.botcheck).toBe('');

    Object.defineProperty(FORM_CONFIG, 'accessKey', {
      value: originalAccessKey,
      writable: true,
      configurable: true,
    });
  });
});

// ============================================================================
// FORM_CONFIG and WHATSAPP_CONFIG Tests
// ============================================================================

describe('FORM_CONFIG', () => {
  it('has required properties', () => {
    expect(FORM_CONFIG.endpoint).toBe('https://api.web3forms.com/submit');
    expect(FORM_CONFIG.toEmail).toContain('@');
    expect(FORM_CONFIG.subjectPrefix).toContain('Dr.');
    expect(FORM_CONFIG.maxRetries).toBeGreaterThan(0);
    expect(FORM_CONFIG.retryBaseDelay).toBeGreaterThan(0);
  });
});

describe('WHATSAPP_CONFIG', () => {
  it('has clinic configuration', () => {
    expect(WHATSAPP_CONFIG.clinic.number).toMatch(/^\d+$/);
    expect(WHATSAPP_CONFIG.clinic.url).toContain('whatsapp.com');
    expect(WHATSAPP_CONFIG.clinic.defaultMessage['pt']).toBeTruthy();
    expect(WHATSAPP_CONFIG.clinic.defaultMessage['en']).toBeTruthy();
    expect(WHATSAPP_CONFIG.clinic.defaultMessage['es']).toBeTruthy();
  });

  it('has courses configuration', () => {
    expect(WHATSAPP_CONFIG.courses.url).toBeTruthy();
    expect(WHATSAPP_CONFIG.courses.defaultMessage['pt']).toBeTruthy();
    expect(WHATSAPP_CONFIG.courses.defaultMessage['en']).toBeTruthy();
    expect(WHATSAPP_CONFIG.courses.defaultMessage['es']).toBeTruthy();
  });
});
