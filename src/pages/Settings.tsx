import IntegrationsPage from '@/components/IntegrationsPage';
import AdminSettingsTab from '@/components/crm/settings/AdminSettingsTab';
import BusinessProfileSettings from '@/components/crm/settings/BusinessProfileSettings';
import { ClientManagementTab } from '@/components/crm/settings/ClientManagementTab';
import NotificationSettings from '@/components/crm/settings/NotificationSettings';
import ProfileSettings from '@/components/crm/settings/ProfileSettings';
import { SettingsSidebar, getSettingsSections } from '@/components/crm/settings/SettingsSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useState, useEffect } from 'react';

// Client-side mount guard wrapper
const Settings: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't call useAuth until component is mounted on client
  if (!isMounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading settings...</p>
        </div>
      </div>
    );
  }

  // Now safe to use useAuth after mount (client-side only)
  return <SettingsContent />;
};

const SettingsContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { hasRole } = usePermissions();
  const [activeSection, setActiveSection] = useState('profile');

  usePageMeta({
    title: 'Settings',
    description: 'Manage your account settings and preferences',
  });

  const settingsSections = getSettingsSections(hasRole);
  const availableSections = settingsSections.filter(
    section => section.available && !section.isExternal
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
      <SettingsSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />

      {/* Main Content Area */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-6'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Settings;
