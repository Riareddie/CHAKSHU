
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, 
  Clock, 
  Send, 
  CheckCircle, 
  ArrowUp, 
  FileText, 
  User,
  Calendar,
  Target
} from "lucide-react";

interface EscalationCase {
  id: string;
  reportId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'escalated' | 'in_review' | 'resolved';
  type: string;
  amount: number;
  createdAt: string;
  escalatedTo: string;
  expectedResolution: string;
  progress: number;
  timeline: {
    stage: string;
    date: string;
    status: 'completed' | 'current' | 'pending';
    details: string;
  }[];
}

const EscalationWorkflow = () => {
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualEscalation, setManualEscalation] = useState({
    reportId: '',
    reason: '',
    urgency: 'medium',
    details: ''
  });

  const escalationCases: EscalationCase[] = [
    {
      id: 'ESC-2024-001',
      reportId: 'RPT-2024-1234',
      severity: 'critical',
      status: 'in_review',
      type: 'Investment Scam',
      amount: 500000,
      createdAt: '2024-01-15',
      escalatedTo: 'Economic Offences Wing',
      expectedResolution: '2024-01-22',
      progress: 65,
      timeline: [
        { stage: 'Report Filed', date: '2024-01-15', status: 'completed', details: 'Initial fraud report submitted' },
        { stage: 'Auto-Escalated', date: '2024-01-15', status: 'completed', details: 'Amount exceeds ₹1,00,000 threshold' },
        { stage: 'Police Investigation', date: '2024-01-16', status: 'current', details: 'Under investigation by cyber crime unit' },
        { stage: 'Legal Proceedings', date: '2024-01-20', status: 'pending', details: 'Case filing pending' },
        { stage: 'Resolution', date: '2024-01-22', status: 'pending', details: 'Expected resolution date' }
      ]
    },
    {
      id: 'ESC-2024-002',
      reportId: 'RPT-2024-1156',
      severity: 'high',
      status: 'escalated',
      type: 'UPI Fraud',
      amount: 75000,
      createdAt: '2024-01-14',
      escalatedTo: 'Banking Fraud Division',
      expectedResolution: '2024-01-21',
      progress: 35,
      timeline: [
        { stage: 'Report Filed', date: '2024-01-14', status: 'completed', details: 'UPI fraud reported' },
        { stage: 'Bank Notified', date: '2024-01-14', status: 'completed', details: 'Bank fraud department alerted' },
        { stage: 'Investigation Started', date: '2024-01-15', status: 'current', details: 'Transaction tracking in progress' },
        { stage: 'Recovery Process', date: '2024-01-18', status: 'pending', details: 'Fund recovery initiation' },
        { stage: 'Case Closure', date: '2024-01-21', status: 'pending', details: 'Expected case closure' }
      ]
    }
  ];

  const autoEscalationRules = [
    {
      condition: 'Amount > ₹1,00,000',
      action: 'Immediate escalation to Economic Offences Wing',
      status: 'active',
      cases: 23
    },
    {
      condition: 'Multiple victims (>5)',
      action: 'Escalate to Cyber Crime Investigation Cell',
      status: 'active',
      cases: 8
    },
    {
      condition: 'Time elapsed > 72 hours',
      action: 'Supervisor review and manual escalation',
      status: 'active',
      cases: 12
    },
    {
      condition: 'Cross-border transactions',
      action: 'International cooperation desk notification',
      status: 'active',
      cases: 4
    }
  ];

  const handleManualEscalation = () => {
    console.log('Manual escalation submitted:', manualEscalation);
    setShowManualForm(false);
    setManualEscalation({ reportId: '', reason: '', urgency: 'medium', details: '' });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      case 'escalated': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'current': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending': return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
      default: return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Case Escalation Workflow</h2>
        <p className="text-gray-600">
          Automated and manual escalation processes for high-priority fraud cases
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">5</div>
              <p className="text-sm text-gray-600">Critical Cases</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-sm text-gray-600">In Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Escalation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="w-5 h-5" />
              Manual Escalation Request
            </CardTitle>
            <Button 
              onClick={() => setShowManualForm(!showManualForm)}
              className="bg-india-saffron hover:bg-saffron-600"
            >
              <Send className="w-4 h-4 mr-2" />
              New Escalation
            </Button>
          </div>
        </CardHeader>
        {showManualForm && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportId">Report ID</Label>
                <Input
                  id="reportId"
                  placeholder="RPT-2024-XXXX"
                  value={manualEscalation.reportId}
                  onChange={(e) => setManualEscalation({...manualEscalation, reportId: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <select
                  id="urgency"
                  className="w-full p-2 border rounded-md"
                  value={manualEscalation.urgency}
                  onChange={(e) => setManualEscalation({...manualEscalation, urgency: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="reason">Escalation Reason</Label>
                <Input
                  id="reason"
                  placeholder="Brief reason for escalation"
                  value={manualEscalation.reason}
                  onChange={(e) => setManualEscalation({...manualEscalation, reason: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="details">Additional Details</Label>
                <Textarea
                  id="details"
                  placeholder="Provide detailed information supporting the escalation request"
                  value={manualEscalation.details}
                  onChange={(e) => setManualEscalation({...manualEscalation, details: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button onClick={handleManualEscalation} className="bg-india-saffron hover:bg-saffron-600">
                  Submit Escalation
                </Button>
                <Button variant="outline" onClick={() => setShowManualForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Escalations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Escalations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {escalationCases.map((escalation) => (
              <div key={escalation.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{escalation.id}</h3>
                    <p className="text-sm text-gray-600">Report: {escalation.reportId}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getSeverityColor(escalation.severity)}>
                        {escalation.severity}
                      </Badge>
                      <Badge className={getStatusColor(escalation.status)}>
                        {escalation.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{escalation.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{escalation.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Escalated to: {escalation.escalatedTo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Expected: {escalation.expectedResolution}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Progress: {escalation.progress}%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Case Progress</span>
                    <span>{escalation.progress}%</span>
                  </div>
                  <Progress value={escalation.progress} className="h-2" />
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-semibold mb-3">Case Timeline</h4>
                  <div className="space-y-3">
                    {escalation.timeline.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {getTimelineIcon(item.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{item.stage}</span>
                            <span className="text-xs text-gray-500">{item.date}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{item.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Escalation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Automatic Escalation Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {autoEscalationRules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{rule.condition}</h4>
                  <p className="text-sm text-gray-600">{rule.action}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-800 mb-1">
                    {rule.status}
                  </Badge>
                  <p className="text-xs text-gray-500">{rule.cases} cases this month</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expected Resolution Times */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Resolution Timelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { severity: 'Critical', time: '24-48 hours', description: 'High-value fraud, organized crime' },
              { severity: 'High', time: '3-7 days', description: 'Significant financial loss, identity theft' },
              { severity: 'Medium', time: '1-2 weeks', description: 'Standard fraud cases, moderate impact' },
              { severity: 'Low', time: '2-4 weeks', description: 'Minor fraud, educational follow-up' }
            ].map((item, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold text-lg">{item.severity}</h3>
                <p className="text-2xl font-bold text-india-saffron">{item.time}</p>
                <p className="text-xs text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscalationWorkflow;
