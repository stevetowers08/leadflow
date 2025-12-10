import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getErrorMessage } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ProfileSettings = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load current profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        setInitialLoad(true);

        // Get user metadata from auth
        const authName =
          user.user_metadata?.full_name || user.user_metadata?.name || '';
        const authEmail = user.email || '';

        setFullName(authName);
        setEmail(authEmail);

        // Also try to fetch from user_profiles table
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .maybeSingle();

        // Handle profile fetch - 406 or missing profile is OK, use auth data
        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is fine
          console.warn('Profile fetch warning:', getErrorMessage(profileError), profileError);
        }

        if (profile) {
          setFullName(profile.full_name || authName);
          setEmail(profile.email || authEmail);
        }
      } catch (err) {
        console.error('Error loading profile:', getErrorMessage(err), err);
      } finally {
        setInitialLoad(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update Supabase Auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        },
      });

      if (authError) throw authError;

      // Update user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        console.warn('Profile table update failed:', profileError);
        // Don't fail the whole operation if this fails
      }

      setSuccess(true);
      toast.success('Profile updated successfully');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold text-foreground mb-2'>
          Your Profile
        </h2>
        <p className='text-sm text-muted-foreground'>
          Manage your personal information and account details
        </p>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className='border-green-500 bg-success/10'>
          <CheckCircle2 className='h-4 w-4 text-success' />
          <AlertDescription className='text-success'>
            Profile updated successfully
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your account profile information
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='full-name'>Full Name</Label>
            <Input
              id='full-name'
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder='Enter your full name'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              type='email'
              value={email}
              disabled
              className='bg-muted'
              placeholder='Email address'
            />
            <p className='text-xs text-muted-foreground'>
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <div className='flex justify-end'>
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
