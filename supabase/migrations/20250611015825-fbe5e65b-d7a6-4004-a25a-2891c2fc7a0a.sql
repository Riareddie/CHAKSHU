
-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('case_update', 'fraud_warning', 'community_alert', 'system_announcement', 'security_alert', 'milestone')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT
);

-- Create community interactions table
CREATE TABLE IF NOT EXISTS public.community_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('similar_experience', 'helpful', 'comment')),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(report_id, user_id, interaction_type)
);

-- Create user analytics preferences table
CREATE TABLE IF NOT EXISTS public.user_analytics_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dashboard_filters JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Add geographic coordinates to reports table
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';

-- Add currency and amount fields updates
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS recovery_amount DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS estimated_loss DECIMAL(15, 2);

-- Add missing columns to existing report_evidence table
ALTER TABLE public.report_evidence 
ADD COLUMN IF NOT EXISTS mime_type TEXT,
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on all new tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications (only create if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications') THEN
    CREATE POLICY "Users can view their own notifications" 
      ON public.notifications 
      FOR SELECT 
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications') THEN
    CREATE POLICY "Users can update their own notifications" 
      ON public.notifications 
      FOR UPDATE 
      USING (user_id = auth.uid());
  END IF;
END $$;

-- RLS policies for community interactions
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_interactions' AND policyname = 'Users can view all community interactions') THEN
    CREATE POLICY "Users can view all community interactions" 
      ON public.community_interactions 
      FOR SELECT 
      USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_interactions' AND policyname = 'Users can create their own interactions') THEN
    CREATE POLICY "Users can create their own interactions" 
      ON public.community_interactions 
      FOR INSERT 
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_interactions' AND policyname = 'Users can update their own interactions') THEN
    CREATE POLICY "Users can update their own interactions" 
      ON public.community_interactions 
      FOR UPDATE 
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'community_interactions' AND policyname = 'Users can delete their own interactions') THEN
    CREATE POLICY "Users can delete their own interactions" 
      ON public.community_interactions 
      FOR DELETE 
      USING (user_id = auth.uid());
  END IF;
END $$;

-- RLS policies for user analytics preferences
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analytics_preferences' AND policyname = 'Users can manage their own preferences') THEN
    CREATE POLICY "Users can manage their own preferences" 
      ON public.user_analytics_preferences 
      FOR ALL 
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence-files', 'evidence-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_interactions_report_id ON public.community_interactions(report_id);
CREATE INDEX IF NOT EXISTS idx_reports_location ON public.reports(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reports_city_state ON public.reports(city, state);

-- Function to create notification for report status updates
CREATE OR REPLACE FUNCTION public.create_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, type, title, message, data, priority)
    VALUES (
      NEW.user_id,
      'case_update',
      'Report Status Updated',
      'Your report ' || NEW.title || ' has been updated to ' || NEW.status,
      jsonb_build_object('report_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status),
      'medium'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS trigger_status_notification ON public.reports;
CREATE TRIGGER trigger_status_notification
  AFTER UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.create_status_notification();
