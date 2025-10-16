import { useState, memo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteToggleProps {
  entityId: string;
  entityType: 'lead' | 'company' | 'job';
  isFavorite: boolean;
  onToggle?: (isFavorite: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FavoriteToggle = memo(
  ({
    entityId,
    entityType,
    isFavorite,
    onToggle,
    size = 'sm',
    className,
  }: FavoriteToggleProps) => {
    const [isToggling, setIsToggling] = useState(false);
    const { toast } = useToast();

    const handleToggle = useCallback(async () => {
      if (isToggling) return;

      setIsToggling(true);
      try {
        const newFavoriteStatus = !isFavorite;

        // Determine the table name based on entity type
        const tableName =
          entityType === 'lead'
            ? 'people'
            : entityType === 'company'
              ? 'companies'
              : 'jobs';

        const { error } = await supabase
          .from(tableName)
          .update({ is_favourite: newFavoriteStatus })
          .eq('id', entityId);

        if (error) throw error;

        onToggle?.(newFavoriteStatus);

        toast({
          title: newFavoriteStatus
            ? 'Added to Favorites'
            : 'Removed from Favorites',
          description: `${entityType} ${newFavoriteStatus ? 'added to' : 'removed from'} favorites`,
        });
      } catch (error) {
        console.error('Error toggling favorite:', error);
        toast({
          title: 'Error',
          description: 'Failed to update favorite status',
          variant: 'destructive',
        });
      } finally {
        setIsToggling(false);
      }
    }, [isToggling, isFavorite, entityType, entityId, onToggle, toast]);

    const sizeClasses = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    };

    const iconSizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-8 w-8',
    };

    return (
      <Button
        variant='ghost'
        onClick={handleToggle}
        disabled={isToggling}
        className={cn(
          sizeClasses[size],
          'p-0 hover:bg-transparent',
          isFavorite && 'text-yellow-500 hover:text-yellow-600',
          !isFavorite && 'text-muted-foreground hover:text-yellow-500',
          className
        )}
      >
        <Star
          className={cn(
            iconSizeClasses[size],
            isFavorite ? 'fill-current' : '',
            isToggling && 'animate-pulse'
          )}
        />
      </Button>
    );
  }
);
