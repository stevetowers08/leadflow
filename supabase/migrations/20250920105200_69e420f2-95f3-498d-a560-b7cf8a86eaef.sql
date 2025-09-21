-- New enums for Leads
CREATE TYPE public.confidence_level AS ENUM ('low', 'medium', 'high', 'very-high');
CREATE TYPE public.automation_status AS ENUM ('idle', 'queued', 'running', 'paused', 'completed', 'failed');
CREATE TYPE public.lead_source AS ENUM ('linkedin', 'email', 'referral', 'website', 'event', 'other');

-- Add enum columns to People
ALTER TABLE public."People" ADD COLUMN confidence_level_enum public.confidence_level;
ALTER TABLE public."People" ADD COLUMN automation_status_enum public.automation_status;
ALTER TABLE public."People" ADD COLUMN lead_source_enum public.lead_source;

-- Map existing text values where possible
UPDATE public."People" SET confidence_level_enum = 'low' WHERE LOWER("Confidence Level") = 'low';
UPDATE public."People" SET confidence_level_enum = 'medium' WHERE LOWER("Confidence Level") IN ('medium','med');
UPDATE public."People" SET confidence_level_enum = 'high' WHERE LOWER("Confidence Level") = 'high';
UPDATE public."People" SET confidence_level_enum = 'very-high' WHERE LOWER("Confidence Level") IN ('very high','very-high','veryhigh');

UPDATE public."People" SET automation_status_enum = 'idle' WHERE LOWER("Automation Status") = 'idle';
UPDATE public."People" SET automation_status_enum = 'queued' WHERE LOWER("Automation Status") = 'queued';
UPDATE public."People" SET automation_status_enum = 'running' WHERE LOWER("Automation Status") IN ('running','in progress','processing');
UPDATE public."People" SET automation_status_enum = 'paused' WHERE LOWER("Automation Status") = 'paused';
UPDATE public."People" SET automation_status_enum = 'completed' WHERE LOWER("Automation Status") IN ('completed','done','finished');
UPDATE public."People" SET automation_status_enum = 'failed' WHERE LOWER("Automation Status") IN ('failed','error');

UPDATE public."People" SET lead_source_enum = 'linkedin' WHERE LOWER("Lead Source") LIKE '%linkedin%';
UPDATE public."People" SET lead_source_enum = 'email' WHERE LOWER("Lead Source") LIKE '%email%';
UPDATE public."People" SET lead_source_enum = 'referral' WHERE LOWER("Lead Source") LIKE '%referral%';
UPDATE public."People" SET lead_source_enum = 'website' WHERE LOWER("Lead Source") LIKE '%website%' OR LOWER("Lead Source") LIKE '%site%';
UPDATE public."People" SET lead_source_enum = 'event' WHERE LOWER("Lead Source") LIKE '%event%' OR LOWER("Lead Source") LIKE '%conference%';
UPDATE public."People" SET lead_source_enum = 'other' WHERE lead_source_enum IS NULL AND "Lead Source" IS NOT NULL;

-- Indexes
CREATE INDEX idx_people_confidence_level_enum ON public."People"(confidence_level_enum);
CREATE INDEX idx_people_automation_status_enum ON public."People"(automation_status_enum);
CREATE INDEX idx_people_lead_source_enum ON public."People"(lead_source_enum);