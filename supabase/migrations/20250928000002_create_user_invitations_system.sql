-- Create User Invitations System
-- Migration: create_user_invitations_system
-- Date: 2025-09-28
-- Description: Add proper user invitation system with email tracking and limits

-- Create invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'recruiter', 'viewer')),
    invited_by UUID NOT NULL REFERENCES auth.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    accepted_at TIMESTAMP WITH TIME ZONE,
    accepted_by UUID REFERENCES auth.users(id),
    token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);
CREATE INDEX IF NOT EXISTS idx_invitations_invited_by ON public.invitations(invited_by);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invitations
CREATE POLICY "Users can view invitations they sent" 
ON public.invitations FOR SELECT 
USING (invited_by = auth.uid());

CREATE POLICY "Admins and owners can view all invitations" 
ON public.invitations FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can create invitations" 
ON public.invitations FOR INSERT 
WITH CHECK (
    invited_by = auth.uid()
    AND
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Users can update invitations they sent" 
ON public.invitations FOR UPDATE 
USING (invited_by = auth.uid())
WITH CHECK (invited_by = auth.uid());

CREATE POLICY "Admins and owners can update any invitation" 
ON public.invitations FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Only owners can delete invitations" 
ON public.invitations FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role = 'owner'
    )
);

-- Add user limit enforcement function
CREATE OR REPLACE FUNCTION check_user_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    user_limit INTEGER;
    user_role TEXT;
BEGIN
    -- Get the inviting user's profile
    SELECT up.user_limit, up.role INTO user_limit, user_role
    FROM public.user_profiles up
    WHERE up.id = NEW.invited_by;
    
    -- If user doesn't have a limit (owner), allow
    IF user_limit IS NULL OR user_limit = 0 THEN
        RETURN NEW;
    END IF;
    
    -- Count current active users (including pending invitations)
    SELECT COUNT(*) INTO current_count
    FROM (
        SELECT id FROM public.user_profiles WHERE is_active = true
        UNION
        SELECT accepted_by FROM public.invitations WHERE status = 'pending' AND accepted_by IS NOT NULL
    ) active_users;
    
    -- Check if adding this invitation would exceed the limit
    IF current_count >= user_limit THEN
        RAISE EXCEPTION 'User limit exceeded. Current users: %, Limit: %', current_count, user_limit;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce user limits
CREATE TRIGGER check_user_limit_trigger
    BEFORE INSERT ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION check_user_limit();

-- Add function to clean up expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
    UPDATE public.invitations 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Add function to accept invitation
CREATE OR REPLACE FUNCTION accept_invitation(invitation_token TEXT, user_id UUID)
RETURNS JSON AS $$
DECLARE
    invitation_record RECORD;
    user_profile RECORD;
BEGIN
    -- Get the invitation
    SELECT * INTO invitation_record
    FROM public.invitations
    WHERE token = invitation_token
    AND status = 'pending'
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid or expired invitation');
    END IF;
    
    -- Check if user already exists
    SELECT * INTO user_profile
    FROM public.user_profiles
    WHERE id = user_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User already exists');
    END IF;
    
    -- Create user profile
    INSERT INTO public.user_profiles (
        id, email, full_name, role, is_active, created_at, updated_at
    ) VALUES (
        user_id, 
        invitation_record.email,
        invitation_record.email,
        invitation_record.role,
        true,
        NOW(),
        NOW()
    );
    
    -- Update invitation status
    UPDATE public.invitations
    SET status = 'accepted', accepted_at = NOW(), accepted_by = user_id, updated_at = NOW()
    WHERE id = invitation_record.id;
    
    RETURN json_build_object('success', true, 'role', invitation_record.role);
END;
$$ LANGUAGE plpgsql;

-- Add RLS policy for user_profiles to allow invitation acceptance
CREATE POLICY "Allow invitation acceptance" 
ON public.user_profiles FOR INSERT 
WITH CHECK (
    -- Allow if this is an invitation acceptance
    EXISTS (
        SELECT 1 FROM public.invitations i
        WHERE i.email = user_profiles.email
        AND i.status = 'pending'
        AND i.expires_at > NOW()
    )
);
