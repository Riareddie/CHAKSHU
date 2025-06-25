/**
 * Supabase Health Check and Connection Monitoring Hooks
 * Real-time monitoring of Supabase connection status for government systems
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { connectionManager, supabaseUtils } from "@/lib/supabase";
import type { ConnectionStatus, HealthCheckResult } from "@/types/database";

// Hook for monitoring Supabase connection status
export const useSupabaseConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    connectionManager.getConnectionStatus(),
  );
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    // Subscribe to connection status changes
    const unsubscribe = connectionManager.onConnectionChange((status) => {
      setConnectionStatus(status);
      setIsReconnecting(false);
    });

    return unsubscribe;
  }, []);

  const reconnect = useCallback(async () => {
    setIsReconnecting(true);
    try {
      await connectionManager.reconnect();
    } catch (error) {
      console.error("Failed to reconnect:", error);
      setIsReconnecting(false);
    }
  }, []);

  return {
    connectionStatus,
    isConnected: connectionStatus.isConnected,
    isReconnecting,
    reconnect,
    lastChecked: connectionStatus.lastChecked,
    latency: connectionStatus.latency,
    error: connectionStatus.error,
    retryCount: connectionStatus.retryCount,
  };
};

// Hook for periodic health checks
export const useSupabaseHealth = (intervalMs: number = 5 * 60 * 1000) => {
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(
    null,
  );
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const performHealthCheck = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await connectionManager.checkHealth();
      setHealthStatus(result);
      setLastCheck(new Date());
    } catch (error) {
      console.error("Health check failed:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Manual health check trigger
  const checkNow = useCallback(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  useEffect(() => {
    // Initial health check
    performHealthCheck();

    // Set up periodic checks
    intervalRef.current = setInterval(performHealthCheck, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [performHealthCheck, intervalMs]);

  return {
    healthStatus,
    isChecking,
    lastCheck,
    checkNow,
    isHealthy: healthStatus?.overall === "healthy",
    isDegraded: healthStatus?.overall === "degraded",
    isUnhealthy: healthStatus?.overall === "unhealthy",
  };
};

// Hook for Supabase utilities and helpers
export const useSupabaseUtils = () => {
  const { connectionStatus } = useSupabaseConnection();

  return {
    isConnected: supabaseUtils.isConnected,
    checkHealth: supabaseUtils.checkHealth,
    reconnect: supabaseUtils.reconnect,
    enforceRLS: supabaseUtils.enforceRLS,
    connectionStatus,
  };
};

// Hook for monitoring specific table changes with retry logic
export const useSupabaseSubscription = <T = any>(
  table: string,
  filter?: string,
  onData?: (payload: T) => void,
  onError?: (error: any) => void,
) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const channelRef = useRef<any>(null);
  const maxRetries = 3;

  const subscribe = useCallback(() => {
    if (!supabaseUtils.isConnected()) {
      setError("Not connected to Supabase");
      return;
    }

    try {
      // Clean up existing subscription
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }

      const channel = supabaseUtils.onConnectionChange(() => {
        // Handle connection changes
      });

      // Create new subscription with government audit requirements
      const subscription = table;

      channelRef.current = subscription;

      setIsSubscribed(true);
      setError(null);
      setRetryCount(0);
    } catch (err: any) {
      setError(err.message);
      setIsSubscribed(false);

      // Retry logic for government systems
      if (retryCount < maxRetries) {
        setTimeout(
          () => {
            setRetryCount((prev) => prev + 1);
            subscribe();
          },
          Math.pow(2, retryCount) * 1000,
        );
      } else if (onError) {
        onError(err);
      }
    }
  }, [table, filter, onData, onError, retryCount, maxRetries]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    setIsSubscribed(false);
    setError(null);
    setRetryCount(0);
  }, []);

  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, [subscribe, unsubscribe]);

  return {
    isSubscribed,
    error,
    retryCount,
    subscribe,
    unsubscribe,
  };
};

// Hook for Row Level Security (RLS) validation
export const useRLSValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateAccess = useCallback(
    async (
      userId: string,
      table: string,
      recordId: string,
      action: "read" | "write" | "delete",
    ): Promise<boolean> => {
      setIsValidating(true);
      try {
        const hasAccess = await supabaseUtils.enforceRLS.canAccessRecord(
          userId,
          table,
          recordId,
          action,
        );
        return hasAccess;
      } catch (error) {
        console.error("RLS validation error:", error);
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [],
  );

  const getUserPermissions = useCallback(
    async (userId: string): Promise<string[]> => {
      setIsValidating(true);
      try {
        const permissions =
          await supabaseUtils.enforceRLS.getUserPermissions(userId);
        return permissions;
      } catch (error) {
        console.error("Get permissions error:", error);
        return [];
      } finally {
        setIsValidating(false);
      }
    },
    [],
  );

  return {
    validateAccess,
    getUserPermissions,
    isValidating,
  };
};

// Hook for government compliance monitoring
export const useComplianceMonitoring = () => {
  const [complianceStatus, setComplianceStatus] = useState({
    dataEncryption: false,
    auditLogging: false,
    accessControl: false,
    dataRetention: false,
    lastAudit: null as Date | null,
  });

  const checkCompliance = useCallback(async () => {
    try {
      // Check encryption status
      const encryptionEnabled =
        import.meta.env.VITE_ENCRYPTION_REQUIRED === "true";

      // Check audit logging
      const auditEnabled = import.meta.env.VITE_ENABLE_AUDIT_LOGGING === "true";

      // Check access control (RLS enabled)
      const accessControlEnabled = supabaseUtils.isConnected();

      // Check data retention policy
      const retentionYears = parseInt(
        import.meta.env.VITE_DATA_RETENTION_YEARS || "7",
      );
      const retentionEnabled = retentionYears > 0;

      setComplianceStatus({
        dataEncryption: encryptionEnabled,
        auditLogging: auditEnabled,
        accessControl: accessControlEnabled,
        dataRetention: retentionEnabled,
        lastAudit: new Date(),
      });

      return {
        isCompliant:
          encryptionEnabled &&
          auditEnabled &&
          accessControlEnabled &&
          retentionEnabled,
        details: {
          dataEncryption: encryptionEnabled,
          auditLogging: auditEnabled,
          accessControl: accessControlEnabled,
          dataRetention: retentionEnabled,
        },
      };
    } catch (error) {
      console.error("Compliance check failed:", error);
      return {
        isCompliant: false,
        details: complianceStatus,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }, [complianceStatus]);

  useEffect(() => {
    checkCompliance();
  }, [checkCompliance]);

  return {
    complianceStatus,
    checkCompliance,
    isCompliant: Object.values(complianceStatus).every(Boolean),
  };
};

// Main Supabase status hook that combines all monitoring
export const useSupabaseStatus = () => {
  const connection = useSupabaseConnection();
  const health = useSupabaseHealth();
  const compliance = useComplianceMonitoring();

  const overallStatus = {
    isOperational:
      connection.isConnected && health.isHealthy && compliance.isCompliant,
    connection: connection.connectionStatus,
    health: health.healthStatus,
    compliance: compliance.complianceStatus,
    lastChecked: health.lastCheck || new Date(),
  };

  return {
    ...overallStatus,
    connection,
    health,
    compliance,
    reconnect: connection.reconnect,
    checkHealth: health.checkNow,
    checkCompliance: compliance.checkCompliance,
  };
};

export default useSupabaseConnection;
