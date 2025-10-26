import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Calendar,
  CheckCircle2,
  Database,
  Mail,
  MessageSquare,
  Plug,
  XCircle,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  category: 'email' | 'messaging' | 'calendar' | 'data';
}

const IntegrationsPage = () => {
  const integrations: Integration[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Connect your Gmail account to send and receive emails',
      icon: <Mail className='h-5 w-5' />,
      status: 'disconnected',
      category: 'email',
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Database and authentication backend',
      icon: <Database className='h-5 w-5' />,
      status: 'connected',
      category: 'data',
    },
    {
      id: 'email-templates',
      name: 'Email Templates',
      description: 'Manage your email templates and sequences',
      icon: <MessageSquare className='h-5 w-5' />,
      status: 'disconnected',
      category: 'messaging',
    },
    {
      id: 'calendar',
      name: 'Calendar Sync',
      description: 'Sync your calendar for meeting scheduling',
      icon: <Calendar className='h-5 w-5' />,
      status: 'disconnected',
      category: 'calendar',
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

  const handleConnect = (integrationId: string) => {
    // TODO: Implement actual integration connection logic
    console.log('Connecting to:', integrationId);
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
          <Card key={integration.id}>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-gray-100 p-2'>
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className='text-base'>
                      {integration.name}
                    </CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <Badge
                  variant='secondary'
                  className={getCategoryColor(integration.category)}
                >
                  {integration.category}
                </Badge>
                <Button
                  size='sm'
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

      <Alert>
        <Plug className='h-4 w-4' />
        <AlertDescription>
          More integrations are coming soon. Contact support to request
          additional integrations.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default IntegrationsPage;
