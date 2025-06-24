
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, Calendar, MapPin } from "lucide-react";

const LegalActionTracker = () => {
  const legalActions = [
    {
      id: 1,
      caseNumber: "FIR-2024-001234",
      type: "Cybercrime",
      status: "Under Investigation",
      location: "Mumbai, Maharashtra",
      date: "2024-06-05"
    },
    {
      id: 2,
      caseNumber: "FIR-2024-001235",
      type: "Financial Fraud",
      status: "Arrest Made",
      location: "Delhi",
      date: "2024-06-03"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-blue-600" />
          Legal Action Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {legalActions.map((action) => (
            <div key={action.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{action.caseNumber}</h3>
                  <p className="text-sm text-gray-600">{action.type}</p>
                </div>
                <Badge variant={action.status === 'Arrest Made' ? 'default' : 'secondary'}>
                  {action.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {action.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {action.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalActionTracker;
