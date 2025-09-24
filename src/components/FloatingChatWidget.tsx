import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessageComponent, ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ChatService, ChatServiceConfig, AI_SERVICE_CONFIGS } from '@/services/chatService';
import { MessageSquare, X, Settings, TestTube, CheckCircle, XCircle, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FloatingChatWidgetProps {
  className?: string;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const [config, setConfig] = useState<ChatServiceConfig>({
    webhookUrl: '',
    apiKey: '',
    timeout: 30000,
    retryAttempts: 3,
  });
  const [selectedService, setSelectedService] = useState<string>('custom');
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    if (service !== 'custom') {
      const serviceConfig = AI_SERVICE_CONFIGS[service as keyof typeof AI_SERVICE_CONFIGS];
      setConfig(prev => ({
        ...prev,
        webhookUrl: serviceConfig.webhookUrl,
        timeout: serviceConfig.timeout,
      }));
    }
  };

  const handleSaveConfig = async () => {
    if (!config.webhookUrl.trim()) {
      toast({
        title: "Configuration Error",
        description: "Please enter a webhook URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      const service = new ChatService(config);
      setChatService(service);
      
      // Test connection
      const connected = await service.testConnection();
      setIsConnected(connected);
      
      if (connected) {
        toast({
          title: "Chat Connected",
          description: "Successfully connected to AI service.",
        });
        setShowSettings(false);
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to AI service. Please check your configuration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to configure chat service:', error);
      setError(error instanceof Error ? error.message : 'Configuration failed');
      
      toast({
        title: "Configuration Error",
        description: "Failed to configure chat service.",
        variant: "destructive",
      });
    }
  };

  const handleTestConnection = async () => {
    if (!config.webhookUrl.trim()) {
      toast({
        title: "Configuration Error",
        description: "Please enter a webhook URL before testing.",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      const tempService = new ChatService(config);
      const connected = await tempService.testConnection();
      
      toast({
        title: connected ? "Connection Successful" : "Connection Failed",
        description: connected 
          ? "Webhook is responding correctly." 
          : "Could not connect to the webhook. Please check your configuration.",
        variant: connected ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!chatService || !content.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: generateMessageId(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isLoading: true,
    };

    try {
      setMessages(prev => [...prev, userMessage, loadingMessage]);
      setIsLoading(true);
      setError(null);

      const response = await chatService.sendMessage({
        message: content.trim(),
        conversationId: conversationId || undefined,
        context: {
          timestamp: new Date().toISOString(),
          messageCount: messages.length,
        },
      });

      // Update conversation ID if provided
      if (response.conversationId && response.conversationId !== conversationId) {
        setConversationId(response.conversationId);
      }

      // Replace loading message with actual response
      const assistantMessage: ChatMessage = {
        id: loadingMessage.id,
        content: response.message,
        role: 'assistant',
        timestamp: new Date(),
        isLoading: false,
      };

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? assistantMessage : msg
      ));

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Update loading message with error
      const errorMessage: ChatMessage = {
        id: loadingMessage.id,
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        role: 'assistant',
        timestamp: new Date(),
        isLoading: false,
      };

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? errorMessage : msg
      ));
      
      setError(error instanceof Error ? error.message : 'Unknown error');
      
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please check your webhook configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
    setConversationId(null);
    toast({
      title: "Messages Cleared",
      description: "Chat history has been cleared.",
    });
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Talk to your data
          </h3>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
            {isConnected 
              ? "Ask me anything about your CRM data, leads, companies, or jobs. I can help you analyze trends, find insights, and answer questions about your recruitment pipeline."
              : "Configure your AI webhook to start chatting and get intelligent insights about your CRM data."
            }
          </p>
          {isConnected && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                Lead Analysis
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                Company Insights
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">
                Job Trends
              </span>
            </div>
          )}
        </div>
      );
    }

    return messages.map((message) => (
      <ChatMessageComponent key={message.id} message={message} />
    ));
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {isOpen && (
        <Card className={cn(
          "w-96 h-[500px] flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden",
          isMinimized ? "h-14" : ""
        )}>
          {!isMinimized && (
            <>
              {/* Header */}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                      isConnected ? "bg-green-500" : "bg-red-500"
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900">AI Assistant</CardTitle>
                    <p className="text-xs text-gray-500">
                      {isConnected ? "Ready to help" : "Configure to start"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/50 rounded-lg">
                        <Settings className="h-4 w-4 text-gray-600" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-sm">Chat Configuration</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Service Selection */}
                        <div className="space-y-2">
                          <Label htmlFor="service" className="text-xs">AI Service</Label>
                          <Select value={selectedService} onValueChange={handleServiceChange}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="custom">Custom Webhook</SelectItem>
                              <SelectItem value="openai">OpenAI</SelectItem>
                              <SelectItem value="anthropic">Anthropic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Webhook URL */}
                        <div className="space-y-2">
                          <Label htmlFor="webhookUrl" className="text-xs">Webhook URL</Label>
                          <Input
                            id="webhookUrl"
                            type="url"
                            placeholder="https://your-webhook-url.com/chat"
                            value={config.webhookUrl}
                            onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                            className="h-8 text-xs"
                          />
                        </div>

                        {/* API Key */}
                        <div className="space-y-2">
                          <Label htmlFor="apiKey" className="text-xs">API Key (Optional)</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            placeholder="Your API key"
                            value={config.apiKey}
                            onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                            className="h-8 text-xs"
                          />
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Button
                            onClick={handleTestConnection}
                            disabled={isTestingConnection || !config.webhookUrl.trim()}
                            className="w-full h-8 text-xs"
                            variant="outline"
                          >
                            <TestTube className="w-3 h-3 mr-1" />
                            {isTestingConnection ? "Testing..." : "Test Connection"}
                          </Button>
                          
                          <Button
                            onClick={handleSaveConfig}
                            disabled={!config.webhookUrl.trim()}
                            className="w-full h-8 text-xs"
                          >
                            Save Configuration
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-white/50 rounded-lg"
                    onClick={() => setIsMinimized(true)}
                  >
                    <Minimize2 className="h-4 w-4 text-gray-600" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0 overflow-hidden bg-gray-50/50">
                <ScrollArea className="h-full">
                  <div className="min-h-full p-2">
                    {renderMessages()}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input */}
              <div className="border-t border-gray-100 bg-white">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  disabled={!isConnected}
                  placeholder={isConnected ? "Ask me anything about your CRM data..." : "Configure AI webhook to start chatting..."}
                  className="p-3"
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border-t border-red-100">
                  <p className="text-xs text-red-600 font-medium">
                    Error: {error}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Minimized Header */}
          {isMinimized && (
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white",
                    isConnected ? "bg-green-500" : "bg-red-500"
                  )} />
                </div>
                <span className="text-sm font-semibold text-gray-900">AI Assistant</span>
                {messages.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700">
                    {messages.length}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-white/50 rounded-lg"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0"
          size="sm"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};
