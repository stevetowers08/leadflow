import React from 'react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { 
  Settings, 
  User, 
  Plug,
  Palette,
  Shield,
  Building2
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
  const isOwner = hasRole('owner');

  const settingsSections = [
    {
      id: 'profile-info',
      label: 'Profile',
      icon: User,
      description: 'Manage your profile information',
      available: true
    },
    {
      id: 'targeting-profiles',
      label: 'Targeting Profiles',
      icon: Building2,
      description: 'Configure targeting criteria for lead filtering',
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
      id: 'integrations',
      label: 'Integrations',
      icon: Plug,
      description: 'Third-party integrations',
      available: true
    },
    {
      id: 'admin',
      label: 'Users',
      icon: Settings,
      description: 'User management',
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
