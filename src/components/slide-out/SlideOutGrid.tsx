import React from 'react';

export interface GridItem {
  label: string;
  value: React.ReactNode;
}

interface SlideOutGridProps {
  items: GridItem[];
}

export const SlideOutGrid: React.FC<SlideOutGridProps> = ({ items }) => {
  return (
    <div className='grid grid-cols-2 gap-4'>
      {items.map((item, index) => (
        <div key={index} className='text-sm'>
          <span className='text-xs text-gray-500 block mb-1'>{item.label}</span>
          <div className='font-medium text-gray-900 break-words'>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};
