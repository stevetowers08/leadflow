import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Save, Edit3, Plus, Calendar, User, Trash2 } from "lucide-react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface NotesSectionProps {
  entityId: string;
  entityType: "lead" | "company" | "job";
  entityName?: string;
  className?: string;
}

interface Note {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at?: string;
}

export const NotesSection = ({ entityId, entityType, entityName, className }: NotesSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  // Load notes from Supabase
  useEffect(() => {
    const fetchNotes = async () => {
      if (!entityId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('notes')
          .select(`
            id,
            content,
            author_id,
            created_at,
            updated_at,
            user_profiles!notes_author_id_fkey(full_name)
          `)
          .eq('entity_id', entityId)
          .eq('entity_type', entityType)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notes:', error);
          toast({
            title: "Error",
            description: "Failed to load notes",
            variant: "destructive",
          });
          return;
        }

        const formattedNotes: Note[] = data?.map(note => ({
          id: note.id,
          content: note.content,
          author_id: note.author_id,
          author_name: note.user_profiles?.full_name || 'Unknown User',
          created_at: note.created_at,
          updated_at: note.updated_at
        })) || [];

        setNotes(formattedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: "Error",
          description: "Failed to load notes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [entityId, entityType, toast]);

  const addNote = async () => {
    if (!newNoteContent.trim() || !user) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          entity_id: entityId,
          entity_type: entityType,
          content: newNoteContent.trim(),
          author_id: user.id
        })
        .select(`
          id,
          content,
          author_id,
          created_at,
          updated_at,
          user_profiles!notes_author_id_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      const newNote: Note = {
        id: data.id,
        content: data.content,
        author_id: data.author_id,
        author_name: data.user_profiles?.full_name || 'Unknown User',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setNotes(prev => [newNote, ...prev]);
      setNewNoteContent("");
      setIsAdding(false);

      toast({
        title: "Note Added",
        description: `Note added to ${entityName || entityType}`,
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
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
        .select(`
          id,
          content,
          author_id,
          created_at,
          updated_at,
          user_profiles!notes_author_id_fkey(full_name)
        `)
        .single();

      if (error) throw error;

      const updatedNote: Note = {
        id: data.id,
        content: data.content,
        author_id: data.author_id,
        author_name: data.user_profiles?.full_name || 'Unknown User',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ));
      
      setEditingNoteId(null);
      setEditingContent("");

      toast({
        title: "Note Updated",
        description: "Note has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));

      toast({
        title: "Note Deleted",
        description: "Note has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
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
    setEditingContent("");
  };

  const formatNoteDate = (dateString: string) => {
    const date = parseISO(dateString);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, "MMM d, yyyy 'at' h:mm a")
    };
  };

  const canEditNote = (note: Note) => {
    return user && note.author_id === user.id;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>Notes & Comments</span>
              {notes.length > 0 && (
                <StatusBadge status={`${notes.length}`} size="sm" />
              )}
            </div>
            {!isAdding && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
                className="h-8 px-3"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Note
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Add new note form */}
          {isAdding && (
            <div className="space-y-3 p-3 bg-muted/20 rounded-lg border">
              <Textarea
                placeholder={`Add a note about ${entityName || `this ${entityType}`}...`}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={addNote}
                  disabled={!newNoteContent.trim() || isSaving}
                  size="sm"
                >
                  <Save className="h-3 w-3 mr-1" />
                  {isSaving ? "Saving..." : "Save Note"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setNewNoteContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Notes list */}
          {isLoading ? (
            <div className="text-center py-6 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <div className="text-sm">Loading notes...</div>
            </div>
          ) : notes.length === 0 && !isAdding ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No notes yet</div>
              <div className="text-xs">Add notes to track important information</div>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => {
                const isEditing = editingNoteId === note.id;
                const dateInfo = formatNoteDate(note.created_at);
                const canEdit = canEditNote(note);
                
                return (
                  <div
                    key={note.id}
                    className="p-3 bg-white border border-border rounded-lg hover:shadow-sm transition-shadow group"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => updateNote(note.id)}
                            disabled={!editingContent.trim() || isSaving}
                            size="sm"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            {isSaving ? "Saving..." : "Update"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              {note.author_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{note.author_name}</div>
                              <div className="text-xs text-muted-foreground" title={dateInfo.absolute}>
                                {dateInfo.relative}
                                {note.updated_at && (
                                  <span className="ml-1">(edited)</span>
                                )}
                              </div>
                            </div>
                          </div>
                          {canEdit && (
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(note)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNote(note.id)}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-foreground whitespace-pre-wrap">
                          {note.content}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};