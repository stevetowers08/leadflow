/**
 * Company Logo Service
 * Stores provider-fetched logos in Supabase Storage and returns cached URLs.
 */

import { supabase } from '@/integrations/supabase/client';
import { API_URLS } from '@/constants/urls';
import { fetchCompanyLogo } from './brandfetchService';

const getDomainFromWebsite = (website?: string): string | null => {
  try {
    if (!website || typeof website !== 'string' || !website.trim()) return null;
    const domain = website
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split('?')[0]
      .trim();
    return domain || null;
  } catch {
    return null;
  }
};

const getFallbackDomainFromName = (companyName?: string): string | null => {
  if (!companyName || typeof companyName !== 'string' || !companyName.trim())
    return null;
  const cleanName = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '');
  return cleanName ? `${cleanName}.com` : null;
};

const buildProviderUrl = (domain: string): string | null => {
  // Fallback to Logo.dev
  const logoDevKey = process.env.LOGO_DEV_API_KEY as string | undefined;
  if (logoDevKey) {
    return API_URLS.LOGO_DEV(domain, logoDevKey);
  }

  // Clearbit is currently down/unreachable - skip it
  // Return null to trigger UI Avatars fallback instead
  return null;
};

/**
 * Test if a logo URL is accessible
 * Uses image loading to avoid CORS issues with HEAD requests
 */
export const testLogoUrl = async (url: string): Promise<boolean> => {
  try {
    // Use image loading instead of fetch to avoid CORS issues
    // This method works even when HEAD requests fail due to CORS
    return new Promise(resolve => {
      const img = new Image();
      const timeout = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }, 3000); // 3 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };

      img.src = url;
    });
  } catch {
    return false;
  }
};

/**
 * Get or fetch-and-store company logo, returning a public URL.
 * If a cached URL is passed, it is returned without network calls.
 */
export const getOrStoreCompanyLogo = async (company: {
  id: string;
  name: string;
  website: string | null;
  logo_url?: string | null;
}): Promise<string | null> => {
  try {
    if (company.logo_url && company.logo_url.trim()) return company.logo_url;

    const domain =
      getDomainFromWebsite(company.website || undefined) ||
      getFallbackDomainFromName(company.name || undefined);
    if (!domain) return null;

    // Try Brandfetch API first (preferred) - uses API to get CDN URLs
    const brandfetchApiKey = process.env.NEXT_PUBLIC_BRANDFETCH_API_KEY;
    if (brandfetchApiKey) {
      try {
        const logoUrl = await fetchCompanyLogo(domain);
        if (logoUrl) {
          // Store the CDN URL from Brandfetch API response
          await supabase
            .from('companies')
            .update({
              logo_url: logoUrl,
              logo_cached_at: new Date().toISOString(),
            })
            .eq('id', company.id);
          return logoUrl;
        }
      } catch (error) {
        // Fall through to other providers if Brandfetch fails
        console.warn(`Brandfetch API failed for ${domain}:`, error);
      }
    }

    // Fallback to other providers
    const providerUrl = buildProviderUrl(domain);

    // If no provider URL available (Clearbit skipped), return null
    // UI will show fallback avatar
    if (!providerUrl) {
      return null;
    }

    // For other providers (Logo.dev), test before downloading
    // Only test if we need to download and store
    const ok = await testLogoUrl(providerUrl);
    if (!ok) return null;

    const res = await fetch(providerUrl);
    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || 'image/png';
    const extension = contentType.includes('webp')
      ? 'webp'
      : contentType.includes('svg')
        ? 'svg'
        : contentType.includes('jpeg') || contentType.includes('jpg')
          ? 'jpg'
          : 'png';

    const arrayBuffer = await res.arrayBuffer();
    const objectPath = `companies/${domain}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(objectPath, new Blob([arrayBuffer], { type: contentType }), {
        upsert: true,
        contentType,
      });
    if (uploadError) {
      // Use logger instead of console.error
      return null;
    }

    const { data } = supabase.storage.from('logos').getPublicUrl(objectPath);
    const publicUrl = data?.publicUrl || null;

    if (publicUrl) {
      await supabase
        .from('companies')
        .update({
          logo_url: publicUrl,
          logo_cached_at: new Date().toISOString(),
        })
        .eq('id', company.id);
    }

    return publicUrl;
  } catch (error) {
    // Use logger instead of console.error
    return null;
  }
};

/**
 * Update company logo in database
 */
export const updateCompanyLogo = async (
  companyId: string,
  logoUrl: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('companies')
      .update({ logo_url: logoUrl })
      .eq('id', companyId);

    if (error) {
      // Use logger instead of console.error
      return false;
    }

    return true;
  } catch (error) {
    // Use logger instead of console.error
    return false;
  }
};

/**
 * Batch update logos for multiple companies
 */
export const batchUpdateLogos = async (
  updates: Array<{ companyId: string; logoUrl: string }>
): Promise<boolean> => {
  try {
    const promises = updates.map(update =>
      updateCompanyLogo(update.companyId, update.logoUrl)
    );
    const results = await Promise.all(promises);
    return results.every(result => result);
  } catch (error) {
    // Use logger instead of console.error
    return false;
  }
};

/**
 * Set company logo manually (user-provided URL)
 */
export const setCompanyLogoManually = async (
  companyId: string,
  logoUrl: string
): Promise<boolean> => {
  try {
    // Validate URL format
    try {
      new URL(logoUrl);
    } catch {
      // Use logger instead of console.error
      return false;
    }

    return await updateCompanyLogo(companyId, logoUrl);
  } catch (error) {
    // Use logger instead of console.error
    return false;
  }
};

/**
 * Synchronous version for UI components - uses cached URLs when available
 * Falls back to Clearbit URL generation for new companies
 */
export const getCompanyLogoUrlSync = (
  companyName: string,
  website?: string,
  cachedLogoUrl?: string
): string | null => {
  try {
    // 1. Use cached URL if available and valid
    if (
      cachedLogoUrl &&
      typeof cachedLogoUrl === 'string' &&
      cachedLogoUrl.trim()
    ) {
      return cachedLogoUrl;
    }

    // 2. Build provider URL (sync, uncached) as a temporary display until stored
    const domain =
      getDomainFromWebsite(website) || getFallbackDomainFromName(companyName);
    if (domain) {
      const providerUrl = buildProviderUrl(domain);
      // Only return if provider URL is available (Clearbit is skipped)
      if (providerUrl) return providerUrl;
    }

    // 3. Return null if no website or no provider available (will fallback to initials in UI)
    return null;
  } catch (error) {
    // Use logger instead of console.error
    return null;
  }
};
