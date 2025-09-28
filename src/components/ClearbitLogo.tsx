import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ClearbitLogoProps {
  companyName: string;
  website?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
};

export const ClearbitLogo: React.FC<ClearbitLogoProps> = ({
  companyName,
  website,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Generate Clearbit URL from website domain
  const getClearbitUrl = useCallback((website?: string): string | null => {
    if (!website) return null;
    
    try {
      const domain = website
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .split('?')[0];
      
      return `https://logo.clearbit.com/${domain}`;
    } catch {
      return null;
    }
  }, []);

  const clearbitUrl = getClearbitUrl(website);
  const sizeClass = sizeMap[size];
  const textSizeClass = textSizeMap[size];

  const handleError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // If no website or image failed, show initials fallback
  if (!clearbitUrl || imageError) {
    return (
      <div className={cn(
        'rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold',
        sizeClass,
        textSizeClass,
        className
      )}>
        {companyName ? companyName.charAt(0).toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <div className={cn('relative', sizeClass, className)}>
      <img
        src={clearbitUrl}
        alt={`${companyName} logo`}
        className={cn(
          'rounded-full object-cover transition-opacity duration-200',
          sizeClass,
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        style={{
          aspectRatio: '1 / 1'
        }}
      />
      
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className={cn(
          'absolute inset-0 rounded-full bg-gray-200 animate-pulse',
          sizeClass
        )} />
      )}
    </div>
  );
};

/**
 * Synchronous version for immediate rendering
 * Uses cached URLs and generates fallbacks without async operations
 */
export const ClearbitLogoSync: React.FC<ClearbitLogoProps> = ({
  companyName,
  website,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);
  
  const getClearbitUrl = (website?: string): string | null => {
    if (!website) return null;
    
    try {
      const domain = website
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0]
        .split('?')[0];
      
      return `https://logo.clearbit.com/${domain}`;
    } catch {
      return null;
    }
  };

  const clearbitUrl = getClearbitUrl(website);
  const sizeClass = sizeMap[size];
  const textSizeClass = textSizeMap[size];

  const handleImageError = () => {
    setHasError(true);
  };

  if (hasError || !clearbitUrl) {
    return (
      <div className={cn(
        'rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold',
        sizeClass,
        textSizeClass,
        className
      )}>
        {companyName ? companyName.charAt(0).toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <img
      src={clearbitUrl}
      alt={`${companyName} logo`}
      className={cn('rounded-full object-cover', sizeClass, className)}
      onError={handleImageError}
      loading="lazy"
    />
  );
};
