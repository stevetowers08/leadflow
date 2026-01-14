import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getCompanyLogoUrlSync } from '@/services/logoService';

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
  xl: 'w-16 h-16',
};

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export const ClearbitLogo: React.FC<ClearbitLogoProps> = ({
  companyName,
  website,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const logoUrl = getCompanyLogoUrlSync(companyName, website);
  const sizeClass = sizeMap[size];
  const textSizeClass = textSizeMap[size];

  // Reset state when logo URL changes
  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [logoUrl]);

  const handleError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  // If no website or image failed, show initials fallback
  if (!logoUrl || imageError) {
    return (
      <div
        className={cn(
          'rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold',
          sizeClass,
          textSizeClass,
          className
        )}
      >
        {companyName ? companyName.charAt(0).toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <div className={cn('relative', sizeClass, className)}>
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        className={cn(
          'rounded-lg object-cover transition-opacity duration-200',
          sizeClass,
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onError={handleError}
        onLoad={handleLoad}
        loading='lazy'
        style={{
          aspectRatio: '1 / 1',
        }}
      />

      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div
          className={cn(
            'absolute inset-0 rounded-lg bg-gray-200 animate-pulse',
            sizeClass
          )}
        />
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
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const url = getCompanyLogoUrlSync(companyName, website);
  const sizeClass = sizeMap[size];
  const textSizeClass = textSizeMap[size];

  // Reset error state when URL changes
  React.useEffect(() => {
    setHasError(false);
  }, [url]);

  const handleImageError = () => {
    setHasError(true);
  };

  if (hasError || !url) {
    return (
      <div
        className={cn(
          'rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold',
          sizeClass,
          textSizeClass,
          className
        )}
      >
        {companyName ? companyName.charAt(0).toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={`${companyName} logo`}
      className={cn('rounded-lg object-cover', sizeClass, className)}
      onError={handleImageError}
      loading='lazy'
    />
  );
};
