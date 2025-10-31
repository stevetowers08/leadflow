-- User Notifications Migration
-- Migration: create_user_notifications
-- Date: 2025-12-02
-- Description: Creates in-app notification system for users with high-priority notifications

-- =======================
-- PART 1: Notifications Table
-- =======================

CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification content
  type TEXT NOT NULL CHECK (type IN (
    'new_jobs_discovered',
    'email_response_received',
    'meeting_reminder',
    'follow_up_reminder'
  )),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'high',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Navigation/action data
  action_type TEXT CHECK (action_type IN ('navigate', 'none')),
  action_url TEXT,
  action_entity_type TEXT CHECK (action_entity_type IN ('job', 'person', 'company', 'campaign', 'page')),
  action_entity_id UUID,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =======================
-- PART 2: Enable RLS
-- =======================

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON public.user_notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own notifications (for system-generated ones)
CREATE POLICY "Users can insert their own notifications" ON public.user_notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON public.user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can manage all notifications (for system triggers)
CREATE POLICY "Service role can manage all notifications" ON public.user_notifications
  FOR ALL USING (true);

-- =======================
-- PART 3: Indexes for Performance
-- =======================

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON public.user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON public.user_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON public.user_notifications(type);
CREATE INDEX IF NOT EXISTS idx_user_notifications_priority ON public.user_notifications(priority);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read ON public.user_notifications(user_id, is_read);

-- Composite index for common queries (unread count, recent notifications)
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_created_read 
  ON public.user_notifications(user_id, created_at DESC) 
  WHERE is_read = false;

-- =======================
-- PART 4: Helper Functions
-- =======================

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.user_notifications
  SET 
    is_read = true,
    read_at = now()
  WHERE 
    id = notification_id 
    AND user_id = auth.uid()
    AND is_read = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.user_notifications
  SET 
    is_read = true,
    read_at = now()
  WHERE 
    user_id = auth.uid()
    AND is_read = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.user_notifications
    WHERE user_id = auth.uid()
      AND is_read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count TO authenticated;

-- =======================
-- PART 5: Notification Triggers for Events
-- =======================

-- Function to create notification when new jobs are discovered
CREATE OR REPLACE FUNCTION public.notify_new_jobs_discovered()
RETURNS TRIGGER AS $$
DECLARE
  job_count INTEGER;
  client_id_val UUID;
  user_ids UUID[];
BEGIN
  -- Get client_id from the job (assuming jobs have client_id or discovered_by_client_id)
  client_id_val := COALESCE(NEW.client_id, NEW.discovered_by_client_id);
  
  -- If job was discovered by a client, notify all users in that client
  IF client_id_val IS NOT NULL THEN
    -- Get all user_ids for this client
    SELECT array_agg(user_id) INTO user_ids
    FROM public.client_users
    WHERE client_id = client_id_val;
    
    -- Count new jobs for this client today
    SELECT COUNT(*) INTO job_count
    FROM public.jobs
    WHERE COALESCE(client_id, discovered_by_client_id) = client_id_val
      AND DATE(created_at) = CURRENT_DATE
      AND qualification_status = 'new';
    
    -- Only notify if there are new jobs and we have users
    IF job_count > 0 AND user_ids IS NOT NULL THEN
      -- Create notifications for each user (but limit to avoid spam)
      -- Only notify once per day per client
      FOR i IN 1..LEAST(array_length(user_ids, 1), 10) LOOP
        -- Check if notification already exists today for this user and client
        IF NOT EXISTS (
          SELECT 1 FROM public.user_notifications
          WHERE user_id = user_ids[i]
            AND type = 'new_jobs_discovered'
            AND DATE(created_at) = CURRENT_DATE
            AND metadata->>'client_id' = client_id_val::text
        ) THEN
          INSERT INTO public.user_notifications (
            user_id,
            type,
            priority,
            title,
            message,
            action_type,
            action_url,
            action_entity_type,
            metadata
          ) VALUES (
            user_ids[i],
            'new_jobs_discovered',
            'high',
            CASE 
              WHEN job_count = 1 THEN '1 New Job Discovered'
              ELSE job_count || ' New Jobs Discovered'
            END,
            CASE 
              WHEN job_count = 1 THEN 'A new job has been discovered and is ready for review.'
              ELSE job_count || ' new jobs have been discovered and are ready for review.'
            END,
            'navigate',
            '/jobs?status=new',
            'page',
            jsonb_build_object(
              'job_count', job_count,
              'client_id', client_id_val
            )
          );
        END IF;
      END LOOP;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new jobs (only on INSERT with qualification_status='new')
DROP TRIGGER IF EXISTS trigger_notify_new_jobs ON public.jobs;
CREATE TRIGGER trigger_notify_new_jobs
  AFTER INSERT ON public.jobs
  FOR EACH ROW
  WHEN (NEW.qualification_status = 'new')
  EXECUTE FUNCTION public.notify_new_jobs_discovered();

-- Note: For bulk job inserts, consider batching notifications or using a scheduled function
-- instead of per-row triggers to avoid notification spam

