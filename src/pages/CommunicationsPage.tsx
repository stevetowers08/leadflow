/**
 * Communications Page - Email and Communication Management
 *
 * Features:
 * - Email composer
 * - Communication history
 * - Bulk email actions
 * - Email automation
 */

import { EmailComposer } from '@/components/crm/communications/EmailComposer';
import { EmailDashboard } from '@/components/crm/communications/EmailDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/design-system/components';
import {
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
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');
  const [selectedPerson, setSelectedPerson] = useState(null);

  const tabs = [
    { key: 'compose', label: 'Compose Email', icon: Send },
    { key: 'history', label: 'Email History', icon: Mail },
  ];

  return (
    <Page title='Communications' hideHeader>
      <div className='space-y-6'>
        {/* Action Buttons */}
        <div className='flex items-center justify-end gap-3'>
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

        {/* Tab Navigation */}
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8'>
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'compose' | 'history')}
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
                    if (process.env.NODE_ENV === 'development') {
                      console.log('Email sent successfully');
                    }
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

          {activeTab === 'history' && <EmailDashboard />}
        </div>
      </div>
    </Page>
  );
}
