import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { ChatMessageComponent, ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  className?: string;
  maxHeight?: string;
  showHeader?: boolean;
  placeholder?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  className,
  maxHeight = "600px",
  showHeader = true,
  placeholder = "Type your message..."
}) => {
  const { state, sendMessage } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const renderMessages = () => {
    if (state.messages.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Start a conversation
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {state.isConnected 
              ? "Send a message to begin chatting with the AI assistant."
              : "Configure your AI webhook to start chatting."
            }
          </p>
        </div>
      );
    }

    return state.messages.map((message) => (
      <ChatMessageComponent key={message.id} message={message} />
    ));
  };

  return (
    <Card className={cn("flex flex-col overflow-hidden", className)}>
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              state.isConnected ? "bg-green-500" : "bg-red-500"
            )} />
            <h2 className="font-medium">AI Chat</h2>
            {state.isConnected && (
              <span className="text-xs text-muted-foreground">
                Connected
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {state.messages.length} message{state.messages.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col" style={{ maxHeight }}>
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 p-0"
        >
          <div className="min-h-full">
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={state.isLoading}
          disabled={!state.isConnected}
          placeholder={state.isConnected ? placeholder : "Configure AI webhook to start chatting..."}
        />
      </div>

      {state.error && (
        <div className="p-3 bg-destructive/10 border-t border-destructive/20">
          <p className="text-sm text-destructive">
            Error: {state.error}
          </p>
        </div>
      )}
    </Card>
  );
};

