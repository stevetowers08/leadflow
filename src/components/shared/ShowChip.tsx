import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Show } from '@/types/database';
import { format } from 'date-fns';

interface ShowChipProps {
  show: Show | { name: string; start_date?: string | null } | null;
  className?: string;
}

export function ShowChip({ show, className }: ShowChipProps) {
  if (!show?.name) return null;

  let dateStr: string | null = null;
  if (show.start_date) {
    try {
      const date = new Date(show.start_date);
      if (!isNaN(date.getTime())) {
        dateStr = format(date, 'MMM d');
      }
    } catch {
      // Invalid date, ignore
    }
  }

  return (
    <Badge variant='secondary' className={className}>
      <Calendar className='h-3 w-3 mr-1' />
      <span className='truncate max-w-[100px]'>{show.name}</span>
      {dateStr && <span className='ml-1 text-xs opacity-70'>{dateStr}</span>}
    </Badge>
  );
}
