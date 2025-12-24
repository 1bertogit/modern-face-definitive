/**
 * IndexNow API Integration
 *
 * IndexNow is a protocol that allows websites to instantly notify search engines
 * (Bing, Yandex, and others) about content changes.
 *
 * Setup:
 * 1. Create a key file at /public/{KEY}.txt containing just the key
 * 2. Set PUBLIC_INDEXNOW_KEY in .env
 * 3. Call submitUrl() or submitUrls() after publishing content
 *
 * @see https://www.indexnow.org/documentation
 */

const INDEXNOW_KEY = import.meta.env.PUBLIC_INDEXNOW_KEY || 'drroberiobrandao2024indexnow';
const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://drroberiobrandao.com';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// IndexNow endpoints
const INDEXNOW_ENDPOINTS = {
  bing: 'https://www.bing.com/indexnow',
  yandex: 'https://yandex.com/indexnow',
  indexnow: 'https://api.indexnow.org/indexnow', // Generic endpoint
};

interface IndexNowResponse {
  success: boolean;
  endpoint: string;
  status?: number;
  error?: string;
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrl(
  url: string,
  endpoint: keyof typeof INDEXNOW_ENDPOINTS = 'bing'
): Promise<IndexNowResponse> {
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const indexNowUrl = `${INDEXNOW_ENDPOINTS[endpoint]}?url=${encodeURIComponent(fullUrl)}&key=${INDEXNOW_KEY}`;

  try {
    const response = await fetch(indexNowUrl, { method: 'GET' });
    return {
      success: response.ok || response.status === 202,
      endpoint,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit multiple URLs to IndexNow (batch submission)
 * More efficient for submitting many URLs at once
 */
export async function submitUrls(
  urls: string[],
  endpoint: keyof typeof INDEXNOW_ENDPOINTS = 'bing'
): Promise<IndexNowResponse> {
  const fullUrls = urls.map((url) => (url.startsWith('http') ? url : `${SITE_URL}${url}`));

  const payload = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: fullUrls,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINTS[endpoint], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: response.ok || response.status === 202,
      endpoint,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit URLs to all IndexNow endpoints
 */
export async function submitToAllEndpoints(urls: string[]): Promise<IndexNowResponse[]> {
  const results = await Promise.all([submitUrls(urls, 'bing'), submitUrls(urls, 'yandex')]);
  return results;
}

/**
 * Get all public URLs from the sitemap for bulk submission
 * Call this after a full site build to index all pages
 */
export function getAllSitemapUrls(): string[] {
  // Main pages
  const mainPages = [
    '/',
    '/sobre',
    '/tecnicas',
    '/formacao',
    '/blog',
    '/glossario',
    '/contato',
    '/faq',
    '/privacidade',
    '/termos',
  ];

  // English pages (no prefix - default locale)
  const enPages = [
    '/',
    '/about',
    '/techniques',
    '/education',
    '/blog',
    '/glossary',
    '/contact',
    '/faq',
    '/legal/privacy',
    '/legal/terms',
  ];

  // Spanish pages
  const esPages = [
    '/es',
    '/es/sobre',
    '/es/tecnicas',
    '/es/formacion',
    '/es/blog',
    '/es/glosario',
    '/es/contacto',
    '/es/faq',
    '/es/privacidad',
    '/es/terminos',
  ];

  // Technique pages
  const techniquesPages = [
    '/tecnicas/endomidface',
    '/tecnicas/deep-neck',
    '/tecnicas/browlift',
    '/techniques/endomidface',
    '/techniques/deep-neck',
    '/techniques/browlift',
    '/es/tecnicas/endomidface',
    '/es/tecnicas/deep-neck',
    '/es/tecnicas/browlift',
  ];

  return [...mainPages, ...enPages, ...esPages, ...techniquesPages];
}

// Script to run from command line: npx tsx src/lib/indexnow.ts
if (typeof process !== 'undefined' && process.argv[1]?.includes('indexnow')) {
  // eslint-disable-next-line no-console
  console.log('🔍 IndexNow Submission Tool');
  // eslint-disable-next-line no-console
  console.log('============================');
  // eslint-disable-next-line no-console
  console.log(`Site: ${SITE_URL}`);
  // eslint-disable-next-line no-console
  console.log(`Key: ${INDEXNOW_KEY}`);
  // eslint-disable-next-line no-console
  console.log('');

  const urls = getAllSitemapUrls();
  // eslint-disable-next-line no-console
  console.log(`Submitting ${urls.length} URLs...`);

  submitToAllEndpoints(urls).then((results) => {
    results.forEach((result) => {
      const status = result.success ? '✅' : '❌';
      // eslint-disable-next-line no-console
      console.log(`${status} ${result.endpoint}: ${result.status || result.error}`);
    });
  });
}
