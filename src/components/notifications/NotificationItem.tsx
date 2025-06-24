
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, Users, Bell } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: string;
}

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'case_update':
        return <FileText className="h-4 w-4" />;
      case 'fraud_warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'community_alert':
        return <Users className="h-4 w-4" />;
      case 'system_announcement':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white';
    }
  };

  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        !notification.read ? 'bg-blue-50 dark:bg-blue-950 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {notification.title}
            </h4>
            <Badge 
              variant="outline" 
              className={`text-xs ${getPriorityColor(notification.priority)}`}
            >
              {notification.priority}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-white line-clamp-2">
            {notification.message}
          </p>
          
          <span className="text-xs text-gray-500 mt-1">
            {notification.time}
          </span>
        </div>
        
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
