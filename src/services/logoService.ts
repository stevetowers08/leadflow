/**
 * Company Logo Service
 * Stores provider-fetched logos in Supabase Storage and returns cached URLs.
 */

import { supabase } from '@/integrations/supabase/client';

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

const buildProviderUrl = (domain: string): string => {
  const logoDevKey = process.env.LOGO_DEV_API_KEY as
    | string
    | undefined;
  if (logoDevKey) {
    // Logo.dev image endpoint
    return `https://img.logo.dev/${domain}?apikey=${logoDevKey}`;
  }
  // Fallback (deprecated) to Clearbit while migrating
  return `https://logo.clearbit.com/${domain}`;
};

/**
 * Test if a logo URL is accessible
 */
export const testLogoUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get or fetch-and-store company logo, returning a public URL.
 * If a cached URL is passed, it is returned without network calls.
 */
export const getOrStoreCompanyLogo = async (
  company: { id: string; name: string; website: string | null; logo_url?: string | null }
): Promise<string | null> => {
  try {
    if (company.logo_url && company.logo_url.trim()) return company.logo_url;

    const domain =
      getDomainFromWebsite(company.website || undefined) ||
      getFallbackDomainFromName(company.name || undefined);
    if (!domain) return null;

    const providerUrl = buildProviderUrl(domain);
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
      console.error('Logo upload failed:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('logos').getPublicUrl(objectPath);
    const publicUrl = data?.publicUrl || null;

    if (publicUrl) {
      await supabase
        .from('companies')
        .update({ logo_url: publicUrl, logo_cached_at: new Date().toISOString() })
        .eq('id', company.id);
    }

    return publicUrl;
  } catch (error) {
    console.error('Error fetching/storing company logo:', error);
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
      console.error('Error updating company logo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating company logo:', error);
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
    console.error('Error batch updating logos:', error);
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
      console.error('Invalid logo URL format:', logoUrl);
      return false;
    }

    return await updateCompanyLogo(companyId, logoUrl);
  } catch (error) {
    console.error('Error setting manual logo:', error);
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
    if (domain) return buildProviderUrl(domain);

    // 3. Return null if no website (will fallback to initials in UI)
    return null;
  } catch (error) {
    console.error('Error in getCompanyLogoUrlSync:', error);
    return null;
  }
};
