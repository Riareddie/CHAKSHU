import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ExternalLink,
  FileText,
  Bell,
  Calendar,
  Building2,
} from "lucide-react";

const GovernmentAdvisories = () => {
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleReadAdvisory = (advisory: (typeof advisories)[0]) => {
    const advisoryUrls = {
      1: "https://rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1271",
      2: "https://www.meity.gov.in/content/advisories",
      3: "https://www.trai.gov.in/sites/default/files/PR_No.09of2024.pdf",
      4: "https://www.sebi.gov.in/legal/master-circulars/aug-2023/master-circular-on-investor-protection-and-education-fund_75621.html",
    };

    const url = advisoryUrls[advisory.id as keyof typeof advisoryUrls] || "#";

    toast({
      title: "Opening Advisory",
      description: `Reading full advisory: "${advisory.title}"`,
    });

    window.open(url, "_blank");
  };

  const handleVisitPortal = (initiative: (typeof initiatives)[0]) => {
    const portalUrls = {
      "Sanchar Saathi Portal": "https://sancharsaathi.gov.in",
      "Cyber Dost Initiative": "https://cyberdost.delhipolice.gov.in",
      "Digital India Safe": "https://digitalindia.gov.in/safe",
    };

    const url = portalUrls[initiative.name as keyof typeof portalUrls] || "#";

    toast({
      title: "Visiting Portal",
      description: `Opening ${initiative.name}`,
    });

    window.open(url, "_blank");
  };

  const handleSubscribeToAlerts = async () => {
    if (!subscriberEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscriberEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Successfully Subscribed!",
      description:
        "You'll receive important government security alerts and advisories.",
    });

    setSubscriberEmail("");
    setIsSubscribing(false);
  };

  const advisories = [
    {
      id: 1,
      title: "RBI Advisory on Digital Payment Safety",
      source: "Reserve Bank of India",
      date: "2024-01-20",
      type: "Financial",
      summary:
        "Guidelines for safe digital transactions and UPI usage. Important security measures to protect your financial information online.",
      link: "https://rbi.org.in/Scripts/PublicationReportDetails.aspx?UrlPage=&ID=1271",
    },
    {
      id: 2,
      title: "IT Ministry Warning on Fake Apps",
      source: "Ministry of Electronics & IT",
      date: "2024-01-18",
      type: "Technology",
      summary:
        "List of fraudulent mobile applications to avoid. Stay safe from malicious apps that steal personal data.",
      link: "https://www.meity.gov.in/content/advisories",
    },
    {
      id: 3,
      title: "TRAI Alert on SIM Swap Fraud",
      source: "Telecom Regulatory Authority",
      date: "2024-01-15",
      type: "Telecom",
      summary:
        "Measures to prevent unauthorized SIM card replacements. Protect yourself from telecom fraud.",
      link: "https://www.trai.gov.in/sites/default/files/PR_No.09of2024.pdf",
    },
    {
      id: 4,
      title: "SEBI Investor Protection Guidelines",
      source: "Securities Exchange Board",
      date: "2024-01-12",
      type: "Investment",
      summary:
        "Updated guidelines for protecting retail investors from fraudulent investment schemes.",
      link: "https://www.sebi.gov.in/legal/master-circulars/aug-2023/master-circular-on-investor-protection-and-education-fund_75621.html",
    },
  ];

  const initiatives = [
    {
      name: "Sanchar Saathi Portal",
      description: "Government portal to block lost/stolen mobile connections",
      authority: "Department of Telecom",
    },
    {
      name: "Cyber Dost Initiative",
      description: "Social media awareness campaign by Delhi Police",
      authority: "Delhi Police",
    },
    {
      name: "Digital India Safe",
      description: "National initiative for cybersecurity awareness",
      authority: "Ministry of Electronics & IT",
    },
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Government Advisory Notices
          </CardTitle>
          <p className="text-gray-600 text-center">
            Official advisories and warnings from government agencies
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {advisories.map((advisory) => (
              <div
                key={advisory.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {advisory.title}
                  </h3>
                  <Badge variant="outline" className="bg-white">
                    {advisory.type}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span className="font-medium">Source: </span>
                    <span className="ml-1">{advisory.source}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Date: </span>
                    <span className="ml-1">{advisory.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {advisory.summary}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => handleReadAdvisory(advisory)}
                      className="bg-india-saffron hover:bg-saffron-600"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Read Full Advisory
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.share?.({
                          title: advisory.title,
                          text: advisory.summary,
                          url: window.location.href,
                        }) ||
                          toast({
                            title: "Advisory Shared",
                            description: "Link copied to clipboard",
                          });
                      }}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h4 className="font-semibold text-lg mb-4">
              Government Initiatives
            </h4>
            <div className="space-y-3">
              {initiatives.map((initiative, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-blue-900">
                        {initiative.name}
                      </h5>
                      <p className="text-sm text-blue-700 mt-1">
                        {initiative.description}
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        By {initiative.authority}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVisitPortal(initiative)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit Portal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-orange-600 mr-2" />
              <h4 className="font-semibold text-orange-800">
                Stay Updated with Government Alerts
              </h4>
            </div>
            <p className="text-sm text-orange-700 mb-4 text-center">
              Subscribe to receive the latest government advisories and security
              updates directly in your inbox.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                disabled={isSubscribing}
                className="bg-white"
              />
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handleSubscribeToAlerts}
                disabled={isSubscribing}
              >
                {isSubscribing
                  ? "Subscribing..."
                  : "Subscribe to Government Alerts"}
              </Button>
            </div>
            <p className="text-xs text-orange-600 mt-2 text-center">
              We'll only send you official government advisories and critical
              security updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GovernmentAdvisories;
