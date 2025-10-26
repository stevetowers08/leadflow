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
    <div className='mb-6 last:mb-0'>
      <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4'>
        {title}
      </h4>
      {children}
    </div>
  );
};
