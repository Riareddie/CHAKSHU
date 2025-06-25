/**
 * Enhanced JWT Authentication Service
 * Provides secure JWT-based authentication with HTTP-only cookies,
 * token refresh, role-based access control, and comprehensive security features
 */

import { jwtDecode } from "jwt-decode";

// User roles with hierarchy
export enum UserRole {
  GUEST = "guest",
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

// Permissions system
export enum Permission {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  MODERATE = "moderate",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

// JWT payload structure
export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  permissions: Permission[];
  iat: number; // issued at
  exp: number; // expires at
  iss: string; // issuer
  aud: string; // audience
  sessionId: string;
  metadata?: {
    fullName?: string;
    department?: string;
    lastLogin?: string;
    ipAddress?: string;
  };
}

// Authentication response types
export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  requiresTwoFactor?: boolean;
  lockoutTime?: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  metadata: {
    lastLogin: Date;
    loginCount: number;
    isEmailVerified: boolean;
    isTwoFactorEnabled: boolean;
    department?: string;
  };
}

// Token management interface
interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  issuedAt: Date;
}

// Configuration
const AUTH_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REMEMBER_ME_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.GUEST]: 0,
  [UserRole.USER]: 1,
  [UserRole.MODERATOR]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4,
};

// Default permissions for each role
const DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.GUEST]: [],
  [UserRole.USER]: [Permission.READ],
  [UserRole.MODERATOR]: [
    Permission.READ,
    Permission.WRITE,
    Permission.MODERATE,
  ],
  [UserRole.ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.MODERATE,
    Permission.DELETE,
    Permission.ADMIN,
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
};

class AuthService {
  private currentUser: User | null = null;
  private tokenInfo: TokenInfo | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private sessionCheckTimer: NodeJS.Timeout | null = null;
  private authListeners: Array<(user: User | null) => void> = [];

  constructor() {
    this.initializeAuth();
    this.setupTokenRefresh();
    this.setupSessionCheck();
  }

  /**
   * Initialize authentication state
   */
  private async initializeAuth(): Promise<void> {
    try {
      // Check for existing valid session
      const isValid = await this.validateSession();
      if (isValid) {
        await this.loadUserProfile();
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      this.clearAuth();
    }
  }

  /**
   * Validate current session with server
   */
  private async validateSession(): Promise<boolean> {
    try {
      const response = await this.makeAuthenticatedRequest("/auth/validate", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        return data.valid;
      }

      return false;
    } catch (error) {
      console.error("Session validation failed:", error);
      return false;
    }
  }

  /**
   * Load user profile from server
   */
  private async loadUserProfile(): Promise<void> {
    try {
      const response = await this.makeAuthenticatedRequest("/auth/profile");

      if (response.ok) {
        const userData = await response.json();
        this.currentUser = this.transformUserData(userData);
        this.notifyAuthListeners(this.currentUser);
      } else {
        throw new Error("Failed to load user profile");
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      this.clearAuth();
    }
  }

  /**
   * Transform server user data to internal format
   */
  private transformUserData(userData: any): User {
    return {
      id: userData.id,
      email: userData.email,
      fullName: userData.full_name || userData.fullName,
      role: userData.role || UserRole.USER,
      permissions:
        userData.permissions ||
        DEFAULT_PERMISSIONS[userData.role || UserRole.USER],
      metadata: {
        lastLogin: new Date(userData.last_login),
        loginCount: userData.login_count || 0,
        isEmailVerified: userData.email_verified || false,
        isTwoFactorEnabled: userData.two_factor_enabled || false,
        department: userData.department,
      },
    };
  }

  /**
   * Login with email and password
   */
  async login(
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include HTTP-only cookies
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Tokens are set as HTTP-only cookies by the server
        this.currentUser = this.transformUserData(data.user);
        this.setupTokenRefresh();
        this.notifyAuthListeners(this.currentUser);

        // Track login activity
        await this.trackActivity("login", "authentication", {
          email,
          rememberMe,
          timestamp: new Date().toISOString(),
        });

        return {
          success: true,
          user: this.currentUser,
        };
      } else {
        // Handle specific error cases
        if (data.requiresTwoFactor) {
          return {
            success: false,
            requiresTwoFactor: true,
            error: data.message,
          };
        }

        if (data.lockoutTime) {
          return {
            success: false,
            lockoutTime: data.lockoutTime,
            error: data.message,
          };
        }

        return {
          success: false,
          error: data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Notify server to invalidate session
      await this.makeAuthenticatedRequest("/auth/logout", {
        method: "POST",
      });

      // Track logout activity
      await this.trackActivity("logout", "authentication");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Sign up new user
   */
  async signup(
    email: string,
    password: string,
    fullName: string,
    acceptTerms: boolean,
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          fullName: fullName.trim(),
          acceptTerms,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          user: this.transformUserData(data.user),
        };
      } else {
        return {
          success: false,
          error: data.message || "Signup failed",
        };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${AUTH_CONFIG.API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
          }),
        },
      );

      const data = await response.json();

      return {
        success: response.ok,
        error: response.ok ? undefined : data.message,
      };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${AUTH_CONFIG.API_BASE_URL}/auth/reset-password/confirm`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      return {
        success: response.ok,
        error: response.ok ? undefined : data.message,
      };
    } catch (error) {
      console.error("Password reset confirmation error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.makeAuthenticatedRequest(
        "/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        await this.trackActivity("password_change", "security");
      }

      return {
        success: response.ok,
        error: response.ok ? undefined : data.message,
      };
    } catch (error) {
      console.error("Password change error:", error);
      return {
        success: false,
        error: "Network error. Please try again.",
      };
    }
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(): Promise<boolean> {
    try {
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        await this.loadUserProfile();
        return true;
      }

      // If refresh fails, clear auth
      this.clearAuth();
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearAuth();
      return false;
    }
  }

  /**
   * Make authenticated request with automatic token refresh
   */
  private async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const url = `${AUTH_CONFIG.API_BASE_URL}${endpoint}`;

    let response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
      },
    });

    // If unauthorized, try to refresh tokens
    if (response.status === 401) {
      const refreshed = await this.refreshTokens();

      if (refreshed) {
        // Retry the original request
        response = await fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            ...options.headers,
          },
        });
      }
    }

    return response;
  }

  /**
   * Setup automatic token refresh
   */
  private setupTokenRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    // Check for token refresh every minute
    this.refreshTimer = setInterval(async () => {
      await this.refreshTokens();
    }, 60000);
  }

  /**
   * Setup session timeout check
   */
  private setupSessionCheck(): void {
    if (this.sessionCheckTimer) {
      clearInterval(this.sessionCheckTimer);
    }

    // Check session validity every 5 minutes
    this.sessionCheckTimer = setInterval(
      async () => {
        const isValid = await this.validateSession();
        if (!isValid) {
          this.clearAuth();
        }
      },
      5 * 60 * 1000,
    );
  }

  /**
   * Clear authentication state
   */
  private clearAuth(): void {
    this.currentUser = null;
    this.tokenInfo = null;

    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (this.sessionCheckTimer) {
      clearInterval(this.sessionCheckTimer);
      this.sessionCheckTimer = null;
    }

    this.notifyAuthListeners(null);
  }

  /**
   * Role and permission checking
   */
  hasRole(role: UserRole): boolean {
    if (!this.currentUser) return false;
    return ROLE_HIERARCHY[this.currentUser.role] >= ROLE_HIERARCHY[role];
  }

  hasPermission(permission: Permission): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * Track user activity
   */
  private async trackActivity(
    action: string,
    category: string,
    details?: any,
  ): Promise<void> {
    try {
      await this.makeAuthenticatedRequest("/auth/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          category,
          details,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to track activity:", error);
    }
  }

  /**
   * Authentication state management
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);

    // Immediately call with current state
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      this.authListeners = this.authListeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  private notifyAuthListeners(user: User | null): void {
    this.authListeners.forEach((listener) => listener(user));
  }

  /**
   * Getters
   */
  get user(): User | null {
    return this.currentUser;
  }

  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  get userRole(): UserRole {
    return this.currentUser?.role || UserRole.GUEST;
  }

  get userPermissions(): Permission[] {
    return this.currentUser?.permissions || [];
  }
}

// Create singleton instance
export const authService = new AuthService();

// Utility functions for password validation
export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const score = [
    password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  ].filter(Boolean).length;

  return {
    isValid: score >= 4,
    score,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    },
    strength:
      score <= 2
        ? "weak"
        : score === 3
          ? "medium"
          : score === 4
            ? "strong"
            : "very-strong",
  };
};

// Export types
export type { AuthResponse, User, JWTPayload, TokenInfo };
