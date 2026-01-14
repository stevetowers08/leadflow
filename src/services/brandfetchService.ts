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
 * Fetch company logo from Brandfetch API with retry logic for rate limiting
 * @param domain - Company domain (e.g., "apple.com")
 * @param retryCount - Current retry attempt (internal use)
 * @param maxRetries - Maximum number of retry attempts
 * @returns Logo URL or null
 */
export async function fetchCompanyLogo(
  domain: string,
  retryCount = 0,
  maxRetries = 2
): Promise<string | null> {
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
      // Handle 404 (logo not found) - no retry needed
      if (response.status === 404) {
        console.log(`Logo not found for domain: ${cleanDomain}`);
        return null;
      }

      // Handle 429 (rate limiting) with retry logic
      if (response.status === 429) {
        // Extract retry-after header if available
        const retryAfterHeader = response.headers.get('retry-after');
        let retryAfter = 30; // Default 30 seconds

        if (retryAfterHeader) {
          const parsed = parseInt(retryAfterHeader, 10);
          if (!isNaN(parsed) && parsed > 0) {
            retryAfter = parsed;
          }
        }

        // Retry if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          console.warn(
            `Brandfetch rate limit reached for ${cleanDomain}. Retrying after ${retryAfter}s (attempt ${retryCount + 1}/${maxRetries})`
          );
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          return fetchCompanyLogo(domain, retryCount + 1, maxRetries);
        }

        // Max retries exceeded
        console.warn(
          `Brandfetch rate limit exceeded for ${cleanDomain} after ${maxRetries} retries`
        );
        return null;
      }

      // Other errors - don't retry
      console.warn(
        `Brandfetch API error for ${cleanDomain}: ${response.status}`
      );
      return null;
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
    // Network errors - retry if we haven't exceeded max retries
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s
      console.warn(
        `Brandfetch network error for ${cleanDomain}. Retrying after ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`
      );
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchCompanyLogo(domain, retryCount + 1, maxRetries);
    }

    console.error('Error fetching company logo:', error);
    return null;
  }
}

/**
 * Batch fetch company logos with rate limiting
 * @param domains - Array of company domains
 * @returns Map of domain to logo URL
 */
export async function batchFetchCompanyLogos(
  domains: string[]
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  // Process in smaller batches to avoid rate limiting
  // Brandfetch free tier: ~10 requests/minute
  const batchSize = 3;
  const delayBetweenBatches = 7000; // 7 seconds between batches (conservative)

  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);

    // Process batch sequentially (not in parallel) to reduce rate limit hits
    for (const domain of batch) {
      const logo = await fetchCompanyLogo(domain);
      results.set(domain, logo);

      // Small delay between individual requests within batch
      if (batch.indexOf(domain) < batch.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Add delay between batches to respect rate limits
    if (i + batchSize < domains.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return results;
}
