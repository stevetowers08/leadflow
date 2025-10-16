import IntegrationsPage from '@/components/IntegrationsPage';
import AdminSettingsTab from '@/components/crm/settings/AdminSettingsTab';
import BusinessProfileSettings from '@/components/crm/settings/BusinessProfileSettings';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';
import { Building2, Plug, User, Users } from 'lucide-react';
import { useState } from 'react';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  available: boolean;
}

const Settings = () => {
  const { user, loading } = useAuth();
  const { hasRole } = usePermissions();
  const [activeSection, setActiveSection] = useState('profile');

  usePageMeta({
    title: 'Settings',
    description: 'Manage your account settings and preferences',
  });

  // Show loading only when auth is actually loading, not when user is null in bypass mode
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      label: 'Your profile',
      icon: User,
      description: 'Personal information and account details',
      available: true,
    },
    {
      id: 'business-profile',
      label: 'Business Profile',
      icon: Building2,
      description: 'Configure your business profile and targeting criteria',
      available: true,
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      description: 'Connect external services and APIs',
      available: true,
    },
    {
      id: 'team-members',
      label: 'Team Members',
      icon: Users,
      description: 'Manage team members and permissions',
      available: hasRole('owner'),
    },
  ];

  const availableSections = settingsSections.filter(
    section => section.available
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className='space-y-6'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                Your Profile
              </h2>
              <p className='text-sm text-gray-600'>
                Manage your personal information and account details
              </p>
            </div>
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your full name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your email'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Job Title
                  </label>
                  <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your job title'
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        );

      case 'business-profile':
        return <BusinessProfileSettings />;

      case 'integrations':
        return <IntegrationsPage />;

      case 'team-members':
        return <AdminSettingsTab />;

      default:
        return null;
    }
  };

  return (
    <div className='bg-white -mx-4 -my-4 lg:-mx-6 lg:-my-6'>
      <div className='flex bg-white' style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Left Sidebar - Settings Navigation */}
        <div className='w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0'>
          {/* Navigation Items */}
          <div className='flex-1 p-4'>
            <nav className='space-y-1'>
              {availableSections.map(section => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                      'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:text-gray-900'
                    )}
                  >
                    <Icon className='h-4 w-4 flex-shrink-0' />
                    <span className='font-medium'>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Account Info */}
          <div className='p-4 border-t border-gray-200 bg-gray-50'>
            <div className='text-xs text-gray-500 space-y-1'>
              <div>
                Account Status:{' '}
                <span className='font-medium text-green-600'>Active</span>
              </div>
              <div>
                Role:{' '}
                <span className='font-medium text-blue-600'>
                  {hasRole('owner')
                    ? 'Owner'
                    : hasRole('admin')
                      ? 'Admin'
                      : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 overflow-y-auto'>
          <div className='p-6'>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
