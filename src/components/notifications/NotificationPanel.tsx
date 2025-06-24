
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Settings, CheckCheck, History, Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';

interface NotificationPanelProps {
  onMarkAllRead: () => void;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onMarkAllRead, onClose }) => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'case_update',
      title: 'Case Status Update',
      message: 'Your report RPT-001 has been marked as resolved',
      time: '2 minutes ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 2,
      type: 'fraud_warning',
      title: 'Fraud Alert in Your Area',
      message: 'New phishing scam reported in Sector 5',
      time: '1 hour ago',
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'community_alert',
      title: 'Community Update',
      message: 'New discussion thread in fraud prevention forum',
      time: '3 hours ago',
      read: false,
      priority: 'low'
    },
    {
      id: 4,
      type: 'system_announcement',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight from 2-4 AM',
      time: '6 hours ago',
      read: true,
      priority: 'medium'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="flex items-center gap-2">
            <Link to="/notifications/settings" onClick={onClose}>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/notifications/history" onClick={onClose}>
              <Button variant="ghost" size="sm">
                <History className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {unreadCount} unread
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMarkAllRead}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-96">
        <div className="p-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationItem notification={notification} />
                {index < notifications.length - 1 && <Separator className="my-1" />}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t">
        <Link to="/notifications/history" onClick={onClose}>
          <Button variant="ghost" className="w-full text-sm">
            View All Notifications
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotificationPanel;
