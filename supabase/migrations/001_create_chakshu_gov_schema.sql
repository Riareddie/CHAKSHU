-- CHAKSHU_GOV Government Portal Database Schema
-- Comprehensive schema with RLS, audit trails, and government compliance features

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('citizen', 'officer', 'admin', 'super_admin');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE complaint_category AS ENUM ('infrastructure', 'sanitation', 'corruption', 'cyber_fraud', 'other');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE complaint_status AS ENUM ('pending', 'in_progress', 'resolved', 'closed', 'rejected');
CREATE TYPE notification_type AS ENUM ('info', 'warning', 'success', 'error', 'system');

-- ================================================
-- 1. USERS TABLE
-- ================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'citizen',
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    -- Soft delete support
    deleted_at TIMESTAMPTZ,
    -- Authentication metadata
    login_count INTEGER DEFAULT 0,
    password_changed_at TIMESTAMPTZ DEFAULT NOW(),
    two_factor_enabled BOOLEAN DEFAULT false,
    -- Government compliance fields
    account_locked BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    last_failed_login TIMESTAMPTZ
);

-- Add indexes for users table
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login);

-- Add constraints
ALTER TABLE users ADD CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE users ADD CONSTRAINT users_login_count_positive CHECK (login_count >= 0);
ALTER TABLE users ADD CONSTRAINT users_failed_attempts_limit CHECK (failed_login_attempts >= 0 AND failed_login_attempts <= 10);

-- ================================================
-- 2. USER_PROFILES TABLE
-- ================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT,
    address JSONB DEFAULT '{}',
    -- Encrypted government IDs
    aadhaar_number TEXT, -- Will be encrypted
    pan_number TEXT,
    date_of_birth DATE,
    gender gender_type,
    profile_image_url TEXT,
    -- Additional government fields
    nationality TEXT DEFAULT 'Indian',
    state_of_residence TEXT,
    district TEXT,
    pin_code TEXT,
    emergency_contact JSONB DEFAULT '{}',
    -- Verification status
    identity_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    address_verified BOOLEAN DEFAULT false,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add indexes for user_profiles table
CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_profiles_pan ON user_profiles(pan_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_profiles_state ON user_profiles(state_of_residence) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_profiles_pin_code ON user_profiles(pin_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_profiles_verification ON user_profiles(identity_verified, phone_verified) WHERE deleted_at IS NULL;

-- Add constraints for user_profiles
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_phone_format CHECK (
    phone_number IS NULL OR phone_number ~* '^\+?91?[6-9]\d{9}$'
);
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_pan_format CHECK (
    pan_number IS NULL OR pan_number ~* '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
);
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_pin_code_format CHECK (
    pin_code IS NULL OR pin_code ~* '^[1-9][0-9]{5}$'
);
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_dob_reasonable CHECK (
    date_of_birth IS NULL OR (date_of_birth >= '1900-01-01' AND date_of_birth <= CURRENT_DATE - INTERVAL '10 years')
);

-- ================================================
-- 3. COMPLAINTS TABLE
-- ================================================
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category complaint_category NOT NULL,
    priority complaint_priority NOT NULL DEFAULT 'medium',
    status complaint_status NOT NULL DEFAULT 'pending',
    assigned_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    -- Location data
    location JSONB DEFAULT '{}', -- {lat, lng, address, landmark}
    -- File attachments
    attachments JSONB DEFAULT '[]', -- Array of file metadata
    -- Government specific fields
    complaint_number TEXT UNIQUE NOT NULL,
    reference_number TEXT UNIQUE,
    department TEXT,
    sub_category TEXT,
    -- Tracking fields
    resolution_time_hours INTEGER,
    citizen_satisfaction_rating INTEGER CHECK (citizen_satisfaction_rating >= 1 AND citizen_satisfaction_rating <= 5),
    officer_notes TEXT,
    resolution_summary TEXT,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    -- Escalation tracking
    escalated BOOLEAN DEFAULT false,
    escalated_at TIMESTAMPTZ,
    escalated_to UUID REFERENCES users(id),
    escalation_reason TEXT
);

-- Add indexes for complaints table
CREATE INDEX idx_complaints_user_id ON complaints(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_assigned_officer ON complaints(assigned_officer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_status ON complaints(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_category ON complaints(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_priority ON complaints(priority) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_created_at ON complaints(created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_due_date ON complaints(due_date) WHERE deleted_at IS NULL AND due_date IS NOT NULL;
CREATE INDEX idx_complaints_location_gin ON complaints USING GIN (location) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_complaints_number ON complaints(complaint_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_department ON complaints(department) WHERE deleted_at IS NULL;
CREATE INDEX idx_complaints_escalated ON complaints(escalated, escalated_at) WHERE deleted_at IS NULL;

-- Full text search index
CREATE INDEX idx_complaints_search ON complaints USING GIN (
    to_tsvector('english', title || ' ' || description || ' ' || COALESCE(sub_category, ''))
) WHERE deleted_at IS NULL;

-- Add constraints for complaints
ALTER TABLE complaints ADD CONSTRAINT complaints_title_length CHECK (length(title) >= 5 AND length(title) <= 200);
ALTER TABLE complaints ADD CONSTRAINT complaints_description_length CHECK (length(description) >= 10);
ALTER TABLE complaints ADD CONSTRAINT complaints_officer_role CHECK (
    assigned_officer_id IS NULL OR 
    assigned_officer_id IN (SELECT id FROM users WHERE role IN ('officer', 'admin', 'super_admin'))
);
ALTER TABLE complaints ADD CONSTRAINT complaints_resolution_time_positive CHECK (resolution_time_hours >= 0);
ALTER TABLE complaints ADD CONSTRAINT complaints_escalated_fields_consistency CHECK (
    (escalated = false AND escalated_at IS NULL AND escalated_to IS NULL) OR
    (escalated = true AND escalated_at IS NOT NULL)
);

-- ================================================
-- 4. COMPLAINT_UPDATES TABLE
-- ================================================
CREATE TABLE complaint_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    updated_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    status_change TEXT,
    previous_status complaint_status,
    new_status complaint_status,
    comments TEXT NOT NULL,
    -- Additional tracking
    update_type TEXT NOT NULL DEFAULT 'comment', -- 'comment', 'status_change', 'assignment', 'escalation'
    is_internal BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]',
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Audit fields
    ip_address INET,
    user_agent TEXT
);

-- Add indexes for complaint_updates table
CREATE INDEX idx_complaint_updates_complaint_id ON complaint_updates(complaint_id);
CREATE INDEX idx_complaint_updates_updated_by ON complaint_updates(updated_by);
CREATE INDEX idx_complaint_updates_created_at ON complaint_updates(created_at);
CREATE INDEX idx_complaint_updates_type ON complaint_updates(update_type);
CREATE INDEX idx_complaint_updates_status_changes ON complaint_updates(previous_status, new_status) 
    WHERE status_change IS NOT NULL;

-- Add constraints for complaint_updates
ALTER TABLE complaint_updates ADD CONSTRAINT complaint_updates_comments_length CHECK (length(comments) >= 1);
ALTER TABLE complaint_updates ADD CONSTRAINT complaint_updates_status_change_consistency CHECK (
    (status_change IS NULL AND previous_status IS NULL AND new_status IS NULL) OR
    (status_change IS NOT NULL AND previous_status IS NOT NULL AND new_status IS NOT NULL)
);

-- ================================================
-- 5. NOTIFICATIONS TABLE
-- ================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    -- Additional fields
    action_url TEXT,
    action_text TEXT,
    related_complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    -- Delivery tracking
    delivery_method TEXT DEFAULT 'in_app', -- 'in_app', 'email', 'sms', 'push'
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add indexes for notifications table
CREATE INDEX idx_notifications_user_id ON notifications(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_type ON notifications(type) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_created_at ON notifications(created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at) WHERE deleted_at IS NULL AND expires_at IS NOT NULL;
CREATE INDEX idx_notifications_related_complaint ON notifications(related_complaint_id) WHERE deleted_at IS NULL;

-- Add constraints for notifications
ALTER TABLE notifications ADD CONSTRAINT notifications_title_length CHECK (length(title) >= 1 AND length(title) <= 200);
ALTER TABLE notifications ADD CONSTRAINT notifications_message_length CHECK (length(message) >= 1);
ALTER TABLE notifications ADD CONSTRAINT notifications_read_timestamp CHECK (
    (is_read = false AND read_at IS NULL) OR (is_read = true AND read_at IS NOT NULL)
);

-- ================================================
-- AUDIT TRAIL TABLE
-- ================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    -- Government compliance fields
    compliance_category TEXT,
    retention_period INTERVAL DEFAULT '7 years'
);

-- Add indexes for audit_logs
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_changed_by ON audit_logs(changed_by);
CREATE INDEX idx_audit_logs_changed_at ON audit_logs(changed_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ================================================
-- HELPER FUNCTIONS
-- ================================================

-- Function to generate complaint numbers
CREATE OR REPLACE FUNCTION generate_complaint_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_part TEXT;
    complaint_number TEXT;
BEGIN
    year_part := EXTRACT(year FROM NOW())::TEXT;
    
    -- Get next sequence number for the year
    SELECT COALESCE(MAX(
        CASE 
            WHEN complaint_number LIKE 'CMP' || year_part || '%' 
            THEN CAST(SUBSTRING(complaint_number, 8) AS INTEGER)
            ELSE 0
        END
    ), 0) + 1
    INTO sequence_part
    FROM complaints;
    
    complaint_number := 'CMP' || year_part || LPAD(sequence_part, 6, '0');
    RETURN complaint_number;
END;
$$ LANGUAGE plpgsql;

-- Function to encrypt Aadhaar numbers
CREATE OR REPLACE FUNCTION encrypt_aadhaar(aadhaar_plain TEXT)
RETURNS TEXT AS $$
BEGIN
    -- In production, use proper encryption with keys from vault
    -- This is a simplified example
    RETURN CASE 
        WHEN aadhaar_plain IS NULL THEN NULL
        ELSE crypt(aadhaar_plain, gen_salt('bf', 8))
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to verify encrypted Aadhaar
CREATE OR REPLACE FUNCTION verify_aadhaar(aadhaar_plain TEXT, aadhaar_encrypted TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN aadhaar_encrypted = crypt(aadhaar_plain, aadhaar_encrypted);
END;
$$ LANGUAGE plpgsql;

-- Function to automatically set due dates based on priority
CREATE OR REPLACE FUNCTION set_complaint_due_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.due_date IS NULL THEN
        NEW.due_date := CASE NEW.priority
            WHEN 'critical' THEN NEW.created_at + INTERVAL '24 hours'
            WHEN 'high' THEN NEW.created_at + INTERVAL '72 hours'
            WHEN 'medium' THEN NEW.created_at + INTERVAL '7 days'
            WHEN 'low' THEN NEW.created_at + INTERVAL '15 days'
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER trigger_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_complaints_updated_at 
    BEFORE UPDATE ON complaints 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to set complaint number and due date
CREATE TRIGGER trigger_complaints_before_insert
    BEFORE INSERT ON complaints
    FOR EACH ROW EXECUTE FUNCTION set_complaint_due_date();

CREATE OR REPLACE FUNCTION set_complaint_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.complaint_number IS NULL THEN
        NEW.complaint_number := generate_complaint_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_complaints_set_number
    BEFORE INSERT ON complaints
    FOR EACH ROW EXECUTE FUNCTION set_complaint_number();

-- Trigger for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), 
                COALESCE(current_setting('app.current_user_id', true)::UUID, NEW.user_id));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW),
                COALESCE(current_setting('app.current_user_id', true)::UUID, NEW.user_id));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD),
                current_setting('app.current_user_id', true)::UUID);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_user_profiles AFTER INSERT OR UPDATE OR DELETE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_complaints AFTER INSERT OR UPDATE OR DELETE ON complaints
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Trigger to create complaint updates on status changes
CREATE OR REPLACE FUNCTION track_complaint_status_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Only track if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO complaint_updates (
            complaint_id, 
            updated_by, 
            status_change,
            previous_status,
            new_status,
            comments,
            update_type
        ) VALUES (
            NEW.id,
            COALESCE(current_setting('app.current_user_id', true)::UUID, NEW.user_id),
            'Status changed from ' || OLD.status || ' to ' || NEW.status,
            OLD.status,
            NEW.status,
            'Automated status change tracking',
            'status_change'
        );
        
        -- Set resolution timestamp
        IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
            NEW.resolved_at = NOW();
            NEW.resolution_time_hours = EXTRACT(EPOCH FROM (NOW() - NEW.created_at)) / 3600;
        ELSIF NEW.status = 'closed' AND OLD.status != 'closed' THEN
            NEW.closed_at = NOW();
        END IF;
    END IF;
    
    -- Track assignment changes
    IF OLD.assigned_officer_id IS DISTINCT FROM NEW.assigned_officer_id THEN
        NEW.assigned_at = CASE WHEN NEW.assigned_officer_id IS NOT NULL THEN NOW() ELSE NULL END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_complaints_status_tracking
    BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION track_complaint_status_changes();

-- Trigger to update notification read status
CREATE OR REPLACE FUNCTION update_notification_read_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_read = false AND NEW.is_read = true THEN
        NEW.read_at = NOW();
    ELSIF OLD.is_read = true AND NEW.is_read = false THEN
        NEW.read_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notifications_read_timestamp
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_notification_read_timestamp();

-- ================================================
-- INITIAL DATA / SEEDING
-- ================================================

-- Create system admin user (to be replaced with proper user creation)
INSERT INTO users (id, email, role, email_verified, is_active) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@chakshu.gov.in',
    'super_admin',
    true,
    true
) ON CONFLICT (id) DO NOTHING;

-- Create initial system notifications template
INSERT INTO notifications (
    id,
    user_id,
    title,
    message,
    type,
    is_read
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Welcome to CHAKSHU Government Portal',
    'Your account has been successfully created. You can now start filing complaints and tracking their status.',
    'success',
    false
) ON CONFLICT (id) DO NOTHING;

-- Add helpful comments
COMMENT ON TABLE users IS 'Main user authentication and basic profile information';
COMMENT ON TABLE user_profiles IS 'Detailed user profile information including government IDs';
COMMENT ON TABLE complaints IS 'Main complaints/reports table with comprehensive tracking';
COMMENT ON TABLE complaint_updates IS 'Tracking changes and updates to complaints';
COMMENT ON TABLE notifications IS 'User notification system';
COMMENT ON TABLE audit_logs IS 'Government-compliant audit trail for all changes';

COMMENT ON COLUMN user_profiles.aadhaar_number IS 'Encrypted Aadhaar number for government ID verification';
COMMENT ON COLUMN complaints.complaint_number IS 'Unique complaint identifier in format CMPYYYY######';
COMMENT ON COLUMN complaints.location IS 'JSON object containing lat, lng, address, and landmark information';
COMMENT ON COLUMN complaints.attachments IS 'JSON array of file metadata for evidence and supporting documents';
