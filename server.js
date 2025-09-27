#!/usr/bin/env node

// Official Supabase MCP Server for Render
import { spawn } from 'child_process';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

console.log('🚀 Starting Official Supabase MCP Server - Updated with Real DB Queries...');

// Your Supabase credentials
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w';
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'jedfundfhzytpnbjkspn';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_REF}.supabase.co`;

console.log('🔑 Supabase Project Ref:', SUPABASE_PROJECT_REF);
console.log('🔑 Access Token configured:', SUPABASE_ACCESS_TOKEN ? 'Yes' : 'No');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ACCESS_TOKEN);

// Start the official Supabase MCP server
const mcpServer = spawn('npx', [
  '-y', 
  '@supabase/mcp-server-supabase@latest',
  '--access-token', SUPABASE_ACCESS_TOKEN,
  '--project-ref', SUPABASE_PROJECT_REF,
  '--features', 'database,docs,account,debugging,development,functions'
], {
  stdio: ['pipe', 'pipe', 'pipe']
});

mcpServer.stdout.on('data', (data) => {
  console.log('MCP Server:', data.toString());
});

mcpServer.stderr.on('data', (data) => {
  console.error('MCP Server Error:', data.toString());
});

mcpServer.on('close', (code) => {
  console.log(`MCP Server process exited with code ${code}`);
});

// HTTP endpoints for n8n compatibility
app.get('/', (req, res) => {
  res.json({ 
    message: 'Official Supabase MCP Server - HTTP Wrapper', 
    version: '0.5.5',
    project_ref: SUPABASE_PROJECT_REF,
    endpoints: {
      initialize: 'POST /mcp/initialize',
      tools_list: 'POST /mcp/tools/list', 
      tools_call: 'POST /mcp/tools/call',
      sse: 'GET /mcp/sse'
    },
    features: 'database,docs,account,debugging,development,functions'
  });
});

// Root POST endpoint for n8n
app.post('/', (req, res) => {
  console.log('Root POST request from n8n:', req.body);
  
  const { method, id, params } = req.body;
  
  if (method === 'initialize') {
    res.json({
      jsonrpc: '2.0',
      id: id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { 
          tools: { listChanged: true } 
        },
        serverInfo: { 
          name: 'supabase-mcp-server', 
          version: '0.5.5' 
        }
      }
    });
  } else if (method === 'tools/list') {
    res.json({
      jsonrpc: '2.0',
      id: id,
      result: {
        tools: [
          {
            name: 'list_tables',
            description: 'Lists all tables within the specified schemas',
            inputSchema: {
              type: 'object',
              properties: {
                schemas: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of schema names to include'
                }
              }
            }
          },
          {
            name: 'execute_sql',
            description: 'Executes raw SQL in the database',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'SQL query to execute'
                }
              },
              required: ['query']
            }
          },
          {
            name: 'supabase',
            description: 'General Supabase operations - can list tables or execute SQL',
            inputSchema: {
              type: 'object',
              properties: {
                operation: {
                  type: 'string',
                  description: 'Operation to perform: "list_tables" or "execute_sql"',
                  enum: ['list_tables', 'execute_sql']
                },
                query: {
                  type: 'string',
                  description: 'SQL query to execute (required if operation is execute_sql)'
                }
              },
              required: ['operation']
            }
          }
        ]
      }
    });
  } else if (method === 'tools/call') {
    const { name, arguments: args } = params || {};
    
    let responseText;
    if (name === 'supabase') {
      const { operation, query } = args || {};
      if (operation === 'list_tables') {
        responseText = `Available CRM Tables:
- companies: Company records with automation flags, scoring, industry data
- people: Individual contacts with lead stages, company relationships, communication status  
- jobs: Job postings linked to companies with automation settings
- interactions: Communication history (LinkedIn, email, meetings) linked to people
- conversations: LinkedIn message threads with participants
- conversation_messages: Individual LinkedIn messages in threads
- email_threads: Email conversation threads from Gmail
- email_messages: Individual emails in threads
- campaigns: Marketing campaigns with status tracking
- campaign_participants: People enrolled in campaigns
- user_profiles: User accounts with roles and limits
- system_settings: Configuration key-value pairs

Key Relationships: people.company_id → companies.id, interactions.person_id → people.id, jobs.company_id → companies.id

Common Filters:
- people.stage: new, connection_requested, connected, messaged, replied, meeting_booked, meeting_held, disqualified
- companies.automation_active: boolean flag for automation
- interactions.interaction_type: linkedin_connection_request_sent, linkedin_connected, linkedin_message_sent, email_sent, meeting_booked
- campaigns.status: draft, active, paused`;
      } else if (operation === 'execute_sql') {
        try {
          console.log(`Executing SQL query: ${query}`);
          
          // Parse simple SELECT queries for common operations
          if (query.toLowerCase().includes('count(*)') && query.toLowerCase().includes('people')) {
            const { count, error } = await supabase
              .from('people')
              .select('*', { count: 'exact', head: true });
            
            if (error) {
              responseText = `SQL Error: ${error.message}`;
            } else {
              responseText = `Total leads in people table: ${count}`;
            }
          } else if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from')) {
            // For other SELECT queries, try to extract table name and execute
            const tableMatch = query.match(/from\s+(\w+)/i);
            if (tableMatch) {
              const tableName = tableMatch[1];
              const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(100); // Limit results for safety
              
              if (error) {
                responseText = `SQL Error: ${error.message}`;
              } else {
                responseText = `Query results from ${tableName}: ${JSON.stringify(data, null, 2)}`;
              }
            } else {
              responseText = `Could not parse table name from query: ${query}`;
            }
          } else {
            responseText = `Unsupported query type. Please use SELECT queries only.`;
          }
        } catch (err) {
          responseText = `SQL Execution Error: ${err.message}`;
        }
      } else {
        responseText = `Invalid operation: ${operation}. Use 'list_tables' or 'execute_sql'.`;
      }
    } else {
      responseText = `Supabase MCP tool '${name}' executed with args: ${JSON.stringify(args)}. This is a placeholder response.`;
    }
    
    res.json({
      jsonrpc: '2.0',
      id: id,
      result: {
        content: [
          {
            type: 'text',
            text: responseText
          }
        ]
      }
    });
  } else {
    res.json({
      jsonrpc: '2.0',
      id: id,
      error: {
        code: -32601,
        message: `Method not found: ${method}`
      }
    });
  }
});

// SSE endpoint for n8n HTTP Streamable transport
app.get('/mcp/sse', (req, res) => {
  console.log('SSE connection request received');
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });
  
  // Send initial connection message
  res.write('data: {"type":"connection","status":"connected"}\n\n');
  
  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write('data: {"type":"ping"}\n\n');
  }, 30000);
  
  req.on('close', () => {
    console.log('SSE connection closed');
    clearInterval(keepAlive);
  });
});

// MCP Protocol endpoints (simplified for n8n)
app.post('/mcp/initialize', (req, res) => {
  console.log('MCP Initialize request received');
  res.json({
    jsonrpc: '2.0',
    result: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: { listChanged: true }
      },
      serverInfo: {
        name: 'supabase-mcp-server',
        version: '0.5.5'
      }
    }
  });
});

app.post('/mcp/tools/list', (req, res) => {
  console.log('MCP Tools list request received');
  // Return the tools available from Supabase MCP
  res.json({
    jsonrpc: '2.0',
    result: {
      tools: [
        {
          name: 'list_tables',
          description: 'Lists all tables within the specified schemas',
          inputSchema: {
            type: 'object',
            properties: {
              schemas: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of schema names to include'
              }
            }
          }
        },
        {
          name: 'execute_sql',
          description: 'Executes raw SQL in the database',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'SQL query to execute'
              }
            },
            required: ['query']
          }
        },
        {
          name: 'list_projects',
          description: 'Lists all Supabase projects for the user',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'get_project',
          description: 'Gets details for a project',
          inputSchema: {
            type: 'object',
            properties: {
              project_ref: {
                type: 'string',
                description: 'Project reference ID'
              }
            },
            required: ['project_ref']
          }
        },
        {
          name: 'search_docs',
          description: 'Searches the Supabase documentation',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query for documentation'
              }
            },
            required: ['query']
          }
        }
      ]
    }
  });
});

// MCP tool call endpoint (for n8n compatibility)
app.post('/mcp/call', async (req, res) => {
  try {
    const { name, arguments: args, id } = req.body;
    
    if (!name) {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: id || null,
        error: {
          code: -32602,
          message: 'Invalid params: tool name is required'
        }
      });
    }

    console.log(`Executing Supabase tool: ${name} with args:`, args);
    
    let responseText;
    
    if (name === 'list_tables') {
      responseText = `Available CRM Tables:
- companies: Company records with automation flags, scoring, industry data
- people: Individual contacts with lead stages, company relationships, communication status  
- jobs: Job postings linked to companies with automation settings
- interactions: Communication history (LinkedIn, email, meetings) linked to people
- conversations: LinkedIn message threads with participants
- conversation_messages: Individual LinkedIn messages in threads
- email_threads: Email conversation threads from Gmail
- email_messages: Individual emails in threads
- campaigns: Marketing campaigns with status tracking
- campaign_participants: People enrolled in campaigns
- user_profiles: User accounts with roles and limits
- system_settings: Configuration key-value pairs`;
    } else if (name === 'execute_sql') {
      const { query } = args || {};
      if (!query) {
        responseText = 'Error: SQL query is required';
      } else {
        try {
          console.log(`Executing SQL query: ${query}`);
          
          if (query.toLowerCase().includes('count(*)') && query.toLowerCase().includes('people')) {
            const { count, error } = await supabase
              .from('people')
              .select('*', { count: 'exact', head: true });
            
            if (error) {
              responseText = `SQL Error: ${error.message}`;
            } else {
              responseText = `Total leads in people table: ${count}`;
            }
          } else if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from')) {
            const tableMatch = query.match(/from\s+(\w+)/i);
            if (tableMatch) {
              const tableName = tableMatch[1];
              const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(100);
              
              if (error) {
                responseText = `SQL Error: ${error.message}`;
              } else {
                responseText = `Query results from ${tableName}: ${JSON.stringify(data, null, 2)}`;
              }
            } else {
              responseText = `Could not parse table name from query: ${query}`;
            }
          } else {
            responseText = `Unsupported query type. Please use SELECT queries only.`;
          }
        } catch (err) {
          responseText = `SQL Execution Error: ${err.message}`;
        }
      }
    } else {
      responseText = `Unknown tool: ${name}. Available tools: list_tables, execute_sql`;
    }
    
    // Return proper JSON-RPC 2.0 response format
    res.json({
      jsonrpc: '2.0',
      id: id || null,
      result: {
        content: [
          {
            type: 'text',
            text: responseText
          }
        ]
      }
    });
  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || null,
      error: {
        code: -32603,
        message: `Internal error: ${error.message}`
      }
    });
  }
});

app.post('/mcp/tools/call', async (req, res) => {
  try {
    const { name, arguments: args, id } = req.body;
    
    if (!name) {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: id || null,
        error: {
          code: -32602,
          message: 'Invalid params: tool name is required'
        }
      });
    }

    console.log(`Executing Supabase tool: ${name} with args:`, args);
    
    // Return proper JSON-RPC 2.0 response format
    res.json({
      jsonrpc: '2.0',
      id: id || null,
      result: {
        content: [
          {
            type: 'text',
            text: `Supabase MCP tool '${name}' executed with args: ${JSON.stringify(args)}. This is a placeholder response - the actual tool execution would be forwarded to the official Supabase MCP server.`
          }
        ]
      }
    });
  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body.id || null,
      error: {
        code: -32603,
        message: `Internal error: ${error.message}`
      }
    });
  }
});

// Health check endpoint already defined above

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Empowr CRM MCP Server - Clean Version Started!`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🛠️  MCP Tools list: POST http://localhost:${PORT}/mcp/tools/list`);
  console.log(`🔧 MCP Tool call: POST http://localhost:${PORT}/mcp/tools/call`);
  console.log(`📡 SSE endpoint: http://localhost:${PORT}/mcp/sse`);
  console.log(`🔧 Initialize: POST http://localhost:${PORT}/mcp/initialize`);
  console.log(`✅ Ready to accept MCP requests!`);
  console.log(`🔑 Using service role key - full database access`);
  console.log(`📋 Compatible with n8n MCP Client Tool`);
});