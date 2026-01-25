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
}

/**
 * Hook for fetching user notifications about new logopedist reports
 * Checks the 'Generirana-porocila' folder in storage for new PDFs
 */
export function useUserNotifications() {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get read notification IDs from localStorage
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

  // Fetch notifications (reports from storage)
  const fetchNotifications = useCallback(async () => {
    if (!user?.id || !profile?.children) {
      setIsLoading(false);
      return;
    }

    try {
      const readIds = getReadNotifications();
      const allNotifications: UserNotification[] = [];

      for (const child of profile.children) {
        if (!child.id) continue;

        // Fetch generated PDF reports from storage
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
              };
            });
          allNotifications.push(...childReports);
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
  const markAsRead = useCallback((notificationId: string) => {
    const readIds = getReadNotifications();
    readIds.add(notificationId);
    saveReadNotifications(readIds);

    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [getReadNotifications, saveReadNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const readIds = getReadNotifications();
    notifications.forEach(n => readIds.add(n.id));
    saveReadNotifications(readIds);

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
