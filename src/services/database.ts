/**
 * Comprehensive Database Service
 * Centralized service layer for all Supabase database operations
 */

import { supabase, isDemoMode } from "@/integrations/supabase/client";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

// Type aliases for convenience
type Report = Tables<"reports">;
type ReportInsert = TablesInsert<"reports">;
type ReportUpdate = TablesUpdate<"reports">;

type Notification = Tables<"notifications">;
type NotificationInsert = TablesInsert<"notifications">;

type CommunityInteraction = Tables<"community_interactions">;
type CommunityInteractionInsert = TablesInsert<"community_interactions">;

type ReportEvidence = Tables<"report_evidence">;
type ReportEvidenceInsert = TablesInsert<"report_evidence">;

// Generic response type
interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  message?: string;
}

/**
 * Base Database Service Class
 */
class DatabaseService {
  /**
   * Generic query executor with error handling
   */
  private async executeQuery<T>(
    queryFn: () => Promise<any>,
    operation: string,
  ): Promise<ServiceResponse<T>> {
    try {
      if (isDemoMode) {
        return {
          data: null,
          error: "Demo mode - database operations are simulated",
          success: false,
          message: "Database operations are disabled in demo mode",
        };
      }

      const response = await queryFn();

      if (response.error) {
        console.error(`Database ${operation} error:`, response.error);
        return {
          data: null,
          error: response.error.message || `Failed to ${operation}`,
          success: false,
        };
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
      console.error(`Database ${operation} exception:`, error);

      return {
        data: null,
        error: message,
        success: false,
      };
    }
  }

  /**
   * Check database connection health
   */
  async healthCheck(): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(
      () => supabase.from("reports").select("id").limit(1),
      "health check",
    );
  }
}

/**
 * Reports Service
 */
class ReportsService extends DatabaseService {
  /**
   * Get all reports with optional filtering
   */
  async getAll(
    filters: {
      status?: string;
      fraud_type?: string;
      user_id?: string;
      city?: string;
      state?: string;
      date_from?: string;
      date_to?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<ServiceResponse<{ reports: Report[]; total: number }>> {
    const offset = (page - 1) * limit;

    return this.executeQuery(async () => {
      let query = supabase
        .from("reports")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.fraud_type) {
        query = query.eq("fraud_type", filters.fraud_type);
      }
      if (filters.user_id) {
        query = query.eq("user_id", filters.user_id);
      }
      if (filters.city) {
        query = query.eq("city", filters.city);
      }
      if (filters.state) {
        query = query.eq("state", filters.state);
      }
      if (filters.date_from) {
        query = query.gte("created_at", filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte("created_at", filters.date_to);
      }

      const result = await query;

      return {
        data: {
          reports: result.data || [],
          total: result.count || 0,
        },
        error: result.error,
      };
    }, "fetch reports");
  }

  /**
   * Get report by ID
   */
  async getById(id: string): Promise<ServiceResponse<Report>> {
    return this.executeQuery(
      () => supabase.from("reports").select("*").eq("id", id).single(),
      "fetch report",
    );
  }

  /**
   * Create new report
   */
  async create(report: ReportInsert): Promise<ServiceResponse<Report>> {
    return this.executeQuery(
      () => supabase.from("reports").insert(report).select().single(),
      "create report",
    );
  }

  /**
   * Update report
   */
  async update(
    id: string,
    updates: ReportUpdate,
  ): Promise<ServiceResponse<Report>> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    return this.executeQuery(
      () =>
        supabase
          .from("reports")
          .update(updateData)
          .eq("id", id)
          .select()
          .single(),
      "update report",
    );
  }

  /**
   * Delete report
   */
  async delete(id: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(
      () => supabase.from("reports").delete().eq("id", id),
      "delete report",
    );
  }

  /**
   * Get user's reports
   */
  async getUserReports(userId: string): Promise<ServiceResponse<Report[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("reports")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      "fetch user reports",
    );
  }

  /**
   * Get report statistics
   */
  async getStats(): Promise<
    ServiceResponse<{
      total: number;
      pending: number;
      resolved: number;
      rejected: number;
      totalAmount: number;
    }>
  > {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("reports")
        .select("status, amount_involved");

      if (result.error) return result;

      const reports = result.data || [];
      const stats = {
        total: reports.length,
        pending: reports.filter((r) => r.status === "pending").length,
        resolved: reports.filter((r) => r.status === "resolved").length,
        rejected: reports.filter((r) => r.status === "rejected").length,
        totalAmount: reports.reduce(
          (sum, r) => sum + (r.amount_involved || 0),
          0,
        ),
      };

      return { data: stats, error: null };
    }, "fetch report statistics");
  }
}

/**
 * Notifications Service
 */
class NotificationsService extends DatabaseService {
  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
  ): Promise<ServiceResponse<Notification[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      "fetch notifications",
    );
  }

  /**
   * Create notification
   */
  async create(
    notification: NotificationInsert,
  ): Promise<ServiceResponse<Notification>> {
    return this.executeQuery(
      () =>
        supabase.from("notifications").insert(notification).select().single(),
      "create notification",
    );
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<ServiceResponse<Notification>> {
    return this.executeQuery(
      () =>
        supabase
          .from("notifications")
          .update({ read: true })
          .eq("id", id)
          .select()
          .single(),
      "mark notification as read",
    );
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(
      () =>
        supabase
          .from("notifications")
          .update({ read: true })
          .eq("user_id", userId),
      "mark all notifications as read",
    );
  }

  /**
   * Delete notification
   */
  async delete(id: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(
      () => supabase.from("notifications").delete().eq("id", id),
      "delete notification",
    );
  }
}

/**
 * Community Interactions Service
 */
class CommunityInteractionsService extends DatabaseService {
  /**
   * Get interactions for a report
   */
  async getReportInteractions(
    reportId: string,
  ): Promise<ServiceResponse<CommunityInteraction[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("community_interactions")
          .select("*")
          .eq("report_id", reportId)
          .order("created_at", { ascending: false }),
      "fetch report interactions",
    );
  }

  /**
   * Create interaction
   */
  async create(
    interaction: CommunityInteractionInsert,
  ): Promise<ServiceResponse<CommunityInteraction>> {
    return this.executeQuery(
      () =>
        supabase
          .from("community_interactions")
          .insert(interaction)
          .select()
          .single(),
      "create interaction",
    );
  }

  /**
   * Update interaction
   */
  async update(
    id: string,
    content: string,
  ): Promise<ServiceResponse<CommunityInteraction>> {
    return this.executeQuery(
      () =>
        supabase
          .from("community_interactions")
          .update({ content })
          .eq("id", id)
          .select()
          .single(),
      "update interaction",
    );
  }

  /**
   * Delete interaction
   */
  async delete(id: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(
      () => supabase.from("community_interactions").delete().eq("id", id),
      "delete interaction",
    );
  }
}

/**
 * Evidence Service
 */
class EvidenceService extends DatabaseService {
  /**
   * Get report evidence
   */
  async getReportEvidence(
    reportId: string,
  ): Promise<ServiceResponse<ReportEvidence[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("report_evidence")
          .select("*")
          .eq("report_id", reportId)
          .order("uploaded_at", { ascending: false }),
      "fetch report evidence",
    );
  }

  /**
   * Upload evidence file
   */
  async uploadFile(
    file: File,
    reportId: string,
    userId: string,
  ): Promise<ServiceResponse<{ fileUrl: string; evidence: ReportEvidence }>> {
    try {
      if (isDemoMode) {
        return {
          data: null,
          error: "File upload not available in demo mode",
          success: false,
        };
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${reportId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("evidence-files")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("evidence-files").getPublicUrl(fileName);

      // Save evidence record
      const evidenceData: ReportEvidenceInsert = {
        report_id: reportId,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        file_type: fileExt || null,
        mime_type: file.type || null,
        uploaded_by: userId,
      };

      const { data: evidence, error: evidenceError } = await supabase
        .from("report_evidence")
        .insert(evidenceData)
        .select()
        .single();

      if (evidenceError) throw evidenceError;

      return {
        data: {
          fileUrl: publicUrl,
          evidence: evidence,
        },
        error: null,
        success: true,
        message: "File uploaded successfully",
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "File upload failed";
      return {
        data: null,
        error: message,
        success: false,
      };
    }
  }

  /**
   * Delete evidence
   */
  async delete(id: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      // Get evidence record first
      const { data: evidence, error: fetchError } = await supabase
        .from("report_evidence")
        .select("file_path")
        .eq("id", id)
        .single();

      if (fetchError) return { error: fetchError };

      // Delete file from storage
      if (evidence) {
        await supabase.storage
          .from("evidence-files")
          .remove([evidence.file_path]);
      }

      // Delete evidence record
      return await supabase.from("report_evidence").delete().eq("id", id);
    }, "delete evidence");
  }
}

/**
 * Real-time Subscriptions Service
 */
class RealtimeService {
  private subscriptions: Map<string, any> = new Map();

  /**
   * Subscribe to report updates
   */
  subscribeToReports(callback: (payload: any) => void, userId?: string) {
    if (isDemoMode) {
      console.log("Real-time subscriptions not available in demo mode");
      return () => {};
    }

    let channel = supabase
      .channel("reports-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reports",
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        callback,
      )
      .subscribe();

    this.subscriptions.set("reports", channel);

    return () => {
      channel.unsubscribe();
      this.subscriptions.delete("reports");
    };
  }

  /**
   * Subscribe to notification updates
   */
  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    if (isDemoMode) {
      console.log("Real-time subscriptions not available in demo mode");
      return () => {};
    }

    let channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe();

    this.subscriptions.set("notifications", channel);

    return () => {
      channel.unsubscribe();
      this.subscriptions.delete("notifications");
    };
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll() {
    this.subscriptions.forEach((channel) => {
      channel.unsubscribe();
    });
    this.subscriptions.clear();
  }
}

// Export service instances
export const reportsService = new ReportsService();
export const notificationsService = new NotificationsService();
export const communityService = new CommunityInteractionsService();
export const evidenceService = new EvidenceService();
export const realtimeService = new RealtimeService();

// Export database service for health checks
export const databaseService = new DatabaseService();

// Export types for use in components
export type {
  Report,
  ReportInsert,
  ReportUpdate,
  Notification,
  NotificationInsert,
  CommunityInteraction,
  CommunityInteractionInsert,
  ReportEvidence,
  ReportEvidenceInsert,
  ServiceResponse,
};
