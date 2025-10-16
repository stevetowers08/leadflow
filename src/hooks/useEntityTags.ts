import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface UseEntityTagsProps {
  entityId: string;
  entityType: 'company' | 'person' | 'job';
}

export const useEntityTags = ({ entityId, entityType }: UseEntityTagsProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTags = async () => {
      if (!entityId) {
        setTags([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('entity_tags')
          .select(
            `
            tag_id,
            tags!inner (
              id,
              name,
              color,
              description
            )
          `
          )
          .eq('entity_id', entityId)
          .eq('entity_type', entityType);

        if (error) throw error;

        const formattedTags =
          data?.map(item => ({
            id: item.tags.id,
            name: item.tags.name,
            color: item.tags.color,
            description: item.tags.description,
          })) || [];

        setTags(formattedTags);
      } catch (error) {
        console.error('Error fetching entity tags:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tags',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [entityId, entityType, toast]);

  const addTag = async (tag: Tag) => {
    try {
      const { error } = await supabase.from('entity_tags').insert({
        entity_id: entityId,
        entity_type: entityType,
        tag_id: tag.id,
      });

      if (error) throw error;

      setTags(prev => [...prev, tag]);
      toast({
        title: 'Tag Added',
        description: `Added "${tag.name}" tag`,
      });
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to add tag',
        variant: 'destructive',
      });
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('entity_tags')
        .delete()
        .eq('entity_id', entityId)
        .eq('entity_type', entityType)
        .eq('tag_id', tagId);

      if (error) throw error;

      const tagToRemove = tags.find(type => type.id === tagId);
      setTags(prev => prev.filter(tag => tag.id !== tagId));

      toast({
        title: 'Tag Removed',
        description: `Removed "${tagToRemove?.name}" tag`,
      });
    } catch (error) {
      console.error('Error removing tag:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove tag',
        variant: 'destructive',
      });
    }
  };

  const updateTags = (newTags: Tag[]) => {
    setTags(newTags);
  };

  return {
    tags,
    loading,
    addTag,
    removeTag,
    updateTags,
  };
};
