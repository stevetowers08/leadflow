-- First, let's add proper IDs and clean up the imported tables
-- Add UUID primary keys to the imported tables
ALTER TABLE public."Companies" ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE public."Jobs" ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
ALTER TABLE public."People" ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;

-- Add timestamps
ALTER TABLE public."Companies" 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

ALTER TABLE public."Jobs" 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

ALTER TABLE public."People" 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Enable RLS on the new tables
ALTER TABLE public."Companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."People" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to allow all operations (matching existing pattern)
CREATE POLICY "Allow all operations on Companies" 
ON public."Companies" 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on Jobs" 
ON public."Jobs" 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on People" 
ON public."People" 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create a mapping table to link Companies with Jobs based on company names
CREATE TABLE public.company_jobs_mapping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public."Companies"(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public."Jobs"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(company_id, job_id)
);

-- Create a mapping table to link Companies with People based on company names
CREATE TABLE public.company_people_mapping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public."Companies"(id) ON DELETE CASCADE,
    person_id UUID REFERENCES public."People"(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(company_id, person_id)
);

-- Enable RLS on mapping tables
ALTER TABLE public.company_jobs_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_people_mapping ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for mapping tables
CREATE POLICY "Allow all operations on company_jobs_mapping" 
ON public.company_jobs_mapping 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on company_people_mapping" 
ON public.company_people_mapping 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public."Companies"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON public."Jobs"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_people_updated_at
    BEFORE UPDATE ON public."People"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();