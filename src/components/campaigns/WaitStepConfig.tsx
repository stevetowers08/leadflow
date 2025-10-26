/**
 * Enhanced Wait Step Configuration
 * Modern UI for configuring wait steps with better UX
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Info, Moon, Sun, Zap } from 'lucide-react';

interface WaitStepConfig {
  duration: number;
  unit: 'minutes' | 'hours' | 'days' | 'weeks';
  businessHoursOnly: boolean;
  timezone?: string;
}

interface Props {
  config: WaitStepConfig;
  onChange: (config: WaitStepConfig) => void;
}

const TIME_UNITS = [
  { value: 'minutes', label: 'Minutes', icon: <Clock className='w-4 h-4' /> },
  { value: 'hours', label: 'Hours', icon: <Clock className='w-4 h-4' /> },
  { value: 'days', label: 'Days', icon: <Calendar className='w-4 h-4' /> },
  { value: 'weeks', label: 'Weeks', icon: <Calendar className='w-4 h-4' /> },
];

const QUICK_PRESETS = [
  { label: '1 Hour', duration: 1, unit: 'hours' as const },
  { label: '4 Hours', duration: 4, unit: 'hours' as const },
  { label: '1 Day', duration: 1, unit: 'days' as const },
  { label: '2 Days', duration: 2, unit: 'days' as const },
  { label: '1 Week', duration: 1, unit: 'weeks' as const },
];

export default function WaitStepConfig({ config, onChange }: Props) {
  const handlePresetSelect = (preset: (typeof QUICK_PRESETS)[0]) => {
    onChange({
      ...config,
      duration: preset.duration,
      unit: preset.unit,
    });
  };

  const getWaitDescription = () => {
    const { duration, unit, businessHoursOnly } = config;
    let description = `Wait for ${duration} ${unit}`;

    if (businessHoursOnly) {
      description += ' (business hours only)';
    }

    return description;
  };

  return (
    <div className='space-y-6'>
      {/* Quick Presets */}
      <div>
        <Label className='text-sm font-medium text-gray-700 mb-3 block'>
          Quick Presets
        </Label>
        <div className='flex flex-wrap gap-2'>
          {QUICK_PRESETS.map(preset => (
            <Button
              key={preset.label}
              variant='outline'
              size='sm'
              onClick={() => handlePresetSelect(preset)}
              className={`
                text-xs transition-all duration-200
                ${
                  config.duration === preset.duration &&
                  config.unit === preset.unit
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'hover:bg-gray-50'
                }
              `}
            >
              <Zap className='w-3 h-3 mr-1' />
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Configuration */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium flex items-center gap-2'>
            <Clock className='w-4 h-4' />
            Custom Wait Duration
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='wait-duration'>Duration</Label>
              <Input
                id='wait-duration'
                type='number'
                min='1'
                max='365'
                value={config.duration}
                onChange={e =>
                  onChange({
                    ...config,
                    duration: parseInt(e.target.value) || 1,
                  })
                }
                className='text-center'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='wait-unit'>Unit</Label>
              <Select
                value={config.unit}
                onValueChange={(unit: string) => onChange({ ...config, unit })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_UNITS.map(unit => (
                    <SelectItem key={unit.value} value={unit.value}>
                      <div className='flex items-center gap-2'>
                        {unit.icon}
                        {unit.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Business Hours Toggle */}
          <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Sun className='w-4 h-4 text-yellow-500' />
                <Moon className='w-4 h-4 text-blue-500' />
              </div>
              <div>
                <Label htmlFor='business-hours' className='text-sm font-medium'>
                  Business Hours Only
                </Label>
                <p className='text-xs text-gray-600'>
                  Only count business hours (9 AM - 5 PM)
                </p>
              </div>
            </div>
            <Switch
              id='business-hours'
              checked={config.businessHoursOnly}
              onCheckedChange={checked =>
                onChange({ ...config, businessHoursOnly: checked })
              }
            />
          </div>

          {/* Preview */}
          <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
            <div className='flex items-center gap-2 text-sm text-blue-800'>
              <Info className='w-4 h-4' />
              <span className='font-medium'>Wait Configuration:</span>
            </div>
            <p className='text-sm text-blue-700 mt-1'>{getWaitDescription()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours Info */}
      {config.businessHoursOnly && (
        <div className='p-3 bg-amber-50 rounded-lg border border-amber-200'>
          <div className='flex items-start gap-2'>
            <Info className='w-4 h-4 text-amber-600 mt-0.5' />
            <div className='text-sm text-amber-800'>
              <p className='font-medium'>Business Hours Mode</p>
              <p className='text-xs mt-1'>
                The wait will only count during business hours (Monday-Friday, 9
                AM - 5 PM). Weekends and holidays are automatically excluded.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
