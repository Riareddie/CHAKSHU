/**
 * Simplified Admin Service for Available Tables
 * Works only with tables that actually exist in the database
 */

import { supabase, isDemoMode } from "@/integrations/supabase/client";

// Available table structure (based on user's database)
interface FraudReport {
  id: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  status?: string;
  amount_involved?: number;
  fraud_type?: string;
  title?: string;
  description?: string;
  city?: string;
  state?: string;
}

interface OtpVerification {
  id: string;
  created_at: string;
  user_id?: string;
  phone?: string;
  verified?: boolean;
}

export interface SimpleAdminStats {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  uniqueUsers: number;
  totalAmount: number;
  lastUpdated: string;
}

export interface SimpleReportData extends FraudReport {
  user_email?: string;
  user_name?: string;
  priority?: "low" | "medium" | "high" | "critical";
}

// Service response type
interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
}

/**
 * Simplified Admin Service Class
 */
class SimplifiedAdminService {
  /**
   * Get basic admin statistics using only available tables
   */
  async getStats(): Promise<ServiceResponse<SimpleAdminStats>> {
    try {
      console.log("🔄 Fetching stats from available tables...");

      // Get fraud reports data
      const { data: reports, error: reportsError } = await supabase
        .from("fraud_reports")
        .select("*");

      if (reportsError) {
        console.error("❌ Error fetching fraud reports:", {
          message: reportsError?.message,
          code: reportsError?.code,
          details: reportsError?.details,
        });
        throw new Error(`Reports query failed: ${reportsError.message}`);
      }

      console.log(`✅ Fetched ${reports?.length || 0} fraud reports`);

      // Calculate statistics
      const allReports = reports || [];
      const totalReports = allReports.length;
      const pendingReports = allReports.filter(
        (r) => r.status === "pending" || !r.status,
      ).length;
      const resolvedReports = allReports.filter(
        (r) => r.status === "resolved",
      ).length;
      const uniqueUsers = new Set(
        allReports.map((r) => r.user_id).filter(Boolean),
      ).size;
      const totalAmount = allReports.reduce(
        (sum, r) => sum + (r.amount_involved || 0),
        0,
      );

      const stats: SimpleAdminStats = {
        totalReports,
        pendingReports,
        resolvedReports,
        uniqueUsers,
        totalAmount,
        lastUpdated: new Date().toISOString(),
      };

      console.log("✅ Admin stats calculated:", stats);

      return {
        data: stats,
        error: null,
        success: true,
        message: "Stats fetched successfully",
      };
    } catch (error) {
      console.error("❌ Failed to fetch admin stats:", error);
      return {
        data: null,
        error: error instanceof Error ? error.message : "Failed to fetch stats",
        success: false,
      };
    }
  }

  /**
   * Get fraud reports for admin review
   */
  async getReports(
    limit: number = 20,
  ): Promise<ServiceResponse<SimpleReportData[]>> {
    try {
      console.log("🔄 Fetching fraud reports for review...");

      const { data: reports, error } = await supabase
        .from("fraud_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("❌ Error fetching reports:", {
          message: error?.message,
          code: error?.code,
          details: error?.details,
        });
        throw new Error(`Reports query failed: ${error.message}`);
      }

      console.log(`✅ Fetched ${reports?.length || 0} reports for review`);

      // Enhance reports with additional data
      const enhancedReports: SimpleReportData[] = (reports || []).map(
        (report) => ({
          ...report,
          user_email: report.user_id
            ? `user-${report.user_id.slice(0, 8)}@example.com`
            : "unknown@example.com",
          user_name: report.user_id
            ? `User ${report.user_id.slice(0, 8)}`
            : "Unknown User",
          priority: this.calculatePriority(
            report.amount_involved,
            report.fraud_type,
          ),
        }),
      );

      return {
        data: enhancedReports,
        error: null,
        success: true,
        message: "Reports fetched successfully",
      };
    } catch (error) {
      console.error("❌ Failed to fetch reports:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to fetch reports",
        success: false,
      };
    }
  }

  /**
   * Update report status
   */
  async updateReportStatus(
    reportId: string,
    newStatus: string,
    comments?: string,
  ): Promise<ServiceResponse<FraudReport>> {
    try {
      console.log(`🔄 Updating report ${reportId} to status: ${newStatus}`);

      const { data: updatedReport, error } = await supabase
        .from("fraud_reports")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          ...(comments && { comments }),
        })
        .eq("id", reportId)
        .select()
        .single();

      if (error) {
        console.error("❌ Error updating report:", {
          message: error?.message,
          code: error?.code,
          details: error?.details,
        });
        throw new Error(`Update failed: ${error.message}`);
      }

      console.log(`✅ Report ${reportId} updated successfully`);

      return {
        data: updatedReport,
        error: null,
        success: true,
        message: "Report updated successfully",
      };
    } catch (error) {
      console.error("❌ Failed to update report:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to update report",
        success: false,
      };
    }
  }

  /**
   * Get basic user information from available data
   */
  async getUsers(): Promise<ServiceResponse<any[]>> {
    try {
      console.log("🔄 Fetching user data from available tables...");

      // Get unique users from fraud reports
      const { data: reports, error: reportsError } = await supabase
        .from("fraud_reports")
        .select("user_id, created_at, amount_involved")
        .not("user_id", "is", null);

      if (reportsError) {
        console.error(
          "❌ Error fetching user data from reports:",
          reportsError,
        );
        throw new Error(`User data query failed: ${reportsError.message}`);
      }

      // Group by user_id to create user profiles
      const userMap = new Map();
      (reports || []).forEach((report) => {
        const userId = report.user_id;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            id: userId,
            email: `user-${userId.slice(0, 8)}@example.com`,
            full_name: `User ${userId.slice(0, 8)}`,
            created_at: report.created_at,
            reports_count: 0,
            total_amount_reported: 0,
            status: "active",
            role: "user",
          });
        }

        const user = userMap.get(userId);
        user.reports_count++;
        user.total_amount_reported += report.amount_involved || 0;
      });

      const users = Array.from(userMap.values());
      console.log(`✅ Processed ${users.length} unique users`);

      return {
        data: users,
        error: null,
        success: true,
        message: "User data processed successfully",
      };
    } catch (error) {
      console.error("❌ Failed to fetch user data:", error);
      return {
        data: null,
        error:
          error instanceof Error ? error.message : "Failed to fetch user data",
        success: false,
      };
    }
  }

  /**
   * Test database connectivity
   */
  async testConnection(): Promise<
    ServiceResponse<{ connected: boolean; tablesAvailable: string[] }>
  > {
    try {
      console.log("🔄 Testing database connection...");

      const tablesAvailable = [];

      // Test fraud_reports table
      try {
        await supabase.from("fraud_reports").select("id").limit(1);
        tablesAvailable.push("fraud_reports");
        console.log("✅ fraud_reports table is accessible");
      } catch (error) {
        console.log("❌ fraud_reports table not accessible");
      }

      // Test otp_verification table
      try {
        await supabase.from("otp_verification").select("id").limit(1);
        tablesAvailable.push("otp_verification");
        console.log("✅ otp_verification table is accessible");
      } catch (error) {
        console.log("❌ otp_verification table not accessible");
      }

      const connected = tablesAvailable.length > 0;

      return {
        data: { connected, tablesAvailable },
        error: null,
        success: true,
        message: `Connection test completed. ${tablesAvailable.length} tables accessible.`,
      };
    } catch (error) {
      console.error("❌ Connection test failed:", error);
      return {
        data: { connected: false, tablesAvailable: [] },
        error:
          error instanceof Error ? error.message : "Connection test failed",
        success: false,
      };
    }
  }

  /**
   * Helper method to calculate priority
   */
  private calculatePriority(
    amount: number | null,
    fraudType?: string,
  ): "low" | "medium" | "high" | "critical" {
    if (!amount) return "low";
    if (amount >= 100000) return "critical";
    if (amount >= 50000) return "high";
    if (amount >= 10000) return "medium";
    return "low";
  }
}

// Export singleton instance
export const simplifiedAdminService = new SimplifiedAdminService();

// Export types
export type {
  SimpleAdminStats,
  SimpleReportData,
  FraudReport,
  OtpVerification,
  ServiceResponse,
};
