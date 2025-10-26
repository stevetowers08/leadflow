import React from 'react';

interface RecruitEdgeLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'icon' | 'horizontal' | 'vertical';
}

export const RecruitEdgeLogo: React.FC<RecruitEdgeLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
  variant = 'icon',
}) => {
  // Modern geometric symbol - represents connection and growth
  const iconElement = (
    <svg
      width={size}
      height={size}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      {/* Main geometric shape - represents connection and edge */}
      <defs>
        <linearGradient id='logoGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#3B82F6' />
          <stop offset='50%' stopColor='#8B5CF6' />
          <stop offset='100%' stopColor='#06B6D4' />
        </linearGradient>
      </defs>

      {/* Main diamond/rhombus shape */}
      <path
        d='M50 10 L80 50 L50 90 L20 50 Z'
        fill='url(#logoGradient)'
        stroke='#1E293B'
        strokeWidth='2'
      />

      {/* Inner connection lines */}
      <path
        d='M35 35 L65 35 M35 65 L65 65 M50 20 L50 80'
        stroke='#FFFFFF'
        strokeWidth='2'
        strokeLinecap='round'
        opacity='0.8'
      />

      {/* Center dot representing connection point */}
      <circle
        cx='50'
        cy='50'
        r='6'
        fill='#FFFFFF'
        stroke='#1E293B'
        strokeWidth='1'
      />
    </svg>
  );

  if (!showText) {
    return iconElement;
  }

  // Text styling
  const textSize = size * 0.4;
  const textColor = '#1E293B';
  const fontWeight = '700';

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {iconElement}
        <span
          style={{
            fontSize: `${textSize}px`,
            color: textColor,
            fontWeight: fontWeight,
            letterSpacing: '-0.02em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          RECRUITEDGE
        </span>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        {iconElement}
        <span
          style={{
            fontSize: `${textSize}px`,
            color: textColor,
            fontWeight: fontWeight,
            letterSpacing: '-0.02em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          RECRUITEDGE
        </span>
      </div>
    );
  }

  // Default icon only
  return iconElement;
};

// Export variants for easy use
export const RecruitEdgeLogoHorizontal = (
  props: Omit<RecruitEdgeLogoProps, 'variant'>
) => <RecruitEdgeLogo {...props} variant='horizontal' />;

export const RecruitEdgeLogoVertical = (
  props: Omit<RecruitEdgeLogoProps, 'variant'>
) => <RecruitEdgeLogo {...props} variant='vertical' />;
