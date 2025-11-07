import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import {
  generateMockNotes,
  shouldUseMockData,
  type MockNote,
} from '@/utils/mockData';
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
  const [mockNotes, setMockNotes] = useState<MockNote[]>([]);
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
  const isMockMode = shouldUseMockData();

  // Load notes data - optimized to combine count and data queries
  useEffect(() => {
    const fetchNotes = async () => {
      if (!entityId) return;

      // Use mock data in development if enabled
      if (isMockMode) {
        if (!isExpanded) {
          const mockNotesData = generateMockNotes(
            entityId,
            user?.id || 'mock_user_1',
            userProfile?.full_name || 'You'
          );
          setNoteCount(mockNotesData.length);
          return;
        }

        if (hasLoaded && mockNotes.length > 0) return;

        setIsLoading(true);
        const mockNotesData = generateMockNotes(
          entityId,
          user?.id || 'mock_user_1',
          userProfile?.full_name || 'You'
        );
        setMockNotes(mockNotesData);
        setNoteCount(mockNotesData.length);
        setIsLoading(false);
        setHasLoaded(true);
        return;
      }

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
  }, [
    entityId,
    entityType,
    isExpanded,
    hasLoaded,
    toast,
    isMockMode,
    user?.id,
    userProfile?.full_name,
    mockNotes.length,
  ]);

  const addNote = async () => {
    if (!newNoteContent.trim()) {
      return;
    }

    // Mock mode: add to local state
    if (isMockMode) {
      const newMockNote: MockNote = {
        id: `mock_note_${Date.now()}_${entityId}`,
        content: newNoteContent.trim(),
        author_id: user?.id || 'mock_user_1',
        author_name: userProfile?.full_name || 'You',
        created_at: new Date().toISOString(),
      };

      setMockNotes(prev => [newMockNote, ...prev]);
      setNoteCount(prev => (prev || 0) + 1);
      setNewNoteContent('');
      setIsAdding(false);

      toast({
        title: 'Note Added',
        description: `Note added to ${entityName || entityType}`,
      });
      return;
    }

    // Real mode: save to database
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to add notes',
        variant: 'destructive',
      });
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
      // Mock mode: update local state
      if (isMockMode) {
        setMockNotes(prev =>
          prev.map(note =>
            note.id === noteId
              ? { ...note, content: editingContent.trim(), updated_at: new Date().toISOString() }
              : note
          )
        );

        setEditingNoteId(null);
        setEditingContent('');

        toast({
          title: 'Note Updated',
          description: 'Note has been updated successfully',
        });
        setIsSaving(false);
        return;
      }

      // Real mode: update in database
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
      // Mock mode: remove from local state
      if (isMockMode) {
        setMockNotes(prev => prev.filter(note => note.id !== noteId));
        setNoteCount(prev => Math.max(0, (prev || 1) - 1));
        setIsSaving(false);
        toast({
          title: 'Note Deleted',
          description: 'Note has been deleted successfully',
        });
        return;
      }

      // Real mode: delete from database
      const { error } = await supabase.from('notes').delete().eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      setNoteCount(prev => Math.max(0, (prev || 1) - 1));

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
          className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
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
            <span className='text-xs text-muted-foreground'>
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
          <div className='text-sm text-muted-foreground text-center py-8'>
            Loading...
          </div>
        ) : (isMockMode ? mockNotes : notes).length === 0 ? (
          <div className='text-sm text-muted-foreground text-center py-8'>
            No notes yet
          </div>
        ) : (
          <>
            {(isMockMode ? mockNotes : notes).map(note => {
              const displayNote: Note = isMockMode
                ? {
                    id: note.id,
                    content: note.content,
                    author_id: note.author_id,
                    author_name: note.author_name,
                    created_at: note.created_at,
                    updated_at: note.updated_at,
                  }
                : note;
              const isEditing = editingNoteId === displayNote.id;
              const dateInfo = formatNoteDate(displayNote.created_at);
              const canEdit = isMockMode
                ? displayNote.author_id === (user?.id || 'mock_user_1')
                : canEditNote(displayNote);

              return (
                <div
                  key={note.id}
                  className='group relative p-3 bg-muted rounded-md border border-border'
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
                          <span className='text-xs font-medium text-foreground'>
                            {note.author_name}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {dateInfo.relative}
                          </span>
                        </div>
                        {canEdit && (
                          <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => startEditing(note)}
                              className='h-6 px-2 text-muted-foreground hover:text-foreground'
                            >
                              <Edit3 className='h-3 w-3' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => deleteNote(note.id)}
                              className='h-6 px-2 text-muted-foreground hover:text-destructive'
                            >
                              <Trash2 className='h-3 w-3' />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className='text-sm text-foreground whitespace-pre-wrap leading-relaxed'>
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
