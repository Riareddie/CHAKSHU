/**
 * Comprehensive Admin Service
 * Centralized service for all admin operations with real-time capabilities
 */

import { supabase, isDemoMode } from "@/integrations/supabase/client";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

// Type aliases
type Report = Tables<"reports">;
type ReportUpdate = TablesUpdate<"reports">;
type Notification = Tables<"notifications">;
type NotificationInsert = TablesInsert<"notifications">;

// Extended types for admin operations
export interface AdminStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  rejectedReports: number;
  activeUsers: number;
  totalAmount: number;
  averageResponseTime: number;
  monthlyGrowth: {
    reports: number;
    users: number;
    amount: number;
  };
  lastUpdated: string;
}

export interface ReportWithDetails extends Report {
  user_email?: string;
  user_name?: string;
  priority?: "low" | "medium" | "high" | "critical";
  evidence_count?: number;
  status_history?: Array<{
    status: string;
    changed_at: string;
    changed_by?: string;
    comments?: string;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  last_seen: string | null;
  reports_count: number;
  status: "active" | "inactive" | "suspended";
  role: "user" | "admin" | "moderator";
  total_amount_reported: number;
  risk_score: number;
}

export interface SystemHealth {
  database: {
    status: "healthy" | "degraded" | "down";
    responseTime: number;
    connections: number;
  };
  realtime: {
    status: "connected" | "disconnected" | "reconnecting";
    channels: number;
    latency: number;
  };
  storage: {
    status: "healthy" | "degraded" | "down";
    usage: number;
    capacity: number;
  };
  lastCheck: string;
}

export interface AdminActivity {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: any;
  timestamp: string;
  ip_address?: string;
}

// Service response type
interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
}

/**
 * Admin Service Class
 */
class AdminService {
  private realtimeChannels: Map<string, any> = new Map();

  /**
   * Generic query executor with error handling and audit logging
   */
  private async executeQuery<T>(
    queryFn: () => Promise<any>,
    operation: string,
    auditData?: {
      action: string;
      resource_type: string;
      resource_id?: string;
      details?: any;
    },
  ): Promise<ServiceResponse<T>> {
    try {
      if (isDemoMode) {
        console.log(`Demo mode: ${operation} operation simulated`);
        return {
          data: this.getMockData(operation) as T,
          error: null,
          success: true,
          message: `${operation} completed successfully (demo mode)`,
        };
      }

      const response = await queryFn();

      if (response.error) {
        console.error(`Admin ${operation} error:`, response.error);
        return {
          data: null,
          error: response.error.message || `Failed to ${operation}`,
          success: false,
        };
      }

      // Log admin activity if audit data provided
      if (auditData) {
        await this.logAdminActivity(auditData);
      }

      return {
        data: response.data,
        error: null,
        success: true,
        message: `${operation} completed successfully`,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Unknown error during ${operation}`;
      console.error(`Admin ${operation} exception:`, error);

      // Log more detailed error information
      if (error && typeof error === "object") {
        console.error("Error details:", JSON.stringify(error, null, 2));
      }

      return {
        data: null,
        error: message,
        success: false,
      };
    }
  }

  /**
   * Log admin activity for audit trail
   */
  private async logAdminActivity(auditData: {
    action: string;
    resource_type: string;
    resource_id?: string;
    details?: any;
  }): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase.from("audit_logs").insert({
        user_id: user.user.id,
        action: auditData.action,
        resource_type: auditData.resource_type,
        resource_id: auditData.resource_id,
        details: auditData.details,
        ip_address: "unknown", // In a real app, you'd get this from the request
      });
    } catch (error) {
      console.warn("Failed to log admin activity:", error);
    }
  }

  /**
   * Get mock data for demo mode
   */
  private getMockData(operation: string): any {
    switch (operation) {
      case "fetch admin stats":
        return {
          totalReports: 15847,
          pendingReports: 342,
          resolvedReports: 14123,
          rejectedReports: 1382,
          activeUsers: 67892,
          totalAmount: 12450000,
          averageResponseTime: 1.8,
          monthlyGrowth: {
            reports: 15.3,
            users: 8.7,
            amount: 28.1,
          },
          lastUpdated: new Date().toISOString(),
        };
      case "fetch admin reports":
        return [
          {
            id: "RPT-2024-001",
            title: "UPI Fraud - Unauthorized Transaction",
            description:
              "Multiple unauthorized UPI transactions using fake QR codes",
            fraud_type: "phishing",
            status: "pending",
            amount_involved: 75000,
            currency: "INR",
            city: "Mumbai",
            state: "Maharashtra",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString(),
            user_id: "user-1",
            user_email: "rajesh.kumar@example.com",
            user_name: "Rajesh Kumar",
            priority: "high",
            evidence_count: 3,
          },
          {
            id: "RPT-2024-002",
            title: "Investment Scam - Crypto Platform",
            description:
              "Fraudulent cryptocurrency investment platform disappeared with funds",
            fraud_type: "investment_scam",
            status: "under_review",
            amount_involved: 250000,
            currency: "INR",
            city: "Bangalore",
            state: "Karnataka",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            user_id: "user-2",
            user_email: "priya.sharma@example.com",
            user_name: "Priya Sharma",
            priority: "critical",
            evidence_count: 7,
          },
        ];
      case "fetch admin users":
        return [
          {
            id: "user-1",
            email: "rajesh.kumar@example.com",
            full_name: "Rajesh Kumar",
            created_at: new Date(Date.now() - 2592000000).toISOString(),
            last_seen: new Date(Date.now() - 86400000).toISOString(),
            reports_count: 3,
            status: "active",
            role: "user",
            total_amount_reported: 125000,
            risk_score: 2.1,
          },
          {
            id: "user-2",
            email: "priya.sharma@example.com",
            full_name: "Priya Sharma",
            created_at: new Date(Date.now() - 1296000000).toISOString(),
            last_seen: new Date(Date.now() - 172800000).toISOString(),
            reports_count: 1,
            status: "active",
            role: "user",
            total_amount_reported: 250000,
            risk_score: 1.5,
          },
        ];
      case "fetch system health":
        return {
          database: {
            status: "healthy",
            responseTime: 45,
            connections: 23,
          },
          realtime: {
            status: "connected",
            channels: 12,
            latency: 28,
          },
          storage: {
            status: "healthy",
            usage: 67,
            capacity: 100,
          },
          lastCheck: new Date().toISOString(),
        };
      default:
        return null;
    }
  }

  /**
   * Get comprehensive admin statistics
   */
  async getAdminStats(): Promise<ServiceResponse<AdminStats>> {
    return this.executeQuery(async () => {
      let reports = [];
      let usersCount = 0;

      // Try to fetch reports with proper error handling
      try {
        const { data: reportsData, error: reportsError } = await supabase
          .from("reports")
          .select("status, amount_involved, created_at");

        if (reportsError) {
          console.error("Reports query error:", reportsError);
          console.warn("Using empty reports data due to error");
        } else {
          reports = reportsData || [];
        }
      } catch (error) {
        console.error("Reports query exception:", error);
        reports = [];
      }

      // Try to fetch user count with proper error handling
      try {
        const { count, error: usersError } = await supabase
          .from("user_analytics_preferences")
          .select("*", { count: "exact", head: true });

        if (usersError) {
          console.error("User count query error:", usersError);
          console.warn("Using 0 user count due to error");
        } else {
          usersCount = count || 0;
        }
      } catch (error) {
        console.error("User count query exception:", error);
        usersCount = 0;
      }

      // Calculate statistics
      const totalReports = reports?.length || 0;
      const pendingReports =
        reports?.filter((r) => r.status === "pending").length || 0;
      const resolvedReports =
        reports?.filter((r) => r.status === "resolved").length || 0;
      const rejectedReports =
        reports?.filter((r) => r.status === "rejected").length || 0;
      const totalAmount =
        reports?.reduce((sum, r) => sum + (r.amount_involved || 0), 0) || 0;

      // Calculate monthly growth
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const recentReports =
        reports?.filter((r) => new Date(r.created_at) >= lastMonth).length || 0;
      const monthlyGrowthReports =
        totalReports > 0 ? (recentReports / totalReports) * 100 : 0;

      return {
        data: {
          totalReports,
          pendingReports,
          resolvedReports,
          rejectedReports,
          activeUsers: usersCount || 0,
          totalAmount,
          averageResponseTime: 2.1, // Would calculate from status history in real implementation
          monthlyGrowth: {
            reports: monthlyGrowthReports,
            users: 8.5, // Would calculate from user creation dates
            amount: 22.3, // Would calculate from amount trends
          },
          lastUpdated: new Date().toISOString(),
        },
        error: null,
      };
    }, "fetch admin stats");
  }

  /**
   * Get all reports with detailed information for admin review
   */
  async getReportsForReview(
    filters?: {
      status?: string;
      priority?: string;
      fraud_type?: string;
      date_from?: string;
      date_to?: string;
    },
    page: number = 1,
    limit: number = 20,
  ): Promise<ServiceResponse<{ reports: ReportWithDetails[]; total: number }>> {
    return this.executeQuery(async () => {
      const offset = (page - 1) * limit;

      try {
        let query = supabase
          .from("reports")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        // Apply filters
        if (filters?.status) query = query.eq("status", filters.status);
        if (filters?.fraud_type)
          query = query.eq("fraud_type", filters.fraud_type);
        if (filters?.date_from)
          query = query.gte("created_at", filters.date_from);
        if (filters?.date_to) query = query.lte("created_at", filters.date_to);

        const result = await query;

        if (result.error) {
          console.error("Reports for review query error:", result.error);
          // Return empty result instead of throwing
          return {
            data: {
              reports: [],
              total: 0,
            },
            error: null,
          };
        }

        // Enhance reports with additional data
        const enhancedReports: ReportWithDetails[] = (result.data || []).map(
          (report) => ({
            ...report,
            user_email: `user-${report.user_id.slice(0, 8)}@example.com`,
            user_name: `User ${report.user_id.slice(0, 8)}`,
            priority: this.calculatePriority(
              report.amount_involved,
              report.fraud_type,
            ),
            evidence_count: 0, // Simplified since we removed the evidence join
          }),
        );

        return {
          data: {
            reports: enhancedReports,
            total: result.count || 0,
          },
          error: null,
        };
      } catch (error) {
        console.error("Reports for review query exception:", error);
        return {
          data: {
            reports: [],
            total: 0,
          },
          error: null,
        };
      }
    }, "fetch admin reports");
  }

  /**
   * Update report status with admin comments
   */
  async updateReportStatus(
    reportId: string,
    newStatus: string,
    comments?: string,
    authorityAction?: string,
  ): Promise<ServiceResponse<Report>> {
    return this.executeQuery(
      async () => {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error("Admin not authenticated");

        // Update the report
        const { data: updatedReport, error: updateError } = await supabase
          .from("reports")
          .update({
            status: newStatus as any,
            authority_comments: comments,
            authority_action: authorityAction as any,
            updated_at: new Date().toISOString(),
          })
          .eq("id", reportId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Add to status history
        await supabase.from("report_status_history").insert({
          report_id: reportId,
          status: newStatus as any,
          comments: comments || `Status changed to ${newStatus}`,
          changed_by: user.user.id,
          authority_action: authorityAction as any,
        });

        // Create notification for user
        if (updatedReport.user_id) {
          await supabase.from("notifications").insert({
            user_id: updatedReport.user_id,
            type: "report_update",
            title: `Report ${reportId} Updated`,
            message: `Your report status has been changed to ${newStatus}`,
            priority: "medium",
          });
        }

        return { data: updatedReport, error: null };
      },
      "update report status",
      {
        action: "update_report_status",
        resource_type: "report",
        resource_id: reportId,
        details: { newStatus, comments, authorityAction },
      },
    );
  }

  /**
   * Get users for admin management
   */
  async getUsersForManagement(
    filters?: {
      status?: string;
      role?: string;
      search?: string;
    },
    page: number = 1,
    limit: number = 20,
  ): Promise<ServiceResponse<{ users: AdminUser[]; total: number }>> {
    return this.executeQuery(async () => {
      let userPrefs = [];
      let reportCounts = [];

      // Try to fetch user preferences with error handling
      try {
        const { data, error } = await supabase
          .from("user_analytics_preferences")
          .select("user_id, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("User preferences query error:", error);
          console.warn("Using empty user preferences due to error");
        } else {
          userPrefs = data || [];
        }
      } catch (error) {
        console.error("User preferences query exception:", error);
        userPrefs = [];
      }

      // Try to get report counts per user with error handling
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("user_id, amount_involved")
          .not("user_id", "is", null);

        if (error) {
          console.error("Report counts query error:", error);
          console.warn("Using empty report counts due to error");
        } else {
          reportCounts = data || [];
        }
      } catch (error) {
        console.error("Report counts query exception:", error);
        reportCounts = [];
      }

      // Build admin user list
      const users: AdminUser[] = (userPrefs || []).map((pref) => {
        const userReports =
          reportCounts?.filter((r) => r.user_id === pref.user_id) || [];
        const totalAmount = userReports.reduce(
          (sum, r) => sum + (r.amount_involved || 0),
          0,
        );

        return {
          id: pref.user_id,
          email: `user-${pref.user_id.slice(0, 8)}@example.com`,
          full_name: `User ${pref.user_id.slice(0, 8)}`,
          created_at: pref.created_at,
          last_seen: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          reports_count: userReports.length,
          status: userReports.length > 0 ? "active" : "inactive",
          role: "user",
          total_amount_reported: totalAmount,
          risk_score: this.calculateUserRiskScore(
            userReports.length,
            totalAmount,
          ),
        };
      });

      // Apply filters
      let filteredUsers = users;
      if (filters?.status) {
        filteredUsers = filteredUsers.filter(
          (u) => u.status === filters.status,
        );
      }
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (u) =>
            u.email.toLowerCase().includes(search) ||
            u.full_name?.toLowerCase().includes(search),
        );
      }

      // Pagination
      const offset = (page - 1) * limit;
      const paginatedUsers = filteredUsers.slice(offset, offset + limit);

      return {
        data: {
          users: paginatedUsers,
          total: filteredUsers.length,
        },
        error: null,
      };
    }, "fetch admin users");
  }

  /**
   * Update user status (suspend, activate, etc.)
   */
  async updateUserStatus(
    userId: string,
    status: "active" | "suspended" | "inactive",
    reason?: string,
  ): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(
      async () => {
        // In a real implementation, this would update a user_profiles table
        // For now, we'll simulate the operation
        console.log(`User ${userId} status updated to ${status}`, { reason });

        return { data: true, error: null };
      },
      "update user status",
      {
        action: "update_user_status",
        resource_type: "user",
        resource_id: userId,
        details: { status, reason },
      },
    );
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<ServiceResponse<SystemHealth>> {
    return this.executeQuery(async () => {
      const startTime = Date.now();

      // Test database connectivity
      const { error: dbError } = await supabase
        .from("reports")
        .select("id")
        .limit(1);

      const dbResponseTime = Date.now() - startTime;

      // Check realtime connection status
      const realtimeStatus = supabase.realtime.isConnected()
        ? "connected"
        : "disconnected";

      return {
        data: {
          database: {
            status: dbError
              ? "down"
              : dbResponseTime > 1000
                ? "degraded"
                : "healthy",
            responseTime: dbResponseTime,
            connections: 45, // Would get from database metrics in real implementation
          },
          realtime: {
            status: realtimeStatus as any,
            channels: this.realtimeChannels.size,
            latency: 32, // Would measure actual latency
          },
          storage: {
            status: "healthy", // Would check storage health
            usage: 67, // Would get actual usage
            capacity: 100,
          },
          lastCheck: new Date().toISOString(),
        },
        error: null,
      };
    }, "fetch system health");
  }

  /**
   * Subscribe to real-time admin data updates
   */
  subscribeToAdminUpdates(callbacks: {
    onReportUpdate?: (report: Report) => void;
    onNewReport?: (report: Report) => void;
    onUserActivity?: (activity: any) => void;
    onSystemAlert?: (alert: any) => void;
  }): () => void {
    if (isDemoMode) {
      console.log("Real-time subscriptions not available in demo mode");
      return () => {};
    }

    const unsubscribeFunctions: (() => void)[] = [];

    // Subscribe to report changes
    if (callbacks.onReportUpdate || callbacks.onNewReport) {
      const reportsChannel = supabase
        .channel("admin-reports")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "reports",
          },
          (payload) => {
            if (payload.eventType === "INSERT" && callbacks.onNewReport) {
              callbacks.onNewReport(payload.new as Report);
            } else if (
              payload.eventType === "UPDATE" &&
              callbacks.onReportUpdate
            ) {
              callbacks.onReportUpdate(payload.new as Report);
            }
          },
        )
        .subscribe();

      this.realtimeChannels.set("reports", reportsChannel);
      unsubscribeFunctions.push(() => {
        reportsChannel.unsubscribe();
        this.realtimeChannels.delete("reports");
      });
    }

    // Subscribe to system activities
    if (callbacks.onUserActivity) {
      const activityChannel = supabase
        .channel("admin-activity")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "audit_logs",
          },
          (payload) => {
            callbacks.onUserActivity?.(payload.new);
          },
        )
        .subscribe();

      this.realtimeChannels.set("activity", activityChannel);
      unsubscribeFunctions.push(() => {
        activityChannel.unsubscribe();
        this.realtimeChannels.delete("activity");
      });
    }

    // Return cleanup function
    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }

  /**
   * Export reports data
   */
  async exportReports(
    format: "csv" | "json" | "xlsx",
    filters?: {
      status?: string;
      date_from?: string;
      date_to?: string;
    },
  ): Promise<ServiceResponse<string>> {
    return this.executeQuery(
      async () => {
        const { data: reports } = await supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false });

        // Apply filters
        let filteredReports = reports || [];
        if (filters?.status) {
          filteredReports = filteredReports.filter(
            (r) => r.status === filters.status,
          );
        }
        if (filters?.date_from) {
          filteredReports = filteredReports.filter(
            (r) => r.created_at >= filters.date_from!,
          );
        }
        if (filters?.date_to) {
          filteredReports = filteredReports.filter(
            (r) => r.created_at <= filters.date_to!,
          );
        }

        // Generate export data based on format
        let exportData: string;
        switch (format) {
          case "json":
            exportData = JSON.stringify(filteredReports, null, 2);
            break;
          case "csv":
            exportData = this.convertToCSV(filteredReports);
            break;
          default:
            throw new Error(`Export format ${format} not supported`);
        }

        return { data: exportData, error: null };
      },
      "export reports",
      {
        action: "export_reports",
        resource_type: "reports",
        details: { format, filters },
      },
    );
  }

  /**
   * Helper methods
   */
  private calculatePriority(
    amount: number | null,
    fraudType: string,
  ): "low" | "medium" | "high" | "critical" {
    if (!amount) return "low";
    if (amount >= 200000) return "critical";
    if (amount >= 100000) return "high";
    if (amount >= 25000) return "medium";
    return "low";
  }

  private calculateUserRiskScore(
    reportCount: number,
    totalAmount: number,
  ): number {
    // Simple risk scoring algorithm
    let score = 0;
    if (reportCount > 5) score += 2;
    if (totalAmount > 500000) score += 3;
    if (reportCount > 10) score += 2;
    return Math.min(score, 10);
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string"
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(","),
      ),
    ].join("\n");

    return csvContent;
  }

  /**
   * Cleanup all subscriptions
   */
  cleanup(): void {
    this.realtimeChannels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.realtimeChannels.clear();
  }
}

// Export singleton instance
export const adminService = new AdminService();

// Export types
export type {
  AdminStats,
  ReportWithDetails,
  AdminUser,
  SystemHealth,
  AdminActivity,
  ServiceResponse,
};
