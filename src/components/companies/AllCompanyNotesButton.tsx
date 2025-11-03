import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SmallSlidePanel } from '@/components/ui/SmallSlidePanel';
import { useClientId } from '@/hooks/useClientId';
import { supabase } from '@/integrations/supabase/client';
import {
  generateMockCompanyNotes,
  shouldUseMockData,
} from '@/utils/mockData';
import { format } from 'date-fns';
import { Building2, Clock, Loader2, StickyNote, User } from 'lucide-react';
import React from 'react';
import { useSlidePanel } from '@/contexts/SlidePanelContext';

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
  const { openPanel, setOpenPanel, closePanel } = useSlidePanel();
  const [isLoading, setIsLoading] = React.useState(false);
  const [notes, setNotes] = React.useState<NoteItem[]>([]);
  const { data: clientId } = useClientId();
  const open = openPanel === 'notes';

  const loadNotes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Use mock data in development if enabled
      if (shouldUseMockData()) {
        const mockNotes = generateMockCompanyNotes();
        setNotes(mockNotes);
        setIsLoading(false);
        return;
      }

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
    <>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-gray-200 rounded-md'
        aria-label='View all company notes'
        onClick={() => setOpenPanel(open ? null : 'notes')}
      >
        <StickyNote className='h-4 w-4' />
      </Button>

      <SmallSlidePanel
        isOpen={open}
        onClose={closePanel}
        title='Company Notes'
      >
        <div className='flex-1 overflow-hidden -mx-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-16'>
              <div className='flex flex-col items-center gap-3'>
                <Loader2 className='h-6 w-6 animate-spin text-blue-500' />
                <p className='text-sm text-gray-500'>Loading notes...</p>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 px-4'>
              <div className='h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
                <StickyNote className='h-8 w-8 text-gray-400' />
              </div>
              <p className='text-sm font-medium text-gray-700 mb-1'>No company notes yet</p>
              <p className='text-xs text-gray-500 text-center'>
                Notes you add to companies will appear here
              </p>
            </div>
          ) : (
            <ScrollArea className='h-full'>
              <div className='py-3'>
                {notes.map(note => (
                  <div
                    key={note.id}
                    className='px-3 py-3.5 hover:bg-gray-50/80 active:bg-gray-100 transition-all border-b border-gray-100'
                  >
                  <div className='flex items-start justify-between mb-2.5'>
                    <div className='flex items-center gap-2'>
                      <Building2 className='h-4 w-4 text-blue-600 flex-shrink-0' />
                      <span className='text-sm font-semibold text-gray-900 line-clamp-1'>
                        {note.company_name}
                      </span>
                    </div>
                    <div className='flex items-center gap-2.5 text-xs text-gray-500 flex-shrink-0 ml-2'>
                      <div className='flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50'>
                        <User className='h-3 w-3' />
                        <span className='font-medium'>{note.author_name}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        <span className='font-medium'>{format(new Date(note.created_at), 'MMM d')}</span>
                      </div>
                    </div>
                  </div>
                  <p className='text-xs text-gray-600 line-clamp-3 whitespace-pre-wrap leading-relaxed'>
                    {note.content}
                  </p>
                </div>
              ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SmallSlidePanel>
    </>
  );
};
