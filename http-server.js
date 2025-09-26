require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');

// Initialize Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Define MCP tools
const tools = [
  {
    name: 'list_tables',
    description: 'Lists all tables in the public schema',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_table_data',
    description: 'Fetches data from a specific table with pagination',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Name of the table to fetch data from'
        },
        limit: {
          type: 'number',
          description: 'Number of rows to return (default: 10)',
          default: 10
        }
      },
      required: ['table_name']
    }
  },
  {
    name: 'execute_sql',
    description: 'Execute raw SQL queries on the Supabase database',
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
  }
];

// Tool implementations
async function listTables() {
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

async function getTableData(args) {
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

async function executeSql(args) {
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
    
    // Try RPC first, fallback to informative message
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

// MCP Protocol Endpoints for n8n

// Initialize endpoint
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
        name: 'supabase-mcp-server',
        version: '1.0.0'
      }
    }
  });
});

// List tools endpoint
app.post('/mcp/tools/list', (req, res) => {
  console.log('MCP Tools list request received');
  res.json({
    jsonrpc: '2.0',
    result: {
      tools: tools
    }
  });
});

// Call tool endpoint
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
        result = await executeSql(args || {});
        break;
      case 'list_tables':
        result = await listTables(args || {});
        break;
      case 'get_table_data':
        result = await getTableData(args || {});
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

// SSE endpoint for n8n compatibility
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Supabase MCP Server - HTTP Version', 
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Supabase MCP Server - HTTP Version Started!');
  console.log('📡 Port:', PORT);
  console.log('🏥 Health check: http://localhost:' + PORT + '/health');
  console.log('🛠️  MCP Tools list: POST http://localhost:' + PORT + '/mcp/tools/list');
  console.log('🔧 MCP Tool call: POST http://localhost:' + PORT + '/mcp/tools/call');
  console.log('📡 SSE endpoint: http://localhost:' + PORT + '/mcp/sse');
  console.log('🔧 Initialize: POST http://localhost:' + PORT + '/mcp/initialize');
  console.log('✅ Ready to accept MCP requests!');
  console.log('🔑 Using Supabase URL:', SUPABASE_URL);
});


