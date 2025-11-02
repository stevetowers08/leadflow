import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  CheckCheck,
  Loader2,
  Mail,
  User,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const NOTIFICATION_ICONS = {
  new_jobs_discovered: Briefcase,
  email_response_received: Mail,
  meeting_reminder: Calendar,
  follow_up_reminder: User,
  company_enriched: Briefcase,
};

const NOTIFICATION_COLORS = {
  new_jobs_discovered: 'bg-blue-100 text-blue-600',
  email_response_received: 'bg-green-100 text-green-600',
  meeting_reminder: 'bg-orange-100 text-orange-600',
  follow_up_reminder: 'bg-purple-100 text-purple-600',
  company_enriched: 'bg-emerald-100 text-emerald-700',
};

export const NotificationCenter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

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
      // Mark as read
      if (!notification.is_read) {
        await notificationService.markAsRead(notification.id);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({
          queryKey: ['notification-unread-count'],
        });
      }

      // Navigate if action exists
      if (notification.action_type === 'navigate' && notification.action_url) {
        setOpen(false);
        router.push(notification.action_url);
      }
    },
    [router, queryClient]
  );

  const handleMarkAllRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['notification-unread-count'] });
  }, [queryClient]);

  const handleDeleteNotification = useCallback(
    async (e: React.MouseEvent, notificationId: string) => {
      e.stopPropagation();
      await notificationService.deleteNotification(notificationId);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notification-unread-count'],
      });
    },
    [queryClient]
  );

  const unreadNotifications = useMemo(
    () => notifications.filter(n => !n.is_read),
    [notifications]
  );
  const readNotifications = useMemo(
    () => notifications.filter(n => n.is_read),
    [notifications]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md relative'
          aria-label='Notifications'
        >
          <Bell className='h-4 w-4' />
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center min-w-[1.25rem] px-1'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        sideOffset={8}
        className='w-[380px] p-0 sm:w-[420px]'
      >
        <div className='flex items-center justify-between px-4 py-3 border-b'>
          <div className='flex items-center gap-2'>
            <Bell className='h-4 w-4 text-gray-600' />
            <h3 className='font-semibold text-sm'>Notifications</h3>
            {unreadCount > 0 && (
              <span className='px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-medium'>
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadNotifications.length > 0 && (
            <Button
              variant='ghost'
              size='sm'
              className='h-7 text-xs'
              onClick={handleMarkAllRead}
            >
              <CheckCheck className='h-3.5 w-3.5 mr-1' />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className='max-h-[500px]'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-5 w-5 animate-spin text-gray-400' />
            </div>
          ) : notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 px-4'>
              <Bell className='h-10 w-10 text-gray-300 mb-3' />
              <p className='text-sm text-gray-500 text-center'>
                No notifications yet
              </p>
            </div>
          ) : (
            <div className='py-2'>
              {/* Unread notifications */}
              {unreadNotifications.length > 0 && (
                <>
                  {unreadNotifications.map(notification => {
                    const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                    const colorClass =
                      NOTIFICATION_COLORS[notification.type] ||
                      'bg-gray-100 text-gray-600';

                    return (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        Icon={Icon}
                        colorClass={colorClass}
                        onClick={() => handleNotificationClick(notification)}
                        onDelete={e =>
                          handleDeleteNotification(e, notification.id)
                        }
                      />
                    );
                  })}
                  {readNotifications.length > 0 && (
                    <Separator className='my-2' />
                  )}
                </>
              )}

              {/* Read notifications */}
              {readNotifications.map(notification => {
                const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                const colorClass =
                  NOTIFICATION_COLORS[notification.type] ||
                  'bg-gray-100 text-gray-600';

                return (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    Icon={Icon}
                    colorClass={colorClass}
                    isRead
                    onClick={() => handleNotificationClick(notification)}
                    onDelete={e => handleDeleteNotification(e, notification.id)}
                  />
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

interface NotificationItemProps {
  notification: Notification;
  Icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  isRead?: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  Icon,
  colorClass,
  isRead = false,
  onClick,
  onDelete,
}) => {
  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group relative',
        !isRead && 'bg-blue-50/50'
      )}
      onClick={onClick}
    >
      <div className={cn('p-2 rounded-lg flex-shrink-0', colorClass)}>
        <Icon className='h-4 w-4' />
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-start justify-between gap-2 mb-1'>
          <p
            className={cn(
              'text-sm font-medium line-clamp-1',
              !isRead && 'font-semibold'
            )}
          >
            {notification.title}
          </p>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0'
            onClick={onDelete}
          >
            <X className='h-3.5 w-3.5 text-gray-400' />
          </Button>
        </div>
        <p className='text-xs text-gray-600 line-clamp-2 mb-1'>
          {notification.message}
        </p>
        <span className='text-xs text-gray-400'>
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
          })}
        </span>
      </div>

      {!isRead && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full' />
      )}
    </div>
  );
};
