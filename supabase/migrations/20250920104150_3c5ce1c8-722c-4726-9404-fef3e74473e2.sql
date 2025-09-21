-- Fix the security warning by setting search_path
CREATE OR REPLACE FUNCTION public.get_enum_values(enum_type text)
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT array_agg(enumlabel ORDER BY enumsortorder)::text[]
  FROM pg_enum
  WHERE enumtypid = enum_type::regtype;
$$;