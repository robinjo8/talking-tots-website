import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface Notification {
  id: string;
  organization_id: string;
  recipient_id: string | null;
  type: 'new_test' | 'assigned' | 'reminder' | 'completed_report' | 'system';
  title: string;
  message: string;
  link: string | null;
  related_session_id: string | null;
  created_at: string;
  is_read?: boolean;
}

interface NotificationRow {
  id: string;
  organization_id: string;
  recipient_id: string | null;
  type: 'new_test' | 'assigned' | 'reminder' | 'completed_report' | 'system';
  title: string;
  message: string;
  link: string | null;
  related_session_id: string | null;
  created_at: string;
}

export function useNotifications() {
  const { profile, user } = useAdminAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!profile?.organization_id || !user?.id) return;

    try {
      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationsError) throw notificationsError;

      // Fetch read status
      const { data: readsData, error: readsError } = await supabase
        .from('notification_reads')
        .select('notification_id');

      if (readsError) throw readsError;

      const readIds = new Set(readsData?.map(r => r.notification_id) || []);

      // Combine data
      const combinedNotifications: Notification[] = (notificationsData || []).map((n: NotificationRow) => ({
        ...n,
        is_read: readIds.has(n.id),
      }));

      setNotifications(combinedNotifications);
      setUnreadCount(combinedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [profile?.organization_id, user?.id]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notification_reads')
        .insert({ notification_id: notificationId, user_id: user.id });

      if (error && error.code !== '23505') throw error; // Ignore duplicate key error

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user?.id]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    const unreadNotifications = notifications.filter(n => !n.is_read);
    if (unreadNotifications.length === 0) return;

    try {
      const inserts = unreadNotifications.map(n => ({
        notification_id: n.id,
        user_id: user.id,
      }));

      const { error } = await supabase
        .from('notification_reads')
        .upsert(inserts, { onConflict: 'notification_id,user_id' });

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications, user?.id]);

  // Initial fetch
  useEffect(() => {
    if (profile?.organization_id && user?.id) {
      fetchNotifications();
    }
  }, [profile?.organization_id, user?.id, fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    if (!profile?.organization_id || !user?.id) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `organization_id=eq.${profile.organization_id}`,
        },
        (payload: RealtimePostgresChangesPayload<NotificationRow>) => {
          const newNotification = payload.new as NotificationRow;
          
          // Check if this notification is for this user (null recipient = for all, or specific recipient)
          if (newNotification.recipient_id === null || newNotification.recipient_id === user.id) {
            setNotifications(prev => [{
              ...newNotification,
              is_read: false,
            }, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.organization_id, user?.id]);

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
