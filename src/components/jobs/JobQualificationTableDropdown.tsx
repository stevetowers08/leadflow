import { CelebrationModal } from '@/components/onboarding/CelebrationModal';
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import React, { useEffect, useMemo, useState } from 'react';
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

  // Initialize status from job data with useMemo to avoid setState in effect
  const initialStatus = useMemo(() => {
    if (job.client_jobs && job.client_jobs.length > 0) {
      return job.client_jobs[0].status || 'new';
    }
    return 'new';
  }, [job.client_jobs]);

  const [currentStatus, setCurrentStatus] = useState<string>(initialStatus);

  // Load current status from database when needed
  useEffect(() => {
    const loadStatus = async () => {
      if (!user?.id) return;

      try {
        const { data: clientUser } = await supabase
          .from('client_users')
          .select('client_id')
          .eq('user_id', user.id)
          .maybeSingle();

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
  }, [job.id, job.client_jobs, user?.id]);

  const handleStatusChange = async () => {
    // Track onboarding progress when qualifying
    const { data: clientUser } = await supabase
      .from('client_users')
      .select('client_id')
      .eq('user_id', user?.id)
      .maybeSingle();

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
      <UnifiedStatusDropdown
        entityId={job.id}
        entityType='jobs'
        currentStatus={currentStatus}
        availableStatuses={['new', 'qualify', 'skip']}
        variant='cell'
        onStatusChange={handleStatusChange}
      />

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
