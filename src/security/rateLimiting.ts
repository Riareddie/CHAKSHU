/**
 * Rate Limiting Service
 * Client-side rate limiting to prevent abuse and complement server-side rate limiting
 */

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Default limits per endpoint
  DEFAULT_REQUESTS_PER_MINUTE: 60,
  DEFAULT_REQUESTS_PER_HOUR: 1000,

  // Specific endpoint limits
  ENDPOINTS: {
    "/api/auth/login": { perMinute: 5, perHour: 20 },
    "/api/auth/signup": { perMinute: 2, perHour: 10 },
    "/api/auth/reset-password": { perMinute: 3, perHour: 10 },
    "/api/reports/create": { perMinute: 10, perHour: 100 },
    "/api/search": { perMinute: 30, perHour: 500 },
    "/api/upload": { perMinute: 5, perHour: 50 },
  },

  // Storage keys
  STORAGE_PREFIX: "rate_limit_",
  CLEANUP_INTERVAL: 60000, // 1 minute
};

interface RateLimitEntry {
  count: number;
  windowStart: number;
  firstRequest: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class RateLimitingService {
  private storage: Map<string, RateLimitEntry> = new Map();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
    this.loadFromStorage();
  }

  /**
   * Check if request is allowed under rate limit
   */
  checkRateLimit(endpoint: string, identifier?: string): RateLimitResult {
    const now = Date.now();
    const config = this.getEndpointConfig(endpoint);
    const key = this.generateKey(endpoint, identifier);

    // Check minute-based limit
    const minuteResult = this.checkWindow(
      key + "_minute",
      config.perMinute,
      60000,
      now,
    );
    if (!minuteResult.allowed) {
      return minuteResult;
    }

    // Check hour-based limit
    const hourResult = this.checkWindow(
      key + "_hour",
      config.perHour,
      3600000,
      now,
    );
    if (!hourResult.allowed) {
      return hourResult;
    }

    // Both limits passed, increment counters
    this.incrementCounter(key + "_minute", 60000, now);
    this.incrementCounter(key + "_hour", 3600000, now);

    return {
      allowed: true,
      remaining: Math.min(minuteResult.remaining - 1, hourResult.remaining - 1),
      resetTime: Math.min(minuteResult.resetTime, hourResult.resetTime),
    };
  }

  /**
   * Get rate limit configuration for endpoint
   */
  private getEndpointConfig(endpoint: string): {
    perMinute: number;
    perHour: number;
  } {
    // Normalize endpoint (remove query parameters and trailing slashes)
    const normalizedEndpoint = endpoint.split("?")[0].replace(/\/$/, "");

    // Check for exact match
    if (RATE_LIMIT_CONFIG.ENDPOINTS[normalizedEndpoint]) {
      return RATE_LIMIT_CONFIG.ENDPOINTS[normalizedEndpoint];
    }

    // Check for pattern matches
    for (const [pattern, config] of Object.entries(
      RATE_LIMIT_CONFIG.ENDPOINTS,
    )) {
      if (this.matchesPattern(normalizedEndpoint, pattern)) {
        return config;
      }
    }

    // Return default limits
    return {
      perMinute: RATE_LIMIT_CONFIG.DEFAULT_REQUESTS_PER_MINUTE,
      perHour: RATE_LIMIT_CONFIG.DEFAULT_REQUESTS_PER_HOUR,
    };
  }

  /**
   * Check if endpoint matches pattern
   */
  private matchesPattern(endpoint: string, pattern: string): boolean {
    // Convert pattern to regex (simple wildcard support)
    const regexPattern = pattern.replace(/\*/g, ".*").replace(/\?/g, "\\?");

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(endpoint);
  }

  /**
   * Generate storage key for rate limiting
   */
  private generateKey(endpoint: string, identifier?: string): string {
    const base = identifier || this.getClientIdentifier();
    return `${RATE_LIMIT_CONFIG.STORAGE_PREFIX}${base}_${endpoint}`;
  }

  /**
   * Get client identifier for rate limiting
   */
  private getClientIdentifier(): string {
    // Use a combination of factors to identify the client
    const factors = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ];

    // Create a hash of the factors
    return btoa(factors.join("|")).substring(0, 16);
  }

  /**
   * Check rate limit for a specific time window
   */
  private checkWindow(
    key: string,
    limit: number,
    windowSize: number,
    now: number,
  ): RateLimitResult {
    const entry = this.storage.get(key);

    if (!entry) {
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowSize,
      };
    }

    // Check if window has expired
    if (now - entry.windowStart >= windowSize) {
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowSize,
      };
    }

    // Check if limit is exceeded
    if (entry.count >= limit) {
      const resetTime = entry.windowStart + windowSize;
      return {
        allowed: false,
        remaining: 0,
        resetTime,
        retryAfter: Math.ceil((resetTime - now) / 1000),
      };
    }

    return {
      allowed: true,
      remaining: limit - entry.count - 1,
      resetTime: entry.windowStart + windowSize,
    };
  }

  /**
   * Increment counter for rate limiting
   */
  private incrementCounter(key: string, windowSize: number, now: number): void {
    const entry = this.storage.get(key);

    if (!entry || now - entry.windowStart >= windowSize) {
      // Start new window
      this.storage.set(key, {
        count: 1,
        windowStart: now,
        firstRequest: now,
      });
    } else {
      // Increment existing window
      entry.count++;
      this.storage.set(key, entry);
    }

    this.saveToStorage();
  }

  /**
   * Start cleanup timer to remove expired entries
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL);
  }

  /**
   * Clean up expired rate limit entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.storage.entries()) {
      // Remove entries older than 1 hour
      if (now - entry.firstRequest > 3600000) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => {
      this.storage.delete(key);
    });

    if (expiredKeys.length > 0) {
      this.saveToStorage();
    }
  }

  /**
   * Save rate limit data to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.storage.entries());
      localStorage.setItem("rate_limit_data", JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save rate limit data to localStorage:", error);
    }
  }

  /**
   * Load rate limit data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem("rate_limit_data");
      if (data) {
        const entries = JSON.parse(data);
        this.storage = new Map(entries);
      }
    } catch (error) {
      console.warn("Failed to load rate limit data from localStorage:", error);
      this.storage = new Map();
    }
  }

  /**
   * Reset rate limits for specific endpoint or all endpoints
   */
  reset(endpoint?: string, identifier?: string): void {
    if (endpoint) {
      const key = this.generateKey(endpoint, identifier);
      this.storage.delete(key + "_minute");
      this.storage.delete(key + "_hour");
    } else {
      this.storage.clear();
    }

    this.saveToStorage();
  }

  /**
   * Get current rate limit status
   */
  getStatus(
    endpoint: string,
    identifier?: string,
  ): {
    minuteLimit: RateLimitResult;
    hourLimit: RateLimitResult;
  } {
    const now = Date.now();
    const config = this.getEndpointConfig(endpoint);
    const key = this.generateKey(endpoint, identifier);

    return {
      minuteLimit: this.checkWindow(
        key + "_minute",
        config.perMinute,
        60000,
        now,
      ),
      hourLimit: this.checkWindow(key + "_hour", config.perHour, 3600000, now),
    };
  }

  /**
   * Check if client is currently rate limited
   */
  isRateLimited(endpoint: string, identifier?: string): boolean {
    const result = this.checkRateLimit(endpoint, identifier);
    return !result.allowed;
  }

  /**
   * Get time until rate limit resets
   */
  getTimeUntilReset(endpoint: string, identifier?: string): number {
    const status = this.getStatus(endpoint, identifier);
    const now = Date.now();

    return Math.min(
      Math.max(0, status.minuteLimit.resetTime - now),
      Math.max(0, status.hourLimit.resetTime - now),
    );
  }

  /**
   * Create a rate-limited fetch wrapper
   */
  createRateLimitedFetch() {
    return async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url = typeof input === "string" ? input : input.toString();
      const endpoint = new URL(url, window.location.origin).pathname;

      // Check rate limit
      const rateLimitResult = this.checkRateLimit(endpoint);

      if (!rateLimitResult.allowed) {
        const error = new Error("Rate limit exceeded");
        (error as any).rateLimitInfo = rateLimitResult;
        throw error;
      }

      // Make the request
      try {
        const response = await fetch(input, init);

        // Check if server returned rate limit headers
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          if (retryAfter) {
            // Update local rate limit based on server response
            const retryAfterMs = parseInt(retryAfter) * 1000;
            this.updateRateLimitFromServer(endpoint, retryAfterMs);
          }
        }

        return response;
      } catch (error) {
        throw error;
      }
    };
  }

  /**
   * Update rate limit based on server response
   */
  private updateRateLimitFromServer(
    endpoint: string,
    retryAfterMs: number,
  ): void {
    const now = Date.now();
    const key = this.generateKey(endpoint);
    const config = this.getEndpointConfig(endpoint);

    // Set rate limit to maximum to prevent further requests
    this.storage.set(key + "_minute", {
      count: config.perMinute,
      windowStart: now,
      firstRequest: now,
    });

    this.storage.set(key + "_hour", {
      count: config.perHour,
      windowStart: now,
      firstRequest: now,
    });

    this.saveToStorage();
  }

  /**
   * Destroy rate limiting service
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    this.storage.clear();
  }
}

// Create singleton instance
export const rateLimiting = new RateLimitingService();

// React hook for rate limiting
export const useRateLimiting = () => {
  return {
    checkRateLimit: (endpoint: string, identifier?: string) =>
      rateLimiting.checkRateLimit(endpoint, identifier),
    isRateLimited: (endpoint: string, identifier?: string) =>
      rateLimiting.isRateLimited(endpoint, identifier),
    getStatus: (endpoint: string, identifier?: string) =>
      rateLimiting.getStatus(endpoint, identifier),
    getTimeUntilReset: (endpoint: string, identifier?: string) =>
      rateLimiting.getTimeUntilReset(endpoint, identifier),
    createRateLimitedFetch: () => rateLimiting.createRateLimitedFetch(),
    reset: (endpoint?: string, identifier?: string) =>
      rateLimiting.reset(endpoint, identifier),
  };
};

// Export types and configuration
export { RATE_LIMIT_CONFIG };
export type { RateLimitResult, RateLimitEntry };
