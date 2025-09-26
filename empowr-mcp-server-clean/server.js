#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import express from 'express';
import cors from 'cors';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://jedfundfhzytpnbjkspn.supabase.co';
const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w';
const supabase = createClient(supabaseUrl, supabaseAccessToken);

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Access Token configured:', supabaseAccessToken ? 'Yes' : 'No');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// MCP Tools definitions
const mcpTools = [
  {
    name: 'execute_sql',
    description: 'Execute raw SQL queries on the Supabase database',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'SQL query to execute',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'list_tables',
    description: 'Get list of all tables in the database',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_table_data',
    description: 'Get data from a specific table',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Name of the table to query',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of rows to return (default: 10)',
          default: 10,
        },
      },
      required: ['table_name'],
    },
  },
];

// Tool executors
async function executeSqlTool(args) {
  try {
    const { query } = args;
    const trimmedQuery = query.trim().toLowerCase();
    
    // Security: Only allow SELECT queries
    if (!trimmedQuery.startsWith('select')) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Only SELECT queries are allowed for security reasons'
          }
        ]
      };
    }

    console.log('Executing SQL:', query);
    
    // Try RPC first, fallback to direct query
    try {
      const { data, error } = await supabase.rpc('exec_sql', { query });
      if (error) {
        console.error('SQL execution error:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error executing SQL: ${error.message}`
            }
          ]
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: `Query executed successfully. Results: ${JSON.stringify(data, null, 2)}`
          }
        ]
      };
    } catch (rpcError) {
      // Fallback: return informative message
      console.log('RPC function not available, returning info message');
      return {
        content: [
          {
            type: 'text',
            text: `SQL query received: "${query}". Note: exec_sql RPC function is not available. Use list_tables or get_table_data instead.`
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error executing SQL:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error executing SQL: ${error.message}`
        }
      ]
    };
  }
}

async function listTablesTool(args) {
  try {
    // Return hardcoded list of known CRM tables
    const knownTables = [
      'companies', 'users', 'leads', 'conversations', 'user_profiles',
      'company_logos', 'system_settings', 'badges', 'user_badges', 'conversation_messages'
    ];
    
    return {
      content: [
        {
          type: 'text',
          text: `Available tables: ${knownTables.join(', ')}`
        }
      ]
    };
  } catch (error) {
    console.error('Error listing tables:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error listing tables: ${error.message}`
        }
      ]
    };
  }
}

async function getTableDataTool(args) {
  try {
    const { table_name, limit = 10 } = args;
    
    console.log(`Getting data from table: ${table_name}, limit: ${limit}`);
    const { data, error } = await supabase
      .from(table_name)
      .select('*')
      .limit(limit);
    
    if (error) {
      console.error('Error getting table data:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error getting table data: ${error.message}`
          }
        ]
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Data from ${table_name}: ${JSON.stringify(data, null, 2)}`
        }
      ]
    };
  } catch (error) {
    console.error('Error getting table data:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error getting table data: ${error.message}`
        }
      ]
    };
  }
}

// MCP Protocol Endpoints - Standard MCP 2024-11-05

// Initialize endpoint - REQUIRED by n8n MCP Client
app.post('/mcp/initialize', (req, res) => {
  console.log('MCP Initialize request received');
  res.json({
    jsonrpc: '2.0',
    result: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'empowr-crm-mcp-server',
        version: '1.0.0'
      }
    }
  });
});

// List tools endpoint - REQUIRED by n8n MCP Client
app.post('/mcp/tools/list', (req, res) => {
  console.log('MCP Tools list request received');
  res.json({
    jsonrpc: '2.0',
    result: {
      tools: mcpTools
    }
  });
});

// Call tool endpoint - REQUIRED by n8n MCP Client
app.post('/mcp/tools/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    
    if (!name) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32602,
          message: 'Invalid params: tool name is required'
        }
      });
    }

    console.log(`Executing tool: ${name} with args:`, args);
    
    let result;
    switch (name) {
      case 'execute_sql':
        result = await executeSqlTool(args || {});
        break;
      case 'list_tables':
        result = await listTablesTool(args || {});
        break;
      case 'get_table_data':
        result = await getTableDataTool(args || {});
        break;
      default:
        return res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: `Unknown tool: ${name}`
          }
        });
    }
    
    res.json({
      jsonrpc: '2.0',
      result: result
    });
  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: `Internal error: ${error.message}`
      }
    });
  }
});

// SSE endpoint - REQUIRED by n8n MCP Client for HTTP Streamable
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

// Root endpoint for server info
app.get('/', (req, res) => {
  res.json({ 
    message: 'Empowr MCP Server - Clean Version', 
    version: '1.0.0',
    endpoints: {
      initialize: 'POST /mcp/initialize',
      tools_list: 'POST /mcp/tools/list',
      tools_call: 'POST /mcp/tools/call',
      sse: 'GET /mcp/sse',
      health: 'GET /health'
    },
    mcp_protocol: '2024-11-05',
    compatible_with: 'n8n MCP Client Tool'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('JSON parsing error:', error.message);
    return res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error: Invalid JSON'
      }
    });
  }
  next(error);
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Empowr CRM MCP Server - Clean Version Started!');
  console.log('📡 Port:', PORT);
  console.log('🏥 Health check: http://localhost:' + PORT + '/health');
  console.log('🛠️  MCP Tools list: POST http://localhost:' + PORT + '/mcp/tools/list');
  console.log('🔧 MCP Tool call: POST http://localhost:' + PORT + '/mcp/tools/call');
  console.log('📡 SSE endpoint: http://localhost:' + PORT + '/mcp/sse');
  console.log('🔧 Initialize: POST http://localhost:' + PORT + '/mcp/initialize');
  console.log('✅ Ready to accept MCP requests!');
  console.log('🔑 Using service role key - full database access');
  console.log('📋 Compatible with n8n MCP Client Tool');
});