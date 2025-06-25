/**
 * Enhanced Login Form Component
 * Provides secure login with validation, error handling, and improved UX
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Shield,
  Timer,
} from "lucide-react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { toast } from "@/hooks/use-toast";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onSwitchToReset?: () => void;
  onClose?: () => void;
  redirectAfterLogin?: boolean;
  className?: string;
}

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignup,
  onSwitchToReset,
  onClose,
  redirectAfterLogin = true,
  className = "",
}) => {
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [lockoutCountdown, setLockoutCountdown] = useState(0);

  // Handle lockout countdown
  useEffect(() => {
    if (lockoutTime && lockoutTime > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
        if (remaining > 0) {
          setLockoutCountdown(remaining);
        } else {
          setLockoutTime(null);
          setLockoutCountdown(0);
          setLoginAttempts(0);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  // Handle redirect after successful login
  useEffect(() => {
    if (redirectAfterLogin) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectPath;
      }
    }
  }, [redirectAfterLogin]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if account is locked out
    if (lockoutTime && lockoutTime > Date.now()) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await login(
        formData.email.trim(),
        formData.password,
        formData.rememberMe,
      );

      if (response.success) {
        // Clear form and close modal on success
        setFormData({ email: "", password: "", rememberMe: false });
        setLoginAttempts(0);
        setLockoutTime(null);

        if (onClose) {
          onClose();
        }
      } else {
        // Handle different error types
        if (response.requiresTwoFactor) {
          // Handle 2FA requirement
          setErrors({ general: "Two-factor authentication required" });
        } else if (response.lockoutTime) {
          setLockoutTime(response.lockoutTime);
          setLoginAttempts(5); // Max attempts reached
          setErrors({
            general: `Account locked due to too many failed attempts. Try again in ${Math.ceil((response.lockoutTime - Date.now()) / 60000)} minutes.`,
          });
        } else {
          setLoginAttempts((prev) => prev + 1);
          setErrors({
            general: response.error || "Invalid email or password",
          });

          // Show progressive warnings
          if (loginAttempts >= 2 && loginAttempts < 4) {
            toast({
              title: "Warning",
              description: `${5 - loginAttempts - 1} attempts remaining before account lockout.`,
              variant: "destructive",
            });
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
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

  const handleForgotPassword = () => {
    if (onSwitchToReset) {
      onSwitchToReset();
    } else {
      // Navigate to password reset page
      window.location.href = "/reset-password";
    }
  };

  const isLocked = lockoutTime && lockoutTime > Date.now();
  const canSubmit =
    !isSubmitting &&
    !loading &&
    !isLocked &&
    formData.email &&
    formData.password;

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="space-y-1 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-white h-8 w-8" />
        </div>
        <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Sign in to your government portal account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Lockout Warning */}
        {isLocked && (
          <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
            <Timer className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Account temporarily locked. Try again in{" "}
              {Math.floor(lockoutCountdown / 60)}:
              {(lockoutCountdown % 60).toString().padStart(2, "0")}
            </AlertDescription>
          </Alert>
        )}

        {/* General Error */}
        {errors.general && (
          <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {errors.general}
            </AlertDescription>
          </Alert>
        )}

        {/* Login Attempts Warning */}
        {loginAttempts > 0 && loginAttempts < 5 && !isLocked && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              {loginAttempts}/5 failed attempts. Account will be locked after 5
              failed attempts.
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
                disabled={isSubmitting || loading || isLocked}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
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
                placeholder="Your secure password"
                disabled={isSubmitting || loading || isLocked}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={isSubmitting || loading || isLocked}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  handleInputChange("rememberMe", Boolean(checked))
                }
                disabled={isSubmitting || loading || isLocked}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
              disabled={isSubmitting || loading || isLocked}
            >
              Forgot password?
            </button>
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
                Signing in...
              </>
            ) : isLocked ? (
              <>
                <Timer className="w-4 h-4 mr-2" />
                Account Locked
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <Separator />

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={
              onSwitchToSignup || (() => (window.location.href = "/signup"))
            }
            className="text-primary hover:text-primary/80 font-medium transition-colors disabled:opacity-50"
            disabled={isSubmitting || loading}
          >
            Create account
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <CheckCircle className="h-3 w-3" />
            <span>Secure government authentication</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
