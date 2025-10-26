import { CelebrationModal } from '@/components/onboarding/CelebrationModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/database';
import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

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
          job_id: job.id,
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

      // Track onboarding progress
      if (value === 'qualify') {
        incrementJobsQualified();

        // Check if they've qualified 3 jobs - show celebration
        if (state.jobsQualifiedCount + 1 === 3) {
          markStepComplete('qualify_3_jobs');
          setShowCelebration(true);
        }
      }

      toast({
        title: 'Success',
        description: `Job status updated to ${value}`,
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

  const [currentStatus, setCurrentStatus] = useState<string>('new');

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
          .eq('job_id', job.id)
          .single();

        if (!error && data) {
          setCurrentStatus(data.status || 'new');
        }
      } catch (error) {
        console.error('Error checking qualification status:', error);
      }
    };

    checkStatus();
  }, [job.id, user?.id]);

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-gray-500';
      case 'qualify':
        return 'bg-green-500';
      case 'skip':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className='w-full h-6 px-2 border-0 bg-transparent hover:opacity-80 cursor-pointer rounded transition-opacity flex items-center justify-center'
          disabled={loading}
        >
          <div
            className={`w-3 h-3 rounded-full ${getStatusDotColor(currentStatus)}`}
          ></div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-32' align='start'>
        <DropdownMenuItem
          onClick={() => handleQualificationChange('new')}
          className='cursor-pointer'
        >
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-gray-500'></div>
            <span className='text-xs font-medium'>New</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleQualificationChange('qualify')}
          className='cursor-pointer'
        >
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-green-500'></div>
            <span className='text-xs font-medium'>Qualify</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleQualificationChange('skip')}
          className='cursor-pointer'
        >
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-red-500'></div>
            <span className='text-xs font-medium'>Skip</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Celebration Modal */}
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
    </DropdownMenu>
  );
};
