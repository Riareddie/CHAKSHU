export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      community_interactions: {
        Row: {
          content: string | null
          created_at: string
          id: string
          interaction_type: string
          report_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type: string
          report_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_interactions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_reminders: {
        Row: {
          created_at: string
          id: string
          is_sent: boolean | null
          message: string | null
          reminder_date: string
          report_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          message?: string | null
          reminder_date: string
          report_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_sent?: boolean | null
          message?: string | null
          reminder_date?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_reminders_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          priority: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          priority?: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          priority?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      report_evidence: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          mime_type: string | null
          report_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          mime_type?: string | null
          report_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          mime_type?: string | null
          report_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_evidence_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_status_history: {
        Row: {
          authority_action:
            | Database["public"]["Enums"]["authority_action"]
            | null
          changed_by: string | null
          comments: string | null
          created_at: string
          id: string
          report_id: string
          status: Database["public"]["Enums"]["report_status"]
        }
        Insert: {
          authority_action?:
            | Database["public"]["Enums"]["authority_action"]
            | null
          changed_by?: string | null
          comments?: string | null
          created_at?: string
          id?: string
          report_id: string
          status: Database["public"]["Enums"]["report_status"]
        }
        Update: {
          authority_action?:
            | Database["public"]["Enums"]["authority_action"]
            | null
          changed_by?: string | null
          comments?: string | null
          created_at?: string
          id?: string
          report_id?: string
          status?: Database["public"]["Enums"]["report_status"]
        }
        Relationships: [
          {
            foreignKeyName: "report_status_history_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          amount_involved: number | null
          authority_action:
            | Database["public"]["Enums"]["authority_action"]
            | null
          authority_comments: string | null
          city: string | null
          contact_info: Json | null
          country: string | null
          created_at: string
          currency: string | null
          description: string
          estimated_loss: number | null
          fraud_type: Database["public"]["Enums"]["fraud_type"]
          id: string
          incident_date: string | null
          latitude: number | null
          location_info: Json | null
          longitude: number | null
          recovery_amount: number | null
          state: string | null
          status: Database["public"]["Enums"]["report_status"]
          title: string
          updated_at: string
          user_id: string
          withdrawal_reason: string | null
          withdrawn_at: string | null
        }
        Insert: {
          amount_involved?: number | null
          authority_action?:
            | Database["public"]["Enums"]["authority_action"]
            | null
          authority_comments?: string | null
          city?: string | null
          contact_info?: Json | null
          country?: string | null
          created_at?: string
          currency?: string | null
          description: string
          estimated_loss?: number | null
          fraud_type: Database["public"]["Enums"]["fraud_type"]
          id?: string
          incident_date?: string | null
          latitude?: number | null
          location_info?: Json | null
          longitude?: number | null
          recovery_amount?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          title: string
          updated_at?: string
          user_id: string
          withdrawal_reason?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          amount_involved?: number | null
          authority_action?:
            | Database["public"]["Enums"]["authority_action"]
            | null
          authority_comments?: string | null
          city?: string | null
          contact_info?: Json | null
          country?: string | null
          created_at?: string
          currency?: string | null
          description?: string
          estimated_loss?: number | null
          fraud_type?: Database["public"]["Enums"]["fraud_type"]
          id?: string
          incident_date?: string | null
          latitude?: number | null
          location_info?: Json | null
          longitude?: number | null
          recovery_amount?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          title?: string
          updated_at?: string
          user_id?: string
          withdrawal_reason?: string | null
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      user_analytics_preferences: {
        Row: {
          created_at: string
          dashboard_filters: Json | null
          id: string
          notification_settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_filters?: Json | null
          id?: string
          notification_settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_filters?: Json | null
          id?: string
          notification_settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      authority_action:
        | "investigation_started"
        | "evidence_collected"
        | "case_forwarded"
        | "suspect_identified"
        | "legal_action_taken"
        | "case_closed"
        | "no_action_required"
      fraud_type:
        | "phishing"
        | "sms_fraud"
        | "call_fraud"
        | "email_spam"
        | "investment_scam"
        | "lottery_scam"
        | "tech_support_scam"
        | "romance_scam"
        | "other"
      report_status:
        | "pending"
        | "under_review"
        | "resolved"
        | "rejected"
        | "withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      authority_action: [
        "investigation_started",
        "evidence_collected",
        "case_forwarded",
        "suspect_identified",
        "legal_action_taken",
        "case_closed",
        "no_action_required",
      ],
      fraud_type: [
        "phishing",
        "sms_fraud",
        "call_fraud",
        "email_spam",
        "investment_scam",
        "lottery_scam",
        "tech_support_scam",
        "romance_scam",
        "other",
      ],
      report_status: [
        "pending",
        "under_review",
        "resolved",
        "rejected",
        "withdrawn",
      ],
    },
  },
} as const
