import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder = "Type your message...",
  className
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-3", className)}>
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="min-h-[48px] max-h-[120px] resize-none pr-12 rounded-2xl border-gray-200 focus:border-sidebar-primary focus:ring-1 focus:ring-sidebar-primary bg-gray-50/50"
          rows={1}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
          {message.length > 0 && `${message.length}`}
        </div>
      </div>
      
      <Button
        type="submit"
        size="sm"
        disabled={!canSend}
        className="h-12 w-12 p-0 flex-shrink-0 rounded-full bg-sidebar-primary hover:bg-sidebar-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        ) : (
          <Send className="h-5 w-5 text-white" />
        )}
      </Button>
    </form>
  );
};
