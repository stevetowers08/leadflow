-- Fix Critical RLS Security Vulnerabilities
-- Migration: fix_critical_rls_security
-- Date: 2025-09-28
-- Description: Replace overly permissive RLS policies with role-based security

-- First, let's check if we have owner_id columns in our tables
-- If not, we'll need to add them for proper data isolation

-- Add owner_id columns if they don't exist
DO $$ 
BEGIN
    -- Add owner_id to companies if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'owner_id') THEN
        ALTER TABLE public.companies ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
    
    -- Add owner_id to people if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'people' AND column_name = 'owner_id') THEN
        ALTER TABLE public.people ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
    
    -- Add owner_id to jobs if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'jobs' AND column_name = 'owner_id') THEN
        ALTER TABLE public.jobs ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
    
    -- Add owner_id to interactions if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'interactions' AND column_name = 'owner_id') THEN
        ALTER TABLE public.interactions ADD COLUMN owner_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Set default owner_id for existing records (assign to first owner)
UPDATE public.companies SET owner_id = (
    SELECT id FROM public.user_profiles WHERE role = 'owner' LIMIT 1
) WHERE owner_id IS NULL;

UPDATE public.people SET owner_id = (
    SELECT id FROM public.user_profiles WHERE role = 'owner' LIMIT 1
) WHERE owner_id IS NULL;

UPDATE public.jobs SET owner_id = (
    SELECT id FROM public.user_profiles WHERE role = 'owner' LIMIT 1
) WHERE owner_id IS NULL;

UPDATE public.interactions SET owner_id = (
    SELECT id FROM public.user_profiles WHERE role = 'owner' LIMIT 1
) WHERE owner_id IS NULL;

-- Make owner_id NOT NULL after setting defaults
ALTER TABLE public.companies ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.people ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.jobs ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.interactions ALTER COLUMN owner_id SET NOT NULL;

-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Users can view companies" ON public.companies;
DROP POLICY IF EXISTS "Users can insert companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Users can delete companies" ON public.companies;

DROP POLICY IF EXISTS "Users can view people" ON public.people;
DROP POLICY IF EXISTS "Users can insert people" ON public.people;
DROP POLICY IF EXISTS "Users can update people" ON public.people;
DROP POLICY IF EXISTS "Users can delete people" ON public.people;

DROP POLICY IF EXISTS "Users can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can delete jobs" ON public.jobs;

DROP POLICY IF EXISTS "Allow authenticated users to view interactions" ON public.interactions;
DROP POLICY IF EXISTS "Allow authenticated users to insert interactions" ON public.interactions;
DROP POLICY IF EXISTS "Allow authenticated users to update interactions" ON public.interactions;
DROP POLICY IF EXISTS "Allow authenticated users to delete interactions" ON public.interactions;

-- Create secure role-based policies for COMPANIES
CREATE POLICY "Users can view companies" 
ON public.companies FOR SELECT 
USING (
    -- Users can view their own companies
    owner_id = auth.uid()
    OR
    -- Admins and owners can view all companies
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can insert companies" 
ON public.companies FOR INSERT 
WITH CHECK (
    -- Users can only create companies for themselves
    owner_id = auth.uid()
    OR
    -- Admins and owners can create companies for anyone
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can update companies" 
ON public.companies FOR UPDATE 
USING (
    -- Users can update their own companies
    owner_id = auth.uid()
    OR
    -- Admins and owners can update any company
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
)
WITH CHECK (
    -- Same conditions for the updated record
    owner_id = auth.uid()
    OR
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can delete companies" 
ON public.companies FOR DELETE 
USING (
    -- Users can delete their own companies
    owner_id = auth.uid()
    OR
    -- Only owners can delete any company
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role = 'owner'
    )
);

-- Create secure role-based policies for PEOPLE
CREATE POLICY "Users can view people" 
ON public.people FOR SELECT 
USING (
    -- Users can view people from their own companies
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = people.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can view all people
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can insert people" 
ON public.people FOR INSERT 
WITH CHECK (
    -- Users can create people for their own companies
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = people.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can create people for any company
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can update people" 
ON public.people FOR UPDATE 
USING (
    -- Users can update people from their own companies
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = people.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can update any person
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
)
WITH CHECK (
    -- Same conditions for the updated record
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = people.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can delete people" 
ON public.people FOR DELETE 
USING (
    -- Users can delete people from their own companies
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = people.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Only owners can delete any person
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role = 'owner'
    )
);

-- Create secure role-based policies for JOBS
CREATE POLICY "Users can view jobs" 
ON public.jobs FOR SELECT 
USING (
    -- Users can view jobs from their own companies
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = jobs.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can view all jobs
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can insert jobs" 
ON public.jobs FOR INSERT 
WITH CHECK (
    -- Users can create jobs for their own companies
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = jobs.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can create jobs for any company
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can update jobs" 
ON public.jobs FOR UPDATE 
USING (
    -- Users can update jobs from their own companies
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = jobs.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can update any job
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
)
WITH CHECK (
    -- Same conditions for the updated record
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = jobs.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can delete jobs" 
ON public.jobs FOR DELETE 
USING (
    -- Users can delete jobs from their own companies
    EXISTS (
        SELECT 1 FROM public.companies c 
        WHERE c.id = jobs.company_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Only owners can delete any job
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role = 'owner'
    )
);

-- Create secure role-based policies for INTERACTIONS
CREATE POLICY "Users can view interactions" 
ON public.interactions FOR SELECT 
USING (
    -- Users can view interactions for people from their own companies
    EXISTS (
        SELECT 1 FROM public.people p
        JOIN public.companies c ON c.id = p.company_id
        WHERE p.id = interactions.person_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can view all interactions
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can insert interactions" 
ON public.interactions FOR INSERT 
WITH CHECK (
    -- Users can create interactions for people from their own companies
    EXISTS (
        SELECT 1 FROM public.people p
        JOIN public.companies c ON c.id = p.company_id
        WHERE p.id = interactions.person_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can create interactions for any person
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can update interactions" 
ON public.interactions FOR UPDATE 
USING (
    -- Users can update interactions for people from their own companies
    EXISTS (
        SELECT 1 FROM public.people p
        JOIN public.companies c ON c.id = p.company_id
        WHERE p.id = interactions.person_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Admins and owners can update any interaction
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
)
WITH CHECK (
    -- Same conditions for the updated record
    EXISTS (
        SELECT 1 FROM public.people p
        JOIN public.companies c ON c.id = p.company_id
        WHERE p.id = interactions.person_id 
        AND c.owner_id = auth.uid()
    )
    OR
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can delete interactions" 
ON public.interactions FOR DELETE 
USING (
    -- Users can delete interactions for people from their own companies
    EXISTS (
        SELECT 1 FROM public.people p
        JOIN public.companies c ON c.id = p.company_id
        WHERE p.id = interactions.person_id 
        AND c.owner_id = auth.uid()
    )
    OR
    -- Only owners can delete any interaction
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role = 'owner'
    )
);
