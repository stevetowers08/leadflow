# Empowr CRM MCP Server

A proper Model Context Protocol (MCP) server that provides Supabase database tools for the Empowr CRM system. This server implements the MCP protocol over HTTP, making it accessible via external URLs for n8n and other MCP clients.

## Features

- **MCP Protocol Compliance**: Full MCP protocol implementation over HTTP
- **Supabase Integration**: Direct access to Supabase database operations
- **External URL Access**: Deployable to Railway, Render, or any Node.js hosting platform
- **Backward Compatibility**: Maintains legacy HTTP API endpoints
- **Tool Support**: SQL execution, table listing, and data retrieval

## Available Tools

### `execute_sql`
Execute raw SQL queries on the Supabase database.

**MCP Request:**
```json
{
  "name": "execute_sql",
  "arguments": {
    "query": "SELECT * FROM users LIMIT 5"
  }
}
```

### `list_tables`
Get list of all tables in the database.

**MCP Request:**
```json
{
  "name": "list_tables",
  "arguments": {}
}
```

### `get_table_data`
Get data from a specific table.

**MCP Request:**
```json
{
  "name": "get_table_data",
  "arguments": {
    "table_name": "users",
    "limit": 10
  }
}
```

## API Endpoints

### MCP Protocol Endpoints

- `GET /mcp/tools` - List available MCP tools
- `POST /mcp/call` - Execute MCP tool calls

### Legacy HTTP Endpoints (Backward Compatibility)

- `GET /health` - Health check
- `GET /tools` - List available tools (legacy format)
- `POST /tools` - Execute tools (legacy format)

## Usage with n8n

### Option 1: HTTP Request Node (Recommended)

Configure n8n HTTP Request node:

**List Tools:**
- **URL**: `https://your-domain.com/mcp/tools`
- **Method**: `GET`

**Call Tool:**
- **URL**: `https://your-domain.com/mcp/call`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "get_table_data",
  "arguments": {
    "table_name": "companies",
    "limit": 5
  }
}
```

### Option 2: MCP Client Tool

If n8n supports MCP clients, configure:
- **Server URL**: `https://your-domain.com`
- **Protocol**: HTTP
- **Endpoints**: `/mcp/tools` and `/mcp/call`

## Response Format

### MCP Response Format
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Response data here"
      }
    ]
  }
}
```

### Error Response Format
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Error message here"
  }
}
```

## Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ACCESS_TOKEN`: Your Supabase API key
- `PORT`: Server port (default: 3000)

## Local Development

```bash
# Install dependencies
npm install

# Start MCP HTTP server
npm run mcp-http

# Start legacy HTTP server
npm start

# Start stdio MCP server (for local MCP clients)
npm run mcp
```

## Deployment

### Railway Deployment

The server is configured for Railway deployment with:
- **Start Command**: `npm run mcp-http`
- **Health Check**: `/health`
- **Auto-restart**: On failure

### Other Platforms

Deploy to any Node.js hosting platform:
- Render
- Heroku
- Vercel
- DigitalOcean App Platform

## Testing

Test the MCP server locally:

```bash
# List tools
curl -X GET http://localhost:3000/mcp/tools

# Call a tool
curl -X POST http://localhost:3000/mcp/call \
  -H "Content-Type: application/json" \
  -d '{"name": "list_tables", "arguments": {}}'
```

## Architecture

```
┌─────────────────┐    HTTP     ┌──────────────────┐    Supabase    ┌─────────────┐
│   n8n Client    │ ──────────► │   MCP Server     │ ──────────────► │  Database   │
│                 │             │                  │                │             │
│ - HTTP Request  │             │ - MCP Protocol   │                │ - Tables    │
│ - MCP Client    │             │ - Tool Execution │                │ - Data      │
└─────────────────┘             └──────────────────┘                └─────────────┘
```

## Benefits over stdio MCP

1. **External Access**: Accessible via URL from anywhere
2. **Better Reliability**: HTTP is more stable than stdio
3. **Easier Debugging**: Can test endpoints directly
4. **Scalability**: Can handle multiple concurrent connections
5. **Monitoring**: Standard HTTP monitoring tools work
6. **Security**: Can add authentication, rate limiting, etc.

## Troubleshooting

### Common Issues

1. **"Invalid API key"**: Update `SUPABASE_ACCESS_TOKEN` environment variable
2. **Connection refused**: Check if server is running and port is correct
3. **Tool not found**: Verify tool name matches exactly (case-sensitive)

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=mcp-server
```

## License

MIT License - See LICENSE file for details.
