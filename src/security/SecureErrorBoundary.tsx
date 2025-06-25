/**
 * Secure Error Boundary Component
 * Prevents sensitive information leakage in error messages and provides secure error handling
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

// Error types for classification
enum ErrorType {
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  NETWORK = "network",
  VALIDATION = "validation",
  UNEXPECTED = "unexpected",
  SECURITY = "security",
}

interface ErrorInfo {
  type: ErrorType;
  code: string;
  userMessage: string;
  isRecoverable: boolean;
  shouldReport: boolean;
}

interface SecureErrorBoundaryState {
  hasError: boolean;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

interface SecureErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
}

// Sensitive patterns to remove from error messages
const SENSITIVE_PATTERNS = [
  // API keys and tokens
  /[a-zA-Z0-9]{32,}/g,
  /sk_[a-zA-Z0-9]+/g,
  /pk_[a-zA-Z0-9]+/g,

  // Database connection strings
  /mongodb:\/\/[^@]+@[^/]+/g,
  /postgres:\/\/[^@]+@[^/]+/g,
  /mysql:\/\/[^@]+@[^/]+/g,

  // File paths
  /[a-zA-Z]:[\\\/][^\\\/\s]+/g,
  /\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.\/]+/g,

  // Email addresses in error messages
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

  // Phone numbers
  /\+?[\d\s\-\(\)]{10,}/g,

  // Stack trace file paths
  /at\s+[^\s]+\s+\([^)]+\)/g,

  // Environment variables
  /process\.env\.[A-Z_]+/g,
];

// Error classification rules
const ERROR_CLASSIFICATION = {
  // Authentication errors
  Unauthorized: {
    type: ErrorType.AUTHENTICATION,
    code: "AUTH_001",
    userMessage: "Please log in to continue",
    isRecoverable: true,
    shouldReport: false,
  },
  "Invalid token": {
    type: ErrorType.AUTHENTICATION,
    code: "AUTH_002",
    userMessage: "Your session has expired. Please log in again",
    isRecoverable: true,
    shouldReport: false,
  },
  "Session expired": {
    type: ErrorType.AUTHENTICATION,
    code: "AUTH_003",
    userMessage: "Your session has expired. Please log in again",
    isRecoverable: true,
    shouldReport: false,
  },

  // Authorization errors
  Forbidden: {
    type: ErrorType.AUTHORIZATION,
    code: "AUTHZ_001",
    userMessage: "You do not have permission to access this resource",
    isRecoverable: false,
    shouldReport: false,
  },
  "Access denied": {
    type: ErrorType.AUTHORIZATION,
    code: "AUTHZ_002",
    userMessage: "Access denied",
    isRecoverable: false,
    shouldReport: false,
  },

  // Network errors
  "Network error": {
    type: ErrorType.NETWORK,
    code: "NET_001",
    userMessage:
      "Unable to connect to the server. Please check your internet connection",
    isRecoverable: true,
    shouldReport: false,
  },
  "Failed to fetch": {
    type: ErrorType.NETWORK,
    code: "NET_002",
    userMessage: "Network request failed. Please try again",
    isRecoverable: true,
    shouldReport: false,
  },
  Timeout: {
    type: ErrorType.NETWORK,
    code: "NET_003",
    userMessage: "Request timed out. Please try again",
    isRecoverable: true,
    shouldReport: false,
  },

  // Validation errors
  "Validation failed": {
    type: ErrorType.VALIDATION,
    code: "VAL_001",
    userMessage: "Please check your input and try again",
    isRecoverable: true,
    shouldReport: false,
  },
  "Invalid input": {
    type: ErrorType.VALIDATION,
    code: "VAL_002",
    userMessage: "Invalid input provided",
    isRecoverable: true,
    shouldReport: false,
  },

  // Security errors
  "CSRF token mismatch": {
    type: ErrorType.SECURITY,
    code: "SEC_001",
    userMessage: "Security validation failed. Please refresh the page",
    isRecoverable: true,
    shouldReport: true,
  },
  "XSS detected": {
    type: ErrorType.SECURITY,
    code: "SEC_002",
    userMessage: "Potentially malicious content detected",
    isRecoverable: false,
    shouldReport: true,
  },
  "Rate limit exceeded": {
    type: ErrorType.SECURITY,
    code: "SEC_003",
    userMessage: "Too many requests. Please try again later",
    isRecoverable: true,
    shouldReport: true,
  },
};

class SecureErrorBoundary extends Component<
  SecureErrorBoundaryProps,
  SecureErrorBoundaryState
> {
  private maxRetries: number;

  constructor(props: SecureErrorBoundaryProps) {
    super(props);

    this.maxRetries = props.maxRetries || 3;

    this.state = {
      hasError: false,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<SecureErrorBoundaryState> {
    const errorInfo = SecureErrorBoundary.classifyError(error);
    const errorId = SecureErrorBoundary.generateErrorId();

    return {
      hasError: true,
      errorInfo,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Sanitize error information before logging
    const sanitizedError = this.sanitizeError(error);
    const sanitizedErrorInfo = this.sanitizeErrorInfo(errorInfo);

    // Log sanitized error for debugging (development only)
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by SecureErrorBoundary:", {
        error: sanitizedError,
        errorInfo: sanitizedErrorInfo,
        errorId: this.state.errorId,
      });
    }

    // Report error if necessary
    if (this.state.errorInfo?.shouldReport) {
      this.reportError(sanitizedError, sanitizedErrorInfo);
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(sanitizedError, sanitizedErrorInfo);
    }

    // Track error for analytics (without sensitive data)
    this.trackError(this.state.errorInfo?.type || ErrorType.UNEXPECTED);
  }

  /**
   * Classify error based on message and type
   */
  static classifyError(error: Error): ErrorInfo {
    const message = error.message.toLowerCase();

    // Check for known error patterns
    for (const [pattern, info] of Object.entries(ERROR_CLASSIFICATION)) {
      if (message.includes(pattern.toLowerCase())) {
        return info;
      }
    }

    // Check for security-related errors
    if (
      message.includes("script") ||
      message.includes("xss") ||
      message.includes("injection")
    ) {
      return {
        type: ErrorType.SECURITY,
        code: "SEC_999",
        userMessage: "A security issue was detected. Please contact support",
        isRecoverable: false,
        shouldReport: true,
      };
    }

    // Default to unexpected error
    return {
      type: ErrorType.UNEXPECTED,
      code: "UNK_001",
      userMessage: "An unexpected error occurred. Please try again",
      isRecoverable: true,
      shouldReport: true,
    };
  }

  /**
   * Generate unique error ID for tracking
   */
  static generateErrorId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `ERR_${timestamp}_${random}`;
  }

  /**
   * Sanitize error object to remove sensitive information
   */
  private sanitizeError(error: Error): Error {
    const sanitizedMessage = this.sanitizeString(error.message);
    const sanitizedStack = error.stack
      ? this.sanitizeString(error.stack)
      : undefined;

    return {
      ...error,
      message: sanitizedMessage,
      stack: sanitizedStack,
    };
  }

  /**
   * Sanitize error info to remove sensitive information
   */
  private sanitizeErrorInfo(errorInfo: React.ErrorInfo): React.ErrorInfo {
    return {
      ...errorInfo,
      componentStack: this.sanitizeString(errorInfo.componentStack),
    };
  }

  /**
   * Remove sensitive patterns from strings
   */
  private sanitizeString(str: string): string {
    let sanitized = str;

    SENSITIVE_PATTERNS.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, "[REDACTED]");
    });

    return sanitized;
  }

  /**
   * Report error to monitoring service
   */
  private reportError(error: Error, errorInfo: React.ErrorInfo): void {
    try {
      const errorReport = {
        errorId: this.state.errorId,
        type: this.state.errorInfo?.type,
        code: this.state.errorInfo?.code,
        message: error.message,
        stack: error.stack?.split("\n").slice(0, 5).join("\n"), // Only first 5 lines
        componentStack: errorInfo.componentStack
          ?.split("\n")
          .slice(0, 3)
          .join("\n"), // Only first 3 lines
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getCurrentUserId(),
      };

      // Send to error reporting service
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/errors/report", JSON.stringify(errorReport));
      } else {
        fetch("/api/errors/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorReport),
        }).catch((err) => {
          console.error("Failed to report error:", err);
        });
      }
    } catch (reportingError) {
      console.error("Error reporting failed:", reportingError);
    }
  }

  /**
   * Track error for analytics
   */
  private trackError(errorType: ErrorType): void {
    try {
      if (window.gtag) {
        window.gtag("event", "error_boundary_triggered", {
          event_category: "error",
          event_label: errorType,
          error_id: this.state.errorId,
          non_interaction: true,
        });
      }
    } catch (error) {
      console.error("Error tracking failed:", error);
    }
  }

  /**
   * Get current user ID (without exposing sensitive data)
   */
  private getCurrentUserId(): string | null {
    try {
      // Get user ID from session storage or context (hashed/anonymized)
      const userSession = sessionStorage.getItem("user_session");
      if (userSession) {
        const session = JSON.parse(userSession);
        return session.userId ? btoa(session.userId).substring(0, 8) : null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Handle retry action
   */
  private handleRetry = (): void => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        errorInfo: null,
        errorId: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  /**
   * Handle navigation to home
   */
  private handleGoHome = (): void => {
    window.location.href = "/";
  };

  /**
   * Handle report bug action
   */
  private handleReportBug = (): void => {
    if (this.state.errorId) {
      const bugReportUrl = `/help?error_id=${this.state.errorId}&type=bug_report`;
      window.open(bugReportUrl, "_blank");
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { errorInfo, errorId, retryCount } = this.state;
      const canRetry = errorInfo?.isRecoverable && retryCount < this.maxRetries;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Something went wrong
              </CardTitle>
              <CardDescription>
                {errorInfo?.userMessage || "An unexpected error occurred"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error details for development */}
              {this.props.showErrorDetails &&
                process.env.NODE_ENV === "development" && (
                  <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                    <Bug className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                      <div className="space-y-1 text-xs">
                        <p>
                          <strong>Error ID:</strong> {errorId}
                        </p>
                        <p>
                          <strong>Type:</strong> {errorInfo?.type}
                        </p>
                        <p>
                          <strong>Code:</strong> {errorInfo?.code}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

              {/* Retry information */}
              {retryCount > 0 && (
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Retry attempt {retryCount} of {this.maxRetries}
                  </AlertDescription>
                </Alert>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                {canRetry && (
                  <Button onClick={this.handleRetry} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className={canRetry ? "flex-1" : "w-full"}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Report bug button */}
              {errorId && (
                <Button
                  variant="ghost"
                  onClick={this.handleReportBug}
                  className="w-full text-sm"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report this issue
                </Button>
              )}

              {/* Support information */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                <p>If this problem persists, please contact support</p>
                {errorId && <p className="mt-1">Error ID: {errorId}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SecureErrorBoundary;

// Export error types for use in other components
export { ErrorType };
export type { ErrorInfo as SecureErrorInfo };
