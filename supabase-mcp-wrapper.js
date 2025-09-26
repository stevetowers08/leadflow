#!/usr/bin/env node

// Official Supabase MCP Server HTTP Wrapper for Render
import { spawn } from 'child_process';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Start the official Supabase MCP server as a subprocess
const mcpServer = spawn('npx', [
  '-y', 
  '@supabase/mcp-server-supabase@latest',
  '--access-token', process.env.SUPABASE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w',
  '--project-ref', process.env.SUPABASE_PROJECT_REF || 'jedfundfhzytpnbjkspn'
], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// HTTP endpoints for n8n compatibility
app.get('/', (req, res) => {
  res.json({ 
    message: 'Official Supabase MCP Server - HTTP Wrapper', 
    version: '0.5.5',
    endpoints: {
      initialize: 'POST /mcp/initialize',
      tools_list: 'POST /mcp/tools/list', 
      tools_call: 'POST /mcp/tools/call',
      sse: 'GET /mcp/sse'
    }
  });
});

app.post('/', (req, res) => {
  res.json({
    jsonrpc: '2.0',
    result: {
      protocolVersion: '2024-11-05',
      capabilities: { tools: { listChanged: true } },
      serverInfo: { name: 'supabase-mcp-server', version: '0.5.5' }
    }
  });
});

// SSE endpoint for n8n
app.get('/mcp/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.write('data: {"type":"connection","status":"connected"}\n\n');
  
  const keepAlive = setInterval(() => {
    res.write('data: {"type":"ping"}\n\n');
  }, 30000);
  
  req.on('close', () => clearInterval(keepAlive));
});

// Proxy MCP requests to the stdio server
app.post('/mcp/initialize', (req, res) => {
  // Forward to stdio server
  mcpServer.stdin.write(JSON.stringify(req.body) + '\n');
  // Handle response...
});

app.post('/mcp/tools/list', (req, res) => {
  // Forward to stdio server
  mcpServer.stdin.write(JSON.stringify(req.body) + '\n');
  // Handle response...
});

app.post('/mcp/tools/call', (req, res) => {
  // Forward to stdio server  
  mcpServer.stdin.write(JSON.stringify(req.body) + '\n');
  // Handle response...
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Official Supabase MCP Server HTTP Wrapper started on port ${PORT}`);
  console.log('📡 SSE endpoint: http://localhost:' + PORT + '/mcp/sse');
  console.log('🔧 Using official @supabase/mcp-server-supabase@latest');
});


