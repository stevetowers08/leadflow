import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { Edit3, Plus, Save, StickyNote, Trash2 } from 'lucide-react';
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
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    <div className={className}>
      {/* Add Note Form - Floating at Top */}
      {isAdding && (
        <div className='mb-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 shadow-sm'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='p-1.5 rounded-lg bg-primary/20'>
              <Plus className='h-4 w-4 text-primary' />
            </div>
            <div className='text-sm font-semibold text-foreground'>
              Add New Note
            </div>
          </div>
          <Textarea
            placeholder={`Share your thoughts about ${entityName || `this ${entityType}`}...`}
            value={newNoteContent}
            onChange={e => setNewNoteContent(e.target.value)}
            rows={4}
            className='resize-none mb-3'
            autoFocus
          />
          <div className='flex gap-2'>
            <Button
              onClick={addNote}
              disabled={!newNoteContent.trim() || isSaving}
              size='sm'
              className='flex-1'
            >
              <Save className='h-3.5 w-3.5 mr-2' />
              {isSaving ? 'Saving...' : 'Save Note'}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setIsAdding(false);
                setNewNoteContent('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-4'></div>
            <div className='text-sm font-medium text-foreground'>
              Loading notes...
            </div>
            <div className='text-xs text-muted-foreground'>
              Please wait a moment
            </div>
          </div>
        ) : notes.length === 0 && !isAdding ? (
          <div className='flex flex-col items-center justify-center py-12 px-4'>
            <div className='p-3 rounded-full bg-muted mb-4'>
              <StickyNote className='h-8 w-8 text-muted-foreground' />
            </div>
            <div className='text-base font-semibold text-foreground mb-1'>
              No notes yet
            </div>
            <div className='text-sm text-muted-foreground text-center max-w-sm'>
              Be the first to add a note about this item. Your notes help keep
              everyone informed.
            </div>
            {!isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                variant='outline'
                size='sm'
                className='mt-4'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add First Note
              </Button>
            )}
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
                  className='group relative p-4 bg-white border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200'
                >
                  {isEditing ? (
                    <div className='space-y-3'>
                      <Textarea
                        value={editingContent}
                        onChange={e => setEditingContent(e.target.value)}
                        rows={4}
                        className='resize-none'
                        autoFocus
                      />
                      <div className='flex gap-2'>
                        <Button
                          onClick={() => updateNote(note.id)}
                          disabled={!editingContent.trim() || isSaving}
                          size='sm'
                        >
                          <Save className='h-3.5 w-3.5 mr-2' />
                          {isSaving ? 'Saving...' : 'Update Note'}
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={cancelEditing}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Author Info & Actions */}
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          <div className='flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold shadow-sm'>
                            {note.author_name
                              .split(' ')
                              .map(namePart => namePart[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className='text-sm font-semibold text-foreground'>
                              {note.author_name}
                            </div>
                            <div
                              className='text-xs text-muted-foreground flex items-center gap-1'
                              title={dateInfo.absolute}
                            >
                              {dateInfo.relative}
                              {note.updated_at && (
                                <span className='text-muted-foreground/70'>
                                  · edited
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {canEdit && (
                          <div className='flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => startEditing(note)}
                              className='h-7 w-7 text-muted-foreground hover:text-foreground'
                            >
                              <Edit3 className='h-3.5 w-3.5' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => deleteNote(note.id)}
                              className='h-7 w-7 text-muted-foreground hover:text-destructive'
                            >
                              <Trash2 className='h-3.5 w-3.5' />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Note Content */}
                      <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed break-words'>
                        {note.content}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Add Note Button - When not adding and notes exist */}
            {!isAdding && notes.length > 0 && (
              <Button
                onClick={() => setIsAdding(true)}
                variant='outline'
                className='w-full border-dashed hover:bg-muted/50'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add Another Note
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
