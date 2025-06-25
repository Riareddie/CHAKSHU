/**
 * Secure Authentication Context with Session Management
 * Integrates with sessionManager for comprehensive security
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  sessionManager,
  SessionData,
  SessionConflict,
} from "@/services/sessionManager";
import { toast } from "@/hooks/use-toast";

// User interface
export interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  fullName?: string;
  isEmailVerified: boolean;
  lastLogin: Date;
}

// Authentication state
interface AuthState {
  user: User | null;
  session: SessionData | null;
  loading: boolean;
  isAuthenticated: boolean;
  lastActivity: Date;
  sessionExpiry: Date | null;
}

// Authentication context interface
interface AuthContextType extends AuthState {
  // Authentication methods
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<LoginResult>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<SignupResult>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;

  // Session methods
  validateSession: () => Promise<boolean>;
  extendSession: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;

  // Activity tracking
  updateActivity: (action?: string, metadata?: Record<string, any>) => void;

  // Security methods
  getCSRFToken: () => string | null;
  checkPermission: (permission: string) => boolean;
  checkRole: (role: string) => boolean;

  // UI state
  showSessionWarning: boolean;
  dismissSessionWarning: () => void;
}

// Result types
interface LoginResult {
  success: boolean;
  error?: string;
  requiresTwoFactor?: boolean;
  sessionConflict?: SessionConflict;
}

interface SignupResult {
  success: boolean;
  error?: string;
  emailVerificationRequired?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a SecureAuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const SecureAuthProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    lastActivity: new Date(),
    sessionExpiry: null,
  });

  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    let isMounted = true;

    // Listen to session changes
    const unsubscribeSession = sessionManager.addSessionListener((session) => {
      if (!isMounted) return;

      if (session) {
        const user: User = {
          id: session.userId,
          email: session.email,
          role: session.role,
          permissions: session.permissions,
          fullName: session.email.split("@")[0], // Fallback
          isEmailVerified: true,
          lastLogin: session.createdAt,
        };

        setState((prev) => ({
          ...prev,
          user,
          session,
          isAuthenticated: true,
          sessionExpiry: session.expiresAt,
          lastActivity: session.lastActivity,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          session: null,
          isAuthenticated: false,
          sessionExpiry: null,
          loading: false,
        }));
      }
    });

    // Check for existing session
    const existingSession = sessionManager.getCurrentSession();
    if (existingSession) {
      // Validate existing session
      sessionManager.validateSession().then((isValid) => {
        if (!isValid && isMounted) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      });
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }

    return () => {
      isMounted = false;
      unsubscribeSession();
    };
  }, []);

  // Authentication methods
  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe = false,
    ): Promise<LoginResult> => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const result = await sessionManager.createSession({
          email,
          password,
          rememberMe,
        });

        if (result.success) {
          toast({
            title: "Welcome!",
            description: "You have been successfully logged in.",
          });

          // Handle session conflicts
          if (result.sessionConflict) {
            toast({
              title: "Multiple Sessions Detected",
              description:
                "You have been logged in from another device. Previous sessions have been terminated.",
              variant: "default",
            });
          }

          return {
            success: true,
          };
        } else {
          // Handle specific error cases
          if (result.requiresTwoFactor) {
            return {
              success: false,
              requiresTwoFactor: true,
              error: result.error,
            };
          }

          if (result.sessionConflict) {
            return {
              success: false,
              sessionConflict: result.sessionConflict,
              error: result.error,
            };
          }

          toast({
            title: "Login Failed",
            description: result.error || "Invalid credentials.",
            variant: "destructive",
          });

          return {
            success: false,
            error: result.error,
          };
        }
      } catch (error) {
        const errorMessage = "An unexpected error occurred during login.";

        toast({
          title: "Login Error",
          description: errorMessage,
          variant: "destructive",
        });

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      await sessionManager.destroySession();

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
    ): Promise<SignupResult> => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": sessionManager.getCSRFToken() || "",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            password,
            fullName: fullName.trim(),
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast({
            title: "Account Created",
            description: data.emailVerificationRequired
              ? "Please check your email to verify your account."
              : "Your account has been created successfully.",
          });

          return {
            success: true,
            emailVerificationRequired: data.emailVerificationRequired,
          };
        } else {
          toast({
            title: "Signup Failed",
            description: data.message || "Failed to create account.",
            variant: "destructive",
          });

          return {
            success: false,
            error: data.message,
          };
        }
      } catch (error) {
        const errorMessage = "An unexpected error occurred during signup.";

        toast({
          title: "Signup Error",
          description: errorMessage,
          variant: "destructive",
        });

        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [],
  );

  const resetPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": sessionManager.getCSRFToken() || "",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Password Reset Link Sent",
          description:
            "Please check your email for password reset instructions.",
        });

        return { success: true };
      } else {
        toast({
          title: "Password Reset Failed",
          description: data.message || "Failed to send reset email.",
          variant: "destructive",
        });

        return { success: false, error: data.message };
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    }
  }, []);

  // Session methods
  const validateSession = useCallback(async (): Promise<boolean> => {
    return await sessionManager.validateSession();
  }, []);

  const extendSession = useCallback(async (): Promise<boolean> => {
    const success = await sessionManager.extendSession();

    if (success) {
      setState((prev) => ({
        ...prev,
        lastActivity: new Date(),
        sessionExpiry: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      }));
      setShowSessionWarning(false);
    }

    return success;
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const isValid = await sessionManager.validateSession();

    if (isValid && state.session) {
      setState((prev) => ({
        ...prev,
        lastActivity: new Date(),
      }));
    }

    return isValid;
  }, [state.session]);

  // Activity tracking
  const updateActivity = useCallback(
    (action = "user_activity", metadata?: Record<string, any>) => {
      sessionManager.updateActivity(action, metadata);

      setState((prev) => ({
        ...prev,
        lastActivity: new Date(),
      }));

      setShowSessionWarning(false);
    },
    [],
  );

  // Security methods
  const getCSRFToken = useCallback((): string | null => {
    return sessionManager.getCSRFToken();
  }, []);

  const checkPermission = useCallback(
    (permission: string): boolean => {
      return state.user?.permissions.includes(permission) || false;
    },
    [state.user],
  );

  const checkRole = useCallback(
    (role: string): boolean => {
      return state.user?.role === role || false;
    },
    [state.user],
  );

  // UI state management
  const dismissSessionWarning = useCallback(() => {
    setShowSessionWarning(false);
  }, []);

  // Activity tracking on user interactions
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const handleUserActivity = () => {
      updateActivity("dom_interaction");
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [state.isAuthenticated, updateActivity]);

  // Session warning management
  useEffect(() => {
    if (!state.sessionExpiry || !state.isAuthenticated) return;

    const timeUntilExpiry = state.sessionExpiry.getTime() - Date.now();
    const warningTime = 5 * 60 * 1000; // 5 minutes

    if (timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
      setShowSessionWarning(true);
    }

    const timer = setTimeout(
      () => {
        if (state.isAuthenticated) {
          setShowSessionWarning(true);
        }
      },
      Math.max(0, timeUntilExpiry - warningTime),
    );

    return () => clearTimeout(timer);
  }, [state.sessionExpiry, state.isAuthenticated]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    signup,
    resetPassword,
    validateSession,
    extendSession,
    refreshSession,
    updateActivity,
    getCSRFToken,
    checkPermission,
    checkRole,
    showSessionWarning,
    dismissSessionWarning,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default SecureAuthProvider;
