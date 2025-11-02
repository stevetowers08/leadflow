import * as React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { FilterControls, FilterControlsProps } from '@/design-system/components';

interface CollapsibleFilterControlsProps extends FilterControlsProps {
  className?: string;
}

export const CollapsibleFilterControls: React.FC<
  CollapsibleFilterControlsProps
> = ({ className, ...filterProps }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!isMobile) {
    return <FilterControls className={className} {...filterProps} />;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-between h-9 mb-2',
            isOpen && 'border-primary'
          )}
        >
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4' />
            <span>Filters</span>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className='pb-4'>
        <FilterControls className={className} {...filterProps} />
      </CollapsibleContent>
    </Collapsible>
  );
};

