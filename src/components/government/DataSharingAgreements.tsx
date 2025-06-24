
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";

const DataSharingAgreements = () => {
  const agreements = [
    {
      id: 1,
      name: "CERT-In Data Sharing MOU",
      status: "Active",
      signedDate: "2024-01-15",
      expiryDate: "2025-01-15",
      description: "Memorandum of Understanding for sharing cybercrime data with CERT-In"
    },
    {
      id: 2,
      name: "Reserve Bank of India Agreement",
      status: "Pending Renewal",
      signedDate: "2023-06-01",
      expiryDate: "2024-06-01",
      description: "Data sharing agreement for financial fraud cases"
    },
    {
      id: 3,
      name: "State Police Integration",
      status: "Draft",
      signedDate: null,
      expiryDate: null,
      description: "Agreement for sharing fraud reports with state police departments"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Data Sharing Agreements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agreements.map((agreement) => (
            <div key={agreement.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{agreement.name}</h3>
                  <p className="text-sm text-gray-600">{agreement.description}</p>
                </div>
                <Badge variant={
                  agreement.status === 'Active' ? 'default' :
                  agreement.status === 'Pending Renewal' ? 'secondary' : 'outline'
                }>
                  {agreement.status}
                </Badge>
              </div>
              
              {agreement.signedDate && (
                <div className="text-sm text-gray-600 mb-3">
                  <p>Signed: {agreement.signedDate}</p>
                  {agreement.expiryDate && (
                    <p>Expires: {agreement.expiryDate}</p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSharingAgreements;
