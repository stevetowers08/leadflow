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
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Building2, CheckCircle2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BusinessProfile {
  id: string;
  user_id: string;
  company_name: string;
  industry: string | null;
  target_audience: string | null;
  ideal_customer_profile: Record<string, unknown> | null;
  business_goals: string | null;
}

const BusinessProfileSettings = () => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [businessGoals, setBusinessGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load current business profile
  useEffect(() => {
    const loadBusinessProfile = async () => {
      if (!user) return;

      try {
        setInitialLoad(true);

        const { data, error: fetchError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is fine
          console.error('Error loading business profile:', fetchError);
          return;
        }

        if (data) {
          setCompanyName(data.company_name || '');
          setIndustry(data.industry || '');
          setTargetAudience(data.target_audience || '');
          setBusinessGoals(data.business_goals || '');
        }
      } catch (err) {
        console.error('Error loading business profile:', err);
      } finally {
        setInitialLoad(false);
      }
    };

    loadBusinessProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    if (!companyName.trim()) {
      setError('Company name is required');
      toast.error('Company name is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const profileData = {
        user_id: user.id,
        company_name: companyName,
        industry: industry || null,
        target_audience: targetAudience || null,
        business_goals: businessGoals || null,
        ideal_customer_profile: {},
        updated_at: new Date().toISOString(),
      };

      let error: Error | null = null;

      if (existing) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('business_profiles')
          .update(profileData)
          .eq('user_id', user.id);

        error = updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('business_profiles')
          .insert(profileData);

        error = insertError;
      }

      if (error) throw error;

      setSuccess(true);
      toast.success('Business profile updated successfully');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update business profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-6 w-6 animate-spin text-gray-400' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          Business Profile
        </h2>
        <p className='text-sm text-gray-600'>
          Configure your business profile and targeting criteria for better lead
          qualification
        </p>
      </div>

      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className='border-green-500 bg-green-50'>
          <CheckCircle2 className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-700'>
            Business profile updated successfully
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Building2 className='h-5 w-5' />
            <CardTitle>Company Information</CardTitle>
          </div>
          <CardDescription>
            Provide details about your business to improve targeting
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='company-name'>Company Name *</Label>
            <Input
              id='company-name'
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              placeholder='Enter your company name'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='industry'>Industry</Label>
            <Input
              id='industry'
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder='e.g., Technology, Healthcare, Finance'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='target-audience'>Target Audience</Label>
            <Textarea
              id='target-audience'
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder='Describe your ideal customer or target audience'
              rows={3}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='business-goals'>Business Goals</Label>
            <Textarea
              id='business-goals'
              value={businessGoals}
              onChange={e => setBusinessGoals(e.target.value)}
              placeholder='What are your main business objectives?'
              rows={3}
            />
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

export default BusinessProfileSettings;
