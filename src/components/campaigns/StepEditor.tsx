import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BaseStep } from '@/types/campaign.types';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  MoreHorizontal,
  Plus,
  Redo,
  Smile,
  Underline,
  Undo,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface StepEditorProps {
  step: BaseStep;
  onUpdate: (stepId: string, updates: Partial<BaseStep>) => Promise<void>;
}

export default function StepEditor({ step, onUpdate }: StepEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState(24);

  const handleAutoSave = useCallback(async () => {
    // Implement auto-save logic here
    console.log('Auto-saving step:', step.id);
  }, [step.id]);

  // Auto-save countdown effect
  useEffect(() => {
    if (isEditing) {
      const interval = setInterval(() => {
        setAutoSaveCountdown(prev => {
          if (prev <= 1) {
            // Trigger auto-save
            handleAutoSave();
            return 24; // Reset countdown
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isEditing, handleAutoSave]);

  const handleSave = async () => {
    try {
      await onUpdate(step.id, {});
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save step:', error);
    }
  };

  const getStepTitle = () => {
    switch (step.step_type) {
      case 'email':
        return 'Email Sequence';
      case 'wait':
        return 'Wait Sequence';
      case 'condition':
        return 'Condition Sequence';
      default:
        return 'Manual Sequence';
    }
  };

  const getStepNumber = () => {
    // This would need to be passed from parent or calculated
    return 3; // For now, hardcoded as shown in screenshot
  };

  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='border-b border-border px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-foreground'>
            Stage {getStepNumber()}: {getStepTitle()}
          </h2>
          <span className='text-sm text-muted-foreground capitalize'>
            {step.step_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 p-6 space-y-6'>
        {/* Title Field */}
        <div className='space-y-2'>
          <Label
            htmlFor='step-title'
            className='text-sm font-medium text-foreground'
          >
            Title
          </Label>
          <Input
            id='step-title'
            placeholder='Enter step title...'
            className='text-lg'
            onFocus={() => setIsEditing(true)}
          />
        </div>

        {/* Task Description */}
        <div className='space-y-2'>
          <Label
            htmlFor='task-description'
            className='text-sm font-medium text-foreground'
          >
            Task Description
          </Label>

          {/* Rich Text Editor Toolbar */}
          <div className='border border-border/60 rounded-t-lg bg-muted px-3 py-2 flex items-center gap-2'>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <Bold className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <Italic className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <Underline className='w-4 h-4' />
            </Button>

            <div className='w-px h-4 bg-border mx-1' />

            <Button variant='ghost' size='sm' className='p-1.5'>
              <span className='text-sm font-mono'>{'{}'}</span>
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <span className='text-sm'>📄</span>
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <span className='text-sm'>A:</span>
            </Button>

            <div className='w-px h-4 bg-border mx-1' />

            <Button variant='ghost' size='sm' className='p-1.5'>
              <Image className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <Link className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <Smile className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <Plus className='w-4 h-4' />
            </Button>

            <div className='w-px h-4 bg-border mx-1' />

            <Button variant='ghost' size='sm' className='p-1.5'>
              <AlignLeft className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <AlignCenter className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <AlignRight className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <AlignJustify className='w-4 h-4' />
            </Button>

            <div className='w-px h-4 bg-border mx-1' />

            <Button variant='ghost' size='sm' className='p-1.5'>
              <List className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <ListOrdered className='w-4 h-4' />
            </Button>

            <div className='w-px h-4 bg-border mx-1' />

            <Button variant='ghost' size='sm' className='p-1.5'>
              <span className='text-sm'>¶</span>
            </Button>

            <div className='w-px h-4 bg-border mx-1' />

            <Button variant='ghost' size='sm' className='p-1.5'>
              <Undo className='w-4 h-4' />
            </Button>
            <Button variant='ghost' size='sm' className='p-1.5'>
              <Redo className='w-4 h-4' />
            </Button>

            <div className='w-px h-4 bg-border mx-1' />

            <Button variant='ghost' size='sm' className='p-1.5'>
              <MoreHorizontal className='w-4 h-4' />
            </Button>
          </div>

          {/* Text Area */}
          <Textarea
            id='task-description'
            placeholder='Enter your task description here...'
            className='min-h-[300px] border-t-0 rounded-t-none resize-none'
            onFocus={() => setIsEditing(true)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className='border-t border-border px-6 py-4 bg-muted'>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            {isEditing ? (
              <>Save Changes (Auto-saving in {autoSaveCountdown}s)</>
            ) : (
              <>All changes saved</>
            )}
          </div>
          <Button
            onClick={handleSave}
            className='bg-purple-600 hover:bg-purple-700 text-white'
          >
            Save & Next
          </Button>
        </div>
      </div>
    </div>
  );
}
