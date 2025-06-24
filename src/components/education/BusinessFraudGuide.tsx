
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BusinessFraudGuide = () => {
  const businessThreats = [
    {
      type: "Email Compromise",
      description: "CEO fraud and vendor payment redirections",
      impact: "High",
      prevention: ["Verify payment changes via phone", "Implement dual authorization", "Train employees on social engineering"]
    },
    {
      type: "Invoice Fraud",
      description: "Fake invoices from legitimate-looking vendors",
      impact: "Medium",
      prevention: ["Maintain vendor databases", "Verify new vendors", "Match invoices to purchase orders"]
    },
    {
      type: "Cyber Attacks",
      description: "Ransomware, data breaches, and system compromises",
      impact: "Critical",
      prevention: ["Regular backups", "Employee training", "Security software", "Incident response plan"]
    },
    {
      type: "Financial Fraud",
      description: "Check fraud, credit card scams, loan fraud",
      impact: "High",
      prevention: ["Regular account monitoring", "Segregation of duties", "Financial controls"]
    }
  ];

  const securityChecklist = [
    "Employee background verification",
    "Regular security awareness training",
    "Multi-factor authentication",
    "Regular software updates",
    "Data backup and recovery plan",
    "Vendor verification processes",
    "Financial transaction controls",
    "Incident response procedures"
  ];

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Business Fraud Prevention Guide
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Protect your business from fraud with comprehensive security measures and employee training programs.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Common Business Fraud Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {businessThreats.map((threat, index) => (
                <div key={index} className="border-l-4 border-india-saffron pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{threat.type}</h3>
                    <Badge variant={threat.impact === 'Critical' ? 'destructive' : threat.impact === 'High' ? 'default' : 'secondary'}>
                      {threat.impact} Risk
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{threat.description}</p>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Prevention:</h4>
                    <ul className="text-sm space-y-1">
                      {threat.prevention.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Implementation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityChecklist.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <Button className="w-full">Download Complete Checklist</Button>
              <Button variant="outline" className="w-full">Security Assessment Tool</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-india-saffron mb-2">24/7</div>
            <div className="font-semibold mb-2">Business Support</div>
            <p className="text-sm text-gray-600 mb-4">Round-the-clock assistance for fraud incidents</p>
            <Button variant="outline" size="sm">Contact Support</Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-india-saffron mb-2">₹50L+</div>
            <div className="font-semibold mb-2">Fraud Prevented</div>
            <p className="text-sm text-gray-600 mb-4">Amount saved by businesses using our guidelines</p>
            <Button variant="outline" size="sm">Success Stories</Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-india-saffron mb-2">1000+</div>
            <div className="font-semibold mb-2">Trained Organizations</div>
            <p className="text-sm text-gray-600 mb-4">Companies trained in fraud prevention</p>
            <Button variant="outline" size="sm">Training Programs</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BusinessFraudGuide;
