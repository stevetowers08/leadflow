import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConditionStep } from '@/types/campaign.types';

interface Props {
  step: ConditionStep;
  onUpdate: (updates: Partial<ConditionStep>) => Promise<void>;
}

export default function ConditionStepEditor({ step, onUpdate }: Props) {
  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='px-8 py-6 border-b border-gray-200'>
        <Input
          type='text'
          value={step.name}
          onChange={e => onUpdate({ name: e.target.value })}
          className='text-2xl font-semibold border-none focus:outline-none focus:ring-0 bg-transparent p-0 h-auto'
          placeholder='Condition Step Name'
        />
      </div>

      {/* Condition Configuration */}
      <div className='flex-1 overflow-y-auto px-8 py-6'>
        <div className='max-w-2xl space-y-6'>
          {/* Condition Type */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Condition Type
            </h3>

            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                What should trigger this condition?
              </Label>
              <Select
                value={step.condition_type || 'email_opened'}
                onValueChange={(
                  value:
                    | 'email_opened'
                    | 'email_clicked'
                    | 'email_replied'
                    | 'custom'
                ) => onUpdate({ condition_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='email_opened'>Email Opened</SelectItem>
                  <SelectItem value='email_clicked'>Email Clicked</SelectItem>
                  <SelectItem value='email_replied'>Email Replied</SelectItem>
                  <SelectItem value='custom'>Custom Condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Wait Duration */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Wait Settings
            </h3>

            <div>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Wait Duration (hours)
              </Label>
              <Input
                type='number'
                min='0'
                max='168'
                value={step.wait_duration || 24}
                onChange={e =>
                  onUpdate({ wait_duration: parseInt(e.target.value) || 24 })
                }
                placeholder='24'
              />
              <p className='mt-1 text-xs text-gray-500'>
                How long to wait before checking this condition (0-168 hours)
              </p>
            </div>
          </div>

          {/* Branch Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Branch Settings
            </h3>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  If condition is TRUE, go to step:
                </Label>
                <Select
                  value={step.true_next_step_id || ''}
                  onValueChange={value =>
                    onUpdate({ true_next_step_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select step...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>End sequence</SelectItem>
                    {/* This would be populated with actual steps */}
                    <SelectItem value='step-1'>Step 1</SelectItem>
                    <SelectItem value='step-2'>Step 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className='block text-sm font-medium text-gray-700 mb-2'>
                  If condition is FALSE, go to step:
                </Label>
                <Select
                  value={step.false_next_step_id || ''}
                  onValueChange={value =>
                    onUpdate({ false_next_step_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select step...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=''>End sequence</SelectItem>
                    {/* This would be populated with actual steps */}
                    <SelectItem value='step-1'>Step 1</SelectItem>
                    <SelectItem value='step-2'>Step 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
            <h4 className='text-sm font-semibold text-gray-900 mb-2'>
              Preview
            </h4>
            <p className='text-sm text-gray-600'>
              After waiting{' '}
              <span className='font-semibold'>
                {step.wait_duration || 24} hours
              </span>
              , check if the previous email was{' '}
              <span className='font-semibold'>
                {step.condition_type?.replace('_', ' ') || 'opened'}
              </span>
              . If true, continue to the next step. If false, follow the
              alternative path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
