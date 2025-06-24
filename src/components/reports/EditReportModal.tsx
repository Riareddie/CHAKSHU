import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  X,
  AlertTriangle,
  Phone,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
} from "lucide-react";

interface Report {
  id: string;
  type: string;
  title: string;
  description: string;
  phoneNumber: string;
  location: string;
  amount?: number;
  status: "pending" | "under_review" | "resolved" | "rejected" | "escalated";
  severity: "low" | "medium" | "high" | "critical";
  submittedAt: Date;
  updatedAt: Date;
  referenceId: string;
  evidenceCount: number;
}

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  onSave: (updatedReport: Report) => void;
}

const EditReportModal: React.FC<EditReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Report>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        ...report,
      });
    }
  }, [report]);

  if (!report || !isOpen) return null;

  const handleInputChange = (field: keyof Report, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.description?.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and description are required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phoneNumber?.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedReport: Report = {
        ...report,
        ...formData,
        updatedAt: new Date(),
        title: formData.title!,
        description: formData.description!,
        phoneNumber: formData.phoneNumber!,
        location: formData.location || "",
        type: formData.type || report.type,
        severity: formData.severity || report.severity,
        amount: formData.amount,
      };

      onSave(updatedReport);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to update report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Edit Fraud Report
          </DialogTitle>
          <DialogDescription>
            Reference ID: {report.referenceId || "N/A"} • Submitted:{" "}
            {report.submittedAt
              ? report.submittedAt.toLocaleDateString()
              : "N/A"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Fraud Type</Label>
              <Select
                value={formData.type || report.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fraud type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI Fraud">UPI Fraud</SelectItem>
                  <SelectItem value="Call Fraud">Call Fraud</SelectItem>
                  <SelectItem value="WhatsApp Scam">WhatsApp Scam</SelectItem>
                  <SelectItem value="SMS Fraud">SMS Fraud</SelectItem>
                  <SelectItem value="Email Spam">Email Spam</SelectItem>
                  <SelectItem value="Online Shopping Fraud">
                    Online Shopping Fraud
                  </SelectItem>
                  <SelectItem value="Investment Scam">
                    Investment Scam
                  </SelectItem>
                  <SelectItem value="Job Fraud">Job Fraud</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select
                value={formData.severity || report.severity}
                onValueChange={(value) =>
                  handleInputChange("severity", value as Report["severity"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Report Title *</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief title describing the fraud incident"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Provide detailed information about the fraud incident..."
              rows={4}
              className="w-full"
            />
          </div>

          {/* Contact and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="+91-XXXXXXXXXX"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, State"
                className="w-full"
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount Involved (if any)
            </Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount || ""}
              onChange={(e) =>
                handleInputChange(
                  "amount",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              placeholder="0"
              className="w-full"
            />
          </div>

          {/* Current Status Display */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Current Status</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {report.status.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge
                variant={
                  report.severity === "critical"
                    ? "destructive"
                    : report.severity === "high"
                      ? "destructive"
                      : report.severity === "medium"
                        ? "default"
                        : "secondary"
                }
              >
                {report.severity.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Status can only be updated by authorities. You can edit the report
              details above.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200">
                  Important Notice
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Once you save changes, the report will be marked as updated
                  and may require re-review by authorities. Make sure all
                  information is accurate before saving.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditReportModal;
