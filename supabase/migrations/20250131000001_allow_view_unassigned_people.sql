-- Migration: Allow authenticated users to view unassigned people
-- Date: 2025-01-31
-- Reason: Currently, non-admin users can't see unassigned people, making 264 records invisible
-- Drop the existing policy
DROP POLICY IF EXISTS "Users can view people they own or admin/owner can view all" ON public.people;
-- Recreate with updated logic
CREATE POLICY "Users can view people they own or admin/owner can view all" ON public.people FOR
SELECT USING (
        -- Owner/Admin can view all people
        EXISTS (
            SELECT 1
            FROM public.user_profiles up
            WHERE up.id = auth.uid()
                AND up.role IN ('owner', 'admin')
                AND up.is_active = true
        )
        OR -- Users can view people assigned to them
        owner_id = auth.uid()
        OR -- All authenticated users can view unassigned people
        (
            auth.role() = 'authenticated'
            AND owner_id IS NULL
        )
    );