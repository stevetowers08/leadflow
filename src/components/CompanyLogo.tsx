import React, { useState, useEffect } from 'react';
import { getCompanyLogoUrl, getCompanyLogoUrlSync, getUIAvatarsUrl } from '@/utils/enhancedLogoService';

interface CompanyLogoProps {
  companyId: string;
  companyName: string;
  website?: string;
  cachedLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackToInitials?: boolean;
}

const sizeMap = {
  sm: 32,
  md: 32,
  lg: 32,
  xl: 32
};

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  companyId,
  companyName,
  website,
  cachedLogoUrl,
  size = 'md',
  className = '',
  fallbackToInitials = true
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Get logo URL with fallbacks
        const url = await getCompanyLogoUrl(companyId, companyName, website, cachedLogoUrl);
        setLogoUrl(url);
      } catch (error) {
        console.warn('Error loading company logo:', error);
        setHasError(true);
        // Fallback to UI Avatars
        setLogoUrl(getUIAvatarsUrl(companyName, sizeMap[size]));
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();
  }, [companyId, companyName, website, cachedLogoUrl, size]);

  const handleImageError = () => {
    setHasError(true);
    // Fallback to UI Avatars
    setLogoUrl(getUIAvatarsUrl(companyName, sizeMap[size]));
  };

  const sizeClass = `w-${sizeMap[size] / 4} h-${sizeMap[size] / 4}`;

  if (isLoading) {
    return (
      <div className={`${sizeClass} rounded-full bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (hasError || !logoUrl) {
    if (fallbackToInitials) {
      return (
        <div className={`${sizeClass} rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold ${className}`}>
          {companyName ? companyName.charAt(0).toUpperCase() : '?'}
        </div>
      );
    }
    return null;
  }

  return (
    <img
      src={logoUrl}
      alt={`${companyName} logo`}
      className={`${sizeClass} rounded-full object-cover ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

/**
 * Synchronous version for immediate rendering
 * Uses cached URLs and generates fallbacks without async operations
 */
export const CompanyLogoSync: React.FC<CompanyLogoProps> = ({
  companyId,
  companyName,
  website,
  cachedLogoUrl,
  size = 'md',
  className = '',
  fallbackToInitials = true
}) => {
  const [hasError, setHasError] = useState(false);
  
  // Get logo URL synchronously
  const logoUrl = getCompanyLogoUrlSync(companyId, companyName, website, cachedLogoUrl);
  
  const handleImageError = () => {
    setHasError(true);
  };

  const sizeClass = `w-${sizeMap[size] / 4} h-${sizeMap[size] / 4}`;

  if (hasError || !logoUrl) {
    if (fallbackToInitials) {
      return (
        <div className={`${sizeClass} rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold ${className}`}>
          {companyName ? companyName.charAt(0).toUpperCase() : '?'}
        </div>
      );
    }
    return null;
  }

  return (
    <img
      src={logoUrl}
      alt={`${companyName} logo`}
      className={`${sizeClass} rounded-full object-cover ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
};
