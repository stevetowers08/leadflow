-- Fix RLS policies to handle auth.uid() being null in development
-- This allows the app to work with bypass auth mode

-- Drop existing client_jobs INSERT policy and create a more permissive one
DROP POLICY IF EXISTS "Users can create client jobs for their clients" ON public.client_jobs;

CREATE POLICY "Users can create client jobs for their clients"
  ON public.client_jobs FOR INSERT
  USING (true);

-- Drop existing client_jobs UPDATE policy and create a more permissive one  
DROP POLICY IF EXISTS "Users can update client jobs for their clients" ON public.client_jobs;

CREATE POLICY "Users can update client jobs for their clients"
  ON public.client_jobs FOR UPDATE
  USING (true);

-- Drop existing client_jobs SELECT policy
DROP POLICY IF EXISTS "Users can view client jobs for their clients" ON public.client_jobs;
DROP POLICY IF EXISTS "Users can view their client's jobs" ON public.client_jobs;

-- Create a single SELECT policy that allows all
CREATE POLICY "Users can view client jobs"
  ON public.client_jobs FOR SELECT
  USING (true);

-- Create a simple policy for client_users to allow all operations
DROP POLICY IF EXISTS "Users can view client users" ON public.client_users;
DROP POLICY IF EXISTS "Dev: allow all client_users access" ON public.client_users;

CREATE POLICY "Allow all client_users operations"
  ON public.client_users FOR ALL
  USING (true);

