/**
 * Step Creation Modal
 * Modern modal for selecting step types with improved UX
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, GitBranch, Mail, Sparkles, Zap } from 'lucide-react';

interface StepType {
  id: 'email' | 'wait' | 'condition';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  popular?: boolean;
}

const STEP_TYPES: StepType[] = [
  {
    id: 'email',
    name: 'Email',
    description: 'Send personalised email to prospects',
    icon: <Mail className='w-5 h-5' />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    popular: true,
  },
  {
    id: 'wait',
    name: 'Wait',
    description: 'Pause sequence for specified duration',
    icon: <Clock className='w-5 h-5' />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'condition',
    name: 'If/Then',
    description: 'Add conditional logic to your sequence',
    icon: <GitBranch className='w-5 h-5' />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectStep: (stepType: 'email' | 'wait' | 'condition') => void;
}

export default function StepCreationModal({
  isOpen,
  onClose,
  onSelectStep,
}: Props) {
  const handleStepSelect = (stepType: 'email' | 'wait' | 'condition') => {
    onSelectStep(stepType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-blue-600' />
            Add New Step
          </DialogTitle>
          <DialogDescription>
            Choose the type of step you'd like to add to your campaign sequence.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 mt-6'>
          {STEP_TYPES.map(step => (
            <div
              key={step.id}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                hover:shadow-md group
                ${step.bgColor} border-transparent hover:border-gray-200
              `}
              onClick={() => handleStepSelect(step.id)}
            >
              {step.popular && (
                <Badge
                  variant='secondary'
                  className='absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                >
                  <Zap className='w-3 h-3 mr-1' />
                  Popular
                </Badge>
              )}

              <div className='flex items-start gap-3'>
                <div className={`p-2 rounded-lg ${step.bgColor} ${step.color}`}>
                  {step.icon}
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-gray-900 group-hover:text-gray-700'>
                    {step.name}
                  </h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    {step.description}
                  </p>
                </div>
              </div>

              <div className='mt-3 flex items-center justify-between'>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Calendar className='w-3 h-3' />
                  <span>Adds to timeline</span>
                </div>
                <Button
                  size='sm'
                  variant='ghost'
                  className='opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-end gap-3 mt-6 pt-4 border-t'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
