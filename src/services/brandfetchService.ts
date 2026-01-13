/**
 * Brandfetch API Service
 * Fetches company logos and brand assets
 *
 * API Docs: https://docs.brandfetch.com/
 */

const BRANDFETCH_API_KEY = process.env.NEXT_PUBLIC_BRANDFETCH_API_KEY;
const BRANDFETCH_API_URL = 'https://api.brandfetch.io/v2';

export interface BrandfetchLogo {
  type: string;
  theme: string;
  formats: Array<{
    src: string;
    background: string;
    format: string;
    height: number;
    width: number;
    size: number;
  }>;
}

export interface BrandfetchResponse {
  name: string;
  domain: string;
  logos: BrandfetchLogo[];
  icon?: string;
}

/**
 * Fetch company logo from Brandfetch API
 * @param domain - Company domain (e.g., "apple.com")
 * @returns Logo URL or null
 */
export async function fetchCompanyLogo(domain: string): Promise<string | null> {
  if (!BRANDFETCH_API_KEY) {
    console.warn('Brandfetch API key not configured');
    return null;
  }

  if (!domain) {
    return null;
  }

  // Clean domain (remove http/https, www, etc.)
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];

  try {
    const response = await fetch(
      `${BRANDFETCH_API_URL}/brands/${cleanDomain}`,
      {
        headers: {
          Authorization: `Bearer ${BRANDFETCH_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Logo not found for domain: ${cleanDomain}`);
        return null;
      }
      throw new Error(`Brandfetch API error: ${response.status}`);
    }

    const data: BrandfetchResponse = await response.json();

    // Get the icon (smallest logo) or first logo
    if (data.icon) {
      return data.icon;
    }

    if (data.logos && data.logos.length > 0) {
      // Find logo with transparent background or use first available
      const logo = data.logos.find(l => l.type === 'icon') || data.logos[0];
      if (logo.formats && logo.formats.length > 0) {
        // Prefer smaller formats for performance
        const format =
          logo.formats.find(f => f.format === 'png' || f.format === 'svg') ||
          logo.formats[0];
        return format.src;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching company logo:', error);
    return null;
  }
}

/**
 * Batch fetch company logos
 * @param domains - Array of company domains
 * @returns Map of domain to logo URL
 */
export async function batchFetchCompanyLogos(
  domains: string[]
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);
    const promises = batch.map(async domain => {
      const logo = await fetchCompanyLogo(domain);
      return { domain, logo };
    });

    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ domain, logo }) => {
      results.set(domain, logo);
    });

    // Add small delay between batches
    if (i + batchSize < domains.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}
