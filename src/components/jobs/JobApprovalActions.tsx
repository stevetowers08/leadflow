import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface JobApprovalActionsProps {
  jobId: string;
  companyId: string | null;
  onStatusChange?: () => void;
}

export const JobApprovalActions: React.FC<JobApprovalActionsProps> = ({
  jobId,
  companyId,
  onStatusChange,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [dealStatus, setDealStatus] = useState<string | null>(null);

  // Check existing deal status on mount
  React.useEffect(() => {
    const checkDealStatus = async () => {
      try {
        // Get user's client_id
        const { data: clientUser, error: clientUserError } = await supabase
          .from('client_users')
          .select('client_id')
          .eq('user_id', user?.id)
          .single();

        if (clientUserError) return;

        // Check if deal exists
        const { data, error } = await supabase
          .from('client_jobs')
          .select('status')
          .eq('client_id', clientUser.client_id)
          .eq('job_id', jobId)
          .maybeSingle();

        if (!error && data) {
          setDealStatus(data.status === 'qualify' ? 'approved' : 'rejected');
        }
      } catch (error) {
        console.error('Error checking deal status:', error);
      }
    };

    checkDealStatus();
  }, [jobId, user?.id]);

  const handleStartPursuing = async () => {
    if (!companyId) {
      toast({
        title: 'Error',
        description: 'Cannot add job without associated company',
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
        .eq('user_id', user?.id)
        .single();

      if (clientUserError) throw clientUserError;

      // Create or update client_job
      const { error } = await supabase.from('client_jobs').upsert(
        {
          client_id: clientUser.client_id,
          job_id: jobId,
          status: 'qualify',
          priority_level: 'medium',
          qualified_by: user?.id,
          qualified_at: new Date().toISOString(),
        },
        {
          onConflict: 'client_id,job_id',
        }
      );

      if (error) throw error;

      toast({
        title: 'Success',
        description:
          'Job added to your pipeline. You can now start pursuing this deal.',
      });

      setDealStatus('approved');
      onStatusChange?.();
    } catch (error) {
      console.error('Error starting pursuit:', error);
      toast({
        title: 'Error',
        description: 'Failed to add job to pipeline. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePass = async () => {
    if (!companyId) {
      toast({
        title: 'Error',
        description: 'Cannot update job without associated company',
        variant: 'destructive',
      });
      return;
    }

    if (!declineReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for passing on this deal.',
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
        .eq('user_id', user?.id)
        .single();

      if (clientUserError) throw clientUserError;

      // Create or update client_job
      const { error } = await supabase.from('client_jobs').upsert(
        {
          client_id: clientUser.client_id,
          job_id: jobId,
          status: 'skip',
          priority_level: 'low',
          notes: declineReason,
          qualified_by: user?.id,
        },
        {
          onConflict: 'client_id,job_id',
        }
      );

      if (error) throw error;

      toast({
        title: 'Deal Passed',
        description:
          'This job has been marked as not a fit. Thank you for the feedback.',
      });

      setDealStatus('rejected');
      setShowDeclineForm(false);
      setDeclineReason('');
      onStatusChange?.();
    } catch (error) {
      console.error('Error passing deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show status if already decided
  if (dealStatus === 'approved') {
    return (
      <Card className='border-green-200 bg-success/10'>
        <CardContent className='pt-4'>
          <div className='flex items-center gap-2 text-success'>
            <CheckCircle className='h-5 w-5' />
            <p className='text-sm font-medium'>This job is in your pipeline</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dealStatus === 'rejected') {
    return (
      <Card className='border-border bg-muted'>
        <CardContent className='pt-4'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <XCircle className='h-5 w-5' />
            <p className='text-sm font-medium'>
              You previously passed on this deal
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show decline form if requested
  if (showDeclineForm) {
    return (
      <Card className='border-orange-200 bg-warning/10'>
        <CardContent className='pt-4 space-y-4'>
          <div className='flex items-start gap-2'>
            <AlertCircle className='h-5 w-5 text-warning mt-0.5 flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium text-orange-900 mb-1'>
                Why is this deal not a fit?
              </p>
              <p className='text-xs text-warning'>
                This helps improve future job recommendations
              </p>
            </div>
          </div>

          <Textarea
            placeholder="e.g., Location doesn't match, salary too low, not the right seniority level..."
            value={declineReason}
            onChange={e => setDeclineReason(e.target.value)}
            rows={3}
            className='bg-white'
            disabled={loading}
          />

          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => {
                setShowDeclineForm(false);
                setDeclineReason('');
              }}
              disabled={loading}
              size='sm'
            >
              Cancel
            </Button>
            <Button
              onClick={handlePass}
              disabled={loading || !declineReason.trim()}
              size='sm'
              variant='destructive'
            >
              {loading && <Loader2 className='h-3 w-3 mr-2 animate-spin' />}
              {loading ? 'Updating...' : 'Confirm Pass'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show action buttons
  return (
    <Card>
      <CardContent className='pt-4'>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            onClick={() => setShowDeclineForm(true)}
            disabled={loading}
            className='flex-1'
          >
            <XCircle className='h-4 w-4 mr-2' />
            Pass
          </Button>

          <Button
            onClick={handleStartPursuing}
            disabled={loading}
            className='flex-1'
          >
            {loading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
            {loading ? (
              'Adding...'
            ) : (
              <>
                <CheckCircle className='h-4 w-4 mr-2' />
                Start Pursuing
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
