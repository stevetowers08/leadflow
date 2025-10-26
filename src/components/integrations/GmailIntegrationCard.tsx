import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { getGmailStatus } from '@/services/gmailIntegrationService';
import { AlertCircle, CheckCircle, Clock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

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

      // This would typically trigger the Gmail OAuth flow
      // For now, we'll show a placeholder
      alert(
        'Gmail OAuth setup would be triggered here. This requires implementing the OAuth flow with proper access token handling.'
      );
    } catch (error) {
      console.error('Error setting up Gmail:', error);
    } finally {
      setSettingUp(false);
    }
  };

  const getStatusBadge = () => {
    if (status.connected) {
      if (status.expiringSoon) {
        return (
          <Badge variant='warning' className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            Expiring Soon
          </Badge>
        );
      }
      return (
        <Badge variant='success' className='flex items-center gap-1'>
          <CheckCircle className='h-3 w-3' />
          Connected
        </Badge>
      );
    }
    return (
      <Badge variant='secondary' className='flex items-center gap-1'>
        <AlertCircle className='h-3 w-3' />
        Not Connected
      </Badge>
    );
  };

  const getStatusDescription = () => {
    if (status.connected) {
      if (status.expiringSoon) {
        return `Watch expires on ${new Date(status.expirationDate!).toLocaleDateString()}. Automatic renewal is scheduled.`;
      }
      return `Connected to ${status.userEmail}. Reply detection is active.`;
    }
    return 'Connect your Gmail account to enable automatic reply detection and sentiment analysis.';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Mail className='h-5 w-5' />
            Gmail Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse'>
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
            <div className='h-3 bg-gray-200 rounded w-1/2'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Mail className='h-5 w-5' />
          Gmail Integration
        </CardTitle>
        <CardDescription>{getStatusDescription()}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>Status</span>
          {getStatusBadge()}
        </div>

        {status.connected && status.expirationDate && (
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Watch Expires</span>
            <span className='text-sm text-gray-600'>
              {new Date(status.expirationDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {!status.connected && (
          <Button
            onClick={handleSetupGmail}
            disabled={settingUp}
            className='w-full'
          >
            {settingUp ? 'Setting up...' : 'Connect Gmail Account'}
          </Button>
        )}

        {status.connected && (
          <div className='text-sm text-gray-600'>
            <p>✅ Reply detection active</p>
            <p>✅ Sentiment analysis enabled</p>
            <p>✅ Auto-progression configured</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
