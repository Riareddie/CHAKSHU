-- Comprehensive Database Schema for Fraud Detection Platform
-- This migration creates all tables needed for the application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" SCHEMA public;

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE fraud_type AS ENUM (
        'phishing', 'sms_fraud', 'call_fraud', 'email_spam', 
        'investment_scam', 'lottery_scam', 'tech_support_scam', 
        'romance_scam', 'online_shopping_fraud', 'banking_fraud',
        'identity_theft', 'cryptocurrency_scam', 'job_scam', 'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM (
        'pending', 'under_review', 'resolved', 'rejected', 'withdrawn'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE authority_action AS ENUM (
        'investigation_started', 'evidence_collected', 'case_forwarded',
        'suspect_identified', 'legal_action_taken', 'case_closed', 'no_action_required'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'case_update', 'fraud_warning', 'community_alert', 'system_announcement',
        'security_alert', 'milestone', 'education_reminder', 'report_reminder'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE interaction_type AS ENUM (
        'similar_experience', 'helpful', 'comment', 'follow', 'share'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'citizen', 'admin', 'authority', 'moderator'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create core reports table if not exists
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    fraud_type fraud_type NOT NULL,
    status report_status NOT NULL DEFAULT 'pending',
    incident_date TIMESTAMP WITH TIME ZONE,
    amount_involved DECIMAL(15, 2),
    currency TEXT DEFAULT 'INR',
    estimated_loss DECIMAL(15, 2),
    recovery_amount DECIMAL(15, 2),
    contact_info JSONB DEFAULT '{}',
    location_info JSONB DEFAULT '{}',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    authority_action authority_action,
    authority_comments TEXT,
    withdrawal_reason TEXT,
    withdrawn_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    phone_number TEXT,
    date_of_birth DATE,
    gender TEXT,
    occupation TEXT,
    organization TEXT,
    address JSONB DEFAULT '{}',
    profile_picture_url TEXT,
    bio TEXT,
    language_preference TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    profile_completed BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'admin',
    department TEXT,
    designation TEXT,
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications table (enhanced)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN NOT NULL DEFAULT false,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    image_url TEXT,
    category TEXT
);

-- Community interactions table
CREATE TABLE IF NOT EXISTS public.community_interactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    interaction_type interaction_type NOT NULL,
    content TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(report_id, user_id, interaction_type)
);

-- Report evidence table
CREATE TABLE IF NOT EXISTS public.report_evidence (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    mime_type TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Report status history
CREATE TABLE IF NOT EXISTS public.report_status_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
    status report_status NOT NULL,
    authority_action authority_action,
    comments TEXT,
    changed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Follow-up reminders
CREATE TABLE IF NOT EXISTS public.follow_up_reminders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
    message TEXT,
    is_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User analytics preferences
CREATE TABLE IF NOT EXISTS public.user_analytics_preferences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    dashboard_filters JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    language_settings JSONB DEFAULT '{}',
    accessibility_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Education articles table
CREATE TABLE IF NOT EXISTS public.education_articles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES auth.users(id),
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_read_time INTEGER, -- minutes
    language TEXT DEFAULT 'en',
    is_published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- User article interactions
CREATE TABLE IF NOT EXISTS public.user_article_interactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES public.education_articles(id) ON DELETE CASCADE NOT NULL,
    interaction_type TEXT CHECK (interaction_type IN ('view', 'like', 'bookmark', 'share', 'complete')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, article_id, interaction_type)
);

-- FAQ table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    priority INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
    category TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Support ticket messages
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Search history table
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    results_count INTEGER DEFAULT 0,
    clicked_result_id UUID,
    search_type TEXT CHECK (search_type IN ('reports', 'articles', 'faqs', 'general')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    description TEXT,
    points INTEGER DEFAULT 0,
    badge_image_url TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, achievement_type, achievement_name)
);

-- User activity log
CREATE TABLE IF NOT EXISTS public.user_activity_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL,
    activity_description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fraud alerts table
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    alert_type TEXT CHECK (alert_type IN ('warning', 'critical', 'info')) DEFAULT 'warning',
    affected_regions TEXT[] DEFAULT '{}',
    fraud_types fraud_type[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 5) DEFAULT 3,
    source TEXT,
    external_reference TEXT,
    created_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Government advisories table
CREATE TABLE IF NOT EXISTS public.government_advisories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    advisory_number TEXT UNIQUE,
    issuing_authority TEXT NOT NULL,
    advisory_type TEXT CHECK (advisory_type IN ('general', 'urgent', 'update')) DEFAULT 'general',
    affected_sectors TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 0,
    document_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mobile app reviews table
CREATE TABLE IF NOT EXISTS public.app_reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    app_version TEXT,
    platform TEXT CHECK (platform IN ('android', 'ios', 'web')),
    device_info JSONB DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Analytics data table
CREATE TABLE IF NOT EXISTS public.analytics_data (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15, 2) NOT NULL,
    metric_type TEXT CHECK (metric_type IN ('count', 'percentage', 'amount', 'duration')),
    dimensions JSONB DEFAULT '{}',
    date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
    hour_recorded INTEGER CHECK (hour_recorded >= 0 AND hour_recorded <= 23),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(metric_name, dimensions, date_recorded, hour_recorded)
);

-- System configuration table
CREATE TABLE IF NOT EXISTS public.system_config (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    config_key TEXT NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Live chat sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES auth.users(id),
    status TEXT CHECK (status IN ('waiting', 'active', 'ended')) DEFAULT 'waiting',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    category TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ended_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN ('text', 'file', 'system')) DEFAULT 'text',
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_fraud_type ON public.reports(fraud_type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_location ON public.reports(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reports_city_state ON public.reports(city, state);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

CREATE INDEX IF NOT EXISTS idx_community_interactions_report_id ON public.community_interactions(report_id);
CREATE INDEX IF NOT EXISTS idx_community_interactions_user_id ON public.community_interactions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON public.user_activity_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_education_articles_category ON public.education_articles(category);
CREATE INDEX IF NOT EXISTS idx_education_articles_published ON public.education_articles(is_published, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON public.support_tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON public.search_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_fraud_alerts_active ON public.fraud_alerts(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_data_metric_date ON public.analytics_data(metric_name, date_recorded DESC);

-- Enable Row Level Security on all tables
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_article_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('evidence-files', 'evidence-files', false),
    ('profile-pictures', 'profile-pictures', true),
    ('article-images', 'article-images', true),
    ('system-files', 'system-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies
-- Reports policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Users can view their own reports') THEN
    CREATE POLICY "Users can view their own reports" 
      ON public.reports FOR SELECT 
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Users can create their own reports') THEN
    CREATE POLICY "Users can create their own reports" 
      ON public.reports FOR INSERT 
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Users can update their own reports') THEN
    CREATE POLICY "Users can update their own reports" 
      ON public.reports FOR UPDATE 
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Admin access to all reports
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Admins can access all reports') THEN
    CREATE POLICY "Admins can access all reports" 
      ON public.reports FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM public.admin_users 
          WHERE user_id = auth.uid() AND is_active = true
        )
      );
  END IF;
END $$;

-- User profiles policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can manage their own profile') THEN
    CREATE POLICY "Users can manage their own profile" 
      ON public.user_profiles FOR ALL 
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Notifications policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications') THEN
    CREATE POLICY "Users can view their own notifications" 
      ON public.notifications FOR SELECT 
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications') THEN
    CREATE POLICY "Users can update their own notifications" 
      ON public.notifications FOR UPDATE 
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Community interactions policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_interactions' AND policyname = 'Users can view all community interactions') THEN
    CREATE POLICY "Users can view all community interactions" 
      ON public.community_interactions FOR SELECT 
      USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_interactions' AND policyname = 'Users can create their own interactions') THEN
    CREATE POLICY "Users can create their own interactions" 
      ON public.community_interactions FOR INSERT 
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Education articles policies (public read, admin write)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'education_articles' AND policyname = 'Anyone can view published articles') THEN
    CREATE POLICY "Anyone can view published articles" 
      ON public.education_articles FOR SELECT 
      USING (is_published = true);
  END IF;
END $$;

-- FAQ policies (public read)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Anyone can view FAQs') THEN
    CREATE POLICY "Anyone can view FAQs" 
      ON public.faqs FOR SELECT 
      USING (true);
  END IF;
END $$;

-- Support tickets policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_tickets' AND policyname = 'Users can manage their own tickets') THEN
    CREATE POLICY "Users can manage their own tickets" 
      ON public.support_tickets FOR ALL 
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- User analytics preferences policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analytics_preferences' AND policyname = 'Users can manage their own preferences') THEN
    CREATE POLICY "Users can manage their own preferences" 
      ON public.user_analytics_preferences FOR ALL 
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Create trigger functions for automated actions
CREATE OR REPLACE FUNCTION public.create_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, type, title, message, data, priority)
    VALUES (
      NEW.user_id,
      'case_update',
      'Report Status Updated',
      'Your report "' || NEW.title || '" has been updated to ' || NEW.status,
      jsonb_build_object('report_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status),
      'medium'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.log_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.user_activity_log (user_id, activity_type, activity_description, metadata)
    VALUES (
      NEW.user_id,
      TG_TABLE_NAME || '_created',
      'Created new ' || TG_TABLE_NAME,
      jsonb_build_object('record_id', NEW.id)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.user_activity_log (user_id, activity_type, activity_description, metadata)
    VALUES (
      NEW.user_id,
      TG_TABLE_NAME || '_updated',
      'Updated ' || TG_TABLE_NAME,
      jsonb_build_object('record_id', NEW.id)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_status_notification ON public.reports;
CREATE TRIGGER trigger_status_notification
  AFTER UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.create_status_notification();

-- Update timestamp triggers
CREATE TRIGGER update_reports_timestamp 
  BEFORE UPDATE ON public.reports 
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_user_profiles_timestamp 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_notifications_timestamp 
  BEFORE UPDATE ON public.notifications 
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Activity logging triggers
CREATE TRIGGER log_report_activity 
  AFTER INSERT OR UPDATE ON public.reports 
  FOR EACH ROW EXECUTE FUNCTION public.log_user_activity();

-- Insert default system configuration
INSERT INTO public.system_config (config_key, config_value, description, is_public) VALUES
('app_settings', '{"maintenance_mode": false, "allow_registrations": true, "max_file_size": 10485760}', 'Application settings', false),
('fraud_categories', '["phishing", "sms_fraud", "call_fraud", "email_spam", "investment_scam", "lottery_scam", "tech_support_scam", "romance_scam", "online_shopping_fraud", "banking_fraud", "identity_theft", "cryptocurrency_scam", "job_scam", "other"]', 'Available fraud categories', true),
('notification_settings', '{"email_enabled": true, "sms_enabled": false, "push_enabled": true}', 'Global notification settings', false)
ON CONFLICT (config_key) DO NOTHING;
