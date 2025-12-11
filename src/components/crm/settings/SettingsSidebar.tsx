import { cn } from '@/lib/utils';
import { Bell, Plug, User } from 'lucide-react';
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

export function getSettingsSections(): SettingsSection[] {
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
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Configure email and in-app notification preferences',
      available: true,
      href: '/settings',
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      description: 'Connect external services and APIs',
      available: true,
      href: '/settings',
    },
  ];
}

interface SettingsSidebarProps {
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const pathname = usePathname();

  const settingsSections = getSettingsSections();
  const availableSections = settingsSections.filter(section => section.available);

  // Determine active section from pathname if not provided
  const currentActiveSection = activeSection || 
    (pathname?.startsWith('/settings') ? 'profile' : 'profile');

  return (
    <div className='w-64 bg-muted border-r border-border flex flex-col flex-shrink-0'>
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
                    'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
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
                  'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
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
      <div className='p-4 border-t border-border bg-muted'>
        <div className='text-xs text-muted-foreground'>
          <div>
            Account Status:{' '}
            <span className='font-medium text-success'>Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

