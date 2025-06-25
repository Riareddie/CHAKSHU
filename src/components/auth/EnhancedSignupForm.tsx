/**
 * Enhanced Signup Form Component
 * Provides secure registration with password strength validation, terms acceptance,
 * and comprehensive error handling
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Shield,
  FileText,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { validatePassword } from "@/services/auth";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
  onClose?: () => void;
  className?: string;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

interface PasswordValidation {
  isValid: boolean;
  score: number;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChar: boolean;
  };
  strength: string;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToLogin,
  onClose,
  className = "",
}) => {
  const { signup, loading } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation | null>(null);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // Validate password in real-time
  useEffect(() => {
    if (formData.password) {
      const validation = validatePassword(formData.password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [formData.password]);

  // Check email availability (debounced)
  useEffect(() => {
    if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      const timeoutId = setTimeout(async () => {
        setIsEmailChecking(true);
        try {
          // Simulate email availability check
          // In real implementation, this would call an API
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setEmailAvailable(true); // Assume available for demo
        } catch (error) {
          setEmailAvailable(false);
        } finally {
          setIsEmailChecking(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setEmailAvailable(null);
    }
  }, [formData.email]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else if (emailAvailable === false) {
      newErrors.email = "This email is already registered";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation?.isValid) {
      newErrors.password = "Password does not meet security requirements";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      newErrors.terms =
        "You must accept the terms and privacy policy to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await signup(
        formData.email.trim(),
        formData.password,
        formData.fullName.trim(),
        formData.acceptTerms,
      );

      if (response.success) {
        // Clear form and close modal on success
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          acceptTerms: false,
          acceptPrivacy: false,
        });

        if (onClose) {
          onClose();
        }
      } else {
        setErrors({
          general: response.error || "Registration failed",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
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

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case "very-strong":
        return "bg-green-500";
      case "strong":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "weak":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthProgress = (score: number) => {
    return (score / 5) * 100;
  };

  const canSubmit =
    !isSubmitting &&
    !loading &&
    formData.fullName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.acceptTerms &&
    formData.acceptPrivacy &&
    passwordValidation?.isValid &&
    emailAvailable !== false;

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="space-y-1 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-white h-8 w-8" />
        </div>
        <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
          Create Account
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Join the government fraud reporting portal
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
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`pl-10 ${errors.fullName ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="John Doe"
                disabled={isSubmitting || loading}
                autoComplete="name"
                required
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

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
                className={`pl-10 pr-10 ${errors.email ? "border-red-500 focus:border-red-500" : emailAvailable ? "border-green-500 focus:border-green-500" : ""}`}
                placeholder="john.doe@example.com"
                disabled={isSubmitting || loading}
                autoComplete="email"
                required
              />
              <div className="absolute right-3 top-3">
                {isEmailChecking ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                ) : emailAvailable === true ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : emailAvailable === false ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : null}
              </div>
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
            {emailAvailable === true && !errors.email && (
              <p className="text-sm text-green-600 mt-1">Email is available</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
                placeholder="Create a strong password"
                disabled={isSubmitting || loading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={isSubmitting || loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordValidation && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Password strength:
                  </span>
                  <span
                    className={`font-medium ${
                      passwordValidation.strength === "very-strong"
                        ? "text-green-600"
                        : passwordValidation.strength === "strong"
                          ? "text-blue-600"
                          : passwordValidation.strength === "medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                    }`}
                  >
                    {passwordValidation.strength.replace("-", " ")}
                  </span>
                </div>
                <Progress
                  value={getPasswordStrengthProgress(passwordValidation.score)}
                  className="h-2"
                />

                {/* Password Requirements */}
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.requirements.minLength ? "text-green-600" : "text-gray-400"}`}
                  >
                    {passwordValidation.requirements.minLength ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span>8+ characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.requirements.hasUpperCase ? "text-green-600" : "text-gray-400"}`}
                  >
                    {passwordValidation.requirements.hasUpperCase ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span>Uppercase</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.requirements.hasLowerCase ? "text-green-600" : "text-gray-400"}`}
                  >
                    {passwordValidation.requirements.hasLowerCase ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span>Lowercase</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.requirements.hasNumbers ? "text-green-600" : "text-gray-400"}`}
                  >
                    {passwordValidation.requirements.hasNumbers ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span>Numbers</span>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${passwordValidation.requirements.hasSpecialChar ? "text-green-600" : "text-gray-400"}`}
                  >
                    {passwordValidation.requirements.hasSpecialChar ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span>Special char</span>
                  </div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : formData.confirmPassword && formData.password === formData.confirmPassword ? "border-green-500 focus:border-green-500" : ""}`}
                placeholder="Confirm your password"
                disabled={isSubmitting || loading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={isSubmitting || loading}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword &&
              formData.password === formData.confirmPassword &&
              !errors.confirmPassword && (
                <p className="text-sm text-green-600 mt-1">Passwords match</p>
              )}
          </div>

          {/* Terms and Privacy */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("acceptTerms", Boolean(checked))
                }
                disabled={isSubmitting || loading}
                className="mt-1"
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Terms of Service
                </a>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptPrivacy"
                checked={formData.acceptPrivacy}
                onCheckedChange={(checked) =>
                  handleInputChange("acceptPrivacy", Boolean(checked))
                }
                disabled={isSubmitting || loading}
                className="mt-1"
              />
              <Label
                htmlFor="acceptPrivacy"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed"
              >
                I acknowledge the{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Privacy Policy
                </a>
              </Label>
            </div>

            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms}</p>
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
                Creating account...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <Separator />

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={
              onSwitchToLogin || (() => (window.location.href = "/login"))
            }
            className="text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
            disabled={isSubmitting || loading}
          >
            Sign in
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-3 w-3" />
            <span>Government-grade security</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
