/**
 * Enhanced Authentication Context
 * Provides JWT-based authentication with HTTP-only cookies, role-based access control,
 * automatic session management, and comprehensive security features
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  authService,
  UserRole,
  Permission,
  User,
  AuthResponse,
} from "@/services/auth";
import { toast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
  lastActivity: Date;
}

interface AuthContextType extends AuthState {
  // Authentication methods
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    acceptTerms: boolean,
  ) => Promise<AuthResponse>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  confirmPasswordReset: (
    token: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;

  // Role and permission checking
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;

  // Session management
  refreshSession: () => Promise<boolean>;
  updateActivity: () => void;
  extendSession: () => Promise<void>;

  // UI state
  clearError: () => void;
  showSessionWarning: boolean;
  dismissSessionWarning: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Session management configuration
const SESSION_CONFIG = {
  WARNING_TIME: 5 * 60 * 1000, // 5 minutes before expiry
  ACTIVITY_INTERVAL: 60 * 1000, // 1 minute
  INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    sessionExpiry: null,
    lastActivity: new Date(),
  });

  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [activityTimer, setActivityTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize authentication state
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = authService.onAuthStateChange((user) => {
      if (isMounted) {
        setState((prev) => ({
          ...prev,
          user,
          isAuthenticated: user !== null,
          loading: false,
          lastActivity: new Date(),
        }));

        if (user) {
          setupSessionManagement();
          setupActivityTracking();
        } else {
          cleanupTimers();
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      cleanupTimers();
    };
  }, []);

  // Setup session expiry warning
  const setupSessionManagement = useCallback(() => {
    if (warningTimer) {
      clearTimeout(warningTimer);
    }

    const timer = setTimeout(() => {
      setShowSessionWarning(true);
      toast({
        title: "Session Expiring Soon",
        description:
          "Your session will expire in 5 minutes. Click here to extend it.",
        duration: 0,
        action: {
          label: "Extend Session",
          onClick: extendSession,
        },
      });
    }, SESSION_CONFIG.INACTIVITY_TIMEOUT - SESSION_CONFIG.WARNING_TIME);

    setWarningTimer(timer);
  }, []);

  // Setup activity tracking
  const setupActivityTracking = useCallback(() => {
    if (activityTimer) {
      clearInterval(activityTimer);
    }

    const timer = setInterval(() => {
      const timeSinceActivity = Date.now() - state.lastActivity.getTime();

      if (
        timeSinceActivity > SESSION_CONFIG.INACTIVITY_TIMEOUT &&
        state.isAuthenticated
      ) {
        handleSessionTimeout();
      }
    }, SESSION_CONFIG.ACTIVITY_INTERVAL);

    setActivityTimer(timer);
  }, [state.lastActivity, state.isAuthenticated]);

  // Handle session timeout
  const handleSessionTimeout = useCallback(async () => {
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive",
    });

    await logout();
  }, []);

  // Clean up timers
  const cleanupTimers = useCallback(() => {
    if (activityTimer) {
      clearInterval(activityTimer);
      setActivityTimer(null);
    }
    if (warningTimer) {
      clearTimeout(warningTimer);
      setWarningTimer(null);
    }
    setShowSessionWarning(false);
  }, [activityTimer, warningTimer]);

  // Authentication methods
  const login = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<AuthResponse> => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await authService.login(email, password, rememberMe);

      if (response.success) {
        toast({
          title: "Welcome!",
          description: "You have been successfully logged in.",
        });
      } else {
        if (response.requiresTwoFactor) {
          toast({
            title: "Two-Factor Authentication Required",
            description:
              response.error || "Please complete two-factor authentication.",
            variant: "default",
          });
        } else if (response.lockoutTime) {
          const lockoutMinutes = Math.ceil(response.lockoutTime / 60000);
          toast({
            title: "Account Temporarily Locked",
            description: `Too many failed attempts. Try again in ${lockoutMinutes} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Failed",
            description: response.error || "Invalid credentials.",
            variant: "destructive",
          });
        }
      }

      return response;
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
  };

  const logout = async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      await authService.logout();

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      cleanupTimers();
      setState((prev) => ({
        ...prev,
        loading: false,
        user: null,
        isAuthenticated: false,
      }));
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    acceptTerms: boolean,
  ): Promise<AuthResponse> => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await authService.signup(
        email,
        password,
        fullName,
        acceptTerms,
      );

      if (response.success) {
        toast({
          title: "Account Created",
          description:
            "Your account has been created successfully. Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Signup Failed",
          description: response.error || "Failed to create account.",
          variant: "destructive",
        });
      }

      return response;
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
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await authService.resetPassword(email);

      if (result.success) {
        toast({
          title: "Password Reset Link Sent",
          description:
            "Please check your email for password reset instructions.",
        });
      } else {
        toast({
          title: "Password Reset Failed",
          description: result.error || "Failed to send reset email.",
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const confirmPasswordReset = async (token: string, newPassword: string) => {
    try {
      const result = await authService.confirmPasswordReset(token, newPassword);

      if (result.success) {
        toast({
          title: "Password Reset Successful",
          description:
            "Your password has been reset successfully. You can now log in with your new password.",
        });
      } else {
        toast({
          title: "Password Reset Failed",
          description: result.error || "Failed to reset password.",
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      const result = await authService.changePassword(
        currentPassword,
        newPassword,
      );

      if (result.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
        });
      } else {
        toast({
          title: "Password Change Failed",
          description: result.error || "Failed to change password.",
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Role and permission checking
  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return authService.hasRole(role);
    },
    [state.user],
  );

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return authService.hasPermission(permission);
    },
    [state.user],
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return authService.hasAnyRole(roles);
    },
    [state.user],
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return authService.hasAnyPermission(permissions);
    },
    [state.user],
  );

  // Session management
  const refreshSession = async (): Promise<boolean> => {
    try {
      const success = await authService.refreshTokens();

      if (success) {
        setState((prev) => ({ ...prev, lastActivity: new Date() }));
        setShowSessionWarning(false);
      }

      return success;
    } catch (error) {
      console.error("Session refresh failed:", error);
      return false;
    }
  };

  const updateActivity = useCallback(() => {
    setState((prev) => ({ ...prev, lastActivity: new Date() }));
    setShowSessionWarning(false);

    // Reset session warning timer
    setupSessionManagement();
  }, [setupSessionManagement]);

  const extendSession = async (): Promise<void> => {
    const success = await refreshSession();

    if (success) {
      toast({
        title: "Session Extended",
        description: "Your session has been extended successfully.",
      });
    } else {
      toast({
        title: "Session Extension Failed",
        description: "Failed to extend session. Please log in again.",
        variant: "destructive",
      });
    }
  };

  // UI state management
  const clearError = useCallback(() => {
    // Implementation for clearing error states
  }, []);

  const dismissSessionWarning = useCallback(() => {
    setShowSessionWarning(false);
  }, []);

  // Activity tracking on user interactions
  useEffect(() => {
    const handleUserActivity = () => {
      if (state.isAuthenticated) {
        updateActivity();
      }
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
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [state.isAuthenticated, updateActivity]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    signup,
    resetPassword,
    confirmPasswordReset,
    changePassword,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    refreshSession,
    updateActivity,
    extendSession,
    clearError,
    showSessionWarning,
    dismissSessionWarning,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
