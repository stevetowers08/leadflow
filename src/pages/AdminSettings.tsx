import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PermissionGuard } from "@/components/PermissionGuard";
import { supabase } from "@/integrations/supabase/client";
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

  // Load settings from database
  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');

      if (error) throw error;

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
      toast({
        title: "Warning",
        description: "Failed to load settings. Using defaults.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Prepare settings for database upsert
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      // Use upsert to update existing settings or create new ones
      const { error } = await supabase
        .from('system_settings')
        .upsert(settingsArray, { 
          onConflict: 'key',
          ignoreDuplicates: false 
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (initialLoading) {
    return (
      <PermissionGuard requiredRole="Administrator">
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
    <PermissionGuard requiredRole="Administrator">
      <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">System Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">Configure system-wide settings and preferences</p>
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
            <Users className="h-5 w-5" />
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
            <Database className="h-5 w-5" />
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
            <Bell className="h-5 w-5" />
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
            <Shield className="h-5 w-5" />
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
            <Globe className="h-5 w-5" />
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
    </PermissionGuard>
  );
};

export default AdminSettings;


