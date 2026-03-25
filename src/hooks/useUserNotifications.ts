import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserNotification {
  id: string;
  child_id: string;
  child_name: string;
  report_name: string;
  created_at: string;
  is_read: boolean;
  path: string;
  source: 'storage' | 'database';
  type?: string;
  title?: string;
  message?: string;
  link?: string;
}

/**
 * Hook for fetching user notifications about new logopedist reports
 * and test reminders from the database
 */
export function useUserNotifications() {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get read notification IDs from localStorage (for storage-based notifications)
  const getReadNotifications = useCallback((): Set<string> => {
    try {
      const stored = localStorage.getItem('user_read_notifications');
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  }, []);

  // Save read notification IDs to localStorage
  const saveReadNotifications = useCallback((readIds: Set<string>) => {
    localStorage.setItem('user_read_notifications', JSON.stringify([...readIds]));
  }, []);

  // Fetch notifications from both sources
  const fetchNotifications = useCallback(async () => {
    if (!user?.id || !profile?.children) {
      setIsLoading(false);
      return;
    }

    try {
      const readIds = getReadNotifications();
      const allNotifications: UserNotification[] = [];

      // 1. Fetch storage-based notifications (PDF reports)
      for (const child of profile.children) {
        if (!child.id) continue;

        const { data: reportFiles } = await supabase.storage
          .from('uporabniski-profili')
          .list(`${user.id}/${child.id}/Generirana-porocila`);

        if (reportFiles) {
          const childReports = reportFiles
            .filter(f => f.name !== '.emptyFolderPlaceholder')
            .map(f => {
              const notificationId = `${child.id}-${f.name}`;
              return {
                id: notificationId,
                child_id: child.id!,
                child_name: child.name,
                report_name: f.name,
                created_at: f.created_at || new Date().toISOString(),
                is_read: readIds.has(notificationId),
                path: `${user.id}/${child.id}/Generirana-porocila/${f.name}`,
                source: 'storage' as const,
              };
            });
          allNotifications.push(...childReports);
        }
      }

      // 2. Fetch database notifications (test reminders)
      const { data: dbNotifications, error: dbError } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!dbError && dbNotifications) {
        for (const dbNotif of dbNotifications) {
          const childName = profile.children.find(c => c.id === dbNotif.child_id)?.name || '';
          allNotifications.push({
            id: dbNotif.id,
            child_id: dbNotif.child_id || '',
            child_name: childName,
            report_name: '',
            created_at: dbNotif.created_at,
            is_read: dbNotif.is_read || false,
            path: '',
            source: 'database',
            type: dbNotif.type,
            title: dbNotif.title,
            message: dbNotif.message,
            link: dbNotif.link || undefined,
          });
        }
      }

      // Sort by created_at descending
      allNotifications.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching user notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profile?.children, getReadNotifications]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification?.source === 'database') {
      // Update in database
      await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
    } else {
      // Update in localStorage
      const readIds = getReadNotifications();
      readIds.add(notificationId);
      saveReadNotifications(readIds);
    }

    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [notifications, getReadNotifications, saveReadNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const readIds = getReadNotifications();
    const dbIds: string[] = [];
    
    notifications.forEach(n => {
      if (n.source === 'database' && !n.is_read) {
        dbIds.push(n.id);
      } else {
        readIds.add(n.id);
      }
    });
    
    saveReadNotifications(readIds);

    // Batch update database notifications
    if (dbIds.length > 0) {
      await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .in('id', dbIds);
    }

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [notifications, getReadNotifications, saveReadNotifications]);

  // Initial fetch
  useEffect(() => {
    if (user?.id && profile?.children) {
      fetchNotifications();
    }
  }, [user?.id, profile?.children, fetchNotifications]);

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
