import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Save, Edit3, Plus, Calendar, User } from "lucide-react";
import { formatDistanceToNow, parseISO, format } from "date-fns";

interface NotesSectionProps {
  entityId: string;
  entityType: "lead" | "company";
  entityName?: string;
  className?: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

// Mock notes storage - In a real app, this would be a database table
const mockNotes: Record<string, Note[]> = {};

const generateNoteId = () => `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const NotesSection = ({ entityId, entityType, entityName, className }: NotesSectionProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load notes from localStorage (simulating database)
  useEffect(() => {
    const storageKey = `notes_${entityType}_${entityId}`;
    const storedNotes = localStorage.getItem(storageKey);
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch (error) {
        console.error("Error parsing stored notes:", error);
        setNotes([]);
      }
    }
  }, [entityId, entityType]);

  // Save notes to localStorage
  const saveNotesToStorage = (updatedNotes: Note[]) => {
    const storageKey = `notes_${entityType}_${entityId}`;
    localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
  };

  const addNote = async () => {
    if (!newNoteContent.trim()) return;

    setIsSaving(true);
    try {
      // In a real app, you'd get the current user from authentication
      const currentUser = "Current User"; // This should come from auth context
      
      const newNote: Note = {
        id: generateNoteId(),
        content: newNoteContent.trim(),
        author: currentUser,
        createdAt: new Date().toISOString(),
      };

      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      
      setNewNoteContent("");
      setIsAdding(false);

      toast({
        title: "Note Added",
        description: `Note added to ${entityName || entityType}`,
      });
    } catch (error) {
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
      const updatedNotes = notes.map(note =>
        note.id === noteId
          ? { ...note, content: editingContent.trim(), updatedAt: new Date().toISOString() }
          : note
      );

      setNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      
      setEditingNoteId(null);
      setEditingContent("");

      toast({
        title: "Note Updated",
        description: "Note has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
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

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>Notes & Comments</span>
              {notes.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {notes.length}
                </Badge>
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
          {notes.length === 0 && !isAdding ? (
            <div className="text-center py-6 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No notes yet</div>
              <div className="text-xs">Add notes to track important information</div>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => {
                const isEditing = editingNoteId === note.id;
                const dateInfo = formatNoteDate(note.createdAt);
                
                return (
                  <div
                    key={note.id}
                    className="p-3 bg-white border border-border rounded-lg hover:shadow-sm transition-shadow"
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
                              {note.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{note.author}</div>
                              <div className="text-xs text-muted-foreground" title={dateInfo.absolute}>
                                {dateInfo.relative}
                                {note.updatedAt && (
                                  <span className="ml-1">(edited)</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(note)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
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