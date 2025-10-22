-- Create business_profiles table for storing user business targeting information
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  target_audience TEXT,
  ideal_customer_profile JSONB DEFAULT '{}'::jsonb,
  business_goals TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one profile per user
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own business profile" ON public.business_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business profile" ON public.business_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business profile" ON public.business_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business profile" ON public.business_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON public.business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_company_name ON public.business_profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_business_profiles_industry ON public.business_profiles(industry);

-- Create trigger for updated_at
CREATE TRIGGER update_business_profiles_updated_at 
  BEFORE UPDATE ON public.business_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

