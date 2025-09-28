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

const Settings = () => {
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const { isCollapsed } = useSidebar();
  const [activeSection, setActiveSection] = useState('profile-info');

  // Set page meta tags
  usePageMeta({
    title: 'Settings - Empowr CRM',
    description: 'Configure your CRM settings, manage integrations, billing, and customize your workspace preferences.',
    keywords: 'settings, configuration, CRM settings, integrations, billing, preferences, workspace',
    ogTitle: 'Settings - Empowr CRM',
    ogDescription: 'Configure your CRM settings, manage integrations, billing, and customize your workspace preferences.',
    twitterTitle: 'Settings - Empowr CRM',
    twitterDescription: 'Configure your CRM settings, manage integrations, billing, and customize your workspace preferences.'
  });

  // Don't render if user is not authenticated
  if (!user) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
          <p className="text-gray-600">You need to be logged in to access settings.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile-info':
      case 'preferences':
      case 'security':
        return <PersonalSettings activeSection={activeSection} />;
      case 'admin':
        return (
          <div className="p-6">
            <PermissionGuard requiredRole={['admin', 'owner']}>
              <AdminSettingsTab />
            </PermissionGuard>
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
      {/* Settings Navigation */}
      <SettingsNavigation 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content Area */}
      <div className={`
        bg-white min-h-screen transition-all duration-300
        ${isCollapsed ? 'ml-[8rem]' : 'ml-[20rem]'}
      `}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;