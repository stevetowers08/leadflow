import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useSidebar } from '@/contexts/SidebarContext';
import SettingsNavigation from '@/components/SettingsNavigation';
import { PermissionGuard } from '@/components/PermissionGuard';
import { Settings as SettingsIcon } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';

// Lazy load heavy components
const PersonalSettings = lazy(() => import('./PersonalSettings'));
const IntegrationsPage = lazy(() => import('@/components/IntegrationsPage'));
const AdminSettingsTab = lazy(() => import('@/components/crm/settings/AdminSettingsTab'));
const BusinessProfileSettings = lazy(() => import('@/components/crm/settings/BusinessProfileSettings'));

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
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading settings...</p>
              </div>
            </div>
          }>
            <PersonalSettings activeSection={activeSection} />
          </Suspense>
        );
      case 'targeting-profiles':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading business profile...</p>
              </div>
            </div>
          }>
            <BusinessProfileSettings />
          </Suspense>
        );
      case 'admin':
        return (
          <div className="p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading admin settings...</p>
                </div>
              </div>
            }>
              <AdminSettingsTab />
            </Suspense>
          </div>
        );
      case 'integrations':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading integrations...</p>
              </div>
            </div>
          }>
            <IntegrationsPage />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading settings...</p>
              </div>
            </div>
          }>
            <PersonalSettings />
          </Suspense>
        );
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