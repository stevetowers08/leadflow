#!/usr/bin/env node

/**
 * Example Webhook Server for AI Chat Integration
 * 
 * This is a simple Node.js server that demonstrates how to create a webhook
 * endpoint for the chat module. You can use this as a starting point or
 * integrate it with your existing AI service.
 * 
 * Usage:
 * 1. Install dependencies: npm install express cors
 * 2. Run the server: node webhook-server.js
 * 3. Configure the chat module to use: http://localhost:3001/webhook
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple AI response simulation
const generateAIResponse = (userMessage, conversationId) => {
  const responses = [
    "I can help you analyze your CRM data! Let me look into that for you...",
    "Based on your CRM data, here's what I found:",
    "Great question about your leads and companies! Here's my analysis:",
    "I can provide insights about your recruitment pipeline. Let me check:",
    "That's an interesting query about your data. Here's what I discovered:",
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    message: `${randomResponse} "${userMessage}" - This is a simulated AI response for your CRM data. In a real implementation, you would integrate with services like OpenAI, Anthropic, or your custom AI model to analyze your actual leads, companies, jobs, and opportunities data.`,
    conversationId: conversationId || `conv_${Date.now()}`,
    metadata: {
      timestamp: new Date().toISOString(),
      model: "simulated-crm-ai",
      tokens: Math.floor(Math.random() * 100) + 50,
    }
  };
};

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    console.log('Received webhook request:', {
      body: req.body,
      headers: req.headers,
      timestamp: new Date().toISOString()
    });

    const { message, conversationId, context, userId } = req.body;

    // Validate request
    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate AI response
    const response = generateAIResponse(message, conversationId);

    console.log('Sending response:', response);

    res.json(response);

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test endpoint for connection testing
app.post('/test', (req, res) => {
  res.json({
    message: 'Connection test successful!',
    conversationId: 'test_conversation',
    metadata: {
      test: true,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
  console.log('\nTo use with the chat module:');
  console.log(`1. Open the chat page in your CRM`);
  console.log(`2. Go to Settings`);
  console.log(`3. Set Webhook URL to: http://localhost:${PORT}/webhook`);
  console.log(`4. Click "Test Connection" to verify`);
  console.log(`5. Click "Save Configuration" to start chatting!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down webhook server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down webhook server...');
  process.exit(0);
});
