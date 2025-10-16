import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExternalLink, Calendar } from 'lucide-react';

interface LeadSourceDisplayProps {
  source?: string | null;
  sourceDetails?: string | null;
  sourceDate?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  showDate?: boolean;
  className?: string;
}

export const LeadSourceDisplay = ({
  source,
  sourceDetails,
  sourceDate,
  size = 'md',
  showDetails = false,
  showDate = false,
  className,
}: LeadSourceDisplayProps) => {
  if (!source) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Badge variant='outline' className='text-muted-foreground'>
          No source
        </Badge>
      </div>
    );
  }

  const getSourceColor = (source: string) => {
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes('linkedin'))
      return 'bg-blue-100 text-blue-800 border-blue-200';
    if (sourceLower.includes('website'))
      return 'bg-green-100 text-green-800 border-green-200';
    if (sourceLower.includes('referral'))
      return 'bg-purple-100 text-purple-800 border-purple-200';
    if (sourceLower.includes('email'))
      return 'bg-orange-100 text-orange-800 border-orange-200';
    if (sourceLower.includes('trade show'))
      return 'bg-pink-100 text-pink-800 border-pink-200';
    if (sourceLower.includes('social'))
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (sourceLower.includes('google'))
      return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      <div className='flex items-center gap-2'>
        <Badge
          variant='outline'
          className={cn('font-medium', getSourceColor(source))}
        >
          {source}
        </Badge>
        {showDate && sourceDate && (
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Calendar className='h-3 w-3' />
            {formatDate(sourceDate)}
          </div>
        )}
      </div>

      {showDetails && sourceDetails && (
        <p className='text-xs text-muted-foreground line-clamp-2'>
          {sourceDetails}
        </p>
      )}
    </div>
  );
};
