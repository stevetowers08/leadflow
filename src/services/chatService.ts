import { ChatMessage } from '@/components/ChatMessage';

export interface ChatServiceConfig {
  webhookUrl: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  enableStreaming?: boolean;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: Record<string, any>;
  userId?: string;
  stream?: boolean;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  metadata?: Record<string, any>;
}

export interface StreamChunk {
  content: string;
  done: boolean;
  conversationId?: string;
  metadata?: Record<string, any>;
}

export type StreamCallback = (chunk: StreamChunk) => void;

export class ChatService {
  private config: ChatServiceConfig;

  constructor(config: ChatServiceConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      enableStreaming: true, // Always enable streaming by default
      ...config
    };
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { webhookUrl, apiKey, timeout, retryAttempts } = this.config;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const payload = {
      message: request.message,
      conversationId: request.conversationId,
      context: request.context,
      userId: request.userId,
      timestamp: new Date().toISOString(),
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryAttempts!; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        return {
          message: data.message || data.response || data.text || 'No response received',
          conversationId: data.conversationId || request.conversationId || this.generateConversationId(),
          metadata: data.metadata || data.meta || {},
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retryAttempts!) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed to send message after ${retryAttempts} attempts: ${lastError?.message}`);
  }

  async sendMessageStream(request: ChatRequest, onChunk: StreamCallback): Promise<void> {
    const { webhookUrl, apiKey, timeout } = this.config;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const payload = {
      message: request.message,
      conversationId: request.conversationId,
      context: request.context,
      userId: request.userId,
      stream: true,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending payload to webhook:', payload);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      
      // Check if response is actually streaming (SSE)
      if (contentType.includes('text/event-stream')) {
        // Handle Server-Sent Events streaming
        if (!response.body) {
          throw new Error('No response body available for streaming');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let conversationId = request.conversationId || this.generateConversationId();

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim() === '') continue;
              
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  onChunk({ content: '', done: true, conversationId });
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const chunk: StreamChunk = {
                    content: parsed.content || parsed.delta || parsed.text || '',
                    done: parsed.done || false,
                    conversationId: parsed.conversationId || conversationId,
                    metadata: parsed.metadata || parsed.meta || {},
                  };
                  
                  onChunk(chunk);
                  
                  if (chunk.conversationId) {
                    conversationId = chunk.conversationId;
                  }
                } catch (parseError) {
                  // If it's not JSON, treat as plain text content
                  onChunk({ 
                    content: data, 
                    done: false, 
                    conversationId 
                  });
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }
      } else {
        // Handle regular response (could be JSON or plain text)
        const responseText = await response.text();
        console.log('Received response from webhook (raw):', responseText);
        
        let responseData;
        let responseContent;
        
        try {
          // Try to parse as JSON first
          responseData = JSON.parse(responseText);
          console.log('Parsed as JSON:', responseData);
          responseContent = responseData.message || responseData.response || responseData.text || responseData.output || responseText;
        } catch (parseError) {
          // If not JSON, treat as plain text
          console.log('Not JSON, treating as plain text');
          responseData = {};
          responseContent = responseText;
        }
        
        const conversationId = responseData.conversationId || request.conversationId || this.generateConversationId();
        console.log('Final response content:', responseContent);
        
        // Send response immediately
        onChunk({
          content: responseContent,
          done: true,
          conversationId,
          metadata: responseData.metadata || responseData.meta || {},
        });
      }

    } catch (error) {
      console.error('Streaming error:', error);
      onChunk({ 
        content: '', 
        done: true, 
        conversationId: request.conversationId || this.generateConversationId(),
        metadata: { error: error instanceof Error ? error.message : 'Streaming failed' }
      });
    }
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Test webhook connectivity
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing webhook connection to:', this.config.webhookUrl);
      
      const { webhookUrl, timeout } = this.config;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      const payload = {
        message: 'Test connection',
        context: { test: true },
        timestamp: new Date().toISOString(),
      };

      console.log('Sending test payload:', payload);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Test response status:', response.status);
      console.log('Test response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Just check if we get a response, don't need to parse it
      const responseText = await response.text();
      console.log('Test response received:', responseText.substring(0, 100) + '...');
      
      return true;
    } catch (error) {
      console.error('Webhook connection test failed:', error);
      return false;
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<ChatServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration (without sensitive data)
  getConfig(): Omit<ChatServiceConfig, 'apiKey'> {
    const { apiKey, ...safeConfig } = this.config;
    return safeConfig;
  }
}

// Default webhook configurations for popular AI services
export const AI_SERVICE_CONFIGS = {
  n8n: {
    webhookUrl: 'https://n8n.srv814433.hstgr.cloud/webhook/9c3e515b-f1cf-4649-a4af-5143e3b7668e',
    timeout: 30000,
    enableStreaming: true,
  },
  openai: {
    webhookUrl: 'https://api.openai.com/v1/chat/completions',
    timeout: 30000,
    enableStreaming: true,
  },
  anthropic: {
    webhookUrl: 'https://api.anthropic.com/v1/messages',
    timeout: 30000,
    enableStreaming: true,
  },
  custom: {
    webhookUrl: '',
    timeout: 30000,
    enableStreaming: true,
  }
} as const;

