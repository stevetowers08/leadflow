import { Building2 } from 'lucide-react';
import type { Company } from '@/types/database';
import { cn } from '@/lib/utils';
import {
  getCompanyLogoUrlSync,
  getOrStoreCompanyLogo,
} from '@/services/logoService';
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { API_URLS } from '@/constants/urls';

interface CompanyChipProps {
  company:
    | Company
    | {
        name: string;
        logo_url?: string | null;
        website?: string | null;
        id?: string;
      }
    | null;
  className?: string;
}

// Generate company initials from name
const getCompanyInitials = (name: string): string => {
  if (!name || name.trim() === '') return '?';
  const parts = name
    .trim()
    .split(/[\s-&]+/)
    .filter(n => n.length > 0);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  // Get first letter of first word and first letter of last word
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
};

// Color palette for company initials - defined outside component to avoid recreation
const COMPANY_COLORS = [
  { bg: '4f46e5', text: 'ffffff' }, // Indigo
  { bg: '059669', text: 'ffffff' }, // Emerald
  { bg: 'dc2626', text: 'ffffff' }, // Red
  { bg: 'ea580c', text: 'ffffff' }, // Orange
  { bg: '7c3aed', text: 'ffffff' }, // Purple
  { bg: '0891b2', text: 'ffffff' }, // Cyan
  { bg: 'be185d', text: 'ffffff' }, // Pink
  { bg: 'b45309', text: 'ffffff' }, // Amber
] as const;

// Generate a consistent color based on company name
const getCompanyColor = (name: string): { bg: string; text: string } => {
  // Use company name to pick a consistent color
  const hash = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COMPANY_COLORS[hash % COMPANY_COLORS.length];
};

function CompanyChipComponent({ company, className }: CompanyChipProps) {
  const [imageError, setImageError] = useState(false);

  // Initialize logoUrl from cached logo_url if available (for table rendering)
  const getInitialLogoUrl = () => {
    if (!company?.logo_url) return null;
    const stored = company.logo_url.trim();
    return stored && !stored.includes('logo.clearbit.com') ? stored : null;
  };
  const [logoUrl, setLogoUrl] = useState<string | null>(getInitialLogoUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const fetchRef = React.useRef<string | null>(null);
  const currentLogoRef = React.useRef<string | null>(null);
  const prevLogoRef = React.useRef<string | null>(null);
  const fallbackUrlRef = React.useRef<string | null>(null);
  const fallbackLoadedRef = React.useRef(false);

  // Stable company identifier (doesn't change when logo_url updates)
  const companyId = useMemo(
    () => company?.id || company?.name || '',
    [company?.id, company?.name]
  );

  // Initialize currentLogoRef with cached logo_url
  React.useEffect(() => {
    const initialLogo = getInitialLogoUrl();
    if (initialLogo && !currentLogoRef.current) {
      currentLogoRef.current = initialLogo;
    }
  }, [company?.logo_url]);

  // Generate fallback avatar URL with company initials - cache it in ref
  const fallbackLogoUrl = useMemo(() => {
    if (!company?.name) return null;
    const initials = getCompanyInitials(company.name);
    const colors = getCompanyColor(company.name);
    const url = API_URLS.UI_AVATARS(initials, 20, colors.bg, colors.text);
    // Cache the fallback URL so it doesn't change
    if (fallbackUrlRef.current !== url) {
      fallbackUrlRef.current = url;
      fallbackLoadedRef.current = false; // Reset loaded state when URL changes
    }
    return url;
  }, [company?.name]);

  // Initialize logo URL - use stored or generate immediately
  useEffect(() => {
    if (!company?.name) {
      setLogoUrl(null);
      setImageError(false);
      setIsLoaded(false);
      fetchRef.current = null;
      currentLogoRef.current = null;
      prevLogoRef.current = null;
      fallbackUrlRef.current = null;
      fallbackLoadedRef.current = false;
      return;
    }

    // Use stable company ID, not logo_url in the key
    const companyKey = companyId;

    const storedLogoUrl =
      company.logo_url && company.logo_url.trim() ? company.logo_url : null;

    // Filter out Clearbit URLs (service is down) - treat as if no logo
    const validLogoUrl =
      storedLogoUrl && !storedLogoUrl.includes('logo.clearbit.com')
        ? storedLogoUrl
        : null;

    // If company changed, reset everything (but preserve logo if it's the same company)
    if (fetchRef.current !== companyKey) {
      fetchRef.current = companyKey;
      // Don't reset currentLogoRef if we have a valid logo for this company
      if (!validLogoUrl) {
        currentLogoRef.current = null;
      }
      prevLogoRef.current = null;
      setImageError(false);
      setIsLoaded(false);
      fallbackLoadedRef.current = false;
    }

    // PRIORITY 1: Use cached logo_url from Supabase if available
    // This prevents unnecessary API calls
    if (validLogoUrl) {
      // Always set the logo URL if we have a cached one (even if ref matches)
      // This ensures logos display correctly in tables on first render
      const companyChanged = fetchRef.current !== companyKey;
      if (
        companyChanged ||
        validLogoUrl !== currentLogoRef.current ||
        logoUrl !== validLogoUrl
      ) {
        prevLogoRef.current = currentLogoRef.current;
        setLogoUrl(validLogoUrl);
        currentLogoRef.current = validLogoUrl;
        setImageError(false);
        setIsLoaded(false); // Reset loaded state when URL changes
      }
      return; // Use cached URL - no need to fetch or generate
    }

    // If no stored logo in Supabase, show fallback and fetch in background
    // This ensures we use cached URLs from Supabase to limit API calls
    if (!validLogoUrl) {
      // Don't generate provider URLs immediately - show fallback instead
      // This prevents unnecessary API calls and ensures we use cached URLs
      if (!currentLogoRef.current) {
        // Set to null to show fallback avatar
        setLogoUrl(null);
        currentLogoRef.current = null;
      }

      // If no stored logo but we have company ID, fetch and save to Supabase
      // This will save the logo_url to database for future use (limits API calls)
      if (company.id && !validLogoUrl) {
        // Fetch in background and save to Supabase
        // This ensures future loads use cached URL from database
        getOrStoreCompanyLogo({
          id: company.id,
          name: company.name,
          website: 'website' in company ? (company.website ?? null) : null,
          logo_url: null, // Explicitly null to trigger fetch
        })
          .then(fetchedLogoUrl => {
            // Only update if this is still the current company and we got a logo
            if (
              fetchRef.current === companyKey &&
              fetchedLogoUrl &&
              !imageError
            ) {
              prevLogoRef.current = currentLogoRef.current;
              setLogoUrl(fetchedLogoUrl);
              currentLogoRef.current = fetchedLogoUrl;
              setImageError(false);
              setIsLoaded(false);
              // Logo is now saved to Supabase - future loads will use cached URL
            }
          })
          .catch(() => {
            // Silently fail - keep showing fallback avatar
          });
      }
    }
  }, [
    companyId,
    company?.name,
    company?.logo_url,
    company?.website,
    company?.id,
  ]);

  // Track failed URLs to prevent retries
  const failedUrlsRef = React.useRef<Set<string>>(new Set());

  // Validate URL format (basic check)
  const isValidUrl =
    logoUrl &&
    (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'));

  // Determine what to show: actual logo, fallback avatar, or icon
  const showFallback = !logoUrl || !isValidUrl || imageError;
  const displayUrl = showFallback ? fallbackLogoUrl : logoUrl;
  const isFallback = showFallback && fallbackLogoUrl;
  const showPrevLogo =
    prevLogoRef.current &&
    prevLogoRef.current !== displayUrl &&
    !isLoaded &&
    !isFallback;

  // Handle image error
  const handleImageError = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = event.currentTarget;
      const failedUrl = img.src;

      // Prevent console errors for known failed URLs (like Clearbit being down)
      // Only log if this is a new failure
      if (!failedUrlsRef.current.has(failedUrl)) {
        failedUrlsRef.current.add(failedUrl);

        // Suppress console errors for Clearbit URLs (service is down)
        if (failedUrl.includes('logo.clearbit.com')) {
          // Silently handle - Clearbit is known to be down
          event.preventDefault();
        }
      }

      // Only set error if this is still the current logo URL
      if (
        displayUrl === currentLogoRef.current ||
        displayUrl === fallbackLogoUrl
      ) {
        if (isFallback) {
          // Fallback failed - don't do anything, just keep showing it
          // The icon will show if displayUrl becomes null
        } else {
          setImageError(true);
          setIsLoaded(false);
          prevLogoRef.current = null;
        }
      }
    },
    [displayUrl, fallbackLogoUrl, isFallback]
  );

  // Handle image load
  const handleImageLoad = useCallback(() => {
    // Only update if this is still the current logo URL
    if (
      displayUrl === currentLogoRef.current ||
      displayUrl === fallbackLogoUrl
    ) {
      if (isFallback) {
        // Mark fallback as loaded but don't change opacity (it's already visible)
        fallbackLoadedRef.current = true;
      } else {
        setImageError(false);
        setIsLoaded(true);
        // Clear previous logo after new one loads
        setTimeout(() => {
          prevLogoRef.current = null;
        }, 300);
      }
    }
  }, [displayUrl, fallbackLogoUrl, isFallback]);

  if (!company?.name) return <span className='text-muted-foreground'>-</span>;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Show logo or fallback avatar */}
      <div className='h-5 w-5 flex-shrink-0 flex items-center justify-center relative'>
        {/* Previous logo (for smooth transition) - only for actual logos, not fallbacks */}
        {showPrevLogo && prevLogoRef.current && (
          <div className='absolute inset-0 h-5 w-5 rounded bg-white'>
            <img
              src={prevLogoRef.current}
              alt=''
              className='h-full w-full rounded object-contain opacity-100'
              aria-hidden='true'
            />
          </div>
        )}
        {/* Current logo or fallback */}
        {displayUrl ? (
          <div
            className={cn(
              'h-5 w-5 rounded',
              !isFallback && 'bg-white',
              showPrevLogo ? 'relative z-10' : 'absolute inset-0'
            )}
          >
            <img
              key={
                isFallback
                  ? `fallback-${companyId}`
                  : `logo-${companyId}-${currentLogoRef.current}`
              }
              src={displayUrl}
              alt={`${company.name} ${showFallback ? 'initials' : 'logo'}`}
              className={cn(
                'h-full w-full rounded object-contain block',
                isFallback
                  ? 'opacity-100' // Fallback should always be visible immediately - no transitions
                  : cn(
                      'transition-opacity duration-300',
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    )
              )}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
        ) : (
          <Building2 className='h-4 w-4 text-muted-foreground' />
        )}
        {/* Loading placeholder - only show when actual logo is loading and no previous logo */}
        {!isFallback &&
          displayUrl &&
          !isLoaded &&
          !imageError &&
          !showPrevLogo && (
            <div className='absolute inset-0 rounded bg-gray-200 dark:bg-gray-700 animate-pulse' />
          )}
      </div>
      <span className='truncate text-foreground'>{company.name}</span>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders when used in tables
export const CompanyChip = memo(CompanyChipComponent);
