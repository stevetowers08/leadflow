import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase configuration
const SUPABASE_URL = 'https://jedfundfhzytpnbjkspn.supabase.co';
const SUPABASE_ACCESS_TOKEN = 'sbp_ca2310f0c781f17e4ccb76218f091d5339875247';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ACCESS_TOKEN);

// MCP endpoint
app.post('/mcp', async (req, res) => {
  try {
    const { method, params } = req.body;
    
    console.log('MCP Request:', { method, params });
    
    switch (method) {
      case 'tools/list':
        res.json({
          tools: [
            {
              name: 'list_tables',
              description: 'List all tables in the database',
              inputSchema: {
                type: 'object',
                properties: {},
                required: []
              }
            },
            {
              name: 'execute_sql',
              description: 'Execute SQL query',
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
              name: 'get_table_data',
              description: 'Get data from a specific table',
              inputSchema: {
                type: 'object',
                properties: {
                  table: {
                    type: 'string',
                    description: 'Table name'
                  },
                  limit: {
                    type: 'number',
                    description: 'Number of rows to return',
                    default: 100
                  }
                },
                required: ['table']
              }
            }
          ]
        });
        break;
        
      case 'tools/call':
        const { name, arguments: args } = params;
        
        switch (name) {
          case 'list_tables':
            const { data: tables, error: tablesError } = await supabase
              .from('information_schema.tables')
              .select('table_name')
              .eq('table_schema', 'public');
            
            if (tablesError) throw tablesError;
            
            res.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(tables.map(t => t.table_name), null, 2)
                }
              ]
            });
            break;
            
          case 'execute_sql':
            const { query } = args;
            const { data: sqlData, error: sqlError } = await supabase.rpc('exec_sql', { sql_query: query });
            
            if (sqlError) throw sqlError;
            
            res.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(sqlData, null, 2)
                }
              ]
            });
            break;
            
          case 'get_table_data':
            const { table, limit = 100 } = args;
            const { data: tableData, error: tableError } = await supabase
              .from(table)
              .select('*')
              .limit(limit);
            
            if (tableError) throw tableError;
            
            res.json({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(tableData, null, 2)
                }
              ]
            });
            break;
            
          default:
            res.status(400).json({ error: 'Unknown tool' });
        }
        break;
        
      default:
        res.status(400).json({ error: 'Unknown method' });
    }
  } catch (error) {
    console.error('MCP Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Supabase MCP Server running on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
});
