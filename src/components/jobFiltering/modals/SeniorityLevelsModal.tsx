// src/components/jobFiltering/modals/SeniorityLevelsModal.tsx

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
import { SENIORITY_LEVELS } from '@/types/jobFiltering';
import { useState } from 'react';

interface SeniorityLevelsModalProps {
  selectedLevels: string[];
  onSave: (levels: string[]) => void;
  onCancel: () => void;
}

export function SeniorityLevelsModal({
  selectedLevels,
  onSave,
  onCancel,
}: SeniorityLevelsModalProps) {
  const [levels, setLevels] = useState<string[]>(selectedLevels);

  const handleToggleLevel = (level: string) => {
    setLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const handleSave = () => {
    onSave(levels);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Select Seniority Levels</DialogTitle>
          <DialogDescription>
            Choose the experience levels you want to target for job discovery.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {SENIORITY_LEVELS.map(level => (
            <div key={level.value} className='flex items-center space-x-2'>
              <Checkbox
                id={level.value}
                checked={levels.includes(level.value)}
                onCheckedChange={() => handleToggleLevel(level.value)}
              />
              <Label htmlFor={level.value} className='text-sm font-medium'>
                {level.label}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save ({levels.length} selected)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
