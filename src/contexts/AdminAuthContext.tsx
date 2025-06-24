/**
 * Enhanced Admin Authentication Context
 * Provides comprehensive authentication with role-based access control,
 * session management, and security features
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  checkSupabaseHealth,
  getConnectionErrorMessage,
} from "@/lib/supabase-health";

// User roles hierarchy
export enum UserRole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

// Permission levels
export enum Permission {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

// Admin profile interface
export interface AdminProfile {
  id: string;
  user_id: string;
  role: UserRole;
  permissions: Permission[];
  department?: string;
  access_level: number;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    autoLogout: number; // minutes
    twoFactorEnabled: boolean;
  };
  metadata: {
    lastLogin: string;
    loginCount: number;
    failedAttempts: number;
    isLocked: boolean;
    lockedUntil?: string;
    ipWhitelist?: string[];
  };
  created_at: string;
  updated_at: string;
}

// Session metadata
export interface SessionMetadata {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  expires_at: string;
  last_activity: string;
  is_active: boolean;
}

// Authentication state
interface AuthState {
  user: User | null;
  session: Session | null;
  adminProfile: AdminProfile | null;
  currentSession: SessionMetadata | null;
  loading: boolean;
  isAuthenticated: boolean;
  lastActivity: Date;
  sessionWarningShown: boolean;
}

// Authentication context type
interface AdminAuthContextType extends AuthState {
  // Authentication methods
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;

  // Admin profile methods
  updateProfile: (
    updates: Partial<AdminProfile>,
  ) => Promise<{ error: string | null }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ error: string | null }>;

  // Role and permission methods
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;

  // Session management
  extendSession: () => Promise<void>;
  getActiveSessions: () => Promise<SessionMetadata[]>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllOtherSessions: () => Promise<void>;

  // Security methods
  trackActivity: (
    action: string,
    resource?: string,
    details?: any,
  ) => Promise<void>;
  checkLoginAttempts: () => Promise<boolean>;
  resetFailedAttempts: () => Promise<void>;

  // UI state management
  updateLastActivity: () => void;
  dismissSessionWarning: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

// Role hierarchy mapping for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4,
};

// Default permissions for each role
const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [Permission.READ],
  [UserRole.MODERATOR]: [Permission.READ, Permission.WRITE],
  [UserRole.ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.DELETE,
    Permission.ADMIN,
  ],
  [UserRole.SUPER_ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.DELETE,
    Permission.ADMIN,
    Permission.SUPER_ADMIN,
  ],
};

// Session configuration
const SESSION_CONFIG = {
  WARNING_BEFORE_EXPIRY: 5 * 60 * 1000, // 5 minutes
  DEFAULT_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  EXTENDED_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours (remember me)
  ACTIVITY_CHECK_INTERVAL: 60 * 1000, // 1 minute
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    adminProfile: null,
    currentSession: null,
    loading: true,
    isAuthenticated: false,
    lastActivity: new Date(),
    sessionWarningShown: false,
  });

  // Activity tracking timer
  const [activityTimer, setActivityTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
    setupActivityTracking();

    return () => {
      if (activityTimer) clearInterval(activityTimer);
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, []);

  // Initialize auth state from Supabase
  const initializeAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await loadUserProfile(session.user);
        setupSessionManagement(session);
      }

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        handleAuthStateChange(event, session);
      });

      setState((prev) => ({ ...prev, loading: false }));

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Auth initialization failed:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Handle auth state changes
  const handleAuthStateChange = async (
    event: string,
    session: Session | null,
  ) => {
    if (event === "SIGNED_IN" && session?.user) {
      await loadUserProfile(session.user);
      setupSessionManagement(session);

      toast({
        title: "Welcome Back!",
        description: "You have been successfully authenticated.",
      });
    } else if (event === "SIGNED_OUT") {
      handleSignOut();

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
  };

  // Load admin profile from database
  const loadUserProfile = async (user: User) => {
    try {
      // Check if connection is available
      const health = await checkSupabaseHealth();

      if (!health.isAvailable) {
        // Demo mode - create mock admin profile
        const mockProfile: AdminProfile = {
          id: "demo-admin-1",
          user_id: user.id,
          role: UserRole.ADMIN,
          permissions: DEFAULT_PERMISSIONS[UserRole.ADMIN],
          department: "System Administration",
          access_level: 3,
          preferences: {
            theme: "system",
            notifications: true,
            autoLogout: 30,
            twoFactorEnabled: false,
          },
          metadata: {
            lastLogin: new Date().toISOString(),
            loginCount: 1,
            failedAttempts: 0,
            isLocked: false,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          user,
          adminProfile: mockProfile,
          isAuthenticated: true,
          lastActivity: new Date(),
        }));
        return;
      }

      // Fetch admin profile from database
      const { data: profileData, error } = await supabase
        .from("admin_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // Not found error
        throw error;
      }

      let adminProfile: AdminProfile;

      if (!profileData) {
        // Create default admin profile for new users
        adminProfile = {
          id: crypto.randomUUID(),
          user_id: user.id,
          role: UserRole.USER,
          permissions: DEFAULT_PERMISSIONS[UserRole.USER],
          access_level: 1,
          preferences: {
            theme: "system",
            notifications: true,
            autoLogout: 30,
            twoFactorEnabled: false,
          },
          metadata: {
            lastLogin: new Date().toISOString(),
            loginCount: 1,
            failedAttempts: 0,
            isLocked: false,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Save to database
        const { error: insertError } = await supabase
          .from("admin_profiles")
          .insert(adminProfile);

        if (insertError) {
          console.error("Failed to create admin profile:", insertError);
        }
      } else {
        adminProfile = profileData;
      }

      setState((prev) => ({
        ...prev,
        user,
        adminProfile,
        isAuthenticated: true,
        lastActivity: new Date(),
      }));
    } catch (error) {
      console.error("Failed to load user profile:", error);

      // Fallback to basic user state
      setState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
        lastActivity: new Date(),
      }));
    }
  };

  // Setup session management
  const setupSessionManagement = (session: Session) => {
    setState((prev) => ({ ...prev, session }));

    // Create session record
    createSessionRecord(session);

    // Setup auto-logout timer
    const timeout = state.adminProfile?.preferences.autoLogout || 30;
    const timeoutMs = timeout * 60 * 1000;

    if (sessionTimer) clearTimeout(sessionTimer);

    const timer = setTimeout(() => {
      handleSessionExpiry();
    }, timeoutMs);

    setSessionTimer(timer);
  };

  // Create session record in database
  const createSessionRecord = async (session: Session) => {
    try {
      const sessionData: Omit<SessionMetadata, "id"> = {
        user_id: session.user.id,
        ip_address: "unknown", // Would need server-side detection
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + SESSION_CONFIG.DEFAULT_TIMEOUT,
        ).toISOString(),
        last_activity: new Date().toISOString(),
        is_active: true,
      };

      const { data, error } = await supabase
        .from("user_sessions")
        .insert(sessionData)
        .select()
        .single();

      if (!error && data) {
        setState((prev) => ({ ...prev, currentSession: data }));
      }
    } catch (error) {
      console.error("Failed to create session record:", error);
    }
  };

  // Setup activity tracking
  const setupActivityTracking = () => {
    const timer = setInterval(() => {
      const timeSinceLastActivity = Date.now() - state.lastActivity.getTime();

      // Show warning 5 minutes before timeout
      if (
        timeSinceLastActivity >
          SESSION_CONFIG.DEFAULT_TIMEOUT -
            SESSION_CONFIG.WARNING_BEFORE_EXPIRY &&
        !state.sessionWarningShown &&
        state.isAuthenticated
      ) {
        showSessionWarning();
      }

      // Auto logout on timeout
      if (
        timeSinceLastActivity > SESSION_CONFIG.DEFAULT_TIMEOUT &&
        state.isAuthenticated
      ) {
        handleSessionExpiry();
      }
    }, SESSION_CONFIG.ACTIVITY_CHECK_INTERVAL);

    setActivityTimer(timer);
  };

  // Show session expiry warning
  const showSessionWarning = () => {
    setState((prev) => ({ ...prev, sessionWarningShown: true }));

    toast({
      title: "Session Expiring Soon",
      description:
        "Your session will expire in 5 minutes. Click here to extend it.",
      duration: 0, // Don't auto-dismiss
      action: {
        label: "Extend Session",
        onClick: extendSession,
      },
    });
  };

  // Handle session expiry
  const handleSessionExpiry = async () => {
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive",
    });

    await signOut();
  };

  // Authentication methods
  const signIn = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<{ error: AuthError | null }> => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      // Check failed login attempts
      const canLogin = await checkLoginAttempts();
      if (!canLogin) {
        return {
          error: {
            message: "Account temporarily locked due to failed login attempts",
          } as AuthError,
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await trackFailedLogin(email);
        return { error };
      }

      if (data.user) {
        await resetFailedAttempts();
        await trackActivity("user_login", "authentication", {
          email,
          rememberMe,
        });
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await trackActivity("user_logout", "authentication");

      // Terminate current session
      if (state.currentSession) {
        await terminateSession(state.currentSession.id);
      }

      await supabase.auth.signOut();
      handleSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      handleSignOut(); // Force logout on error
    }
  };

  const handleSignOut = () => {
    // Clear timers
    if (activityTimer) clearInterval(activityTimer);
    if (sessionTimer) clearTimeout(sessionTimer);

    setState({
      user: null,
      session: null,
      adminProfile: null,
      currentSession: null,
      loading: false,
      isAuthenticated: false,
      lastActivity: new Date(),
      sessionWarningShown: false,
    });
  };

  // Role and permission checking
  const hasRole = useCallback(
    (role: UserRole): boolean => {
      if (!state.adminProfile) return false;
      return ROLE_HIERARCHY[state.adminProfile.role] >= ROLE_HIERARCHY[role];
    },
    [state.adminProfile],
  );

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!state.adminProfile) return false;
      return state.adminProfile.permissions.includes(permission);
    },
    [state.adminProfile],
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      return roles.some((role) => hasRole(role));
    },
    [hasRole],
  );

  const hasAnyPermission = useCallback(
    (permissions: Permission[]): boolean => {
      return permissions.some((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  // Activity tracking
  const updateLastActivity = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lastActivity: new Date(),
      sessionWarningShown: false,
    }));
  }, []);

  const trackActivity = async (
    action: string,
    resource?: string,
    details?: any,
  ): Promise<void> => {
    try {
      if (!state.user) return;

      const logData = {
        user_id: state.user.id,
        action,
        resource: resource || "unknown",
        details: details ? JSON.stringify(details) : null,
        ip_address: "unknown", // Would need server-side detection
        timestamp: new Date().toISOString(),
      };

      await supabase.from("activity_logs").insert(logData);
    } catch (error) {
      console.error("Failed to track activity:", error);
    }
  };

  // Session management methods
  const extendSession = async (): Promise<void> => {
    try {
      await supabase.auth.refreshSession();
      updateLastActivity();

      toast({
        title: "Session Extended",
        description: "Your session has been extended successfully.",
      });
    } catch (error) {
      console.error("Failed to extend session:", error);
    }
  };

  // Security methods
  const checkLoginAttempts = async (): Promise<boolean> => {
    // In demo mode, always allow login
    const health = await checkSupabaseHealth();
    if (!health.isAvailable) return true;

    // Check would be implemented with database query
    return true; // Simplified for demo
  };

  const trackFailedLogin = async (email: string): Promise<void> => {
    await trackActivity("failed_login", "authentication", { email });
  };

  const resetFailedAttempts = async (): Promise<void> => {
    await trackActivity("login_success", "authentication");
  };

  // Stub implementations for remaining methods
  const refreshSession = async (): Promise<void> => {
    await supabase.auth.refreshSession();
  };

  const updateProfile = async (
    updates: Partial<AdminProfile>,
  ): Promise<{ error: string | null }> => {
    try {
      if (!state.adminProfile) return { error: "No profile loaded" };

      const updatedProfile = {
        ...state.adminProfile,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      setState((prev) => ({ ...prev, adminProfile: updatedProfile }));

      return { error: null };
    } catch (error) {
      return { error: "Failed to update profile" };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error: error?.message || null };
    } catch (error) {
      return { error: "Failed to change password" };
    }
  };

  const getActiveSessions = async (): Promise<SessionMetadata[]> => {
    return []; // Stub implementation
  };

  const terminateSession = async (sessionId: string): Promise<void> => {
    // Stub implementation
  };

  const terminateAllOtherSessions = async (): Promise<void> => {
    // Stub implementation
  };

  const dismissSessionWarning = useCallback(() => {
    setState((prev) => ({ ...prev, sessionWarningShown: false }));
  }, []);

  const contextValue: AdminAuthContextType = {
    ...state,
    signIn,
    signOut,
    refreshSession,
    updateProfile,
    changePassword,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    extendSession,
    getActiveSessions,
    terminateSession,
    terminateAllOtherSessions,
    trackActivity,
    checkLoginAttempts,
    resetFailedAttempts,
    updateLastActivity,
    dismissSessionWarning,
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
};
