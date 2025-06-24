import { useState } from "react";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationSchema {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export const enhancedValidations = {
  required: {
    required: true,
  },
  fraudType: {
    required: true,
    custom: (value: string) => {
      if (!value || value.trim() === "") return "Please select a fraud type";
      const validTypes = [
        "phone_call",
        "sms_fraud",
        "email_phishing",
        "online_fraud",
        "financial_fraud",
        "identity_theft",
        "job_fraud",
        "other",
      ];
      if (!validTypes.includes(value))
        return "Please select a valid fraud type";
      return null;
    },
  },
  phone: {
    required: true,
    pattern: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
    custom: (value: string) => {
      if (!value || value.trim() === "") return "Phone number is required";
      if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(value)) {
        return "Please enter a valid Indian phone number";
      }
      return null;
    },
  },
  date: {
    required: true,
    custom: (value: Date | null) => {
      if (!value) return "Date is required";
      if (value > new Date()) return "Date cannot be in the future";
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      if (value < oneYearAgo) return "Date cannot be more than 1 year ago";
      return null;
    },
  },
};

const useFormValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (fieldName: string, value: any): string | null => {
    const rule = schema[fieldName];
    if (!rule) return null;

    // Required validation
    if (
      rule.required &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      return `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return null;
    }

    // Min length validation
    if (
      rule.minLength &&
      typeof value === "string" &&
      value.length < rule.minLength
    ) {
      return `${fieldName} must be at least ${rule.minLength} characters long`;
    }

    // Max length validation
    if (
      rule.maxLength &&
      typeof value === "string" &&
      value.length > rule.maxLength
    ) {
      return `${fieldName} must not exceed ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (
      rule.pattern &&
      typeof value === "string" &&
      !rule.pattern.test(value)
    ) {
      return `${fieldName} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const validateForm = (formData: any): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(schema).forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (fieldName: string): void => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const hasError = (fieldName: string): boolean => {
    return !!errors[fieldName];
  };

  const getError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  // Return the complete validation interface
  return {
    errors,
    validateField,
    validateForm,
    clearError,
    hasError,
    getError,
    setErrors,
  } as const;
};

export default useFormValidation;
