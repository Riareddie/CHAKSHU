/**
 * Data Synchronization Hook
 * Ensures consistent state management across the application
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { reportApi } from "@/lib/api-service";
import type {
  UnifiedReport,
  ReportFilters,
  SortOptions,
  PaginatedResponse,
} from "@/lib/data-constants";

interface UseDataSyncOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

interface DataSyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Generic data synchronization hook
 */
export function useDataSync<T>(
  key: string,
  fetcher: () => Promise<any>,
  options: UseDataSyncOptions = {},
) {
  const {
    autoRefresh = false,
    refreshInterval = 30000,
    onError,
    onSuccess,
  } = options;

  const [state, setState] = useState<DataSyncState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const fetchData = useCallback(
    async (showLoading = true) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      if (showLoading) {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }

      try {
        const response = await fetcher();

        if (!abortControllerRef.current?.signal.aborted) {
          setState({
            data: response.success ? response.data : null,
            loading: false,
            error: response.success
              ? null
              : response.error || "Failed to fetch data",
            lastUpdated: new Date(),
          });

          if (response.success && onSuccess) {
            onSuccess(response.message || "Data updated successfully");
          } else if (!response.success && onError) {
            onError(response.error || "Failed to fetch data");
          }
        }
      } catch (error) {
        if (!abortControllerRef.current?.signal.aborted) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));

          if (onError) {
            onError(errorMessage);
          }
        }
      }
    },
    [fetcher, onError, onSuccess],
  );

  const refresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  const forceRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        refresh();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refresh,
    forceRefresh,
    isStale: state.lastUpdated
      ? Date.now() - state.lastUpdated.getTime() > refreshInterval
      : true,
  };
}

/**
 * Reports-specific hook with filtering and pagination
 */
export function useReports(
  filters: ReportFilters = {},
  sort: SortOptions = { field: "created_at", direction: "desc" },
  page: number = 1,
  limit: number = 10,
  options: UseDataSyncOptions = {},
) {
  const fetcher = useCallback(() => {
    return reportApi.getAll(filters, sort, page, limit);
  }, [filters, sort, page, limit]);

  return useDataSync<PaginatedResponse<UnifiedReport>>(
    `reports-${JSON.stringify({ filters, sort, page, limit })}`,
    fetcher,
    options,
  );
}

/**
 * Single report hook
 */
export function useReport(id: string, options: UseDataSyncOptions = {}) {
  const fetcher = useCallback(() => {
    return reportApi.getById(id);
  }, [id]);

  return useDataSync<UnifiedReport>(
    `report-${id}`,
    fetcher,
    { ...options, autoRefresh: false }, // Single reports don't need auto-refresh
  );
}

/**
 * Report statistics hook
 */
export function useReportStats(options: UseDataSyncOptions = {}) {
  const fetcher = useCallback(() => {
    return reportApi.getStats();
  }, []);

  return useDataSync<any>("report-stats", fetcher, {
    autoRefresh: true,
    refreshInterval: 60000,
    ...options,
  });
}

/**
 * Cache management utilities
 */
class DataCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttl: number = 300000) {
    // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  size() {
    return this.cache.size;
  }
}

export const dataCache = new DataCache();

/**
 * Hook for managing optimistic updates
 */
export function useOptimisticUpdate<T>() {
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const performOptimisticUpdate = useCallback(
    async <R>(
      optimisticValue: T,
      asyncOperation: () => Promise<R>,
      onSuccess?: (result: R) => void,
      onError?: (error: Error) => void,
    ) => {
      // Set optimistic state
      setOptimisticData(optimisticValue);
      setIsOptimistic(true);

      try {
        const result = await asyncOperation();

        // Success - clear optimistic state
        setOptimisticData(null);
        setIsOptimistic(false);

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (error) {
        // Failure - revert optimistic state
        setOptimisticData(null);
        setIsOptimistic(false);

        if (onError) {
          onError(error instanceof Error ? error : new Error("Unknown error"));
        }

        throw error;
      }
    },
    [],
  );

  return {
    optimisticData,
    isOptimistic,
    performOptimisticUpdate,
  };
}

/**
 * Hook for managing data conflicts
 */
export function useConflictResolution<T>() {
  const [conflicts, setConflicts] = useState<
    Array<{
      id: string;
      localVersion: T;
      serverVersion: T;
      timestamp: Date;
    }>
  >([]);

  const detectConflict = useCallback(
    (id: string, localVersion: T, serverVersion: T) => {
      const conflict = {
        id,
        localVersion,
        serverVersion,
        timestamp: new Date(),
      };

      setConflicts((prev) => {
        const existing = prev.findIndex((c) => c.id === id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = conflict;
          return updated;
        }
        return [...prev, conflict];
      });
    },
    [],
  );

  const resolveConflict = useCallback((id: string, resolution: T) => {
    setConflicts((prev) => prev.filter((c) => c.id !== id));
    return resolution;
  }, []);

  const hasConflicts = conflicts.length > 0;

  return {
    conflicts,
    hasConflicts,
    detectConflict,
    resolveConflict,
  };
}
