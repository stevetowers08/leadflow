// Retell AI API Service
// This service handles all interactions with the Retell AI API

export interface RetellVoice {
  voice_id: string;
  name: string;
  gender?: string;
  accent?: string;
  language?: string;
  provider?: string;
}

export interface RetellAgent {
  agent_id: string;
  voice_id: string;
  response_engine: {
    llm_id: string;
    type: string;
  };
  name?: string;
  language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RetellPhoneNumber {
  phone_number_id: string;
  phone_number: string;
  agent_id?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at?: string;
}

export interface RetellCall {
  call_id: string;
  agent_id: string;
  to_phone_number: string;
  from_phone_number: string;
  status: 'initiated' | 'ringing' | 'in_progress' | 'ended' | 'failed';
  start_time?: string;
  end_time?: string;
  duration?: number;
  transcript?: string;
}

export interface RetellWebhook {
  webhook_id: string;
  url: string;
  events: string[];
  secret?: string;
  created_at?: string;
}

import { API_URLS } from '@/constants/urls';

class RetellAIService {
  private baseURL = API_URLS.RETELL_AI;
  private apiKey: string | null = null;

  constructor() {
    // Initialize with API key from environment or user settings (server-only)
    this.apiKey = process.env.RETELL_API_KEY || null;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Retell AI API key not configured');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Unknown error' }));
      throw new Error(
        `Retell AI API Error: ${error.message || response.statusText}`
      );
    }

    return response.json();
  }

  // Voice Management
  async getVoices(): Promise<RetellVoice[]> {
    try {
      const response = await this.makeRequest<{ voices: RetellVoice[] }>(
        '/voices'
      );
      return response.voices;
    } catch (error) {
      console.error('Failed to fetch voices:', error);
      // Return mock data as fallback
      return [
        {
          voice_id: '11labs-Adrian',
          name: 'Adrian',
          gender: 'Male',
          accent: 'American',
          language: 'en-US',
          provider: 'ElevenLabs',
        },
        {
          voice_id: '11labs-Sarah',
          name: 'Sarah',
          gender: 'Female',
          accent: 'American',
          language: 'en-US',
          provider: 'ElevenLabs',
        },
        {
          voice_id: '11labs-Michael',
          name: 'Michael',
          gender: 'Male',
          accent: 'British',
          language: 'en-GB',
          provider: 'ElevenLabs',
        },
        {
          voice_id: '11labs-Emma',
          name: 'Emma',
          gender: 'Female',
          accent: 'Australian',
          language: 'en-AU',
          provider: 'ElevenLabs',
        },
        {
          voice_id: 'playht-David',
          name: 'David',
          gender: 'Male',
          accent: 'Canadian',
          language: 'en-CA',
          provider: 'PlayHT',
        },
        {
          voice_id: 'playht-Lisa',
          name: 'Lisa',
          gender: 'Female',
          accent: 'American',
          language: 'en-US',
          provider: 'PlayHT',
        },
      ];
    }
  }

  // Agent Management
  async createAgent(agentData: Partial<RetellAgent>): Promise<RetellAgent> {
    return this.makeRequest<RetellAgent>('/agent', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async getAgents(): Promise<RetellAgent[]> {
    try {
      const response = await this.makeRequest<{ agents: RetellAgent[] }>(
        '/agents'
      );
      return response.agents;
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      return [];
    }
  }

  async updateAgent(
    agentId: string,
    agentData: Partial<RetellAgent>
  ): Promise<RetellAgent> {
    return this.makeRequest<RetellAgent>(`/agent/${agentId}`, {
      method: 'PATCH',
      body: JSON.stringify(agentData),
    });
  }

  async deleteAgent(agentId: string): Promise<void> {
    await this.makeRequest<void>(`/agent/${agentId}`, {
      method: 'DELETE',
    });
  }

  // Phone Number Management
  async getPhoneNumbers(): Promise<RetellPhoneNumber[]> {
    try {
      const response = await this.makeRequest<{
        phone_numbers: RetellPhoneNumber[];
      }>('/phone-numbers');
      return response.phone_numbers;
    } catch (error) {
      console.error('Failed to fetch phone numbers:', error);
      return [];
    }
  }

  async purchasePhoneNumber(phoneNumber: string): Promise<RetellPhoneNumber> {
    return this.makeRequest<RetellPhoneNumber>('/phone-number/purchase', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  }

  async assignPhoneNumber(
    phoneNumberId: string,
    agentId: string
  ): Promise<RetellPhoneNumber> {
    return this.makeRequest<RetellPhoneNumber>(
      `/phone-number/${phoneNumberId}/assign`,
      {
        method: 'POST',
        body: JSON.stringify({ agent_id: agentId }),
      }
    );
  }

  // Call Management
  async createCall(callData: {
    agent_id: string;
    to_phone_number: string;
    from_phone_number?: string;
  }): Promise<RetellCall> {
    return this.makeRequest<RetellCall>('/call', {
      method: 'POST',
      body: JSON.stringify(callData),
    });
  }

  async getCalls(): Promise<RetellCall[]> {
    try {
      const response = await this.makeRequest<{ calls: RetellCall[] }>(
        '/calls'
      );
      return response.calls;
    } catch (error) {
      console.error('Failed to fetch calls:', error);
      return [];
    }
  }

  async getCall(callId: string): Promise<RetellCall> {
    return this.makeRequest<RetellCall>(`/call/${callId}`);
  }

  // Webhook Management
  async createWebhook(webhookData: {
    url: string;
    events: string[];
  }): Promise<RetellWebhook> {
    return this.makeRequest<RetellWebhook>('/webhook', {
      method: 'POST',
      body: JSON.stringify(webhookData),
    });
  }

  async getWebhooks(): Promise<RetellWebhook[]> {
    try {
      const response = await this.makeRequest<{ webhooks: RetellWebhook[] }>(
        '/webhooks'
      );
      return response.webhooks;
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
      return [];
    }
  }

  async updateWebhook(
    webhookId: string,
    webhookData: Partial<RetellWebhook>
  ): Promise<RetellWebhook> {
    return this.makeRequest<RetellWebhook>(`/webhook/${webhookId}`, {
      method: 'PATCH',
      body: JSON.stringify(webhookData),
    });
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.makeRequest<void>(`/webhook/${webhookId}`, {
      method: 'DELETE',
    });
  }

  // Test Call (Simulation)
  async createTestCall(
    agentId: string,
    testPhoneNumber: string
  ): Promise<RetellCall> {
    return this.makeRequest<RetellCall>('/call', {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        to_phone_number: testPhoneNumber,
        test: true,
      }),
    });
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      return await this.makeRequest<{ status: string; timestamp: string }>(
        '/health'
      );
    } catch (error) {
      return { status: 'error', timestamp: new Date().toISOString() };
    }
  }
}

export const retellAIService = new RetellAIService();
