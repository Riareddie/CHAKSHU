-- Performance Optimizations and Additional Indexes for CHAKSHU_GOV Portal
-- Advanced indexing strategy for government-scale data and reporting requirements

-- ================================================
-- COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
-- ================================================

-- User management and authentication queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role_active_email 
ON users(role, is_active, email) 
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_last_login_role 
ON users(last_login DESC, role) 
WHERE deleted_at IS NULL AND is_active = true;

-- Profile search and verification
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_verification_status 
ON user_profiles(identity_verified, phone_verified, address_verified, state_of_residence) 
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_location 
ON user_profiles(state_of_residence, district, pin_code) 
WHERE deleted_at IS NULL;

-- Complaint management and reporting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_status_priority_created 
ON complaints(status, priority, created_at DESC) 
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_assigned_status_updated 
ON complaints(assigned_officer_id, status, updated_at DESC) 
WHERE deleted_at IS NULL AND assigned_officer_id IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_category_location 
ON complaints(category, ((location->>'state')::text)) 
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_due_date_priority 
ON complaints(due_date, priority) 
WHERE deleted_at IS NULL AND status IN ('pending', 'in_progress');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_resolution_time 
ON complaints(resolved_at, resolution_time_hours) 
WHERE deleted_at IS NULL AND resolved_at IS NOT NULL;

-- Escalation tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_escalation 
ON complaints(escalated, escalated_at, priority) 
WHERE deleted_at IS NULL;

-- Complaint updates and activity tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaint_updates_complaint_created 
ON complaint_updates(complaint_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaint_updates_user_type 
ON complaint_updates(updated_by, update_type, created_at DESC);

-- Notification management
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread 
ON notifications(user_id, created_at DESC) 
WHERE deleted_at IS NULL AND is_read = false;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_type_delivery 
ON notifications(type, delivery_method, delivered_at) 
WHERE deleted_at IS NULL;

-- Audit and compliance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_compliance 
ON audit_logs(compliance_category, changed_at DESC, table_name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_date 
ON audit_logs(changed_by, changed_at DESC) 
WHERE changed_by IS NOT NULL;

-- ================================================
-- PARTIAL INDEXES FOR SPECIFIC CONDITIONS
-- ================================================

-- Active and pending complaints
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_active_pending 
ON complaints(created_at DESC, priority) 
WHERE deleted_at IS NULL AND status = 'pending';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_in_progress 
ON complaints(updated_at DESC, assigned_officer_id) 
WHERE deleted_at IS NULL AND status = 'in_progress';

-- Overdue complaints
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_overdue 
ON complaints(due_date, priority, assigned_officer_id) 
WHERE deleted_at IS NULL AND status IN ('pending', 'in_progress') AND due_date < NOW();

-- High priority complaints
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_high_priority 
ON complaints(created_at DESC, status) 
WHERE deleted_at IS NULL AND priority IN ('high', 'critical');

-- Unverified users
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_unverified 
ON users(created_at DESC) 
WHERE deleted_at IS NULL AND email_verified = false;

-- Failed login tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_failed_logins 
ON users(failed_login_attempts, last_failed_login) 
WHERE deleted_at IS NULL AND failed_login_attempts > 0;

-- ================================================
-- FULL TEXT SEARCH INDEXES
-- ================================================

-- Enhanced full text search for complaints
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_fts 
ON complaints USING GIN (
    to_tsvector('english', 
        title || ' ' || 
        description || ' ' || 
        COALESCE(sub_category, '') || ' ' ||
        COALESCE(department, '') || ' ' ||
        COALESCE((location->>'address')::text, '')
    )
) WHERE deleted_at IS NULL;

-- User profile search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_fts 
ON user_profiles USING GIN (
    to_tsvector('english', 
        first_name || ' ' || 
        last_name || ' ' || 
        COALESCE(phone_number, '') || ' ' ||
        COALESCE((address->>'full_address')::text, '')
    )
) WHERE deleted_at IS NULL;

-- ================================================
-- JSONB SPECIFIC INDEXES
-- ================================================

-- Location-based queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_location_state 
ON complaints USING GIN ((location->'state')) 
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_location_coordinates 
ON complaints USING GIN (location) 
WHERE deleted_at IS NULL AND location ? 'lat' AND location ? 'lng';

-- Profile address indexing
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_address_gin 
ON user_profiles USING GIN (address) 
WHERE deleted_at IS NULL;

-- Complaint attachments
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_attachments 
ON complaints USING GIN (attachments) 
WHERE deleted_at IS NULL AND jsonb_array_length(attachments) > 0;

-- User profile data
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_profile_data 
ON users USING GIN (profile_data) 
WHERE deleted_at IS NULL;

-- Notification metadata
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_metadata 
ON notifications USING GIN (metadata) 
WHERE deleted_at IS NULL;

-- ================================================
-- SPECIALIZED GOVERNMENT REPORTING INDEXES
-- ================================================

-- Monthly/Yearly reporting
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_monthly_stats 
ON complaints(
    date_trunc('month', created_at),
    category,
    status,
    priority
) WHERE deleted_at IS NULL;

-- Department-wise analysis
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_department_stats 
ON complaints(department, status, created_at) 
WHERE deleted_at IS NULL AND department IS NOT NULL;

-- Resolution time analysis
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_resolution_analysis 
ON complaints(category, priority, resolution_time_hours) 
WHERE deleted_at IS NULL AND resolution_time_hours IS NOT NULL;

-- Officer performance tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_complaints_officer_performance 
ON complaints(assigned_officer_id, status, assigned_at, resolved_at) 
WHERE deleted_at IS NULL AND assigned_officer_id IS NOT NULL;

-- User activity patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_activity_pattern 
ON users(date_trunc('day', last_login), role) 
WHERE deleted_at IS NULL AND last_login IS NOT NULL;

-- ================================================
-- MATERIALIZED VIEWS FOR REPORTING
-- ================================================

-- Daily complaint statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_complaint_stats AS
SELECT 
    date_trunc('day', created_at) as complaint_date,
    category,
    priority,
    status,
    COUNT(*) as complaint_count,
    AVG(resolution_time_hours) as avg_resolution_hours,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
FROM complaints 
WHERE deleted_at IS NULL
GROUP BY date_trunc('day', created_at), category, priority, status;

CREATE UNIQUE INDEX idx_mv_daily_complaint_stats 
ON mv_daily_complaint_stats(complaint_date, category, priority, status);

-- Officer workload summary
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_officer_workload AS
SELECT 
    u.id as officer_id,
    up.first_name || ' ' || up.last_name as officer_name,
    COUNT(c.id) as total_assigned,
    COUNT(CASE WHEN c.status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN c.status = 'in_progress' THEN 1 END) as in_progress_count,
    COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) as resolved_count,
    AVG(c.resolution_time_hours) as avg_resolution_time,
    COUNT(CASE WHEN c.due_date < NOW() AND c.status IN ('pending', 'in_progress') THEN 1 END) as overdue_count
FROM users u
JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN complaints c ON u.id = c.assigned_officer_id AND c.deleted_at IS NULL
WHERE u.role IN ('officer', 'admin') 
AND u.deleted_at IS NULL 
AND up.deleted_at IS NULL
GROUP BY u.id, up.first_name, up.last_name;

CREATE UNIQUE INDEX idx_mv_officer_workload ON mv_officer_workload(officer_id);

-- Complaint trend analysis
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_complaint_trends AS
SELECT 
    date_trunc('week', created_at) as week_start,
    category,
    COUNT(*) as complaint_count,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
    ROUND(AVG(resolution_time_hours), 2) as avg_resolution_hours,
    COUNT(CASE WHEN priority IN ('high', 'critical') THEN 1 END) as high_priority_count
FROM complaints 
WHERE deleted_at IS NULL 
AND created_at >= NOW() - INTERVAL '6 months'
GROUP BY date_trunc('week', created_at), category
ORDER BY week_start DESC;

CREATE INDEX idx_mv_complaint_trends ON mv_complaint_trends(week_start, category);

-- ================================================
-- FUNCTIONS FOR INDEX MAINTENANCE
-- ================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_reporting_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_complaint_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_officer_workload;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_complaint_trends;
    
    -- Log the refresh for audit
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        new_values,
        compliance_category
    ) VALUES (
        'materialized_views',
        gen_random_uuid(),
        'REFRESH',
        jsonb_build_object('refreshed_at', NOW(), 'views', ARRAY['mv_daily_complaint_stats', 'mv_officer_workload', 'mv_complaint_trends']),
        'reporting'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to analyze table statistics for query optimization
CREATE OR REPLACE FUNCTION analyze_complaint_tables()
RETURNS void AS $$
BEGIN
    ANALYZE users;
    ANALYZE user_profiles;
    ANALYZE complaints;
    ANALYZE complaint_updates;
    ANALYZE notifications;
    ANALYZE audit_logs;
    
    -- Log the analysis
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        new_values,
        compliance_category
    ) VALUES (
        'table_statistics',
        gen_random_uuid(),
        'ANALYZE',
        jsonb_build_object('analyzed_at', NOW()),
        'maintenance'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check index usage and suggest optimizations
CREATE OR REPLACE FUNCTION get_index_usage_stats()
RETURNS TABLE (
    schemaname text,
    tablename text,
    indexname text,
    idx_scan bigint,
    idx_tup_read bigint,
    idx_tup_fetch bigint,
    usage_ratio numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.schemaname::text,
        s.tablename::text,
        s.indexname::text,
        s.idx_scan,
        s.idx_tup_read,
        s.idx_tup_fetch,
        CASE 
            WHEN s.idx_scan = 0 THEN 0
            ELSE ROUND((s.idx_tup_fetch::numeric / s.idx_scan) * 100, 2)
        END as usage_ratio
    FROM pg_stat_user_indexes s
    JOIN pg_index i ON s.indexrelid = i.indexrelid
    WHERE s.schemaname = 'public'
    AND s.tablename IN ('users', 'user_profiles', 'complaints', 'complaint_updates', 'notifications', 'audit_logs')
    ORDER BY s.idx_scan DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- PERFORMANCE MONITORING FUNCTIONS
-- ================================================

-- Function to get slow queries related to complaints
CREATE OR REPLACE FUNCTION get_complaint_query_performance()
RETURNS TABLE (
    query_type text,
    avg_duration_ms numeric,
    calls bigint,
    total_time_ms numeric
) AS $$
BEGIN
    -- This would integrate with pg_stat_statements in production
    RETURN QUERY
    SELECT 
        'placeholder'::text,
        0::numeric,
        0::bigint,
        0::numeric
    LIMIT 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- AUTOMATED MAINTENANCE TASKS
-- ================================================

-- Schedule regular maintenance tasks
CREATE OR REPLACE FUNCTION schedule_maintenance_tasks()
RETURNS void AS $$
BEGIN
    -- This would be called by a cron job or scheduler
    
    -- Refresh reporting views (daily)
    IF EXTRACT(hour FROM NOW()) = 2 THEN
        PERFORM refresh_reporting_views();
    END IF;
    
    -- Update table statistics (weekly)
    IF EXTRACT(dow FROM NOW()) = 1 AND EXTRACT(hour FROM NOW()) = 3 THEN
        PERFORM analyze_complaint_tables();
    END IF;
    
    -- Clean up old data according to retention policies
    PERFORM enforce_data_retention();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- QUERY HINTS AND OPTIMIZATIONS
-- ================================================

-- Create statistics for better query planning
CREATE STATISTICS IF NOT EXISTS stat_complaints_category_priority 
ON category, priority 
FROM complaints;

CREATE STATISTICS IF NOT EXISTS stat_complaints_status_assigned 
ON status, assigned_officer_id 
FROM complaints;

CREATE STATISTICS IF NOT EXISTS stat_users_role_active 
ON role, is_active 
FROM users;

-- ================================================
-- INDEX MONITORING VIEWS
-- ================================================

-- View for monitoring index effectiveness
CREATE OR REPLACE VIEW v_index_usage_summary AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    CASE 
        WHEN idx_scan = 0 THEN 'UNUSED'
        WHEN idx_scan < 100 THEN 'LOW_USAGE'
        WHEN idx_scan < 1000 THEN 'MODERATE_USAGE'
        ELSE 'HIGH_USAGE'
    END as usage_category
FROM pg_stat_user_indexes
WHERE schemaname = 'public';

-- View for table size and index statistics
CREATE OR REPLACE VIEW v_table_sizes AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
    (pg_indexes_size(schemaname||'.'||tablename)::float / pg_relation_size(schemaname||'.'||tablename)::float * 100)::int as index_ratio_percent
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ================================================
-- GRANTS AND PERMISSIONS
-- ================================================

-- Grant execute permissions for maintenance functions to admins
GRANT EXECUTE ON FUNCTION refresh_reporting_views() TO authenticated;
GRANT EXECUTE ON FUNCTION analyze_complaint_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION get_index_usage_stats() TO authenticated;

-- Grant select permissions on materialized views
GRANT SELECT ON mv_daily_complaint_stats TO authenticated;
GRANT SELECT ON mv_officer_workload TO authenticated;
GRANT SELECT ON mv_complaint_trends TO authenticated;

-- Grant select permissions on monitoring views
GRANT SELECT ON v_index_usage_summary TO authenticated;
GRANT SELECT ON v_table_sizes TO authenticated;

-- ================================================
-- COMMENTS AND DOCUMENTATION
-- ================================================

COMMENT ON FUNCTION refresh_reporting_views IS 'Refreshes all materialized views used for government reporting';
COMMENT ON FUNCTION analyze_complaint_tables IS 'Updates table statistics for query optimization';
COMMENT ON FUNCTION get_index_usage_stats IS 'Returns index usage statistics for performance monitoring';

COMMENT ON MATERIALIZED VIEW mv_daily_complaint_stats IS 'Daily aggregated complaint statistics for reporting';
COMMENT ON MATERIALIZED VIEW mv_officer_workload IS 'Current workload summary for all officers';
COMMENT ON MATERIALIZED VIEW mv_complaint_trends IS 'Weekly complaint trends for the last 6 months';

-- Completion message
DO $$
BEGIN
    RAISE NOTICE 'Performance optimization and indexing complete for CHAKSHU_GOV portal';
    RAISE NOTICE 'Created % composite indexes, % partial indexes, and % materialized views', 
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%'),
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexdef LIKE '%WHERE%'),
        (SELECT COUNT(*) FROM pg_matviews WHERE schemaname = 'public');
END $$;
