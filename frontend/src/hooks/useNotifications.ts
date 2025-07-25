import { useEffect, useState, useCallback } from 'react';
import { env } from '@/config/env.config';
import { Notification } from '@/types/notification.type';
import { toast } from 'sonner';
import { useSocket } from '@/components/hooks/useSocket';

export const useNotifications = (userId?: string) => {
  const { emit, on, off, connected } = useSocket(env.API_URL, userId);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!connected || !userId) return;

    // Listen for new notifications
    on('newNotification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      toast.info(notification.title, {
        description: notification.message,
        duration: 5000,
      });
    });

    // Fetch existing notifications on connect
    emit('getNotifications', userId);
    on('notifications', (existingNotifications: Notification[]) => {
      setNotifications(existingNotifications);
      setUnreadCount(
        existingNotifications.filter(n => !n.isRead).length
      );
    });

    // Cleanup listeners
    return () => {
      off('newNotification');
      off('notifications');
    };
  }, [connected, userId, emit, on, off]);

  const handleMarkAllRead = useCallback(() => {
    if (!userId) return;
    
    emit('markAllNotificationsRead', userId);
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);
  }, [userId, emit]);

  const handleMarkAsRead = useCallback((notificationId: string) => {
    if (!userId) return;

    emit('markNotificationRead', { userId, notificationId });
    setNotifications(prev =>
      prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [userId, emit]);

  return {
    notifications,
    unreadCount,
    connected,
    handleMarkAllRead,
    handleMarkAsRead
  };
};
