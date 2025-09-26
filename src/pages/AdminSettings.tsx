import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PermissionGuard } from "@/components/PermissionGuard";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { auditLogger } from "@/utils/auditLogger";
import { jsonStorage } from "@/utils/robustStorage";
import { Shield, Users, Database, Mail, Bell, Globe, Save } from "lucide-react";

interface SystemSettings {
  maxUsers: number;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
  dataRetentionDays: number;
  emailNotifications: boolean;
  systemMaintenance: boolean;
  apiRateLimit: number;
  backupFrequency: string;
  companyName: string;
  companyEmail: string;
  supportEmail: string;
  privacyPolicy: string;
  termsOfService: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    maxUsers: 100,
    allowRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: 24,
    dataRetentionDays: 365,
    emailNotifications: true,
    systemMaintenance: false,
    apiRateLimit: 1000,
    backupFrequency: "daily",
    companyName: "4Twenty CRM",
    companyEmail: "admin@4twenty.com",
    supportEmail: "support@4twenty.com",
    privacyPolicy: "",
    termsOfService: ""
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const { hasRole } = usePermissions();
  const { user } = useAuth();

  // Load settings from database with fallback to localStorage
  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');

      if (error) {
        // If table doesn't exist, use localStorage fallback
        if (error.code === '42P01') {
          console.warn('system_settings table does not exist. Using localStorage fallback.');
          loadSettingsFromLocalStorage();
          return;
        }
        throw error;
      }

      // Convert database settings to our settings object
      const dbSettings: Partial<SystemSettings> = {};
      data?.forEach(item => {
        const key = item.key as keyof SystemSettings;
        if (key in settings) {
          dbSettings[key] = item.value;
        }
      });

      setSettings(prev => ({ ...prev, ...dbSettings }));
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Fallback to localStorage
      loadSettingsFromLocalStorage();
    } finally {
      setInitialLoading(false);
    }
  };

  // Fallback: Load settings from localStorage using robust storage
  const loadSettingsFromLocalStorage = () => {
    try {
      const savedSettings = jsonStorage.getItem('admin_settings', null);
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...savedSettings }));
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      toast({
        title: "Storage Warning",
        description: "Could not load settings from local storage. Using defaults.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Input validation
      const validationErrors = validateSettings(settings);
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(', '),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if user has permission to save settings
      if (!hasRole('admin') && !hasRole('owner')) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to save system settings.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Prepare settings for database upsert with sanitization
      const settingsArray = Object.entries(settings).map(([key, value]) => {
        // Sanitize values to prevent injection attacks
        let sanitizedValue = value;
        if (typeof value === 'string') {
          // Basic XSS prevention
          sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        
        return {
          key: key.trim(), // Sanitize key
          value: sanitizedValue,
          updated_at: new Date().toISOString()
        };
      });

      // Use upsert to update existing settings or create new ones
      const { error } = await supabase
        .from('system_settings')
        .upsert(settingsArray, { 
          onConflict: 'key',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error('Database error:', error);
        
        // Handle specific database errors
        if (error.code === '42501') {
          throw new Error('Permission denied. You may not have admin privileges.');
        } else if (error.code === '23505') {
          throw new Error('Duplicate key error. Please refresh and try again.');
        } else if (error.code === '23503') {
          throw new Error('Referential integrity error. Please check your data.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      // Log successful save for audit trail
      console.log('System settings saved successfully by user:', user?.email);
      
      // Audit log the settings change
      if (user?.id && user?.email) {
        const changedSettings = Object.keys(settings);
        auditLogger.logSettingsChange(user.id, user.email, changedSettings);
      }

      // Also save to localStorage as backup
      jsonStorage.setItem('admin_settings', settings);

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      
      // Fallback to localStorage if database save fails
      try {
        const saved = jsonStorage.setItem('admin_settings', settings);
        if (saved) {
          toast({
            title: "Settings Saved Locally",
            description: "Database unavailable. Settings saved to local storage.",
            variant: "default",
          });
          return;
        }
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
      }
      
      // Enhanced error handling with specific error types
      let errorMessage = "Failed to save settings. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('Permission denied')) {
          errorMessage = "Access denied. You don't have permission to modify system settings.";
        } else if (error.message.includes('Network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (error.message.includes('Database')) {
          errorMessage = "Database error. Please contact support if this persists.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Input validation function
  const validateSettings = (settings: SystemSettings): string[] => {
    const errors: string[] = [];

    // Validate numeric fields
    if (settings.maxUsers < 1 || settings.maxUsers > 10000) {
      errors.push('Maximum users must be between 1 and 10,000');
    }

    if (settings.sessionTimeout < 1 || settings.sessionTimeout > 168) {
      errors.push('Session timeout must be between 1 and 168 hours');
    }

    if (settings.dataRetentionDays < 30 || settings.dataRetentionDays > 3650) {
      errors.push('Data retention must be between 30 and 3,650 days');
    }

    if (settings.apiRateLimit < 100 || settings.apiRateLimit > 100000) {
      errors.push('API rate limit must be between 100 and 100,000 requests per hour');
    }

    // Validate email fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (settings.companyEmail && !emailRegex.test(settings.companyEmail)) {
      errors.push('Company email must be a valid email address');
    }

    if (settings.supportEmail && !emailRegex.test(settings.supportEmail)) {
      errors.push('Support email must be a valid email address');
    }

    // Validate URL fields
    const urlRegex = /^https?:\/\/.+/;
    if (settings.privacyPolicy && !urlRegex.test(settings.privacyPolicy)) {
      errors.push('Privacy policy must be a valid URL starting with http:// or https://');
    }

    if (settings.termsOfService && !urlRegex.test(settings.termsOfService)) {
      errors.push('Terms of service must be a valid URL starting with http:// or https://');
    }

    // Validate required fields
    if (!settings.companyName.trim()) {
      errors.push('Company name is required');
    }

    return errors;
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (initialLoading) {
    return (
      <PermissionGuard requiredRole="admin">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">System Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure system-wide settings and preferences</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* User Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers">Maximum Users</Label>
              <Input
                id="maxUsers"
                type="number"
                value={settings.maxUsers}
                onChange={(e) => updateSetting('maxUsers', parseInt(e.target.value))}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                placeholder="24"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowRegistration">Allow User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
              </div>
              <Switch
                id="allowRegistration"
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => updateSetting('allowRegistration', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Users must verify their email before accessing the system</p>
              </div>
              <Switch
                id="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => updateSetting('requireEmailVerification', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataRetentionDays">Data Retention (days)</Label>
              <Input
                id="dataRetentionDays"
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
                placeholder="365"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
              <Input
                id="apiRateLimit"
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => updateSetting('apiRateLimit', parseInt(e.target.value))}
                placeholder="1000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backupFrequency">Backup Frequency</Label>
            <Select value={settings.backupFrequency} onValueChange={(value) => updateSetting('backupFrequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Send email notifications for system events</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="systemMaintenance">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Put system in maintenance mode (users will see maintenance page)</p>
            </div>
            <Switch
              id="systemMaintenance"
              checked={settings.systemMaintenance}
              onCheckedChange={(checked) => updateSetting('systemMaintenance', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => updateSetting('companyName', e.target.value)}
                placeholder="4Twenty CRM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.companyEmail}
                onChange={(e) => updateSetting('companyEmail', e.target.value)}
                placeholder="admin@4twenty.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => updateSetting('supportEmail', e.target.value)}
              placeholder="support@4twenty.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
            <Input
              id="privacyPolicy"
              value={settings.privacyPolicy}
              onChange={(e) => updateSetting('privacyPolicy', e.target.value)}
              placeholder="https://example.com/privacy"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="termsOfService">Terms of Service URL</Label>
            <Input
              id="termsOfService"
              value={settings.termsOfService}
              onChange={(e) => updateSetting('termsOfService', e.target.value)}
              placeholder="https://example.com/terms"
            />
          </div>
        </CardContent>
      </Card>
      </div>
  );
};

export default AdminSettings;


