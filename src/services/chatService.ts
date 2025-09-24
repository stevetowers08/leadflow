import { ChatMessage } from '@/components/ChatMessage';

export interface ChatServiceConfig {
  webhookUrl: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: Record<string, any>;
  userId?: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  metadata?: Record<string, any>;
}

export class ChatService {
  private config: ChatServiceConfig;

  constructor(config: ChatServiceConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
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

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Test webhook connectivity
  async testConnection(): Promise<boolean> {
    try {
      const testRequest: ChatRequest = {
        message: 'Test connection',
        context: { test: true }
      };
      
      await this.sendMessage(testRequest);
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
  openai: {
    webhookUrl: 'https://api.openai.com/v1/chat/completions',
    timeout: 30000,
  },
  anthropic: {
    webhookUrl: 'https://api.anthropic.com/v1/messages',
    timeout: 30000,
  },
  custom: {
    webhookUrl: '',
    timeout: 30000,
  }
} as const;

