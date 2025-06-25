/**
 * Comprehensive Fraud Report Form
 * Government-compliant form with responsive design, validation, and accessibility
 */

import React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  User,
  MapPin,
  Phone,
  Mail,
  Upload,
  Info,
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { ResponsiveFormField } from "./ResponsiveFormField";
import {
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveContainer,
} from "@/components/layout/ResponsiveLayout";
import {
  ResponsiveModal,
  ResponsiveModalFooter,
} from "@/components/ui/ResponsiveModal";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  fraudReportSchema,
  type FraudReportFormData,
} from "@/lib/validationSchemas";

export interface FraudReportFormProps {
  initialData?: Partial<FraudReportFormData>;
  onSubmit: (data: FraudReportFormData) => Promise<void>;
  onSaveDraft?: (data: Partial<FraudReportFormData>) => Promise<void>;
  onCancel?: () => void;
  mode?: "create" | "edit" | "view";
  showProgress?: boolean;
  multiStep?: boolean;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const fraudCategories = [
  { value: "cyber_fraud", label: "Cyber Fraud / Digital Scam" },
  { value: "financial_fraud", label: "Financial Fraud" },
  { value: "identity_theft", label: "Identity Theft" },
  { value: "phone_scam", label: "Phone / SMS Scam" },
  { value: "email_scam", label: "Email Phishing" },
  { value: "investment_fraud", label: "Investment Fraud" },
  { value: "employment_fraud", label: "Employment Fraud" },
  { value: "lottery_scam", label: "Lottery / Prize Scam" },
  { value: "romance_scam", label: "Romance Scam" },
  { value: "other", label: "Other" },
];

const indianStates = [
  { value: "andhra_pradesh", label: "Andhra Pradesh" },
  { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
  { value: "assam", label: "Assam" },
  { value: "bihar", label: "Bihar" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "goa", label: "Goa" },
  { value: "gujarat", label: "Gujarat" },
  { value: "haryana", label: "Haryana" },
  { value: "himachal_pradesh", label: "Himachal Pradesh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "karnataka", label: "Karnataka" },
  { value: "kerala", label: "Kerala" },
  { value: "madhya_pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "manipur", label: "Manipur" },
  { value: "meghalaya", label: "Meghalaya" },
  { value: "mizoram", label: "Mizoram" },
  { value: "nagaland", label: "Nagaland" },
  { value: "odisha", label: "Odisha" },
  { value: "punjab", label: "Punjab" },
  { value: "rajasthan", label: "Rajasthan" },
  { value: "sikkim", label: "Sikkim" },
  { value: "tamil_nadu", label: "Tamil Nadu" },
  { value: "telangana", label: "Telangana" },
  { value: "tripura", label: "Tripura" },
  { value: "uttar_pradesh", label: "Uttar Pradesh" },
  { value: "uttarakhand", label: "Uttarakhand" },
  { value: "west_bengal", label: "West Bengal" },
  { value: "delhi", label: "Delhi" },
  { value: "chandigarh", label: "Chandigarh" },
  { value: "puducherry", label: "Puducherry" },
];

interface FormStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: string[];
  optional?: boolean;
}

const formSteps: FormStep[] = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Provide essential details about the fraud incident",
    icon: <FileText className="h-5 w-5" />,
    fields: ["title", "category", "description", "incidentDate"],
  },
  {
    id: "financial",
    title: "Financial Details",
    description: "Information about financial loss or involvement",
    icon: <Shield className="h-5 w-5" />,
    fields: ["amountInvolved"],
    optional: true,
  },
  {
    id: "contacts",
    title: "Suspicious Contacts",
    description: "Details about fraudulent contacts or communications",
    icon: <Phone className="h-5 w-5" />,
    fields: ["suspiciousContacts"],
    optional: true,
  },
  {
    id: "location",
    title: "Location Details",
    description: "Where the incident occurred",
    icon: <MapPin className="h-5 w-5" />,
    fields: ["location"],
  },
  {
    id: "evidence",
    title: "Evidence & Additional Info",
    description: "Upload evidence and provide additional details",
    icon: <Upload className="h-5 w-5" />,
    fields: ["evidence", "additionalInfo"],
    optional: true,
  },
  {
    id: "verification",
    title: "Verification & Consent",
    description: "Confirm the information and provide consent",
    icon: <CheckCircle className="h-5 w-5" />,
    fields: ["consentToShare", "verifyTruthfulness"],
  },
];

export const FraudReportForm: React.FC<FraudReportFormProps> = ({
  initialData,
  onSubmit,
  onSaveDraft,
  onCancel,
  mode = "create",
  showProgress = true,
  multiStep = true,
  className = "",
  disabled = false,
  loading = false,
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [isDraftSaving, setIsDraftSaving] = React.useState(false);

  const form = useFormValidation({
    schema: fraudReportSchema,
    mode: "onChange",
    defaultValues: initialData || {},
    enableRealTimeValidation: true,
    debounceMs: 300,
    validateOnMount: false,
  });

  const {
    formState: { isSubmitting, isDirty },
    watch,
    trigger,
    getValues,
    handleSubmit,
    getFormProgress,
    validationState,
    submissionState,
    canSubmit,
  } = form;

  const watchedValues = watch();
  const progress = getFormProgress();

  // Navigate between steps
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < formSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const goToNextStep = async () => {
    const currentStepData = formSteps[currentStep];

    // Validate current step fields
    const isStepValid = await trigger(currentStepData.fields as any);

    if (isStepValid || currentStepData.optional) {
      if (currentStep < formSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Save draft functionality
  const handleSaveDraft = async () => {
    if (!onSaveDraft) return;

    setIsDraftSaving(true);
    try {
      await onSaveDraft(getValues());
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Form submission with confirmation
  const handleFormSubmit = handleSubmit(async (data) => {
    if (multiStep && currentStep < formSteps.length - 1) {
      await goToNextStep();
      return;
    }

    setShowConfirmation(true);
  });

  const confirmSubmission = async () => {
    try {
      await onSubmit(getValues());
      setShowConfirmation(false);
    } catch (error) {
      console.error("Form submission failed:", error);
      setShowConfirmation(false);
    }
  };

  // Step completion status
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "active";
    return "pending";
  };

  const isStepValid = (stepIndex: number) => {
    const step = formSteps[stepIndex];
    return step.fields.every(
      (fieldName) =>
        !form.formState.errors[fieldName as keyof FraudReportFormData],
    );
  };

  // Render step indicators for multi-step form
  const renderStepIndicators = () => {
    if (!multiStep) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Report Progress</h3>
          <Badge variant="secondary">
            Step {currentStep + 1} of {formSteps.length}
          </Badge>
        </div>

        <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
          {formSteps.map((step, index) => {
            const status = getStepStatus(index);
            const isValid = isStepValid(index);

            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  disabled={index > currentStep}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                    status === "completed"
                      ? "bg-green-500 border-green-500 text-white"
                      : status === "active"
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-gray-100 border-gray-300 text-gray-500",
                    index <= currentStep && "cursor-pointer hover:scale-105",
                    index > currentStep && "cursor-not-allowed opacity-50",
                  )}
                  aria-label={`Go to ${step.title}`}
                >
                  {status === "completed" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>

                {index < formSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-2",
                      index < currentStep ? "bg-green-500" : "bg-gray-300",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <h4 className="font-medium text-lg">
            {formSteps[currentStep].title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {formSteps[currentStep].description}
          </p>
        </div>
      </div>
    );
  };

  // Render form fields based on current step
  const renderFormFields = () => {
    const currentStepData = formSteps[multiStep ? currentStep : 0];

    if (!multiStep) {
      // Render all fields in sections for single-step form
      return (
        <ResponsiveStack direction="column" gap={8}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Provide essential details about the fraud incident
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResponsiveGrid cols={{ default: 1, md: 2 }} gap={6}>
                <ResponsiveFormField
                  name="title"
                  label="Incident Title"
                  type="text"
                  placeholder="Brief description of the fraud incident"
                  required
                  helperText="Provide a clear, concise title that describes the fraud"
                  size="md"
                  variant="government"
                />

                <ResponsiveFormField
                  name="category"
                  label="Fraud Category"
                  type="select"
                  placeholder="Select the type of fraud"
                  options={fraudCategories}
                  required
                  helperText="Choose the category that best describes the fraud"
                  size="md"
                  variant="government"
                />
              </ResponsiveGrid>

              <ResponsiveFormField
                name="description"
                label="Detailed Description"
                type="textarea"
                placeholder="Provide a detailed description of what happened, including timeline, method used, and any other relevant details..."
                required
                rows={6}
                helperText="Include as much detail as possible - timeline, method used, how you were contacted, etc."
                size="md"
                variant="government"
              />

              <ResponsiveFormField
                name="incidentDate"
                label="Date of Incident"
                type="date"
                placeholder="When did the fraud occur?"
                required
                helperText="Select the date when the fraud incident occurred"
                size="md"
                variant="government"
              />
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Financial Details</span>
                <Badge variant="secondary" className="ml-2">
                  Optional
                </Badge>
              </CardTitle>
              <CardDescription>
                Information about financial loss or money involved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveFormField
                name="amountInvolved"
                label="Amount Involved (₹)"
                type="number"
                placeholder="0"
                min={0}
                step={0.01}
                helperText="Enter the amount of money lost or involved in the fraud (if applicable)"
                size="md"
                variant="government"
              />
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location Information</span>
              </CardTitle>
              <CardDescription>Where did the incident occur?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResponsiveGrid cols={{ default: 1, md: 2 }} gap={6}>
                <ResponsiveFormField
                  name="location.state"
                  label="State/UT"
                  type="select"
                  placeholder="Select your state"
                  options={indianStates}
                  required
                  size="md"
                  variant="government"
                />

                <ResponsiveFormField
                  name="location.city"
                  label="City/District"
                  type="text"
                  placeholder="Enter your city or district"
                  required
                  size="md"
                  variant="government"
                />
              </ResponsiveGrid>

              <ResponsiveFormField
                name="location.pinCode"
                label="PIN Code"
                type="text"
                placeholder="Enter 6-digit PIN code"
                helperText="Optional - helps authorities locate and investigate"
                size="md"
                variant="government"
              />
            </CardContent>
          </Card>

          {/* Evidence Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Evidence & Additional Information</span>
                <Badge variant="secondary" className="ml-2">
                  Optional
                </Badge>
              </CardTitle>
              <CardDescription>
                Upload supporting documents and provide additional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ResponsiveFormField
                name="evidence"
                label="Supporting Documents"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                multiple
                maxFiles={5}
                placeholder="Upload screenshots, emails, documents, or other evidence"
                helperText="Accepted formats: PDF, Word documents, Images (max 5 files, 10MB each)"
                size="md"
                variant="government"
              />

              <ResponsiveFormField
                name="additionalInfo"
                label="Additional Information"
                type="textarea"
                placeholder="Any additional information that might be helpful for the investigation..."
                rows={4}
                helperText="Include any other relevant details not covered above"
                size="md"
                variant="government"
              />
            </CardContent>
          </Card>

          {/* Verification & Consent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Verification & Consent</span>
              </CardTitle>
              <CardDescription>
                Please review and confirm your consent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  By submitting this report, you are providing information to
                  law enforcement authorities. Please ensure all information is
                  accurate and truthful.
                </AlertDescription>
              </Alert>

              <ResponsiveFormField
                name="consentToShare"
                label="I consent to sharing this information with relevant law enforcement agencies and authorities for investigation purposes."
                type="checkbox"
                required
                description="This consent is required to process your fraud report and initiate investigation."
                size="md"
              />

              <ResponsiveFormField
                name="verifyTruthfulness"
                label="I verify that the information provided in this report is true and accurate to the best of my knowledge."
                type="checkbox"
                required
                description="Providing false information to law enforcement is a serious offense."
                size="md"
              />
            </CardContent>
          </Card>
        </ResponsiveStack>
      );
    }

    // Multi-step form rendering
    switch (currentStepData.id) {
      case "basic":
        return (
          <ResponsiveStack direction="column" gap={6}>
            <ResponsiveGrid cols={{ default: 1, md: 2 }} gap={6}>
              <ResponsiveFormField
                name="title"
                label="Incident Title"
                type="text"
                placeholder="Brief description of the fraud incident"
                required
                helperText="Provide a clear, concise title that describes the fraud"
                size="lg"
                variant="government"
              />

              <ResponsiveFormField
                name="category"
                label="Fraud Category"
                type="select"
                placeholder="Select the type of fraud"
                options={fraudCategories}
                required
                helperText="Choose the category that best describes the fraud"
                size="lg"
                variant="government"
              />
            </ResponsiveGrid>

            <ResponsiveFormField
              name="description"
              label="Detailed Description"
              type="textarea"
              placeholder="Provide a detailed description of what happened, including timeline, method used, and any other relevant details..."
              required
              rows={6}
              helperText="Include as much detail as possible - timeline, method used, how you were contacted, etc."
              size="lg"
              variant="government"
            />

            <ResponsiveFormField
              name="incidentDate"
              label="Date of Incident"
              type="date"
              placeholder="When did the fraud occur?"
              required
              helperText="Select the date when the fraud incident occurred"
              size="lg"
              variant="government"
            />
          </ResponsiveStack>
        );

      case "financial":
        return (
          <ResponsiveFormField
            name="amountInvolved"
            label="Amount Involved (₹)"
            type="number"
            placeholder="0"
            min={0}
            step={0.01}
            helperText="Enter the amount of money lost or involved in the fraud (if applicable)"
            size="lg"
            variant="government"
          />
        );

      case "location":
        return (
          <ResponsiveStack direction="column" gap={6}>
            <ResponsiveGrid cols={{ default: 1, md: 2 }} gap={6}>
              <ResponsiveFormField
                name="location.state"
                label="State/UT"
                type="select"
                placeholder="Select your state"
                options={indianStates}
                required
                size="lg"
                variant="government"
              />

              <ResponsiveFormField
                name="location.city"
                label="City/District"
                type="text"
                placeholder="Enter your city or district"
                required
                size="lg"
                variant="government"
              />
            </ResponsiveGrid>

            <ResponsiveFormField
              name="location.pinCode"
              label="PIN Code"
              type="text"
              placeholder="Enter 6-digit PIN code"
              helperText="Optional - helps authorities locate and investigate"
              size="lg"
              variant="government"
            />
          </ResponsiveStack>
        );

      case "evidence":
        return (
          <ResponsiveStack direction="column" gap={6}>
            <ResponsiveFormField
              name="evidence"
              label="Supporting Documents"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              multiple
              maxFiles={5}
              placeholder="Upload screenshots, emails, documents, or other evidence"
              helperText="Accepted formats: PDF, Word documents, Images (max 5 files, 10MB each)"
              size="lg"
              variant="government"
            />

            <ResponsiveFormField
              name="additionalInfo"
              label="Additional Information"
              type="textarea"
              placeholder="Any additional information that might be helpful for the investigation..."
              rows={4}
              helperText="Include any other relevant details not covered above"
              size="lg"
              variant="government"
            />
          </ResponsiveStack>
        );

      case "verification":
        return (
          <ResponsiveStack direction="column" gap={6}>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                By submitting this report, you are providing information to law
                enforcement authorities. Please ensure all information is
                accurate and truthful.
              </AlertDescription>
            </Alert>

            <ResponsiveFormField
              name="consentToShare"
              label="I consent to sharing this information with relevant law enforcement agencies and authorities for investigation purposes."
              type="checkbox"
              required
              description="This consent is required to process your fraud report and initiate investigation."
              size="lg"
            />

            <ResponsiveFormField
              name="verifyTruthfulness"
              label="I verify that the information provided in this report is true and accurate to the best of my knowledge."
              type="checkbox"
              required
              description="Providing false information to law enforcement is a serious offense."
              size="lg"
            />
          </ResponsiveStack>
        );

      default:
        return null;
    }
  };

  // Render form actions
  const renderFormActions = () => {
    const isLastStep = currentStep === formSteps.length - 1;
    const isFirstStep = currentStep === 0;

    return (
      <ResponsiveStack
        direction={{ default: "column", sm: "row" }}
        justify="between"
        gap={4}
        className="pt-6 border-t border-gray-200"
      >
        <div className="flex items-center space-x-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading || isSubmitting}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
          )}

          {onSaveDraft && isDirty && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSaveDraft}
              disabled={loading || isSubmitting || isDraftSaving}
              className="min-w-[120px]"
            >
              {isDraftSaving ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {multiStep && !isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              disabled={loading || isSubmitting}
              className="min-w-[120px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}

          <Button
            type="submit"
            disabled={loading || isSubmitting || !canSubmit()}
            className="min-w-[120px] bg-primary hover:bg-primary/90"
          >
            {loading || isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {isLastStep || !multiStep ? "Submitting..." : "Validating..."}
              </>
            ) : isLastStep || !multiStep ? (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </ResponsiveStack>
    );
  };

  return (
    <ResponsiveContainer maxWidth="screen" className={cn("py-8", className)}>
      <form
        onSubmit={handleFormSubmit}
        className="max-w-4xl mx-auto"
        noValidate
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === "edit" ? "Edit Fraud Report" : "Report Fraud Incident"}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Provide detailed information about the fraud incident. Your report
            will be reviewed by law enforcement authorities.
          </p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Form Completion</span>
              <span className="text-sm text-muted-foreground">
                {progress.percentage}% complete
              </span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>
                {progress.completedFields}/{progress.totalFields} fields
                completed
              </span>
              <span>{progress.validFields} validated</span>
            </div>
          </div>
        )}

        {/* Step Indicators */}
        {renderStepIndicators()}

        {/* Form Content */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">{renderFormFields()}</CardContent>
        </Card>

        {/* Form Actions */}
        {renderFormActions()}

        {/* Submission Confirmation Modal */}
        <ResponsiveModal
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          title="Confirm Report Submission"
          description="Please review your information before submitting the fraud report."
          size="lg"
        >
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Once submitted, your report will be forwarded to the appropriate
                law enforcement authorities. You will receive a reference number
                for tracking purposes.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium mb-2">Report Summary:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Title:</strong> {watchedValues.title}
                </div>
                <div>
                  <strong>Category:</strong>{" "}
                  {
                    fraudCategories.find(
                      (cat) => cat.value === watchedValues.category,
                    )?.label
                  }
                </div>
                <div>
                  <strong>Date:</strong> {watchedValues.incidentDate}
                </div>
                {watchedValues.amountInvolved && (
                  <div>
                    <strong>Amount:</strong> ₹{watchedValues.amountInvolved}
                  </div>
                )}
                <div>
                  <strong>Location:</strong> {watchedValues.location?.city},{" "}
                  {watchedValues.location?.state}
                </div>
              </div>
            </div>
          </div>

          <ResponsiveModalFooter variant="confirmation">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isSubmitting}
            >
              Review Again
            </Button>
            <Button
              onClick={confirmSubmission}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModal>
      </form>
    </ResponsiveContainer>
  );
};

export default FraudReportForm;
