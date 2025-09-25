// Consistent modal sizing across the application
export const MODAL_SIZES = {
  // Standard modal size for most popups
  STANDARD: {
    width: 'max-w-4xl',
    height: 'max-h-[90vh]',
    scrollHeight: 'max-h-[70vh]'
  },
  
  // Large modal for complex forms or detailed views
  LARGE: {
    width: 'max-w-6xl', 
    height: 'max-h-[95vh]',
    scrollHeight: 'max-h-[75vh]'
  },
  
  // Small modal for simple confirmations or alerts
  SMALL: {
    width: 'max-w-md',
    height: 'max-h-[80vh]',
    scrollHeight: 'max-h-[60vh]'
  }
} as const;

// Helper function to get modal classes
export const getModalClasses = (size: keyof typeof MODAL_SIZES = 'STANDARD') => {
  const sizes = MODAL_SIZES[size];
  return {
    container: `${sizes.width} ${sizes.height} overflow-hidden`,
    scrollArea: sizes.scrollHeight
  };
};
