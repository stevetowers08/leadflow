/**
 * Onboarding Dashboard - Setup & Getting Started
 *
 * Features:
 * - Step-by-step setup flow
 * - Integration connection cards
 * - Setup guides and documentation
 * - Progress tracking
 * - Modern, clean design matching app aesthetic
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActionCard, ModernCard } from '@/components/ui/modern-cards';
import { Progress } from '@/components/ui/progress';
import { Page } from '@/design-system/components';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  Circle,
  Clock,
  Mail,
  Play,
  Settings,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  inProgress: boolean;
  action?: () => void;
  externalLink?: string;
}

interface IntegrationCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'not_connected' | 'pending';
  action?: () => void;
  externalLink?: string;
}

export default function OnboardingDashboard() {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Mock data - in real app, this would come from user profile/settings
  const [integrations, setIntegrations] = useState<IntegrationCard[]>([
    {
      id: 'gmail',
      title: 'Gmail Integration',
      description:
        'Connect your Gmail account for email automation and reply tracking',
      icon: Mail,
      status: 'not_connected',
      action: () => navigate('/crm/communications'),
    },
    {
      id: 'crm',
      title: 'CRM Setup',
      description: 'Configure your CRM settings and user permissions',
      icon: Building2,
      status: 'not_connected',
      action: () => navigate('/settings'),
    },
    {
      id: 'automation',
      title: 'Automation Tools',
      description: 'Set up n8n workflows and automation sequences',
      icon: Zap,
      status: 'not_connected',
      action: () => navigate('/campaigns'),
    },
  ]);

  const setupSteps: SetupStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to RECRUITEDGE',
      description: 'Complete your account setup and explore the platform',
      icon: CheckCircle,
      completed: true,
      inProgress: false,
    },
    {
      id: 'integrations',
      title: 'Connect Integrations',
      description: 'Link your Gmail and other essential tools',
      icon: Mail,
      completed: completedSteps.includes('integrations'),
      inProgress: currentStep === 'integrations',
      action: () => setCurrentStep('integrations'),
    },
    {
      id: 'data_import',
      title: 'Import Your Data',
      description: 'Upload contacts, companies, and job postings',
      icon: Users,
      completed: completedSteps.includes('data_import'),
      inProgress: currentStep === 'data_import',
      action: () => navigate('/people'),
    },
    {
      id: 'automation_setup',
      title: 'Configure Automation',
      description: 'Set up automated workflows and sequences',
      icon: Zap,
      completed: completedSteps.includes('automation_setup'),
      inProgress: currentStep === 'automation_setup',
      action: () => navigate('/campaigns'),
    },
    {
      id: 'team_setup',
      title: 'Team & Permissions',
      description: 'Invite team members and configure access levels',
      icon: Settings,
      completed: completedSteps.includes('team_setup'),
      inProgress: currentStep === 'team_setup',
      action: () => navigate('/settings'),
    },
  ];

  const totalSteps = setupSteps.length;
  const completedCount = setupSteps.filter(step => step.completed).length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  const getStatusIcon = (completed: boolean, inProgress: boolean) => {
    if (completed) {
      return <CheckCircle className='h-5 w-5 text-green-600' />;
    }
    if (inProgress) {
      return <Clock className='h-5 w-5 text-blue-600' />;
    }
    return <Circle className='h-5 w-5 text-gray-400' />;
  };

  const getIntegrationStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge
            variant='outline'
            className='text-green-600 border-green-200 bg-green-50'
          >
            Connected
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant='outline'
            className='text-yellow-600 border-yellow-200 bg-yellow-50'
          >
            Pending
          </Badge>
        );
      default:
        return (
          <Badge
            variant='outline'
            className='text-gray-600 border-gray-200 bg-gray-50'
          >
            Not Connected
          </Badge>
        );
    }
  };

  return (
    <Page title='Getting Started' hideHeader>
      <div className='space-y-8'>
        {/* Welcome Header */}
        <div className='text-center space-y-4'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200'>
            <Play className='h-4 w-4 text-blue-600' />
            <span className='text-sm font-medium text-blue-700'>
              Onboarding Dashboard
            </span>
          </div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            Welcome to RECRUITEDGE
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Let's get you set up and running with your AI-powered recruitment
            platform. Follow the steps below to connect your integrations and
            start managing your pipeline.
          </p>
        </div>

        {/* Progress Overview */}
        <ModernCard variant='minimal' className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Setup Progress
            </h2>
            <span className='text-sm text-gray-500'>
              {completedCount} of {totalSteps} completed
            </span>
          </div>
          <Progress value={progressPercentage} className='mb-4' />
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
        </ModernCard>

        {/* Setup Steps */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-900'>Setup Steps</h2>
          <div className='grid gap-4'>
            {setupSteps.map(step => (
              <ModernCard
                key={step.id}
                variant='minimal'
                className='p-4 cursor-pointer hover:shadow-md transition-all duration-200'
                onClick={step.action}
              >
                <div className='flex items-center gap-4'>
                  {getStatusIcon(step.completed, step.inProgress)}
                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>{step.title}</h3>
                    <p className='text-sm text-gray-500'>{step.description}</p>
                  </div>
                  <ArrowRight className='h-4 w-4 text-gray-400' />
                </div>
              </ModernCard>
            ))}
          </div>
        </div>

        {/* Integration Cards */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Connect Integrations
          </h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {integrations.map(integration => (
              <ModernCard
                key={integration.id}
                variant='minimal'
                className='p-5'
              >
                <div className='flex items-start gap-4'>
                  <div className='p-2 rounded-xl bg-gray-50 border border-gray-100'>
                    <integration.icon className='h-5 w-5 text-gray-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='font-medium text-gray-900'>
                        {integration.title}
                      </h3>
                      {getIntegrationStatusBadge(integration.status)}
                    </div>
                    <p className='text-sm text-gray-500 mb-3'>
                      {integration.description}
                    </p>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={integration.action}
                      className='w-full'
                    >
                      {integration.status === 'connected'
                        ? 'Manage'
                        : 'Connect'}
                    </Button>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-gray-900'>Quick Actions</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            <ActionCard
              title='View Dashboard'
              description='See your current metrics and activity'
              icon={BarChart3}
              onClick={() => navigate('/')}
            />
            <ActionCard
              title='Manage People'
              description='Review and update your leads'
              icon={Users}
              onClick={() => navigate('/people')}
            />
            <ActionCard
              title='Company Pipeline'
              description='Track your client prospects'
              icon={Building2}
              onClick={() => navigate('/companies')}
            />
          </div>
        </div>

        {/* Help & Support */}
        <ModernCard
          variant='minimal'
          className='p-6 bg-blue-50/50 border-blue-200'
        >
          <div className='flex items-start gap-4'>
            <div className='p-2 rounded-xl bg-blue-100'>
              <AlertCircle className='h-5 w-5 text-blue-600' />
            </div>
            <div className='flex-1'>
              <h3 className='font-medium text-gray-900 mb-2'>Need Help?</h3>
              <p className='text-sm text-gray-600 mb-4'>
                If you run into any issues during setup, check our documentation
                or contact support.
              </p>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => navigate('/about')}
                >
                  Documentation
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => navigate('/settings')}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </ModernCard>
      </div>
    </Page>
  );
}
