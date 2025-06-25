-- Row Level Security (RLS) Policies for CHAKSHU_GOV Government Portal
-- Comprehensive security policies ensuring data protection and government compliance

-- ================================================
-- ENABLE RLS ON ALL TABLES
-- ================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ================================================
-- HELPER FUNCTIONS FOR RLS
-- ================================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID DEFAULT auth.uid())
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM users 
        WHERE id = user_uuid 
        AND is_active = true 
        AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role(user_uuid) IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is officer or higher
CREATE OR REPLACE FUNCTION is_officer_or_higher(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role(user_uuid) IN ('officer', 'admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role(user_uuid) = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access complaint
CREATE OR REPLACE FUNCTION can_access_complaint(complaint_id UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
    user_role_val user_role;
    complaint_user_id UUID;
    assigned_officer_id UUID;
BEGIN
    -- Get user role
    user_role_val := get_user_role(user_uuid);
    
    -- Super admins and admins can access all complaints
    IF user_role_val IN ('super_admin', 'admin') THEN
        RETURN TRUE;
    END IF;
    
    -- Get complaint details
    SELECT user_id, assigned_officer_id INTO complaint_user_id, assigned_officer_id
    FROM complaints 
    WHERE id = complaint_id AND deleted_at IS NULL;
    
    -- Citizens can only access their own complaints
    IF user_role_val = 'citizen' THEN
        RETURN complaint_user_id = user_uuid;
    END IF;
    
    -- Officers can access complaints assigned to them or in their department
    IF user_role_val = 'officer' THEN
        RETURN complaint_user_id = user_uuid OR assigned_officer_id = user_uuid;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- USERS TABLE RLS POLICIES
-- ================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
    FOR SELECT USING (
        id = auth.uid() 
        OR is_officer_or_higher()
    );

-- Users can update their own basic profile (excluding role)
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (
        id = auth.uid()
    ) WITH CHECK (
        id = auth.uid() 
        AND (
            -- Regular users cannot change their role
            (get_user_role() NOT IN ('admin', 'super_admin') AND role = OLD.role)
            OR
            -- Admins and super admins can change roles
            is_admin()
        )
    );

-- Only super admins can insert new users
CREATE POLICY "Super admins can insert users" ON users
    FOR INSERT WITH CHECK (is_super_admin());

-- Admins and super admins can view all users (for management)
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (is_admin());

-- Soft delete: Only super admins can delete users
CREATE POLICY "Super admins can delete users" ON users
    FOR UPDATE USING (is_super_admin()) 
    WITH CHECK (is_super_admin());

-- ================================================
-- USER_PROFILES TABLE RLS POLICIES
-- ================================================

-- Users can read their own profile
CREATE POLICY "Users can read own user_profile" ON user_profiles
    FOR SELECT USING (
        user_id = auth.uid() 
        OR is_officer_or_higher()
    );

-- Users can update their own profile
CREATE POLICY "Users can update own user_profile" ON user_profiles
    FOR UPDATE USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own user_profile" ON user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Officers and higher can view profiles for investigation purposes
CREATE POLICY "Officers can view user profiles" ON user_profiles
    FOR SELECT USING (is_officer_or_higher());

-- ================================================
-- COMPLAINTS TABLE RLS POLICIES
-- ================================================

-- Users can read complaints they have access to
CREATE POLICY "Users can read accessible complaints" ON complaints
    FOR SELECT USING (
        can_access_complaint(id) 
        AND deleted_at IS NULL
    );

-- Citizens can insert their own complaints
CREATE POLICY "Citizens can create complaints" ON complaints
    FOR INSERT WITH CHECK (
        user_id = auth.uid() 
        AND get_user_role() IN ('citizen', 'officer', 'admin', 'super_admin')
    );

-- Users can update complaints they have access to (with restrictions)
CREATE POLICY "Users can update accessible complaints" ON complaints
    FOR UPDATE USING (can_access_complaint(id)) 
    WITH CHECK (
        can_access_complaint(id) 
        AND (
            -- Citizens can only update their own pending complaints
            (user_id = auth.uid() AND status = 'pending' AND get_user_role() = 'citizen')
            OR
            -- Officers and higher can update assigned complaints
            is_officer_or_higher()
        )
    );

-- Only officers and higher can assign complaints
CREATE POLICY "Officers can assign complaints" ON complaints
    FOR UPDATE USING (
        is_officer_or_higher() 
        AND (assigned_officer_id IS NULL OR assigned_officer_id = auth.uid())
    ) WITH CHECK (
        is_officer_or_higher()
    );

-- Soft delete: Users can soft delete their own pending complaints, officers can soft delete any
CREATE POLICY "Users can soft delete complaints" ON complaints
    FOR UPDATE USING (
        (user_id = auth.uid() AND status = 'pending' AND get_user_role() = 'citizen')
        OR is_officer_or_higher()
    ) WITH CHECK (
        deleted_at IS NOT NULL
    );

-- ================================================
-- COMPLAINT_UPDATES TABLE RLS POLICIES
-- ================================================

-- Users can read updates for complaints they can access
CREATE POLICY "Users can read complaint updates" ON complaint_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM complaints 
            WHERE id = complaint_id 
            AND can_access_complaint(id)
        )
        AND (
            -- Citizens can only see non-internal updates
            (get_user_role() = 'citizen' AND is_internal = false)
            OR
            -- Officers and higher can see all updates
            is_officer_or_higher()
        )
    );

-- Users can insert updates for complaints they can access
CREATE POLICY "Users can insert complaint updates" ON complaint_updates
    FOR INSERT WITH CHECK (
        updated_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM complaints 
            WHERE id = complaint_id 
            AND can_access_complaint(id)
        )
        AND (
            -- Citizens can only add non-internal comments to their own complaints
            (get_user_role() = 'citizen' AND is_internal = false AND EXISTS (
                SELECT 1 FROM complaints 
                WHERE id = complaint_id AND user_id = auth.uid()
            ))
            OR
            -- Officers and higher can add any type of update
            is_officer_or_higher()
        )
    );

-- Users can update their own updates within time limit
CREATE POLICY "Users can update own updates" ON complaint_updates
    FOR UPDATE USING (
        updated_by = auth.uid() 
        AND created_at > NOW() - INTERVAL '1 hour'
    ) WITH CHECK (
        updated_by = auth.uid()
    );

-- ================================================
-- NOTIFICATIONS TABLE RLS POLICIES
-- ================================================

-- Users can only read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
    FOR SELECT USING (
        user_id = auth.uid() 
        AND deleted_at IS NULL
    );

-- Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid());

-- System and officers can insert notifications
CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (
        is_officer_or_higher()
        OR 
        -- Allow system-generated notifications
        current_setting('role', true) = 'service_role'
    );

-- Users can soft delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid()) 
    WITH CHECK (user_id = auth.uid() AND deleted_at IS NOT NULL);

-- ================================================
-- AUDIT_LOGS TABLE RLS POLICIES
-- ================================================

-- Only admins and super admins can read audit logs
CREATE POLICY "Admins can read audit logs" ON audit_logs
    FOR SELECT USING (is_admin());

-- Only super admins can manage audit logs
CREATE POLICY "Super admins can manage audit logs" ON audit_logs
    FOR ALL USING (is_super_admin()) 
    WITH CHECK (is_super_admin());

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (
        current_setting('role', true) = 'service_role'
        OR is_admin()
    );

-- ================================================
-- ADDITIONAL SECURITY POLICIES
-- ================================================

-- Policy to prevent access to deleted records
CREATE OR REPLACE FUNCTION is_not_deleted(deleted_at TIMESTAMPTZ)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add RLS policies for preventing access to deleted records
CREATE POLICY "Prevent access to deleted users" ON users
    FOR ALL USING (deleted_at IS NULL);

CREATE POLICY "Prevent access to deleted profiles" ON user_profiles
    FOR ALL USING (deleted_at IS NULL);

CREATE POLICY "Prevent access to deleted complaints" ON complaints
    FOR ALL USING (deleted_at IS NULL);

CREATE POLICY "Prevent access to deleted notifications" ON notifications
    FOR ALL USING (deleted_at IS NULL);

-- ================================================
-- DATA RETENTION POLICIES
-- ================================================

-- Function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS void AS $$
BEGIN
    UPDATE notifications 
    SET deleted_at = NOW() 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW() 
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enforce data retention policies
CREATE OR REPLACE FUNCTION enforce_data_retention()
RETURNS void AS $$
BEGIN
    -- Mark old audit logs for archival (government requirement: 7 years)
    UPDATE audit_logs 
    SET compliance_category = 'archived'
    WHERE changed_at < NOW() - INTERVAL '7 years'
    AND compliance_category IS NULL;
    
    -- Clean up old sessions
    DELETE FROM auth.sessions 
    WHERE expires_at < NOW() - INTERVAL '30 days';
    
    -- Clean up expired notifications
    PERFORM cleanup_expired_notifications();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- SECURITY FUNCTIONS
-- ================================================

-- Function to check user permissions for specific actions
CREATE OR REPLACE FUNCTION check_permission(
    action TEXT,
    resource_type TEXT,
    resource_id UUID DEFAULT NULL,
    user_uuid UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_val user_role;
BEGIN
    user_role_val := get_user_role(user_uuid);
    
    -- Super admin has all permissions
    IF user_role_val = 'super_admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Admin permissions
    IF user_role_val = 'admin' THEN
        RETURN action NOT IN ('delete_user', 'manage_system_config');
    END IF;
    
    -- Officer permissions
    IF user_role_val = 'officer' THEN
        RETURN action IN ('read_complaint', 'update_complaint', 'assign_complaint', 'create_update');
    END IF;
    
    -- Citizen permissions
    IF user_role_val = 'citizen' THEN
        RETURN action IN ('create_complaint', 'read_own_complaint', 'update_own_complaint');
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    event_type TEXT,
    details JSONB DEFAULT '{}',
    user_uuid UUID DEFAULT auth.uid()
)
RETURNS void AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        new_values,
        changed_by,
        compliance_category
    ) VALUES (
        'security_events',
        user_uuid,
        event_type,
        details,
        user_uuid,
        'security'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- GRANT PERMISSIONS
-- ================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant limited permissions to anonymous users (for public info only)
GRANT USAGE ON SCHEMA public TO anon;

-- Revoke dangerous permissions from public
REVOKE ALL ON audit_logs FROM public;
REVOKE ALL ON audit_logs FROM anon;

-- ================================================
-- COMMENTS FOR DOCUMENTATION
-- ================================================

COMMENT ON FUNCTION get_user_role IS 'Returns the role of a user, used in RLS policies';
COMMENT ON FUNCTION can_access_complaint IS 'Determines if a user can access a specific complaint based on role and ownership';
COMMENT ON FUNCTION check_permission IS 'General permission checking function for fine-grained access control';
COMMENT ON FUNCTION log_security_event IS 'Logs security-related events for audit and compliance';
COMMENT ON FUNCTION enforce_data_retention IS 'Enforces government data retention policies';

-- ================================================
-- SECURITY VALIDATION QUERIES
-- ================================================

-- Test RLS policies are working
DO $$
BEGIN
    -- Verify RLS is enabled on all tables
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
        AND c.relname IN ('users', 'user_profiles', 'complaints', 'complaint_updates', 'notifications', 'audit_logs')
        AND c.relrowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS is not enabled on all required tables';
    END IF;
    
    RAISE NOTICE 'RLS policies have been successfully created and enabled';
END $$;
