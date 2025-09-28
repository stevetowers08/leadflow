-- Add Admin-Only Operations
-- Migration: add_admin_operations
-- Date: 2025-09-28
-- Description: Add admin-only operations and functions

-- Create admin operations log table
CREATE TABLE IF NOT EXISTS public.admin_operations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    operation_type TEXT NOT NULL,
    operation_data JSONB,
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    target_user_id UUID REFERENCES auth.users(id),
    success BOOLEAN NOT NULL DEFAULT true,
    error_message TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_operations_performed_by ON public.admin_operations(performed_by);
CREATE INDEX IF NOT EXISTS idx_admin_operations_type ON public.admin_operations(operation_type);
CREATE INDEX IF NOT EXISTS idx_admin_operations_date ON public.admin_operations(performed_at);

-- Enable RLS
ALTER TABLE public.admin_operations ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin operations
CREATE POLICY "Only admins and owners can view admin operations" 
ON public.admin_operations FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

CREATE POLICY "Only admins and owners can create admin operations" 
ON public.admin_operations FOR INSERT 
WITH CHECK (
    performed_by = auth.uid()
    AND
    EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'owner')
    )
);

-- Function to promote user to admin (owner only)
CREATE OR REPLACE FUNCTION promote_user_to_admin(target_user_id UUID, promoter_id UUID)
RETURNS JSON AS $$
DECLARE
    promoter_role TEXT;
    target_user_email TEXT;
    operation_id UUID;
BEGIN
    -- Check if promoter is owner
    SELECT role INTO promoter_role
    FROM public.user_profiles
    WHERE id = promoter_id;
    
    IF promoter_role != 'owner' THEN
        RETURN json_build_object('success', false, 'error', 'Only owners can promote users to admin');
    END IF;
    
    -- Get target user email
    SELECT email INTO target_user_email
    FROM public.user_profiles
    WHERE id = target_user_id;
    
    IF target_user_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Update user role
    UPDATE public.user_profiles
    SET role = 'admin', updated_at = NOW()
    WHERE id = target_user_id;
    
    -- Log the operation
    INSERT INTO public.admin_operations (operation_type, operation_data, performed_by, target_user_id)
    VALUES (
        'promote_to_admin',
        json_build_object('target_email', target_user_email, 'new_role', 'admin'),
        promoter_id,
        target_user_id
    ) RETURNING id INTO operation_id;
    
    RETURN json_build_object('success', true, 'operation_id', operation_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to demote admin to recruiter (owner only)
CREATE OR REPLACE FUNCTION demote_admin_to_recruiter(target_user_id UUID, demoter_id UUID)
RETURNS JSON AS $$
DECLARE
    demoter_role TEXT;
    target_user_role TEXT;
    target_user_email TEXT;
    operation_id UUID;
BEGIN
    -- Check if demoter is owner
    SELECT role INTO demoter_role
    FROM public.user_profiles
    WHERE id = demoter_id;
    
    IF demoter_role != 'owner' THEN
        RETURN json_build_object('success', false, 'error', 'Only owners can demote admins');
    END IF;
    
    -- Check target user role
    SELECT role, email INTO target_user_role, target_user_email
    FROM public.user_profiles
    WHERE id = target_user_id;
    
    IF target_user_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    IF target_user_role != 'admin' THEN
        RETURN json_build_object('success', false, 'error', 'User is not an admin');
    END IF;
    
    -- Update user role
    UPDATE public.user_profiles
    SET role = 'recruiter', updated_at = NOW()
    WHERE id = target_user_id;
    
    -- Log the operation
    INSERT INTO public.admin_operations (operation_type, operation_data, performed_by, target_user_id)
    VALUES (
        'demote_admin',
        json_build_object('target_email', target_user_email, 'new_role', 'recruiter'),
        demoter_id,
        target_user_id
    ) RETURNING id INTO operation_id;
    
    RETURN json_build_object('success', true, 'operation_id', operation_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deactivate user (admin/owner only)
CREATE OR REPLACE FUNCTION deactivate_user(target_user_id UUID, deactivator_id UUID)
RETURNS JSON AS $$
DECLARE
    deactivator_role TEXT;
    target_user_email TEXT;
    operation_id UUID;
BEGIN
    -- Check if deactivator has permission
    SELECT role INTO deactivator_role
    FROM public.user_profiles
    WHERE id = deactivator_id;
    
    IF deactivator_role NOT IN ('admin', 'owner') THEN
        RETURN json_build_object('success', false, 'error', 'Only admins and owners can deactivate users');
    END IF;
    
    -- Get target user email
    SELECT email INTO target_user_email
    FROM public.user_profiles
    WHERE id = target_user_id;
    
    IF target_user_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Update user status
    UPDATE public.user_profiles
    SET is_active = false, updated_at = NOW()
    WHERE id = target_user_id;
    
    -- Log the operation
    INSERT INTO public.admin_operations (operation_type, operation_data, performed_by, target_user_id)
    VALUES (
        'deactivate_user',
        json_build_object('target_email', target_user_email),
        deactivator_id,
        target_user_id
    ) RETURNING id INTO operation_id;
    
    RETURN json_build_object('success', true, 'operation_id', operation_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reactivate user (admin/owner only)
CREATE OR REPLACE FUNCTION reactivate_user(target_user_id UUID, reactivator_id UUID)
RETURNS JSON AS $$
DECLARE
    reactivator_role TEXT;
    target_user_email TEXT;
    operation_id UUID;
BEGIN
    -- Check if reactivator has permission
    SELECT role INTO reactivator_role
    FROM public.user_profiles
    WHERE id = reactivator_id;
    
    IF reactivator_role NOT IN ('admin', 'owner') THEN
        RETURN json_build_object('success', false, 'error', 'Only admins and owners can reactivate users');
    END IF;
    
    -- Get target user email
    SELECT email INTO target_user_email
    FROM public.user_profiles
    WHERE id = target_user_id;
    
    IF target_user_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Update user status
    UPDATE public.user_profiles
    SET is_active = true, updated_at = NOW()
    WHERE id = target_user_id;
    
    -- Log the operation
    INSERT INTO public.admin_operations (operation_type, operation_data, performed_by, target_user_id)
    VALUES (
        'reactivate_user',
        json_build_object('target_email', target_user_email),
        reactivator_id,
        target_user_id
    ) RETURNING id INTO operation_id;
    
    RETURN json_build_object('success', true, 'operation_id', operation_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user limit (owner only)
CREATE OR REPLACE FUNCTION update_user_limit(target_user_id UUID, new_limit INTEGER, updater_id UUID)
RETURNS JSON AS $$
DECLARE
    updater_role TEXT;
    target_user_email TEXT;
    operation_id UUID;
BEGIN
    -- Check if updater is owner
    SELECT role INTO updater_role
    FROM public.user_profiles
    WHERE id = updater_id;
    
    IF updater_role != 'owner' THEN
        RETURN json_build_object('success', false, 'error', 'Only owners can update user limits');
    END IF;
    
    -- Get target user email
    SELECT email INTO target_user_email
    FROM public.user_profiles
    WHERE id = target_user_id;
    
    IF target_user_email IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Update user limit
    UPDATE public.user_profiles
    SET user_limit = new_limit, updated_at = NOW()
    WHERE id = target_user_id;
    
    -- Log the operation
    INSERT INTO public.admin_operations (operation_type, operation_data, performed_by, target_user_id)
    VALUES (
        'update_user_limit',
        json_build_object('target_email', target_user_email, 'new_limit', new_limit),
        updater_id,
        target_user_id
    ) RETURNING id INTO operation_id;
    
    RETURN json_build_object('success', true, 'operation_id', operation_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin operations log
CREATE OR REPLACE FUNCTION get_admin_operations(requester_id UUID, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    operation_type TEXT,
    operation_data JSONB,
    performed_by_email TEXT,
    performed_at TIMESTAMP WITH TIME ZONE,
    target_user_email TEXT,
    success BOOLEAN,
    error_message TEXT
) AS $$
BEGIN
    -- Check if requester has permission
    IF NOT EXISTS (
        SELECT 1 FROM public.user_profiles up 
        WHERE up.id = requester_id 
        AND up.role IN ('admin', 'owner')
    ) THEN
        RAISE EXCEPTION 'Insufficient permissions';
    END IF;
    
    RETURN QUERY
    SELECT 
        ao.id,
        ao.operation_type,
        ao.operation_data,
        up_performer.email as performed_by_email,
        ao.performed_at,
        up_target.email as target_user_email,
        ao.success,
        ao.error_message
    FROM public.admin_operations ao
    LEFT JOIN public.user_profiles up_performer ON up_performer.id = ao.performed_by
    LEFT JOIN public.user_profiles up_target ON up_target.id = ao.target_user_id
    ORDER BY ao.performed_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
