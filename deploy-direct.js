#!/usr/bin/env node

// Direct deployment to Render without GitHub
const fs = require('fs');
const https = require('https');

const RENDER_API_KEY = 'rnd_ayMbAoE0irfHqHWgOI0p1W146naU';

// Read the files
const packageJson = fs.readFileSync('package.json', 'utf8');
const serverJs = fs.readFileSync('server.js', 'utf8');

// Create deployment payload
const deploymentData = {
  name: 'empowr-mcp-server-direct',
  type: 'web_service',
  buildCommand: 'npm install',
  startCommand: 'node server.js',
  envVars: [
    {
      key: 'SUPABASE_URL',
      value: 'https://jedfundfhzytpnbjkspn.supabase.co'
    },
    {
      key: 'SUPABASE_ACCESS_TOKEN',
      value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w'
    }
  ],
  // We'll need to upload the files separately
  files: {
    'package.json': packageJson,
    'server.js': serverJs
  }
};

console.log('Deployment data prepared:', JSON.stringify(deploymentData, null, 2));
console.log('\nTo deploy to Render:');
console.log('1. Go to https://render.com');
console.log('2. Create new Web Service');
console.log('3. Upload these files manually');
console.log('4. Set environment variables');
console.log('5. Deploy!');


