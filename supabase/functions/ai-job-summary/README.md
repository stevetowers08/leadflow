# Supabase Edge Function Configuration

# This file configures the AI job summary Edge Function

# Function name: ai-job-summary

# Runtime: Deno

# Region: Auto (closest to your Supabase project)

# Environment variables needed:

# GEMINI_API_KEY=your-gemini-api-key-here

# SUPABASE_URL=your-supabase-url

# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# To deploy this function:

# 1. Install Supabase CLI: npm install -g supabase

# 2. Login: supabase login

# 3. Link project: supabase link --project-ref your-project-ref

# 4. Deploy: supabase functions deploy ai-job-summary

# 5. Set secrets: supabase secrets set GEMINI_API_KEY=your-key

# Usage from client:

# POST https://your-project.supabase.co/functions/v1/ai-job-summary

# Headers: Authorization: Bearer your-anon-key

# Body: { jobData: {...}, jobId: "uuid" }
