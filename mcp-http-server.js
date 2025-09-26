#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import express from 'express';
import cors from 'cors';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://jedfundfhzytpnbjkspn.supabase.co';
const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZGZ1bmRmaHp5dHBuYmprc3BuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM2MTk0MiwiZXhwIjoyMDczOTM3OTQyfQ.GpPDYihR_qSnN4cR0SXfgNa8AxB8iXCt7VkG1xYo44w';
const supabase = createClient(supabaseUrl, supabaseAccessToken);

// Log configuration
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

// Tool execution functions
async function executeSqlTool(args) {
  try {
    const { query } = args;
    
    // For security, we'll only allow SELECT queries
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery.startsWith('select')) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Only SELECT queries are allowed for security reasons',
          },
        ],
      };
    }
    
    // Use direct query execution
    const { data, error } = await supabase.rpc('exec_sql', { query });
    
    if (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing SQL: ${error.message}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `SQL executed successfully. Result: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
}

async function listTablesTool(args) {
  try {
    // For now, return known tables from your CRM system
    const knownTables = [
      'companies',
      'users', 
      'leads',
      'conversations',
      'user_profiles',
      'company_logos',
      'system_settings',
      'badges',
      'user_badges',
      'conversation_messages'
    ];
    
    return {
      content: [
        {
          type: 'text',
          text: `Available tables: ${knownTables.join(', ')}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
}

async function getTableDataTool(args) {
  try {
    const { table_name, limit = 10 } = args;
    const { data, error } = await supabase
      .from(table_name)
      .select('*')
      .limit(limit);

    if (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting table data: ${error.message}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Data from ${table_name} (${data.length} rows):\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
}

// Tool execution mapping
const toolExecutors = {
  execute_sql: executeSqlTool,
  list_tables: listTablesTool,
  get_table_data: getTableDataTool,
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Empowr CRM MCP Server is running',
    protocol: 'MCP over HTTP'
  });
});

// MCP Tools list endpoint
app.get('/mcp/tools', (req, res) => {
  res.json({
    jsonrpc: '2.0',
    result: {
      tools: mcpTools
    }
  });
});

// MCP Tool call endpoint
app.post('/mcp/call', async (req, res) => {
  try {
    const { name, arguments: args } = req.body;
    
    // Validate request
    if (!name) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid request: missing tool name'
        }
      });
    }
    
    if (!toolExecutors[name]) {
      return res.json({
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: `Unknown tool: ${name}`
        }
      });
    }
    
    console.log(`Executing tool: ${name} with args:`, args);
    const result = await toolExecutors[name](args || {});
    
    res.json({
      jsonrpc: '2.0',
      result: result
    });
  } catch (error) {
    console.error('MCP tool call error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error.message
      }
    });
  }
});

// Legacy HTTP API endpoints (for backward compatibility)
app.post('/tools', async (req, res) => {
  try {
    const { tool, parameters } = req.body;
    
    if (!toolExecutors[tool]) {
      return res.json({
        success: false,
        error: `Unknown tool: ${tool}`
      });
    }
    
    const result = await toolExecutors[tool](parameters);
    
    // Convert MCP result to legacy format
    if (result.content && result.content[0]) {
      const text = result.content[0].text;
      
      if (text.includes('Error')) {
        return res.json({
          success: false,
          error: text
        });
      } else {
        return res.json({
          success: true,
          data: text
        });
      }
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Available tools endpoint (legacy)
app.get('/tools', (req, res) => {
  res.json({
    tools: mcpTools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema.properties
    }))
  });
});

// Global error handler for JSON parsing errors
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Empowr CRM MCP Server Started!');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🛠️  MCP Tools list: http://localhost:${PORT}/mcp/tools`);
  console.log(`🔧 MCP Tool call: http://localhost:${PORT}/mcp/call`);
  console.log(`📋 Legacy tools: http://localhost:${PORT}/tools`);
  console.log('✅ Ready to accept MCP requests!');
});