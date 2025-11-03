import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SmallSlidePanel } from '@/components/ui/SmallSlidePanel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  notificationService,
  type Notification,
} from '@/services/notificationService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  Briefcase,
  Calendar,
  Loader2,
  Mail,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSlidePanel } from '@/contexts/SlidePanelContext';

const NOTIFICATION_ICONS = {
  new_jobs_discovered: Briefcase,
  email_response_received: Mail,
  meeting_reminder: Calendar,
  follow_up_reminder: User,
  company_enriched: Briefcase,
};

export const NotificationCenter: React.FC = () => {
  const { openPanel, setOpenPanel, closePanel } = useSlidePanel();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const router = useRouter();
  const queryClient = useQueryClient();
  const open = openPanel === 'notifications';

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications({ limit: 30 }),
    enabled: open, // Only fetch when popover is open
    staleTime: 15000, // Consider data fresh for 15 seconds
    refetchInterval: open ? 30000 : false, // Poll every 30s when open
  });

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notification-unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Poll every minute for badge
  });

  // Refresh queries when popover opens (only if data is stale)
  useEffect(() => {
    if (open) {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
      queryClient.invalidateQueries({
        queryKey: ['notification-unread-count'],
      });
    }
  }, [open, queryClient]);

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      try {
        // Mark as read
        if (!notification.is_read) {
          await notificationService.markAsRead(notification.id);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({
            queryKey: ['notification-unread-count'],
          });
        }

        // Navigate if action exists
        if (
          notification.action_type === 'navigate' &&
          notification.action_url
        ) {
          setOpen(false);
          router.push(notification.action_url);
        }
      } catch (error) {
        console.error('Failed to handle notification click:', error);
      }
    },
    [router, queryClient]
  );

  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notification-unread-count'],
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [queryClient]);

  const handleDeleteNotification = useCallback(
    async (e: React.MouseEvent, notificationId: string) => {
      e.stopPropagation();
      try {
        await notificationService.deleteNotification(notificationId);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({
          queryKey: ['notification-unread-count'],
        });
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },
    [queryClient]
  );

  const unreadNotifications = useMemo(
    () => notifications.filter(n => !n.is_read),
    [notifications]
  );

  const filteredNotifications = useMemo(
    () => (tab === 'unread' ? unreadNotifications : notifications),
    [tab, unreadNotifications, notifications]
  );

  return (
    <>
      <Button
        variant='ghost'
        size='icon'
        className='h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-gray-200 rounded-md relative'
        aria-label='Notifications'
        onClick={() => setOpenPanel(open ? null : 'notifications')}
      >
        <Bell className='h-4 w-4' />
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1'>
            <Badge className='h-4 min-w-[1rem] text-xs px-1 bg-gradient-to-br from-red-500 to-red-600 text-white border-none'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          </span>
        )}
      </Button>

      <SmallSlidePanel
        isOpen={open}
        onClose={closePanel}
        title='Notifications'
        footer={
          <Button variant='ghost' size='sm' className='w-full'>
            View all notifications
          </Button>
        }
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'all' | 'unread')} className='flex flex-col h-full'>
          <div className='flex items-center justify-between border-b px-3 py-2 -mx-6'>
            <TabsList className='bg-transparent'>
              <TabsTrigger value='all' className='text-sm'>All</TabsTrigger>
              <TabsTrigger value='unread' className='text-sm'>
                Unread {unreadCount > 0 && <Badge className='ml-1'>{unreadCount}</Badge>}
              </TabsTrigger>
            </TabsList>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className='text-xs font-medium text-muted-foreground hover:underline'
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className='flex-1 overflow-hidden -mx-6'>
            <ScrollArea className='h-full max-h-[calc(100vh-200px)]'>
              {isLoading ? (
                <div className='flex items-center justify-center py-16'>
                  <div className='flex flex-col items-center gap-3'>
                    <Loader2 className='h-6 w-6 animate-spin text-blue-500' />
                    <p className='text-sm text-gray-500'>Loading notifications...</p>
                  </div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className='px-3 py-6 text-center text-sm text-muted-foreground'>
                  {tab === 'unread' ? 'No unread notifications' : 'No notifications'}
                </div>
              ) : (
                <div>
                  {filteredNotifications.map(notification => {
                    const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                    return (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        Icon={Icon}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </Tabs>
      </SmallSlidePanel>
    </>
  );
};

interface NotificationItemProps {
  notification: Notification;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  Icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className='flex w-full items-start gap-3 border-b px-3 py-3 text-left hover:bg-accent transition-colors'
    >
      <div className='mt-1 text-muted-foreground flex-shrink-0'>
        <Icon size={18} />
      </div>
      <div className='flex-1 space-y-1 min-w-0'>
        <p
          className={cn(
            'text-sm',
            !notification.is_read
              ? 'font-semibold text-foreground'
              : 'text-foreground/80'
          )}
        >
          {notification.title}
        </p>
        <p className='text-xs text-muted-foreground'>
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
          })}
        </p>
      </div>
      {!notification.is_read && (
        <span className='mt-1 inline-block size-2 rounded-full bg-primary flex-shrink-0' />
      )}
    </button>
  );
};
