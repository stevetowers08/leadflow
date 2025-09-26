#!/bin/bash

# Deploy to Render using API
RENDER_API_KEY="rnd_ayMbAoE0irfHqHWgOI0p1W146naU"

# Create service
curl -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "empowr-mcp-server",
    "repo": "https://github.com/stevetowers08/empowr-mcp-render",
    "branch": "main",
    "buildCommand": "npm install",
    "startCommand": "node server.js",
    "envVars": [
      {
        "key": "SUPABASE_URL",
        "value": "https://jedfundfhzytpnbjkspn.supabase.co"
      },
      {
        "key": "SUPABASE_ACCESS_TOKEN", 
        "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w"
      }
    ]
  }'


