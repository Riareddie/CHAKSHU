export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      analytics_data: {
        Row: {
          created_at: string;
          date_recorded: string;
          dimensions: Json;
          filters: Json;
          hour_recorded: number | null;
          id: string;
          metric_name: string;
          metric_type: Database["public"]["Enums"]["metric_type"] | null;
          metric_value: number;
        };
        Insert: {
          created_at?: string;
          date_recorded?: string;
          dimensions?: Json;
          filters?: Json;
          hour_recorded?: number | null;
          id?: string;
          metric_name: string;
          metric_type?: Database["public"]["Enums"]["metric_type"] | null;
          metric_value: number;
        };
        Update: {
          created_at?: string;
          date_recorded?: string;
          dimensions?: Json;
          filters?: Json;
          hour_recorded?: number | null;
          id?: string;
          metric_name?: string;
          metric_type?: Database["public"]["Enums"]["metric_type"] | null;
          metric_value?: number;
        };
        Relationships: [];
      };
      community_interactions: {
        Row: {
          content: string | null;
          created_at: string;
          downvotes: number;
          id: string;
          interaction_type: Database["public"]["Enums"]["interaction_type"];
          is_anonymous: boolean;
          is_flagged: boolean;
          is_verified: boolean;
          moderation_status: string | null;
          rating: number | null;
          reply_to_id: string | null;
          report_id: string;
          updated_at: string;
          upvotes: number;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          downvotes?: number;
          id?: string;
          interaction_type: Database["public"]["Enums"]["interaction_type"];
          is_anonymous?: boolean;
          is_flagged?: boolean;
          is_verified?: boolean;
          moderation_status?: string | null;
          rating?: number | null;
          reply_to_id?: string | null;
          report_id: string;
          updated_at?: string;
          upvotes?: number;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          downvotes?: number;
          id?: string;
          interaction_type?: Database["public"]["Enums"]["interaction_type"];
          is_anonymous?: boolean;
          is_flagged?: boolean;
          is_verified?: boolean;
          moderation_status?: string | null;
          rating?: number | null;
          reply_to_id?: string | null;
          report_id?: string;
          updated_at?: string;
          upvotes?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_interactions_reply_to_id_fkey";
            columns: ["reply_to_id"];
            isOneToOne: false;
            referencedRelation: "community_interactions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_interactions_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_interactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      education_articles: {
        Row: {
          author_id: string | null;
          category: string;
          comment_count: number;
          content: string;
          cover_image_url: string | null;
          created_at: string;
          difficulty_level: string | null;
          estimated_read_time: number | null;
          excerpt: string | null;
          featured_order: number | null;
          id: string;
          is_featured: boolean;
          is_published: boolean;
          language: string;
          like_count: number;
          meta_description: string | null;
          meta_title: string | null;
          published_at: string | null;
          share_count: number;
          slug: string;
          subcategory: string | null;
          tags: string[];
          thumbnail_url: string | null;
          title: string;
          updated_at: string;
          view_count: number;
        };
        Insert: {
          author_id?: string | null;
          category: string;
          comment_count?: number;
          content: string;
          cover_image_url?: string | null;
          created_at?: string;
          difficulty_level?: string | null;
          estimated_read_time?: number | null;
          excerpt?: string | null;
          featured_order?: number | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          language?: string;
          like_count?: number;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          share_count?: number;
          slug: string;
          subcategory?: string | null;
          tags?: string[];
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string;
          view_count?: number;
        };
        Update: {
          author_id?: string | null;
          category?: string;
          comment_count?: number;
          content?: string;
          cover_image_url?: string | null;
          created_at?: string;
          difficulty_level?: string | null;
          estimated_read_time?: number | null;
          excerpt?: string | null;
          featured_order?: number | null;
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          language?: string;
          like_count?: number;
          meta_description?: string | null;
          meta_title?: string | null;
          published_at?: string | null;
          share_count?: number;
          slug?: string;
          subcategory?: string | null;
          tags?: string[];
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "education_articles_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      faqs: {
        Row: {
          answer: string;
          category: string;
          created_at: string;
          created_by: string | null;
          display_order: number | null;
          helpful_count: number;
          id: string;
          is_featured: boolean;
          language: string;
          last_updated_by: string | null;
          not_helpful_count: number;
          priority: number;
          question: string;
          subcategory: string | null;
          tags: string[];
          updated_at: string;
          view_count: number;
        };
        Insert: {
          answer: string;
          category: string;
          created_at?: string;
          created_by?: string | null;
          display_order?: number | null;
          helpful_count?: number;
          id?: string;
          is_featured?: boolean;
          language?: string;
          last_updated_by?: string | null;
          not_helpful_count?: number;
          priority?: number;
          question: string;
          subcategory?: string | null;
          tags?: string[];
          updated_at?: string;
          view_count?: number;
        };
        Update: {
          answer?: string;
          category?: string;
          created_at?: string;
          created_by?: string | null;
          display_order?: number | null;
          helpful_count?: number;
          id?: string;
          is_featured?: boolean;
          language?: string;
          last_updated_by?: string | null;
          not_helpful_count?: number;
          priority?: number;
          question?: string;
          subcategory?: string | null;
          tags?: string[];
          updated_at?: string;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "faqs_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "faqs_last_updated_by_fkey";
            columns: ["last_updated_by"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      fraud_alerts: {
        Row: {
          affected_regions: string[];
          alert_type: string;
          authority_reference: string | null;
          created_at: string;
          created_by: string | null;
          description: string;
          expires_at: string | null;
          external_reference: string | null;
          fraud_types: Database["public"]["Enums"]["fraud_type"][];
          id: string;
          is_active: boolean;
          severity_level: number;
          share_count: number;
          source: string | null;
          source_url: string | null;
          target_demographics: Json;
          title: string;
          updated_at: string;
          view_count: number;
        };
        Insert: {
          affected_regions?: string[];
          alert_type?: string;
          authority_reference?: string | null;
          created_at?: string;
          created_by?: string | null;
          description: string;
          expires_at?: string | null;
          external_reference?: string | null;
          fraud_types?: Database["public"]["Enums"]["fraud_type"][];
          id?: string;
          is_active?: boolean;
          severity_level?: number;
          share_count?: number;
          source?: string | null;
          source_url?: string | null;
          target_demographics?: Json;
          title: string;
          updated_at?: string;
          view_count?: number;
        };
        Update: {
          affected_regions?: string[];
          alert_type?: string;
          authority_reference?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          expires_at?: string | null;
          external_reference?: string | null;
          fraud_types?: Database["public"]["Enums"]["fraud_type"][];
          id?: string;
          is_active?: boolean;
          severity_level?: number;
          share_count?: number;
          source?: string | null;
          source_url?: string | null;
          target_demographics?: Json;
          title?: string;
          updated_at?: string;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      notifications: {
        Row: {
          action_text: string | null;
          action_url: string | null;
          category: string | null;
          created_at: string;
          data: Json;
          expires_at: string | null;
          id: string;
          image_url: string | null;
          message: string;
          priority: Database["public"]["Enums"]["priority_level"];
          read: boolean;
          read_at: string | null;
          title: string;
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Insert: {
          action_text?: string | null;
          action_url?: string | null;
          category?: string | null;
          created_at?: string;
          data?: Json;
          expires_at?: string | null;
          id?: string;
          image_url?: string | null;
          message: string;
          priority?: Database["public"]["Enums"]["priority_level"];
          read?: boolean;
          read_at?: string | null;
          title: string;
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Update: {
          action_text?: string | null;
          action_url?: string | null;
          category?: string | null;
          created_at?: string;
          data?: Json;
          expires_at?: string | null;
          id?: string;
          image_url?: string | null;
          message?: string;
          priority?: Database["public"]["Enums"]["priority_level"];
          read?: boolean;
          read_at?: string | null;
          title?: string;
          type?: Database["public"]["Enums"]["notification_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      report_evidence: {
        Row: {
          description: string | null;
          evidence_type: string | null;
          expires_at: string | null;
          file_name: string;
          file_path: string;
          file_size: number | null;
          file_type: string | null;
          file_url: string | null;
          hash_signature: string | null;
          id: string;
          is_verified: boolean;
          mime_type: string | null;
          report_id: string;
          uploaded_at: string;
          uploaded_by: string | null;
          verification_notes: string | null;
          verified_by: string | null;
        };
        Insert: {
          description?: string | null;
          evidence_type?: string | null;
          expires_at?: string | null;
          file_name: string;
          file_path: string;
          file_size?: number | null;
          file_type?: string | null;
          file_url?: string | null;
          hash_signature?: string | null;
          id?: string;
          is_verified?: boolean;
          mime_type?: string | null;
          report_id: string;
          uploaded_at?: string;
          uploaded_by?: string | null;
          verification_notes?: string | null;
          verified_by?: string | null;
        };
        Update: {
          description?: string | null;
          evidence_type?: string | null;
          expires_at?: string | null;
          file_name?: string;
          file_path?: string;
          file_size?: number | null;
          file_type?: string | null;
          file_url?: string | null;
          hash_signature?: string | null;
          id?: string;
          is_verified?: boolean;
          mime_type?: string | null;
          report_id?: string;
          uploaded_at?: string;
          uploaded_by?: string | null;
          verification_notes?: string | null;
          verified_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "report_evidence_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_evidence_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "report_evidence_verified_by_fkey";
            columns: ["verified_by"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      report_status_history: {
        Row: {
          automated_change: boolean;
          changed_by: string | null;
          changed_by_role: Database["public"]["Enums"]["user_role"] | null;
          comments: string | null;
          created_at: string;
          id: string;
          new_status: Database["public"]["Enums"]["report_status"];
          previous_status: Database["public"]["Enums"]["report_status"] | null;
          report_id: string;
        };
        Insert: {
          automated_change?: boolean;
          changed_by?: string | null;
          changed_by_role?: Database["public"]["Enums"]["user_role"] | null;
          comments?: string | null;
          created_at?: string;
          id?: string;
          new_status: Database["public"]["Enums"]["report_status"];
          previous_status?: Database["public"]["Enums"]["report_status"] | null;
          report_id: string;
        };
        Update: {
          automated_change?: boolean;
          changed_by?: string | null;
          changed_by_role?: Database["public"]["Enums"]["user_role"] | null;
          comments?: string | null;
          created_at?: string;
          id?: string;
          new_status?: Database["public"]["Enums"]["report_status"];
          previous_status?: Database["public"]["Enums"]["report_status"] | null;
          report_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_status_history_changed_by_fkey";
            columns: ["changed_by"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "report_status_history_report_id_fkey";
            columns: ["report_id"];
            isOneToOne: false;
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          amount_involved: number | null;
          assigned_officer: string | null;
          authority_action:
            | Database["public"]["Enums"]["authority_action"]
            | null;
          authority_comments: string | null;
          case_reference_number: string | null;
          city: string | null;
          country: string;
          created_at: string;
          currency: string;
          description: string;
          estimated_loss: number | null;
          fraud_type: Database["public"]["Enums"]["fraud_type"];
          fraudster_contact: Json;
          id: string;
          incident_date: string | null;
          incident_location: Json;
          is_anonymous: boolean;
          is_sensitive: boolean;
          latitude: number | null;
          longitude: number | null;
          priority: Database["public"]["Enums"]["priority_level"];
          recovery_amount: number | null;
          report_number: string;
          resolved_at: string | null;
          source: string;
          state: string | null;
          status: Database["public"]["Enums"]["report_status"];
          submission_ip: unknown | null;
          title: string;
          updated_at: string;
          user_id: string;
          victim_contact: Json;
          withdrawal_reason: string | null;
          withdrawn_at: string | null;
        };
        Insert: {
          amount_involved?: number | null;
          assigned_officer?: string | null;
          authority_action?:
            | Database["public"]["Enums"]["authority_action"]
            | null;
          authority_comments?: string | null;
          case_reference_number?: string | null;
          city?: string | null;
          country?: string;
          created_at?: string;
          currency?: string;
          description: string;
          estimated_loss?: number | null;
          fraud_type: Database["public"]["Enums"]["fraud_type"];
          fraudster_contact?: Json;
          id?: string;
          incident_date?: string | null;
          incident_location?: Json;
          is_anonymous?: boolean;
          is_sensitive?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          priority?: Database["public"]["Enums"]["priority_level"];
          recovery_amount?: number | null;
          report_number?: string;
          resolved_at?: string | null;
          source?: string;
          state?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
          submission_ip?: unknown | null;
          title: string;
          updated_at?: string;
          user_id: string;
          victim_contact?: Json;
          withdrawal_reason?: string | null;
          withdrawn_at?: string | null;
        };
        Update: {
          amount_involved?: number | null;
          assigned_officer?: string | null;
          authority_action?:
            | Database["public"]["Enums"]["authority_action"]
            | null;
          authority_comments?: string | null;
          case_reference_number?: string | null;
          city?: string | null;
          country?: string;
          created_at?: string;
          currency?: string;
          description?: string;
          estimated_loss?: number | null;
          fraud_type?: Database["public"]["Enums"]["fraud_type"];
          fraudster_contact?: Json;
          id?: string;
          incident_date?: string | null;
          incident_location?: Json;
          is_anonymous?: boolean;
          is_sensitive?: boolean;
          latitude?: number | null;
          longitude?: number | null;
          priority?: Database["public"]["Enums"]["priority_level"];
          recovery_amount?: number | null;
          report_number?: string;
          resolved_at?: string | null;
          source?: string;
          state?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
          submission_ip?: unknown | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
          victim_contact?: Json;
          withdrawal_reason?: string | null;
          withdrawn_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      support_ticket_messages: {
        Row: {
          attachments: Json;
          created_at: string;
          id: string;
          is_internal: boolean;
          is_system_message: boolean;
          message: string;
          message_type: string;
          sender_id: string;
          ticket_id: string;
        };
        Insert: {
          attachments?: Json;
          created_at?: string;
          id?: string;
          is_internal?: boolean;
          is_system_message?: boolean;
          message: string;
          message_type?: string;
          sender_id: string;
          ticket_id: string;
        };
        Update: {
          attachments?: Json;
          created_at?: string;
          id?: string;
          is_internal?: boolean;
          is_system_message?: boolean;
          message?: string;
          message_type?: string;
          sender_id?: string;
          ticket_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "support_tickets";
            referencedColumns: ["id"];
          },
        ];
      };
      support_tickets: {
        Row: {
          assigned_team: string | null;
          assigned_to: string | null;
          category: string | null;
          closed_at: string | null;
          created_at: string;
          description: string;
          first_response_at: string | null;
          first_response_time_minutes: number | null;
          id: string;
          priority: Database["public"]["Enums"]["priority_level"];
          resolution: string | null;
          resolution_time_minutes: number | null;
          resolved_at: string | null;
          satisfaction_feedback: string | null;
          satisfaction_rating: number | null;
          status: Database["public"]["Enums"]["ticket_status"];
          subcategory: string | null;
          subject: string;
          ticket_number: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assigned_team?: string | null;
          assigned_to?: string | null;
          category?: string | null;
          closed_at?: string | null;
          created_at?: string;
          description: string;
          first_response_at?: string | null;
          first_response_time_minutes?: number | null;
          id?: string;
          priority?: Database["public"]["Enums"]["priority_level"];
          resolution?: string | null;
          resolution_time_minutes?: number | null;
          resolved_at?: string | null;
          satisfaction_feedback?: string | null;
          satisfaction_rating?: number | null;
          status?: Database["public"]["Enums"]["ticket_status"];
          subcategory?: string | null;
          subject: string;
          ticket_number?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assigned_team?: string | null;
          assigned_to?: string | null;
          category?: string | null;
          closed_at?: string | null;
          created_at?: string;
          description?: string;
          first_response_at?: string | null;
          first_response_time_minutes?: number | null;
          id?: string;
          priority?: Database["public"]["Enums"]["priority_level"];
          resolution?: string | null;
          resolution_time_minutes?: number | null;
          resolved_at?: string | null;
          satisfaction_feedback?: string | null;
          satisfaction_rating?: number | null;
          status?: Database["public"]["Enums"]["ticket_status"];
          subcategory?: string | null;
          subject?: string;
          ticket_number?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      system_config: {
        Row: {
          category: string | null;
          config_key: string;
          config_value: Json;
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          is_encrypted: boolean;
          is_public: boolean;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          config_key: string;
          config_value: Json;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_encrypted?: boolean;
          is_public?: boolean;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          config_key?: string;
          config_value?: Json;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          is_encrypted?: boolean;
          is_public?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "system_config_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      user_achievements: {
        Row: {
          achievement_name: string;
          achievement_slug: string;
          achievement_type: string;
          badge_image_url: string | null;
          description: string | null;
          id: string;
          points: number;
          progress_data: Json;
          requirements_met: Json;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          achievement_name: string;
          achievement_slug: string;
          achievement_type: string;
          badge_image_url?: string | null;
          description?: string | null;
          id?: string;
          points?: number;
          progress_data?: Json;
          requirements_met?: Json;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          achievement_name?: string;
          achievement_slug?: string;
          achievement_type?: string;
          badge_image_url?: string | null;
          description?: string | null;
          id?: string;
          points?: number;
          progress_data?: Json;
          requirements_met?: Json;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      user_analytics_preferences: {
        Row: {
          accessibility_settings: Json;
          created_at: string;
          dashboard_filters: Json;
          display_preferences: Json;
          id: string;
          notification_settings: Json;
          privacy_settings: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          accessibility_settings?: Json;
          created_at?: string;
          dashboard_filters?: Json;
          display_preferences?: Json;
          id?: string;
          notification_settings?: Json;
          privacy_settings?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          accessibility_settings?: Json;
          created_at?: string;
          dashboard_filters?: Json;
          display_preferences?: Json;
          id?: string;
          notification_settings?: Json;
          privacy_settings?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_analytics_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      user_article_interactions: {
        Row: {
          article_id: string;
          created_at: string;
          id: string;
          interaction_data: Json;
          interaction_type: string;
          user_id: string;
        };
        Insert: {
          article_id: string;
          created_at?: string;
          id?: string;
          interaction_data?: Json;
          interaction_type: string;
          user_id: string;
        };
        Update: {
          article_id?: string;
          created_at?: string;
          id?: string;
          interaction_data?: Json;
          interaction_type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_article_interactions_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "education_articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_article_interactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      user_profiles: {
        Row: {
          address: Json;
          bio: string | null;
          city: string | null;
          country: string;
          created_at: string;
          date_of_birth: string | null;
          email: string | null;
          full_name: string | null;
          gender: string | null;
          id: string;
          language_preference: string;
          last_login: string | null;
          login_count: number;
          notification_preferences: Json;
          occupation: string | null;
          organization: string | null;
          phone_number: string | null;
          phone_verified: boolean;
          postal_code: string | null;
          privacy_settings: Json;
          profile_completed: boolean;
          profile_picture_url: string | null;
          state: string | null;
          timezone: string;
          two_factor_enabled: boolean;
          updated_at: string;
          user_id: string;
          email_verified: boolean;
        };
        Insert: {
          address?: Json;
          bio?: string | null;
          city?: string | null;
          country?: string;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          language_preference?: string;
          last_login?: string | null;
          login_count?: number;
          notification_preferences?: Json;
          occupation?: string | null;
          organization?: string | null;
          phone_number?: string | null;
          phone_verified?: boolean;
          postal_code?: string | null;
          privacy_settings?: Json;
          profile_completed?: boolean;
          profile_picture_url?: string | null;
          state?: string | null;
          timezone?: string;
          two_factor_enabled?: boolean;
          updated_at?: string;
          user_id: string;
          email_verified?: boolean;
        };
        Update: {
          address?: Json;
          bio?: string | null;
          city?: string | null;
          country?: string;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          language_preference?: string;
          last_login?: string | null;
          login_count?: number;
          notification_preferences?: Json;
          occupation?: string | null;
          organization?: string | null;
          phone_number?: string | null;
          phone_verified?: boolean;
          postal_code?: string | null;
          privacy_settings?: Json;
          profile_completed?: boolean;
          profile_picture_url?: string | null;
          state?: string | null;
          timezone?: string;
          two_factor_enabled?: boolean;
          updated_at?: string;
          user_id?: string;
          email_verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      report_stats: {
        Row: {
          avg_amount_involved: number | null;
          month: string | null;
          pending_reports: number | null;
          rejected_reports: number | null;
          resolved_reports: number | null;
          total_amount_involved: number | null;
          total_reports: number | null;
          under_review_reports: number | null;
          unique_reporters: number | null;
        };
        Relationships: [];
      };
      user_activity_summary: {
        Row: {
          email: string | null;
          full_name: string | null;
          last_login: string | null;
          registration_date: string | null;
          total_interactions: number | null;
          total_reports: number | null;
          unread_notifications: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      authority_action:
        | "investigation_started"
        | "evidence_collected"
        | "case_forwarded"
        | "suspect_identified"
        | "legal_action_taken"
        | "case_closed"
        | "no_action_required"
        | "additional_info_needed";
      fraud_type:
        | "phishing"
        | "sms_fraud"
        | "call_fraud"
        | "email_spam"
        | "investment_scam"
        | "lottery_scam"
        | "tech_support_scam"
        | "romance_scam"
        | "online_shopping_fraud"
        | "banking_fraud"
        | "identity_theft"
        | "cryptocurrency_scam"
        | "job_scam"
        | "social_media_fraud"
        | "fake_website"
        | "other";
      interaction_type:
        | "similar_experience"
        | "helpful"
        | "comment"
        | "follow"
        | "share"
        | "support";
      metric_type: "count" | "percentage" | "amount" | "duration" | "rate";
      notification_type:
        | "case_update"
        | "fraud_warning"
        | "community_alert"
        | "system_announcement"
        | "security_alert"
        | "milestone"
        | "education_reminder"
        | "report_reminder";
      priority_level: "low" | "medium" | "high" | "critical" | "urgent";
      report_status:
        | "pending"
        | "under_review"
        | "investigating"
        | "resolved"
        | "rejected"
        | "withdrawn"
        | "escalated";
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_response"
        | "resolved"
        | "closed";
      user_role:
        | "citizen"
        | "admin"
        | "authority"
        | "moderator"
        | "investigator";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
