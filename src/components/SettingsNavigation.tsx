import React from 'react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { 
  Settings, 
  Users, 
  User, 
  Building2, 
  Mic, 
  Tag, 
  Webhook, 
  Plug,
  Bell,
  Palette,
  Shield
} from 'lucide-react';

interface SettingsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({ 
  activeSection, 
  onSectionChange
}) => {
  const { hasRole } = usePermissions();
  const { isCollapsed } = useSidebar();
  const isAdmin = hasRole('admin') || hasRole('owner');

  const settingsSections = [
    {
      id: 'profile-info',
      label: 'Profile',
      icon: User,
      description: 'Manage your profile information',
      available: true
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Notification preferences',
      available: true
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: Palette,
      description: 'Display and behavior settings',
      available: true
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Security and privacy settings',
      available: true
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      description: 'Manage team members (Admin)',
      available: isAdmin
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: Users,
      description: 'Manage user accounts',
      available: isAdmin
    },
    {
      id: 'members',
      label: 'Members',
      icon: User,
      description: 'Team member management',
      available: isAdmin
    },
    {
      id: 'voice-cloner',
      label: 'Voice Cloner',
      icon: Mic,
      description: 'Voice cloning settings',
      available: isAdmin
    },
    {
      id: 'white-label',
      label: 'White Label',
      icon: Tag,
      description: 'White label customization',
      available: isAdmin
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: Webhook,
      description: 'Webhook configurations',
      available: isAdmin
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      description: 'Third-party integrations',
      available: true
    }
  ];

  const availableSections = settingsSections.filter(section => section.available);

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 border-t-0 h-screen flex flex-col fixed z-30 transition-all duration-300",
      isCollapsed ? "w-16 left-16" : "w-52 left-52"
    )}>
      {/* Header */}
      <div className="px-4 h-20 border-b border-gray-200 flex items-center">
        <div className="flex items-center justify-between w-full">
          {!isCollapsed && <div></div>}
        </div>
      </div>
      
      {/* Settings Title */}
      {!isCollapsed && (
        <div className="px-4 h-16 flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {availableSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer w-full text-left",
                "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-gray-700 hover:text-gray-900",
                isCollapsed ? "justify-center" : ""
              )}
              title={isCollapsed ? section.label : undefined}
            >
              <Icon 
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary" : "text-gray-500"
                )} 
              />
              {!isCollapsed && <span className="font-medium">{section.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsNavigation;
