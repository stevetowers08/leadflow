import { usePermissions } from '@/contexts/PermissionsContext';
import { cn } from '@/lib/utils';
import { Bell, Building2, Filter, Plug, User, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
  available: boolean;
  href: string;
  isExternal?: boolean;
}

export function getSettingsSections(hasRole: (role: string) => boolean): SettingsSection[] {
  return [
    {
      id: 'profile',
      label: 'Your profile',
      icon: User,
      description: 'Personal information and account details',
      available: true,
      href: '/settings',
    },
    {
      id: 'business-profile',
      label: 'Business Profile',
      icon: Building2,
      description: 'Configure your business profile and targeting criteria',
      available: true,
      href: '/settings',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Configure email and in-app notification preferences',
      available: true,
      href: '/settings',
    },
    {
      id: 'job-filtering',
      label: 'Job Filtering',
      icon: Filter,
      description: 'Configure automated job discovery and filtering',
      available: true,
      href: '/settings/job-filtering',
      isExternal: true,
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      description: 'Connect external services and APIs',
      available: true,
      href: '/settings',
    },
    {
      id: 'team-members',
      label: 'Team Members',
      icon: Users,
      description: 'Manage team members and permissions',
      available: hasRole('owner'),
      href: '/settings',
    },
    {
      id: 'client-management',
      label: 'Client Management',
      icon: Building2,
      description: 'Manage agency clients and subscriptions',
      available: hasRole('owner') || hasRole('admin'),
      href: '/settings',
    },
  ];
}

interface SettingsSidebarProps {
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const { hasRole } = usePermissions();
  const pathname = usePathname();

  const settingsSections = getSettingsSections(hasRole);
  const availableSections = settingsSections.filter(section => section.available);

  // Determine active section from pathname if not provided
  const currentActiveSection = activeSection || 
    (pathname?.startsWith('/settings/job-filtering') ? 'job-filtering' :
     pathname?.startsWith('/settings') ? 'profile' : 'profile');

  return (
    <div className='w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0'>
      {/* Navigation Items */}
      <div className='flex-1 p-4'>
        <nav className='space-y-1'>
          {availableSections.map(section => {
            const Icon = section.icon;
            const isActive = currentActiveSection === section.id;

            // If onSectionChange is provided and section is internal, use button instead of Link
            if (onSectionChange && !section.isExternal && section.href === '/settings') {
              return (
                <button
                  key={section.id}
                  onClick={() => onSectionChange(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                    'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-foreground hover:text-foreground'
                  )}
                >
                  <Icon className='h-4 w-4 flex-shrink-0' />
                  <span className='font-medium'>{section.label}</span>
                </button>
              );
            }

            // Otherwise use Link for navigation
            return (
              <Link
                key={section.id}
                href={section.href}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors',
                  'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-foreground hover:text-foreground'
                )}
              >
                <Icon className='h-4 w-4 flex-shrink-0' />
                <span className='font-medium'>{section.label}</span>
              </Link>
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
  );
}

