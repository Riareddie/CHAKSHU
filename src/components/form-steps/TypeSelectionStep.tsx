import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  Briefcase,
  Users,
  Globe,
  AlertTriangle,
} from "lucide-react";

interface TypeSelectionStepProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  error?: string;
}

const fraudTypes = [
  {
    id: "phone_call",
    title: "Phone Call Fraud",
    description:
      "Fraudulent phone calls asking for personal information or money",
    icon: Phone,
    color: "bg-red-100 text-red-800",
    examples: ["Fake bank calls", "Prize scam calls", "Tech support scams"],
  },
  {
    id: "sms_fraud",
    title: "SMS/Text Fraud",
    description: "Fraudulent text messages with malicious links or requests",
    icon: MessageSquare,
    color: "bg-orange-100 text-orange-800",
    examples: ["Fake delivery messages", "OTP theft", "Prize winning SMS"],
  },
  {
    id: "email_phishing",
    title: "Email Phishing",
    description: "Fraudulent emails attempting to steal information",
    icon: Mail,
    color: "bg-yellow-100 text-yellow-800",
    examples: ["Fake bank emails", "Phishing links", "Invoice scams"],
  },
  {
    id: "online_fraud",
    title: "Online Fraud",
    description: "Fraudulent websites or online transactions",
    icon: Globe,
    color: "bg-blue-100 text-blue-800",
    examples: ["Fake shopping sites", "Dating scams", "Social media fraud"],
  },
  {
    id: "financial_fraud",
    title: "Financial Fraud",
    description: "Fraudulent financial transactions or investment schemes",
    icon: CreditCard,
    color: "bg-green-100 text-green-800",
    examples: ["UPI fraud", "Credit card fraud", "Investment scams"],
  },
  {
    id: "identity_theft",
    title: "Identity Theft",
    description: "Unauthorized use of personal information",
    icon: Users,
    color: "bg-purple-100 text-purple-800",
    examples: ["Document theft", "Fake profiles", "KYC fraud"],
  },
  {
    id: "job_fraud",
    title: "Job/Employment Fraud",
    description: "Fraudulent job offers or employment schemes",
    icon: Briefcase,
    color: "bg-indigo-100 text-indigo-800",
    examples: ["Fake job offers", "Work from home scams", "Fee-based jobs"],
  },
  {
    id: "other",
    title: "Other Fraud",
    description: "Other types of fraudulent activities",
    icon: AlertTriangle,
    color: "bg-gray-100 text-gray-800",
    examples: ["Matrimonial fraud", "Rental scams", "Lottery scams"],
  },
];

const TypeSelectionStep: React.FC<TypeSelectionStepProps> = ({
  selectedType,
  onTypeSelect,
  error,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What type of fraud are you reporting?
        </h2>
        <p className="text-gray-600">
          Select the category that best describes the fraudulent activity you
          encountered
        </p>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fraudTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-india-saffron border-india-saffron bg-saffron-50"
                  : "hover:border-gray-300"
              } ${error ? "border-red-300" : ""}`}
              onClick={() => onTypeSelect(type.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${type.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {type.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.map((example, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="text-india-saffron">
                      <div className="w-6 h-6 rounded-full bg-india-saffron flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TypeSelectionStep;
