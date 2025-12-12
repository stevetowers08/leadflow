import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import { DropdownOption } from '@/hooks/useDropdownOptions';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'lead' | 'company' | 'contact';
  entityId: string;
  entityName: string;
  onNoteAdded?: () => void;
}

interface Lead {
  id: string;
  name: string;
  company_role: string;
}

export function AddNoteModal({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName,
  onNoteAdded,
}: AddNoteModalProps) {
  const [noteText, setNoteText] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('people')
        .select('id, name, company_role')
        .eq('company_id', entityId)
        .order('name');

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  }, [entityId]);

  // Fetch leads when modal opens
  useEffect(() => {
    if (isOpen && entityType === 'company') {
      fetchLeads();
    }
  }, [isOpen, entityType, fetchLeads]);

  const leadOptions: DropdownOption[] = [
    { value: '', label: 'General company note' },
    ...leads.map(lead => ({
      value: lead.id,
      label: `${lead.name}${lead.company_role ? ` (${lead.company_role})` : ''}`,
    })),
  ];

  const handleSubmit = async () => {
    if (!noteText.trim()) return;

    setIsSubmitting(true);
    try {
      const noteData = {
        entity_id: entityId,
        entity_type: entityType,
        content: noteText.trim(),
        created_at: new Date().toISOString(),
        // Only include related_lead_id if a specific lead is selected
        ...(selectedLeadId && { related_lead_id: selectedLeadId }),
      };

      const { error } = await supabase.from('entity_notes').insert(noteData);

      if (error) throw error;

      // Reset form
      setNoteText('');
      setSelectedLeadId('');

      // Notify parent component
      onNoteAdded?.();

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-sidebar-primary/10 rounded-lg flex items-center justify-center'>
              <Plus className='w-4 h-4 text-sidebar-primary' />
            </div>
            <div>
              <h2 className='text-lg font-semibold text-foreground'>
                Add Note
              </h2>
              <p className='text-sm text-muted-foreground'>{entityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-muted-foreground transition-colors p-1 rounded-lg hover:bg-gray-100'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-4'>
          {/* Lead Selection (only for companies) */}
          {entityType === 'company' && (
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-foreground'>
                Related Lead (Optional)
              </Label>
              <DropdownSelect
                options={leadOptions}
                value={selectedLeadId}
                onValueChange={setSelectedLeadId}
                placeholder='Select a lead or leave for general note'
                className='w-full'
                loading={isLoading}
              />
            </div>
          )}

          {/* Note Text */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium text-foreground'>
              Note Content
            </Label>
            <Textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Enter your note here...'
              className='min-h-[120px] resize-none'
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-3 p-6 border-t border-border'>
          <Button variant='outline' onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!noteText.trim() || isSubmitting}
            className='bg-sidebar-primary hover:bg-sidebar-primary/90'
          >
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddNoteModal;
