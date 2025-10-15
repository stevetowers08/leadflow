import { ChatInput } from '@/components/ai/ChatInput';
import { ChatMessage, ChatMessageComponent } from '@/components/ai/ChatMessage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AI_SERVICE_CONFIGS,
  ChatService,
  ChatServiceConfig,
} from '@/services/chatService';
import {
  ChatContext,
  dataAwareGeminiChatService,
} from '@/services/dataAwareGeminiChatService';
import {
  Bot,
  Database,
  Maximize2,
  MessageSquare,
  Minimize2,
  Settings,
  TestTube,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface FloatingChatWidgetProps {
  className?: string;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const [config, setConfig] = useState<ChatServiceConfig>({
    webhookUrl:
      'https://n8n.srv814433.hstgr.cloud/webhook/9c3e515b-f1cf-4649-a4af-5143e3b7668e',
    apiKey: '',
    timeout: 30000,
    retryAttempts: 3,
    enableStreaming: true,
  });
  const [selectedService, setSelectedService] = useState<string>('n8n');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [chatMode, setChatMode] = useState<'mcp' | 'internal'>('mcp');
  const [chatContext, setChatContext] = useState<ChatContext>({
    conversationId: dataAwareGeminiChatService.generateConversationId(),
    messages: [],
  });

  const generateMessageId = () =>
    `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Initialize chat service based on mode
  useEffect(() => {
    const initializeChatService = async () => {
      try {
        if (chatMode === 'internal') {
          // Use data-aware Gemini service
          console.log('Initializing internal data-aware chat service');
          setChatService(null); // No ChatService needed for internal mode
          const connected = dataAwareGeminiChatService.isAvailable();
          console.log('Internal service available:', connected);
          setIsConnected(connected);

          if (connected) {
            console.log('Data-aware chat service ready');
          } else {
            console.log(
              'Data-aware chat service not available - check Gemini API key'
            );
          }
        } else {
          // Use MCP/webhook service
          console.log('Initializing MCP chat service with config:', config);
          const service = new ChatService(config);
          setChatService(service);
          console.log('Chat service created:', service);

          // Test connection
          console.log('Testing MCP connection...');
          const connected = await service.testConnection();
          console.log('MCP connection test result:', connected);
          setIsConnected(connected);

          if (connected) {
            console.log('Chat service connected to MCP webhook');
          } else {
            console.log('Chat service failed to connect to webhook');
          }
        }
      } catch (error) {
        console.error('Failed to initialize chat service:', error);
        setIsConnected(false);
      }
    };

    initializeChatService();
  }, [chatMode, config]);

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    if (service !== 'custom') {
      const serviceConfig =
        AI_SERVICE_CONFIGS[service as keyof typeof AI_SERVICE_CONFIGS];
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
        title: 'Configuration Error',
        description: 'Please enter a webhook URL.',
        variant: 'destructive',
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
          title: 'Chat Connected',
          description: 'Successfully connected to AI service.',
        });
        setShowSettings(false);
      } else {
        toast({
          title: 'Connection Failed',
          description:
            'Could not connect to AI service. Please check your configuration.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to configure chat service:', error);
      setError(error instanceof Error ? error.message : 'Configuration failed');

      toast({
        title: 'Configuration Error',
        description: 'Failed to configure chat service.',
        variant: 'destructive',
      });
    }
  };

  const handleTestConnection = async () => {
    if (!config.webhookUrl.trim()) {
      toast({
        title: 'Configuration Error',
        description: 'Please enter a webhook URL before testing.',
        variant: 'destructive',
      });
      return;
    }

    setIsTestingConnection(true);
    try {
      const tempService = new ChatService(config);
      const connected = await tempService.testConnection();

      toast({
        title: connected ? 'Connection Successful' : 'Connection Failed',
        description: connected
          ? 'Webhook is responding correctly.'
          : 'Could not connect to the webhook. Please check your configuration.',
        variant: connected ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Connection Test Failed',
        description:
          error instanceof Error ? error.message : 'Unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    console.log('handleSendMessage called with:', content);
    console.log('chatMode:', chatMode);
    console.log('isConnected:', isConnected);

    if (!content.trim()) {
      console.log('Early return: content missing');
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

      if (chatMode === 'internal') {
        // Use data-aware Gemini service
        console.log('Using internal data-aware service...');

        // Update chat context with new message
        const updatedContext: ChatContext = {
          ...chatContext,
          messages: [...chatContext.messages, userMessage],
        };
        setChatContext(updatedContext);

        const response = await dataAwareGeminiChatService.chatWithData(
          content.trim(),
          updatedContext,
          chunk => {
            // Handle streaming updates
            const streamingMessage: ChatMessage = {
              id: loadingMessage.id,
              content: chunk.content,
              role: 'assistant',
              timestamp: new Date(),
              isLoading: !chunk.done,
              dataContext: chunk.dataContext,
            };

            setMessages(prev =>
              prev.map(msg =>
                msg.id === loadingMessage.id ? streamingMessage : msg
              )
            );
          }
        );

        // Final message update (in case streaming didn't work)
        const responseMessage: ChatMessage = {
          id: loadingMessage.id,
          content: response.message,
          role: 'assistant',
          timestamp: new Date(),
          isLoading: false,
          dataContext: response.dataContext,
          error: response.error,
          errorType: response.errorType as any,
        };

        setMessages(prev =>
          prev.map(msg =>
            msg.id === loadingMessage.id ? responseMessage : msg
          )
        );

        // Update chat context with response
        setChatContext(prev => ({
          ...prev,
          messages: [...prev.messages, responseMessage],
        }));
      } else {
        // Use MCP/webhook service
        if (!chatService) {
          throw new Error('MCP chat service not available');
        }

        console.log('Using MCP service...');
        let accumulatedContent = '';

        await chatService.sendMessageStream(
          {
            message: content.trim(),
            conversationId: conversationId || undefined,
            context: {
              timestamp: new Date().toISOString(),
              messageCount: messages.length,
            },
            stream: true,
          },
          chunk => {
            console.log('Received chunk:', chunk);
            if (
              chunk.conversationId &&
              chunk.conversationId !== conversationId
            ) {
              setConversationId(chunk.conversationId);
            }

            if (chunk.content) {
              accumulatedContent += chunk.content;

              // Update the loading message with accumulated content
              const streamingMessage: ChatMessage = {
                id: loadingMessage.id,
                content: accumulatedContent,
                role: 'assistant',
                timestamp: new Date(),
                isLoading: !chunk.done,
              };

              setMessages(prev =>
                prev.map(msg =>
                  msg.id === loadingMessage.id ? streamingMessage : msg
                )
              );
            }

            if (chunk.done) {
              setIsLoading(false);
            }
          }
        );
      }
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

      setMessages(prev =>
        prev.map(msg => (msg.id === loadingMessage.id ? errorMessage : msg))
      );

      setError(error instanceof Error ? error.message : 'Unknown error');

      toast({
        title: 'Chat Error',
        description: `Failed to send message. ${chatMode === 'internal' ? 'Check your Gemini API key.' : 'Please check your webhook configuration.'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
    setConversationId(null);
    toast({
      title: 'Messages Cleared',
      description: 'Chat history has been cleared.',
    });
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center h-full text-center p-6 sm:p-8'>
          <div className='w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-sidebar-primary/15 to-sidebar-primary/25 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg ring-1 ring-sidebar-primary/10'>
            <Bot className='w-8 h-8 sm:w-10 sm:h-10 text-sidebar-primary' />
          </div>
          <h3 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 tracking-tight'>
            Talk to your data
          </h3>
          <p className='text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-sm leading-relaxed mb-4 sm:mb-6'>
            {isConnected
              ? chatMode === 'internal'
                ? 'Ask me anything about your CRM data, leads, companies, or jobs. I can help you analyze trends, find insights, and answer questions about your recruitment pipeline.'
                : "Ask me anything and I'll help you with your questions using the configured AI service."
              : chatMode === 'internal'
                ? 'Configure your Gemini API key to start chatting with your CRM data.'
                : 'Configure your AI webhook to start chatting and get intelligent insights.'}
          </p>
          {isConnected && (
            <div className='flex flex-wrap gap-1.5 sm:gap-2 justify-center'>
              <span className='px-3 py-1.5 sm:px-4 sm:py-2 bg-sidebar-primary/10 text-sidebar-primary text-xs sm:text-sm rounded-full font-medium ring-1 ring-sidebar-primary/20'>
                Lead Analysis
              </span>
              <span className='px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 text-emerald-700 text-xs sm:text-sm rounded-full font-medium ring-1 ring-emerald-200'>
                Company Insights
              </span>
              <span className='px-3 py-1.5 sm:px-4 sm:py-2 bg-sidebar-primary/10 text-sidebar-primary text-xs sm:text-sm rounded-full font-medium ring-1 ring-sidebar-primary/20'>
                Job Trends
              </span>
            </div>
          )}
        </div>
      );
    }

    return messages.map(message => (
      <ChatMessageComponent key={message.id} message={message} />
    ));
  };

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      {isOpen && (
        <Card
          className={cn(
            'w-[480px] h-[600px] flex flex-col shadow-2xl border border-border bg-white rounded-3xl overflow-hidden',
            'ring-1 ring-white/20',
            'max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]',
            'sm:w-[480px] sm:h-[600px]',
            'xs:w-[calc(100vw-2rem)] xs:h-[calc(100vh-2rem)] xs:bottom-4 xs:right-4',
            isMinimized ? 'h-14' : ''
          )}
        >
          {!isMinimized && (
            <>
              {/* Header */}
              <CardHeader className='flex flex-row items-center justify-between space-y-0 p-4 sm:p-6 bg-gradient-to-r from-sidebar-primary/8 via-sidebar-primary/5 to-sidebar-primary/8 border-b border-sidebar-primary/10'>
                <div className='flex items-center gap-3 sm:gap-4'>
                  <div className='relative'>
                    <div className='w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-sidebar-primary via-sidebar-primary to-sidebar-primary/90 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-sidebar-primary/20'>
                      <Bot className='h-4 w-4 sm:h-5 sm:w-5 text-white' />
                    </div>
                    <div
                      className={cn(
                        'absolute -bottom-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white shadow-sm',
                        isConnected ? 'bg-emerald-500' : 'bg-red-500'
                      )}
                    />
                  </div>
                  <div>
                    <CardTitle className='text-base sm:text-lg font-semibold text-gray-900 tracking-tight'>
                      AI Assistant
                      <span className='ml-2 text-xs font-normal text-gray-500'>
                        ({chatMode === 'internal' ? 'Data-Aware' : 'MCP'})
                      </span>
                    </CardTitle>
                    <p className='text-xs sm:text-sm text-gray-600 font-medium'>
                      {isConnected
                        ? 'Ready to help'
                        : chatMode === 'internal'
                          ? 'Check Gemini API key'
                          : 'Configure to start'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-9 w-9 p-0 hover:bg-white/60 rounded-xl transition-all duration-200 hover:scale-105'
                      >
                        <Settings className='h-4 w-4 text-gray-600' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-md'>
                      <DialogHeader>
                        <DialogTitle className='text-sm'>
                          Chat Configuration
                        </DialogTitle>
                      </DialogHeader>
                      <div className='space-y-4'>
                        {/* Chat Mode Selection */}
                        <div className='space-y-2'>
                          <Label htmlFor='chatMode' className='text-xs'>
                            Chat Mode
                          </Label>
                          <Select
                            value={chatMode}
                            onValueChange={(value: 'mcp' | 'internal') =>
                              setChatMode(value)
                            }
                          >
                            <SelectTrigger className='h-8'>
                              <SelectValue placeholder='Select chat mode' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='mcp'>
                                <div className='flex items-center gap-2'>
                                  <MessageSquare className='w-3 h-3' />
                                  MCP (External)
                                </div>
                              </SelectItem>
                              <SelectItem value='internal'>
                                <div className='flex items-center gap-2'>
                                  <Database className='w-3 h-3' />
                                  Internal (Data-Aware)
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* MCP Service Selection - Only show for MCP mode */}
                        {chatMode === 'mcp' && (
                          <div className='space-y-2'>
                            <Label htmlFor='service' className='text-xs'>
                              MCP Service
                            </Label>
                            <Select
                              value={selectedService}
                              onValueChange={handleServiceChange}
                            >
                              <SelectTrigger className='h-8'>
                                <SelectValue placeholder='Select service' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='custom'>
                                  Custom Webhook
                                </SelectItem>
                                <SelectItem value='openai'>OpenAI</SelectItem>
                                <SelectItem value='anthropic'>
                                  Anthropic
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Webhook URL - Only show for MCP mode */}
                        {chatMode === 'mcp' && (
                          <div className='space-y-2'>
                            <Label htmlFor='webhookUrl' className='text-xs'>
                              Webhook URL
                            </Label>
                            <Input
                              id='webhookUrl'
                              type='url'
                              placeholder='https://your-webhook-url.com/chat'
                              value={config.webhookUrl}
                              onChange={e =>
                                setConfig(prev => ({
                                  ...prev,
                                  webhookUrl: e.target.value,
                                }))
                              }
                              className='h-8 text-xs'
                            />
                          </div>
                        )}

                        {/* API Key - Only show for MCP mode */}
                        {chatMode === 'mcp' && (
                          <div className='space-y-2'>
                            <Label htmlFor='apiKey' className='text-xs'>
                              API Key (Optional)
                            </Label>
                            <Input
                              id='apiKey'
                              type='password'
                              placeholder='Your API key'
                              value={config.apiKey}
                              onChange={e =>
                                setConfig(prev => ({
                                  ...prev,
                                  apiKey: e.target.value,
                                }))
                              }
                              className='h-8 text-xs'
                            />
                          </div>
                        )}

                        {/* Internal Mode Info */}
                        {chatMode === 'internal' && (
                          <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                            <div className='text-xs font-semibold text-blue-700 mb-1'>
                              Internal Data-Aware Chat
                            </div>
                            <div className='text-xs text-blue-900'>
                              This mode uses Google Gemini AI with direct access
                              to your CRM data. Make sure VITE_GEMINI_API_KEY is
                              configured in your environment.
                            </div>
                          </div>
                        )}

                        <Separator />

                        {/* Action Buttons - Only show for MCP mode */}
                        {chatMode === 'mcp' && (
                          <div className='space-y-2'>
                            <Button
                              onClick={handleTestConnection}
                              disabled={
                                isTestingConnection || !config.webhookUrl.trim()
                              }
                              className='w-full h-8 text-xs'
                              variant='outline'
                            >
                              <TestTube className='w-3 h-3 mr-1' />
                              {isTestingConnection
                                ? 'Testing...'
                                : 'Test Connection'}
                            </Button>

                            <Button
                              onClick={handleSaveConfig}
                              disabled={!config.webhookUrl.trim()}
                              className='w-full h-8 text-xs'
                            >
                              Save Configuration
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-9 w-9 p-0 hover:bg-white/60 rounded-xl transition-all duration-200 hover:scale-105'
                    onClick={() => setIsMinimized(true)}
                  >
                    <Minimize2 className='h-4 w-4 text-gray-600' />
                  </Button>

                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 hover:scale-105'
                    onClick={() => setIsOpen(false)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className='flex-1 p-0 overflow-hidden bg-gradient-to-b from-gray-50/30 to-gray-50/60'>
                <ScrollArea ref={scrollAreaRef} className='h-full'>
                  <div className='min-h-full p-3 sm:p-4 space-y-2 sm:space-y-3'>
                    {renderMessages()}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input */}
              <div className='border-t border-sidebar-primary/10 bg-white'>
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  disabled={!isConnected}
                  placeholder={
                    isConnected
                      ? chatMode === 'internal'
                        ? 'Ask me anything about your CRM data...'
                        : 'Ask me anything...'
                      : chatMode === 'internal'
                        ? 'Configure Gemini API key to start...'
                        : 'Configure AI webhook to start chatting...'
                  }
                  className='p-3 sm:p-4'
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className='p-3 sm:p-4 bg-red-50/80 border-t border-red-200/50 backdrop-blur-sm'>
                  <p className='text-xs sm:text-sm text-red-700 font-medium'>
                    Error: {error}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Minimized Header */}
          {isMinimized && (
            <div className='flex items-center justify-between p-4 bg-gradient-to-r from-primary/8 via-primary/5 to-primary/8'>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <div className='w-7 h-7 bg-gradient-to-br from-primary via-primary to-primary/90 rounded-xl flex items-center justify-center shadow-md ring-1 ring-primary/20'>
                    <Bot className='h-3.5 w-3.5 text-white' />
                  </div>
                  <div
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white shadow-sm',
                      isConnected ? 'bg-emerald-500' : 'bg-red-500'
                    )}
                  />
                </div>
                <span className='text-sm font-semibold text-gray-900'>
                  AI Assistant
                </span>
                {messages.length > 0 && (
                  <Badge
                    variant='secondary'
                    className='text-xs px-2.5 py-1 bg-sidebar-primary/10 text-sidebar-primary font-medium'
                  >
                    {messages.length}
                  </Badge>
                )}
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 hover:bg-white/60 rounded-xl transition-all duration-200 hover:scale-105'
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className='h-4 w-4 text-gray-600' />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className='h-16 w-16 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-br from-sidebar-primary via-sidebar-primary to-sidebar-primary/90 hover:from-sidebar-primary/95 hover:to-sidebar-primary/80 border-0 ring-2 ring-sidebar-primary/20 hover:ring-sidebar-primary/30 hover:scale-105 sm:h-16 sm:w-16 xs:h-14 xs:w-14'
          size='sm'
        >
          <MessageSquare className='h-7 w-7 text-white sm:h-7 sm:w-7 xs:h-6 xs:w-6' />
        </Button>
      )}
    </div>
  );
};

export default FloatingChatWidget;
