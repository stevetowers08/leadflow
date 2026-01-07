import React from 'react';
import Image from 'next/image';

interface LeadFlowLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'icon' | 'horizontal' | 'vertical';
}

export const LeadFlowLogo: React.FC<LeadFlowLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
  variant = 'icon',
}) => {
  const logoPath = '/leadflow-logo.png';

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div style={{ width: size, height: size }}>
          <Image
            src={logoPath}
            alt='Leadflow'
            width={size}
            height={size}
            className='object-contain w-full h-full'
            priority
          />
        </div>
        {showText && (
          <span className='text-base font-semibold text-foreground'>
            Leadflow
          </span>
        )}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div style={{ width: size, height: size }}>
          <Image
            src={logoPath}
            alt='Leadflow'
            width={size}
            height={size}
            className='object-contain w-full h-full'
            priority
          />
        </div>
        {showText && (
          <span className='text-sm font-semibold text-foreground'>
            Leadflow
          </span>
        )}
      </div>
    );
  }

  // Default icon only
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Image
        src={logoPath}
        alt='Leadflow'
        width={size}
        height={size}
        className='object-contain w-full h-full'
        priority
      />
    </div>
  );
};

// Export variants for easy use
export const LeadFlowLogoHorizontal = (
  props: Omit<LeadFlowLogoProps, 'variant'>
) => <LeadFlowLogo {...props} variant='horizontal' />;

export const LeadFlowLogoVertical = (
  props: Omit<LeadFlowLogoProps, 'variant'>
) => <LeadFlowLogo {...props} variant='vertical' />;
