/**
 * Optimized image component with lazy loading, error handling, and fallbacks
 */

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getStatusDisplayText } from '@/utils/statusUtils';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lazy?: boolean;
  onError?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-8 h-8',
  lg: 'w-8 h-8',
  xl: 'w-8 h-8'
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback,
  className = '',
  size = 'md',
  lazy = true,
  onError
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = useCallback(() => {
    setImageError(true);
    onError?.();
  }, [onError]);

  const handleLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div className={cn(
        'rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold',
        sizeClasses[size],
        className
      )}>
        {fallback || getStatusDisplayText(alt.charAt(0))}
      </div>
    );
  }

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'rounded-lg object-cover transition-opacity duration-200',
          sizeClasses[size],
          imageLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          // Prevent layout shift
          aspectRatio: '1 / 1'
        }}
      />
      
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className={cn(
          'absolute inset-0 rounded-lg bg-gray-200 animate-pulse',
          sizeClasses[size]
        )} />
      )}
    </div>
  );
};

/**
 * Company logo component with Clearbit fallback
 */
interface CompanyLogoProps {
  companyName: string;
  logoUrl?: string | null;
  website?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  companyName,
  logoUrl,
  website,
  size = 'md',
  className
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(logoUrl || null);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const handleError = useCallback(() => {
    if (!fallbackUsed && website) {
      // Try Clearbit fallback
      const domain = website.replace(/^https?:\/\//, '').split('/')[0];
      setCurrentSrc(`https://logo.clearbit.com/${domain}`);
      setFallbackUsed(true);
    } else {
      // Use initials fallback
      setCurrentSrc(null);
    }
  }, [website, fallbackUsed]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={companyName}
      size={size}
      className={className}
      fallback={
        <span className="text-sm font-semibold">
          {getStatusDisplayText(companyName.charAt(0))}
        </span>
      }
      onError={handleError}
    />
  );
};

/**
 * Profile image component with LinkedIn fallback
 */
interface ProfileImageProps {
  name: string;
  imageUrl?: string | null;
  linkedinUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  name,
  imageUrl,
  linkedinUrl,
  size = 'md',
  className
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(imageUrl || null);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const handleError = useCallback(() => {
    if (!fallbackUsed && linkedinUrl) {
      // Try LinkedIn profile image fallback
      const linkedinId = linkedinUrl.match(/linkedin\.com\/in\/([^\/]+)/)?.[1];
      if (linkedinId) {
        setCurrentSrc(`https://media.licdn.com/dms/image/C4E03AQ${linkedinId}/profile-displayphoto-shrink_200_200/0/1234567890`);
        setFallbackUsed(true);
      } else {
        setCurrentSrc(null);
      }
    } else {
      setCurrentSrc(null);
    }
  }, [linkedinUrl, fallbackUsed]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={name}
      size={size}
      className={className}
      fallback={
        <span className="text-sm font-semibold">
          {getStatusDisplayText(name.split(' ').map(n => n.charAt(0)).join(''))}
        </span>
      }
      onError={handleError}
    />
  );
};

