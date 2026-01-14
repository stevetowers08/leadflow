'use client';

import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ShowChip } from './ShowChip';
import { ShowSelector } from './ShowSelector';
import { updateLead } from '@/services/leadsService';
import { toast } from 'sonner';
import type { Lead, Show } from '@/types/database';
import { logger } from '@/utils/productionLogger';

interface InlineShowEditorProps {
  lead: Lead;
  shows: Show[];
  onUpdate: () => void;
}

export function InlineShowEditor({
  lead,
  shows,
  onUpdate,
}: InlineShowEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentShow = shows.find(s => s.id === lead.show_id);

  const handleShowChange = async (showId: string | null) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      await updateLead(lead.id, { show_id: showId });
      setIsOpen(false);
      onUpdate();
      toast.success('Show updated successfully');
    } catch (error) {
      logger.error('Error updating show:', error);
      toast.error(
        'Failed to update show',
        error instanceof Error ? { description: error.message } : undefined
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className='inline-flex items-center hover:opacity-80 transition-opacity cursor-pointer text-muted-foreground hover:text-foreground'
          onClick={e => e.stopPropagation()}
        >
          {currentShow ? (
            <ShowChip show={currentShow} />
          ) : (
            <span className='text-sm'>-</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='w-64 p-3'
        align='start'
        onClick={e => e.stopPropagation()}
      >
        <div className='space-y-2'>
          <div className='text-sm font-medium'>Select Show</div>
          <ShowSelector
            value={lead.show_id || null}
            onValueChange={handleShowChange}
            className='w-full'
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
