import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WaitStep } from '@/types/campaign.types';

interface Props {
  step: WaitStep;
  onUpdate: (updates: Partial<WaitStep>) => Promise<void>;
}

export default function WaitStepEditor({ step, onUpdate }: Props) {
  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='px-8 py-6 border-b border-border'>
        <Input
          type='text'
          value={step.name}
          onChange={e => onUpdate({ name: e.target.value })}
          className='text-2xl font-semibold border-none focus:outline-none focus:ring-0 bg-transparent p-0 h-auto'
          placeholder='Wait Step Name'
        />
      </div>

      {/* Wait Configuration */}
      <div className='flex-1 overflow-y-auto px-8 py-6'>
        <div className='max-w-2xl space-y-6'>
          {/* Duration Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground'>
              Wait Duration
            </h3>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='block text-sm font-medium text-foreground mb-2'>
                  Duration Value
                </Label>
                <Input
                  type='number'
                  min='1'
                  value={step.wait_duration || 1}
                  onChange={e =>
                    onUpdate({ wait_duration: parseInt(e.target.value) || 1 })
                  }
                  placeholder='1'
                />
              </div>

              <div>
                <Label className='block text-sm font-medium text-foreground mb-2'>
                  Duration Unit
                </Label>
                <Select
                  value={step.wait_unit || 'days'}
                  onValueChange={(value: 'hours' | 'days' | 'weeks') =>
                    onUpdate({ wait_unit: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='hours'>Hours</SelectItem>
                    <SelectItem value='days'>Days</SelectItem>
                    <SelectItem value='weeks'>Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Business Hours Settings */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-foreground'>
              Timing Settings
            </h3>

            <div className='space-y-3'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={step.business_hours_only || false}
                  onChange={e =>
                    onUpdate({ business_hours_only: e.target.checked })
                  }
                  className='rounded border-border/60 text-primary focus:ring-blue-500'
                />
                <span className='text-sm text-foreground'>
                  Only count business hours (9 AM - 5 PM, Monday-Friday)
                </span>
              </label>
            </div>

            <div>
              <Label className='block text-sm font-medium text-foreground mb-2'>
                Timezone
              </Label>
              <Select
                value={step.timezone || 'UTC'}
                onValueChange={value => onUpdate({ timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='UTC'>UTC</SelectItem>
                  <SelectItem value='America/New_York'>Eastern Time</SelectItem>
                  <SelectItem value='America/Chicago'>Central Time</SelectItem>
                  <SelectItem value='America/Denver'>Mountain Time</SelectItem>
                  <SelectItem value='America/Los_Angeles'>
                    Pacific Time
                  </SelectItem>
                  <SelectItem value='Europe/London'>London</SelectItem>
                  <SelectItem value='Europe/Paris'>Paris</SelectItem>
                  <SelectItem value='Asia/Tokyo'>Tokyo</SelectItem>
                  <SelectItem value='Australia/Sydney'>Sydney</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className='border border-border rounded-lg p-4 bg-muted'>
            <h4 className='text-sm font-semibold text-foreground mb-2'>
              Preview
            </h4>
            <p className='text-sm text-muted-foreground'>
              This step will wait for{' '}
              <span className='font-semibold'>
                {step.wait_duration || 1} {step.wait_unit || 'days'}
              </span>
              {step.business_hours_only && ' (business hours only)'} before
              proceeding to the next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
