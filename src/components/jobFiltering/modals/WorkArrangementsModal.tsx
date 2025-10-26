// src/components/jobFiltering/modals/WorkArrangementsModal.tsx

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { WORK_ARRANGEMENTS } from '@/types/jobFiltering';
import { useState } from 'react';

interface WorkArrangementsModalProps {
  selectedArrangements: string[];
  onSave: (arrangements: string[]) => void;
  onCancel: () => void;
}

export function WorkArrangementsModal({
  selectedArrangements,
  onSave,
  onCancel,
}: WorkArrangementsModalProps) {
  const [arrangements, setArrangements] =
    useState<string[]>(selectedArrangements);

  const handleToggleArrangement = (arrangement: string) => {
    setArrangements(prev =>
      prev.includes(arrangement)
        ? prev.filter(a => a !== arrangement)
        : [...prev, arrangement]
    );
  };

  const handleSave = () => {
    onSave(arrangements);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Select Work Arrangements</DialogTitle>
          <DialogDescription>
            Choose the work arrangements you want to target for job discovery.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {WORK_ARRANGEMENTS.map(arrangement => (
            <div
              key={arrangement.value}
              className='flex items-center space-x-2'
            >
              <Checkbox
                id={arrangement.value}
                checked={arrangements.includes(arrangement.value)}
                onCheckedChange={() =>
                  handleToggleArrangement(arrangement.value)
                }
              />
              <Label
                htmlFor={arrangement.value}
                className='text-sm font-medium'
              >
                {arrangement.label}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save ({arrangements.length} selected)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
