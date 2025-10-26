import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface JobQualificationCardButtonsProps {
  jobId: string;
  companyId: string | null;
  onStatusChange?: () => void;
  size?: 'sm' | 'md';
}

export const JobQualificationCardButtons: React.FC<
  JobQualificationCardButtonsProps
> = ({ jobId, companyId, onStatusChange, size = 'sm' }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleQualification = async (status: 'qualify' | 'skip') => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to qualify jobs',
        variant: 'destructive',
      });
      return;
    }

    if (!companyId) {
      toast({
        title: 'Error',
        description: 'Cannot update job without associated company',
        variant: 'destructive',
      });
      return;
    }

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
          status: status,
          priority_level: 'medium',
          qualified_by: user.id,
          qualified_at: status === 'qualify' ? new Date().toISOString() : null,
        },
        {
          onConflict: 'client_id,job_id',
        }
      );

      if (error) throw error;

      toast({
        title: 'Success',
        description:
          status === 'qualify'
            ? 'Job qualified and added to pipeline'
            : 'Job marked as skip',
      });

      onStatusChange?.();
    } catch (error) {
      console.error('Error updating qualification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update qualification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : 'default';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className='flex gap-1'>
      <Button
        size={buttonSize}
        variant='outline'
        className='h-6 px-2 text-xs text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300'
        onClick={e => {
          e.stopPropagation(); // Prevent card click
          handleQualification('qualify');
        }}
        disabled={loading || !user?.id}
      >
        {loading ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : (
          <CheckCircle className={iconSize} />
        )}
        <span className='ml-1'>Qualify</span>
      </Button>
      <Button
        size={buttonSize}
        variant='outline'
        className='h-6 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
        onClick={e => {
          e.stopPropagation(); // Prevent card click
          handleQualification('skip');
        }}
        disabled={loading || !user?.id}
      >
        {loading ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : (
          <XCircle className={iconSize} />
        )}
        <span className='ml-1'>Skip</span>
      </Button>
    </div>
  );
};
