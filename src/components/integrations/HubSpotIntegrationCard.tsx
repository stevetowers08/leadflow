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
import { HubSpotAuthService } from '@/services/hubspot/hubspotAuthService';
import { AlertCircle, CheckCircle, Link, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HubSpotConnectionStatus {
  connected: boolean;
  expiresAt?: string;
  isActive?: boolean;
}

export function HubSpotIntegrationCard() {
  const { user } = useAuth();
  const [status, setStatus] = useState<HubSpotConnectionStatus>({
    connected: false,
  });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    loadHubSpotStatus();
  }, []);

  const loadHubSpotStatus = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const connection = await HubSpotAuthService.getConnection(user.id);
      setStatus({
        connected: !!connection,
        expiresAt: connection?.expires_at,
        isActive: connection?.is_active,
      });
    } catch (error) {
      console.error('Error loading HubSpot status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectHubSpot = async () => {
    if (!user?.id) return;

    try {
      setConnecting(true);

      const clientId = import.meta.env.VITE_HUBSPOT_CLIENT_ID;
      const redirectUri = `${window.location.origin}/integrations/callback`;
      const scopes = [
        'crm.objects.contacts.read',
        'crm.objects.contacts.write',
        'crm.objects.companies.read',
        'crm.objects.companies.write',
        'crm.objects.deals.read',
        'crm.objects.deals.write',
      ];

      const authUrl = HubSpotAuthService.getAuthUrl(
        clientId,
        redirectUri,
        scopes
      );
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting HubSpot:', error);
      alert('Failed to initiate HubSpot connection. Please try again.');
      setConnecting(false);
    }
  };

  const handleDisconnectHubSpot = async () => {
    if (!user?.id) return;

    try {
      await HubSpotAuthService.disconnect(user.id);
      setStatus({ connected: false });
    } catch (error) {
      console.error('Error disconnecting HubSpot:', error);
      alert('Failed to disconnect HubSpot. Please try again.');
    }
  };

  const getStatusBadge = () => {
    if (status.connected && status.isActive) {
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
      return 'Sync contacts, companies, and deals between your CRM and HubSpot.';
    }
    return 'Connect your HubSpot account to sync contacts, companies, and deals bidirectionally.';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            HubSpot Integration
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
          <Users className='h-5 w-5' />
          HubSpot Integration
        </CardTitle>
        <CardDescription>{getStatusDescription()}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>Status</span>
          {getStatusBadge()}
        </div>

        {status.connected && (
          <div className='text-sm text-gray-600'>
            <p>✅ Contact synchronization</p>
            <p>✅ Company synchronization</p>
            <p>✅ Deal synchronization</p>
          </div>
        )}

        {status.connected ? (
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={handleDisconnectHubSpot}
              className='flex-1'
            >
              Disconnect
            </Button>
            <Button
              variant='outline'
              onClick={loadHubSpotStatus}
              className='flex-1'
            >
              <Link className='h-4 w-4 mr-2' />
              Refresh
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleConnectHubSpot}
            disabled={connecting}
            className='w-full'
          >
            {connecting ? 'Connecting...' : 'Connect HubSpot'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
