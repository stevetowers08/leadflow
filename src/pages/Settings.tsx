import IntegrationsPage from '@/components/IntegrationsPage';
import AdminSettingsTab from '@/components/crm/settings/AdminSettingsTab';
import BusinessProfileSettings from '@/components/crm/settings/BusinessProfileSettings';
import { ClientManagementTab } from '@/components/crm/settings/ClientManagementTab';
import NotificationSettings from '@/components/crm/settings/NotificationSettings';
import ProfileSettings from '@/components/crm/settings/ProfileSettings';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';
import { Bell, Building2, Filter, Plug, User, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  available: boolean;
  isExternal?: boolean;
}

const Settings = () => {
  const { user, loading } = useAuth();
  const { hasRole } = usePermissions();
  const [activeSection, setActiveSection] = useState('profile');

  usePageMeta({
    title: 'Settings',
    description: 'Manage your account settings and preferences',
  });

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
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Configure email and in-app notification preferences',
      available: true,
    },
    {
      id: 'job-filtering',
      label: 'Job Filtering',
      icon: Filter,
      description: 'Configure automated job discovery and filtering',
      available: true,
      isExternal: true,
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
    {
      id: 'client-management',
      label: 'Client Management',
      icon: Building2,
      description: 'Manage agency clients and subscriptions',
      available: hasRole('owner'),
    },
  ];

  const availableSections = settingsSections.filter(
    section => section.available
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings />;

      case 'business-profile':
        return <BusinessProfileSettings />;

      case 'notifications':
        return <NotificationSettings />;

      case 'integrations':
        return <IntegrationsPage />;

      case 'team-members':
        return <AdminSettingsTab />;

      case 'client-management':
        return <ClientManagementTab />;

      default:
        return null;
    }
  };

  return (
    <div className='flex bg-white h-full overflow-hidden'>
      {/* Left Sidebar - Settings Navigation */}
      <div className='w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0'>
        {/* Navigation Items */}
        <div className='flex-1 p-4'>
          <nav className='space-y-1'>
            {availableSections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              if (section.isExternal) {
                return (
                  <Link
                    key={section.id}
                    to={`/settings/${section.id}`}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                      'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                      'text-gray-700 hover:text-gray-900'
                    )}
                  >
                    <Icon className='h-4 w-4 flex-shrink-0' />
                    <span className='font-medium'>{section.label}</span>
                  </Link>
                );
              }

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
  );
};

export default Settings;
