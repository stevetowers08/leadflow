import React from 'react';

interface LeadFlowLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'icon' | 'horizontal' | 'vertical';
}

export const LeadFlowLogo: React.FC<LeadFlowLogoProps> = ({
  size = 32,
  className = '',
  showText = true,
  variant = 'horizontal',
}) => {
  // Text-only logo
  const textSize = size * 0.5;
  const textColor = '#1E293B';
  const fontWeight = '700';

  const textClasses = 'font-bold tracking-tight font-sans text-slate-800';
  const textStyle = { fontSize: `${textSize}px` };

  if (variant === 'horizontal') {
    return (
      <span className={`${textClasses} ${className}`} style={textStyle}>
        Leadflow
      </span>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <span className={textClasses} style={textStyle}>
          Leadflow
        </span>
      </div>
    );
  }

  // Default text only
  return (
    <span className={`${textClasses} ${className}`} style={textStyle}>
      Leadflow
    </span>
  );
};

// Export variants for easy use
export const LeadFlowLogoHorizontal = (
  props: Omit<LeadFlowLogoProps, 'variant'>
) => <LeadFlowLogo {...props} variant='horizontal' />;

export const LeadFlowLogoVertical = (
  props: Omit<LeadFlowLogoProps, 'variant'>
) => <LeadFlowLogo {...props} variant='vertical' />;
