import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface LeadSource {
  id: string;
  name: string;
  description?: string;
}

const FALLBACK_LEAD_SOURCES: LeadSource[] = [
  { id: '1', name: 'Event', description: 'Captured at an event' },
  { id: '2', name: 'LinkedIn', description: 'Found via LinkedIn' },
  { id: '3', name: 'Referral', description: 'Referred by someone' },
  { id: '4', name: 'Website', description: 'From company website' },
  { id: '5', name: 'Email', description: 'Email outreach' },
  { id: '6', name: 'Other', description: 'Other source' },
];

interface LeadSourceSelectorProps {
  value?: string;
  sourceDetails?: string;
  onSourceChange: (source: string) => void;
  onDetailsChange: (details: string) => void;
  disabled?: boolean;
}

export const LeadSourceSelector = ({
  value,
  sourceDetails,
  onSourceChange,
  onDetailsChange,
  disabled = false,
}: LeadSourceSelectorProps) => {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Note: lead_sources table doesn't exist in the database
    // Using fallback common lead sources that match the lead_source enum
    setSources(FALLBACK_LEAD_SOURCES);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className='flex items-center gap-2'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span className='text-sm text-muted-foreground'>
          Loading sources...
        </span>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='lead-source'>Lead Source</Label>
        <Select
          value={value || ''}
          onValueChange={onSourceChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select lead source' />
          </SelectTrigger>
          <SelectContent>
            {sources.map(source => (
              <SelectItem key={source.id} value={source.name}>
                {source.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='source-details'>Source Details (Optional)</Label>
        <Textarea
          id='source-details'
          placeholder='Additional details about how you found this lead...'
          value={sourceDetails || ''}
          onChange={e => onDetailsChange(e.target.value)}
          disabled={disabled}
          rows={3}
        />
      </div>
    </div>
  );
};
