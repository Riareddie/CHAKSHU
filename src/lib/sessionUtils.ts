/**
 * Session Management Utility Functions
 * Helper functions for session validation, encryption, and monitoring
 */

import { SessionData } from "@/services/sessionManager";

// Session validation utilities
export const SessionValidationUtils = {
  /**
   * Check if session is still valid based on expiry time
   */
  isSessionExpired(session: SessionData): boolean {
    return session.expiresAt <= new Date();
  },

  /**
   * Check if session is about to expire (within warning threshold)
   */
  isSessionAboutToExpire(
    session: SessionData,
    warningThresholdMs = 5 * 60 * 1000,
  ): boolean {
    const timeUntilExpiry = session.expiresAt.getTime() - Date.now();
    return timeUntilExpiry <= warningThresholdMs && timeUntilExpiry > 0;
  },

  /**
   * Calculate time until session expiry in seconds
   */
  getTimeUntilExpiry(session: SessionData): number {
    return Math.max(
      0,
      Math.floor((session.expiresAt.getTime() - Date.now()) / 1000),
    );
  },

  /**
   * Check if session was created recently (for duplicate detection)
   */
  isRecentSession(session: SessionData, thresholdMs = 60000): boolean {
    return Date.now() - session.createdAt.getTime() < thresholdMs;
  },

  /**
   * Validate session data integrity
   */
  validateSessionData(session: SessionData): boolean {
    return !!(
      session.sessionId &&
      session.userId &&
      session.email &&
      session.createdAt &&
      session.expiresAt &&
      session.lastActivity
    );
  },
};

// Session encryption utilities (simplified for demo)
export const SessionEncryptionUtils = {
  /**
   * Encrypt session data for storage
   */
  encryptSessionData(data: any, key: string = "default-key"): string {
    try {
      // In production, use proper encryption like AES
      const jsonString = JSON.stringify(data);
      const encoded = btoa(encodeURIComponent(jsonString));

      // Simple XOR encryption for demo
      const encrypted = encoded
        .split("")
        .map((char, index) => {
          const keyChar = key.charCodeAt(index % key.length);
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
        })
        .join("");

      return btoa(encrypted);
    } catch (error) {
      console.error("Session encryption error:", error);
      return "";
    }
  },

  /**
   * Decrypt session data from storage
   */
  decryptSessionData(encryptedData: string, key: string = "default-key"): any {
    try {
      const encrypted = atob(encryptedData);

      // Simple XOR decryption for demo
      const decrypted = encrypted
        .split("")
        .map((char, index) => {
          const keyChar = key.charCodeAt(index % key.length);
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
        })
        .join("");

      const decoded = decodeURIComponent(atob(decrypted));
      return JSON.parse(decoded);
    } catch (error) {
      console.error("Session decryption error:", error);
      return null;
    }
  },

  /**
   * Generate session encryption key based on device characteristics
   */
  generateDeviceKey(): string {
    const deviceData = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    return btoa(JSON.stringify(deviceData)).slice(0, 32);
  },
};

// Session monitoring utilities
export const SessionMonitoringUtils = {
  /**
   * Track session activity
   */
  trackActivity(action: string, details?: Record<string, any>): void {
    const activity = {
      action,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      details,
    };

    // Send to monitoring service
    this.sendActivityLog(activity);
  },

  /**
   * Send activity log to server
   */
  sendActivityLog(activity: any): void {
    try {
      // Use beacon API for reliable delivery
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/auth/activity", JSON.stringify(activity));
      } else {
        // Fallback to fetch
        fetch("/api/auth/activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activity),
          credentials: "include",
        }).catch((error) => {
          console.error("Activity tracking failed:", error);
        });
      }
    } catch (error) {
      console.error("Activity tracking error:", error);
    }
  },

  /**
   * Monitor for suspicious session activity
   */
  detectSuspiciousActivity(
    currentSession: SessionData,
    activities: any[],
  ): boolean {
    // Check for rapid location changes
    const locationChanges = activities.filter(
      (a) => a.action === "location_change",
    );
    if (locationChanges.length > 5) return true;

    // Check for unusual access patterns
    const accessTimes = activities
      .filter((a) => a.action === "route_access")
      .map((a) => new Date(a.timestamp).getHours());

    const uniqueHours = new Set(accessTimes);
    if (uniqueHours.size > 12) return true; // Active across many hours

    // Check for rapid successive logins
    const logins = activities.filter((a) => a.action === "session_created");
    if (logins.length > 3) return true;

    return false;
  },

  /**
   * Calculate session health score
   */
  calculateSessionHealth(session: SessionData): number {
    let score = 100;

    // Deduct points for old sessions
    const sessionAge = Date.now() - session.createdAt.getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    score -= Math.min(30, (sessionAge / maxAge) * 30);

    // Deduct points for inactivity
    const inactivityTime = Date.now() - session.lastActivity.getTime();
    const maxInactivity = 30 * 60 * 1000; // 30 minutes
    score -= Math.min(40, (inactivityTime / maxInactivity) * 40);

    // Deduct points if session is about to expire
    if (SessionValidationUtils.isSessionAboutToExpire(session)) {
      score -= 20;
    }

    return Math.max(0, Math.round(score));
  },
};

// Cross-tab session management
export const CrossTabSessionUtils = {
  /**
   * Broadcast session update to other tabs
   */
  broadcastSessionUpdate(session: SessionData | null): void {
    try {
      const message = {
        type: "session_update",
        session: session
          ? {
              ...session,
              createdAt: session.createdAt.toISOString(),
              lastActivity: session.lastActivity.toISOString(),
              expiresAt: session.expiresAt.toISOString(),
            }
          : null,
        timestamp: Date.now(),
      };

      // Use localStorage for cross-tab communication
      localStorage.setItem("session_broadcast", JSON.stringify(message));

      // Clean up immediately to avoid storage bloat
      setTimeout(() => {
        localStorage.removeItem("session_broadcast");
      }, 1000);
    } catch (error) {
      console.error("Session broadcast error:", error);
    }
  },

  /**
   * Listen for session updates from other tabs
   */
  listenForSessionUpdates(
    callback: (session: SessionData | null) => void,
  ): () => void {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "session_broadcast" && e.newValue) {
        try {
          const message = JSON.parse(e.newValue);
          if (message.type === "session_update") {
            const session = message.session
              ? {
                  ...message.session,
                  createdAt: new Date(message.session.createdAt),
                  lastActivity: new Date(message.session.lastActivity),
                  expiresAt: new Date(message.session.expiresAt),
                }
              : null;

            callback(session);
          }
        } catch (error) {
          console.error("Session update parsing error:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  },

  /**
   * Synchronize session activity across tabs
   */
  syncActivityAcrossTabs(activity: string): void {
    try {
      const message = {
        type: "activity_sync",
        activity,
        timestamp: Date.now(),
      };

      localStorage.setItem("activity_sync", JSON.stringify(message));

      setTimeout(() => {
        localStorage.removeItem("activity_sync");
      }, 500);
    } catch (error) {
      console.error("Activity sync error:", error);
    }
  },
};

// CSRF protection utilities
export const CSRFUtils = {
  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  },

  /**
   * Validate CSRF token format
   */
  isValidCSRFToken(token: string): boolean {
    return /^[a-f0-9]{64}$/i.test(token);
  },

  /**
   * Get CSRF token from meta tag or storage
   */
  getCSRFTokenFromPage(): string | null {
    // Try to get from meta tag first
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      const token = metaTag.getAttribute("content");
      if (token && this.isValidCSRFToken(token)) {
        return token;
      }
    }

    // Try to get from cookie (if using cookie-based CSRF)
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "csrf_token" && value && this.isValidCSRFToken(value)) {
        return value;
      }
    }

    return null;
  },
};

// Security audit utilities
export const SecurityAuditUtils = {
  /**
   * Audit session security
   */
  auditSessionSecurity(session: SessionData): SecurityAuditResult {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Check session age
    const sessionAge = Date.now() - session.createdAt.getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (sessionAge > maxAge) {
      issues.push("Session is older than 24 hours");
    } else if (sessionAge > maxAge / 2) {
      warnings.push("Session is getting old");
    }

    // Check inactivity
    const inactivity = Date.now() - session.lastActivity.getTime();
    const maxInactivity = 30 * 60 * 1000; // 30 minutes

    if (inactivity > maxInactivity) {
      issues.push("Session has been inactive too long");
    } else if (inactivity > maxInactivity / 2) {
      warnings.push("Session has been inactive for a while");
    }

    // Check device fingerprint consistency
    if (!session.deviceFingerprint) {
      warnings.push("No device fingerprint available");
    }

    // Check CSRF token
    if (!session.csrfToken) {
      issues.push("No CSRF token associated with session");
    }

    return {
      score: SessionMonitoringUtils.calculateSessionHealth(session),
      issues,
      warnings,
      recommendation: this.getSecurityRecommendation(issues, warnings),
    };
  },

  /**
   * Get security recommendation based on audit results
   */
  getSecurityRecommendation(issues: string[], warnings: string[]): string {
    if (issues.length > 0) {
      return "Immediate action required: Re-authenticate user";
    }

    if (warnings.length > 2) {
      return "Consider refreshing session";
    }

    if (warnings.length > 0) {
      return "Monitor session closely";
    }

    return "Session is secure";
  },
};

// Type definitions
interface SecurityAuditResult {
  score: number;
  issues: string[];
  warnings: string[];
  recommendation: string;
}

// Export all utilities
export {
  SessionValidationUtils,
  SessionEncryptionUtils,
  SessionMonitoringUtils,
  CrossTabSessionUtils,
  CSRFUtils,
  SecurityAuditUtils,
};

export type { SecurityAuditResult };
