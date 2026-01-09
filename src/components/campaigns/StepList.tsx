import { CampaignStep } from '@/types/campaign.types';
import StepCard from './StepCard';

interface Props {
  steps: CampaignStep[];
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  onDeleteStep: (stepId: string) => void;
  loading: boolean;
}

export default function StepList({
  steps,
  selectedStepId,
  onSelectStep,
  onDeleteStep,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className='space-y-2'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-20 bg-muted rounded-lg animate-pulse' />
        ))}
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        <p className='text-sm mb-2'>No steps yet</p>
        <p className='text-xs'>Add your first step to get started</p>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {steps.map(step => (
        <StepCard
          key={step.id}
          step={step}
          isSelected={selectedStepId === step.id}
          onSelect={() => onSelectStep(step.id)}
          onDelete={() => onDeleteStep(step.id)}
        />
      ))}
    </div>
  );
}
