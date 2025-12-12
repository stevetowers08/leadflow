import { NotesSection } from '@/components/NotesSection';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { StickyNote } from 'lucide-react';
import React from 'react';

interface NotesButtonProps {
  entityId: string;
  entityType: 'lead' | 'company' | 'contact';
  entityName?: string;
  size?: 'sm' | 'md';
}

export const NotesButton: React.FC<NotesButtonProps> = ({
  entityId,
  entityType,
  entityName,
  size = 'sm',
}) => {
  const [open, setOpen] = React.useState(false);

  const dimension = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className={cn(
          'inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
          dimension
        )}
        onClick={e => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label='View notes'
        title='View notes'
      >
        <StickyNote className={iconSize} />
      </Button>

      <DialogContent className='sm:max-w-2xl max-h-[85vh] flex flex-col'>
        <DialogHeader className='pb-4 border-b'>
          <DialogTitle className='flex items-center gap-3 text-lg'>
            <div className='p-2 rounded-lg bg-primary/10'>
              <StickyNote className='h-5 w-5 text-primary' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-semibold'>Notes & Comments</div>
              {entityName && (
                <div className='text-sm font-normal text-muted-foreground truncate'>
                  {entityName}
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-hidden py-4'>
          <NotesSection
            entityId={entityId}
            entityType={entityType}
            entityName={entityName}
            defaultExpanded={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
