
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Activity, User, Shield, AlertTriangle, Eye } from 'lucide-react';

const UserActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const activityLogs = [
    {
      id: 'LOG001',
      user: 'Rajesh Kumar',
      action: 'Report Submitted',
      details: 'Submitted fraud report RPT-2024-001',
      ipAddress: '192.168.1.10',
      userAgent: 'Chrome 119.0.0.0',
      timestamp: '2024-01-15 14:30:25',
      status: 'Success',
      severity: 'info'
    },
    {
      id: 'LOG002',
      user: 'Admin User',
      action: 'User Banned',
      details: 'Banned user amit.singh@email.com for policy violation',
      ipAddress: '10.0.0.5',
      userAgent: 'Firefox 120.0.1',
      timestamp: '2024-01-15 13:45:12',
      status: 'Success',
      severity: 'warning'
    },
    {
      id: 'LOG003',
      user: 'Priya Sharma',
      action: 'Login Failed',
      details: 'Failed login attempt - incorrect password',
      ipAddress: '203.0.113.45',
      userAgent: 'Safari 17.1',
      timestamp: '2024-01-15 12:20:08',
      status: 'Failed',
      severity: 'error'
    },
    {
      id: 'LOG004',
      user: 'System',
      action: 'Auto Moderation',
      details: 'Automatically flagged comment for inappropriate content',
      ipAddress: 'system',
      userAgent: 'System Process',
      timestamp: '2024-01-15 11:15:33',
      status: 'Success',
      severity: 'info'
    },
    {
      id: 'LOG005',
      user: 'Moderator',
      action: 'Report Approved',
      details: 'Approved fraud report RPT-2024-002 after review',
      ipAddress: '192.168.1.25',
      userAgent: 'Chrome 119.0.0.0',
      timestamp: '2024-01-15 10:30:17',
      status: 'Success',
      severity: 'info'
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'report submitted': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'user banned': return <Shield className="h-4 w-4 text-red-600" />;
      case 'login failed': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'auto moderation': return <Eye className="h-4 w-4 text-purple-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Activity Logs
            </CardTitle>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login Events</SelectItem>
                  <SelectItem value="report">Report Actions</SelectItem>
                  <SelectItem value="admin">Admin Actions</SelectItem>
                  <SelectItem value="system">System Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span className="font-medium">{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {log.ipAddress}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityLogs;
