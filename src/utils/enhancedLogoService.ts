/**
 * Enhanced Company Logo Service
 * Implements multiple fallback strategies for reliable logo display
 */

import { supabase } from '@/integrations/supabase/client';

// Logo cache for in-memory storage
const logoCache = new Map<string, { url: string; timestamp: number; valid: boolean }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate company initials fallback
 */
export const getCompanyInitials = (companyName: string): string => {
  if (!companyName) return '?';
  
  const words = companyName.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return words
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
};

/**
 * Generate UI Avatars fallback URL
 */
export const getUIAvatarsUrl = (companyName: string, size: number = 32): string => {
  const initials = getCompanyInitials(companyName);
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F'];
  const color = colors[companyName.length % colors.length];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=${color}&color=fff&bold=true`;
};

/**
 * Clean domain for Clearbit API
 */
export const cleanDomain = (website: string): string | null => {
  try {
    if (!website || typeof website !== 'string') return null;
    
    // Handle shortened URLs (bit.ly, tinyurl, etc.)
    if (website.includes('bit.ly') || website.includes('tinyurl') || website.includes('short.link')) {
      return null; // Skip shortened URLs
    }
    
    let domain = website
      .replace(/^https?:\/\//, '') // Remove protocol
      .replace(/^www\./, '') // Remove www
      .split('/')[0] // Get domain only
      .split('?')[0] // Remove query params
      .split('#')[0]; // Remove fragments
    
    // Validate domain format
    if (!domain || domain.length < 3 || !domain.includes('.')) {
      return null;
    }
    
    return domain;
  } catch {
    return null;
  }
};

/**
 * Test if a logo URL is accessible (with timeout)
 */
export const testLogoUrl = async (url: string, timeout: number = 3000): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // Avoid CORS issues
    });
    
    clearTimeout(timeoutId);
    return true; // If no error, assume it's accessible
  } catch {
    return false;
  }
};

/**
 * Get logo URL with multiple fallback strategies
 */
export const getCompanyLogoUrl = async (
  companyId: string,
  companyName: string,
  website?: string,
  cachedLogoUrl?: string
): Promise<string | null> => {
  try {
    // 1. Check in-memory cache first
    const cached = logoCache.get(companyId);
    if (cached && cached.valid && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.url;
    }
    
    // 2. Use database cached URL if available and recent
    if (cachedLogoUrl && typeof cachedLogoUrl === 'string' && cachedLogoUrl.trim()) {
      const isValid = await testLogoUrl(cachedLogoUrl);
      if (isValid) {
        logoCache.set(companyId, { url: cachedLogoUrl, timestamp: Date.now(), valid: true });
        return cachedLogoUrl;
      }
    }
    
    // 3. Try Clearbit API with cleaned domain
    if (website) {
      const domain = cleanDomain(website);
      if (domain) {
        const clearbitUrl = `https://logo.clearbit.com/${domain}`;
        const isValid = await testLogoUrl(clearbitUrl);
        
        if (isValid) {
          // Cache the successful URL
          logoCache.set(companyId, { url: clearbitUrl, timestamp: Date.now(), valid: true });
          
          // Update database cache in background
          updateCompanyLogoCache(companyId, clearbitUrl).catch(console.warn);
          
          return clearbitUrl;
        }
      }
    }
    
    // 4. Fallback to UI Avatars
    const uiAvatarsUrl = getUIAvatarsUrl(companyName);
    logoCache.set(companyId, { url: uiAvatarsUrl, timestamp: Date.now(), valid: true });
    
    return uiAvatarsUrl;
    
  } catch (error) {
    console.warn('Error getting company logo:', error);
    // Ultimate fallback
    return getUIAvatarsUrl(companyName);
  }
};

/**
 * Synchronous version for immediate UI rendering
 * Uses cached URLs or generates fallback URLs
 */
export const getCompanyLogoUrlSync = (
  companyId: string,
  companyName: string,
  website?: string,
  cachedLogoUrl?: string
): string => {
  try {
    // 1. Check in-memory cache
    const cached = logoCache.get(companyId);
    if (cached && cached.valid) {
      return cached.url;
    }
    
    // 2. Use database cached URL
    if (cachedLogoUrl && typeof cachedLogoUrl === 'string' && cachedLogoUrl.trim()) {
      logoCache.set(companyId, { url: cachedLogoUrl, timestamp: Date.now(), valid: true });
      return cachedLogoUrl;
    }
    
    // 3. Generate Clearbit URL for immediate display (will be validated async)
    if (website) {
      const domain = cleanDomain(website);
      if (domain) {
        const clearbitUrl = `https://logo.clearbit.com/${domain}`;
        logoCache.set(companyId, { url: clearbitUrl, timestamp: Date.now(), valid: true });
        return clearbitUrl;
      }
    }
    
    // 4. Fallback to UI Avatars
    return getUIAvatarsUrl(companyName);
    
  } catch (error) {
    console.warn('Error in getCompanyLogoUrlSync:', error);
    return getUIAvatarsUrl(companyName);
  }
};

/**
 * Update company logo cache in database
 */
const updateCompanyLogoCache = async (companyId: string, logoUrl: string): Promise<void> => {
  try {
    await supabase
      .from('companies')
      .update({ 
        logo_url: logoUrl,
        logo_cached_at: new Date().toISOString()
      })
      .eq('id', companyId);
  } catch (error) {
    console.warn('Failed to update logo cache:', error);
  }
};

/**
 * Batch update logos for multiple companies
 */
export const batchUpdateLogos = async (updates: Array<{ companyId: string; logoUrl: string }>): Promise<void> => {
  try {
    const promises = updates.map(update => updateCompanyLogoCache(update.companyId, update.logoUrl));
    await Promise.all(promises);
  } catch (error) {
    console.warn('Failed to batch update logos:', error);
  }
};

/**
 * Clear logo cache
 */
export const clearLogoCache = (): void => {
  logoCache.clear();
};

/**
 * Get cache statistics
 */
export const getLogoCacheStats = () => {
  const now = Date.now();
  const validEntries = Array.from(logoCache.values()).filter(entry => 
    entry.valid && (now - entry.timestamp) < CACHE_DURATION
  );
  
  return {
    totalCached: logoCache.size,
    validCached: validEntries.length,
    expiredCached: logoCache.size - validEntries.length
  };
};
