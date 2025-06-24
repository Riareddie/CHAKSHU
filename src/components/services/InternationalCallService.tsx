import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const InternationalCallService: React.FC = () => {
  const [formData, setFormData] = useState({
    callerNumber: "",
    displayNumber: "",
    callDate: "",
    callTime: "",
    callDuration: "",
    description: "",
    category: "",
    yourNumber: "+91",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportId, setReportId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categories = [
    "Fraud Call - Investment/Trading Scam",
    "Fraud Call - Lottery/Prize Scam",
    "Fraud Call - Banking/Financial Scam",
    "Fraud Call - Technical Support Scam",
    "Fraud Call - Romance/Relationship Scam",
    "Spam Call - Promotional",
    "Spam Call - Sales/Marketing",
    "Phishing Attempt",
    "Other Suspicious Activity",
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.callerNumber.trim()) {
      newErrors.callerNumber = "Caller number is required";
    }

    if (!formData.displayNumber.trim()) {
      newErrors.displayNumber = "Displayed Indian number is required";
    } else {
      const cleanNumber = formData.displayNumber.replace(/[\s\-\(\)]/g, "");
      const phonePatterns = [
        /^\+91[6789]\d{9}$/, // +91XXXXXXXXXX
        /^91[6789]\d{9}$/, // 91XXXXXXXXXX
        /^0[6789]\d{9}$/, // 0XXXXXXXXXX
        /^[6789]\d{9}$/, // XXXXXXXXXX
      ];
      const isValid = phonePatterns.some((pattern) =>
        pattern.test(cleanNumber),
      );
      if (!isValid) {
        newErrors.displayNumber =
          "Please enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9)";
      }
    }

    if (!formData.callDate) {
      newErrors.callDate = "Call date is required";
    }

    if (!formData.callTime) {
      newErrors.callTime = "Call time is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (!formData.yourNumber || formData.yourNumber === "+91") {
      newErrors.yourNumber = "Your mobile number is required";
    } else {
      const cleanNumber = formData.yourNumber.replace(/[\s\-\(\)]/g, "");
      const phonePatterns = [
        /^\+91[6789]\d{9}$/, // +91XXXXXXXXXX
        /^91[6789]\d{9}$/, // 91XXXXXXXXXX
        /^0[6789]\d{9}$/, // 0XXXXXXXXXX
        /^[6789]\d{9}$/, // XXXXXXXXXX
      ];
      const isValid = phonePatterns.some((pattern) =>
        pattern.test(cleanNumber),
      );
      if (!isValid) {
        newErrors.yourNumber =
          "Please enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedReportId = `IRC${Date.now().toString().slice(-8)}`;
      setReportId(generatedReportId);
      setIsSubmitted(true);
      setIsSubmitting(false);

      toast({
        title: "Report Submitted Successfully",
        description: `Your report ID is ${generatedReportId}`,
      });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Report Submitted Successfully
          </h2>
          <p className="text-gray-600 mb-6">
            Your international call report has been submitted and will be
            investigated by the relevant authorities.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Report Details</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <strong>Report ID:</strong> {reportId}
              </p>
              <p>
                <strong>Caller Number:</strong> {formData.callerNumber}
              </p>
              <p>
                <strong>Displayed Number:</strong> {formData.displayNumber}
              </p>
              <p>
                <strong>Category:</strong> {formData.category}
              </p>
              <p>
                <strong>Date & Time:</strong> {formData.callDate} at{" "}
                {formData.callTime}
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-yellow-700 text-left space-y-1">
              <li>• Your report will be analyzed by cybercrime experts</li>
              <li>• The caller's number will be investigated</li>
              <li>
                • Necessary action will be taken to block fraudulent numbers
              </li>
              <li>
                • You may be contacted for additional information if needed
              </li>
            </ul>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-india-saffron hover:bg-saffron-600"
          >
            Report Another Call
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-india-saffron" />
          Report International Call with Indian Number
        </CardTitle>
        <p className="text-gray-600">
          Report suspicious international calls displaying Indian numbers to
          prevent fraud
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> International calls should not display
            Indian mobile numbers. If you receive such calls, they are likely
            fraudulent and should be reported immediately.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="callerNumber">
              Actual Caller Number (International)
            </Label>
            <Input
              id="callerNumber"
              value={formData.callerNumber}
              onChange={(e) =>
                handleInputChange("callerNumber", e.target.value)
              }
              placeholder="+1-XXX-XXX-XXXX or Unknown"
              className={errors.callerNumber ? "border-red-500" : ""}
            />
            {errors.callerNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.callerNumber}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              The actual international number that called you (if available)
            </p>
          </div>

          <div>
            <Label htmlFor="displayNumber">Displayed Indian Number</Label>
            <Input
              id="displayNumber"
              value={formData.displayNumber}
              onChange={(e) =>
                handleInputChange("displayNumber", e.target.value)
              }
              placeholder="+91XXXXXXXXXX"
              className={errors.displayNumber ? "border-red-500" : ""}
            />
            {errors.displayNumber && (
              <p className="text-sm text-red-600 mt-1">
                {errors.displayNumber}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              The Indian number that was displayed on your phone screen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="callDate">Call Date</Label>
              <Input
                id="callDate"
                type="date"
                value={formData.callDate}
                onChange={(e) => handleInputChange("callDate", e.target.value)}
                className={errors.callDate ? "border-red-500" : ""}
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.callDate && (
                <p className="text-sm text-red-600 mt-1">{errors.callDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="callTime">Call Time</Label>
              <Input
                id="callTime"
                type="time"
                value={formData.callTime}
                onChange={(e) => handleInputChange("callTime", e.target.value)}
                className={errors.callTime ? "border-red-500" : ""}
              />
              {errors.callTime && (
                <p className="text-sm text-red-600 mt-1">{errors.callTime}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="callDuration">Call Duration (Optional)</Label>
            <Input
              id="callDuration"
              value={formData.callDuration}
              onChange={(e) =>
                handleInputChange("callDuration", e.target.value)
              }
              placeholder="e.g., 2 minutes, 30 seconds"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select call category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description of Conversation</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what the caller said, what they were trying to sell/scam, any personal information they asked for, etc."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Provide detailed information about the conversation (minimum 20
              characters)
            </p>
          </div>

          <div>
            <Label htmlFor="yourNumber">Your Mobile Number</Label>
            <Input
              id="yourNumber"
              value={formData.yourNumber}
              onChange={(e) => handleInputChange("yourNumber", e.target.value)}
              placeholder="+91XXXXXXXXXX"
              className={errors.yourNumber ? "border-red-500" : ""}
            />
            {errors.yourNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.yourNumber}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Your number for verification purposes (kept confidential)
            </p>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            By submitting this report, you confirm that the information provided
            is accurate to the best of your knowledge. False reporting is a
            punishable offense.
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-india-saffron hover:bg-saffron-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting Report...
            </>
          ) : (
            "Submit International Call Report"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InternationalCallService;
