
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

const ComplianceDashboard = () => {
  const complianceItems = [
    {
      id: 1,
      requirement: "Monthly Report Submission",
      status: "Compliant",
      dueDate: "2024-07-01",
      description: "Monthly fraud statistics report to CERT-In"
    },
    {
      id: 2,
      requirement: "Data Protection Audit",
      status: "Pending",
      dueDate: "2024-06-15",
      description: "Annual data protection compliance audit"
    },
    {
      id: 3,
      requirement: "Security Framework Update",
      status: "Overdue",
      dueDate: "2024-06-01",
      description: "Update to latest cybersecurity framework"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Overdue': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complianceItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{item.requirement}</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <Badge variant={
                    item.status === 'Compliant' ? 'default' :
                    item.status === 'Pending' ? 'secondary' : 'destructive'
                  }>
                    {item.status}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-xs text-gray-500">Due: {item.dueDate}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceDashboard;
