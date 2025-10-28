import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Building2, Clock, Loader2, StickyNote, User } from 'lucide-react';
import React from 'react';

interface NoteItem {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  created_at: string;
  entity_id: string;
  company_name: string;
}

export const AllCompanyNotesButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [notes, setNotes] = React.useState<NoteItem[]>([]);
  const { data: clientId } = useClientId();

  const loadNotes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('notes')
        .select('id, content, author_id, created_at, entity_id')
        .eq('entity_type', 'company')
        .order('created_at', { ascending: false })
        .limit(100);

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const companyIds = Array.from(new Set(data?.map(n => n.entity_id) || []));
      const [companiesResult, authorsResult] = await Promise.all([
        companyIds.length > 0
          ? supabase.from('companies').select('id, name').in('id', companyIds)
          : { data: [], error: null },
        supabase
          .from('user_profiles')
          .select('id, full_name')
          .in('id', Array.from(new Set(data?.map(n => n.author_id) || []))),
      ]);

      const companyMap = new Map(
        (companiesResult.data || []).map(c => [c.id, c.name])
      );
      const authorMap = new Map(
        (authorsResult.data || []).map(a => [a.id, a.full_name])
      );

      setNotes(
        (data || []).map(n => ({
          id: n.id,
          content: n.content,
          author_id: n.author_id,
          author_name: authorMap.get(n.author_id) || 'Unknown',
          created_at: n.created_at,
          entity_id: n.entity_id,
          company_name: companyMap.get(n.entity_id) || 'Unknown Company',
        }))
      );
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  React.useEffect(() => {
    if (open) loadNotes();
  }, [open, loadNotes]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md'
        onClick={() => setOpen(true)}
        aria-label='View all company notes'
      >
        <StickyNote className='h-4 w-4' />
      </Button>

      <DialogContent className='max-w-2xl max-h-[85vh]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <StickyNote className='h-5 w-5 text-primary' />
            Company Notes
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
          </div>
        ) : notes.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <StickyNote className='h-12 w-12 text-muted-foreground mb-3 opacity-50' />
            <p className='text-sm font-medium'>No company notes</p>
            <p className='text-xs text-muted-foreground mt-1'>
              All company notes will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className='max-h-[60vh]'>
            <div className='space-y-3 pr-4'>
              {notes.map(note => (
                <div
                  key={note.id}
                  className='group rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <Building2 className='h-4 w-4 text-muted-foreground' />
                      <span className='text-sm font-medium text-foreground'>
                        {note.company_name}
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <User className='h-3 w-3' />
                        {note.author_name}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        {format(new Date(note.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                  <p className='text-sm text-foreground whitespace-pre-wrap'>
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
