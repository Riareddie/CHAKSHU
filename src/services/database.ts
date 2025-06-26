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

// Type aliases for convenience - using fraud_reports table
type FraudReport = {
  id: string;
  user_id: string;
  report_type: string;
  fraudulent_number: string;
  incident_date: string;
  incident_time?: string;
  description: string;
  fraud_category: string;
  evidence_urls?: string[];
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
};

type FraudReportInsert = {
  user_id: string;
  report_type: string;
  fraudulent_number: string;
  incident_date: string;
  incident_time?: string;
  description: string;
  fraud_category: string;
  evidence_urls?: string[];
  status?: string;
  priority?: string;
};

type FraudReportUpdate = Partial<FraudReportInsert>;

// Keep legacy names for compatibility
type Report = FraudReport;
type ReportInsert = FraudReportInsert;
type ReportUpdate = FraudReportUpdate;

type Notification = Tables<"notifications">;
type NotificationInsert = TablesInsert<"notifications">;

type UserProfile = Tables<"user_profiles">;
type UserProfileInsert = TablesInsert<"user_profiles">;
type UserProfileUpdate = TablesUpdate<"user_profiles">;

type CommunityInteraction = Tables<"community_interactions">;
type CommunityInteractionInsert = TablesInsert<"community_interactions">;

type ReportEvidence = Tables<"report_evidence">;
type ReportEvidenceInsert = TablesInsert<"report_evidence">;

type SupportTicket = Tables<"support_tickets">;
type SupportTicketInsert = TablesInsert<"support_tickets">;

type EducationArticle = Tables<"education_articles">;
type FAQ = Tables<"faqs">;

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
  protected async executeQuery<T>(
    queryFn: () => Promise<any>,
    operation: string,
  ): Promise<ServiceResponse<T>> {
    try {
      if (isDemoMode) {
        console.log(`Demo mode: ${operation} operation simulated`);
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
      fraud_category?: string;
      user_id?: string;
      date_from?: string;
      date_to?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<ServiceResponse<{ reports: Report[]; total: number }>> {
    const offset = (page - 1) * limit;

    return this.executeQuery(async () => {
      let query = supabase
        .from("fraud_reports")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.fraud_category) {
        query = query.eq("fraud_category", filters.fraud_category);
      }
      if (filters.user_id) {
        query = query.eq("user_id", filters.user_id);
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
      () => supabase.from("fraud_reports").select("*").eq("id", id).single(),
      "fetch report",
    );
  }

  /**
   * Create new report
   */
  async create(report: ReportInsert): Promise<ServiceResponse<Report>> {
    return this.executeQuery(
      () => supabase.from("fraud_reports").insert(report).select().single(),
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
          .from("fraud_reports")
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
      () => supabase.from("fraud_reports").delete().eq("id", id),
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
          .from("fraud_reports")
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
      byFraudCategory: Record<string, number>;
    }>
  > {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("fraud_reports")
        .select("status, fraud_category");

      if (result.error) return result;

      const reports = result.data || [];
      const stats = {
        total: reports.length,
        pending: reports.filter((r) => r.status === "pending").length,
        resolved: reports.filter((r) => r.status === "resolved").length,
        rejected: reports.filter((r) => r.status === "rejected").length,
        byFraudCategory: {} as Record<string, number>,
      };

      // Calculate fraud category distribution
      reports.forEach((report) => {
        stats.byFraudCategory[report.fraud_category] =
          (stats.byFraudCategory[report.fraud_category] || 0) + 1;
      });

      return { data: stats, error: null };
    }, "fetch report statistics");
  }
}

/**
 * User Profiles Service
 */
class UserProfilesService extends DatabaseService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<ServiceResponse<UserProfile>> {
    return this.executeQuery(
      () =>
        supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single(),
      "fetch user profile",
    );
  }

  /**
   * Create or update user profile
   */
  async upsertProfile(
    profile: UserProfileInsert | UserProfileUpdate,
  ): Promise<ServiceResponse<UserProfile>> {
    return this.executeQuery(
      () => supabase.from("user_profiles").upsert(profile).select().single(),
      "upsert user profile",
    );
  }

  /**
   * Update profile picture
   */
  async updateProfilePicture(
    userId: string,
    pictureUrl: string,
  ): Promise<ServiceResponse<UserProfile>> {
    return this.executeQuery(
      () =>
        supabase
          .from("user_profiles")
          .update({
            profile_picture_url: pictureUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId)
          .select()
          .single(),
      "update profile picture",
    );
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
    limit: number = 50,
  ): Promise<ServiceResponse<Notification[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(limit),
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

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<ServiceResponse<number>> {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);

      return { data: result.count || 0, error: result.error };
    }, "fetch unread count");
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
          .update({
            content,
            updated_at: new Date().toISOString(),
          })
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

  /**
   * Get user's interactions
   */
  async getUserInteractions(
    userId: string,
  ): Promise<ServiceResponse<CommunityInteraction[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("community_interactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      "fetch user interactions",
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
 * Support Tickets Service
 */
class SupportTicketsService extends DatabaseService {
  /**
   * Get user's support tickets
   */
  async getUserTickets(
    userId: string,
  ): Promise<ServiceResponse<SupportTicket[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("support_tickets")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      "fetch user tickets",
    );
  }

  /**
   * Create support ticket
   */
  async create(
    ticket: SupportTicketInsert,
  ): Promise<ServiceResponse<SupportTicket>> {
    return this.executeQuery(
      () => supabase.from("support_tickets").insert(ticket).select().single(),
      "create support ticket",
    );
  }

  /**
   * Update ticket status
   */
  async updateStatus(
    id: string,
    status: string,
  ): Promise<ServiceResponse<SupportTicket>> {
    return this.executeQuery(
      () =>
        supabase
          .from("support_tickets")
          .update({
            status,
            updated_at: new Date().toISOString(),
            resolved_at:
              status === "resolved" ? new Date().toISOString() : null,
          })
          .eq("id", id)
          .select()
          .single(),
      "update ticket status",
    );
  }
}

/**
 * Education Service
 */
class EducationService extends DatabaseService {
  /**
   * Get published articles
   */
  async getPublishedArticles(
    category?: string,
    limit: number = 20,
  ): Promise<ServiceResponse<EducationArticle[]>> {
    return this.executeQuery(() => {
      let query = supabase
        .from("education_articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit);

      if (category) {
        query = query.eq("category", category);
      }

      return query;
    }, "fetch education articles");
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(): Promise<ServiceResponse<EducationArticle[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("education_articles")
          .select("*")
          .eq("is_published", true)
          .eq("featured", true)
          .order("published_at", { ascending: false })
          .limit(5),
      "fetch featured articles",
    );
  }

  /**
   * Get article by ID
   */
  async getArticleById(id: string): Promise<ServiceResponse<EducationArticle>> {
    return this.executeQuery(
      () =>
        supabase.from("education_articles").select("*").eq("id", id).single(),
      "fetch article",
    );
  }

  /**
   * Increment article view count
   */
  async incrementViewCount(id: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(
      () => supabase.rpc("increment_article_views", { article_id: id }),
      "increment article views",
    );
  }
}

/**
 * FAQ Service
 */
class FAQService extends DatabaseService {
  /**
   * Get all FAQs
   */
  async getAll(category?: string): Promise<ServiceResponse<FAQ[]>> {
    return this.executeQuery(() => {
      let query = supabase
        .from("faqs")
        .select("*")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (category) {
        query = query.eq("category", category);
      }

      return query;
    }, "fetch FAQs");
  }

  /**
   * Get featured FAQs
   */
  async getFeatured(): Promise<ServiceResponse<FAQ[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("faqs")
          .select("*")
          .eq("is_featured", true)
          .order("priority", { ascending: false })
          .limit(10),
      "fetch featured FAQs",
    );
  }

  /**
   * Search FAQs
   */
  async search(query: string): Promise<ServiceResponse<FAQ[]>> {
    return this.executeQuery(
      () =>
        supabase
          .from("faqs")
          .select("*")
          .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
          .order("priority", { ascending: false }),
      "search FAQs",
    );
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
   * Subscribe to community interactions
   */
  subscribeToCommunityInteractions(
    reportId: string,
    callback: (payload: any) => void,
  ) {
    if (isDemoMode) {
      console.log("Real-time subscriptions not available in demo mode");
      return () => {};
    }

    let channel = supabase
      .channel("community-interactions-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_interactions",
          filter: `report_id=eq.${reportId}`,
        },
        callback,
      )
      .subscribe();

    this.subscriptions.set(`community-${reportId}`, channel);

    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`community-${reportId}`);
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
export const userProfilesService = new UserProfilesService();
export const notificationsService = new NotificationsService();
export const communityService = new CommunityInteractionsService();
export const evidenceService = new EvidenceService();
export const supportTicketsService = new SupportTicketsService();
export const educationService = new EducationService();
export const faqService = new FAQService();
export const realtimeService = new RealtimeService();

// Export database service for health checks
export const databaseService = new DatabaseService();

// Export types for use in components
export type {
  Report,
  ReportInsert,
  ReportUpdate,
  UserProfile,
  UserProfileInsert,
  UserProfileUpdate,
  Notification,
  NotificationInsert,
  CommunityInteraction,
  CommunityInteractionInsert,
  ReportEvidence,
  ReportEvidenceInsert,
  SupportTicket,
  SupportTicketInsert,
  EducationArticle,
  FAQ,
  ServiceResponse,
};
