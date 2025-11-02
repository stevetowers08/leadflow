'use client';

import { CelebrationModal } from '@/components/onboarding/CelebrationModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const { state, incrementJobsQualified, markStepComplete } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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
        .maybeSingle();

      if (clientUserError) throw clientUserError;

      if (!clientUser?.client_id) {
        throw new Error('No client_id found for user');
      }

      // Create or update client_job
      const { error: clientJobError } = await supabase
        .from('client_jobs')
        .upsert(
          {
            client_id: clientUser.client_id,
            job_id: jobId,
            status: status,
            priority_level: 'medium',
            qualified_by: user.id,
            qualified_at:
              status === 'qualify' ? new Date().toISOString() : null,
          },
          {
            onConflict: 'client_id,job_id',
          }
        );

      if (clientJobError) throw clientJobError;

      // If qualifying, also link company to client
      if (status === 'qualify' && companyId) {
        const { error: clientCompanyError } = await supabase
          .from('client_companies')
          .upsert(
            {
              client_id: clientUser.client_id,
              company_id: companyId,
              qualification_status: 'qualify',
              qualified_at: new Date().toISOString(),
              qualified_by: user.id,
            },
            {
              onConflict: 'client_id,company_id',
            }
          );

        if (clientCompanyError) {
          console.error('Error creating client company:', clientCompanyError);
          // Don't throw - job qualification succeeded
        }
      }

      // Send webhook for AI enrichment (if qualifying)
      if (status === 'qualify' && companyId) {
        try {
          const { error: webhookError } = await supabase.functions.invoke(
            'job-qualification-webhook',
            {
              body: {
                job_id: jobId,
                company_id: companyId,
                client_id: clientUser.client_id,
                user_id: user.id,
              },
            }
          );

          if (webhookError) {
            console.error('Webhook error:', webhookError);
            // Don't throw - qualification succeeded
          }
        } catch (webhookErr) {
          console.error('Failed to send webhook:', webhookErr);
          // Don't throw - qualification succeeded
        }
      }

      // Track onboarding progress
      if (status === 'qualify') {
        incrementJobsQualified();

        // Check if they've qualified 3 jobs - show celebration
        if (state.jobsQualifiedCount + 1 === 3) {
          markStepComplete('qualify_3_jobs');
          setShowCelebration(true);
        }
      }

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

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onContinue={() => {
          setShowCelebration(false);
          router.push('/companies');
        }}
        title='🎉 Congratulations!'
        description="You've qualified 3 potential clients and added them to your pipeline."
        nextSteps={[
          'Explore your companies',
          'Find decision makers',
          'Start sending outreach messages',
        ]}
        continueLabel='View Companies'
      />
    </div>
  );
};
