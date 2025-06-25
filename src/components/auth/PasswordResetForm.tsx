/**
 * Password Reset Form Component
 * Provides secure password reset functionality with validation and user feedback
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Shield,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/EnhancedAuthContext";

interface PasswordResetFormProps {
  onSwitchToLogin?: () => void;
  onClose?: () => void;
  className?: string;
}

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSwitchToLogin,
  onClose,
  className = "",
}) => {
  const { resetPassword, loading } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Cooldown timer effect
  React.useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || cooldownTime > 0) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await resetPassword(formData.email.trim());

      if (response.success) {
        setIsSubmitted(true);
        // Set cooldown to prevent spam
        setCooldownTime(60); // 60 seconds cooldown
      } else {
        setErrors({
          general: response.error || "Failed to send reset email",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear general errors when user makes changes
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleResend = () => {
    if (cooldownTime === 0) {
      setIsSubmitted(false);
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const canSubmit =
    !isSubmitting && !loading && formData.email && cooldownTime === 0;

  // Success state
  if (isSubmitted) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600 dark:text-green-400 h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            We've sent password reset instructions to your email address
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <Mail className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="space-y-2">
                <p className="font-medium">Reset link sent to:</p>
                <p className="text-sm break-all">{formData.email}</p>
              </div>
            </AlertDescription>
          </Alert>

          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>If you don't see the email, please check your spam folder.</p>
            <p>The reset link will expire in 24 hours for security.</p>
          </div>

          {cooldownTime > 0 ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Resend available in {cooldownTime}s</span>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Email
                </>
              )}
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Separator />

          <Button
            variant="ghost"
            className="w-full"
            onClick={
              onSwitchToLogin || (() => (window.location.href = "/login"))
            }
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Reset form state
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="space-y-1 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-blue-600 dark:text-blue-400 h-8 w-8" />
        </div>
        <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
          Reset Password
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a reset link
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* General Error */}
        {errors.general && (
          <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="your.email@example.com"
                disabled={isSubmitting || loading}
                autoComplete="email"
                required
                autoFocus
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending reset link...
              </>
            ) : cooldownTime > 0 ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Wait {cooldownTime}s
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>

        {/* Help Text */}
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Remember your password?</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <Separator />

        <Button
          variant="ghost"
          className="w-full"
          onClick={onSwitchToLogin || (() => (window.location.href = "/login"))}
          disabled={isSubmitting || loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-3 w-3" />
            <span>Secure password recovery</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PasswordResetForm;
