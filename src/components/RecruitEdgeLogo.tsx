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
  showText = true,
  variant = 'horizontal',
}) => {
  // Text-only logo
  const textSize = size * 0.5;
  const textColor = '#1E293B';
  const fontWeight = '700';

  if (variant === 'horizontal') {
    return (
      <span
        className={className}
        style={{
          fontSize: `${textSize}px`,
          color: textColor,
          fontWeight: fontWeight,
          letterSpacing: '-0.02em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        Leadflow
      </span>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <span
          style={{
            fontSize: `${textSize}px`,
            color: textColor,
            fontWeight: fontWeight,
            letterSpacing: '-0.02em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Leadflow
        </span>
      </div>
    );
  }

  // Default text only
  return (
    <span
      className={className}
      style={{
        fontSize: `${textSize}px`,
        color: textColor,
        fontWeight: fontWeight,
        letterSpacing: '-0.02em',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      Leadflow
    </span>
  );
};

// Export variants for easy use
export const RecruitEdgeLogoHorizontal = (
  props: Omit<RecruitEdgeLogoProps, 'variant'>
) => <RecruitEdgeLogo {...props} variant='horizontal' />;

export const RecruitEdgeLogoVertical = (
  props: Omit<RecruitEdgeLogoProps, 'variant'>
) => <RecruitEdgeLogo {...props} variant='vertical' />;
