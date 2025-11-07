import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    newJobsDiscovered: true,
    responsesReceived: true,
    meetingReminders: true,
    weeklyDigest: false,
  });

  const handleSave = async () => {
    setLoading(true);
    // TODO: Save to database
    setTimeout(() => {
      setLoading(false);
      toast.success('Notification preferences saved');
    }, 500);
  };

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold text-foreground mb-2'>
          Notifications
        </h2>
        <p className='text-sm text-muted-foreground'>
          Configure how and when you receive notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Email Notifications */}
          <div className='flex items-center justify-between py-2'>
            <div className='space-y-0.5'>
              <Label>Email Notifications</Label>
              <p className='text-sm text-muted-foreground'>
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          {/* In-App Notifications */}
          <div className='flex items-center justify-between py-2'>
            <div className='space-y-0.5'>
              <Label>In-App Notifications</Label>
              <p className='text-sm text-muted-foreground'>
                Show notifications in the app
              </p>
            </div>
            <Switch
              checked={notifications.inAppNotifications}
              onCheckedChange={() => handleToggle('inAppNotifications')}
            />
          </div>

          <div className='border-t pt-4 space-y-4'>
            <h3 className='text-sm font-medium'>What to notify about:</h3>

            {/* New Jobs */}
            <div className='flex items-center justify-between py-2'>
              <div className='space-y-0.5'>
                <Label>New Jobs Discovered</Label>
                <p className='text-sm text-muted-foreground'>
                  Alert when new matching jobs are found
                </p>
              </div>
              <Switch
                checked={notifications.newJobsDiscovered}
                onCheckedChange={() => handleToggle('newJobsDiscovered')}
              />
            </div>

            {/* Responses */}
            <div className='flex items-center justify-between py-2'>
              <div className='space-y-0.5'>
                <Label>Responses Received</Label>
                <p className='text-sm text-muted-foreground'>
                  Alert when decision makers respond
                </p>
              </div>
              <Switch
                checked={notifications.responsesReceived}
                onCheckedChange={() => handleToggle('responsesReceived')}
              />
            </div>

            {/* Meeting Reminders */}
            <div className='flex items-center justify-between py-2'>
              <div className='space-y-0.5'>
                <Label>Meeting Reminders</Label>
                <p className='text-sm text-muted-foreground'>
                  Remind about scheduled meetings
                </p>
              </div>
              <Switch
                checked={notifications.meetingReminders}
                onCheckedChange={() => handleToggle('meetingReminders')}
              />
            </div>

            {/* Weekly Digest */}
            <div className='flex items-center justify-between py-2'>
              <div className='space-y-0.5'>
                <Label>Weekly Digest</Label>
                <p className='text-sm text-muted-foreground'>
                  Receive a weekly summary of activity
                </p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={() => handleToggle('weeklyDigest')}
              />
            </div>
          </div>

          <div className='flex justify-end'>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className='mr-2 h-4 w-4' />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
