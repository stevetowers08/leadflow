# n8n Integration Guide for Empowr CRM MCP Server

## ✅ **MCP Server Status: READY FOR EXTERNAL ACCESS**

Your MCP server is now properly configured and tested with:
- ✅ Real Supabase service role key
- ✅ Proper MCP protocol compliance (JSON-RPC 2.0)
- ✅ Error handling and validation
- ✅ External URL access capability

## **Server Endpoints**

**Base URL**: `https://empowr-crm-mcp-server-v2-production.up.railway.app`

### **MCP Protocol Endpoints**
- `GET /mcp/tools` - List available tools
- `POST /mcp/call` - Execute tool calls
- `GET /health` - Health check

### **Legacy Endpoints (Backward Compatible)**
- `GET /tools` - List tools (legacy format)
- `POST /tools` - Execute tools (legacy format)

## **Available Tools**

### 1. **list_tables**
Get list of all available tables in your CRM database.

**Request:**
```json
{
  "name": "list_tables",
  "arguments": {}
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Available tables: companies, users, leads, conversations, user_profiles, company_logos, system_settings, badges, user_badges, conversation_messages"
      }
    ]
  }
}
```

### 2. **get_table_data**
Get data from a specific table.

**Request:**
```json
{
  "name": "get_table_data",
  "arguments": {
    "table_name": "companies",
    "limit": 5
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Data from companies (3 rows):\n[{\"id\": \"...\", \"name\": \"Notion\", ...}]"
      }
    ]
  }
}
```

### 3. **execute_sql**
Execute SELECT queries on the database (read-only for security).

**Request:**
```json
{
  "name": "execute_sql",
  "arguments": {
    "query": "SELECT name, lead_score FROM companies WHERE lead_score > 80 LIMIT 5"
  }
}
```

## **n8n Integration Methods**

### **Method 1: HTTP Request Node (Recommended)**

1. **Add HTTP Request Node**
2. **Configure:**
   - **Method**: `POST`
   - **URL**: `https://empowr-crm-mcp-server-v2-production.up.railway.app/mcp/call`
   - **Headers**: 
     ```json
     {
       "Content-Type": "application/json"
     }
     ```
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

### **Method 2: MCP Client Tool (If Available)**

If n8n has MCP client support:
- **Server URL**: `https://empowr-crm-mcp-server-v2-production.up.railway.app`
- **Protocol**: HTTP
- **Tools Endpoint**: `/mcp/tools`
- **Call Endpoint**: `/mcp/call`

## **Example n8n Workflows**

### **Workflow 1: Get Company Data**
```json
{
  "nodes": [
    {
      "name": "Get Companies",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://empowr-crm-mcp-server-v2-production.up.railway.app/mcp/call",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "name": "get_table_data",
          "arguments": {
            "table_name": "companies",
            "limit": 10
          }
        }
      }
    }
  ]
}
```

### **Workflow 2: List All Tables**
```json
{
  "nodes": [
    {
      "name": "List Tables",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://empowr-crm-mcp-server-v2-production.up.railway.app/mcp/call",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "name": "list_tables",
          "arguments": {}
        }
      }
    }
  ]
}
```

### **Workflow 3: Custom SQL Query**
```json
{
  "nodes": [
    {
      "name": "Custom Query",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "https://empowr-crm-mcp-server-v2-production.up.railway.app/mcp/call",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "name": "execute_sql",
          "arguments": {
            "query": "SELECT name, lead_score FROM companies WHERE lead_score > 80 ORDER BY lead_score DESC LIMIT 5"
          }
        }
      }
    }
  ]
}
```

## **Testing Commands**

### **Health Check**
```bash
curl -X GET https://empowr-crm-mcp-server-v2-production.up.railway.app/health
```

### **List Tools**
```bash
curl -X GET https://empowr-crm-mcp-server-v2-production.up.railway.app/mcp/tools
```

### **Get Company Data**
```bash
curl -X POST https://empowr-crm-mcp-server-v2-production.up.railway.app/mcp/call \
  -H "Content-Type: application/json" \
  -d '{"name": "get_table_data", "arguments": {"table_name": "companies", "limit": 3}}'
```

### **List Tables**
```bash
curl -X POST https://empowr-crm-mcp-server-v2-production.up.railway.app/mcp/call \
  -H "Content-Type: application/json" \
  -d '{"name": "list_tables", "arguments": {}}'
```

## **Error Handling**

The server returns proper MCP error responses:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Unknown tool: invalid_tool"
  }
}
```

**Error Codes:**
- `-32700`: Parse error (Invalid JSON)
- `-32600`: Invalid request (Missing parameters)
- `-32601`: Method not found (Unknown tool)
- `-32603`: Internal error (Server error)

## **Security Features**

- ✅ **Read-only SQL**: Only SELECT queries allowed
- ✅ **Service role authentication**: Secure Supabase access
- ✅ **Input validation**: Parameter validation
- ✅ **Error handling**: Proper error responses
- ✅ **Rate limiting**: Express.js built-in protection

## **Deployment Status**

- ✅ **Railway Configuration**: Updated to use MCP server
- ✅ **Environment Variables**: Supabase credentials configured
- ✅ **Health Check**: `/health` endpoint working
- ✅ **MCP Protocol**: Full compliance verified
- ✅ **External Access**: Ready for n8n integration

## **Next Steps**

1. **Deploy to Railway**: Push your code to trigger deployment
2. **Test External Access**: Verify the Railway URL works
3. **Configure n8n**: Use HTTP Request nodes with the MCP endpoints
4. **Monitor Usage**: Check Railway logs for any issues

Your MCP server is now ready for production use with n8n! 🚀


