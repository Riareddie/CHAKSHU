/**
 * Supabase Service Layer for Government Fraud Reporting System
 * Centralized database operations with error handling, audit logging, and RLS enforcement
 */

import {
  supabase,
  supabaseAdmin,
  enforceRLS,
  createSupabaseQuery,
} from "@/lib/supabase";
import type {
  Database,
  FraudReport,
  FraudReportInsert,
  FraudReportUpdate,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  AuditLogInsert,
  NotificationInsert,
  FileAttachmentInsert,
  ApiResponse,
  DatabaseError,
} from "@/types/database";

// Generic service class for common database operations
class BaseSupabaseService<T, TInsert, TUpdate> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  // Get all records with optional filtering and pagination
  async getAll(
    filters?: Record<string, any>,
    pagination?: { page: number; limit: number },
    orderBy?: { column: string; ascending?: boolean },
  ): Promise<ApiResponse<T[]>> {
    const query = createSupabaseQuery(async () => {
      let queryBuilder = supabase.from(this.tableName).select("*");

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryBuilder = queryBuilder.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (orderBy) {
        queryBuilder = queryBuilder.order(orderBy.column, {
          ascending: orderBy.ascending ?? true,
        });
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        queryBuilder = queryBuilder.range(from, to);
      }

      return queryBuilder;
    });

    const result = await query();

    if (result.error) {
      return { data: null, error: result.error.message };
    }

    return {
      data: result.data as T[],
      error: null,
      pagination: pagination
        ? {
            page: pagination.page,
            limit: pagination.limit,
            total: result.data?.length || 0,
            totalPages: pagination
              ? Math.ceil((result.data?.length || 0) / pagination.limit)
              : 1,
          }
        : undefined,
    };
  }

  // Get single record by ID
  async getById(id: string): Promise<ApiResponse<T>> {
    const query = createSupabaseQuery(async () => {
      return supabase.from(this.tableName).select("*").eq("id", id).single();
    });

    const result = await query();

    if (result.error) {
      return { data: null, error: result.error.message };
    }

    return { data: result.data as T, error: null };
  }

  // Create new record
  async create(data: TInsert, userId?: string): Promise<ApiResponse<T>> {
    const query = createSupabaseQuery(async () => {
      return supabase.from(this.tableName).insert([data]).select().single();
    });

    const result = await query();

    if (result.error) {
      return { data: null, error: result.error.message };
    }

    // Audit log for government compliance
    if (userId && result.data) {
      await this.auditLog({
        action: `CREATE_${this.tableName.toUpperCase()}`,
        user_id: userId,
        table_name: this.tableName,
        record_id: (result.data as any).id,
        new_values: data,
        severity: "info",
        description: `Created new ${this.tableName} record`,
      });
    }

    return { data: result.data as T, error: null };
  }

  // Update existing record
  async update(
    id: string,
    data: TUpdate,
    userId?: string,
  ): Promise<ApiResponse<T>> {
    // Get current data for audit trail
    const currentData = await this.getById(id);

    const query = createSupabaseQuery(async () => {
      return supabase
        .from(this.tableName)
        .update(data)
        .eq("id", id)
        .select()
        .single();
    });

    const result = await query();

    if (result.error) {
      return { data: null, error: result.error.message };
    }

    // Audit log for government compliance
    if (userId && result.data) {
      await this.auditLog({
        action: `UPDATE_${this.tableName.toUpperCase()}`,
        user_id: userId,
        table_name: this.tableName,
        record_id: id,
        old_values: currentData.data,
        new_values: result.data,
        severity: "info",
        description: `Updated ${this.tableName} record`,
      });
    }

    return { data: result.data as T, error: null };
  }

  // Soft delete record (government requirement for data retention)
  async softDelete(id: string, userId?: string): Promise<ApiResponse<boolean>> {
    const query = createSupabaseQuery(async () => {
      return supabase
        .from(this.tableName)
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .select();
    });

    const result = await query();

    if (result.error) {
      return { data: false, error: result.error.message };
    }

    // Audit log for government compliance
    if (userId) {
      await this.auditLog({
        action: `SOFT_DELETE_${this.tableName.toUpperCase()}`,
        user_id: userId,
        table_name: this.tableName,
        record_id: id,
        severity: "warning",
        description: `Soft deleted ${this.tableName} record`,
      });
    }

    return { data: true, error: null };
  }

  // Permanent delete (admin only, for GDPR compliance)
  async permanentDelete(
    id: string,
    userId: string,
  ): Promise<ApiResponse<boolean>> {
    // This requires admin privileges and should be used carefully
    const query = createSupabaseQuery(async () => {
      return supabaseAdmin.from(this.tableName).delete().eq("id", id);
    });

    const result = await query();

    if (result.error) {
      return { data: false, error: result.error.message };
    }

    // Critical audit log for permanent deletion
    await this.auditLog({
      action: `PERMANENT_DELETE_${this.tableName.toUpperCase()}`,
      user_id: userId,
      table_name: this.tableName,
      record_id: id,
      severity: "critical",
      description: `Permanently deleted ${this.tableName} record - GDPR/Data retention compliance`,
    });

    return { data: true, error: null };
  }

  // Search records with full-text search
  async search(
    searchTerm: string,
    columns: string[] = ["*"],
    pagination?: { page: number; limit: number },
  ): Promise<ApiResponse<T[]>> {
    const query = createSupabaseQuery(async () => {
      let queryBuilder = supabase
        .from(this.tableName)
        .select(columns.join(","))
        .textSearch("search_vector", searchTerm);

      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        queryBuilder = queryBuilder.range(from, to);
      }

      return queryBuilder;
    });

    const result = await query();

    if (result.error) {
      return { data: null, error: result.error.message };
    }

    return { data: result.data as T[], error: null };
  }

  // Audit logging helper
  protected async auditLog(
    audit: Omit<AuditLogInsert, "timestamp" | "ip_address" | "user_agent">,
  ) {
    try {
      await supabase.from("audit_logs").insert({
        ...audit,
        timestamp: new Date().toISOString(),
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.warn("Audit log failed:", error);
    }
  }

  private async getClientIP(): Promise<string | null> {
    try {
      // In production, implement proper IP detection for government systems
      return null;
    } catch {
      return null;
    }
  }
}

// Fraud Reports Service
class FraudReportService extends BaseSupabaseService<
  FraudReport,
  FraudReportInsert,
  FraudReportUpdate
> {
  constructor() {
    super("fraud_reports");
  }

  // Get fraud reports with user profiles and assignments
  async getReportsWithDetails(
    filters?: Record<string, any>,
    pagination?: { page: number; limit: number },
  ): Promise<ApiResponse<any[]>> {
    const query = createSupabaseQuery(async () => {
      let queryBuilder = supabase.from("fraud_reports").select(`
          *,
          reporter:profiles!fraud_reports_user_id_fkey(*),
          assigned_officer:profiles!fraud_reports_assigned_to_fkey(*),
          comments:report_comments(*),
          attachments:file_attachments(*)
        `);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryBuilder = queryBuilder.eq(key, value);
          }
        });
      }

      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        queryBuilder = queryBuilder.range(from, to);
      }

      return queryBuilder.order("created_at", { ascending: false });
    });

    const result = await query();

    if (result.error) {
      return { data: null, error: result.error.message };
    }

    return { data: result.data, error: null };
  }

  // Assign report to officer
  async assignReport(
    reportId: string,
    officerId: string,
    assignedBy: string,
  ): Promise<ApiResponse<FraudReport>> {
    // Check RLS permissions
    const canAssign = await enforceRLS.canAccessRecord(
      assignedBy,
      "fraud_reports",
      reportId,
      "write",
    );
    if (!canAssign) {
      return { data: null, error: "Insufficient permissions to assign report" };
    }

    const result = await this.update(
      reportId,
      {
        assigned_to: officerId,
        status: "under_investigation",
        updated_at: new Date().toISOString(),
      },
      assignedBy,
    );

    if (result.data) {
      // Create notification for assigned officer
      await this.createNotification({
        user_id: officerId,
        title: "New Report Assignment",
        message: `You have been assigned fraud report ${result.data.reference_number}`,
        type: "info",
        category: "assignment",
        related_record_id: reportId,
        related_record_type: "fraud_report",
      });
    }

    return result;
  }

  // Generate unique reference number
  async generateReferenceNumber(): Promise<string> {
    try {
      const { data, error } = await supabase.rpc("generate_reference_number");
      if (error) throw error;
      return data as string;
    } catch (error) {
      // Fallback reference number generation
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `FR${timestamp}${random}`;
    }
  }

  // Update report status with state validation
  async updateStatus(
    reportId: string,
    newStatus: FraudReport["status"],
    userId: string,
    notes?: string,
  ): Promise<ApiResponse<FraudReport>> {
    const validTransitions: Record<string, string[]> = {
      pending: ["under_investigation", "rejected"],
      under_investigation: ["resolved", "closed", "pending"],
      resolved: ["closed"],
      closed: [], // No transitions from closed
      rejected: [], // No transitions from rejected
    };

    // Get current status
    const currentReport = await this.getById(reportId);
    if (!currentReport.data) {
      return { data: null, error: "Report not found" };
    }

    // Validate status transition
    const currentStatus = currentReport.data.status;
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return {
        data: null,
        error: `Invalid status transition from ${currentStatus} to ${newStatus}`,
      };
    }

    const updateData: FraudReportUpdate = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === "resolved" || newStatus === "closed") {
      updateData.resolved_at = new Date().toISOString();
    }

    const result = await this.update(reportId, updateData, userId);

    // Add status change comment
    if (result.data && notes) {
      await this.addComment(
        reportId,
        userId,
        `Status changed to ${newStatus}. ${notes}`,
        true,
      );
    }

    return result;
  }

  // Add comment to report
  async addComment(
    reportId: string,
    userId: string,
    content: string,
    isInternal: boolean = false,
  ): Promise<ApiResponse<any>> {
    const query = createSupabaseQuery(async () => {
      return supabase
        .from("report_comments")
        .insert({
          report_id: reportId,
          user_id: userId,
          content,
          is_internal: isInternal,
          visibility: isInternal ? "internal" : "public",
        })
        .select()
        .single();
    });

    return query();
  }

  // Create notification
  private async createNotification(notification: NotificationInsert) {
    try {
      await supabase.from("notifications").insert(notification);
    } catch (error) {
      console.warn("Failed to create notification:", error);
    }
  }
}

// Profiles Service
class ProfileService extends BaseSupabaseService<
  Profile,
  ProfileInsert,
  ProfileUpdate
> {
  constructor() {
    super("profiles");
  }

  // Get user profile with role information
  async getUserProfile(userId: string): Promise<ApiResponse<Profile>> {
    return this.getById(userId);
  }

  // Update user profile with government ID validation
  async updateProfile(
    userId: string,
    profileData: ProfileUpdate,
  ): Promise<ApiResponse<Profile>> {
    // Validate government IDs if provided
    if (profileData.aadhaar_number) {
      const aadhaarValid = this.validateAadhaar(profileData.aadhaar_number);
      if (!aadhaarValid) {
        return { data: null, error: "Invalid Aadhaar number format" };
      }
    }

    if (profileData.pan_number) {
      const panValid = this.validatePAN(profileData.pan_number);
      if (!panValid) {
        return { data: null, error: "Invalid PAN number format" };
      }
    }

    return this.update(
      userId,
      {
        ...profileData,
        updated_at: new Date().toISOString(),
      },
      userId,
    );
  }

  // Validate Aadhaar number format
  private validateAadhaar(aadhaar: string): boolean {
    const aadhaarRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;
    return aadhaarRegex.test(aadhaar);
  }

  // Validate PAN number format
  private validatePAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  }

  // Get users by role (admin function)
  async getUsersByRole(role: string): Promise<ApiResponse<Profile[]>> {
    const query = createSupabaseQuery(async () => {
      return supabase
        .from("profiles")
        .select("*")
        .eq("role", role)
        .eq("is_active", true)
        .order("full_name");
    });

    return query();
  }
}

// File Attachments Service
class FileAttachmentService extends BaseSupabaseService<
  any,
  FileAttachmentInsert,
  any
> {
  constructor() {
    super("file_attachments");
  }

  // Upload file with government security requirements
  async uploadFile(
    file: File,
    userId: string,
    relatedRecordId?: string,
    relatedRecordType?: string,
    isEvidence: boolean = false,
  ): Promise<ApiResponse<any>> {
    // Validate file size and type
    const maxSize = parseInt(
      import.meta.env.VITE_MAX_FILE_UPLOAD_SIZE || "10485760",
    ); // 10MB
    const allowedTypes =
      import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(",") || [];

    if (file.size > maxSize) {
      return { data: null, error: "File size exceeds maximum allowed size" };
    }

    if (allowedTypes.length > 0) {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        return { data: null, error: "File type not allowed" };
      }
    }

    try {
      // Generate secure file path
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `${userId}/${timestamp}_${sanitizedName}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return { data: null, error: uploadError.message };
      }

      // Create file attachment record
      const attachmentData: FileAttachmentInsert = {
        name: file.name,
        size: file.size,
        mime_type: file.type,
        storage_path: uploadData.path,
        upload_user_id: userId,
        related_record_id: relatedRecordId,
        related_record_type: relatedRecordType,
        is_evidence: isEvidence,
        is_sensitive: isEvidence, // Evidence is considered sensitive
        access_level: isEvidence ? "restricted" : "internal",
        virus_scan_status: "pending",
      };

      const result = await this.create(attachmentData, userId);

      if (result.data) {
        // Schedule virus scan (would be implemented with external service)
        this.scheduleVirusScan(result.data.id);
      }

      return result;
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Get file download URL with access control
  async getFileUrl(
    fileId: string,
    userId: string,
  ): Promise<ApiResponse<{ url: string; expiresAt: Date }>> {
    // Check access permissions
    const file = await this.getById(fileId);
    if (!file.data) {
      return { data: null, error: "File not found" };
    }

    // Verify user has access to this file
    const hasAccess = await this.verifyFileAccess(file.data, userId);
    if (!hasAccess) {
      return { data: null, error: "Access denied" };
    }

    try {
      const { data: urlData, error } = await supabase.storage
        .from("attachments")
        .createSignedUrl(file.data.storage_path, 3600); // 1 hour expiry

      if (error) {
        return { data: null, error: error.message };
      }

      // Audit file access
      await this.auditLog({
        action: "FILE_ACCESS",
        user_id: userId,
        record_id: fileId,
        severity: "info",
        description: `User accessed file: ${file.data.name}`,
      });

      return {
        data: {
          url: urlData.signedUrl,
          expiresAt: new Date(Date.now() + 3600000),
        },
        error: null,
      };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  private async verifyFileAccess(file: any, userId: string): Promise<boolean> {
    // File owner always has access
    if (file.upload_user_id === userId) {
      return true;
    }

    // Check RLS permissions for related record
    if (file.related_record_id && file.related_record_type) {
      return enforceRLS.canAccessRecord(
        userId,
        file.related_record_type,
        file.related_record_id,
        "read",
      );
    }

    return false;
  }

  private scheduleVirusScan(fileId: string) {
    // In production, this would trigger virus scanning service
    console.log(`Virus scan scheduled for file: ${fileId}`);
  }
}

// Export service instances
export const fraudReportService = new FraudReportService();
export const profileService = new ProfileService();
export const fileAttachmentService = new FileAttachmentService();

// Export classes for custom implementations
export {
  BaseSupabaseService,
  FraudReportService,
  ProfileService,
  FileAttachmentService,
};
