
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  Users, 
  FileText, 
  Send,
  CheckCircle
} from 'lucide-react';

const CaseEscalationSystem = () => {
  const escalationQueue = [
    {
      id: 'ESC-2024-001',
      type: 'High-Value Fraud',
      priority: 'critical',
      amount: '₹5,00,000',
      timeElapsed: '2 hours',
      status: 'pending_law_enforcement',
      description: 'Investment scam targeting senior citizens'
    },
    {
      id: 'ESC-2024-002',
      type: 'Identity Theft',
      priority: 'high',
      amount: '₹75,000',
      timeElapsed: '4 hours',
      status: 'under_investigation',
      description: 'SIM swap fraud with banking access'
    },
    {
      id: 'ESC-2024-003',
      type: 'Cyber Extortion',
      priority: 'critical',
      amount: '₹2,00,000',
      timeElapsed: '30 minutes',
      status: 'auto_escalated',
      description: 'Ransomware attack on business systems'
    }
  ];

  const escalationRules = [
    {
      trigger: 'Amount > ₹1,00,000',
      action: 'Auto-escalate to Law Enforcement',
      status: 'active'
    },
    {
      trigger: 'Multiple victims (>5)',
      action: 'Create case cluster',
      status: 'active'
    },
    {
      trigger: 'Time elapsed > 6 hours',
      action: 'Supervisor notification',
      status: 'active'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'auto_escalated': return 'bg-red-100 text-red-800';
      case 'pending_law_enforcement': return 'bg-orange-100 text-orange-800';
      case 'under_investigation': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Escalations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Automated Case Escalation Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escalationQueue.map((item, index) => (
              <Alert key={index} className="p-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.id}</h3>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{item.type} - {item.amount}</p>
                        <p className="text-gray-600">{item.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.timeElapsed} elapsed
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" className="bg-india-saffron hover:bg-saffron-600">
                        <Send className="h-3 w-3 mr-1" />
                        Escalate Now
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Escalation Rules & Automation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {escalationRules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{rule.trigger}</p>
                  <p className="text-sm text-gray-600">{rule.action}</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge className="bg-green-100 text-green-800">
                    {rule.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseEscalationSystem;
