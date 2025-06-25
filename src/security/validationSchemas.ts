/**
 * Input Validation Schemas
 * Comprehensive Zod schemas for validating all user inputs with security considerations
 */

import { z } from "zod";

// Common validation patterns
const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  SAFE_TEXT: /^[a-zA-Z0-9\s\.,!?\-_@#$%&*()+='"`:;]+$/,
  INDIAN_PHONE: /^(\+91|91)?[6-9]\d{9}$/,
  INDIAN_PINCODE: /^[1-9][0-9]{5}$/,
  AADHAAR: /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
};

// Security constraints
const SECURITY_LIMITS = {
  MAX_TEXT_LENGTH: 1000,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_URL_LENGTH: 2048,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ],
};

// Custom Zod transformations
const sanitizeString = (value: string) => {
  if (typeof value !== "string") return value;

  // Remove null bytes and control characters
  return value
    .replace(/\0/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
};

const sanitizeHTML = (value: string) => {
  if (typeof value !== "string") return value;

  // Basic HTML entity encoding for dangerous characters
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Base schemas with security transformations
export const BaseSchemas = {
  // Safe text input (alphanumeric + common punctuation)
  safeText: z
    .string()
    .transform(sanitizeString)
    .refine((val) => VALIDATION_PATTERNS.SAFE_TEXT.test(val), {
      message: "Contains invalid characters",
    })
    .refine((val) => val.length <= SECURITY_LIMITS.MAX_TEXT_LENGTH, {
      message: `Text too long (max ${SECURITY_LIMITS.MAX_TEXT_LENGTH} characters)`,
    }),

  // HTML content (will be sanitized)
  htmlContent: z
    .string()
    .transform(sanitizeString)
    .refine((val) => val.length <= SECURITY_LIMITS.MAX_DESCRIPTION_LENGTH, {
      message: `Content too long (max ${SECURITY_LIMITS.MAX_DESCRIPTION_LENGTH} characters)`,
    }),

  // Plain text only
  plainText: z
    .string()
    .transform(sanitizeHTML)
    .refine((val) => val.length <= SECURITY_LIMITS.MAX_TEXT_LENGTH, {
      message: `Text too long (max ${SECURITY_LIMITS.MAX_TEXT_LENGTH} characters)`,
    }),

  // Email with comprehensive validation
  email: z
    .string()
    .transform(sanitizeString)
    .email("Invalid email format")
    .refine((val) => val.length <= SECURITY_LIMITS.MAX_EMAIL_LENGTH, {
      message: "Email too long",
    })
    .refine((val) => VALIDATION_PATTERNS.EMAIL.test(val), {
      message: "Invalid email format",
    }),

  // Phone number
  phone: z
    .string()
    .transform(sanitizeString)
    .refine((val) => VALIDATION_PATTERNS.PHONE.test(val), {
      message: "Invalid phone number format",
    }),

  // Indian phone number
  indianPhone: z
    .string()
    .transform(sanitizeString)
    .refine((val) => VALIDATION_PATTERNS.INDIAN_PHONE.test(val), {
      message: "Invalid Indian phone number",
    }),

  // URL validation
  url: z
    .string()
    .transform(sanitizeString)
    .refine((val) => val.length <= SECURITY_LIMITS.MAX_URL_LENGTH, {
      message: "URL too long",
    })
    .refine((val) => VALIDATION_PATTERNS.URL.test(val), {
      message: "Invalid URL format",
    })
    .refine((val) => val.startsWith("https://"), {
      message: "Only HTTPS URLs are allowed",
    }),

  // Password with security requirements
  password: z
    .string()
    .min(
      SECURITY_LIMITS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${SECURITY_LIMITS.MIN_PASSWORD_LENGTH} characters`,
    )
    .max(
      SECURITY_LIMITS.MAX_PASSWORD_LENGTH,
      `Password too long (max ${SECURITY_LIMITS.MAX_PASSWORD_LENGTH} characters)`,
    )
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
      message: "Password must contain at least one special character",
    }),

  // UUID validation
  uuid: z
    .string()
    .transform(sanitizeString)
    .refine((val) => VALIDATION_PATTERNS.UUID.test(val), {
      message: "Invalid UUID format",
    }),

  // Indian-specific validations
  aadhaar: z
    .string()
    .transform(sanitizeString)
    .refine((val) => VALIDATION_PATTERNS.AADHAAR.test(val), {
      message: "Invalid Aadhaar number format",
    }),

  pan: z
    .string()
    .transform(sanitizeString)
    .toUpperCase()
    .refine((val) => VALIDATION_PATTERNS.PAN.test(val), {
      message: "Invalid PAN format",
    }),

  pincode: z
    .string()
    .transform(sanitizeString)
    .refine((val) => VALIDATION_PATTERNS.INDIAN_PINCODE.test(val), {
      message: "Invalid pincode format",
    }),
};

// User authentication schemas
export const AuthSchemas = {
  login: z.object({
    email: BaseSchemas.email,
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional().default(false),
    csrfToken: z.string().optional(),
  }),

  signup: z
    .object({
      fullName: BaseSchemas.safeText.min(
        2,
        "Name must be at least 2 characters",
      ),
      email: BaseSchemas.email,
      password: BaseSchemas.password,
      confirmPassword: z.string(),
      phone: BaseSchemas.indianPhone.optional(),
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
      acceptPrivacy: z.boolean().refine((val) => val === true, {
        message: "You must accept the privacy policy",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  passwordReset: z.object({
    email: BaseSchemas.email,
  }),

  passwordChange: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: BaseSchemas.password,
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
};

// Fraud report schemas
export const FraudReportSchemas = {
  basicReport: z.object({
    type: z.enum(["financial", "cyber", "identity", "other"]),
    category: z.enum([
      "phishing",
      "fraud_call",
      "fake_website",
      "unauthorized_transaction",
      "other",
    ]),
    title: BaseSchemas.safeText.min(5, "Title must be at least 5 characters"),
    description: BaseSchemas.htmlContent.min(
      20,
      "Description must be at least 20 characters",
    ),
    amount: z.number().min(0).max(10000000).optional(),
    currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
    incidentDate: z.string().datetime().optional(),
    location: BaseSchemas.safeText.optional(),
    isAnonymous: z.boolean().default(false),
  }),

  contactInfo: z.object({
    suspiciousNumber: BaseSchemas.indianPhone.optional(),
    suspiciousEmail: BaseSchemas.email.optional(),
    suspiciousWebsite: BaseSchemas.url.optional(),
    bankName: BaseSchemas.safeText.optional(),
    accountNumber: z
      .string()
      .transform(sanitizeString)
      .refine((val) => /^[0-9]{8,18}$/.test(val), {
        message: "Invalid account number format",
      })
      .optional(),
    transactionId: BaseSchemas.safeText.optional(),
  }),

  evidence: z.object({
    files: z
      .array(
        z.object({
          name: z.string().max(255),
          size: z.number().max(SECURITY_LIMITS.MAX_FILE_SIZE),
          type: z
            .string()
            .refine((val) => SECURITY_LIMITS.ALLOWED_FILE_TYPES.includes(val), {
              message: "File type not allowed",
            }),
        }),
      )
      .max(5, "Maximum 5 files allowed"),
    screenshots: z.array(z.string()).max(3, "Maximum 3 screenshots allowed"),
    additionalEvidence: BaseSchemas.htmlContent.optional(),
  }),
};

// User profile schemas
export const ProfileSchemas = {
  personalInfo: z.object({
    fullName: BaseSchemas.safeText.min(2, "Name must be at least 2 characters"),
    email: BaseSchemas.email,
    phone: BaseSchemas.indianPhone.optional(),
    dateOfBirth: z.string().datetime().optional(),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  }),

  address: z.object({
    street: BaseSchemas.safeText.optional(),
    city: BaseSchemas.safeText.optional(),
    state: BaseSchemas.safeText.optional(),
    pincode: BaseSchemas.pincode.optional(),
    country: z.enum(["IN"]).default("IN"),
  }),

  preferences: z.object({
    language: z.enum(["en", "hi", "ta", "te", "bn", "mr", "gu"]).default("en"),
    notifications: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(false),
      push: z.boolean().default(true),
    }),
    privacy: z.object({
      showProfile: z.boolean().default(false),
      allowContact: z.boolean().default(false),
    }),
  }),
};

// Search and filter schemas
export const SearchSchemas = {
  searchQuery: z.object({
    query: BaseSchemas.safeText.min(1, "Search query is required"),
    filters: z
      .object({
        type: z
          .array(z.enum(["financial", "cyber", "identity", "other"]))
          .optional(),
        dateRange: z
          .object({
            start: z.string().datetime().optional(),
            end: z.string().datetime().optional(),
          })
          .optional(),
        location: BaseSchemas.safeText.optional(),
        status: z
          .array(z.enum(["pending", "investigating", "resolved", "closed"]))
          .optional(),
      })
      .optional(),
    sort: z.enum(["date", "relevance", "amount"]).default("date"),
    order: z.enum(["asc", "desc"]).default("desc"),
    page: z.number().min(1).max(1000).default(1),
    limit: z.number().min(1).max(100).default(20),
  }),

  advancedSearch: z.object({
    keywords: z
      .array(BaseSchemas.safeText)
      .max(10, "Maximum 10 keywords allowed"),
    phoneNumber: BaseSchemas.indianPhone.optional(),
    email: BaseSchemas.email.optional(),
    website: BaseSchemas.url.optional(),
    amountRange: z
      .object({
        min: z.number().min(0).optional(),
        max: z.number().max(10000000).optional(),
      })
      .optional(),
    dateRange: z
      .object({
        start: z.string().datetime(),
        end: z.string().datetime(),
      })
      .refine((data) => new Date(data.start) <= new Date(data.end), {
        message: "Start date must be before end date",
      }),
  }),
};

// File upload schema
export const FileUploadSchema = z.object({
  files: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "File name is required")
          .max(255, "File name too long")
          .refine((val) => !/[<>:"/\\|?*]/.test(val), {
            message: "File name contains invalid characters",
          }),
        size: z
          .number()
          .min(1, "File cannot be empty")
          .max(
            SECURITY_LIMITS.MAX_FILE_SIZE,
            `File too large (max ${SECURITY_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB)`,
          ),
        type: z
          .string()
          .refine((val) => SECURITY_LIMITS.ALLOWED_FILE_TYPES.includes(val), {
            message: "File type not allowed",
          }),
        lastModified: z.number().optional(),
      }),
    )
    .min(1, "At least one file is required")
    .max(5, "Maximum 5 files allowed"),
  category: z.enum(["evidence", "document", "screenshot"]),
  description: BaseSchemas.safeText.optional(),
});

// API request schemas
export const APISchemas = {
  pagination: z.object({
    page: z.number().min(1).max(1000).default(1),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).optional(),
  }),

  sorting: z.object({
    field: z.string().min(1, "Sort field is required"),
    order: z.enum(["asc", "desc"]).default("asc"),
  }),

  filtering: z.object({
    field: z.string().min(1, "Filter field is required"),
    operator: z.enum(["eq", "ne", "gt", "gte", "lt", "lte", "like", "in"]),
    value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
  }),
};

// Validation utilities
export const ValidationUtils = {
  /**
   * Validate data against schema with detailed error handling
   */
  validate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
  ): {
    success: boolean;
    data?: T;
    errors?: Record<string, string[]>;
  } {
    try {
      const result = schema.safeParse(data);

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errors: Record<string, string[]> = {};

        result.error.errors.forEach((error) => {
          const path = error.path.join(".");
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(error.message);
        });

        return { success: false, errors };
      }
    } catch (error) {
      console.error("Validation error:", error);
      return {
        success: false,
        errors: { _general: ["Validation failed due to an unexpected error"] },
      };
    }
  },

  /**
   * Create error message from validation errors
   */
  formatErrors(errors: Record<string, string[]>): string {
    const messages = Object.entries(errors)
      .map(([field, fieldErrors]) => `${field}: ${fieldErrors.join(", ")}`)
      .join("; ");

    return messages;
  },

  /**
   * Check if value matches pattern
   */
  matchesPattern(
    value: string,
    pattern: keyof typeof VALIDATION_PATTERNS,
  ): boolean {
    return VALIDATION_PATTERNS[pattern].test(value);
  },

  /**
   * Sanitize object recursively
   */
  sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === "string") {
      return sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (typeof obj === "object") {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[sanitizeString(key)] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  },
};

// Export all schemas and utilities
export { VALIDATION_PATTERNS, SECURITY_LIMITS, sanitizeString, sanitizeHTML };
