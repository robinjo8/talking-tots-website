import React, { useState } from 'react';
import { Bell, CheckCheck, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUserNotifications, UserNotification } from '@/hooks/useUserNotifications';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'pravkar';
  if (diffMins < 60) return `pred ${diffMins} min`;
  if (diffHours < 24) return `pred ${diffHours} h`;
  if (diffDays < 7) return `pred ${diffDays} dni`;
  
  return date.toLocaleDateString('sl-SI');
}

interface NotificationItemProps {
  notification: UserNotification;
  onMarkAsRead: (id: string) => void;
  onClose?: () => void;
}

function NotificationItem({ notification, onMarkAsRead, onClose }: NotificationItemProps) {
  const handleDownload = async () => {
    const { data } = await supabase.storage
      .from('uporabniski-profili')
      .createSignedUrl(notification.path, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    }
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    onClose?.();
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
        notification.is_read 
          ? 'bg-transparent hover:bg-muted/50' 
          : 'bg-primary/5 hover:bg-primary/10'
      )}
      onClick={handleDownload}
    >
      {/* Unread indicator */}
      <div className="flex-shrink-0 mt-1">
        {!notification.is_read && (
          <div className="w-2 h-2 rounded-full bg-app-orange" />
        )}
        {notification.is_read && <div className="w-2 h-2" />}
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5 text-destructive">
        <FileText className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm',
          notification.is_read ? 'font-normal text-muted-foreground' : 'font-medium text-foreground'
        )}>
          Novo poročilo za {notification.child_name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {notification.report_name}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>

      {/* Download button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function UserNotificationBell() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useUserNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-app-orange text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end" 
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Obvestila</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Označi vse
            </Button>
          )}
        </div>

        {/* Notifications list */}
        <ScrollArea className="h-[320px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">Ni novih obvestil</p>
              <p className="text-xs mt-1 text-center px-4">
                Tukaj bodo prikazana poročila logopedov
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
