-- Fix last_activity calculation to only use actual email activity
-- Migration: fix_last_activity_calculation
-- Date: 2025-01-30
-- Description: Recalculate last_activity based only on real email sends and replies, NULL if no activity

-- ========================
-- PART 1: Reset and recalculate people.last_activity
-- ========================

-- First, set to NULL
UPDATE public.people SET last_activity = NULL;

-- Update with most recent email activity (only if it exists)
UPDATE public.people p
SET last_activity = (
  SELECT MAX(activity_date)
  FROM (
    -- Email sends
    SELECT es.sent_at AS activity_date
    FROM public.email_sends es
    WHERE es.person_id = p.id
      AND es.status IN ('sent', 'delivered')
      AND es.sent_at IS NOT NULL
    
    UNION ALL
    
    -- Email replies
    SELECT er.received_at AS activity_date
    FROM public.email_replies er
    WHERE er.person_id = p.id
      AND er.received_at IS NOT NULL
    
    UNION ALL
    
    -- Interactions
    SELECT i.occurred_at AS activity_date
    FROM public.interactions i
    WHERE i.person_id = p.id
      AND i.occurred_at IS NOT NULL
  ) AS all_activities
)
WHERE EXISTS (
  -- Only update people who have actual email activity
  SELECT 1 FROM public.email_sends es WHERE es.person_id = p.id AND es.status IN ('sent', 'delivered')
  UNION
  SELECT 1 FROM public.email_replies er WHERE er.person_id = p.id
  UNION
  SELECT 1 FROM public.interactions i WHERE i.person_id = p.id
);

-- ========================
-- PART 2: Reset and recalculate companies.last_activity
-- ========================

-- First, set to NULL
UPDATE public.companies SET last_activity = NULL;

-- Update with most recent activity from their people
UPDATE public.companies c
SET last_activity = (
  SELECT MAX(activity_date)
  FROM (
    -- Email sends for people in this company
    SELECT es.sent_at AS activity_date
    FROM public.email_sends es
    INNER JOIN public.people p ON es.person_id = p.id
    WHERE p.company_id = c.id
      AND es.status IN ('sent', 'delivered')
      AND es.sent_at IS NOT NULL
    
    UNION ALL
    
    -- Email replies for this company
    SELECT er.received_at AS activity_date
    FROM public.email_replies er
    WHERE er.company_id = c.id
      AND er.received_at IS NOT NULL
    
    UNION ALL
    
    -- Email replies for people in this company
    SELECT er2.received_at AS activity_date
    FROM public.email_replies er2
    INNER JOIN public.people p2 ON er2.person_id = p2.id
    WHERE p2.company_id = c.id
      AND er2.received_at IS NOT NULL
    
    UNION ALL
    
    -- Interactions for people in this company
    SELECT i.occurred_at AS activity_date
    FROM public.interactions i
    INNER JOIN public.people p3 ON i.person_id = p3.id
    WHERE p3.company_id = c.id
      AND i.occurred_at IS NOT NULL
  ) AS all_company_activities
)
WHERE EXISTS (
  -- Only update companies that have people with email activity
  SELECT 1 FROM public.email_sends es 
  INNER JOIN public.people p ON es.person_id = p.id 
  WHERE p.company_id = c.id AND es.status IN ('sent', 'delivered')
  UNION
  SELECT 1 FROM public.email_replies er WHERE er.company_id = c.id
  UNION
  SELECT 1 FROM public.email_replies er2 
  INNER JOIN public.people p2 ON er2.person_id = p2.id 
  WHERE p2.company_id = c.id
  UNION
  SELECT 1 FROM public.interactions i 
  INNER JOIN public.people p3 ON i.person_id = p3.id 
  WHERE p3.company_id = c.id
);

COMMENT ON COLUMN public.people.last_activity IS 'Most recent actual outreach activity - based only on email sends, replies, and interactions. NULL if no activity recorded.';
COMMENT ON COLUMN public.companies.last_activity IS 'Most recent actual outreach activity for people in this company - based on email sends, replies, and interactions. NULL if no activity recorded.';

