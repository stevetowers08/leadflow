const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://jedfundfhzytpnbjkspn.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sbp_ca2310f0c781f17e4ccb76218f091d5339875247';
const supabase = createClient(supabaseUrl, supabaseKey);

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Empowr CRM MCP Server is running'
  });
});

// MCP Tools endpoint
app.post('/tools', async (req, res) => {
  try {
    const { tool, parameters } = req.body;
    
    switch (tool) {
      case 'execute_sql':
        try {
          const { query } = parameters;
          const { data, error } = await supabase.rpc('exec_sql', { query });
          
          if (error) {
            return res.json({
              success: false,
              error: `Error executing SQL: ${error.message}`
            });
          }

          return res.json({
            success: true,
            data: data
          });
        } catch (error) {
          return res.json({
            success: false,
            error: `Error: ${error.message}`
          });
        }

      case 'list_tables':
        try {
          const { data, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');

          if (error) {
            return res.json({
              success: false,
              error: `Error listing tables: ${error.message}`
            });
          }

          return res.json({
            success: true,
            data: data.map(row => row.table_name)
          });
        } catch (error) {
          return res.json({
            success: false,
            error: `Error: ${error.message}`
          });
        }

      case 'get_table_data':
        try {
          const { table_name, limit = 10 } = parameters;
          const { data, error } = await supabase
            .from(table_name)
            .select('*')
            .limit(limit);

          if (error) {
            return res.json({
              success: false,
              error: `Error getting table data: ${error.message}`
            });
          }

          return res.json({
            success: true,
            data: data
          });
        } catch (error) {
          return res.json({
            success: false,
            error: `Error: ${error.message}`
          });
        }

      default:
        return res.json({
          success: false,
          error: `Unknown tool: ${tool}`
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Available tools endpoint
app.get('/tools', (req, res) => {
  res.json({
    tools: [
      {
        name: "execute_sql",
        description: "Execute raw SQL queries on the Supabase database",
        parameters: {
          query: {
            type: "string",
            description: "SQL query to execute",
            required: true
          }
        }
      },
      {
        name: "list_tables",
        description: "Get list of all tables in the database",
        parameters: {}
      },
      {
        name: "get_table_data",
        description: "Get data from a specific table",
        parameters: {
          table_name: {
            type: "string",
            description: "Name of the table to query",
            required: true
          },
          limit: {
            type: "number",
            description: "Maximum number of rows to return (default: 10)",
            required: false
          }
        }
      }
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Empowr CRM MCP Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Tools endpoint: http://localhost:${PORT}/tools`);
  console.log(`Available tools: http://localhost:${PORT}/tools`);
});
