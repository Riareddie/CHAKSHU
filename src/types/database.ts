/**
 * Supabase Database Types for Government Fraud Reporting System
 * Auto-generated from Supabase CLI and manually enhanced for government requirements
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Database schema structure
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          address: Json | null;
          aadhaar_number: string | null;
          pan_number: string | null;
          date_of_birth: string | null;
          government_id: string | null;
          department: string | null;
          role: "citizen" | "officer" | "admin" | "super_admin";
          is_verified: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          last_login: string | null;
          login_count: number;
          metadata: Json | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          address?: Json | null;
          aadhaar_number?: string | null;
          pan_number?: string | null;
          date_of_birth?: string | null;
          government_id?: string | null;
          department?: string | null;
          role?: "citizen" | "officer" | "admin" | "super_admin";
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          login_count?: number;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          address?: Json | null;
          aadhaar_number?: string | null;
          pan_number?: string | null;
          date_of_birth?: string | null;
          government_id?: string | null;
          department?: string | null;
          role?: "citizen" | "officer" | "admin" | "super_admin";
          is_verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
          login_count?: number;
          metadata?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      fraud_reports: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category:
            | "cyber_fraud"
            | "financial_fraud"
            | "identity_theft"
            | "phone_scam"
            | "email_scam"
            | "investment_fraud"
            | "employment_fraud"
            | "lottery_scam"
            | "romance_scam"
            | "other";
          incident_date: string;
          amount_involved: number | null;
          location: Json;
          suspicious_contacts: Json | null;
          evidence_files: Json | null;
          additional_info: string | null;
          status:
            | "pending"
            | "under_investigation"
            | "resolved"
            | "closed"
            | "rejected";
          priority: "low" | "medium" | "high" | "critical";
          assigned_to: string | null;
          reference_number: string;
          verification_status: "unverified" | "verified" | "requires_review";
          is_sensitive: boolean;
          consent_given: boolean;
          truthfulness_verified: boolean;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
          internal_notes: string | null;
          public_visibility: boolean;
          tags: string[] | null;
          related_reports: string[] | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category:
            | "cyber_fraud"
            | "financial_fraud"
            | "identity_theft"
            | "phone_scam"
            | "email_scam"
            | "investment_fraud"
            | "employment_fraud"
            | "lottery_scam"
            | "romance_scam"
            | "other";
          incident_date: string;
          amount_involved?: number | null;
          location: Json;
          suspicious_contacts?: Json | null;
          evidence_files?: Json | null;
          additional_info?: string | null;
          status?:
            | "pending"
            | "under_investigation"
            | "resolved"
            | "closed"
            | "rejected";
          priority?: "low" | "medium" | "high" | "critical";
          assigned_to?: string | null;
          reference_number: string;
          verification_status?: "unverified" | "verified" | "requires_review";
          is_sensitive?: boolean;
          consent_given: boolean;
          truthfulness_verified: boolean;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
          internal_notes?: string | null;
          public_visibility?: boolean;
          tags?: string[] | null;
          related_reports?: string[] | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?:
            | "cyber_fraud"
            | "financial_fraud"
            | "identity_theft"
            | "phone_scam"
            | "email_scam"
            | "investment_fraud"
            | "employment_fraud"
            | "lottery_scam"
            | "romance_scam"
            | "other";
          incident_date?: string;
          amount_involved?: number | null;
          location?: Json;
          suspicious_contacts?: Json | null;
          evidence_files?: Json | null;
          additional_info?: string | null;
          status?:
            | "pending"
            | "under_investigation"
            | "resolved"
            | "closed"
            | "rejected";
          priority?: "low" | "medium" | "high" | "critical";
          assigned_to?: string | null;
          reference_number?: string;
          verification_status?: "unverified" | "verified" | "requires_review";
          is_sensitive?: boolean;
          consent_given?: boolean;
          truthfulness_verified?: boolean;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
          internal_notes?: string | null;
          public_visibility?: boolean;
          tags?: string[] | null;
          related_reports?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "fraud_reports_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fraud_reports_assigned_to_fkey";
            columns: ["assigned_to"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string | null;
          record_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          session_id: string | null;
          timestamp: string;
          severity: "info" | "warning" | "error" | "critical";
          module: string | null;
          description: string | null;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          table_name?: string | null;
          record_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          timestamp?: string;
          severity?: "info" | "warning" | "error" | "critical";
          module?: string | null;
          description?: string | null;
          metadata?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          table_name?: string | null;
          record_id?: string | null;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          timestamp?: string;
          severity?: "info" | "warning" | "error" | "critical";
          module?: string | null;
          description?: string | null;
          metadata?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      report_comments: {
        Row: {
          id: string;
          report_id: string;
          user_id: string;
          content: string;
          is_internal: boolean;
          is_system_generated: boolean;
          visibility: "public" | "internal" | "restricted";
          mentioned_users: string[] | null;
          attachments: Json | null;
          created_at: string;
          updated_at: string;
          edited_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          report_id: string;
          user_id: string;
          content: string;
          is_internal?: boolean;
          is_system_generated?: boolean;
          visibility?: "public" | "internal" | "restricted";
          mentioned_users?: string[] | null;
          attachments?: Json | null;
          created_at?: string;
          updated_at?: string;
          edited_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          report_id?: string;
          user_id?: string;
          content?: string;
          is_internal?: boolean;
          is_system_generated?: boolean;
          visibility?: "public" | "internal" | "restricted";
          mentioned_users?: string[] | null;
          attachments?: Json | null;
          created_at?: string;
          updated_at?: string;
          edited_at?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "report_comments_report_id_fkey";
            columns: ["report_id"];
            referencedRelation: "fraud_reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: "info" | "warning" | "error" | "success" | "system";
          category:
            | "report_update"
            | "assignment"
            | "system_alert"
            | "security"
            | "general";
          related_record_id: string | null;
          related_record_type: string | null;
          is_read: boolean;
          is_important: boolean;
          action_url: string | null;
          action_label: string | null;
          expires_at: string | null;
          metadata: Json | null;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: "info" | "warning" | "error" | "success" | "system";
          category?:
            | "report_update"
            | "assignment"
            | "system_alert"
            | "security"
            | "general";
          related_record_id?: string | null;
          related_record_type?: string | null;
          is_read?: boolean;
          is_important?: boolean;
          action_url?: string | null;
          action_label?: string | null;
          expires_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: "info" | "warning" | "error" | "success" | "system";
          category?:
            | "report_update"
            | "assignment"
            | "system_alert"
            | "security"
            | "general";
          related_record_id?: string | null;
          related_record_type?: string | null;
          is_read?: boolean;
          is_important?: boolean;
          action_url?: string | null;
          action_label?: string | null;
          expires_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          read_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      file_attachments: {
        Row: {
          id: string;
          name: string;
          size: number;
          mime_type: string;
          storage_path: string;
          upload_user_id: string;
          related_record_id: string | null;
          related_record_type: string | null;
          is_sensitive: boolean;
          is_evidence: boolean;
          virus_scan_status: "pending" | "clean" | "infected" | "failed";
          encryption_key_id: string | null;
          access_level: "public" | "internal" | "restricted" | "classified";
          retention_policy: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          size: number;
          mime_type: string;
          storage_path: string;
          upload_user_id: string;
          related_record_id?: string | null;
          related_record_type?: string | null;
          is_sensitive?: boolean;
          is_evidence?: boolean;
          virus_scan_status?: "pending" | "clean" | "infected" | "failed";
          encryption_key_id?: string | null;
          access_level?: "public" | "internal" | "restricted" | "classified";
          retention_policy?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          size?: number;
          mime_type?: string;
          storage_path?: string;
          upload_user_id?: string;
          related_record_id?: string | null;
          related_record_type?: string | null;
          is_sensitive?: boolean;
          is_evidence?: boolean;
          virus_scan_status?: "pending" | "clean" | "infected" | "failed";
          encryption_key_id?: string | null;
          access_level?: "public" | "internal" | "restricted" | "classified";
          retention_policy?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "file_attachments_upload_user_id_fkey";
            columns: ["upload_user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          session_token: string;
          device_fingerprint: string | null;
          ip_address: string | null;
          user_agent: string | null;
          location: Json | null;
          is_active: boolean;
          last_activity: string;
          expires_at: string;
          created_at: string;
          terminated_at: string | null;
          termination_reason: string | null;
          security_flags: Json | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_token: string;
          device_fingerprint?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          location?: Json | null;
          is_active?: boolean;
          last_activity?: string;
          expires_at: string;
          created_at?: string;
          terminated_at?: string | null;
          termination_reason?: string | null;
          security_flags?: Json | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_token?: string;
          device_fingerprint?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          location?: Json | null;
          is_active?: boolean;
          last_activity?: string;
          expires_at?: string;
          created_at?: string;
          terminated_at?: string | null;
          termination_reason?: string | null;
          security_flags?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      fraud_report_stats: {
        Row: {
          total_reports: number | null;
          pending_reports: number | null;
          resolved_reports: number | null;
          total_amount: number | null;
          avg_resolution_time: number | null;
          category_breakdown: Json | null;
          monthly_trends: Json | null;
        };
        Relationships: [];
      };
      user_activity_summary: {
        Row: {
          user_id: string | null;
          total_reports: number | null;
          last_activity: string | null;
          total_sessions: number | null;
          avg_session_duration: number | null;
          security_incidents: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_user_permissions: {
        Args: {
          user_id: string;
        };
        Returns: {
          permissions: string[];
        }[];
      };
      generate_reference_number: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      encrypt_sensitive_data: {
        Args: {
          data: string;
          classification: string;
        };
        Returns: string;
      };
      audit_data_change: {
        Args: {
          table_name: string;
          record_id: string;
          action: string;
          old_values: Json;
          new_values: Json;
        };
        Returns: void;
      };
      check_data_access_permission: {
        Args: {
          user_id: string;
          resource_type: string;
          resource_id: string;
          action: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "citizen" | "officer" | "admin" | "super_admin";
      report_status:
        | "pending"
        | "under_investigation"
        | "resolved"
        | "closed"
        | "rejected";
      report_priority: "low" | "medium" | "high" | "critical";
      fraud_category:
        | "cyber_fraud"
        | "financial_fraud"
        | "identity_theft"
        | "phone_scam"
        | "email_scam"
        | "investment_fraud"
        | "employment_fraud"
        | "lottery_scam"
        | "romance_scam"
        | "other";
      notification_type: "info" | "warning" | "error" | "success" | "system";
      access_level: "public" | "internal" | "restricted" | "classified";
      audit_severity: "info" | "warning" | "error" | "critical";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier usage
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;

// Convenience type exports for common use cases
export type Profile = Tables<"profiles">;
export type FraudReport = Tables<"fraud_reports">;
export type AuditLog = Tables<"audit_logs">;
export type ReportComment = Tables<"report_comments">;
export type Notification = Tables<"notifications">;
export type FileAttachment = Tables<"file_attachments">;
export type Session = Tables<"sessions">;

export type ProfileInsert = TablesInsert<"profiles">;
export type FraudReportInsert = TablesInsert<"fraud_reports">;
export type AuditLogInsert = TablesInsert<"audit_logs">;
export type ReportCommentInsert = TablesInsert<"report_comments">;
export type NotificationInsert = TablesInsert<"notifications">;
export type FileAttachmentInsert = TablesInsert<"file_attachments">;
export type SessionInsert = TablesInsert<"sessions">;

export type ProfileUpdate = TablesUpdate<"profiles">;
export type FraudReportUpdate = TablesUpdate<"fraud_reports">;
export type AuditLogUpdate = TablesUpdate<"audit_logs">;
export type ReportCommentUpdate = TablesUpdate<"report_comments">;
export type NotificationUpdate = TablesUpdate<"notifications">;
export type FileAttachmentUpdate = TablesUpdate<"file_attachments">;
export type SessionUpdate = TablesUpdate<"sessions">;

// Enums for easier imports
export type UserRole = Enums<"user_role">;
export type ReportStatus = Enums<"report_status">;
export type ReportPriority = Enums<"report_priority">;
export type FraudCategory = Enums<"fraud_category">;
export type NotificationType = Enums<"notification_type">;
export type AccessLevel = Enums<"access_level">;
export type AuditSeverity = Enums<"audit_severity">;

// Custom types for complex queries and operations
export interface FraudReportWithDetails extends FraudReport {
  reporter?: Profile;
  assigned_officer?: Profile;
  comments?: ReportComment[];
  attachments?: FileAttachment[];
}

export interface UserWithProfile extends Profile {
  total_reports?: number;
  pending_reports?: number;
  last_login_formatted?: string;
}

export interface NotificationWithMetadata extends Notification {
  related_report?: FraudReport;
  action_count?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DatabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

// Connection and health check types
export interface ConnectionStatus {
  isConnected: boolean;
  latency?: number;
  lastChecked: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
}

export interface HealthCheckResult {
  database: {
    status: "healthy" | "degraded" | "unhealthy";
    responseTime: number;
    error?: string;
  };
  auth: {
    status: "healthy" | "degraded" | "unhealthy";
    error?: string;
  };
  storage: {
    status: "healthy" | "degraded" | "unhealthy";
    error?: string;
  };
  realtime: {
    status: "healthy" | "degraded" | "unhealthy";
    error?: string;
  };
  overall: "healthy" | "degraded" | "unhealthy";
  timestamp: Date;
}

// Government specific types
export interface GovernmentIdValidation {
  aadhaar?: {
    isValid: boolean;
    format: string;
    masked: string;
  };
  pan?: {
    isValid: boolean;
    format: string;
    masked: string;
  };
}

export interface SecurityClassification {
  level: AccessLevel;
  clearanceRequired: string[];
  encryptionRequired: boolean;
  auditRequired: boolean;
  retentionPeriod: string;
}

export interface ComplianceMetadata {
  dataClassification: SecurityClassification;
  lawEnforcementAccess: boolean;
  citizenDataRights: string[];
  retentionPolicy: string;
  encryptionStatus: "encrypted" | "not_encrypted" | "pending";
  lastAuditDate?: Date;
  complianceOfficer?: string;
}
