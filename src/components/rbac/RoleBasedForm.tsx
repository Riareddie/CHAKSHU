/**
 * Role-Based Form Components
 * Provides form fields with role-based access control and conditional rendering
 */

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeOff, Lock, AlertTriangle, Info } from "lucide-react";
import { useRBAC, useFieldAccess } from "@/hooks/useRBAC";
import { ProtectedComponent } from "./ProtectedComponent";
import { UserRole, Permission, FieldAccessControl } from "@/types/rbac";

// Field access configuration for fraud report form
const FRAUD_REPORT_FIELDS: Record<string, FieldAccessControl> = {
  title: {
    fieldName: "title",
    roles: {
      [UserRole.CITIZEN]: { read: true, write: true, required: true },
      [UserRole.OFFICER]: { read: true, write: true, required: true },
      [UserRole.ADMIN]: { read: true, write: true, required: true },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: true },
    },
  },
  description: {
    fieldName: "description",
    roles: {
      [UserRole.CITIZEN]: { read: true, write: true, required: true },
      [UserRole.OFFICER]: { read: true, write: true, required: true },
      [UserRole.ADMIN]: { read: true, write: true, required: true },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: true },
    },
  },
  amount: {
    fieldName: "amount",
    roles: {
      [UserRole.CITIZEN]: { read: true, write: true, required: false },
      [UserRole.OFFICER]: { read: true, write: true, required: false },
      [UserRole.ADMIN]: { read: true, write: true, required: false },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: false },
    },
  },
  suspiciousPhone: {
    fieldName: "suspiciousPhone",
    roles: {
      [UserRole.CITIZEN]: { read: false, write: true, required: false }, // Can add but can't see others
      [UserRole.OFFICER]: { read: true, write: true, required: false },
      [UserRole.ADMIN]: { read: true, write: true, required: false },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: false },
    },
  },
  internalNotes: {
    fieldName: "internalNotes",
    roles: {
      [UserRole.CITIZEN]: { read: false, write: false },
      [UserRole.OFFICER]: { read: true, write: true, required: false },
      [UserRole.ADMIN]: { read: true, write: true, required: false },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: false },
    },
    permissions: {
      read: [Permission.REPORTS_VIEW_ALL],
      write: [Permission.REPORTS_UPDATE_ALL],
    },
  },
  assignedTo: {
    fieldName: "assignedTo",
    roles: {
      [UserRole.CITIZEN]: { read: true, write: false },
      [UserRole.OFFICER]: { read: true, write: false },
      [UserRole.ADMIN]: { read: true, write: true, required: false },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: false },
    },
    permissions: {
      write: [Permission.REPORTS_ASSIGN],
    },
  },
  priority: {
    fieldName: "priority",
    roles: {
      [UserRole.CITIZEN]: { read: false, write: false },
      [UserRole.OFFICER]: { read: true, write: true, required: false },
      [UserRole.ADMIN]: { read: true, write: true, required: false },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: false },
    },
    permissions: {
      read: [Permission.REPORTS_VIEW_ALL],
      write: [Permission.REPORTS_UPDATE_ALL],
    },
  },
  status: {
    fieldName: "status",
    roles: {
      [UserRole.CITIZEN]: { read: true, write: false },
      [UserRole.OFFICER]: { read: true, write: true, required: false },
      [UserRole.ADMIN]: { read: true, write: true, required: false },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: false },
    },
    permissions: {
      write: [Permission.REPORTS_UPDATE_ALL],
    },
  },
  sensitiveEvidence: {
    fieldName: "sensitiveEvidence",
    roles: {
      [UserRole.CITIZEN]: { read: false, write: false },
      [UserRole.OFFICER]: { read: true, write: true, required: false },
      [UserRole.ADMIN]: { read: true, write: true, required: false },
      [UserRole.SUPER_ADMIN]: { read: true, write: true, required: false },
    },
    permissions: {
      read: [Permission.EVIDENCE_VIEW],
      write: [Permission.EVIDENCE_UPLOAD],
    },
  },
};

interface RoleBasedFieldProps {
  fieldName: string;
  children: React.ReactNode;
  showFieldInfo?: boolean;
  fallbackComponent?: React.ReactNode;
}

interface FormSectionProps {
  title: string;
  description?: string;
  requiredPermissions?: Permission[];
  requiredRoles?: UserRole[];
  children: React.ReactNode;
  className?: string;
}

interface ConditionalFieldProps {
  fieldName: string;
  label: string;
  type: "input" | "textarea" | "select" | "checkbox" | "radio";
  value?: any;
  onChange?: (value: any) => void;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
  helpText?: string;
}

// Role-based field wrapper
export const RoleBasedField: React.FC<RoleBasedFieldProps> = ({
  fieldName,
  children,
  showFieldInfo = false,
  fallbackComponent,
}) => {
  const { user, hasPermission } = useRBAC();
  const { getFieldAccess } = useFieldAccess();

  if (!user) {
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 rounded">
          <div className="flex items-center space-x-2 text-gray-500">
            <Lock className="h-4 w-4" />
            <span className="text-sm">Authentication required</span>
          </div>
        </div>
      </div>
    );
  }

  const fieldConfig = FRAUD_REPORT_FIELDS[fieldName];
  if (!fieldConfig) {
    return <>{children}</>;
  }

  const { canRead, canWrite, isRequired } = getFieldAccess(
    fieldName,
    fieldConfig,
  );

  // If user can't read the field at all
  if (!canRead) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <EyeOff className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Field not accessible</span>
        </div>
        {showFieldInfo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This field requires higher permissions to view.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // If user can read but not write, make it read-only
  if (!canWrite) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <div className="opacity-75">
            {React.cloneElement(children as React.ReactElement, {
              disabled: true,
              readOnly: true,
            })}
          </div>
          <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
            Read Only
          </Badge>
        </div>
        {showFieldInfo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              You can view this field but cannot modify it.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // User has full access
  return (
    <div className="space-y-2">
      {React.cloneElement(children as React.ReactElement, {
        required: isRequired,
      })}
      {showFieldInfo && (isRequired || !canWrite) && (
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {isRequired && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
          {!canWrite && (
            <Badge variant="secondary" className="text-xs">
              Read Only
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

// Form section with role-based access
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  requiredPermissions,
  requiredRoles,
  children,
  className = "",
}) => {
  return (
    <ProtectedComponent
      permissions={requiredPermissions}
      roles={requiredRoles}
      showFallback={false}
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </ProtectedComponent>
  );
};

// Conditional field component that handles all field types
export const ConditionalField: React.FC<ConditionalFieldProps> = ({
  fieldName,
  label,
  type,
  value,
  onChange,
  options,
  placeholder,
  className = "",
  helpText,
}) => {
  const renderField = () => {
    const baseProps = {
      value,
      onChange: (e: any) => onChange?.(e.target?.value || e),
      placeholder,
      className,
    };

    switch (type) {
      case "input":
        return <Input {...baseProps} />;

      case "textarea":
        return <Textarea {...baseProps} />;

      case "select":
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={className}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value}
              onCheckedChange={onChange}
              className={className}
            />
            <Label className="text-sm">{label}</Label>
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={value}
            onValueChange={onChange}
            className={className}
          >
            {options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} />
                <Label className="text-sm">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return <Input {...baseProps} />;
    }
  };

  return (
    <RoleBasedField fieldName={fieldName}>
      <div className="space-y-2">
        {type !== "checkbox" && (
          <Label className="text-sm font-medium">{label}</Label>
        )}
        {renderField()}
        {helpText && <p className="text-xs text-gray-500">{helpText}</p>}
      </div>
    </RoleBasedField>
  );
};

// Complete fraud report form with role-based fields
export const FraudReportForm: React.FC<{
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  mode?: "create" | "edit" | "view";
}> = ({ initialData, onSubmit, onCancel, mode = "create" }) => {
  const [formData, setFormData] = React.useState(initialData || {});
  const { user } = useRBAC();

  const updateField = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!user) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to access this form.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <FormSection
        title="Basic Information"
        description="Primary details about the fraud incident"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConditionalField
            fieldName="title"
            label="Incident Title"
            type="input"
            value={formData.title}
            onChange={(value) => updateField("title", value)}
            placeholder="Brief description of the fraud"
            helpText="Provide a clear, concise title for the incident"
          />

          <ConditionalField
            fieldName="amount"
            label="Amount Involved"
            type="input"
            value={formData.amount}
            onChange={(value) => updateField("amount", value)}
            placeholder="₹ 0.00"
            helpText="Estimated financial loss (if applicable)"
          />
        </div>

        <ConditionalField
          fieldName="description"
          label="Detailed Description"
          type="textarea"
          value={formData.description}
          onChange={(value) => updateField("description", value)}
          placeholder="Provide detailed information about the fraud incident..."
          helpText="Include timeline, method used, and any other relevant details"
        />
      </FormSection>

      {/* Contact Information Section */}
      <FormSection
        title="Suspicious Contact Information"
        description="Details about fraudulent contacts"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConditionalField
            fieldName="suspiciousPhone"
            label="Suspicious Phone Number"
            type="input"
            value={formData.suspiciousPhone}
            onChange={(value) => updateField("suspiciousPhone", value)}
            placeholder="+91 XXXXXXXXXX"
            helpText="Phone number used by the fraudster"
          />

          <ConditionalField
            fieldName="suspiciousEmail"
            label="Suspicious Email"
            type="input"
            value={formData.suspiciousEmail}
            onChange={(value) => updateField("suspiciousEmail", value)}
            placeholder="fraudster@example.com"
            helpText="Email address used in the fraud"
          />
        </div>
      </FormSection>

      {/* Investigation Section - Officer/Admin Only */}
      <FormSection
        title="Investigation Details"
        description="Internal investigation information"
        requiredRoles={[UserRole.OFFICER, UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ConditionalField
            fieldName="status"
            label="Investigation Status"
            type="select"
            value={formData.status}
            onChange={(value) => updateField("status", value)}
            options={[
              { value: "pending", label: "Pending Review" },
              { value: "investigating", label: "Under Investigation" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "Closed" },
            ]}
          />

          <ConditionalField
            fieldName="priority"
            label="Priority Level"
            type="select"
            value={formData.priority}
            onChange={(value) => updateField("priority", value)}
            options={[
              { value: "low", label: "Low Priority" },
              { value: "medium", label: "Medium Priority" },
              { value: "high", label: "High Priority" },
              { value: "critical", label: "Critical" },
            ]}
          />
        </div>

        <ConditionalField
          fieldName="assignedTo"
          label="Assigned Investigator"
          type="select"
          value={formData.assignedTo}
          onChange={(value) => updateField("assignedTo", value)}
          options={[
            { value: "officer1", label: "Officer John Doe" },
            { value: "officer2", label: "Officer Jane Smith" },
            { value: "admin1", label: "Admin Mike Johnson" },
          ]}
          helpText="Select the investigator assigned to this case"
        />

        <ConditionalField
          fieldName="internalNotes"
          label="Internal Investigation Notes"
          type="textarea"
          value={formData.internalNotes}
          onChange={(value) => updateField("internalNotes", value)}
          placeholder="Internal notes, findings, and investigation progress..."
          helpText="These notes are only visible to officers and administrators"
        />
      </FormSection>

      {/* Sensitive Evidence Section - Officer+ Only */}
      <FormSection
        title="Sensitive Evidence"
        description="Confidential evidence and documentation"
        requiredPermissions={[Permission.EVIDENCE_VIEW]}
      >
        <ConditionalField
          fieldName="sensitiveEvidence"
          label="Confidential Documentation"
          type="textarea"
          value={formData.sensitiveEvidence}
          onChange={(value) => updateField("sensitiveEvidence", value)}
          placeholder="Sensitive evidence details, witness statements, etc..."
          helpText="This information is restricted to authorized personnel only"
        />

        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            This section contains sensitive information and is only accessible
            to authorized personnel.
          </AlertDescription>
        </Alert>
      </FormSection>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}

        {mode !== "view" && (
          <ProtectedComponent
            permissions={
              mode === "create"
                ? [Permission.REPORTS_CREATE]
                : [Permission.REPORTS_UPDATE_OWN]
            }
          >
            <Button type="submit">
              {mode === "create" ? "Submit Report" : "Update Report"}
            </Button>
          </ProtectedComponent>
        )}
      </div>
    </form>
  );
};

// Export field access configuration for use in other components
export { FRAUD_REPORT_FIELDS };
export default RoleBasedField;
