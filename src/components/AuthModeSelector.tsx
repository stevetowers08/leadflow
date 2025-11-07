import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogIn, User } from 'lucide-react';

interface AuthModeSelectorProps {
  onSelectMode: (mode: 'normal' | 'bypass') => void;
}

export const AuthModeSelector: React.FC<AuthModeSelectorProps> = ({
  onSelectMode,
}) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-muted px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>
            Welcome to Empowr CRM
          </CardTitle>
          <CardDescription>
            Choose your authentication mode to continue
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button
            onClick={() => onSelectMode('normal')}
            className='w-full'
            size='lg'
          >
            <LogIn className='mr-2 h-4 w-4' />
            Normal Authentication
          </Button>
          <Button
            onClick={() => onSelectMode('bypass')}
            variant='outline'
            className='w-full'
            size='lg'
          >
            <User className='mr-2 h-4 w-4' />
            Bypass Authentication
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
