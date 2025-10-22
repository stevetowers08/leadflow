/**
 * Workflows - Workflow List Page
 *
 * Similar to campaigns page but for workflows
 * Shows list of workflows with ability to click into workflow builder
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Page } from '@/design-system/components';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Bot,
  ExternalLink,
  Filter,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Users,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock workflow data
const mockWorkflows = [
  {
    id: '1',
    name: 'New Lead Follow-up',
    description: 'Automatically follow up with new leads via email and SMS',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z',
    steps: 5,
    stats: {
      emails_sent: 1247,
      sms_sent: 523,
      opens: 892,
      clicks: 234,
      replies: 89,
      contacts_reached: 1770,
    },
  },
  {
    id: '2',
    name: 'Appointment Reminders',
    description: 'Send reminder emails and SMS before scheduled meetings',
    status: 'active',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-18T16:20:00Z',
    steps: 3,
    stats: {
      emails_sent: 456,
      sms_sent: 234,
      opens: 378,
      clicks: 45,
      replies: 12,
      contacts_reached: 690,
    },
  },
  {
    id: '3',
    name: 'Lead Nurturing Sequence',
    description: 'Multi-touch nurturing campaign for warm leads',
    status: 'paused',
    created_at: '2024-01-05T14:20:00Z',
    updated_at: '2024-01-15T11:30:00Z',
    steps: 8,
    stats: {
      emails_sent: 2341,
      sms_sent: 1123,
      opens: 1876,
      clicks: 567,
      replies: 234,
      contacts_reached: 3464,
    },
  },
  {
    id: '4',
    name: 'Review Request Workflow',
    description: 'Request reviews from satisfied customers',
    status: 'draft',
    created_at: '2024-01-12T13:45:00Z',
    updated_at: '2024-01-12T13:45:00Z',
    steps: 2,
    stats: {
      emails_sent: 0,
      sms_sent: 0,
      opens: 0,
      clicks: 0,
      replies: 0,
      contacts_reached: 0,
    },
  },
];

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-primary-light text-primary border-primary-medium',
  cancelled: 'bg-red-100 text-red-800',
};

const Workflows: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredWorkflows = mockWorkflows.filter(workflow => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || workflow.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleWorkflowClick = (workflowId: string) => {
    navigate(`/workflows/${workflowId}`);
  };

  const handleCreateWorkflow = () => {
    navigate('/workflows/new');
  };

  const StatIcon = ({
    icon: Icon,
    count,
    label,
    color = 'text-gray-600',
  }: {
    icon: React.ComponentType<{ className?: string }>;
    count: number;
    label: string;
    color?: string;
  }) => (
    <div className='flex flex-col items-center justify-center min-w-[80px]'>
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className='flex items-center gap-1 mt-1'>
        <Icon className='h-4 w-4 text-gray-500' />
        <span className='text-xs text-gray-600'>{label}</span>
      </div>
    </div>
  );

  return (
    <Page title='Workflows' hideHeader>
      <div className='space-y-4'>
        {/* Header Section with Filters and Search */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            {/* Filter Dropdown */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[200px] h-8 border-gray-300'>
                <SelectValue placeholder='All Workflows' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Workflows</SelectItem>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='paused'>Paused</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Icon */}
            <Button
              variant='outline'
              size='sm'
              className='h-8 w-8 p-0 border-gray-300'
            >
              <Filter className='h-4 w-4' />
            </Button>

            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search Workflows'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 h-8 w-[200px] border-gray-300'
              />
            </div>
          </div>

          {/* Create Workflow Button */}
          <Button
            onClick={handleCreateWorkflow}
            className='h-8 bg-primary hover:bg-primary-hover text-primary-foreground'
          >
            <Plus className='h-4 w-4 mr-2' />
            Create Workflow
          </Button>
        </div>

        {/* Workflows Table */}
        {filteredWorkflows.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Bot className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No workflows found</h3>
              <p className='text-muted-foreground text-center mb-4'>
                {searchTerm
                  ? 'No workflows match your search criteria.'
                  : 'Create your first workflow to start automating your processes.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateWorkflow}>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Your First Workflow
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className='bg-white rounded-lg border border-gray-300 overflow-hidden'>
            {/* Table Header */}
            <div className='bg-gray-50 border-b border-gray-300 px-6 py-3'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Workflow Details
                </h3>
              </div>
            </div>

            {/* Workflow Rows */}
            <div className='divide-y divide-gray-300'>
              {filteredWorkflows.map(workflow => {
                const statusColor =
                  STATUS_COLORS[
                    workflow.status as keyof typeof STATUS_COLORS
                  ] || 'bg-gray-100 text-gray-800';

                return (
                  <div
                    key={workflow.id}
                    className='px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer'
                    onClick={() => handleWorkflowClick(workflow.id)}
                  >
                    <div className='flex items-center justify-between'>
                      {/* Workflow Details */}
                      <div className='flex items-center space-x-4 flex-1'>
                        <div className='flex items-center space-x-3'>
                          <div className='w-8 h-8 bg-primary-light rounded-full flex items-center justify-center'>
                            <Bot className='h-4 w-4 text-primary' />
                          </div>
                          <div>
                            <div className='flex items-center space-x-2'>
                              <h4 className='text-sm font-medium text-primary hover:text-primary-hover'>
                                {workflow.name}
                              </h4>
                              <ExternalLink className='h-3 w-3 text-gray-400' />
                            </div>
                            <p className='text-xs text-gray-500 mt-1'>
                              {workflow.description}
                            </p>
                            <div className='flex items-center space-x-2 text-xs text-gray-500 mt-1'>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                              >
                                {workflow.status.charAt(0).toUpperCase() +
                                  workflow.status.slice(1)}
                              </span>
                              <span>•</span>
                              <span>
                                Created:{' '}
                                {format(
                                  new Date(workflow.created_at),
                                  'dd MMM, hh:mm a'
                                )}
                              </span>
                              <span>•</span>
                              <span>{workflow.steps} steps</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className='flex items-center space-x-6'>
                        <StatIcon
                          icon={Mail}
                          count={workflow.stats.emails_sent}
                          label='Emails'
                          color='text-primary'
                        />
                        <StatIcon
                          icon={MessageSquare}
                          count={workflow.stats.sms_sent}
                          label='SMS'
                          color='text-green-600'
                        />
                        <StatIcon
                          icon={Users}
                          count={workflow.stats.contacts_reached}
                          label='Reached'
                          color='text-purple-600'
                        />
                        <StatIcon
                          icon={Zap}
                          count={workflow.stats.replies}
                          label='Replies'
                          color='text-orange-600'
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default Workflows;
