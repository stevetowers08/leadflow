import React from 'react';
import { ClearbitLogo } from './ClearbitLogo';

interface CompanyLogoProps {
  companyId?: string;
  companyName: string;
  website?: string;
  cachedLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackToInitials?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  companyName,
  website,
  size = 'md',
  className = '',
  fallbackToInitials = true,
}) => {
  return (
    <ClearbitLogo
      companyName={companyName}
      website={website}
      size={size}
      className={className}
    />
  );
};

/**
 * Synchronous version for immediate rendering
 * Uses cached URLs and generates fallbacks without async operations
 */
export const CompanyLogoSync: React.FC<CompanyLogoProps> = ({
  companyName,
  website,
  size = 'md',
  className = '',
  fallbackToInitials = true,
}) => {
  return (
    <ClearbitLogo
      companyName={companyName}
      website={website}
      size={size}
      className={className}
    />
  );
};
