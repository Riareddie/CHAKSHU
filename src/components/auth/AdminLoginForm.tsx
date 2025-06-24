/**
 * Admin Login Form Component
 * Professional admin authentication interface with security features
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

// Form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginAttempt {
  timestamp: Date;
  success: boolean;
  ip?: string;
}

export const AdminLoginForm: React.FC = () => {
  const { signIn, loading, isAuthenticated, trackActivity } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  const [securityLevel, setSecurityLevel] = useState(0);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const watchedPassword = watch("password");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath =
        sessionStorage.getItem("redirectAfterLogin") || "/admin";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Load login attempts from localStorage
  useEffect(() => {
    const storedAttempts = localStorage.getItem("loginAttempts");
    if (storedAttempts) {
      try {
        const attempts = JSON.parse(storedAttempts).map((attempt: any) => ({
          ...attempt,
          timestamp: new Date(attempt.timestamp),
        }));
        setLoginAttempts(attempts);

        // Check for active lockout
        const lastFailure = attempts
          .filter((a: LoginAttempt) => !a.success)
          .sort(
            (a: LoginAttempt, b: LoginAttempt) =>
              b.timestamp.getTime() - a.timestamp.getTime(),
          )[0];

        if (lastFailure) {
          const recentFailures = attempts.filter(
            (a: LoginAttempt) =>
              !a.success && Date.now() - a.timestamp.getTime() < 15 * 60 * 1000, // 15 minutes
          );

          if (recentFailures.length >= 5) {
            const lockoutEnd = new Date(
              lastFailure.timestamp.getTime() + 15 * 60 * 1000,
            );
            if (lockoutEnd > new Date()) {
              setLockoutUntil(lockoutEnd);
            }
          }
        }
      } catch (error) {
        console.error("Failed to parse login attempts:", error);
      }
    }
  }, []);

  // Calculate password security level
  useEffect(() => {
    if (!watchedPassword) {
      setSecurityLevel(0);
      return;
    }

    let level = 0;

    // Length check
    if (watchedPassword.length >= 8) level += 20;
    if (watchedPassword.length >= 12) level += 10;
    if (watchedPassword.length >= 16) level += 10;

    // Character variety checks
    if (/[a-z]/.test(watchedPassword)) level += 10;
    if (/[A-Z]/.test(watchedPassword)) level += 10;
    if (/[0-9]/.test(watchedPassword)) level += 10;
    if (/[^a-zA-Z0-9]/.test(watchedPassword)) level += 15;

    // Pattern checks
    if (!/(.)\1{2,}/.test(watchedPassword)) level += 10; // No repeated characters
    if (!/123|abc|qwe/i.test(watchedPassword)) level += 5; // No sequential patterns

    setSecurityLevel(Math.min(level, 100));
  }, [watchedPassword]);

  // Handle lockout countdown
  useEffect(() => {
    if (!lockoutUntil) return;

    const interval = setInterval(() => {
      if (new Date() >= lockoutUntil) {
        setLockoutUntil(null);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Track login attempt
  const trackLoginAttempt = (success: boolean, email?: string) => {
    const attempt: LoginAttempt = {
      timestamp: new Date(),
      success,
    };

    const updatedAttempts = [...loginAttempts, attempt];
    setLoginAttempts(updatedAttempts);

    // Store in localStorage (keep only last 10 attempts)
    localStorage.setItem(
      "loginAttempts",
      JSON.stringify(updatedAttempts.slice(-10)),
    );

    // Track in system
    if (email) {
      trackActivity(
        success ? "admin_login_success" : "admin_login_failure",
        "authentication",
        { email, ip: "unknown" },
      );
    }
  };

  // Submit handler
  const onSubmit = async (data: LoginFormData) => {
    if (lockoutUntil) {
      toast({
        title: "Account Locked",
        description: "Please wait before attempting to login again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(
        data.email,
        data.password,
        data.rememberMe,
      );

      if (error) {
        trackLoginAttempt(false, data.email);

        // Check for specific error types
        if (error.message.includes("Invalid login credentials")) {
          setError("email", { message: "Invalid email or password" });
          setError("password", { message: "Invalid email or password" });
        } else if (error.message.includes("Email not confirmed")) {
          setError("email", { message: "Please confirm your email address" });
        } else if (error.message.includes("Too many requests")) {
          setError("email", {
            message: "Too many login attempts. Please try again later.",
          });
        } else {
          setError("email", { message: error.message });
        }

        // Check if we should lockout
        const recentFailures = loginAttempts.filter(
          (attempt) =>
            !attempt.success &&
            Date.now() - attempt.timestamp.getTime() < 15 * 60 * 1000,
        );

        if (recentFailures.length >= 4) {
          // This will be the 5th failure
          const lockoutEnd = new Date(Date.now() + 15 * 60 * 1000);
          setLockoutUntil(lockoutEnd);

          toast({
            title: "Account Temporarily Locked",
            description:
              "Too many failed attempts. Account locked for 15 minutes.",
            variant: "destructive",
          });
        }

        return;
      }

      // Success
      trackLoginAttempt(true, data.email);

      toast({
        title: "Login Successful",
        description: "Welcome back! Redirecting to admin dashboard...",
      });

      // Clear any stored failed attempts on successful login
      localStorage.removeItem("loginAttempts");

      // Redirect will be handled by the useEffect above
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate remaining lockout time
  const getRemainingLockoutTime = (): string => {
    if (!lockoutUntil) return "";

    const remaining = lockoutUntil.getTime() - Date.now();
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get security level color and text
  const getSecurityLevelInfo = () => {
    if (securityLevel < 30)
      return { color: "bg-red-500", text: "Weak", textColor: "text-red-600" };
    if (securityLevel < 60)
      return {
        color: "bg-yellow-500",
        text: "Fair",
        textColor: "text-yellow-600",
      };
    if (securityLevel < 80)
      return { color: "bg-blue-500", text: "Good", textColor: "text-blue-600" };
    return {
      color: "bg-green-500",
      text: "Strong",
      textColor: "text-green-600",
    };
  };

  const securityInfo = getSecurityLevelInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Secure access to Chakshu Portal administration
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Security Notice */}
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-sm">
              This is a secure administrative area. All activities are logged
              and monitored.
            </AlertDescription>
          </Alert>

          {/* Lockout Warning */}
          {lockoutUntil && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Account locked due to multiple failed attempts. Try again in{" "}
                {getRemainingLockoutTime()}.
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@chakshu.gov.in"
                disabled={isSubmitting || loading || !!lockoutUntil}
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  disabled={isSubmitting || loading || !!lockoutUntil}
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || loading || !!lockoutUntil}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Password Strength</span>
                    <span className={`font-medium ${securityInfo.textColor}`}>
                      {securityInfo.text}
                    </span>
                  </div>
                  <Progress
                    value={securityLevel}
                    className={`h-2 ${securityInfo.color}`}
                  />
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                disabled={isSubmitting || loading || !!lockoutUntil}
                {...register("rememberMe")}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                Keep me signed in for 24 hours
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loading || !isValid || !!lockoutUntil}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Sign In to Admin Portal
                </>
              )}
            </Button>
          </form>

          {/* Security Info */}
          <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Activity monitoring enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Session timeout protection</span>
            </div>
          </div>

          {/* Recent Login Attempts */}
          {loginAttempts.length > 0 && (
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">
                Recent login attempts ({loginAttempts.length})
              </summary>
              <div className="mt-2 space-y-1 max-h-20 overflow-y-auto">
                {loginAttempts
                  .slice(-5)
                  .reverse()
                  .map((attempt, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{attempt.timestamp.toLocaleTimeString()}</span>
                      <span
                        className={
                          attempt.success ? "text-green-600" : "text-red-600"
                        }
                      >
                        {attempt.success ? "Success" : "Failed"}
                      </span>
                    </div>
                  ))}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
