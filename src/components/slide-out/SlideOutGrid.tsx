import React from 'react';

export interface GridItem {
  label: React.ReactNode;
  value: React.ReactNode;
}

interface SlideOutGridProps {
  items: GridItem[];
}

export const SlideOutGrid: React.FC<SlideOutGridProps> = ({ items }) => {
  return (
    <div className='grid grid-cols-2 gap-3 md:gap-4'>
      {items.map((item, index) => (
        <div key={index}>
          <span className='text-xs md:text-sm text-muted-foreground block mb-1'>
            {item.label}
          </span>
          <div className='text-sm md:text-base font-medium text-foreground break-words'>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};
