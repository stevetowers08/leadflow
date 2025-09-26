import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useSidebar } from '@/contexts/SidebarContext';
import SettingsNavigation from '@/components/SettingsNavigation';
import PersonalSettings from './PersonalSettings';
import AdminSettings from './AdminSettings';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Settings as SettingsIcon } from 'lucide-react';
import IntegrationsPage from '@/components/IntegrationsPage';
import Accounts from './settings/Accounts';
import Members from './settings/Members';
import Billing from './settings/Billing';
import VoiceCloner from './settings/VoiceCloner';
import WhiteLabel from './settings/WhiteLabel';
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

  const renderContent = () => {
    switch (activeSection) {
      case 'profile-info':
      case 'notifications':
      case 'preferences':
      case 'security':
        return <PersonalSettings activeSection={activeSection} />;
      case 'accounts':
        return (
          <div className="p-6">
            <PermissionGuard requiredRole={['admin', 'owner']}>
              <Accounts />
            </PermissionGuard>
          </div>
        );
      case 'members':
        return (
          <div className="p-6">
            <PermissionGuard requiredRole={['admin', 'owner']}>
              <Members />
            </PermissionGuard>
          </div>
        );
      case 'billing':
        return (
          <div className="p-6">
            <PermissionGuard requiredRole={['admin', 'owner']}>
              <Billing />
            </PermissionGuard>
          </div>
        );
      case 'voice-cloner':
        return (
          <div className="p-6">
            <PermissionGuard requiredRole={['admin', 'owner']}>
              <VoiceCloner />
            </PermissionGuard>
          </div>
        );
      case 'white-label':
        return (
          <div className="p-6">
            <PermissionGuard requiredRole={['admin', 'owner']}>
              <WhiteLabel />
            </PermissionGuard>
          </div>
        );
      case 'webhooks':
        return (
          <div className="p-6">
            <PermissionGuard requiredRole={['admin', 'owner']}>
              <AdminSettings />
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
