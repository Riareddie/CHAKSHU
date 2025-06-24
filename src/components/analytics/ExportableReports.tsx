
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Download, FileText, Mail, Calendar as CalendarIcon, Clock } from "lucide-react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  format: string;
  size: string;
  lastGenerated?: Date;
}

const ExportableReports = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [exportFormat, setExportFormat] = useState('pdf');
  const [scheduledReports, setScheduledReports] = useState([
    {
      id: '1',
      name: 'Monthly Fraud Summary',
      frequency: 'Monthly',
      nextDelivery: new Date('2024-07-01'),
      format: 'PDF',
      email: 'user@example.com'
    },
    {
      id: '2',
      name: 'Weekly Activity Report',
      frequency: 'Weekly',
      nextDelivery: new Date('2024-06-15'),
      format: 'CSV',
      email: 'user@example.com'
    }
  ]);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'personal_activity',
      name: 'Personal Activity Report',
      description: 'Your submissions, resolutions, and impact metrics',
      format: 'PDF/CSV',
      size: '~2MB',
      lastGenerated: new Date('2024-06-08')
    },
    {
      id: 'fraud_analysis',
      name: 'Fraud Pattern Analysis',
      description: 'Types of fraud you\'ve encountered with trends',
      format: 'PDF/Excel',
      size: '~5MB'
    },
    {
      id: 'community_impact',
      name: 'Community Impact Summary',
      description: 'How your reports have helped the community',
      format: 'PDF',
      size: '~3MB',
      lastGenerated: new Date('2024-06-05')
    },
    {
      id: 'comparative_stats',
      name: 'Comparative Statistics',
      description: 'Your performance vs regional and national averages',
      format: 'PDF/CSV',
      size: '~4MB'
    },
    {
      id: 'detailed_timeline',
      name: 'Detailed Timeline Report',
      description: 'Chronological view of all your fraud-related activities',
      format: 'PDF/Excel',
      size: '~8MB'
    }
  ];

  const handleGenerateReport = () => {
    console.log('Generating report:', {
      template: selectedTemplate,
      dateRange,
      format: exportFormat
    });
    
    // Simulate report generation
    alert(`Report generation started! You'll receive a download link via email once it's ready.`);
  };

  const handleScheduleReport = (reportId: string) => {
    console.log('Scheduling report:', reportId);
    alert('Report scheduling feature would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Report Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Custom Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Report Template</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <p className="text-xs text-gray-500 mt-1">
                    {reportTemplates.find(t => t.id === selectedTemplate)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Export Format</label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                    <SelectItem value="excel">Excel Workbook</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "MMM dd, y") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "MMM dd, y") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email (Optional)</label>
                <Input placeholder="your.email@example.com" type="email" />
                <p className="text-xs text-gray-500 mt-1">
                  Report will be sent to this email when ready
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateReport}
              disabled={!selectedTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline">
              Preview Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  <Badge variant="outline">{template.format}</Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Size: {template.size}</span>
                  {template.lastGenerated && (
                    <span>Last: {format(template.lastGenerated, "MMM dd, y")}</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    Select
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleScheduleReport(template.id)}
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduled Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-gray-600">
                      {report.frequency} • {report.format} • {report.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Next Delivery</p>
                    <p className="text-xs text-gray-500">
                      {format(report.nextDelivery, "MMM dd, y")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Pause
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {scheduledReports.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No scheduled reports found.</p>
                <Button variant="outline">
                  Schedule Your First Report
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportableReports;
