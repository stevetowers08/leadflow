import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useSidebar } from '@/contexts/SidebarContext';
import SettingsNavigation from '@/components/SettingsNavigation';
import PersonalSettings from './PersonalSettings';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Settings as SettingsIcon } from 'lucide-react';
import IntegrationsPage from '@/components/IntegrationsPage';
import AdminSettingsTab from '@/components/AdminSettingsTab';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const { isCollapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState('profile-info');

  usePageMeta({
    title: 'Settings',
    description: 'Manage your account settings and preferences'
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile-info':
      case 'preferences':
        return <PersonalSettings activeSection={activeSection} />;
      case 'admin':
        return (
          <div className="p-6">
            <AdminSettingsTab />
          </div>
        );
      case 'integrations':
        return <IntegrationsPage />;
      default:
        return <PersonalSettings />;
    }
  };

  return (
    <div className="fixed inset-0 bg-white">
      {/* Settings Navigation Sidebar */}
      <SettingsNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area - properly offset for sidebar */}
      <div className={cn(
        "h-screen overflow-y-auto transition-all duration-300",
        isCollapsed ? "ml-32" : "ml-[416px]"
      )}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;