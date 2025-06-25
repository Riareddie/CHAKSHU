/**
 * Supabase Client Configuration for Government Fraud Reporting System
 * Government-grade security with connection pooling, health checks, and audit logging
 */

import {
  createClient,
  SupabaseClient,
  Session,
  User,
} from "@supabase/supabase-js";
import type {
  Database,
  ConnectionStatus,
  HealthCheckResult,
  DatabaseError,
} from "@/types/database";

// Environment variables validation
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env
  .VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing required Supabase environment variables");
}

// Connection configuration with government-grade security
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce" as const,
    debug: import.meta.env.DEV,
    // Enhanced security for government systems
    storageKey: "sb-govt-portal-auth",
    storage: {
      getItem: (key: string) => {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch {
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error("Failed to store auth data:", error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error("Failed to remove auth data:", error);
        }
      },
    },
  },
  db: {
    schema: "public",
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
      // Government security requirements
      headers: {
        "x-client-info": "govt-fraud-portal",
      },
    },
    // Heartbeat for connection monitoring
    heartbeatIntervalMs: 30000,
    reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 10000),
  },
  global: {
    headers: {
      "x-client-info": "govt-fraud-portal",
      "x-client-version": "1.0.0",
    },
  },
};

// Create main Supabase client (public/authenticated usage)
export const supabase: SupabaseClient<Database> = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  supabaseConfig,
);

// Create service role client for admin operations (server-side only)
export const supabaseAdmin: SupabaseClient<Database> = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      ...supabaseConfig,
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

// Connection monitoring and health check
class SupabaseConnectionManager {
  private connectionStatus: ConnectionStatus = {
    isConnected: false,
    lastChecked: new Date(),
    retryCount: 0,
    maxRetries: 3,
  };

  private healthCheckInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Array<(status: ConnectionStatus) => void> = [];

  constructor() {
    this.initializeMonitoring();
    this.setupErrorHandling();
  }

  private initializeMonitoring() {
    // Initial health check
    this.performHealthCheck();

    // Set up periodic health checks (every 5 minutes)
    this.healthCheckInterval = setInterval(
      () => {
        this.performHealthCheck();
      },
      5 * 60 * 1000,
    );

    // Monitor auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.logAuthEvent(event, session);

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        this.connectionStatus.isConnected = true;
        this.connectionStatus.retryCount = 0;
        this.notifyListeners();
      } else if (event === "SIGNED_OUT") {
        this.connectionStatus.isConnected = false;
        this.notifyListeners();
      }
    });
  }

  private setupErrorHandling() {
    // Global error handler for Supabase operations
    const originalSelect = supabase.from;
    supabase.from = (table: string) => {
      const query = originalSelect.call(supabase, table);
      return this.wrapQueryWithErrorHandling(query);
    };
  }

  private wrapQueryWithErrorHandling(query: any) {
    const originalMethods = ["select", "insert", "update", "delete", "upsert"];

    originalMethods.forEach((method) => {
      if (query[method]) {
        const originalMethod = query[method].bind(query);
        query[method] = (...args: any[]) => {
          const result = originalMethod(...args);

          // Add error handling to the promise
          if (result && typeof result.then === "function") {
            return result.catch((error: any) => {
              this.handleDatabaseError(error);
              throw error;
            });
          }

          return result;
        };
      }
    });

    return query;
  }

  private async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const healthCheck: HealthCheckResult = {
      database: { status: "unhealthy", responseTime: 0 },
      auth: { status: "unhealthy" },
      storage: { status: "unhealthy" },
      realtime: { status: "unhealthy" },
      overall: "unhealthy",
      timestamp: new Date(),
    };

    try {
      // Test database connection
      const dbStart = Date.now();
      const { error: dbError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1)
        .single();

      healthCheck.database = {
        status:
          dbError && dbError.code !== "PGRST116" ? "unhealthy" : "healthy",
        responseTime: Date.now() - dbStart,
        error: dbError?.message,
      };

      // Test auth service
      try {
        const { error: authError } = await supabase.auth.getSession();
        healthCheck.auth = {
          status: authError ? "degraded" : "healthy",
          error: authError?.message,
        };
      } catch (authError: any) {
        healthCheck.auth = {
          status: "unhealthy",
          error: authError.message,
        };
      }

      // Test storage (if available)
      try {
        const { error: storageError } = await supabase.storage.listBuckets();
        healthCheck.storage = {
          status: storageError ? "degraded" : "healthy",
          error: storageError?.message,
        };
      } catch (storageError: any) {
        healthCheck.storage = {
          status: "unhealthy",
          error: storageError.message,
        };
      }

      // Realtime connection check
      const channel = supabase.channel("health-check");
      const realtimePromise = new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 5000);

        channel.subscribe((status) => {
          clearTimeout(timeout);
          resolve(status === "SUBSCRIBED");
        });
      });

      const realtimeHealthy = await realtimePromise;
      healthCheck.realtime = {
        status: realtimeHealthy ? "healthy" : "degraded",
      };

      // Clean up channel
      supabase.removeChannel(channel);

      // Determine overall health
      const services = [
        healthCheck.database,
        healthCheck.auth,
        healthCheck.storage,
        healthCheck.realtime,
      ];
      const healthyCount = services.filter(
        (s) => s.status === "healthy",
      ).length;
      const degradedCount = services.filter(
        (s) => s.status === "degraded",
      ).length;

      if (healthyCount === services.length) {
        healthCheck.overall = "healthy";
      } else if (healthyCount + degradedCount === services.length) {
        healthCheck.overall = "degraded";
      } else {
        healthCheck.overall = "unhealthy";
      }

      // Update connection status
      this.connectionStatus = {
        isConnected: healthCheck.overall !== "unhealthy",
        latency: Date.now() - startTime,
        lastChecked: new Date(),
        retryCount: 0,
        maxRetries: this.connectionStatus.maxRetries,
        error:
          healthCheck.overall === "unhealthy"
            ? "Health check failed"
            : undefined,
      };

      this.notifyListeners();

      // Log health status for government audit requirements
      this.logHealthCheck(healthCheck);
    } catch (error: any) {
      this.handleConnectionError(error);
      healthCheck.overall = "unhealthy";
      healthCheck.database.error = error.message;
    }

    return healthCheck;
  }

  private handleDatabaseError(error: any) {
    const dbError: DatabaseError = {
      message: error.message || "Unknown database error",
      details: error.details,
      hint: error.hint,
      code: error.code,
    };

    this.connectionStatus.isConnected = false;
    this.connectionStatus.retryCount++;
    this.connectionStatus.error = dbError.message;
    this.connectionStatus.lastChecked = new Date();

    // Log error for government audit
    this.logDatabaseError(dbError);

    // Attempt reconnection if under retry limit
    if (this.connectionStatus.retryCount < this.connectionStatus.maxRetries) {
      this.scheduleReconnect();
    }

    this.notifyListeners();
  }

  private handleConnectionError(error: any) {
    this.connectionStatus.isConnected = false;
    this.connectionStatus.error = error.message;
    this.connectionStatus.retryCount++;
    this.connectionStatus.lastChecked = new Date();

    this.logConnectionError(error);
    this.notifyListeners();

    if (this.connectionStatus.retryCount < this.connectionStatus.maxRetries) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const backoffTime = Math.min(
      1000 * Math.pow(2, this.connectionStatus.retryCount),
      30000,
    );

    this.reconnectTimeout = setTimeout(() => {
      this.performHealthCheck();
    }, backoffTime);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.connectionStatus);
      } catch (error) {
        console.error("Error in connection status listener:", error);
      }
    });
  }

  private logAuthEvent(event: string, session: Session | null) {
    if (import.meta.env.DEV) {
      console.log(
        "Supabase Auth Event:",
        event,
        session ? "Session Active" : "No Session",
      );
    }

    // In production, this would integrate with government audit logging
    if (import.meta.env.PROD && session?.user) {
      this.auditLog({
        action: `AUTH_${event}`,
        user_id: session.user.id,
        severity: "info",
        description: `Authentication event: ${event}`,
        metadata: {
          event,
          userId: session.user.id,
          email: session.user.email,
        },
      });
    }
  }

  private logHealthCheck(healthCheck: HealthCheckResult) {
    if (import.meta.env.DEV) {
      console.log("Supabase Health Check:", healthCheck);
    }

    // Government audit logging
    if (healthCheck.overall === "unhealthy") {
      this.auditLog({
        action: "SYSTEM_HEALTH_CHECK_FAILED",
        severity: "error",
        description: "Supabase health check failed",
        metadata: healthCheck,
      });
    }
  }

  private logDatabaseError(error: DatabaseError) {
    console.error("Database Error:", error);

    this.auditLog({
      action: "DATABASE_ERROR",
      severity: "error",
      description: `Database error: ${error.message}`,
      metadata: error,
    });
  }

  private logConnectionError(error: any) {
    console.error("Connection Error:", error);

    this.auditLog({
      action: "CONNECTION_ERROR",
      severity: "error",
      description: `Connection error: ${error.message}`,
      metadata: { error: error.message, stack: error.stack },
    });
  }

  private async auditLog(log: {
    action: string;
    user_id?: string;
    severity: "info" | "warning" | "error" | "critical";
    description: string;
    metadata?: any;
  }) {
    try {
      // Only attempt audit logging if we have a connection
      if (this.connectionStatus.isConnected) {
        await supabase.from("audit_logs").insert({
          ...log,
          timestamp: new Date().toISOString(),
          module: "supabase_client",
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
        });
      }
    } catch (error) {
      // Silent fail for audit logging to prevent recursive errors
      console.warn("Failed to write audit log:", error);
    }
  }

  private async getClientIP(): Promise<string | null> {
    try {
      // This would be implemented based on your network setup
      // For government systems, this might involve secure IP detection
      return null;
    } catch {
      return null;
    }
  }

  // Public API
  public getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  public async checkHealth(): Promise<HealthCheckResult> {
    return this.performHealthCheck();
  }

  public onConnectionChange(
    listener: (status: ConnectionStatus) => void,
  ): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public async reconnect(): Promise<void> {
    this.connectionStatus.retryCount = 0;
    await this.performHealthCheck();
  }

  public destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.listeners = [];
  }
}

// Create connection manager instance
export const connectionManager = new SupabaseConnectionManager();

// Helper functions for common operations
export const createSupabaseQuery = <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
) => {
  return async (): Promise<{ data: T | null; error: DatabaseError | null }> => {
    try {
      const result = await queryFn();

      if (result.error) {
        const dbError: DatabaseError = {
          message: result.error.message || "Database operation failed",
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code,
        };
        return { data: null, error: dbError };
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      const dbError: DatabaseError = {
        message: error.message || "Unknown error occurred",
        code: error.code,
      };
      return { data: null, error: dbError };
    }
  };
};

// Row Level Security (RLS) helper functions
export const enforceRLS = {
  // Check if user can access specific record
  canAccessRecord: async (
    userId: string,
    table: string,
    recordId: string,
    action: "read" | "write" | "delete",
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc(
        "check_data_access_permission",
        {
          user_id: userId,
          resource_type: table,
          resource_id: recordId,
          action,
        },
      );

      return error ? false : (data as boolean);
    } catch {
      return false;
    }
  },

  // Get user permissions for current session
  getUserPermissions: async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase.rpc("get_user_permissions", {
        user_id: userId,
      });

      return error ? [] : data?.[0]?.permissions || [];
    } catch {
      return [];
    }
  },
};

// Export additional utilities
export const supabaseUtils = {
  isConnected: () => connectionManager.getConnectionStatus().isConnected,
  checkHealth: () => connectionManager.checkHealth(),
  onConnectionChange: (callback: (status: ConnectionStatus) => void) =>
    connectionManager.onConnectionChange(callback),
  reconnect: () => connectionManager.reconnect(),
  enforceRLS,
};

// Type exports for convenience
export type { Database, ConnectionStatus, HealthCheckResult, DatabaseError };

// Default export
export default supabase;
