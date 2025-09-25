/**
 * Company Logo Service
 * Handles fetching and managing company logos
 */

import { supabase } from '@/integrations/supabase/client';

export interface LogoOptions {
  companyId: string;
  companyName: string;
  website?: string;
}

/**
 * Get logo URL from Clearbit API
 */
export const getClearbitLogo = (companyName: string, website?: string): string | null => {
  try {
    // Try website domain first (most reliable)
    if (website) {
      const domain = website
        .replace(/^https?:\/\//, '') // Remove protocol
        .replace(/^www\./, '') // Remove www
        .split('/')[0] // Get domain only
        .split('?')[0]; // Remove query params
      
      return `https://logo.clearbit.com/${domain}`;
    }
    
    // Fallback: try common domain patterns
    const cleanName = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special chars
      .replace(/\s+/g, ''); // Remove spaces
    
    return `https://logo.clearbit.com/${cleanName}.com`;
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
 * Update company logo in database
 */
export const updateCompanyLogo = async (companyId: string, logoUrl: string): Promise<void> => {
  const { error } = await supabase
    .from('companies')
    .update({ profile_image_url: logoUrl })
    .eq('id', companyId);
    
  if (error) {
    throw new Error(`Failed to update company logo: ${error.message}`);
  }
};

/**
 * Batch update company logos using Clearbit
 */
export const batchUpdateLogos = async (companies: Array<{id: string, name: string, website?: string}>): Promise<void> => {
  const updates = [];
  
  for (const company of companies) {
    const logoUrl = getClearbitLogo(company.name, company.website);
    if (logoUrl) {
      // Test if logo exists before updating
      const isValid = await testLogoUrl(logoUrl);
      if (isValid) {
        updates.push(
          supabase
            .from('companies')
            .update({ profile_image_url: logoUrl })
            .eq('id', company.id)
        );
      }
    }
  }
  
  // Execute all updates
  const results = await Promise.allSettled(updates);
  
  // Log any failures
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Failed to update logo for company ${companies[index].name}:`, result.reason);
    }
  });
};

/**
 * Get company logo with fallback chain
 */
export const getCompanyLogo = async (companyName: string, website?: string, existingUrl?: string): Promise<string | null> => {
  // 1. Return existing URL if it's valid
  if (existingUrl && await testLogoUrl(existingUrl)) {
    return existingUrl;
  }
  
  // 2. Try Clearbit
  const clearbitUrl = getClearbitLogo(companyName, website);
  if (clearbitUrl && await testLogoUrl(clearbitUrl)) {
    return clearbitUrl;
  }
  
  // 3. Return null (will fallback to initials in UI)
  return null;
};

/**
 * Manual logo URL update (for admin use)
 */
export const setCompanyLogoManually = async (companyId: string, logoUrl: string): Promise<void> => {
  // Validate URL format
  try {
    new URL(logoUrl);
  } catch {
    throw new Error('Invalid URL format');
  }
  
  // Test if URL is accessible
  const isValid = await testLogoUrl(logoUrl);
  if (!isValid) {
    throw new Error('Logo URL is not accessible');
  }
  
  // Update database
  await updateCompanyLogo(companyId, logoUrl);
};



