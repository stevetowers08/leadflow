import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface TagSelectorProps {
  entityId: string;
  entityType: 'company' | 'person' | 'job';
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  disabled?: boolean;
  maxTags?: number;
}

export const TagSelector = ({
  entityId,
  entityType,
  selectedTags,
  onTagsChange,
  disabled = false,
  maxTags = 10,
}: TagSelectorProps) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const { toast } = useToast();

  const predefinedColors = [
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#10B981',
    '#059669',
    '#3B82F6',
    '#8B5CF6',
    '#7C3AED',
    '#EC4899',
    '#6B7280',
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        // Note: tags table doesn't exist in the database
        // Tagging feature is not available
        setAvailableTags([]);
      } catch (error) {
        console.error('Error loading tags:', error);
        setAvailableTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagToggle = async (tag: Tag) => {
    // Note: Tagging feature is not available (tags table doesn't exist)
    // This is a client-side only operation for UI consistency
    const isSelected = selectedTags.some(
      selectedTag => selectedTag.id === tag.id
    );

    if (isSelected) {
      // Remove tag (client-side only)
      onTagsChange(
        selectedTags.filter(selectedTag => selectedTag.id !== tag.id)
      );
      toast({
        title: 'Tag Removed',
        description: `Removed "${tag.name}" tag`,
      });
    } else {
      // Add tag (client-side only)
      if (selectedTags.length >= maxTags) {
        toast({
          title: 'Maximum Tags Reached',
          description: `You can only add up to ${maxTags} tags`,
          variant: 'destructive',
        });
        return;
      }

      onTagsChange([...selectedTags, tag]);
      toast({
        title: 'Tag Added',
        description: `Added "${tag.name}" tag`,
      });
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    // Note: Tagging feature is not available (tags table doesn't exist)
    // Create tag client-side only for UI consistency
    const newTag: Tag = {
      id: `temp-${Date.now()}`,
      name: newTagName.trim(),
      color: newTagColor,
      description: undefined,
    };

    setAvailableTags(prev => [...prev, newTag]);
    setNewTagName('');
    toast({
      title: 'Tag Created',
      description: `Created "${newTag.name}" tag`,
    });
  };

  if (loading) {
    return (
      <div className='flex items-center gap-2'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span className='text-sm text-muted-foreground'>Loading tags...</span>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selectedTags.map(tag => (
            <Badge
              key={tag.id}
              variant='secondary'
              className='flex items-center gap-1'
              style={{
                backgroundColor: tag.color + '20',
                borderColor: tag.color,
              }}
            >
              <div
                className='w-2 h-2 rounded-full'
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleTagToggle(tag)}
                disabled={disabled}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Selector */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            disabled={disabled || selectedTags.length >= maxTags}
            className='h-8'
          >
            <Plus className='h-3 w-3 mr-1' />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-80' align='start'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Available Tags</Label>
              <div className='max-h-40 overflow-y-auto space-y-1'>
                {availableTags
                  .filter(
                    tag =>
                      !selectedTags.some(
                        selectedTag => selectedTag.id === tag.id
                      )
                  )
                  .map(tag => (
                    <Button
                      key={tag.id}
                      variant='ghost'
                      size='sm'
                      className='w-full justify-start h-8'
                      onClick={() => handleTagToggle(tag)}
                    >
                      <div
                        className='w-2 h-2 rounded-full mr-2'
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                      {tag.description && (
                        <span className='text-xs text-muted-foreground ml-2'>
                          - {tag.description}
                        </span>
                      )}
                    </Button>
                  ))}
              </div>
            </div>

            {/* Create New Tag */}
            <div className='space-y-2 border-t pt-3'>
              <Label>Create New Tag</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='Tag name'
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                  className='flex-1'
                />
                <div className='flex gap-1'>
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      className={cn(
                        'w-6 h-6 rounded border-2',
                        newTagColor === color
                          ? 'border-gray-400'
                          : 'border-border'
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>
              <Button
                size='sm'
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
                className='w-full'
              >
                <Tag className='h-3 w-3 mr-1' />
                Create Tag
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
