/**
 * Celebration Modal - Minimal implementation
 * Shows success messages for key user achievements
 */

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, Sparkles } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  nextSteps?: string[];
  onContinue?: () => void;
  continueLabel?: string;
}

export function CelebrationModal({
  isOpen,
  onClose,
  title,
  description,
  nextSteps = [],
  onContinue,
  continueLabel = 'Continue',
}: CelebrationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
            <Sparkles className='h-8 w-8 text-green-600' />
          </div>
          <DialogTitle className='text-2xl'>{title}</DialogTitle>
          <DialogDescription className='text-base'>
            {description}
          </DialogDescription>
        </DialogHeader>

        {nextSteps.length > 0 && (
          <div className='space-y-2 py-4'>
            <p className='text-sm font-medium'>What's next:</p>
            <ul className='space-y-2'>
              {nextSteps.map((step, index) => (
                <li
                  key={index}
                  className='flex items-start gap-2 text-sm text-muted-foreground'
                >
                  <CheckCircle className='h-4 w-4 text-green-600 mt-0.5' />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter className='sm:justify-center'>
          <Button onClick={onContinue || onClose} className='w-full sm:w-auto'>
            {continueLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
