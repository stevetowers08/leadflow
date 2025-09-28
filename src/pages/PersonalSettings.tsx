import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, User, Mail, Calendar, LogOut, Save, Bell, Palette, Database, Settings as SettingsIcon, Shield, Activity, Clock, Globe, Smartphone, Download, Upload, Trash2, Eye, EyeOff, Users, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface PersonalSettingsProps {
  activeSection?: string;
}

const PersonalSettings = ({ activeSection = 'profile-info' }: PersonalSettingsProps) => {
  const { user, userProfile, updateProfile, signOut } = useAuth();
  const { hasRole } = usePermissions();
  const [fullName, setFullName] = useState(userProfile?.full_name || user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Personal settings state
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    weeklyReports: true,
    marketingEmails: false,
    newLeads: true,
    jobMatches: true,
    systemAlerts: true,
  });
  
  const [preferences, setPreferences] = useState({
    timezone: 'Australia/Sydney',
    dateFormat: 'dd/MM/yyyy',
    language: 'en',
    itemsPerPage: 25,
    theme: 'light',
    autoRefresh: true,
    showAdvanced: false,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true,
    passwordLastChanged: null,
  });

  const [usageStats, setUsageStats] = useState({
    totalLogins: 0,
    lastLogin: null,
    dataExported: 0,
    apiCallsToday: 0,
  });

  // Load user settings on mount
  useEffect(() => {
    loadUserSettings();
    loadUsageStats();
  }, [userProfile]);

  const loadUserSettings = async () => {
    try {
      if (!user?.id) {
        console.log('No user ID available, skipping user settings load');
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If table doesn't exist or user has no settings, use defaults
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.log('No user settings found or table does not exist, using defaults');
          return;
        }
        console.error('Error loading user settings:', error);
        return;
      }
      
      if (data) {
        setNotifications(data.notifications || notifications);
        setPreferences(data.preferences || preferences);
        setSecurity(data.security || security);
      }
    } catch (error) {
      console.log('Error loading user settings, using defaults:', error);
    }
  };

  const loadUsageStats = async () => {
    try {
      // Simulate usage stats - in real app, this would come from analytics
      setUsageStats({
        totalLogins: Math.floor(Math.random() * 100) + 50,
        lastLogin: new Date().toISOString(),
        dataExported: Math.floor(Math.random() * 10),
        apiCallsToday: Math.floor(Math.random() * 1000) + 100,
      });
    } catch (error) {
      console.error('Error loading usage stats:', error);
    }
  };

  const saveUserSettings = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        toast.error('User not authenticated');
        return;
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          notifications,
          preferences,
          security,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        // If table doesn't exist, just show a warning
        if (error.code === '42P01') {
          toast.error('Settings table not available. Please contact your administrator.');
          return;
        }
        throw error;
      }
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    if (!fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }

    if (fullName.length < 2) {
      setError('Full name must be at least 2 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await updateProfile({ full_name: fullName.trim() });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        toast.success('Profile updated successfully!');
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const exportUserData = async () => {
    try {
      const { data } = await supabase
        .from('people')
        .select('*')
        .limit(1000);
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `empowr-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || 
           user?.user_metadata?.name || 
           user?.email?.split('@')[0] || 
           'User';
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="h-20 border-b border-gray-200 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-purple-600" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Personal Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your profile, preferences, and account settings
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Information */}
          {activeSection === 'profile-info' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {success && (
                      <Alert>
                        <AlertDescription>Profile updated successfully!</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="text-lg">
                          {getInitials(getUserDisplayName())}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{getUserDisplayName()}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <Badge variant="secondary" className="mt-1">
                          {userProfile?.role || 'User'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ''}
                          className="bg-gray-50"
                          readOnly
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Usage Statistics
                  </CardTitle>
                  <CardDescription>
                    Your account activity and usage metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{usageStats.totalLogins}</div>
                      <div className="text-sm text-muted-foreground">Total Logins</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{usageStats.apiCallsToday}</div>
                      <div className="text-sm text-muted-foreground">API Calls Today</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{usageStats.dataExported}</div>
                      <div className="text-sm text-muted-foreground">Data Exports</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-sm font-medium">
                        {usageStats.lastLogin ? format(new Date(usageStats.lastLogin), 'MMM dd, yyyy') : 'Never'}
                      </div>
                      <div className="text-sm text-muted-foreground">Last Login</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">Show browser notifications</p>
                    </div>
                    <Switch
                      checked={notifications.browser}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, browser: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Leads</Label>
                      <p className="text-sm text-muted-foreground">Get notified about new leads</p>
                    </div>
                    <Switch
                      checked={notifications.newLeads}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newLeads: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Job Matches</Label>
                      <p className="text-sm text-muted-foreground">Get notified about job matches</p>
                    </div>
                    <Switch
                      checked={notifications.jobMatches}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, jobMatches: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={saveUserSettings} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notifications
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences */}
          {activeSection === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Display Preferences
                </CardTitle>
                <CardDescription>
                  Customize how the application looks and behaves
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences(prev => ({ ...prev, dateFormat: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Items Per Page</Label>
                    <Select value={preferences.itemsPerPage.toString()} onValueChange={(value) => setPreferences(prev => ({ ...prev, itemsPerPage: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Refresh</Label>
                      <p className="text-sm text-muted-foreground">Automatically refresh data</p>
                    </div>
                    <Switch
                      checked={preferences.autoRefresh}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoRefresh: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Advanced Options</Label>
                      <p className="text-sm text-muted-foreground">Display advanced configuration options</p>
                    </div>
                    <Switch
                      checked={preferences.showAdvanced}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, showAdvanced: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={saveUserSettings} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Select value={security.sessionTimeout.toString()} onValueChange={(value) => setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={security.loginNotifications}
                      onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginNotifications: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data Management</h4>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={exportUserData}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                    
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={saveUserSettings} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Security Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Management - Admin Only */}
          {activeSection === 'user-management' && hasRole(['admin', 'owner']) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage team members and send invitations (Admin access required)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    This section is only available to administrators. Use the Admin panel for full user management features.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Quick Invite</Label>
                      <p className="text-sm text-muted-foreground">Send a quick invitation to a new team member</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Go to Admin Panel
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="user@company.com"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Use Admin panel for invitations</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="recruiter">Recruiter</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button disabled className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Send Invitation (Use Admin Panel)
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Team Overview</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">-</div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">-</div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">-</div>
                      <div className="text-sm text-gray-600">Pending Invites</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Detailed user management is available in the Admin panel
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalSettings;