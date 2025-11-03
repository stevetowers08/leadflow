-- Extend user_notifications.type allowed values to include company_enriched
-- Date: 2025-12-02

ALTER TABLE public.user_notifications
  DROP CONSTRAINT IF EXISTS user_notifications_type_check;

ALTER TABLE public.user_notifications
  ADD CONSTRAINT user_notifications_type_check
  CHECK (type IN (
    'new_jobs_discovered',
    'email_response_received',
    'meeting_reminder',
    'follow_up_reminder',
    'company_enriched'
  ));












