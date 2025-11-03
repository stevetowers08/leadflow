import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getGmailStatus } from '@/services/gmailIntegrationService';
import { secureGmailService } from '@/services/secureGmailService';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface GmailIntegrationStatus {
  connected: boolean;
  expiringSoon: boolean;
  expirationDate?: string;
  userEmail?: string;
}

export function GmailIntegrationCard() {
  const { user } = useAuth();
  const [status, setStatus] = useState<GmailIntegrationStatus>({
    connected: false,
    expiringSoon: false,
  });
  const [loading, setLoading] = useState(true);
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    loadGmailStatus();
  }, []);

  const loadGmailStatus = async () => {
    try {
      setLoading(true);
      const gmailStatus = await getGmailStatus();
      setStatus(gmailStatus);
    } catch (error) {
      console.error('Error loading Gmail status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupGmail = async () => {
    if (!user) return;

    try {
      setSettingUp(true);

      // Initiate Gmail OAuth flow
      await secureGmailService.authenticateWithGmail();
    } catch (error) {
      console.error('Error setting up Gmail:', error);

      let errorMessage = 'Failed to connect Gmail. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;

        // Provide helpful guidance for common errors
        if (error.message.includes('NEXT_PUBLIC_GOOGLE_CLIENT_ID')) {
          errorMessage +=
            '\n\nPlease check your environment variables and ensure the Client ID is correctly configured in Google Cloud Console.';
        } else if (error.message.includes('Invalid Google Client ID')) {
          errorMessage +=
            '\n\nEnsure your Client ID ends with .apps.googleusercontent.com and has no trailing spaces.';
        }
      }

      toast.error('Gmail Connection Failed', {
        description: errorMessage,
        duration: 8000,
      });
      setSettingUp(false);
    }
  };

  const getStatusDescription = () => {
    if (status.connected) {
      return status.userEmail || 'Your Gmail account is connected';
    }
    return 'Connect your Gmail to send emails and track replies';
  };

  if (loading) {
    return (
      <Card className='border-border'>
        <CardContent className='p-6'>
          <div className='flex items-center gap-3'>
            <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
            <div className='flex-1'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border-border hover:border-primary/50 transition-colors'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          {/* Gmail Official Logo */}
          <div className='flex-shrink-0 w-12 h-12 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2'>
            <img
              src='/gmail-logo.svg'
              alt='Gmail'
              className='w-full h-full object-contain'
            />
          </div>
          <div className='flex-1 min-w-0'>
            <CardTitle className='text-base font-semibold'>Gmail</CardTitle>
            <CardDescription className='text-sm text-muted-foreground mt-1'>
              {getStatusDescription()}
            </CardDescription>
          </div>
          {status.connected && (
            <Badge
              variant='success'
              className='flex items-center gap-1.5 flex-shrink-0'
            >
              <CheckCircle2 className='h-3 w-3' />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      {!status.connected && (
        <CardContent className='pt-0'>
          <div className='flex justify-end'>
            <Button
              onClick={handleSetupGmail}
              disabled={settingUp}
              size='default'
            >
              {settingUp ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>
        </CardContent>
      )}
      {status.connected && status.userEmail && (
        <CardContent className='pt-0'>
          <p className='text-sm text-muted-foreground'>{status.userEmail}</p>
        </CardContent>
      )}
    </Card>
  );
}
