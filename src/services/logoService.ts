/**
 * Company Logo Service
 * Uses Clearbit API for company logos with fallback to initials
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Get logo URL from Clearbit API
 */
export const getClearbitLogo = (companyName: string, website?: string): string | null => {
  try {
    // Try website domain first (most reliable)
    if (website && typeof website === 'string' && website.trim()) {
      const domain = website
        .replace(/^https?:\/\//, '') // Remove protocol
        .replace(/^www\./, '') // Remove www
        .split('/')[0] // Get domain only
        .split('?')[0]; // Remove query params
      
      if (domain && domain.length > 0) {
        return `https://logo.clearbit.com/${domain}`;
      }
    }
    
    // Fallback: try common domain patterns
    if (companyName && typeof companyName === 'string' && companyName.trim()) {
      const cleanName = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Remove special chars
        .replace(/\s+/g, ''); // Remove spaces
      
      if (cleanName && cleanName.length > 0) {
        return `https://logo.clearbit.com/${cleanName}.com`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error generating Clearbit logo URL:', error);
    return null;
  }
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
 * Get company logo URL using Clearbit API
 * This is the primary method for getting company logos
 */
export const getCompanyLogoUrl = (companyName: string, website?: string): string | null => {
  try {
    // Only use Clearbit if website exists and is valid
    if (website && typeof website === 'string' && website.trim()) {
      return getClearbitLogo(companyName || '', website);
    }
    
    // Return null if no website (will fallback to initials in UI)
    return null;
  } catch (error) {
    console.error('Error in getCompanyLogoUrl:', error);
    return null;
  }
};

/**
 * Update company logo in database
 */
export const updateCompanyLogo = async (companyId: string, logoUrl: string): Promise<boolean> => {
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
export const batchUpdateLogos = async (updates: Array<{ companyId: string; logoUrl: string }>): Promise<boolean> => {
  try {
    const promises = updates.map(update => updateCompanyLogo(update.companyId, update.logoUrl));
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
export const setCompanyLogoManually = async (companyId: string, logoUrl: string): Promise<boolean> => {
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
export const getCompanyLogoUrlSync = (companyName: string, website?: string, cachedLogoUrl?: string): string | null => {
  try {
    // 1. Use cached URL if available and valid
    if (cachedLogoUrl && typeof cachedLogoUrl === 'string' && cachedLogoUrl.trim()) {
      return cachedLogoUrl;
    }
    
    // 2. Generate Clearbit URL if website exists
    if (website && typeof website === 'string' && website.trim()) {
      return getClearbitLogo(companyName || '', website);
    }
    
    // 3. Return null if no website (will fallback to initials in UI)
    return null;
  } catch (error) {
    console.error('Error in getCompanyLogoUrlSync:', error);
    return null;
  }
};