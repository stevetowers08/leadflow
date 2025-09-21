-- Migration: Add triggers for automatic timestamp updates
-- Date: 2025-09-21

-- 1. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Create triggers for Companies table
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON "Companies" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Create triggers for People table
CREATE TRIGGER update_people_updated_at 
    BEFORE UPDATE ON "People" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Create triggers for Jobs table
CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON "Jobs" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
