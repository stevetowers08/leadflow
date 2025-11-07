import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import React from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
  dataContext?: Record<string, unknown>;
  error?: string;
  errorType?: 'config' | 'network' | 'quota' | 'api' | 'unknown';
}

interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
}) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn('flex gap-3 p-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <Avatar className='h-8 w-8 flex-shrink-0'>
        <AvatarImage src={isUser ? undefined : undefined} />
        <AvatarFallback
          className={cn(
            'text-xs font-semibold',
            isUser
              ? 'bg-gradient-to-br from-primary to-primary/80 text-white'
              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-foreground'
          )}
        >
          {isUser ? <User className='h-4 w-4' /> : <Bot className='h-4 w-4' />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          'flex flex-col gap-2 max-w-[85%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <Card
          className={cn(
            'px-4 py-3 text-sm shadow-sm border-0',
            isUser
              ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl rounded-br-md'
              : message.error
                ? 'bg-destructive/10 text-destructive rounded-2xl rounded-bl-md border border-red-200'
                : 'bg-white text-foreground rounded-2xl rounded-bl-md border border-gray-100'
          )}
        >
          {message.isLoading ? (
            <div className='flex items-center gap-3'>
              <div className='flex gap-1'>
                <div
                  className='w-2 h-2 bg-current rounded-full animate-bounce'
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className='w-2 h-2 bg-current rounded-full animate-bounce'
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className='w-2 h-2 bg-current rounded-full animate-bounce'
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <span className='text-xs opacity-80 font-medium'>
                AI is thinking...
              </span>
            </div>
          ) : (
            <div className='whitespace-pre-wrap break-words leading-relaxed'>
              {message.content}
              {message.error && (
                <div className='mt-2 text-xs opacity-75'>
                  Error type: {message.errorType || 'unknown'}
                </div>
              )}
            </div>
          )}
        </Card>

        <div
          className={cn(
            'text-xs text-muted-foreground px-2 font-medium',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};
