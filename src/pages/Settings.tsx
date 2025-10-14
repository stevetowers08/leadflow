import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';
import {
    Bell,
    Building2,
    Palette,
    Plug,
    Settings,
    Shield,
    User
} from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

// Lazy load heavy components
const IntegrationsPage = lazy(() => import('@/components/IntegrationsPage'));
const AdminSettingsTab = lazy(() => import('@/components/crm/settings/AdminSettingsTab'));
const BusinessProfileSettings = lazy(() => import('@/components/crm/settings/BusinessProfileSettings'));

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  available: boolean;
}

const Settings = () => {
  const { user } = useAuth();
  const { hasRole } = usePermissions();
  const [activeSection, setActiveSection] = useState('profile');

  usePageMeta({
    title: 'Settings',
    description: 'Manage your account settings and preferences'
  });

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Manage your personal information',
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
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email and push notification settings',
      available: true
    },
    {
      id: 'targeting',
      label: 'Targeting',
      icon: Building2,
      description: 'Configure targeting criteria',
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
      icon: Shield,
      description: 'Manage users and permissions',
      available: hasRole('owner')
    }
  ];

  const availableSections = settingsSections.filter(section => section.available);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
      case 'preferences':
        return (
          <div className="p-6">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                {activeSection === 'profile' ? 'Profile Settings' : 'Preferences'}
              </h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Manage your personal details and contact information</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Display Preferences</h3>
                  <p className="text-sm text-muted-foreground">Customize your interface and display settings</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">Control your privacy and data sharing preferences</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'targeting':
        return (
          <Suspense fallback={<LoadingFallback message="Loading targeting settings..." />}>
            <BusinessProfileSettings />
          </Suspense>
        );
      case 'admin':
        return (
          <Suspense fallback={<LoadingFallback message="Loading admin settings..." />}>
            <AdminSettingsTab />
          </Suspense>
        );
      case 'integrations':
        return (
          <Suspense fallback={<LoadingFallback message="Loading integrations..." />}>
            <IntegrationsPage />
          </Suspense>
        );
      case 'notifications':
        return (
          <div className="p-6">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your email notification preferences</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Configure browser and mobile push notifications</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Manage your personal details and contact information</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Display Preferences</h3>
                  <p className="text-sm text-muted-foreground">Customize your interface and display settings</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">Control your privacy and data sharing preferences</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Clean Settings Navigation */}
        <div className="w-full lg:w-64 bg-card border-r border-border">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {availableSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 cursor-pointer w-full text-left",
                    "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon 
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} 
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate">{section.label}</span>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Settings Content - Full Width */}
        <div className="flex-1 overflow-auto bg-background w-full">
          <div className="min-h-screen w-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingFallback = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  </div>
);

export default Settings;
