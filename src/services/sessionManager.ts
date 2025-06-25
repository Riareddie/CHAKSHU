/**
 * Secure Session Management Service
 * Implements HTTP-only cookies, session timeout, activity tracking,
 * session validation, cleanup, persistence, conflict handling,
 * monitoring, encryption, and CSRF protection
 */

import { toast } from "@/hooks/use-toast";

// Session configuration
export const SESSION_CONFIG = {
  TIMEOUT_DURATION: 30 * 60 * 1000, // 30 minutes
  WARNING_TIME: 5 * 60 * 1000, // 5 minutes before expiry
  ACTIVITY_CHECK_INTERVAL: 30 * 1000, // 30 seconds
  HEARTBEAT_INTERVAL: 60 * 1000, // 1 minute
  MAX_CONCURRENT_SESSIONS: 3,
  SESSION_STORAGE_KEY: "session_data",
  CSRF_HEADER_NAME: "X-CSRF-Token",
  API_ENDPOINT: "/api/auth",
};

// Session interfaces
export interface SessionData {
  sessionId: string;
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  csrfToken: string;
  isActive: boolean;
  deviceFingerprint: string;
}

export interface SessionActivity {
  action: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  path: string;
  metadata?: Record<string, any>;
}

export interface SessionConflict {
  sessionId: string;
  location: string;
  timestamp: Date;
  action: "created" | "terminated" | "conflict";
}

class SessionManager {
  private currentSession: SessionData | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private csrfToken: string | null = null;
  private activityListeners: Set<() => void> = new Set();
  private sessionListeners: Set<(session: SessionData | null) => void> =
    new Set();
  private isTabActive = true;
  private deviceFingerprint: string = "";

  constructor() {
    this.initializeDeviceFingerprint();
    this.setupTabVisibilityHandling();
    this.setupBeforeUnloadHandling();
    this.startSessionValidation();
  }

  /**
   * Initialize device fingerprinting for security
   */
  private initializeDeviceFingerprint(): void {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Device fingerprint", 2, 2);
    }

    const fingerprint = btoa(
      JSON.stringify({
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        canvas: canvas.toDataURL(),
        webgl: this.getWebGLFingerprint(),
      }),
    );

    this.deviceFingerprint = fingerprint;
  }

  /**
   * Get WebGL fingerprint for enhanced device identification
   */
  private getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return "no-webgl";

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (!debugInfo) return "no-debug-info";

      return `${gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}_${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`;
    } catch {
      return "webgl-error";
    }
  }

  /**
   * Setup tab visibility handling for session management
   */
  private setupTabVisibilityHandling(): void {
    document.addEventListener("visibilitychange", () => {
      this.isTabActive = !document.hidden;

      if (this.isTabActive && this.currentSession) {
        // Validate session when tab becomes active
        this.validateSession();
        this.updateActivity("tab_active");
      }
    });

    // Handle cross-tab session synchronization
    window.addEventListener("storage", (e) => {
      if (e.key === SESSION_CONFIG.SESSION_STORAGE_KEY) {
        this.handleCrossTabSessionChange(e.newValue);
      }
    });

    // Handle focus events
    window.addEventListener("focus", () => {
      if (this.currentSession) {
        this.validateSession();
        this.updateActivity("window_focus");
      }
    });
  }

  /**
   * Setup beforeunload handling for session cleanup
   */
  private setupBeforeUnloadHandling(): void {
    window.addEventListener("beforeunload", () => {
      if (this.currentSession) {
        // Send cleanup signal
        navigator.sendBeacon(
          `${SESSION_CONFIG.API_ENDPOINT}/cleanup`,
          JSON.stringify({
            sessionId: this.currentSession.sessionId,
            action: "tab_close",
          }),
        );
      }
    });
  }

  /**
   * Start periodic session validation
   */
  private startSessionValidation(): void {
    setInterval(() => {
      if (this.currentSession && this.isTabActive) {
        this.validateSession();
      }
    }, SESSION_CONFIG.ACTIVITY_CHECK_INTERVAL);
  }

  /**
   * Create new session with security measures
   */
  async createSession(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<{
    success: boolean;
    session?: SessionData;
    error?: string;
    requiresTwoFactor?: boolean;
    sessionConflict?: SessionConflict;
  }> {
    try {
      const response = await this.makeSecureRequest("/session/create", {
        method: "POST",
        body: JSON.stringify({
          ...credentials,
          deviceFingerprint: this.deviceFingerprint,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Session creation failed",
          requiresTwoFactor: data.requiresTwoFactor,
          sessionConflict: data.sessionConflict,
        };
      }

      // Setup new session
      this.currentSession = {
        ...data.session,
        createdAt: new Date(data.session.createdAt),
        lastActivity: new Date(),
        expiresAt: new Date(Date.now() + SESSION_CONFIG.TIMEOUT_DURATION),
      };

      this.csrfToken = data.csrfToken;

      // Start session monitoring
      this.startSessionMonitoring();

      // Store session data for cross-tab sync (encrypted)
      this.syncSessionAcrossTabs();

      // Track session creation
      this.trackActivity("session_created", {
        sessionId: this.currentSession.sessionId,
        deviceFingerprint: this.deviceFingerprint,
      });

      // Notify listeners
      this.notifySessionListeners(this.currentSession);

      return {
        success: true,
        session: this.currentSession,
      };
    } catch (error) {
      console.error("Session creation error:", error);
      return {
        success: false,
        error: "Network error during session creation",
      };
    }
  }

  /**
   * Validate current session
   */
  async validateSession(): Promise<boolean> {
    if (!this.currentSession) return false;

    try {
      const response = await this.makeSecureRequest("/session/validate", {
        method: "POST",
        body: JSON.stringify({
          sessionId: this.currentSession.sessionId,
          deviceFingerprint: this.deviceFingerprint,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.handleSessionInvalid("Session validation failed");
          return false;
        }
        throw new Error("Session validation request failed");
      }

      const data = await response.json();

      if (!data.valid) {
        this.handleSessionInvalid(data.reason || "Session is no longer valid");
        return false;
      }

      // Update session data if provided
      if (data.session) {
        this.currentSession = {
          ...this.currentSession,
          ...data.session,
          lastActivity: new Date(),
        };
        this.syncSessionAcrossTabs();
      }

      return true;
    } catch (error) {
      console.error("Session validation error:", error);
      // Don't invalidate session on network errors
      return true;
    }
  }

  /**
   * Update user activity and extend session
   */
  updateActivity(
    action: string = "user_activity",
    metadata?: Record<string, any>,
  ): void {
    if (!this.currentSession) return;

    this.currentSession.lastActivity = new Date();
    this.currentSession.expiresAt = new Date(
      Date.now() + SESSION_CONFIG.TIMEOUT_DURATION,
    );

    // Reset warning timer
    this.resetWarningTimer();

    // Track activity
    this.trackActivity(action, metadata);

    // Sync across tabs
    this.syncSessionAcrossTabs();

    // Notify activity listeners
    this.activityListeners.forEach((listener) => listener());

    // Send heartbeat to server (debounced)
    this.debouncedHeartbeat();
  }

  /**
   * Start session monitoring (timers and activity tracking)
   */
  private startSessionMonitoring(): void {
    this.stopSessionMonitoring(); // Clear existing timers

    // Activity check timer
    this.activityTimer = setInterval(() => {
      if (!this.currentSession) return;

      const timeSinceActivity =
        Date.now() - this.currentSession.lastActivity.getTime();

      if (timeSinceActivity >= SESSION_CONFIG.TIMEOUT_DURATION) {
        this.handleSessionTimeout();
      }
    }, SESSION_CONFIG.ACTIVITY_CHECK_INTERVAL);

    // Heartbeat timer
    this.heartbeatTimer = setInterval(() => {
      if (this.currentSession && this.isTabActive) {
        this.sendHeartbeat();
      }
    }, SESSION_CONFIG.HEARTBEAT_INTERVAL);

    // Warning timer
    this.resetWarningTimer();

    // Setup activity listeners
    this.setupActivityListeners();
  }

  /**
   * Setup DOM activity listeners
   */
  private setupActivityListeners(): void {
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "focus",
      "blur",
    ];

    const activityHandler = () => {
      this.updateActivity("dom_interaction");
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    // Store cleanup function
    this.activityListeners.add(() => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, activityHandler);
      });
    });
  }

  /**
   * Reset session warning timer
   */
  private resetWarningTimer(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    this.warningTimer = setTimeout(() => {
      this.showSessionWarning();
    }, SESSION_CONFIG.TIMEOUT_DURATION - SESSION_CONFIG.WARNING_TIME);
  }

  /**
   * Show session expiry warning
   */
  private showSessionWarning(): void {
    toast({
      title: "Session Expiring Soon",
      description: "Your session will expire in 5 minutes. Click to extend it.",
      duration: 0, // Don't auto-dismiss
      action: {
        label: "Extend Session",
        onClick: () => this.extendSession(),
      },
    });
  }

  /**
   * Extend current session
   */
  async extendSession(): Promise<boolean> {
    if (!this.currentSession) return false;

    try {
      const response = await this.makeSecureRequest("/session/extend", {
        method: "POST",
        body: JSON.stringify({
          sessionId: this.currentSession.sessionId,
        }),
      });

      if (response.ok) {
        this.updateActivity("session_extended");
        toast({
          title: "Session Extended",
          description: "Your session has been extended successfully.",
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Session extension error:", error);
      return false;
    }
  }

  /**
   * Handle session timeout
   */
  private handleSessionTimeout(): void {
    this.trackActivity("session_timeout");

    toast({
      title: "Session Expired",
      description: "Your session has expired due to inactivity.",
      variant: "destructive",
    });

    this.destroySession();
  }

  /**
   * Handle invalid session
   */
  private handleSessionInvalid(reason: string): void {
    this.trackActivity("session_invalid", { reason });

    toast({
      title: "Session Invalid",
      description: reason,
      variant: "destructive",
    });

    this.destroySession();
  }

  /**
   * Send heartbeat to server
   */
  private async sendHeartbeat(): Promise<void> {
    if (!this.currentSession) return;

    try {
      await this.makeSecureRequest("/session/heartbeat", {
        method: "POST",
        body: JSON.stringify({
          sessionId: this.currentSession.sessionId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Heartbeat error:", error);
    }
  }

  /**
   * Debounced heartbeat to avoid too many requests
   */
  private debouncedHeartbeat = this.debounce(() => {
    this.sendHeartbeat();
  }, 5000);

  /**
   * Destroy current session
   */
  async destroySession(): Promise<void> {
    if (!this.currentSession) return;

    try {
      // Notify server
      await this.makeSecureRequest("/session/destroy", {
        method: "POST",
        body: JSON.stringify({
          sessionId: this.currentSession.sessionId,
        }),
      });
    } catch (error) {
      console.error("Session destruction error:", error);
    }

    // Clean up local state
    this.stopSessionMonitoring();
    this.currentSession = null;
    this.csrfToken = null;

    // Clear cross-tab storage
    localStorage.removeItem(SESSION_CONFIG.SESSION_STORAGE_KEY);

    // Notify listeners
    this.notifySessionListeners(null);

    // Redirect to login
    window.location.href = "/login";
  }

  /**
   * Stop session monitoring
   */
  private stopSessionMonitoring(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }

    // Cleanup activity listeners
    this.activityListeners.forEach((cleanup) => cleanup());
    this.activityListeners.clear();
  }

  /**
   * Sync session data across browser tabs
   */
  private syncSessionAcrossTabs(): void {
    if (!this.currentSession) return;

    const sessionData = this.encryptSessionData(this.currentSession);
    localStorage.setItem(SESSION_CONFIG.SESSION_STORAGE_KEY, sessionData);
  }

  /**
   * Handle cross-tab session changes
   */
  private handleCrossTabSessionChange(newValue: string | null): void {
    if (!newValue) {
      // Session destroyed in another tab
      if (this.currentSession) {
        this.currentSession = null;
        this.notifySessionListeners(null);
        this.stopSessionMonitoring();
      }
      return;
    }

    try {
      const sessionData = this.decryptSessionData(newValue);

      if (
        !this.currentSession ||
        sessionData.sessionId !== this.currentSession.sessionId
      ) {
        // New session or session change
        this.currentSession = sessionData;
        this.notifySessionListeners(this.currentSession);
        this.startSessionMonitoring();
      } else {
        // Update existing session data
        this.currentSession = sessionData;
      }
    } catch (error) {
      console.error("Cross-tab session sync error:", error);
    }
  }

  /**
   * Encrypt session data for storage
   */
  private encryptSessionData(session: SessionData): string {
    // Simple encryption for demo - in production use proper encryption
    const data = JSON.stringify(session);
    return btoa(encodeURIComponent(data));
  }

  /**
   * Decrypt session data from storage
   */
  private decryptSessionData(encryptedData: string): SessionData {
    // Simple decryption for demo - in production use proper decryption
    const data = decodeURIComponent(atob(encryptedData));
    const session = JSON.parse(data);

    return {
      ...session,
      createdAt: new Date(session.createdAt),
      lastActivity: new Date(session.lastActivity),
      expiresAt: new Date(session.expiresAt),
    };
  }

  /**
   * Track user activity for security auditing
   */
  private async trackActivity(
    action: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      const activity: SessionActivity = {
        action,
        timestamp: new Date(),
        ipAddress: "client-side", // Would be set by server
        userAgent: navigator.userAgent,
        path: window.location.pathname,
        metadata,
      };

      // Send to server for auditing
      navigator.sendBeacon(
        `${SESSION_CONFIG.API_ENDPOINT}/activity`,
        JSON.stringify(activity),
      );
    } catch (error) {
      console.error("Activity tracking error:", error);
    }
  }

  /**
   * Make secure request with CSRF protection
   */
  private async makeSecureRequest(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const headers = new Headers(options.headers);

    // Add CSRF token
    if (this.csrfToken) {
      headers.set(SESSION_CONFIG.CSRF_HEADER_NAME, this.csrfToken);
    }

    // Add device fingerprint
    headers.set("X-Device-Fingerprint", this.deviceFingerprint);
    headers.set("Content-Type", "application/json");

    return fetch(`${SESSION_CONFIG.API_ENDPOINT}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // Include HTTP-only cookies
    });
  }

  /**
   * Get current CSRF token
   */
  getCSRFToken(): string | null {
    return this.csrfToken;
  }

  /**
   * Get current session
   */
  getCurrentSession(): SessionData | null {
    return this.currentSession;
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    return (
      this.currentSession !== null &&
      this.currentSession.expiresAt > new Date() &&
      this.currentSession.isActive
    );
  }

  /**
   * Add session listener
   */
  addSessionListener(
    listener: (session: SessionData | null) => void,
  ): () => void {
    this.sessionListeners.add(listener);

    // Immediately call with current session
    listener(this.currentSession);

    return () => {
      this.sessionListeners.delete(listener);
    };
  }

  /**
   * Notify session listeners
   */
  private notifySessionListeners(session: SessionData | null): void {
    this.sessionListeners.forEach((listener) => listener(session));
  }

  /**
   * Utility: Debounce function
   */
  private debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Export types
export type { SessionData, SessionActivity, SessionConflict };
