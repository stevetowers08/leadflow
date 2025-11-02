'use client';

import { CelebrationModal } from '@/components/onboarding/CelebrationModal';
import { UnifiedStatusDropdown } from '@/components/shared/UnifiedStatusDropdown';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Job } from '@/types/database';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface JobQualificationTableDropdownProps {
  job: Job;
  onStatusChange?: () => void;
}

// Define status array as constant to prevent recreation on every render
const JOB_STATUS_OPTIONS: string[] = ['new', 'qualify', 'skip'];

const JobQualificationTableDropdownComponent: React.FC<
  JobQualificationTableDropdownProps
> = ({ job, onStatusChange }) => {
  const router = useRouter();
  const { state, incrementJobsQualified, markStepComplete } = useOnboarding();
  const [showCelebration, setShowCelebration] = useState(false);

  // Get current status from job data (no local state needed)
  const currentStatus = useMemo(() => {
    return job.client_jobs?.[0]?.status || 'new';
  }, [job.client_jobs]);

  const handleStatusChange = () => {
    // Track onboarding progress when qualifying
    if (currentStatus === 'qualify') {
      incrementJobsQualified();
      if (state.jobsQualifiedCount + 1 === 3) {
        markStepComplete('qualify_3_jobs');
        setShowCelebration(true);
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
        availableStatuses={JOB_STATUS_OPTIONS}
        variant='cell'
        onStatusChange={handleStatusChange}
      />

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
    </>
  );
};

// Memoize component to prevent re-renders when parent re-renders
export const JobQualificationTableDropdown = React.memo(
  JobQualificationTableDropdownComponent
);
