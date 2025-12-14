import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CampaignStep } from '@/types/campaign.types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, GitBranch, GripVertical, Mail, Trash2 } from 'lucide-react';

interface Props {
  step: CampaignStep;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function StepCard({
  step,
  isSelected,
  onSelect,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStepIcon = () => {
    switch (step.step_type) {
      case 'email':
        return <Mail className='w-4 h-4 text-primary' />;
      case 'wait':
        return <Clock className='w-4 h-4 text-warning' />;
      case 'condition':
        return <GitBranch className='w-4 h-4 text-primary' />;
    }
  };

  const getStepDetails = () => {
    switch (step.step_type) {
      case 'email':
        return step.email_subject || 'No subject';
      case 'wait':
        return `Wait ${step.wait_duration} ${step.wait_unit}`;
      case 'condition':
        return step.condition_type?.replace('_', ' ') || 'No condition';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative rounded-lg border-2 transition-all cursor-pointer',
        isSelected
          ? 'ring-2 ring-primary border-primary bg-primary/10'
          : 'border-border bg-background hover:border-border/60'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className='absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing'
      >
        <GripVertical className='w-4 h-4 text-muted-foreground' />
      </div>

      {/* Card Content */}
      <div className='pl-8 pr-3 py-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-start gap-2 flex-1 min-w-0'>
            {getStepIcon()}
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium text-foreground truncate'>
                {step.name}
              </div>
              <div className='text-xs text-muted-foreground truncate mt-0.5'>
                {getStepDetails()}
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <Button
            variant='ghost'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              if (confirm('Delete this step?')) onDelete();
            }}
            className='p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
          >
            <Trash2 className='w-3.5 h-3.5' />
          </Button>
        </div>
      </div>

      {/* Step Number Badge */}
      <div className='absolute -top-2 -left-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-semibold flex items-center justify-center'>
        {step.order_position}
      </div>
    </div>
  );
}
