# MCP Server Guide

This guide explains how to set up and use the MCP (Model Context Protocol) server for the Empowr CRM.

## Overview

The MCP server provides AI assistants with direct access to your CRM data through Supabase, enabling powerful automation and data analysis capabilities.

## Setup

### 1. Environment Variables

Create a `.env` file in the `mcp-server/` directory:

```bash
SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
SUPABASE_ACCESS_TOKEN=sbp_ca2310f0c781f17e4ccb76218f091d5339875247
PORT=3000
NODE_ENV=production
```

### 2. Install Dependencies

```bash
cd mcp-server
npm install
```

### 3. Start the Server

```bash
npm start
```

The server will start on port 3000 and provide MCP endpoints for AI integration.

## Available Tools

- `execute_sql` - Execute SELECT queries on Supabase
- `list_tables` - List available CRM tables
- `get_table_data` - Get data from specific tables

## Integration

The MCP server can be integrated with:
- AI assistants (Claude, GPT, etc.)
- Automation platforms (n8n)
- Custom applications

## Security

- Uses Supabase service role key for elevated access
- Implements proper authentication
- Follows MCP 2024-11-05 protocol standards

## Troubleshooting

- Ensure Supabase credentials are correct
- Check that the server is running on the expected port
- Verify MCP client configuration matches server endpoints
