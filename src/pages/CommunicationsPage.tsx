/**
 * Communications Page - Email and Communication Management
 *
 * Features:
 * - Email composer and templates
 * - Communication history
 * - Bulk email actions
 * - Email automation
 */

import { EmailBulkActions } from '@/components/crm/communications/EmailBulkActions';
import { EmailComposer } from '@/components/crm/communications/EmailComposer';
import { EmailDashboard } from '@/components/crm/communications/EmailDashboard';
import { EmailTemplateManager } from '@/components/crm/communications/EmailTemplateManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/design-system/components';
import {
  BarChart3,
  FileText,
  Filter,
  Mail,
  Plus,
  Search,
  Send,
  Settings,
  Users,
} from 'lucide-react';
import { useState } from 'react';

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<
    'compose' | 'templates' | 'history' | 'analytics'
  >('compose');
  const [selectedPerson, setSelectedPerson] = useState(null);

  const tabs = [
    { key: 'compose', label: 'Compose', icon: Send },
    { key: 'templates', label: 'Templates', icon: FileText },
    { key: 'history', label: 'History', icon: Mail },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <Page title='Communications' hideHeader>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-foreground'>
              Communications
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Manage email campaigns and communication history
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm'>
              <Filter className='w-4 h-4 mr-2' />
              Filter
            </Button>
            <Button variant='outline' size='sm'>
              <Search className='w-4 h-4 mr-2' />
              Search
            </Button>
            <Button size='sm'>
              <Plus className='w-4 h-4 mr-2' />
              New Email
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Emails Sent</CardTitle>
              <Send className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>1,234</div>
              <p className='text-xs text-muted-foreground'>
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Open Rate</CardTitle>
              <Mail className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>24.5%</div>
              <p className='text-xs text-muted-foreground'>
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Reply Rate</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>8.2%</div>
              <p className='text-xs text-muted-foreground'>
                +0.8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Templates</CardTitle>
              <Template className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>12</div>
              <p className='text-xs text-muted-foreground'>
                3 active templates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8'>
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(
                      tab.key as
                        | 'compose'
                        | 'templates'
                        | 'history'
                        | 'analytics'
                    )
                  }
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className='w-4 h-4' />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className='space-y-6'>
          {activeTab === 'compose' && (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2'>
                <EmailComposer
                  selectedPerson={selectedPerson}
                  onSent={() => {
                    // Refresh data or show success message
                    console.log('Email sent successfully');
                  }}
                />
              </div>
              <div className='space-y-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <Button variant='outline' className='w-full justify-start'>
                      <Users className='w-4 h-4 mr-2' />
                      Select Recipients
                    </Button>
                    <Button variant='outline' className='w-full justify-start'>
                      <Template className='w-4 h-4 mr-2' />
                      Use Template
                    </Button>
                    <Button variant='outline' className='w-full justify-start'>
                      <Settings className='w-4 h-4 mr-2' />
                      Email Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Recent Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          className='flex items-center justify-between p-2 hover:bg-gray-50 rounded'
                        >
                          <div>
                            <p className='text-sm font-medium'>Contact {i}</p>
                            <p className='text-xs text-gray-500'>
                              contact{i}@example.com
                            </p>
                          </div>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() =>
                              setSelectedPerson({
                                id: i,
                                email_address: `contact${i}@example.com`,
                              })
                            }
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'templates' && <EmailTemplateManager />}

          {activeTab === 'history' && <EmailDashboard />}

          {activeTab === 'analytics' && (
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Email Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-center py-12'>
                    <BarChart3 className='w-12 h-12 mx-auto text-gray-400 mb-4' />
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                      Analytics Coming Soon
                    </h3>
                    <p className='text-gray-600'>
                      Detailed email performance analytics will be available
                      here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        <Card className='bg-gray-50'>
          <CardHeader>
            <CardTitle className='text-lg'>Bulk Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailBulkActions
              selectedEmails={[]}
              onActionComplete={() => {
                console.log('Bulk action completed');
              }}
            />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
