
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, X, Archive, Send, Users, AlertTriangle } from 'lucide-react';

const BulkActionTools = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  const reports = [
    { id: "RPT-001", type: "Phone Scam", priority: "High", status: "Pending" },
    { id: "RPT-002", type: "SMS Fraud", priority: "Medium", status: "Under Review" },
    { id: "RPT-003", type: "UPI Scam", priority: "Critical", status: "Pending" },
    { id: "RPT-004", type: "Email Phishing", priority: "Low", status: "Pending" },
    { id: "RPT-005", type: "Investment Fraud", priority: "High", status: "Escalated" }
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(reports.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId]);
    } else {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    }
  };

  const executeBulkAction = () => {
    console.log(`Executing ${bulkAction} on reports:`, selectedReports);
    // Implementation would go here
  };

  const bulkActions = [
    { value: 'approve', label: 'Approve Reports', icon: CheckCircle, color: 'text-green-600' },
    { value: 'reject', label: 'Reject Reports', icon: X, color: 'text-red-600' },
    { value: 'archive', label: 'Archive Reports', icon: Archive, color: 'text-gray-600' },
    { value: 'escalate', label: 'Escalate to Authorities', icon: AlertTriangle, color: 'text-orange-600' },
    { value: 'notify', label: 'Send Notifications', icon: Send, color: 'text-blue-600' },
    { value: 'assign', label: 'Assign to Team', icon: Users, color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Action Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            {bulkActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.value}
                  variant="outline"
                  onClick={() => setBulkAction(action.value)}
                  className={`${action.color} ${bulkAction === action.value ? 'bg-gray-100' : ''}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>

          {selectedReports.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedReports.length} report(s) selected
                </span>
                <div className="flex gap-2">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {bulkActions.map((action) => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={executeBulkAction}
                    disabled={!bulkAction}
                    className="bg-india-saffron hover:bg-saffron-600"
                  >
                    Execute Action
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedReports.length === reports.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Report ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>
                    <Badge variant={report.priority === 'Critical' ? 'destructive' : 'secondary'}>
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkActionTools;
