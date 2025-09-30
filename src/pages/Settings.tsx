import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useSidebar } from '@/contexts/SidebarContext';
import SettingsNavigation from '@/components/SettingsNavigation';
import PersonalSettings from './PersonalSettings';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Settings as SettingsIcon } from 'lucide-react';
import IntegrationsPage from '@/components/IntegrationsPage';
import AdminSettingsTab from '@/components/crm/settings/AdminSettingsTab';
import BusinessProfileSettings from '@/components/crm/settings/BusinessProfileSettings';
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
      case 'targeting-profiles':
        return <BusinessProfileSettings />;
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
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 border-r bg-card">
          <SettingsNavigation 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
          />
        </div>
        
        {/* Settings Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;