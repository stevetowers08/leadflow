'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LemlistIntegrationCard } from '@/components/integrations/LemlistIntegrationCard';
import { CheckCircle2, Mail, XCircle } from 'lucide-react';
import React from 'react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'pending';
  category: 'email' | 'messaging' | 'data';
}

const IntegrationsPage = () => {
  // Filter integrations - show Lemlist
  const integrations: Integration[] = [
    {
      id: 'lemlist',
      name: 'Lemlist',
      description: 'Connect Lemlist for email campaign automation',
      icon: <Mail className='h-5 w-5' />,
      status: 'disconnected', // Will be updated by LemlistIntegrationCard
      category: 'email',
    },
  ];

  const getCategoryColor = (category: Integration['category']) => {
    switch (category) {
      case 'email':
        return 'bg-primary/10 text-primary';
      case 'messaging':
        return 'bg-success/10 text-success';
      case 'data':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleConnect = async (integrationId: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
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
          <Badge variant='outline' className='border-green-500 text-success'>
            <CheckCircle2 className='h-3 w-3 mr-1' />
            Connected
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge
            variant='outline'
            className='border-border/60 text-muted-foreground'
          >
            <XCircle className='h-3 w-3 mr-1' />
            Disconnected
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant='outline' className='border-yellow-300 text-warning'>
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className='space-y-6 px-4 lg:px-6 py-6'>
      <div>
        <h2 className='text-xl font-semibold text-foreground mb-2'>
          Integrations
        </h2>
        <p className='text-sm text-muted-foreground'>
          Connect external services to enhance your CRM functionality
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Lemlist Integration */}
        <LemlistIntegrationCard />

        {/* Other integrations using card-based approach */}
        {integrations
          .filter(i => i.id !== 'lemlist')
          .map(integration => (
            <Card key={integration.id} className='transition-all'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center p-2'>
                    {integration.icon}
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
                    {integration.status === 'connected'
                      ? 'Configure'
                      : 'Connect'}
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
