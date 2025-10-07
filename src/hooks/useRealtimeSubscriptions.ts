import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

// Real-time subscription configuration
export const REALTIME_CONFIG = {
  // Different subscription types for different data
  SUBSCRIPTION_TYPES: {
    PEOPLE: 'people',
    COMPANIES: 'companies', 
    JOBS: 'jobs',
    INTERACTIONS: 'interactions',
    CAMPAIGNS: 'campaigns',
    CAMPAIGN_PARTICIPANTS: 'campaign_participants',
    USER_PROFILES: 'user_profiles',
  },
  
  // Event types to listen for
  EVENTS: {
    INSERT: 'INSERT',
    UPDATE: 'UPDATE', 
    DELETE: 'DELETE',
    ALL: '*'
  },
  
  // Debounce delays for different event types
  DEBOUNCE_DELAYS: {
    INSERT: 100, // 100ms
    UPDATE: 200, // 200ms
    DELETE: 50,  // 50ms
  }
};

// Real-time subscription hook
export function useRealtimeSubscription(
  table: string,
  options: {
    events?: string[];
    filter?: string;
    onInsert?: (payload: any) => void;
    onUpdate?: (payload: any) => void;
    onDelete?: (payload: any) => void;
    enabled?: boolean;
    debounceMs?: number;
  } = {}
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<any>(null);
  
  const {
    events = [REALTIME_CONFIG.EVENTS.ALL],
    filter,
    onInsert,
    onUpdate,
    onDelete,
    enabled = true,
    debounceMs = 100
  } = options;

  // Debounced event handler
  const debouncedEventHandler = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (eventType: string, payload: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          handleRealtimeEvent(eventType, payload);
        }, debounceMs);
      };
    })(),
    [debounceMs]
  );

  // Handle real-time events
  const handleRealtimeEvent = useCallback((eventType: string, payload: any) => {
    console.log(`🔄 Real-time ${eventType} event for ${table}:`, payload);
    
    setLastEvent({ eventType, payload, timestamp: new Date() });
    
    // Invalidate relevant queries
    queryClient.invalidateQueries({ queryKey: [table] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    
    // Call custom handlers
    switch (eventType) {
      case REALTIME_CONFIG.EVENTS.INSERT:
        if (onInsert) onInsert(payload);
        toast({
          title: "New Data",
          description: `New ${table} record added`,
        });
        break;
      case REALTIME_CONFIG.EVENTS.UPDATE:
        if (onUpdate) onUpdate(payload);
        break;
      case REALTIME_CONFIG.EVENTS.DELETE:
        if (onDelete) onDelete(payload);
        toast({
          title: "Data Removed",
          description: `${table} record deleted`,
        });
        break;
    }
  }, [table, queryClient, toast, onInsert, onUpdate, onDelete]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: events.includes('*') ? '*' : events.join(','),
          schema: 'public',
          table: table,
          filter: filter,
        },
        (payload) => {
          debouncedEventHandler(payload.eventType, payload);
        }
      )
      .subscribe((status) => {
        console.log(`📡 Real-time subscription status for ${table}:`, status);
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Successfully subscribed to ${table} changes`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ Error subscribing to ${table} changes`);
          toast({
            title: "Connection Error",
            description: `Failed to connect to real-time updates for ${table}`,
            variant: "destructive",
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        console.log(`🔌 Unsubscribing from ${table} changes`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setIsConnected(false);
      }
    };
  }, [table, events, filter, enabled, debouncedEventHandler, toast]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsConnected(false);
    }
    // The useEffect will automatically recreate the subscription
  }, []);

  return {
    isConnected,
    lastEvent,
    reconnect,
    channel: channelRef.current,
  };
}

// Multi-table real-time subscription hook
export function useMultiTableRealtime(
  tables: Array<{
    table: string;
    events?: string[];
    filter?: string;
    onInsert?: (payload: any) => void;
    onUpdate?: (payload: any) => void;
    onDelete?: (payload: any) => void;
  }>,
  options: {
    enabled?: boolean;
    debounceMs?: number;
  } = {}
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Record<string, boolean>>({});
  const [lastEvents, setLastEvents] = useState<Record<string, any>>({});
  
  const { enabled = true, debounceMs = 100 } = options;

  // Create subscriptions for each table
  useEffect(() => {
    if (!enabled) return;

    const channels: RealtimeChannel[] = [];
    const connectionStates: Record<string, boolean> = {};
    const eventStates: Record<string, any> = {};

    tables.forEach(({ table, events = ['*'], filter, onInsert, onUpdate, onDelete }) => {
      const channel = supabase
        .channel(`${table}-multi-subscription`)
        .on(
          'postgres_changes',
          {
            event: events.includes('*') ? '*' : events.join(','),
            schema: 'public',
            table: table,
            filter: filter,
          },
          (payload) => {
            // Debounced event handling
            setTimeout(() => {
              console.log(`🔄 Multi-table ${payload.eventType} event for ${table}:`, payload);
              
              eventStates[table] = { eventType: payload.eventType, payload, timestamp: new Date() };
              setLastEvents({ ...eventStates });
              
              // Invalidate queries
              queryClient.invalidateQueries({ queryKey: [table] });
              queryClient.invalidateQueries({ queryKey: ['dashboard'] });
              
              // Call custom handlers
              switch (payload.eventType) {
                case REALTIME_CONFIG.EVENTS.INSERT:
                  if (onInsert) onInsert(payload);
                  break;
                case REALTIME_CONFIG.EVENTS.UPDATE:
                  if (onUpdate) onUpdate(payload);
                  break;
                case REALTIME_CONFIG.EVENTS.DELETE:
                  if (onDelete) onDelete(payload);
                  break;
              }
            }, debounceMs);
          }
        )
        .subscribe((status) => {
          console.log(`📡 Multi-table subscription status for ${table}:`, status);
          connectionStates[table] = status === 'SUBSCRIBED';
          setConnections({ ...connectionStates });
          
          if (status === 'CHANNEL_ERROR') {
            toast({
              title: "Connection Error",
              description: `Failed to connect to real-time updates for ${table}`,
              variant: "destructive",
            });
          }
        });

      channels.push(channel);
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setConnections({});
      setLastEvents({});
    };
  }, [tables, enabled, debounceMs, queryClient, toast]);

  const reconnectAll = useCallback(() => {
    // Force reconnection by clearing all channels
    supabase.removeAllChannels();
    setConnections({});
    setLastEvents({});
  }, []);

  const isAnyConnected = Object.values(connections).some(Boolean);
  const allConnected = Object.values(connections).every(Boolean);

  return {
    connections,
    lastEvents,
    isAnyConnected,
    allConnected,
    reconnectAll,
  };
}

// Real-time presence hook for collaborative features
export function useRealtimePresence(
  channelName: string,
  options: {
    enabled?: boolean;
    onPresenceChange?: (presence: any) => void;
    onJoin?: (key: string, currentPresences: any) => void;
    onLeave?: (key: string, currentPresences: any) => void;
  } = {}
) {
  const { toast } = useToast();
  const [presence, setPresence] = useState<any>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  const {
    enabled = true,
    onPresenceChange,
    onJoin,
    onLeave
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setPresence(newState);
        
        const users = Object.keys(newState);
        setOnlineUsers(users);
        
        if (onPresenceChange) {
          onPresenceChange(newState);
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log(`👤 User joined: ${key}`);
        if (onJoin) onJoin(key, newPresences);
        
        toast({
          title: "User Online",
          description: `${key} is now online`,
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log(`👋 User left: ${key}`);
        if (onLeave) onLeave(key, leftPresences);
        
        toast({
          title: "User Offline",
          description: `${key} went offline`,
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user's presence
          await channel.track({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        setPresence({});
        setOnlineUsers([]);
      }
    };
  }, [channelName, enabled, onPresenceChange, onJoin, onLeave, toast]);

  const updatePresence = useCallback(async (data: any) => {
    if (channelRef.current) {
      await channelRef.current.track(data);
    }
  }, []);

  return {
    presence,
    onlineUsers,
    updatePresence,
    isConnected: !!channelRef.current,
  };
}

// Real-time statistics hook
export function useRealtimeStats() {
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeConnections: 0,
    eventsReceived: 0,
    lastEventTime: null as Date | null,
  });

  const updateStats = useCallback((eventType: string, table: string) => {
    setStats(prev => ({
      ...prev,
      eventsReceived: prev.eventsReceived + 1,
      lastEventTime: new Date(),
    }));
  }, []);

  return {
    stats,
    updateStats,
  };
}
