
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NotificationItem from '@/components/notifications/NotificationItem';

const NotificationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

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
    },
    {
      id: 5,
      type: 'case_update',
      title: 'Report Submitted',
      message: 'Your fraud report has been successfully submitted',
      time: '1 day ago',
      read: true,
      priority: 'low'
    },
    {
      id: 6,
      type: 'fraud_warning',
      title: 'High Risk Area Alert',
      message: 'Increased fraud activity detected in your vicinity',
      time: '2 days ago',
      read: true,
      priority: 'high'
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'read' && notification.read) ||
                         (filterStatus === 'unread' && !notification.read);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const clearAllNotifications = () => {
    if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      // In a real app, this would delete from backend
      console.log('Clearing all notifications');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notification History</h1>
              <p className="text-gray-600">View and manage all your notifications</p>
            </div>
            <Button 
              variant="outline" 
              onClick={clearAllNotifications}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Search and filter your notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="case_update">Case Updates</SelectItem>
                  <SelectItem value="fraud_warning">Fraud Warnings</SelectItem>
                  <SelectItem value="community_alert">Community Alerts</SelectItem>
                  <SelectItem value="system_announcement">System Announcements</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {filteredNotifications.length} results
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              {filteredNotifications.length === 0 
                ? 'No notifications match your search criteria'
                : `Showing ${filteredNotifications.length} notification${filteredNotifications.length !== 1 ? 's' : ''}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <NotificationItem notification={notification} />
                    {index < filteredNotifications.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationHistory;
