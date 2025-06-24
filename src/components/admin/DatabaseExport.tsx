
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Database, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const DatabaseExport = () => {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const tables = [
    { id: 'reports', name: 'Fraud Reports', records: '12,847', size: '45.2 MB' },
    { id: 'users', name: 'Users', records: '45,623', size: '8.7 MB' },
    { id: 'comments', name: 'Comments', records: '3,456', size: '2.1 MB' },
    { id: 'attachments', name: 'Attachments', records: '8,234', size: '156.8 MB' },
    { id: 'logs', name: 'Activity Logs', records: '89,456', size: '23.4 MB' },
    { id: 'notifications', name: 'Notifications', records: '67,890', size: '5.3 MB' }
  ];

  const exportHistory = [
    {
      id: 'EXP001',
      type: 'Full Database',
      format: 'SQL',
      size: '234.5 MB',
      status: 'Completed',
      date: '2024-01-15 14:30',
      downloadUrl: '#'
    },
    {
      id: 'EXP002',
      type: 'Reports Only',
      format: 'CSV',
      size: '45.2 MB',
      status: 'Completed',
      date: '2024-01-14 09:15',
      downloadUrl: '#'
    },
    {
      id: 'EXP003',
      type: 'User Data',
      format: 'JSON',
      size: '8.7 MB',
      status: 'Failed',
      date: '2024-01-13 16:22',
      downloadUrl: null
    }
  ];

  const handleTableSelection = (tableId: string, checked: boolean) => {
    if (checked) {
      setSelectedTables([...selectedTables, tableId]);
    } else {
      setSelectedTables(selectedTables.filter(id => id !== tableId));
    }
  };

  const startExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Tables</h3>
              <div className="space-y-3">
                {tables.map((table) => (
                  <div key={table.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedTables.includes(table.id)}
                      onCheckedChange={(checked) => handleTableSelection(table.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{table.name}</div>
                      <div className="text-sm text-gray-500">
                        {table.records} records • {table.size}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Export Options</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Export Format</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sql">SQL Dump</SelectItem>
                      <SelectItem value="csv">CSV Files</SelectItem>
                      <SelectItem value="json">JSON Export</SelectItem>
                      <SelectItem value="xlsx">Excel Workbook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Export Progress</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={startExport}
                  disabled={selectedTables.length === 0 || !exportFormat || isExporting}
                  className="w-full bg-india-saffron hover:bg-saffron-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Start Export'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exportHistory.map((export_item) => (
              <div key={export_item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(export_item.status)}
                  <div>
                    <div className="font-medium">{export_item.type}</div>
                    <div className="text-sm text-gray-500">
                      {export_item.format} • {export_item.size} • {export_item.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    export_item.status === 'Completed' ? 'text-green-600' : 
                    export_item.status === 'Failed' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {export_item.status}
                  </span>
                  {export_item.downloadUrl && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseExport;
