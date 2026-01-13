-- Migration: Optimize leads delete RLS policy
-- Date: 2026-01-20
-- Description: Add TO authenticated to delete policy for better performance

-- Update delete policy to specify authenticated role (performance best practice)
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
CREATE POLICY "Users can delete own leads" ON public.leads
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
