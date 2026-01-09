/**
 * Chat Service for AI Integration
 * Provides webhook-based chat functionality for external AI services
 *
 * ⚠️ NOTE: This service makes direct fetch calls to webhook URLs.
 * If using external APIs (OpenAI, Anthropic), ensure they support CORS
 * or configure them through an API route proxy to avoid CORS issues.
 */

export interface ChatServiceConfig {
  webhookUrl: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  enableStreaming?: boolean;
}

export interface ChatMessage {
  message: string;
  conversationId?: string;
  context?: Record<string, unknown>;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  conversationId?: string;
  done?: boolean;
}

export class ChatService {
  private config: ChatServiceConfig;

  constructor(config: ChatServiceConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      enableStreaming: true,
      ...config,
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`,
          }),
        },
        body: JSON.stringify({
          message: 'test',
          stream: false,
        }),
        signal: AbortSignal.timeout(this.config.timeout || 30000),
      });

      return response.ok;
    } catch (error) {
      console.error('Chat service connection test failed:', error);
      return false;
    }
  }

  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`,
          }),
        },
        body: JSON.stringify(message),
        signal: AbortSignal.timeout(this.config.timeout || 30000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.content || data.message || 'No response',
        conversationId: data.conversationId,
        done: true,
      };
    } catch (error) {
      console.error('Chat service send message failed:', error);
      throw error;
    }
  }

  async sendMessageStream(
    message: ChatMessage,
    onChunk: (chunk: ChatResponse) => void
  ): Promise<void> {
    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`,
          }),
        },
        body: JSON.stringify({
          ...message,
          stream: true,
        }),
        signal: AbortSignal.timeout(this.config.timeout || 30000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const chunk = JSON.parse(line);
              onChunk({
                content: chunk.content || '',
                conversationId: chunk.conversationId,
                done: chunk.done || false,
              });
            } catch (parseError) {
              console.warn('Failed to parse chunk:', line, parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat service stream failed:', error);
      throw error;
    }
  }
}

// Pre-configured AI service configurations
export const AI_SERVICE_CONFIGS = {
  n8n: {
    webhookUrl:
      'https://n8n.srv814433.hstgr.cloud/webhook/9c3e515b-f1cf-4649-a4af-5143e3b7668e',
    timeout: 30000,
  },
  openai: {
    webhookUrl: 'https://api.openai.com/v1/chat/completions',
    timeout: 30000,
  },
  anthropic: {
    webhookUrl: 'https://api.anthropic.com/v1/messages',
    timeout: 30000,
  },
} as const;
