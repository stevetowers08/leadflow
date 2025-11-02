import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Edit3, Plus, StickyNote, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotesSectionProps {
  entityId: string;
  entityType: 'lead' | 'company' | 'job';
  entityName?: string;
  className?: string;
  defaultExpanded?: boolean;
}

interface Note {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at?: string;
}

export const NotesSection = ({
  entityId,
  entityType,
  entityName,
  className,
  defaultExpanded = true,
}: NotesSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [noteCount, setNoteCount] = useState<number | null>(null);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  // Load notes data - optimized to combine count and data queries
  useEffect(() => {
    const fetchNotes = async () => {
      if (!entityId) return;

      // If not expanded, just get count
      if (!isExpanded) {
        try {
          const { count } = await supabase
            .from('notes')
            .select('*', { count: 'exact', head: true })
            .eq('entity_id', entityId)
            .eq('entity_type', entityType);

          setNoteCount(count || 0);
        } catch (error) {
          console.error('Error fetching note count:', error);
          setNoteCount(0);
        }
        return;
      }

      // If expanded and not loaded, get full data
      if (hasLoaded) return;

      setIsLoading(true);
      try {
        const { data, error, count } = await supabase
          .from('notes')
          .select(
            `
            id,
            content,
            author_id,
            created_at,
            updated_at
          `,
            { count: 'exact' }
          )
          .eq('entity_id', entityId)
          .eq('entity_type', entityType)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notes:', error);
          toast({
            title: 'Error',
            description: 'Failed to load notes',
            variant: 'destructive',
          });
          return;
        }

        // Set count from the same query
        setNoteCount(count || 0);

        // Fetch author names separately
        const authorIds = [...new Set(data?.map(note => note.author_id) || [])];
        const { data: authors } = await supabase
          .from('user_profiles')
          .select('id, full_name')
          .in('id', authorIds);

        const authorMap = new Map(
          authors?.map(author => [author.id, author.full_name]) || []
        );

        const formattedNotes: Note[] =
          data?.map(note => ({
            id: note.id,
            content: note.content,
            author_id: note.author_id,
            author_name: authorMap.get(note.author_id) || 'Unknown User',
            created_at: note.created_at,
            updated_at: note.updated_at,
          })) || [];

        setNotes(formattedNotes);
        setHasLoaded(true);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notes',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [entityId, entityType, isExpanded, hasLoaded, toast]);

  const addNote = async () => {
    if (!newNoteContent.trim() || !user) {
      console.error('Cannot add note:', {
        hasContent: !!newNoteContent.trim(),
        hasUser: !!user,
      });
      if (!user) {
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to add notes',
          variant: 'destructive',
        });
      }
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          entity_id: entityId,
          entity_type: entityType,
          content: newNoteContent.trim(),
          author_id: user.id,
        })
        .select(
          `
          id,
          content,
          author_id,
          created_at,
          updated_at
        `
        )
        .single();

      if (error) {
        console.error('Database error inserting note:', error);
        throw error;
      }

      // Get author name
      const { data: authorData } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', data.author_id)
        .single();

      const newNote: Note = {
        id: data.id,
        content: data.content,
        author_id: data.author_id,
        author_name: authorData?.full_name || 'Unknown User',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setNotes(prev => [newNote, ...prev]);
      setNoteCount(prev => (prev || 0) + 1);
      setNewNoteContent('');
      setIsAdding(false);

      toast({
        title: 'Note Added',
        description: `Note added to ${entityName || entityType}`,
      });
    } catch (error) {
      console.error('Error adding note:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add note';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateNote = async (noteId: string) => {
    if (!editingContent.trim()) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ content: editingContent.trim() })
        .eq('id', noteId)
        .select(
          `
          id,
          content,
          author_id,
          created_at,
          updated_at,
          user_profiles!inner(full_name)
        `
        )
        .single();

      if (error) throw error;

      const updatedNote: Note = {
        id: data.id,
        content: data.content,
        author_id: data.author_id,
        author_name: data.user_profiles?.full_name || 'Unknown User',
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setNotes(prev =>
        prev.map(note => (note.id === noteId ? updatedNote : note))
      );

      setEditingNoteId(null);
      setEditingContent('');

      toast({
        title: 'Note Updated',
        description: 'Note has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to update note',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));

      toast({
        title: 'Note Deleted',
        description: 'Note has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  const formatNoteDate = (dateString: string) => {
    const date = parseISO(dateString);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, "MMM d, yyyy 'at' h:mm a"),
    };
  };

  const canEditNote = (note: Note) => {
    return user && note.author_id === user.id;
  };

  // If not expanded, show just the notes icon/counter
  if (!isExpanded) {
    return (
      <div className={className}>
        <button
          onClick={() => setIsExpanded(true)}
          className='flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors'
          title={`${noteCount || 0} notes - Click to view`}
        >
          <StickyNote className='h-3 w-3' />
          <span className='font-medium'>
            {noteCount !== null ? noteCount : '...'}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn('w-full min-w-0 flex flex-col', className)}
      style={{ width: '100%' }}
    >
      {/* Add Note Button - Show Plus Icon */}
      {!isAdding && (
        <div className='mb-4'>
          <Button
            onClick={() => setIsAdding(true)}
            variant='outline'
            size='sm'
            className='w-full border-dashed'
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Note
          </Button>
        </div>
      )}

      {/* Simple Add Note Input - Only Visible When Adding */}
      {isAdding && (
        <div className='mb-4'>
          <Textarea
            placeholder={`Add a note...`}
            value={newNoteContent}
            onChange={e => setNewNoteContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                addNote();
              }
            }}
            rows={3}
            className='resize-none'
            autoFocus
          />
          <div className='flex items-center justify-between mt-2'>
            <span className='text-xs text-gray-500'>
              Press Cmd/Ctrl + Enter to save
            </span>
            <div className='flex gap-2'>
              <Button
                onClick={() => {
                  setIsAdding(false);
                  setNewNoteContent('');
                }}
                variant='ghost'
                size='sm'
              >
                Cancel
              </Button>
              <Button
                onClick={addNote}
                disabled={!newNoteContent.trim() || isSaving}
                size='sm'
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className='space-y-3 flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='text-sm text-gray-500 text-center py-8'>
            Loading...
          </div>
        ) : notes.length === 0 ? (
          <div className='text-sm text-gray-500 text-center py-8'>
            No notes yet
          </div>
        ) : (
          <>
            {notes.map(note => {
              const isEditing = editingNoteId === note.id;
              const dateInfo = formatNoteDate(note.created_at);
              const canEdit = canEditNote(note);

              return (
                <div
                  key={note.id}
                  className='group relative p-3 bg-gray-50 rounded-md border border-gray-200'
                >
                  {isEditing ? (
                    <div className='space-y-2'>
                      <Textarea
                        value={editingContent}
                        onChange={e => setEditingContent(e.target.value)}
                        rows={3}
                        className='resize-none'
                        autoFocus
                      />
                      <div className='flex gap-2'>
                        <Button
                          onClick={() => updateNote(note.id)}
                          disabled={!editingContent.trim() || isSaving}
                          size='sm'
                        >
                          Save
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='flex items-start justify-between gap-2 mb-2'>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-medium text-gray-700'>
                            {note.author_name}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {dateInfo.relative}
                          </span>
                        </div>
                        {canEdit && (
                          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => startEditing(note)}
                              className='h-6 px-2 text-gray-500 hover:text-gray-700'
                            >
                              <Edit3 className='h-3 w-3' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => deleteNote(note.id)}
                              className='h-6 px-2 text-gray-500 hover:text-red-600'
                            >
                              <Trash2 className='h-3 w-3' />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className='text-sm text-gray-900 whitespace-pre-wrap leading-relaxed'>
                        {note.content}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
