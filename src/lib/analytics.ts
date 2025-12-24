/**
 * Analytics Configuration and Helpers
 *
 * This file centralizes all analytics-related configuration
 * for the Modern Face Institute website.
 *
 * ## Required Environment Variables
 *
 * Add these to your .env file before deploying:
 *
 * ```env
 * # Google Analytics 4
 * PUBLIC_GA_ID=G-XXXXXXXXXX
 *
 * # Site URL
 * PUBLIC_SITE_URL=https://drroberiobrandao.com
 * ```
 *
 * ## Third-Party Services Setup
 *
 * 1. **Google Analytics 4**
 *    - Create property at: https://analytics.google.com
 *    - Get Measurement ID (G-XXXXXXXXXX)
 *    - Add to PUBLIC_GA_ID in .env
 *
 * 2. **Google Search Console**
 *    - Verify at: https://search.google.com/search-console
 *    - Add HTML verification tag or DNS record
 *    - Submit sitemap: https://drroberiobrandao.com/sitemap-index.xml
 *
 * 3. **Google Business Profile**
 *    - Claim/create at: https://business.google.com
 *    - Add business info matching SchemaLocalBusiness
 *
 * 4. **Bing Webmaster Tools**
 *    - Register at: https://www.bing.com/webmasters
 *    - Submit sitemap
 *
 * 5. **PageSpeed Insights**
 *    - Test at: https://pagespeed.web.dev
 *    - No setup needed - just test URLs
 *
 * 6. **Rich Results Test**
 *    - Test at: https://search.google.com/test/rich-results
 *    - Validates Schema.org markup
 *
 * 7. **Facebook/Meta Pixel (Optional)**
 *    - Setup at: https://business.facebook.com
 *    - Use Tag Manager for installation
 *
 * 8. **Google Tag Manager (Optional)**
 *    - Create container at: https://tagmanager.google.com
 *    - Useful for Pixel, conversions, etc.
 */

/**
 * Analytics event types for consistent tracking
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'contact_form_error'
  | 'cta_click'
  | 'download'
  | 'video_play'
  | 'scroll_depth'
  | 'search'
  | 'navigation_click';

/**
 * Analytics event parameters
 */
export interface AnalyticsEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  page_path?: string;
  page_title?: string;
  button_text?: string;
  link_url?: string;
  search_term?: string;
  percent_scrolled?: number;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track custom event (client-side only)
 *
 * @example
 * trackEvent('cta_click', { button_text: 'Agendar Consulta', link_url: '/contato' });
 */
export function trackEvent(eventName: AnalyticsEvent, params?: AnalyticsEventParams): void {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // PostHog
  if (typeof window.posthog === 'object' && window.posthog.capture) {
    window.posthog.capture(eventName, params);
  }

  // Development logging
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] Event: ${eventName}`, params);
  }
}

/**
 * Track page view (for SPA navigation)
 */
export function trackPageView(path: string, title: string): void {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
  });
}

/**
 * Track contact form submission
 */
export function trackContactForm(
  status: 'submit' | 'success' | 'error',
  formData?: { subject?: string }
): void {
  const eventName: AnalyticsEvent =
    status === 'submit'
      ? 'contact_form_submit'
      : status === 'success'
        ? 'contact_form_success'
        : 'contact_form_error';

  trackEvent(eventName, {
    event_category: 'Contact',
    event_label: formData?.subject,
  });
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(buttonText: string, linkUrl: string): void {
  trackEvent('cta_click', {
    event_category: 'CTA',
    button_text: buttonText,
    link_url: linkUrl,
  });
}

/**
 * Google Analytics gtag command types
 */
type GtagCommand = 'config' | 'event' | 'set' | 'js' | 'consent';

type GtagConfigParams = {
  page_path?: string;
  page_title?: string;
  send_page_view?: boolean;
  [key: string]: string | number | boolean | undefined;
};

type GtagEventParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
};

/**
 * TypeScript declarations for global analytics
 */
declare global {
  interface Window {
    gtag?: (
      command: GtagCommand,
      targetOrEvent: string | Date,
      params?: GtagConfigParams | GtagEventParams
    ) => void;
    dataLayer?: Array<[GtagCommand, string | Date, (GtagConfigParams | GtagEventParams)?]>;
    posthog?: {
      capture: (
        event: string,
        properties?: Record<string, string | number | boolean | undefined>
      ) => void;
      identify: (
        userId: string,
        properties?: Record<string, string | number | boolean | undefined>
      ) => void;
    };
  }
}

export {};
