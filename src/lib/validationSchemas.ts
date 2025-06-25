/**
 * Comprehensive Validation Schemas for Government Website Forms
 * Uses Zod for type-safe form validation with government-specific field validation
 */

import { z } from "zod";

// Common validation patterns
const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
const aadhaarRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const pinCodeRegex = /^[1-9][0-9]{5}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Custom validation messages
const ValidationMessages = {
  required: "This field is required",
  invalidEmail: "Please enter a valid email address",
  invalidPhone: "Please enter a valid 10-digit mobile number",
  invalidAadhaar: "Please enter a valid 12-digit Aadhaar number",
  invalidPan: "Please enter a valid PAN number (e.g., ABCDE1234F)",
  invalidPinCode: "Please enter a valid 6-digit PIN code",
  invalidIfsc: "Please enter a valid IFSC code (e.g., SBIN0001234)",
  passwordTooShort: "Password must be at least 8 characters long",
  passwordWeak:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  fileTooBig: "File size must be less than 10MB",
  invalidFileType: "Invalid file type",
  dateTooOld: "Date cannot be more than 10 years ago",
  dateFuture: "Date cannot be in the future",
  amountTooLow: "Amount must be greater than 0",
  amountTooHigh: "Amount cannot exceed ₹10,00,00,000",
};

// Basic field validations
export const requiredString = (message?: string) =>
  z.string().min(1, message || ValidationMessages.required);

export const optionalString = () => z.string().optional();

export const emailValidation = () =>
  z
    .string()
    .min(1, ValidationMessages.required)
    .regex(emailRegex, ValidationMessages.invalidEmail);

export const phoneValidation = () =>
  z
    .string()
    .min(1, ValidationMessages.required)
    .regex(phoneRegex, ValidationMessages.invalidPhone);

export const aadhaarValidation = () =>
  z
    .string()
    .min(1, ValidationMessages.required)
    .regex(aadhaarRegex, ValidationMessages.invalidAadhaar);

export const panValidation = () =>
  z
    .string()
    .min(1, ValidationMessages.required)
    .regex(panRegex, ValidationMessages.invalidPan);

export const pinCodeValidation = () =>
  z
    .string()
    .min(1, ValidationMessages.required)
    .regex(pinCodeRegex, ValidationMessages.invalidPinCode);

export const ifscValidation = () =>
  z
    .string()
    .min(1, ValidationMessages.required)
    .regex(ifscRegex, ValidationMessages.invalidIfsc);

export const passwordValidation = () =>
  z
    .string()
    .min(8, ValidationMessages.passwordTooShort)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      ValidationMessages.passwordWeak,
    );

export const dateValidation = () =>
  z
    .string()
    .min(1, ValidationMessages.required)
    .refine(
      (date) => {
        const inputDate = new Date(date);
        const now = new Date();
        const tenYearsAgo = new Date(
          now.getFullYear() - 10,
          now.getMonth(),
          now.getDate(),
        );
        return inputDate >= tenYearsAgo && inputDate <= now;
      },
      {
        message: "Date must be within the last 10 years and not in the future",
      },
    );

export const amountValidation = () =>
  z
    .number()
    .min(0.01, ValidationMessages.amountTooLow)
    .max(100000000, ValidationMessages.amountTooHigh);

// File validation schema
export const fileValidation = (
  allowedTypes: string[] = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES],
  maxSize: number = MAX_FILE_SIZE,
) =>
  z
    .any()
    .refine((file) => file instanceof File, "Please select a file")
    .refine((file) => file.size <= maxSize, ValidationMessages.fileTooBig)
    .refine(
      (file) => allowedTypes.includes(file.type),
      `Allowed file types: ${allowedTypes.join(", ")}`,
    );

// Authentication schemas
export const loginSchema = z.object({
  email: emailValidation(),
  password: requiredString("Password is required"),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    fullName: requiredString("Full name is required")
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name cannot exceed 50 characters"),
    email: emailValidation(),
    phone: phoneValidation(),
    password: passwordValidation(),
    confirmPassword: requiredString("Please confirm your password"),
    dateOfBirth: dateValidation(),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions",
      ),
    acceptPrivacy: z
      .boolean()
      .refine((val) => val === true, "You must accept the privacy policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailValidation(),
});

export const resetPasswordSchema = z
  .object({
    password: passwordValidation(),
    confirmPassword: requiredString("Please confirm your password"),
    token: requiredString("Reset token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile management schemas
export const profileUpdateSchema = z.object({
  fullName: requiredString("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  phone: phoneValidation(),
  dateOfBirth: dateValidation(),
  address: z.object({
    street: requiredString("Street address is required"),
    city: requiredString("City is required"),
    state: requiredString("State is required"),
    pinCode: pinCodeValidation(),
    country: requiredString("Country is required").default("India"),
  }),
  identityDocuments: z
    .object({
      aadhaar: aadhaarValidation().optional(),
      pan: panValidation().optional(),
    })
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: requiredString("Current password is required"),
    newPassword: passwordValidation(),
    confirmNewPassword: requiredString("Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

// Fraud report schemas
export const fraudReportSchema = z.object({
  // Basic information
  title: requiredString("Report title is required")
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: requiredString("Description is required")
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description cannot exceed 5000 characters"),

  category: requiredString("Please select a fraud category"),

  incidentDate: dateValidation(),

  // Financial details
  amountInvolved: z
    .number()
    .min(0, "Amount cannot be negative")
    .max(100000000, "Amount cannot exceed ₹10,00,00,000")
    .optional(),

  // Contact information of fraudster
  suspiciousContacts: z
    .object({
      phone: z.array(phoneValidation()).optional(),
      email: z.array(emailValidation()).optional(),
      website: z.array(z.string().url("Please enter a valid URL")).optional(),
      socialMedia: z.array(z.string()).optional(),
    })
    .optional(),

  // Location details
  location: z.object({
    state: requiredString("State is required"),
    city: requiredString("City is required"),
    pinCode: pinCodeValidation().optional(),
  }),

  // Evidence files
  evidence: z.array(fileValidation()).optional(),

  // Additional details
  additionalInfo: optionalString(),

  // Consent and verification
  consentToShare: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must consent to share information with authorities",
    ),
  verifyTruthfulness: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must verify the truthfulness of the information",
    ),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: optionalString(),
  category: optionalString(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  amountFrom: z.number().min(0).optional(),
  amountTo: z.number().min(0).optional(),
  status: optionalString(),
  location: optionalString(),
});

// User management schemas (for admin)
export const userCreateSchema = z.object({
  fullName: requiredString("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  email: emailValidation(),
  phone: phoneValidation(),
  role: requiredString("Role is required"),
  department: optionalString(),
  employeeId: optionalString(),
  temporaryPassword: passwordValidation(),
});

export const userUpdateSchema = z.object({
  fullName: requiredString("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),
  phone: phoneValidation(),
  role: requiredString("Role is required"),
  department: optionalString(),
  employeeId: optionalString(),
  isActive: z.boolean(),
});

export const bulkUserActionSchema = z.object({
  userIds: z.array(z.string()).min(1, "Please select at least one user"),
  action: requiredString("Please select an action"),
  reason: optionalString(),
  newRole: optionalString(),
});

// Support ticket schema
export const supportTicketSchema = z.object({
  title: requiredString("Ticket title is required")
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title cannot exceed 200 characters"),
  description: requiredString("Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  category: requiredString("Please select a category"),
  priority: requiredString("Please select priority level"),
  attachments: z.array(fileValidation()).optional(),
});

// Feedback schema
export const feedbackSchema = z.object({
  rating: z
    .number()
    .min(1, "Please provide a rating")
    .max(5, "Rating cannot exceed 5"),
  category: requiredString("Please select a feedback category"),
  title: requiredString("Feedback title is required")
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  message: requiredString("Feedback message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
  suggestions: optionalString(),
});

// Contact form schema
export const contactSchema = z.object({
  name: requiredString("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: emailValidation(),
  phone: phoneValidation().optional(),
  subject: requiredString("Subject is required")
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject cannot exceed 100 characters"),
  message: requiredString("Message is required")
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  category: requiredString("Please select a category"),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailValidation(),
  preferences: z
    .object({
      fraudAlerts: z.boolean().default(true),
      educationalContent: z.boolean().default(true),
      systemUpdates: z.boolean().default(false),
      communityNews: z.boolean().default(false),
    })
    .optional(),
});

// Export type inferences for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type FraudReportFormData = z.infer<typeof fraudReportSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type BulkUserActionFormData = z.infer<typeof bulkUserActionSchema>;
export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Form validation utility functions
export const validateField = (schema: z.ZodType, value: any) => {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Validation error";
  }
};

export const validateForm = (schema: z.ZodType, data: any) => {
  try {
    return { success: true, data: schema.parse(data), errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path.join(".")] = err.message;
        }
      });
      return { success: false, data: null, errors: fieldErrors };
    }
    return {
      success: false,
      data: null,
      errors: { general: "Validation failed" },
    };
  }
};

// Form field validation states
export const getFieldValidationState = (
  errors: Record<string, string>,
  fieldName: string,
) => {
  const error = errors[fieldName];
  return {
    hasError: !!error,
    errorMessage: error || "",
    isValid: !error,
  };
};
