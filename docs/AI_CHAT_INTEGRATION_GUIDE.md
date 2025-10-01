# AI Chat Integration Setup Guide

## Overview
Your AI chat now supports two modes:
- **MCP (External)**: Uses your existing webhook-based chat service
- **Internal (Data-Aware)**: Uses Google Gemini AI with direct access to your CRM data

## Setup Instructions

### 1. Environment Variables
Add to your `.env` file:

```bash
# Google Gemini API Key (for Internal mode)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Get Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env` file

### 3. Deploy Supabase Edge Function (Optional)
If you want to use the server-side AI chat:

```bash
# Deploy the AI chat edge function
supabase functions deploy ai-chat
```

## How to Use

### Switching Between Modes
1. Open the AI chat widget (bottom-right corner)
2. Click the Settings icon (gear)
3. Select "Chat Mode":
   - **MCP (External)**: Uses your existing webhook
   - **Internal (Data-Aware)**: Uses Google Gemini with CRM data

### Internal Mode Features
- **Direct CRM Data Access**: Queries your Supabase database
- **Smart Context**: Automatically includes relevant data based on your questions
- **Conversation Memory**: Maintains context across messages
- **Real-time Analysis**: Analyzes leads, companies, and jobs

### Example Questions for Internal Mode
- "Show me all tech companies"
- "Find leads with high scores"
- "What jobs are available for senior roles?"
- "Which companies have automation enabled?"
- "Show me leads who haven't replied yet"

## Testing

### Test Internal Mode
1. Switch to "Internal (Data-Aware)" mode
2. Make sure `VITE_GEMINI_API_KEY` is set
3. Ask: "How many companies do we have?"
4. The AI should query your database and respond with actual data

### Test MCP Mode
1. Switch to "MCP (External)" mode
2. Configure your webhook URL
3. Test the connection
4. Send a message to verify it works

## Troubleshooting

### Internal Mode Not Working
- Check if `VITE_GEMINI_API_KEY` is set
- Verify the API key is valid
- Check browser console for errors

### MCP Mode Not Working
- Verify webhook URL is correct
- Test connection in settings
- Check if webhook service is running

### No Data Showing
- Ensure Supabase connection is working
- Check RLS policies allow data access
- Verify user has proper permissions

## Features Comparison

| Feature | MCP Mode | Internal Mode |
|---------|----------|---------------|
| CRM Data Access | ❌ No | ✅ Yes |
| Conversation Memory | ✅ Yes | ✅ Yes |
| Real-time Queries | ❌ No | ✅ Yes |
| Lead Analysis | ❌ No | ✅ Yes |
| Company Insights | ❌ No | ✅ Yes |
| Job Analysis | ❌ No | ✅ Yes |
| External AI Services | ✅ Yes | ❌ No |
| Custom Prompts | ✅ Yes | ✅ Yes |

## Next Steps
1. Test both modes to ensure they work
2. Try asking data-specific questions in Internal mode
3. Compare responses between modes
4. Use Internal mode for CRM data analysis
5. Use MCP mode for general AI assistance
