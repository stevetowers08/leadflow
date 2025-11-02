import * as React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ScrollToTopButtonProps {
  containerRef?: React.RefObject<HTMLElement>;
  showAfter?: number; // Scroll distance in px before showing button
  className?: string;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  containerRef,
  showAfter = 300,
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const scrollContainer = containerRef?.current || window;
    const handleScroll = () => {
      const scrollTop =
        containerRef?.current?.scrollTop ||
        document.documentElement.scrollTop ||
        window.pageYOffset;
      setIsVisible(scrollTop > showAfter);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [containerRef, showAfter]);

  const scrollToTop = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      size='icon'
      className={cn(
        'fixed bottom-24 right-6 z-50 rounded-full shadow-lg h-10 w-10',
        'transition-all duration-200',
        'hover:scale-110',
        className
      )}
      aria-label='Scroll to top'
    >
      <ArrowUp className='h-4 w-4' />
    </Button>
  );
};

