/**
 * CSRF Protection Service
 * Provides comprehensive CSRF protection with token validation and secure headers
 */

import { sessionManager } from "@/services/sessionManager";

// CSRF Configuration
const CSRF_CONFIG = {
  TOKEN_LENGTH: 32,
  TOKEN_HEADER: "X-CSRF-Token",
  TOKEN_PARAM: "csrf_token",
  DOUBLE_SUBMIT_COOKIE: "csrf_token",
  TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
  REFRESH_THRESHOLD: 10 * 60 * 1000, // 10 minutes
  SAFE_METHODS: ["GET", "HEAD", "OPTIONS", "TRACE"],
  UNSAFE_METHODS: ["POST", "PUT", "PATCH", "DELETE"],
};

interface CSRFToken {
  token: string;
  expiresAt: Date;
  issuedAt: Date;
  fingerprint: string;
}

class CSRFProtectionService {
  private currentToken: CSRFToken | null = null;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeCSRFProtection();
  }

  /**
   * Initialize CSRF protection
   */
  private initializeCSRFProtection(): void {
    // Load existing token from server or generate new one
    this.loadOrGenerateToken();

    // Set up token refresh timer
    this.setupTokenRefresh();

    // Intercept fetch requests to add CSRF tokens
    this.interceptFetchRequests();

    // Set up form submission protection
    this.setupFormProtection();
  }

  /**
   * Load existing token or generate a new one
   */
  private async loadOrGenerateToken(): Promise<void> {
    try {
      // Try to get token from server
      const response = await fetch("/api/csrf/token", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const tokenData = await response.json();
        this.currentToken = {
          token: tokenData.token,
          expiresAt: new Date(tokenData.expiresAt),
          issuedAt: new Date(tokenData.issuedAt),
          fingerprint: this.generateFingerprint(),
        };
      } else {
        throw new Error("Failed to load CSRF token from server");
      }
    } catch (error) {
      console.warn(
        "Failed to load CSRF token, generating client-side token:",
        error,
      );
      this.generateToken();
    }
  }

  /**
   * Generate a new CSRF token
   */
  private generateToken(): void {
    const token = this.generateSecureToken();
    const now = new Date();

    this.currentToken = {
      token,
      expiresAt: new Date(now.getTime() + CSRF_CONFIG.TOKEN_EXPIRY),
      issuedAt: now,
      fingerprint: this.generateFingerprint(),
    };

    // Send token to server for validation
    this.syncTokenWithServer();
  }

  /**
   * Generate cryptographically secure token
   */
  private generateSecureToken(): string {
    const array = new Uint8Array(CSRF_CONFIG.TOKEN_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }

  /**
   * Generate device fingerprint for additional validation
   */
  private generateFingerprint(): string {
    const data = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      sessionId: sessionManager.getCurrentSession()?.sessionId,
    };

    return btoa(JSON.stringify(data));
  }

  /**
   * Sync token with server
   */
  private async syncTokenWithServer(): Promise<void> {
    if (!this.currentToken) return;

    try {
      await fetch("/api/csrf/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: this.currentToken.token,
          fingerprint: this.currentToken.fingerprint,
          expiresAt: this.currentToken.expiresAt.toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to sync CSRF token with server:", error);
    }
  }

  /**
   * Setup automatic token refresh
   */
  private setupTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
    }

    this.tokenRefreshTimer = setInterval(() => {
      if (this.shouldRefreshToken()) {
        this.refreshToken();
      }
    }, 60000); // Check every minute
  }

  /**
   * Check if token should be refreshed
   */
  private shouldRefreshToken(): boolean {
    if (!this.currentToken) return true;

    const timeUntilExpiry = this.currentToken.expiresAt.getTime() - Date.now();
    return timeUntilExpiry <= CSRF_CONFIG.REFRESH_THRESHOLD;
  }

  /**
   * Refresh CSRF token
   */
  private async refreshToken(): Promise<void> {
    try {
      const response = await fetch("/api/csrf/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [CSRF_CONFIG.TOKEN_HEADER]: this.getToken() || "",
        },
        credentials: "include",
        body: JSON.stringify({
          fingerprint: this.generateFingerprint(),
        }),
      });

      if (response.ok) {
        const tokenData = await response.json();
        this.currentToken = {
          token: tokenData.token,
          expiresAt: new Date(tokenData.expiresAt),
          issuedAt: new Date(),
          fingerprint: this.generateFingerprint(),
        };
      } else {
        // If refresh fails, generate new token
        this.generateToken();
      }
    } catch (error) {
      console.error("CSRF token refresh failed:", error);
      this.generateToken();
    }
  }

  /**
   * Intercept fetch requests to add CSRF tokens
   */
  private interceptFetchRequests(): void {
    const originalFetch = window.fetch;

    window.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const request = new Request(input, init);
      const method = request.method.toUpperCase();

      // Add CSRF token for unsafe methods
      if (CSRF_CONFIG.UNSAFE_METHODS.includes(method)) {
        const token = this.getToken();
        if (token) {
          request.headers.set(CSRF_CONFIG.TOKEN_HEADER, token);
        }
      }

      return originalFetch(request);
    };
  }

  /**
   * Setup form submission protection
   */
  private setupFormProtection(): void {
    document.addEventListener("submit", (event) => {
      const form = event.target as HTMLFormElement;
      if (!form || form.method.toLowerCase() === "get") return;

      // Check if form already has CSRF token
      const existingTokenInput = form.querySelector(
        `input[name="${CSRF_CONFIG.TOKEN_PARAM}"]`,
      );
      if (existingTokenInput) return;

      // Add CSRF token to form
      const token = this.getToken();
      if (token) {
        const tokenInput = document.createElement("input");
        tokenInput.type = "hidden";
        tokenInput.name = CSRF_CONFIG.TOKEN_PARAM;
        tokenInput.value = token;
        form.appendChild(tokenInput);
      }
    });
  }

  /**
   * Get current CSRF token
   */
  getToken(): string | null {
    if (!this.currentToken || this.isTokenExpired()) {
      this.generateToken();
    }

    return this.currentToken?.token || null;
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(): boolean {
    if (!this.currentToken) return true;
    return this.currentToken.expiresAt <= new Date();
  }

  /**
   * Validate CSRF token
   */
  validateToken(token: string, fingerprint?: string): boolean {
    if (!this.currentToken || !token) return false;

    // Check token match
    if (this.currentToken.token !== token) return false;

    // Check expiry
    if (this.isTokenExpired()) return false;

    // Check fingerprint if provided
    if (fingerprint && this.currentToken.fingerprint !== fingerprint) {
      console.warn("CSRF: Fingerprint mismatch detected");
      return false;
    }

    return true;
  }

  /**
   * Get CSRF token for API requests
   */
  getTokenForRequest(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { [CSRF_CONFIG.TOKEN_HEADER]: token } : {};
  }

  /**
   * Add CSRF token to form data
   */
  addTokenToFormData(formData: FormData): FormData {
    const token = this.getToken();
    if (token) {
      formData.append(CSRF_CONFIG.TOKEN_PARAM, token);
    }
    return formData;
  }

  /**
   * Add CSRF token to URL parameters
   */
  addTokenToURLParams(params: URLSearchParams): URLSearchParams {
    const token = this.getToken();
    if (token) {
      params.append(CSRF_CONFIG.TOKEN_PARAM, token);
    }
    return params;
  }

  /**
   * Create CSRF-protected fetch wrapper
   */
  createProtectedFetch() {
    return async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const requestInit = init || {};
      const method = requestInit.method?.toUpperCase() || "GET";

      // Add CSRF token for unsafe methods
      if (CSRF_CONFIG.UNSAFE_METHODS.includes(method)) {
        const headers = new Headers(requestInit.headers);
        const token = this.getToken();

        if (token) {
          headers.set(CSRF_CONFIG.TOKEN_HEADER, token);
        }

        requestInit.headers = headers;
      }

      // Always include credentials for CSRF protection
      requestInit.credentials = "include";

      return fetch(input, requestInit);
    };
  }

  /**
   * Check if request is safe (doesn't need CSRF protection)
   */
  isSafeRequest(method: string): boolean {
    return CSRF_CONFIG.SAFE_METHODS.includes(method.toUpperCase());
  }

  /**
   * Destroy CSRF protection (cleanup)
   */
  destroy(): void {
    if (this.tokenRefreshTimer) {
      clearInterval(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }

    this.currentToken = null;
  }
}

// Create singleton instance
export const csrfProtection = new CSRFProtectionService();

// React hook for CSRF protection
export const useCSRFProtection = () => {
  return {
    getToken: () => csrfProtection.getToken(),
    getTokenForRequest: () => csrfProtection.getTokenForRequest(),
    addTokenToFormData: (formData: FormData) =>
      csrfProtection.addTokenToFormData(formData),
    addTokenToURLParams: (params: URLSearchParams) =>
      csrfProtection.addTokenToURLParams(params),
    validateToken: (token: string, fingerprint?: string) =>
      csrfProtection.validateToken(token, fingerprint),
    createProtectedFetch: () => csrfProtection.createProtectedFetch(),
    isSafeRequest: (method: string) => csrfProtection.isSafeRequest(method),
  };
};

// Export configuration and types
export { CSRF_CONFIG };
export type { CSRFToken };
