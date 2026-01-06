import React from 'react';

interface SlideOutSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SlideOutSection: React.FC<SlideOutSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className='mb-4 last:mb-0'>
      <h4 className='text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border/50 pt-6 pb-2 mb-3'>
        {title}
      </h4>
      {children}
    </div>
  );
};
