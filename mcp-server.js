#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://jedfundfhzytpnbjkspn.supabase.co';
const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN || 'sbp_ca2310f0c781f17e4ccb76218f091d5339875247';
const supabase = createClient(supabaseUrl, supabaseAccessToken);

// Log configuration
console.error('Supabase URL:', supabaseUrl);
console.error('Supabase Access Token configured:', supabaseAccessToken ? 'Yes' : 'No');

// Create MCP server
const server = new Server(
  {
    name: 'empowr-crm-supabase-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
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
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'execute_sql':
        try {
          const { query } = args;
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

      case 'list_tables':
        try {
          const { data, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');

          if (error) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Error listing tables: ${error.message}`,
                },
              ],
            };
          }

          const tableNames = data.map(row => row.table_name);
          return {
            content: [
              {
                type: 'text',
                text: `Available tables: ${tableNames.join(', ')}`,
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

      case 'get_table_data':
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

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Unexpected error: ${error.message}`,
        },
      ],
    };
  }
});

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Empowr CRM Supabase MCP Server started');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});


