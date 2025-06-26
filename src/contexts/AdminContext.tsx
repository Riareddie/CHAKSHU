/**
 * Admin Context Provider
 * Centralized state management for admin features with real-time updates
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { toast } from "@/hooks/use-toast";
import {
  adminService,
  type AdminStats,
  type ReportWithDetails,
  type AdminUser,
  type SystemHealth,
} from "@/services/adminService";
import type { Tables } from "@/integrations/supabase/types";

type Report = Tables<"reports">;

// State interface
interface AdminState {
  // Statistics
  stats: AdminStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Reports
  reports: ReportWithDetails[];
  reportsTotal: number;
  reportsLoading: boolean;
  reportsError: string | null;
  reportFilters: {
    status?: string;
    priority?: string;
    fraud_type?: string;
    date_from?: string;
    date_to?: string;
  };
  reportsPage: number;
  reportsLimit: number;

  // Users
  users: AdminUser[];
  usersTotal: number;
  usersLoading: boolean;
  usersError: string | null;
  userFilters: {
    status?: string;
    role?: string;
    search?: string;
  };
  usersPage: number;
  usersLimit: number;

  // System Health
  systemHealth: SystemHealth | null;
  systemHealthLoading: boolean;
  systemHealthError: string | null;

  // Real-time status
  realtimeConnected: boolean;
  lastUpdated: string | null;

  // UI state
  selectedReport: ReportWithDetails | null;
  selectedUser: AdminUser | null;
}

// Action types
type AdminAction =
  | { type: "SET_STATS_LOADING"; payload: boolean }
  | { type: "SET_STATS_SUCCESS"; payload: AdminStats }
  | { type: "SET_STATS_ERROR"; payload: string }
  | { type: "SET_REPORTS_LOADING"; payload: boolean }
  | {
      type: "SET_REPORTS_SUCCESS";
      payload: { reports: ReportWithDetails[]; total: number };
    }
  | { type: "SET_REPORTS_ERROR"; payload: string }
  | { type: "UPDATE_REPORT"; payload: ReportWithDetails }
  | { type: "ADD_NEW_REPORT"; payload: ReportWithDetails }
  | { type: "SET_REPORT_FILTERS"; payload: AdminState["reportFilters"] }
  | { type: "SET_REPORTS_PAGE"; payload: number }
  | { type: "SET_USERS_LOADING"; payload: boolean }
  | {
      type: "SET_USERS_SUCCESS";
      payload: { users: AdminUser[]; total: number };
    }
  | { type: "SET_USERS_ERROR"; payload: string }
  | { type: "UPDATE_USER"; payload: AdminUser }
  | { type: "SET_USER_FILTERS"; payload: AdminState["userFilters"] }
  | { type: "SET_USERS_PAGE"; payload: number }
  | { type: "SET_SYSTEM_HEALTH_LOADING"; payload: boolean }
  | { type: "SET_SYSTEM_HEALTH_SUCCESS"; payload: SystemHealth }
  | { type: "SET_SYSTEM_HEALTH_ERROR"; payload: string }
  | { type: "SET_REALTIME_CONNECTED"; payload: boolean }
  | { type: "SET_LAST_UPDATED"; payload: string }
  | { type: "SET_SELECTED_REPORT"; payload: ReportWithDetails | null }
  | { type: "SET_SELECTED_USER"; payload: AdminUser | null };

// Initial state
const initialState: AdminState = {
  stats: null,
  statsLoading: false,
  statsError: null,

  reports: [],
  reportsTotal: 0,
  reportsLoading: false,
  reportsError: null,
  reportFilters: {},
  reportsPage: 1,
  reportsLimit: 20,

  users: [],
  usersTotal: 0,
  usersLoading: false,
  usersError: null,
  userFilters: {},
  usersPage: 1,
  usersLimit: 20,

  systemHealth: null,
  systemHealthLoading: false,
  systemHealthError: null,

  realtimeConnected: false,
  lastUpdated: null,

  selectedReport: null,
  selectedUser: null,
};

// Reducer
function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "SET_STATS_LOADING":
      return { ...state, statsLoading: action.payload, statsError: null };
    case "SET_STATS_SUCCESS":
      return {
        ...state,
        stats: action.payload,
        statsLoading: false,
        statsError: null,
      };
    case "SET_STATS_ERROR":
      return { ...state, statsError: action.payload, statsLoading: false };

    case "SET_REPORTS_LOADING":
      return { ...state, reportsLoading: action.payload, reportsError: null };
    case "SET_REPORTS_SUCCESS":
      return {
        ...state,
        reports: action.payload.reports,
        reportsTotal: action.payload.total,
        reportsLoading: false,
        reportsError: null,
      };
    case "SET_REPORTS_ERROR":
      return { ...state, reportsError: action.payload, reportsLoading: false };
    case "UPDATE_REPORT":
      return {
        ...state,
        reports: state.reports.map((report) =>
          report.id === action.payload.id ? action.payload : report,
        ),
      };
    case "ADD_NEW_REPORT":
      return {
        ...state,
        reports: [action.payload, ...state.reports],
        reportsTotal: state.reportsTotal + 1,
      };
    case "SET_REPORT_FILTERS":
      return { ...state, reportFilters: action.payload, reportsPage: 1 };
    case "SET_REPORTS_PAGE":
      return { ...state, reportsPage: action.payload };

    case "SET_USERS_LOADING":
      return { ...state, usersLoading: action.payload, usersError: null };
    case "SET_USERS_SUCCESS":
      return {
        ...state,
        users: action.payload.users,
        usersTotal: action.payload.total,
        usersLoading: false,
        usersError: null,
      };
    case "SET_USERS_ERROR":
      return { ...state, usersError: action.payload, usersLoading: false };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user,
        ),
      };
    case "SET_USER_FILTERS":
      return { ...state, userFilters: action.payload, usersPage: 1 };
    case "SET_USERS_PAGE":
      return { ...state, usersPage: action.payload };

    case "SET_SYSTEM_HEALTH_LOADING":
      return {
        ...state,
        systemHealthLoading: action.payload,
        systemHealthError: null,
      };
    case "SET_SYSTEM_HEALTH_SUCCESS":
      return {
        ...state,
        systemHealth: action.payload,
        systemHealthLoading: false,
        systemHealthError: null,
      };
    case "SET_SYSTEM_HEALTH_ERROR":
      return {
        ...state,
        systemHealthError: action.payload,
        systemHealthLoading: false,
      };

    case "SET_REALTIME_CONNECTED":
      return { ...state, realtimeConnected: action.payload };
    case "SET_LAST_UPDATED":
      return { ...state, lastUpdated: action.payload };

    case "SET_SELECTED_REPORT":
      return { ...state, selectedReport: action.payload };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };

    default:
      return state;
  }
}

// Context
interface AdminContextType extends AdminState {
  // Actions
  fetchStats: () => Promise<void>;
  fetchReports: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  updateReportStatus: (
    reportId: string,
    status: string,
    comments?: string,
    authorityAction?: string,
  ) => Promise<void>;
  updateUserStatus: (
    userId: string,
    status: "active" | "suspended" | "inactive",
    reason?: string,
  ) => Promise<void>;
  setReportFilters: (filters: AdminState["reportFilters"]) => void;
  setUserFilters: (filters: AdminState["userFilters"]) => void;
  setReportsPage: (page: number) => void;
  setUsersPage: (page: number) => void;
  setSelectedReport: (report: ReportWithDetails | null) => void;
  setSelectedUser: (user: AdminUser | null) => void;
  exportReports: (
    format: "csv" | "json" | "xlsx",
    filters?: any,
  ) => Promise<string | null>;
  refreshAllData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

// Provider component
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Fetch admin statistics
  const fetchStats = useCallback(async () => {
    dispatch({ type: "SET_STATS_LOADING", payload: true });
    try {
      const response = await adminService.getAdminStats();
      if (response.success && response.data) {
        dispatch({ type: "SET_STATS_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "SET_STATS_ERROR",
          payload: response.error || "Failed to fetch stats",
        });
      }
    } catch (error) {
      dispatch({ type: "SET_STATS_ERROR", payload: "Failed to fetch stats" });
    }
  }, []);

  // Fetch reports for admin review
  const fetchReports = useCallback(async () => {
    dispatch({ type: "SET_REPORTS_LOADING", payload: true });
    try {
      const response = await adminService.getReportsForReview(
        state.reportFilters,
        state.reportsPage,
        state.reportsLimit,
      );
      if (response.success && response.data) {
        dispatch({ type: "SET_REPORTS_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "SET_REPORTS_ERROR",
          payload: response.error || "Failed to fetch reports",
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_REPORTS_ERROR",
        payload: "Failed to fetch reports",
      });
    }
  }, [state.reportFilters, state.reportsPage, state.reportsLimit]);

  // Fetch users for management
  const fetchUsers = useCallback(async () => {
    dispatch({ type: "SET_USERS_LOADING", payload: true });
    try {
      const response = await adminService.getUsersForManagement(
        state.userFilters,
        state.usersPage,
        state.usersLimit,
      );
      if (response.success && response.data) {
        dispatch({ type: "SET_USERS_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "SET_USERS_ERROR",
          payload: response.error || "Failed to fetch users",
        });
      }
    } catch (error) {
      dispatch({ type: "SET_USERS_ERROR", payload: "Failed to fetch users" });
    }
  }, [state.userFilters, state.usersPage, state.usersLimit]);

  // Fetch system health
  const fetchSystemHealth = useCallback(async () => {
    dispatch({ type: "SET_SYSTEM_HEALTH_LOADING", payload: true });
    try {
      const response = await adminService.getSystemHealth();
      if (response.success && response.data) {
        dispatch({ type: "SET_SYSTEM_HEALTH_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "SET_SYSTEM_HEALTH_ERROR",
          payload: response.error || "Failed to fetch system health",
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_SYSTEM_HEALTH_ERROR",
        payload: "Failed to fetch system health",
      });
    }
  }, []);

  // Update report status
  const updateReportStatus = useCallback(
    async (
      reportId: string,
      status: string,
      comments?: string,
      authorityAction?: string,
    ) => {
      try {
        const response = await adminService.updateReportStatus(
          reportId,
          status,
          comments,
          authorityAction,
        );
        if (response.success && response.data) {
          // Find the updated report and update it in state
          const updatedReport = state.reports.find((r) => r.id === reportId);
          if (updatedReport) {
            const updated = { ...updatedReport, ...response.data };
            dispatch({ type: "UPDATE_REPORT", payload: updated });
          }

          toast({
            title: "Report Updated",
            description: `Report ${reportId} has been updated successfully.`,
          });

          // Refresh stats to reflect changes
          fetchStats();
        } else {
          toast({
            title: "Update Failed",
            description: response.error || "Failed to update report status",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "An error occurred while updating the report",
          variant: "destructive",
        });
      }
    },
    [state.reports, fetchStats],
  );

  // Update user status
  const updateUserStatus = useCallback(
    async (
      userId: string,
      status: "active" | "suspended" | "inactive",
      reason?: string,
    ) => {
      try {
        const response = await adminService.updateUserStatus(
          userId,
          status,
          reason,
        );
        if (response.success) {
          // Update user in state
          const updatedUser = state.users.find((u) => u.id === userId);
          if (updatedUser) {
            const updated = { ...updatedUser, status };
            dispatch({ type: "UPDATE_USER", payload: updated });
          }

          toast({
            title: "User Updated",
            description: `User status has been updated to ${status}.`,
          });
        } else {
          toast({
            title: "Update Failed",
            description: response.error || "Failed to update user status",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "An error occurred while updating the user",
          variant: "destructive",
        });
      }
    },
    [state.users],
  );

  // Export reports
  const exportReports = useCallback(
    async (
      format: "csv" | "json" | "xlsx",
      filters?: any,
    ): Promise<string | null> => {
      try {
        const response = await adminService.exportReports(format, filters);
        if (response.success && response.data) {
          toast({
            title: "Export Successful",
            description: `Reports exported to ${format.toUpperCase()} format.`,
          });
          return response.data;
        } else {
          toast({
            title: "Export Failed",
            description: response.error || "Failed to export reports",
            variant: "destructive",
          });
          return null;
        }
      } catch (error) {
        toast({
          title: "Export Failed",
          description: "An error occurred during export",
          variant: "destructive",
        });
        return null;
      }
    },
    [],
  );

  // Action handlers
  const setReportFilters = useCallback(
    (filters: AdminState["reportFilters"]) => {
      dispatch({ type: "SET_REPORT_FILTERS", payload: filters });
    },
    [],
  );

  const setUserFilters = useCallback((filters: AdminState["userFilters"]) => {
    dispatch({ type: "SET_USER_FILTERS", payload: filters });
  }, []);

  const setReportsPage = useCallback((page: number) => {
    dispatch({ type: "SET_REPORTS_PAGE", payload: page });
  }, []);

  const setUsersPage = useCallback((page: number) => {
    dispatch({ type: "SET_USERS_PAGE", payload: page });
  }, []);

  const setSelectedReport = useCallback((report: ReportWithDetails | null) => {
    dispatch({ type: "SET_SELECTED_REPORT", payload: report });
  }, []);

  const setSelectedUser = useCallback((user: AdminUser | null) => {
    dispatch({ type: "SET_SELECTED_USER", payload: user });
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchReports(),
      fetchUsers(),
      fetchSystemHealth(),
    ]);
    dispatch({ type: "SET_LAST_UPDATED", payload: new Date().toISOString() });
  }, [fetchStats, fetchReports, fetchUsers, fetchSystemHealth]);

  // Set up real-time subscriptions
  useEffect(() => {
    const unsubscribe = adminService.subscribeToAdminUpdates({
      onReportUpdate: (report) => {
        const updatedReport = state.reports.find((r) => r.id === report.id);
        if (updatedReport) {
          dispatch({
            type: "UPDATE_REPORT",
            payload: { ...updatedReport, ...report },
          });
        }
        // Refresh stats when reports are updated
        fetchStats();
      },
      onNewReport: (report) => {
        const newReport: ReportWithDetails = {
          ...report,
          user_email: `user-${report.user_id.slice(0, 8)}@example.com`,
          user_name: `User ${report.user_id.slice(0, 8)}`,
          priority: "medium", // Calculate based on amount and type
          evidence_count: 0,
        };
        dispatch({ type: "ADD_NEW_REPORT", payload: newReport });
        // Refresh stats when new reports arrive
        fetchStats();

        toast({
          title: "New Report Received",
          description: `A new ${report.fraud_type} report has been submitted.`,
        });
      },
      onSystemAlert: (alert) => {
        toast({
          title: "System Alert",
          description: alert.message,
          variant: alert.severity === "high" ? "destructive" : "default",
        });
      },
    });

    dispatch({ type: "SET_REALTIME_CONNECTED", payload: true });

    return () => {
      unsubscribe();
      dispatch({ type: "SET_REALTIME_CONNECTED", payload: false });
    };
  }, [state.reports, fetchStats]);

  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAllData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refreshAllData]);

  // Fetch initial data
  useEffect(() => {
    refreshAllData();
  }, []);

  // Refetch reports when filters or page changes
  useEffect(() => {
    fetchReports();
  }, [fetchReports, state.reportFilters, state.reportsPage]);

  // Refetch users when filters or page changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, state.userFilters, state.usersPage]);

  const contextValue: AdminContextType = {
    ...state,
    fetchStats,
    fetchReports,
    fetchUsers,
    fetchSystemHealth,
    updateReportStatus,
    updateUserStatus,
    setReportFilters,
    setUserFilters,
    setReportsPage,
    setUsersPage,
    setSelectedReport,
    setSelectedUser,
    exportReports,
    refreshAllData,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook to use admin context
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

export default AdminContext;
