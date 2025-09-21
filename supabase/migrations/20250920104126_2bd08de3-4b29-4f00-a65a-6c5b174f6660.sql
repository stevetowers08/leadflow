-- Create function to get enum values
CREATE OR REPLACE FUNCTION public.get_enum_values(enum_type text)
RETURNS text[]
LANGUAGE sql
STABLE
AS $$
  SELECT array_agg(enumlabel ORDER BY enumsortorder)::text[]
  FROM pg_enum
  WHERE enumtypid = enum_type::regtype;
$$;