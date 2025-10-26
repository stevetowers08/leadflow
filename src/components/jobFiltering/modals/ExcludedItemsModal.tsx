// src/components/jobFiltering/modals/ExcludedItemsModal.tsx

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface ExcludedItemsModalProps {
  excludedIndustries: string[];
  excludedKeywords: string[];
  onSave: (industries: string[], keywords: string[]) => void;
  onCancel: () => void;
}

export function ExcludedItemsModal({
  excludedIndustries,
  excludedKeywords,
  onSave,
  onCancel,
}: ExcludedItemsModalProps) {
  const [industries, setIndustries] = useState<string[]>(excludedIndustries);
  const [keywords, setKeywords] = useState<string[]>(excludedKeywords);
  const [newIndustry, setNewIndustry] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddIndustry = () => {
    if (newIndustry.trim() && !industries.includes(newIndustry.trim())) {
      setIndustries(prev => [...prev, newIndustry.trim()]);
      setNewIndustry('');
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords(prev => [...prev, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveIndustry = (industryToRemove: string) => {
    setIndustries(prev =>
      prev.filter(industry => industry !== industryToRemove)
    );
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(prev => prev.filter(keyword => keyword !== keywordToRemove));
  };

  const handleKeyPressIndustry = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIndustry();
    }
  };

  const handleKeyPressKeyword = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSave = () => {
    onSave(industries, keywords);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Add Excluded Industries &amp; Keywords</DialogTitle>
          <DialogDescription>
            Add industries and keywords to exclude from job discovery results.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='industries' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='industries'>Excluded Industries</TabsTrigger>
            <TabsTrigger value='keywords'>Excluded Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value='industries' className='space-y-4 py-4'>
            <div className='flex gap-2'>
              <Input
                value={newIndustry}
                onChange={e => setNewIndustry(e.target.value)}
                onKeyPress={handleKeyPressIndustry}
                placeholder='e.g., Healthcare'
                className='flex-1'
              />
              <Button onClick={handleAddIndustry} size='sm' className='gap-2'>
                <Plus className='h-4 w-4' />
                Add
              </Button>
            </div>

            {industries.length > 0 && (
              <div>
                <Label className='text-sm font-medium mb-2 block'>
                  Excluded Industries ({industries.length})
                </Label>
                <div className='flex flex-wrap gap-2'>
                  {industries.map((industry, index) => (
                    <Badge key={index} variant='destructive' className='gap-1'>
                      {industry}
                      <button
                        onClick={() => handleRemoveIndustry(industry)}
                        className='hover:bg-red-600 rounded-full p-0.5'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value='keywords' className='space-y-4 py-4'>
            <div className='flex gap-2'>
              <Input
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                onKeyPress={handleKeyPressKeyword}
                placeholder='e.g., PHP, WordPress'
                className='flex-1'
              />
              <Button onClick={handleAddKeyword} size='sm' className='gap-2'>
                <Plus className='h-4 w-4' />
                Add
              </Button>
            </div>

            {keywords.length > 0 && (
              <div>
                <Label className='text-sm font-medium mb-2 block'>
                  Excluded Keywords ({keywords.length})
                </Label>
                <div className='flex flex-wrap gap-2'>
                  {keywords.map((keyword, index) => (
                    <Badge key={index} variant='destructive' className='gap-1'>
                      {keyword}
                      <button
                        onClick={() => handleRemoveKeyword(keyword)}
                        className='hover:bg-red-600 rounded-full p-0.5'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save ({industries.length + keywords.length} exclusions)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
