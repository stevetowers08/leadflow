// src/components/jobFiltering/modals/JobTitlesModal.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface JobTitlesModalProps {
  selectedTitles: string[];
  onSave: (titles: string[]) => void;
  onCancel: () => void;
}

export function JobTitlesModal({
  selectedTitles,
  onSave,
  onCancel,
}: JobTitlesModalProps) {
  const [titles, setTitles] = useState<string[]>(selectedTitles);
  const [newTitle, setNewTitle] = useState('');

  const handleAddTitle = () => {
    if (newTitle.trim() && !titles.includes(newTitle.trim())) {
      setTitles(prev => [...prev, newTitle.trim()]);
      setNewTitle('');
    }
  };

  const handleRemoveTitle = (titleToRemove: string) => {
    setTitles(prev => prev.filter(title => title !== titleToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTitle();
    }
  };

  const handleSave = () => {
    onSave(titles);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add Target Job Titles</DialogTitle>
          <DialogDescription>
            Add job titles you want to target for discovery. These will be used
            to match job postings.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='flex gap-2'>
            <Input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='e.g., Software Engineer'
              className='flex-1'
            />
            <Button onClick={handleAddTitle} size='sm' className='gap-2'>
              <Plus className='h-4 w-4' />
              Add
            </Button>
          </div>

          {titles.length > 0 && (
            <div>
              <Label className='text-sm font-medium mb-2 block'>
                Selected Job Titles ({titles.length})
              </Label>
              <div className='flex flex-wrap gap-2'>
                {titles.map((title, index) => (
                  <Badge key={index} variant='outline' className='gap-1'>
                    {title}
                    <button
                      onClick={() => handleRemoveTitle(title)}
                      className='hover:bg-gray-200 rounded-full p-0.5'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save ({titles.length} titles)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
