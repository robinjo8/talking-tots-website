import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, UserCheck, Clock, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClose?: () => void;
}

const typeIcons = {
  new_test: FileText,
  assigned: UserCheck,
  reminder: Clock,
  completed_report: CheckCircle,
  system: Info,
};

const typeColors = {
  new_test: 'text-app-orange',
  assigned: 'text-app-blue',
  reminder: 'text-amber-500',
  completed_report: 'text-dragon-green',
  system: 'text-muted-foreground',
};

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

export function NotificationItem({ notification, onMarkAsRead, onClose }: NotificationItemProps) {
  const Icon = typeIcons[notification.type] || Info;
  const iconColor = typeColors[notification.type] || 'text-muted-foreground';

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    onClose?.();
  };

  const content = (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
        notification.is_read 
          ? 'bg-transparent hover:bg-muted/50' 
          : 'bg-primary/5 hover:bg-primary/10'
      )}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      <div className="flex-shrink-0 mt-1">
        {!notification.is_read && (
          <div className="w-2 h-2 rounded-full bg-app-blue" />
        )}
        {notification.is_read && <div className="w-2 h-2" />}
      </div>

      {/* Icon */}
      <div className={cn('flex-shrink-0 mt-0.5', iconColor)}>
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm',
          notification.is_read ? 'font-normal text-muted-foreground' : 'font-medium text-foreground'
        )}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link to={notification.link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
