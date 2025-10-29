import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { secureGmailService } from '@/services/secureGmailService';
import { Calendar, CheckCircle2, Mail, Users, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  category: 'email' | 'messaging' | 'calendar' | 'data';
}

const IntegrationsPage = () => {
  const [gmailConnected, setGmailConnected] = useState(false);

  const checkGmailStatus = useCallback(async () => {
    try {
      const connected = await secureGmailService.isGmailConnected();
      setGmailConnected(connected);
    } catch (error) {
      console.error('Error checking Gmail status:', error);
    }
  }, []);

  useEffect(() => {
    void checkGmailStatus();
  }, [checkGmailStatus]);

  const integrations: Integration[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Connect your Gmail account to send and receive emails',
      icon: <Mail className='h-5 w-5' />,
      status: gmailConnected ? 'connected' : 'disconnected',
      category: 'email',
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync your calendar for meeting scheduling',
      icon: <Calendar className='h-5 w-5' />,
      status: 'disconnected',
      category: 'calendar',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Sync contacts, companies, and deals bidirectionally',
      icon: <Users className='h-5 w-5' />,
      status: 'disconnected',
      category: 'data',
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Sync contacts and manage marketing campaigns',
      icon: <Mail className='h-5 w-5' />,
      status: 'disconnected',
      category: 'email',
    },
  ];

  const getCategoryColor = (category: Integration['category']) => {
    switch (category) {
      case 'email':
        return 'bg-blue-100 text-blue-700';
      case 'messaging':
        return 'bg-green-100 text-green-700';
      case 'calendar':
        return 'bg-purple-100 text-purple-700';
      case 'data':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleConnect = async (integrationId: string) => {
    try {
      switch (integrationId) {
        case 'gmail':
          await secureGmailService.authenticateWithGmail();
          // Refresh status after connection
          await checkGmailStatus();
          break;
        case 'google-calendar':
          // TODO: Implement Google Calendar connection
          console.log('Google Calendar connection not yet implemented');
          alert('Google Calendar integration coming soon!');
          break;
        case 'hubspot':
          // TODO: Implement HubSpot connection
          console.log('HubSpot connection not yet implemented');
          alert('HubSpot integration coming soon!');
          break;
        case 'mailchimp':
          // TODO: Implement Mailchimp connection
          console.log('Mailchimp connection not yet implemented');
          alert('Mailchimp integration coming soon!');
          break;
        default:
          console.log('Unknown integration:', integrationId);
      }
    } catch (error) {
      console.error('Error connecting integration:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to connect integration. Please try again.'
      );
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant='outline' className='border-green-500 text-green-700'>
            <CheckCircle2 className='h-3 w-3 mr-1' />
            Connected
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant='outline' className='border-gray-300 text-gray-600'>
            <XCircle className='h-3 w-3 mr-1' />
            Disconnected
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant='outline'
            className='border-yellow-300 text-yellow-600'
          >
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          Integrations
        </h2>
        <p className='text-sm text-gray-600'>
          Connect external services to enhance your CRM functionality
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {integrations.map(integration => (
          <Card
            key={integration.id}
            className='hover:border-primary/50 transition-colors'
          >
            <CardHeader className='pb-4'>
              <div className='flex items-center gap-3'>
                {/* Integration Logo */}
                <div className='flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center p-2'>
                  {integration.id === 'gmail' && (
                    <img
                      src='/gmail-logo.svg'
                      alt='Gmail'
                      className='w-full h-full object-contain'
                    />
                  )}
                  {integration.id === 'google-calendar' && (
                    <img
                      src='/google-calendar-logo.svg'
                      alt='Google Calendar'
                      className='w-full h-full object-contain'
                    />
                  )}
                  {integration.id === 'hubspot' && (
                    <img
                      src='/hubspot-logo.svg'
                      alt='HubSpot'
                      className='w-full h-full object-contain'
                    />
                  )}
                  {integration.id === 'mailchimp' && (
                    <img
                      src='/mailchimp-logo.svg'
                      alt='Mailchimp'
                      className='w-full h-full object-contain'
                    />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <CardTitle className='text-base font-semibold'>
                    {integration.name}
                  </CardTitle>
                  <CardDescription className='text-sm text-muted-foreground'>
                    {integration.description}
                  </CardDescription>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='flex items-center justify-between'>
                <Badge
                  variant='secondary'
                  className={getCategoryColor(integration.category)}
                >
                  {integration.category}
                </Badge>
                <Button
                  size='default'
                  variant={
                    integration.status === 'connected' ? 'outline' : 'default'
                  }
                  onClick={() => handleConnect(integration.id)}
                >
                  {integration.status === 'connected' ? 'Configure' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
