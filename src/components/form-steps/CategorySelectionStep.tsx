import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, IndianRupee, Shield, Clock } from "lucide-react";

interface CategorySelectionStepProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  fraudType: string;
  error?: string;
}

const categoryMapping = {
  phone_call: [
    {
      id: "fake_bank_call",
      title: "Fake Bank/Financial Institution Call",
      description: "Impersonating bank officials to steal account information",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "tech_support_scam",
      title: "Tech Support Scam",
      description: "Fake technical support calls asking for computer access",
      severity: "medium",
      timeToReport: "24 hours",
    },
    {
      id: "prize_scam",
      title: "Prize/Lottery Scam",
      description: "Fake calls claiming you won a prize or lottery",
      severity: "medium",
      timeToReport: "48 hours",
    },
    {
      id: "survey_scam",
      title: "Survey/Research Scam",
      description: "Fake survey calls collecting personal information",
      severity: "low",
      timeToReport: "72 hours",
    },
  ],
  sms_fraud: [
    {
      id: "otp_theft",
      title: "OTP/PIN Theft",
      description: "Messages asking for OTP, PIN, or passwords",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "fake_delivery",
      title: "Fake Delivery SMS",
      description: "Fraudulent delivery or courier messages",
      severity: "medium",
      timeToReport: "24 hours",
    },
    {
      id: "prize_sms",
      title: "Prize/Contest SMS",
      description: "Fake prize winning or contest messages",
      severity: "medium",
      timeToReport: "48 hours",
    },
    {
      id: "malicious_links",
      title: "Malicious Links",
      description: "SMS containing suspicious or harmful links",
      severity: "medium",
      timeToReport: "24 hours",
    },
  ],
  email_phishing: [
    {
      id: "account_verification",
      title: "Account Verification Phishing",
      description: "Fake emails asking to verify account information",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "invoice_scam",
      title: "Invoice/Payment Scam",
      description: "Fraudulent invoices or payment requests",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "fake_offers",
      title: "Fake Offers/Deals",
      description: "Too-good-to-be-true offers and deals",
      severity: "medium",
      timeToReport: "48 hours",
    },
    {
      id: "malware_email",
      title: "Malware/Virus Email",
      description: "Emails containing malicious attachments",
      severity: "high",
      timeToReport: "Immediate",
    },
  ],
  online_fraud: [
    {
      id: "fake_shopping",
      title: "Fake Shopping Website",
      description: "Fraudulent e-commerce sites stealing money",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "dating_scam",
      title: "Dating/Romance Scam",
      description: "Fraudulent romantic relationships for money",
      severity: "medium",
      timeToReport: "24 hours",
    },
    {
      id: "social_media_fraud",
      title: "Social Media Fraud",
      description: "Fraud through social media platforms",
      severity: "medium",
      timeToReport: "48 hours",
    },
    {
      id: "fake_services",
      title: "Fake Service Providers",
      description: "Fraudulent service booking platforms",
      severity: "medium",
      timeToReport: "24 hours",
    },
  ],
  financial_fraud: [
    {
      id: "upi_fraud",
      title: "UPI/Digital Payment Fraud",
      description: "Unauthorized UPI or digital payment transactions",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "credit_card_fraud",
      title: "Credit/Debit Card Fraud",
      description: "Unauthorized card transactions or cloning",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "investment_scam",
      title: "Investment/Trading Scam",
      description: "Fraudulent investment schemes or trading platforms",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "loan_scam",
      title: "Loan/Credit Scam",
      description: "Fake loan offers or credit schemes",
      severity: "medium",
      timeToReport: "24 hours",
    },
  ],
  identity_theft: [
    {
      id: "document_theft",
      title: "Document Identity Theft",
      description: "Misuse of Aadhaar, PAN, or other documents",
      severity: "high",
      timeToReport: "Immediate",
    },
    {
      id: "fake_profiles",
      title: "Fake Profile Creation",
      description: "Someone created fake profiles using your identity",
      severity: "medium",
      timeToReport: "24 hours",
    },
    {
      id: "kyc_fraud",
      title: "KYC/Verification Fraud",
      description: "Fraudulent KYC or identity verification processes",
      severity: "high",
      timeToReport: "Immediate",
    },
  ],
  job_fraud: [
    {
      id: "fake_job_offer",
      title: "Fake Job Offer",
      description: "Fraudulent job offers with upfront payments",
      severity: "medium",
      timeToReport: "24 hours",
    },
    {
      id: "work_from_home",
      title: "Work from Home Scam",
      description: "Fake work from home opportunities",
      severity: "medium",
      timeToReport: "48 hours",
    },
    {
      id: "fee_based_jobs",
      title: "Fee-based Job Scam",
      description: "Jobs requiring upfront fees or deposits",
      severity: "medium",
      timeToReport: "24 hours",
    },
  ],
  other: [
    {
      id: "matrimonial_fraud",
      title: "Matrimonial Fraud",
      description: "Fraudulent matrimonial profiles or schemes",
      severity: "medium",
      timeToReport: "24 hours",
    },
    {
      id: "rental_scam",
      title: "Rental/Property Scam",
      description: "Fake property rentals or real estate fraud",
      severity: "medium",
      timeToReport: "24 hours",
    },
    {
      id: "charity_scam",
      title: "Charity/Donation Scam",
      description: "Fake charity or donation requests",
      severity: "low",
      timeToReport: "72 hours",
    },
    {
      id: "general_fraud",
      title: "General Fraud",
      description: "Other types of fraudulent activities",
      severity: "medium",
      timeToReport: "48 hours",
    },
  ],
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "high":
      return AlertTriangle;
    case "medium":
      return Shield;
    case "low":
      return IndianRupee;
    default:
      return Clock;
  }
};

const CategorySelectionStep: React.FC<CategorySelectionStepProps> = ({
  selectedCategory,
  onCategorySelect,
  fraudType,
  error,
}) => {
  const categories = categoryMapping[fraudType] || categoryMapping.other;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Specific Category
        </h2>
        <p className="text-gray-600">
          Choose the specific type of fraud that best matches your experience
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

      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const SeverityIcon = getSeverityIcon(category.severity);

          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-india-saffron border-india-saffron bg-saffron-50"
                  : "hover:border-gray-300"
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${getSeverityColor(category.severity)}`}
                  >
                    <SeverityIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {category.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={getSeverityColor(category.severity)}
                      >
                        {category.severity} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Report within: {category.timeToReport}</span>
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

export default CategorySelectionStep;
