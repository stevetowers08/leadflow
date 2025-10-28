import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  convertNumericScoreToStatus,
  getUnifiedStatusClass,
} from '@/utils/colorScheme';

export interface ScoreBadgeProps {
  score: string | number | null | undefined;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Score Badge Component
 * Displays score as a colored badge with consistent styling matching industry badges
 */
export function ScoreBadge({
  score,
  className,
  variant = 'compact',
}: ScoreBadgeProps) {
  if (score === null || score === undefined || score === '') {
    return null;
  }

  const statusValue = convertNumericScoreToStatus(score);
  const colorClass = getUnifiedStatusClass(statusValue);
  const sizeClass =
    variant === 'compact' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <Badge
      variant='outline'
      className={cn(
        'rounded-md font-medium whitespace-nowrap border',
        colorClass,
        sizeClass,
        className
      )}
    >
      {typeof score === 'number' ? score : score}
    </Badge>
  );
}
