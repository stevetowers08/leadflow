# AI Chat Module

A comprehensive chat module for the Empowr CRM that allows users to interact with AI assistants via webhook integration.

## Features

- 🤖 **AI Integration**: Connect to any AI service via webhook
- 💬 **Real-time Chat**: Smooth, responsive chat interface
- 🔧 **Easy Configuration**: Simple setup with built-in service presets
- 🔄 **Retry Logic**: Automatic retry with exponential backoff
- 📱 **Mobile Friendly**: Responsive design that works on all devices
- 🎨 **Modern UI**: Beautiful interface using shadcn/ui components
- 🔒 **Secure**: API key support and error handling
- 📊 **Connection Status**: Visual indicators for connection health

## Components

### Core Components

- **`ChatMessage`**: Displays individual chat messages with user/AI avatars
- **`ChatInput`**: Message input with auto-resize and send functionality
- **`ChatWindow`**: Complete chat interface combining messages and input
- **`ChatPage`**: Main chat page with configuration and chat interface

### Services

- **`ChatService`**: Handles webhook communication with retry logic and error handling
- **`ChatContext`**: React context for state management across components

## Quick Start

### 1. Using the Example Webhook Server

1. **Start the example server**:
   ```bash
   cd empowr-crm-main
   node webhook-server.js
   ```

2. **Open the chat page** in your CRM at `/chat`

3. **Configure the webhook**:
   - Go to Settings
   - Set Webhook URL to: `http://localhost:3001/webhook`
   - Click "Test Connection" to verify
   - Click "Save Configuration"

4. **Start chatting**!

### 2. Using Your Own Webhook

Your webhook endpoint should:

**Accept POST requests** with this payload:
```json
{
  "message": "User's message",
  "conversationId": "optional-conversation-id",
  "context": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "messageCount": 5
  },
  "userId": "optional-user-id"
}
```

**Return JSON response**:
```json
{
  "message": "AI response text",
  "conversationId": "conversation-id",
  "metadata": {
    "model": "gpt-4",
    "tokens": 150
  }
}
```

## Configuration Options

### Webhook Settings

- **Webhook URL**: Your AI service endpoint
- **API Key**: Optional authentication key
- **Timeout**: Request timeout in milliseconds (default: 30000)
- **Retry Attempts**: Number of retry attempts (default: 3)

### Supported Services

- **Custom Webhook**: Use any webhook endpoint
- **OpenAI**: Direct integration with OpenAI API
- **Anthropic**: Direct integration with Anthropic API

## API Reference

### ChatService

```typescript
class ChatService {
  constructor(config: ChatServiceConfig)
  async sendMessage(request: ChatRequest): Promise<ChatResponse>
  async testConnection(): Promise<boolean>
  updateConfig(newConfig: Partial<ChatServiceConfig>): void
  getConfig(): Omit<ChatServiceConfig, 'apiKey'>
}
```

### ChatContext

```typescript
interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  resetChat: () => void;
  configureService: (config: ChatServiceConfig) => Promise<void>;
  testConnection: () => Promise<boolean>;
}
```

## Error Handling

The chat module includes comprehensive error handling:

- **Connection Errors**: Automatic retry with exponential backoff
- **Timeout Errors**: Configurable timeout with retry logic
- **Invalid Responses**: Graceful handling of malformed responses
- **User Feedback**: Toast notifications for all error states

## Customization

### Styling

The chat components use Tailwind CSS and can be customized by modifying the className props:

```tsx
<ChatWindow 
  className="custom-chat-styles"
  maxHeight="500px"
  showHeader={true}
/>
```

### Adding New AI Services

To add support for a new AI service:

1. **Add configuration** to `AI_SERVICE_CONFIGS`:
   ```typescript
   export const AI_SERVICE_CONFIGS = {
     // ... existing configs
     yourService: {
       webhookUrl: 'https://api.yourservice.com/chat',
       timeout: 30000,
     }
   };
   ```

2. **Update the service selector** in `ChatPage.tsx`

## Security Considerations

- **API Keys**: Store securely and never expose in client-side code
- **HTTPS**: Always use HTTPS for webhook endpoints in production
- **Validation**: Validate all incoming webhook requests
- **Rate Limiting**: Implement rate limiting on your webhook endpoint

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check webhook URL is correct
   - Verify server is running and accessible
   - Check CORS settings

2. **Messages Not Sending**
   - Verify API key is correct
   - Check webhook response format
   - Review browser console for errors

3. **Slow Responses**
   - Increase timeout setting
   - Check webhook server performance
   - Consider implementing streaming responses

### Debug Mode

Enable debug logging by opening browser console and looking for:
- Webhook request/response logs
- Error messages
- Connection status updates

## Examples

### Basic Webhook Implementation (Node.js)

```javascript
const express = require('express');
const app = express();

app.post('/webhook', async (req, res) => {
  const { message, conversationId } = req.body;
  
  // Your AI processing logic here
  const aiResponse = await processWithAI(message);
  
  res.json({
    message: aiResponse,
    conversationId: conversationId || generateId(),
    metadata: { timestamp: new Date().toISOString() }
  });
});
```

### OpenAI Integration

```javascript
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/webhook', async (req, res) => {
  const { message } = req.body;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: message }],
  });
  
  res.json({
    message: completion.choices[0].message.content,
    conversationId: req.body.conversationId,
    metadata: { model: "gpt-4", tokens: completion.usage.total_tokens }
  });
});
```

## Contributing

When contributing to the chat module:

1. Follow the existing code style
2. Add proper TypeScript types
3. Include error handling
4. Test with the example webhook server
5. Update documentation for new features

## License

This chat module is part of the Empowr CRM project and follows the same license terms.

