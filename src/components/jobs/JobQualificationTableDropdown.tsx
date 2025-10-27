import { CelebrationModal } from '@/components/onboarding/CelebrationModal';
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobQualificationTableDropdownProps {
  job: Job;
  onStatusChange?: () => void;
}

export const JobQualificationTableDropdown: React.FC<
  JobQualificationTableDropdownProps
> = ({ job, onStatusChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { state, incrementJobsQualified, markStepComplete } = useOnboarding();
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>('new');

  // Load current status on mount
  useEffect(() => {
    const loadStatus = async () => {
      if (!user?.id) return;

      try {
        const { data: clientUser } = await supabase
          .from('client_users')
          .select('client_id')
          .eq('user_id', user.id)
          .single();

        if (!clientUser?.client_id) return;

        const { data } = await supabase
          .from('client_jobs')
          .select('status')
          .eq('client_id', clientUser.client_id)
          .eq('job_id', job.id)
          .maybeSingle();

        if (data) setCurrentStatus(data.status || 'new');
      } catch (error) {
        console.error('Error loading status:', error);
      }
    };

    loadStatus();
  }, [job.id, user?.id]);

  const handleStatusChange = async () => {
    // Track onboarding progress when qualifying
    const { data: clientUser } = await supabase
      .from('client_users')
      .select('client_id')
      .eq('user_id', user?.id)
      .single();

    if (clientUser?.client_id) {
      const { data } = await supabase
        .from('client_jobs')
        .select('status')
        .eq('client_id', clientUser.client_id)
        .eq('job_id', job.id)
        .maybeSingle();

      if (data?.status === 'qualify') {
        incrementJobsQualified();
        if (state.jobsQualifiedCount + 1 === 3) {
          markStepComplete('qualify_3_jobs');
          setShowCelebration(true);
        }
      }
    }

    onStatusChange?.();
  };

  return (
    <>
      <div className='flex items-center justify-center h-full'>
        <UnifiedStatusDropdown
          entityId={job.id}
          entityType='jobs'
          currentStatus={currentStatus}
          availableStatuses={['new', 'qualify', 'skip']}
          onStatusChange={handleStatusChange}
        />
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onContinue={() => {
          setShowCelebration(false);
          navigate('/companies');
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
    </>
  );
};
