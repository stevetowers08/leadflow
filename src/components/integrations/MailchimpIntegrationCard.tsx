import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { MailchimpAuthService } from '@/services/mailchimp/mailchimpAuthService';
import { AlertCircle, CheckCircle, Mail, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MailchimpConnectionStatus {
  connected: boolean;
  dataCenter?: string;
  isActive?: boolean;
  lastSyncedAt?: string;
}

export function MailchimpIntegrationCard() {
  const { user } = useAuth();
  const [status, setStatus] = useState<MailchimpConnectionStatus>({
    connected: false,
  });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [dataCenter, setDataCenter] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadMailchimpStatus();
  }, []);

  const loadMailchimpStatus = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const connection = await MailchimpAuthService.getConnection(user.id);
      setStatus({
        connected: !!connection,
        dataCenter: connection?.data_center,
        isActive: connection?.is_active,
        lastSyncedAt: connection?.last_synced_at,
      });
    } catch (error) {
      console.error('Error loading Mailchimp status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey || !dataCenter) {
      alert('Please enter API key and data center');
      return;
    }

    setTesting(true);
    try {
      const isValid = await MailchimpAuthService.testConnection(
        apiKey,
        dataCenter
      );
      if (isValid) {
        alert('✓ Connection successful!');
      } else {
        alert('✗ Connection failed. Please check your credentials.');
      }
    } catch (error) {
      alert('✗ Connection failed. Please check your credentials.');
    } finally {
      setTesting(false);
    }
  };

  const handleConnectMailchimp = async () => {
    if (!user?.id || !apiKey || !dataCenter) return;

    try {
      setConnecting(true);

      await MailchimpAuthService.saveConnection(user.id, {
        accessToken: apiKey,
        dataCenter: dataCenter,
      });

      setIsDialogOpen(false);
      setApiKey('');
      setDataCenter('');
      await loadMailchimpStatus();
    } catch (error) {
      console.error('Error connecting Mailchimp:', error);
      alert('Failed to connect Mailchimp. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectMailchimp = async () => {
    if (!user?.id) return;

    try {
      await MailchimpAuthService.disconnect(user.id);
      setStatus({ connected: false });
    } catch (error) {
      console.error('Error disconnecting Mailchimp:', error);
      alert('Failed to disconnect Mailchimp. Please try again.');
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
      return `Connected to ${status.dataCenter}. Sync contacts to Mailchimp lists.`;
    }
    return 'Connect your Mailchimp account to sync contacts and manage campaigns.';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Mail className='h-5 w-5' />
            Mailchimp Integration
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Mail className='h-5 w-5' />
            Mailchimp Integration
          </CardTitle>
          <CardDescription>{getStatusDescription()}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Status</span>
            {getStatusBadge()}
          </div>

          {status.connected && (
            <div className='text-sm text-muted-foreground'>
              <p>✅ Subscriber synchronization</p>
              <p>✅ Campaign management</p>
              <p>✅ Tag management</p>
            </div>
          )}

          {status.connected ? (
            <div className='flex gap-2'>
              <Button
                variant='outline'
                onClick={handleDisconnectMailchimp}
                className='flex-1'
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className='w-full'>
                  <Settings className='h-4 w-4 mr-2' />
                  Connect Mailchimp
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Mailchimp</DialogTitle>
                  <DialogDescription>
                    Enter your Mailchimp API key and data center to connect.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='apiKey'>API Key</Label>
                    <Input
                      id='apiKey'
                      type='password'
                      placeholder='Enter your Mailchimp API key'
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='dataCenter'>Data Center</Label>
                    <Input
                      id='dataCenter'
                      placeholder='e.g., us19'
                      value={dataCenter}
                      onChange={e => setDataCenter(e.target.value)}
                    />
                    <p className='text-xs text-muted-foreground'>
                      Find this in your Mailchimp account URL or API keys page
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={handleTestConnection}
                    disabled={testing || !apiKey || !dataCenter}
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </Button>
                  <Button
                    onClick={handleConnectMailchimp}
                    disabled={connecting || !apiKey || !dataCenter}
                  >
                    {connecting ? 'Connecting...' : 'Connect'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </>
  );
}
