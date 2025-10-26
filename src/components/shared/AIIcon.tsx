import React from 'react';

interface AIIconProps {
  size?: number;
  className?: string;
  variant?: 'brain' | 'sparkles' | 'circuit' | 'neural';
}

export const AIIcon: React.FC<AIIconProps> = ({
  size = 24,
  className = '',
  variant = 'brain',
}) => {
  const iconPaths = {
    brain: (
      <path
        d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4L19 9Z'
        fill='currentColor'
      />
    ),
    sparkles: (
      <g>
        <path
          d='M12 2L13.09 8.26L19 7L13.09 8.26L12 14L10.91 8.26L5 7L10.91 8.26L12 2Z'
          fill='currentColor'
        />
        <path
          d='M19 12L20.09 18.26L26 17L20.09 18.26L19 24L17.91 18.26L12 17L17.91 18.26L19 12Z'
          fill='currentColor'
        />
        <path
          d='M5 12L6.09 18.26L12 17L6.09 18.26L5 24L3.91 18.26L-2 17L3.91 18.26L5 12Z'
          fill='currentColor'
        />
      </g>
    ),
    circuit: (
      <g>
        <rect x='3' y='3' width='6' height='6' rx='1' fill='currentColor' />
        <rect x='15' y='3' width='6' height='6' rx='1' fill='currentColor' />
        <rect x='3' y='15' width='6' height='6' rx='1' fill='currentColor' />
        <rect x='15' y='15' width='6' height='6' rx='1' fill='currentColor' />
        <path
          d='M9 6H15M9 18H15M6 9V15M18 9V15'
          stroke='currentColor'
          strokeWidth='2'
          fill='none'
        />
      </g>
    ),
    neural: (
      <g>
        <circle cx='12' cy='4' r='2' fill='currentColor' />
        <circle cx='6' cy='12' r='2' fill='currentColor' />
        <circle cx='18' cy='12' r='2' fill='currentColor' />
        <circle cx='12' cy='20' r='2' fill='currentColor' />
        <path
          d='M12 6L6 10M12 6L18 10M6 14L12 18M18 14L12 18'
          stroke='currentColor'
          strokeWidth='2'
          fill='none'
        />
      </g>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      className={`ai-icon ${className}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {iconPaths[variant]}
    </svg>
  );
};

// Modern AI Brain Icon (More sophisticated)
export const ModernAIIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      className={`modern-ai-icon ${className}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient id='aiGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#6366f1' />
          <stop offset='100%' stopColor='#8b5cf6' />
        </linearGradient>
      </defs>

      {/* Brain outline */}
      <path
        d='M12 2C8.5 2 6 4.5 6 8C6 9.5 6.5 10.8 7.2 12C6.5 13.2 6 14.5 6 16C6 19.5 8.5 22 12 22C15.5 22 18 19.5 18 16C18 14.5 17.5 13.2 16.8 12C17.5 10.8 18 9.5 18 8C18 4.5 15.5 2 12 2Z'
        fill='url(#aiGradient)'
        stroke='currentColor'
        strokeWidth='1'
      />

      {/* Neural network nodes */}
      <circle cx='9' cy='8' r='1.5' fill='white' />
      <circle cx='15' cy='8' r='1.5' fill='white' />
      <circle cx='12' cy='12' r='1.5' fill='white' />
      <circle cx='9' cy='16' r='1.5' fill='white' />
      <circle cx='15' cy='16' r='1.5' fill='white' />

      {/* Connection lines */}
      <path
        d='M9 8L12 12M15 8L12 12M12 12L9 16M12 12L15 16'
        stroke='white'
        strokeWidth='1'
        fill='none'
      />
    </svg>
  );
};

// Sparkle AI Icon (Clean and modern)
export const SparkleAIIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      className={`sparkle-ai-icon ${className}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient
          id='sparkleGradient'
          x1='0%'
          y1='0%'
          x2='100%'
          y2='100%'
        >
          <stop offset='0%' stopColor='#f59e0b' />
          <stop offset='100%' stopColor='#ef4444' />
        </linearGradient>
      </defs>

      {/* Main sparkle */}
      <path
        d='M12 2L13.5 8.5L20 7L13.5 8.5L12 15L10.5 8.5L4 7L10.5 8.5L12 2Z'
        fill='url(#sparkleGradient)'
      />

      {/* Small sparkles */}
      <path
        d='M6 4L6.5 6L8 5.5L6.5 6L6 8L5.5 6L4 5.5L5.5 6L6 4Z'
        fill='url(#sparkleGradient)'
        opacity='0.7'
      />
      <path
        d='M18 4L18.5 6L20 5.5L18.5 6L18 8L17.5 6L16 5.5L17.5 6L18 4Z'
        fill='url(#sparkleGradient)'
        opacity='0.7'
      />
      <path
        d='M6 16L6.5 18L8 17.5L6.5 18L6 20L5.5 18L4 17.5L5.5 18L6 16Z'
        fill='url(#sparkleGradient)'
        opacity='0.7'
      />
      <path
        d='M18 16L18.5 18L20 17.5L18.5 18L18 20L17.5 18L16 17.5L17.5 18L18 16Z'
        fill='url(#sparkleGradient)'
        opacity='0.7'
      />
    </svg>
  );
};

export default AIIcon;
