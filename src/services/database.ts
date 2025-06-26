/**
 * Comprehensive Database Service with Enhanced CRUD Operations
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

type UserProfile = Tables<"user_profiles">;
type UserProfileInsert = TablesInsert<"user_profiles">;
type UserProfileUpdate = TablesUpdate<"user_profiles">;

type Notification = Tables<"notifications">;
type NotificationInsert = TablesInsert<"notifications">;

type CommunityInteraction = Tables<"community_interactions">;
type CommunityInteractionInsert = TablesInsert<"community_interactions">;

type ReportEvidence = Tables<"report_evidence">;
type ReportEvidenceInsert = TablesInsert<"report_evidence">;

// Extended types for community features
interface CommunityPost {
  id: string;
  user_id: string;
  category_id?: string;
  report_id?: string;
  title: string;
  content: string;
  post_type: "discussion" | "question" | "warning" | "tip" | "news";
  tags?: string[];
  is_pinned: boolean;
  is_locked: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  bookmark_count: number;
  last_activity: string;
  last_comment_at?: string;
  last_comment_by?: string;
  created_at: string;
  updated_at: string;
}

interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  like_count: number;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  updated_at: string;
}

interface CommunityCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  post_count: number;
  latest_post_id?: string;
  created_at: string;
  updated_at: string;
}

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
 * Enhanced Reports Service with Full CRUD
 */
class ReportsService extends DatabaseService {
  /**
   * Get all reports with comprehensive filtering and pagination
   */
  async getAll(
    filters: {
      status?: string;
      fraud_type?: string;
      user_id?: string;
      date_from?: string;
      date_to?: string;
      location?: string;
      search?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
    sortBy: string = "created_at",
    sortOrder: "asc" | "desc" = "desc",
  ): Promise<
    ServiceResponse<{ reports: Report[]; total: number; page_info: any }>
  > {
    const offset = (page - 1) * limit;

    return this.executeQuery(async () => {
      let query = supabase
        .from("reports")
        .select("*", { count: "exact" })
        .order(sortBy, { ascending: sortOrder === "asc" })
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
      if (filters.date_from) {
        query = query.gte("created_at", filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte("created_at", filters.date_to);
      }
      if (filters.location) {
        query = query.ilike("state", `%${filters.location}%`);
      }
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
        );
      }

      const result = await query;
      const total = result.count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: {
          reports: result.data || [],
          total,
          page_info: {
            current_page: page,
            total_pages: totalPages,
            has_next: page < totalPages,
            has_prev: page > 1,
            per_page: limit,
          },
        },
        error: result.error,
      };
    }, "fetch reports");
  }

  /**
   * Get report by ID with related data
   */
  async getById(
    id: string,
    includeRelated: boolean = false,
  ): Promise<ServiceResponse<any>> {
    return this.executeQuery(async () => {
      let query = supabase.from("reports").select("*").eq("id", id);

      if (includeRelated) {
        // Include evidence and interactions
        const [reportResult, evidenceResult, interactionsResult] =
          await Promise.all([
            supabase.from("reports").select("*").eq("id", id).single(),
            supabase.from("report_evidence").select("*").eq("report_id", id),
            supabase
              .from("community_interactions")
              .select("*")
              .eq("report_id", id)
              .order("created_at", { ascending: false }),
          ]);

        if (reportResult.data) {
          return {
            data: {
              ...reportResult.data,
              evidence: evidenceResult.data || [],
              interactions: interactionsResult.data || [],
            },
            error: reportResult.error,
          };
        }
        return reportResult;
      }

      return query.single();
    }, "fetch report");
  }

  /**
   * Create new report with validation
   */
  async create(report: ReportInsert): Promise<ServiceResponse<Report>> {
    return this.executeQuery(async () => {
      // Validate required fields
      if (!report.title || !report.description || !report.fraud_type) {
        throw new Error("Title, description, and fraud type are required");
      }

      const result = await supabase
        .from("reports")
        .insert({
          ...report,
          status: report.status || "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      // Create notification for user
      if (result.data) {
        await supabase.from("notifications").insert({
          user_id: report.user_id,
          title: "Report Created Successfully",
          message: `Your fraud report "${report.title}" has been submitted and is being reviewed.`,
          type: "success",
          reference_id: result.data.id,
          reference_type: "report",
        });
      }

      return result;
    }, "create report");
  }

  /**
   * Update report with change tracking
   */
  async update(
    id: string,
    updates: ReportUpdate,
    updatedBy?: string,
  ): Promise<ServiceResponse<Report>> {
    return this.executeQuery(async () => {
      // Get original report for change tracking
      const originalResult = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();

      if (!originalResult.data) {
        throw new Error("Report not found");
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const result = await supabase
        .from("reports")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      // Track status changes
      if (updates.status && originalResult.data.status !== updates.status) {
        await supabase.from("report_status_history").insert({
          report_id: id,
          status: updates.status,
          changed_by: updatedBy,
          comments: `Status changed from ${originalResult.data.status} to ${updates.status}`,
        });

        // Notify user of status change
        await supabase.from("notifications").insert({
          user_id: originalResult.data.user_id,
          title: "Report Status Updated",
          message: `Your report status has been updated to: ${updates.status}`,
          type: "info",
          reference_id: id,
          reference_type: "report",
        });
      }

      return result;
    }, "update report");
  }

  /**
   * Soft delete report
   */
  async delete(id: string, userId?: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      // Check if user owns the report
      if (userId) {
        const checkResult = await supabase
          .from("reports")
          .select("user_id")
          .eq("id", id)
          .single();

        if (checkResult.data?.user_id !== userId) {
          throw new Error("Unauthorized: You can only delete your own reports");
        }
      }

      // Instead of hard delete, mark as withdrawn
      const result = await supabase
        .from("reports")
        .update({
          status: "withdrawn",
          withdrawn_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      return { data: true, error: result.error };
    }, "delete report");
  }

  /**
   * Get user's reports with stats
   */
  async getUserReports(userId: string): Promise<
    ServiceResponse<{
      reports: Report[];
      stats: {
        total: number;
        pending: number;
        resolved: number;
        rejected: number;
      };
    }>
  > {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", userId)
        .neq("status", "withdrawn")
        .order("created_at", { ascending: false });

      if (result.error) return result;

      const reports = result.data || [];
      const stats = {
        total: reports.length,
        pending: reports.filter((r) => r.status === "pending").length,
        resolved: reports.filter((r) => r.status === "resolved").length,
        rejected: reports.filter((r) => r.status === "rejected").length,
      };

      return { data: { reports, stats }, error: null };
    }, "fetch user reports");
  }

  /**
   * Search reports with full-text search
   */
  async search(
    query: string,
    filters: any = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<ServiceResponse<{ reports: Report[]; total: number }>> {
    const offset = (page - 1) * limit;

    return this.executeQuery(async () => {
      let dbQuery = supabase
        .from("reports")
        .select("*", { count: "exact" })
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply additional filters
      if (filters.fraud_type) {
        dbQuery = dbQuery.eq("fraud_type", filters.fraud_type);
      }
      if (filters.status) {
        dbQuery = dbQuery.eq("status", filters.status);
      }

      const result = await dbQuery;

      return {
        data: {
          reports: result.data || [],
          total: result.count || 0,
        },
        error: result.error,
      };
    }, "search reports");
  }
}

/**
 * Enhanced Community Posts Service
 */
class CommunityPostsService extends DatabaseService {
  /**
   * Get all posts with advanced filtering
   */
  async getPosts(
    filters: {
      category_id?: string;
      post_type?: string;
      user_id?: string;
      is_pinned?: boolean;
      search?: string;
    } = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<ServiceResponse<{ posts: any[]; total: number }>> {
    const offset = (page - 1) * limit;

    return this.executeQuery(async () => {
      let query = supabase
        .from("community_posts")
        .select(
          `
          *,
          users!inner(full_name, email),
          user_profiles!inner(profile_picture_url, reputation_score),
          community_categories(name, color)
        `,
          { count: "exact" },
        )
        .order("is_pinned", { ascending: false })
        .order("last_activity", { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.category_id) {
        query = query.eq("category_id", filters.category_id);
      }
      if (filters.post_type) {
        query = query.eq("post_type", filters.post_type);
      }
      if (filters.user_id) {
        query = query.eq("user_id", filters.user_id);
      }
      if (filters.is_pinned !== undefined) {
        query = query.eq("is_pinned", filters.is_pinned);
      }
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`,
        );
      }

      const result = await query;

      return {
        data: {
          posts: result.data || [],
          total: result.count || 0,
        },
        error: result.error,
      };
    }, "fetch community posts");
  }

  /**
   * Create new community post
   */
  async createPost(post: {
    user_id: string;
    category_id?: string;
    title: string;
    content: string;
    post_type?: string;
    tags?: string[];
  }): Promise<ServiceResponse<CommunityPost>> {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("community_posts")
        .insert({
          ...post,
          post_type: post.post_type || "discussion",
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          bookmark_count: 0,
          is_pinned: false,
          is_locked: false,
          is_featured: false,
          last_activity: new Date().toISOString(),
        })
        .select()
        .single();

      return result;
    }, "create community post");
  }

  /**
   * Update post view count
   */
  async incrementViewCount(postId: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      const result = await supabase.rpc("increment_post_views", {
        post_id: postId,
      });
      return { data: true, error: result.error };
    }, "increment post views");
  }

  /**
   * Like/Unlike post
   */
  async toggleLike(
    postId: string,
    userId: string,
  ): Promise<ServiceResponse<{ liked: boolean; likeCount: number }>> {
    return this.executeQuery(async () => {
      // Check if already liked
      const existingLike = await supabase
        .from("community_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (existingLike.data) {
        // Unlike
        await supabase
          .from("community_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);

        return { data: { liked: false, likeCount: -1 }, error: null };
      } else {
        // Like
        await supabase
          .from("community_likes")
          .insert({ post_id: postId, user_id: userId });

        return { data: { liked: true, likeCount: 1 }, error: null };
      }
    }, "toggle post like");
  }
}

/**
 * Enhanced Community Comments Service
 */
class CommunityCommentsService extends DatabaseService {
  /**
   * Get comments for a post
   */
  async getComments(postId: string): Promise<ServiceResponse<any[]>> {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("community_comments")
        .select(
          `
          *,
          users!inner(full_name),
          user_profiles!inner(profile_picture_url, reputation_score),
          replies:community_comments!parent_comment_id(
            *,
            users!inner(full_name),
            user_profiles!inner(profile_picture_url, reputation_score)
          )
        `,
        )
        .eq("post_id", postId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: false });

      return result;
    }, "fetch post comments");
  }

  /**
   * Add comment
   */
  async addComment(comment: {
    post_id: string;
    user_id: string;
    content: string;
    parent_comment_id?: string;
  }): Promise<ServiceResponse<CommunityComment>> {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("community_comments")
        .insert({
          ...comment,
          like_count: 0,
          is_edited: false,
        })
        .select()
        .single();

      // Update post's last activity
      if (result.data) {
        await supabase
          .from("community_posts")
          .update({
            last_activity: new Date().toISOString(),
            last_comment_at: new Date().toISOString(),
            last_comment_by: comment.user_id,
          })
          .eq("id", comment.post_id);
      }

      return result;
    }, "add comment");
  }

  /**
   * Update comment
   */
  async updateComment(
    commentId: string,
    content: string,
    userId: string,
  ): Promise<ServiceResponse<CommunityComment>> {
    return this.executeQuery(async () => {
      // Check ownership
      const checkResult = await supabase
        .from("community_comments")
        .select("user_id")
        .eq("id", commentId)
        .single();

      if (checkResult.data?.user_id !== userId) {
        throw new Error("Unauthorized: You can only edit your own comments");
      }

      const result = await supabase
        .from("community_comments")
        .update({
          content,
          is_edited: true,
          edited_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", commentId)
        .select()
        .single();

      return result;
    }, "update comment");
  }

  /**
   * Delete comment
   */
  async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      // Check ownership
      const checkResult = await supabase
        .from("community_comments")
        .select("user_id")
        .eq("id", commentId)
        .single();

      if (checkResult.data?.user_id !== userId) {
        throw new Error("Unauthorized: You can only delete your own comments");
      }

      const result = await supabase
        .from("community_comments")
        .delete()
        .eq("id", commentId);

      return { data: true, error: result.error };
    }, "delete comment");
  }
}

/**
 * Enhanced User Profiles Service
 */
class UserProfilesService extends DatabaseService {
  /**
   * Get comprehensive user profile
   */
  async getProfile(userId: string): Promise<ServiceResponse<any>> {
    return this.executeQuery(async () => {
      const [profileResult, statsResult] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single(),
        supabase.from("users").select("*").eq("id", userId).single(),
      ]);

      if (profileResult.data && statsResult.data) {
        return {
          data: {
            ...profileResult.data,
            user: statsResult.data,
          },
          error: null,
        };
      }

      return { data: null, error: profileResult.error || statsResult.error };
    }, "fetch comprehensive user profile");
  }

  /**
   * Update user profile with validation
   */
  async updateProfile(
    userId: string,
    updates: UserProfileUpdate,
  ): Promise<ServiceResponse<UserProfile>> {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("user_profiles")
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      return result;
    }, "update user profile");
  }

  /**
   * Get user activity stats
   */
  async getUserStats(userId: string): Promise<
    ServiceResponse<{
      reports_count: number;
      posts_count: number;
      comments_count: number;
      likes_received: number;
      reputation_score: number;
    }>
  > {
    return this.executeQuery(async () => {
      const [reportsResult, postsResult, commentsResult, profileResult] =
        await Promise.all([
          supabase
            .from("reports")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId),
          supabase
            .from("community_posts")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId),
          supabase
            .from("community_comments")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId),
          supabase
            .from("user_profiles")
            .select("reputation_score, total_likes_received")
            .eq("user_id", userId)
            .single(),
        ]);

      return {
        data: {
          reports_count: reportsResult.count || 0,
          posts_count: postsResult.count || 0,
          comments_count: commentsResult.count || 0,
          likes_received: profileResult.data?.total_likes_received || 0,
          reputation_score: profileResult.data?.reputation_score || 0,
        },
        error: null,
      };
    }, "fetch user stats");
  }
}

/**
 * Enhanced Notifications Service
 */
class NotificationsService extends DatabaseService {
  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false,
  ): Promise<
    ServiceResponse<{
      notifications: Notification[];
      total: number;
      unread_count: number;
    }>
  > {
    const offset = (page - 1) * limit;

    return this.executeQuery(async () => {
      let query = supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (unreadOnly) {
        query = query.eq("is_read", false);
      }

      const [notificationsResult, unreadResult] = await Promise.all([
        query,
        supabase
          .from("notifications")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("is_read", false),
      ]);

      return {
        data: {
          notifications: notificationsResult.data || [],
          total: notificationsResult.count || 0,
          unread_count: unreadResult.count || 0,
        },
        error: notificationsResult.error,
      };
    }, "fetch user notifications");
  }

  /**
   * Mark notification as read
   */
  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", userId);

      return { data: true, error: result.error };
    }, "mark notification as read");
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      return { data: true, error: result.error };
    }, "mark all notifications as read");
  }

  /**
   * Delete notification
   */
  async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<ServiceResponse<boolean>> {
    return this.executeQuery(async () => {
      const result = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", userId);

      return { data: true, error: result.error };
    }, "delete notification");
  }
}

// Export enhanced service instances
export const reportsService = new ReportsService();
export const communityPostsService = new CommunityPostsService();
export const communityCommentsService = new CommunityCommentsService();
export const userProfilesService = new UserProfilesService();
export const notificationsService = new NotificationsService();

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
  ServiceResponse,
  CommunityPost,
  CommunityComment,
  CommunityCategory,
};
