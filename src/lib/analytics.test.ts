/**
 * Analytics utilities tests
 *
 * Tests for analytics event tracking with mocked gtag and posthog
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent, trackPageView, trackContactForm, trackCTAClick } from './analytics';

describe('analytics', () => {
  // Store original window properties
  const originalGtag = globalThis.window?.gtag;
  const originalPosthog = globalThis.window?.posthog;

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();

    // Mock gtag
    (globalThis.window as Window & typeof globalThis).gtag = vi.fn();

    // Mock posthog
    (globalThis.window as Window & typeof globalThis).posthog = {
      capture: vi.fn(),
      identify: vi.fn(),
    };
  });

  afterEach(() => {
    // Restore original functions
    if (originalGtag) {
      (globalThis.window as Window & typeof globalThis).gtag = originalGtag;
    } else {
      delete (globalThis.window as Window & typeof globalThis).gtag;
    }

    if (originalPosthog) {
      (globalThis.window as Window & typeof globalThis).posthog = originalPosthog;
    } else {
      delete (globalThis.window as Window & typeof globalThis).posthog;
    }
  });

  describe('trackEvent', () => {
    it('should call gtag with event name and params', () => {
      const params = { event_category: 'Test', event_label: 'test_label' };
      trackEvent('cta_click', params);

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', params);
    });

    it('should call posthog.capture with event name and params', () => {
      const params = { event_category: 'Test', event_label: 'test_label' };
      trackEvent('cta_click', params);

      expect(window.posthog?.capture).toHaveBeenCalledWith('cta_click', params);
    });

    it('should handle events without params', () => {
      trackEvent('page_view');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', undefined);
      expect(window.posthog?.capture).toHaveBeenCalledWith('page_view', undefined);
    });

    it('should not throw when gtag is undefined', () => {
      delete (window as Window & typeof globalThis).gtag;

      expect(() => trackEvent('cta_click')).not.toThrow();
    });

    it('should not throw when posthog is undefined', () => {
      delete (window as Window & typeof globalThis).posthog;

      expect(() => trackEvent('cta_click')).not.toThrow();
    });

    it('should handle all event types', () => {
      const eventTypes = [
        'page_view',
        'contact_form_submit',
        'contact_form_success',
        'contact_form_error',
        'cta_click',
        'download',
        'video_play',
        'scroll_depth',
        'search',
        'navigation_click',
      ] as const;

      eventTypes.forEach((eventType) => {
        trackEvent(eventType);
        expect(window.gtag).toHaveBeenCalledWith('event', eventType, undefined);
      });
    });

    it('should handle custom params', () => {
      const customParams = {
        event_category: 'Custom',
        event_label: 'Label',
        value: 100,
        page_path: '/test',
        custom_param: 'custom_value',
      };

      trackEvent('cta_click', customParams);

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', customParams);
    });
  });

  describe('trackPageView', () => {
    it('should track page view with path and title', () => {
      trackPageView('/about', 'About Page');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/about',
        page_title: 'About Page',
      });
    });

    it('should track page view with localized paths', () => {
      trackPageView('/pt/sobre', 'Página Sobre');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/pt/sobre',
        page_title: 'Página Sobre',
      });
    });

    it('should track root path', () => {
      trackPageView('/', 'Home');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/',
        page_title: 'Home',
      });
    });
  });

  describe('trackContactForm', () => {
    it('should track form submission', () => {
      trackContactForm('submit');

      expect(window.gtag).toHaveBeenCalledWith('event', 'contact_form_submit', {
        event_category: 'Contact',
        event_label: undefined,
      });
    });

    it('should track form success', () => {
      trackContactForm('success');

      expect(window.gtag).toHaveBeenCalledWith('event', 'contact_form_success', {
        event_category: 'Contact',
        event_label: undefined,
      });
    });

    it('should track form error', () => {
      trackContactForm('error');

      expect(window.gtag).toHaveBeenCalledWith('event', 'contact_form_error', {
        event_category: 'Contact',
        event_label: undefined,
      });
    });

    it('should include form data when provided', () => {
      trackContactForm('submit', { subject: 'Consultation Request' });

      expect(window.gtag).toHaveBeenCalledWith('event', 'contact_form_submit', {
        event_category: 'Contact',
        event_label: 'Consultation Request',
      });
    });

    it('should handle empty form data', () => {
      trackContactForm('success', {});

      expect(window.gtag).toHaveBeenCalledWith('event', 'contact_form_success', {
        event_category: 'Contact',
        event_label: undefined,
      });
    });
  });

  describe('trackCTAClick', () => {
    it('should track CTA click with button text and URL', () => {
      trackCTAClick('Schedule Consultation', '/contact');

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
        event_category: 'CTA',
        button_text: 'Schedule Consultation',
        link_url: '/contact',
      });
    });

    it('should track CTA click with Portuguese text', () => {
      trackCTAClick('Agendar Consulta', '/pt/contato');

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
        event_category: 'CTA',
        button_text: 'Agendar Consulta',
        link_url: '/pt/contato',
      });
    });

    it('should track external links', () => {
      trackCTAClick('WhatsApp', 'https://wa.me/5584999999999');

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
        event_category: 'CTA',
        button_text: 'WhatsApp',
        link_url: 'https://wa.me/5584999999999',
      });
    });

    it('should track empty button text', () => {
      trackCTAClick('', '/contact');

      expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', {
        event_category: 'CTA',
        button_text: '',
        link_url: '/contact',
      });
    });
  });

  describe('integration', () => {
    it('should send events to both gtag and posthog', () => {
      trackCTAClick('Test Button', '/test');

      expect(window.gtag).toHaveBeenCalledTimes(1);
      expect(window.posthog?.capture).toHaveBeenCalledTimes(1);
    });

    it('should work when only gtag is available', () => {
      delete (window as Window & typeof globalThis).posthog;

      expect(() => trackCTAClick('Test', '/test')).not.toThrow();
      expect(window.gtag).toHaveBeenCalled();
    });

    it('should work when only posthog is available', () => {
      delete (window as Window & typeof globalThis).gtag;
      const posthogCapture = window.posthog?.capture;

      expect(() => trackCTAClick('Test', '/test')).not.toThrow();
      expect(posthogCapture).toHaveBeenCalled();
    });

    it('should work when neither analytics service is available', () => {
      delete (window as Window & typeof globalThis).gtag;
      delete (window as Window & typeof globalThis).posthog;

      expect(() => trackEvent('page_view')).not.toThrow();
      expect(() => trackPageView('/', 'Home')).not.toThrow();
      expect(() => trackContactForm('submit')).not.toThrow();
      expect(() => trackCTAClick('Test', '/test')).not.toThrow();
    });
  });
});
