import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getShows, getCurrentShow } from '@/services/showsService';
import { useEffect } from 'react';

interface ShowSelectorProps {
  value?: string | null;
  onValueChange: (showId: string | null) => void;
  className?: string;
}

export function ShowSelector({
  value,
  onValueChange,
  className,
}: ShowSelectorProps) {
  const { data: shows = [] } = useQuery({
    queryKey: ['shows'],
    queryFn: () => getShows(),
    staleTime: 5 * 60 * 1000,
  });

  // Auto-select current show on mount
  useEffect(() => {
    if (!value && shows.length > 0) {
      getCurrentShow()
        .then(current => {
          if (current) {
            onValueChange(current.id);
          }
        })
        .catch(error => {
          console.error('Error getting current show:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, shows.length]);

  // Show empty state with create option when no shows exist
  if (shows.length === 0) {
    return (
      <Select value={undefined} disabled>
        <SelectTrigger className={className}>
          <Calendar className='h-4 w-4 mr-2' />
          <SelectValue placeholder='No shows' />
        </SelectTrigger>
      </Select>
    );
  }

  const selectedShow = shows.find(s => s.id === value);

  return (
    <Select
      value={value || undefined}
      onValueChange={val => onValueChange(val || null)}
    >
      <SelectTrigger className={className}>
        <Calendar className='h-4 w-4 mr-2' />
        <SelectValue placeholder='Select show'>
          {selectedShow ? selectedShow.name : 'Select show'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {shows.map(show => {
          let dateStr: string | null = null;
          if (show.start_date) {
            try {
              const date = new Date(show.start_date);
              if (!isNaN(date.getTime())) {
                dateStr = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }
            } catch {
              // Invalid date, ignore
            }
          }

          return (
            <SelectItem key={show.id} value={show.id}>
              {show.name}
              {dateStr && (
                <span className='text-xs text-muted-foreground ml-2'>
                  {dateStr}
                </span>
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
