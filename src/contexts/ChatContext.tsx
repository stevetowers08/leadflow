import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import {
  ChatService,
  ChatServiceConfig,
  ChatRequest,
} from '@/services/chatService';
import { toast } from '@/utils/toast';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  conversationId: string | null;
  chatService: ChatService | null;
  isConnected: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | {
      type: 'UPDATE_MESSAGE';
      payload: { id: string; updates: Partial<ChatMessage> };
    }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONVERSATION_ID'; payload: string }
  | { type: 'SET_CHAT_SERVICE'; payload: ChatService }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'RESET_CHAT' };

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  conversationId: null,
  chatService: null,
  isConnected: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id
            ? { ...msg, ...action.payload.updates }
            : msg
        ),
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_CONVERSATION_ID':
      return { ...state, conversationId: action.payload };

    case 'SET_CHAT_SERVICE':
      return { ...state, chatService: action.payload };

    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };

    case 'RESET_CHAT':
      return {
        ...initialState,
        chatService: state.chatService,
        isConnected: state.isConnected,
      };

    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  resetChat: () => void;
  configureService: (config: ChatServiceConfig) => Promise<void>;
  testConnection: () => Promise<boolean>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.chatService || !content.trim()) {
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
        dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
        dispatch({ type: 'ADD_MESSAGE', payload: loadingMessage });
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const request: ChatRequest = {
          message: content.trim(),
          conversationId: state.conversationId || undefined,
          context: {
            timestamp: new Date().toISOString(),
            messageCount: state.messages.length,
          },
        };

        // Always use streaming
        let accumulatedContent = '';

        await state.chatService.sendMessageStream(
          {
            ...request,
            stream: true,
          },
          chunk => {
            if (
              chunk.conversationId &&
              chunk.conversationId !== state.conversationId
            ) {
              dispatch({
                type: 'SET_CONVERSATION_ID',
                payload: chunk.conversationId,
              });
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

              dispatch({
                type: 'UPDATE_MESSAGE',
                payload: { id: loadingMessage.id, updates: streamingMessage },
              });
            }

            if (chunk.done) {
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          }
        );
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

        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: { id: loadingMessage.id, updates: errorMessage },
        });
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Unknown error',
        });

        toast.error('Chat Error', {
          description:
            'Failed to send message. Please check your webhook configuration.',
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [
      state.chatService,
      state.conversationId,
      state.messages.length,
      generateMessageId,
    ]
  );

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const resetChat = useCallback(() => {
    dispatch({ type: 'RESET_CHAT' });
  }, []);

  const configureService = useCallback(
    async (config: ChatServiceConfig) => {
      try {
        const service = new ChatService(config);
        dispatch({ type: 'SET_CHAT_SERVICE', payload: service });

        // Test connection
        const isConnected = await service.testConnection();
        dispatch({ type: 'SET_CONNECTED', payload: isConnected });

        if (isConnected) {
          toast.success('Chat Connected', {
            description: 'Successfully connected to AI service.',
          });
        } else {
          toast.error('Connection Failed', {
            description:
              'Could not connect to AI service. Please check your configuration.',
          });
        }
      } catch (error) {
        console.error('Failed to configure chat service:', error);
        dispatch({
          type: 'SET_ERROR',
          payload:
            error instanceof Error ? error.message : 'Configuration failed',
        });

        toast.error('Configuration Error', {
          description: 'Failed to configure chat service.',
        });
      }
    },
    []
  );

  const testConnection = useCallback(async (): Promise<boolean> => {
    if (!state.chatService) {
      return false;
    }

    try {
      const isConnected = await state.chatService.testConnection();
      dispatch({ type: 'SET_CONNECTED', payload: isConnected });
      return isConnected;
    } catch (error) {
      console.error('Connection test failed:', error);
      dispatch({ type: 'SET_CONNECTED', payload: false });
      return false;
    }
  }, [state.chatService]);

  const contextValue: ChatContextType = {
    state,
    sendMessage,
    clearMessages,
    resetChat,
    configureService,
    testConnection,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
