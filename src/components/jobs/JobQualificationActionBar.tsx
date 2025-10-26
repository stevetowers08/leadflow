import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface JobQualificationActionBarProps {
  jobId: string;
  companyId: string | null;
  onStatusChange?: () => void;
}

export const JobQualificationActionBar: React.FC<
  JobQualificationActionBarProps
> = ({ jobId, companyId, onStatusChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);

  // Check current qualification status on mount
  React.useEffect(() => {
    const checkStatus = async () => {
      if (!user?.id) return;

      try {
        // Get user's client_id
        const { data: clientUser } = await supabase
          .from('client_users')
          .select('client_id')
          .eq('user_id', user.id)
          .single();

        if (!clientUser?.client_id) return;

        // Check qualification status from client_jobs
        const { data, error } = await supabase
          .from('client_jobs')
          .select('status')
          .eq('client_id', clientUser.client_id)
          .eq('job_id', jobId)
          .single();

        if (!error && data) {
          setCurrentStatus(data.status || 'new');
        }
      } catch (error) {
        console.error('Error checking qualification status:', error);
      }
    };

    checkStatus();
  }, [jobId, user?.id]);

  const handleQualificationChange = async (value: string) => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get user's client_id
      const { data: clientUser, error: clientUserError } = await supabase
        .from('client_users')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (clientUserError) throw clientUserError;

      // Create or update client_job
      const { error } = await supabase.from('client_jobs').upsert(
        {
          client_id: clientUser.client_id,
          job_id: jobId,
          status: value,
          priority_level: 'medium',
          qualified_by: user.id,
          qualified_at: value === 'qualify' ? new Date().toISOString() : null,
        },
        {
          onConflict: 'client_id,job_id',
        }
      );

      if (error) throw error;

      setCurrentStatus(value);

      toast({
        title: 'Success',
        description: `Job ${value === 'qualify' ? 'qualified' : 'skipped'} successfully`,
      });

      onStatusChange?.();
    } catch (error) {
      console.error('Error updating qualification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update qualification status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show current status if already decided
  if (currentStatus === 'qualify') {
    return (
      <div className='flex items-center gap-2 text-success text-sm'>
        <CheckCircle className='h-4 w-4' />
        <span className='font-medium'>Qualified</span>
      </div>
    );
  }

  if (currentStatus === 'skip') {
    return (
      <div className='flex items-center gap-2 text-muted-foreground text-sm'>
        <XCircle className='h-4 w-4' />
        <span className='font-medium'>Skipped</span>
      </div>
    );
  }

  return (
    <Select onValueChange={handleQualificationChange} disabled={loading}>
      <SelectTrigger className='action-bar action-bar--dropdown w-32'>
        <SelectValue placeholder='Qualify' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='qualify'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='h-4 w-4 text-success' />
            <span>Qualify</span>
          </div>
        </SelectItem>
        <SelectItem value='skip'>
          <div className='flex items-center gap-2'>
            <XCircle className='h-4 w-4 text-destructive' />
            <span>Skip</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
