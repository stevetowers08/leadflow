import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

export const EmergencyDataAccess: React.FC = () => {
  return (
    <Card className='border-red-200 bg-red-50'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-red-800'>
          <Shield className='h-5 w-5' />
          Emergency Data Access
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>
            This component is for emergency data access scenarios only. Contact
            your system administrator for proper access.
          </AlertDescription>
        </Alert>

        <div className='text-sm text-muted-foreground'>
          This feature is currently not implemented. If you need emergency
          access, please contact your system administrator.
        </div>

        <Button variant='outline' disabled className='w-full'>
          Emergency Access Not Available
        </Button>
      </CardContent>
    </Card>
  );
};
