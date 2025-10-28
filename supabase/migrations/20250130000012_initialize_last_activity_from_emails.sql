-- Initialize last_activity from actual email activity
-- Migration: initialize_last_activity_from_emails
-- Date: 2025-01-30
-- Description: Populate last_activity based on actual email sends and replies

-- ========================
-- PART 1: Initialize people.last_activity from email activity
-- ========================

UPDATE public.people
SET last_activity = (
  SELECT MAX(activity_date)
  FROM (
    -- Get the most recent email send
    SELECT sent_at AS activity_date
    FROM public.email_sends
    WHERE person_id = public.people.id
      AND (status = 'sent' OR status = 'delivered')
    
    UNION ALL
    
    -- Get the most recent email reply
    SELECT received_at AS activity_date
    FROM public.email_replies
    WHERE person_id = public.people.id
    
    UNION ALL
    
    -- Get the most recent interaction
    SELECT occurred_at AS activity_date
    FROM public.interactions
    WHERE person_id = public.people.id
    
    UNION ALL
    
    -- Fallback to last_interaction_at or created_at
    SELECT last_interaction_at AS activity_date
    WHERE last_interaction_at IS NOT NULL
    
    UNION ALL
    
    SELECT created_at AS activity_date
  ) AS all_activities
)
WHERE last_activity IS NULL;

-- ========================
-- PART 2: Initialize companies.last_activity from their people's email activity
-- ========================

UPDATE public.companies
SET last_activity = (
  SELECT MAX(activity_date)
  FROM (
    -- Get the most recent email send for people in this company
    SELECT es.sent_at AS activity_date
    FROM public.email_sends es
    INNER JOIN public.people p ON es.person_id = p.id
    WHERE p.company_id = public.companies.id
      AND (es.status = 'sent' OR es.status = 'delivered')
    
    UNION ALL
    
    -- Get the most recent email reply
    SELECT er.received_at AS activity_date
    FROM public.email_replies er
    WHERE er.company_id = public.companies.id
    
    UNION ALL
    
    -- Get most recent reply for people in this company
    SELECT er2.received_at AS activity_date
    FROM public.email_replies er2
    INNER JOIN public.people p2 ON er2.person_id = p2.id
    WHERE p2.company_id = public.companies.id
    
    UNION ALL
    
    -- Get the most recent interaction for people in this company
    SELECT i.occurred_at AS activity_date
    FROM public.interactions i
    INNER JOIN public.people p3 ON i.person_id = p3.id
    WHERE p3.company_id = public.companies.id
    
    UNION ALL
    
    -- Fallback to updated_at
    SELECT updated_at AS activity_date
    WHERE updated_at IS NOT NULL
  ) AS all_company_activities
)
WHERE last_activity IS NULL;

COMMENT ON COLUMN public.people.last_activity IS 'Most recent outreach activity - based on email sends, replies, and interactions';
COMMENT ON COLUMN public.companies.last_activity IS 'Most recent outreach activity for people in this company - based on email sends, replies, and interactions';

