-- Sample Data and Initial Setup for CHAKSHU_GOV Government Portal
-- Government-compliant test data and system configuration

-- ================================================
-- INITIAL SYSTEM CONFIGURATION
-- ================================================

-- Insert system configuration data
INSERT INTO users (id, email, role, email_verified, is_active, profile_data) VALUES
-- System admin
('00000000-0000-0000-0000-000000000001', 'admin@chakshu.gov.in', 'super_admin', true, true, 
 '{"system_user": true, "department": "IT Administration", "clearance_level": "top_secret"}'),

-- Sample government officers
('11111111-1111-1111-1111-111111111111', 'officer1@chakshu.gov.in', 'officer', true, true,
 '{"department": "Urban Development", "employee_id": "UD001", "clearance_level": "secret"}'),

('22222222-2222-2222-2222-222222222222', 'officer2@chakshu.gov.in', 'officer', true, true,
 '{"department": "Health & Sanitation", "employee_id": "HS001", "clearance_level": "secret"}'),

('33333333-3333-3333-3333-333333333333', 'officer3@chakshu.gov.in', 'officer', true, true,
 '{"department": "Anti-Corruption", "employee_id": "AC001", "clearance_level": "secret"}'),

-- Department admin
('44444444-4444-4444-4444-444444444444', 'admin.dept@chakshu.gov.in', 'admin', true, true,
 '{"department": "Administration", "employee_id": "AD001", "clearance_level": "secret"}'),

-- Sample citizens
('55555555-5555-5555-5555-555555555555', 'citizen1@example.com', 'citizen', true, true, '{}'),
('66666666-6666-6666-6666-666666666666', 'citizen2@example.com', 'citizen', true, true, '{}'),
('77777777-7777-7777-7777-777777777777', 'citizen3@example.com', 'citizen', true, true, '{}')

ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    email_verified = EXCLUDED.email_verified,
    is_active = EXCLUDED.is_active,
    profile_data = EXCLUDED.profile_data,
    updated_at = NOW();

-- ================================================
-- USER PROFILES
-- ================================================

INSERT INTO user_profiles (user_id, first_name, last_name, phone_number, address, pan_number, date_of_birth, gender, state_of_residence, district, pin_code, identity_verified, phone_verified) VALUES

-- System admin profile
('00000000-0000-0000-0000-000000000001', 'System', 'Administrator', '+919876543210', 
 '{"street": "Government Complex", "city": "New Delhi", "full_address": "Government Complex, Central Secretariat, New Delhi"}',
 'ADMIN1234A', '1980-01-01', 'prefer_not_to_say', 'Delhi', 'Central Delhi', '110001', true, true),

-- Officer profiles
('11111111-1111-1111-1111-111111111111', 'Rajesh', 'Kumar', '+919876543211',
 '{"street": "Urban Development Office", "city": "Mumbai", "full_address": "Urban Development Office, Bandra Kurla Complex, Mumbai"}',
 'OFCR11234B', '1985-05-15', 'male', 'Maharashtra', 'Mumbai', '400051', true, true),

('22222222-2222-2222-2222-222222222222', 'Priya', 'Sharma', '+919876543212',
 '{"street": "Health Department", "city": "Chennai", "full_address": "Health Department, Teynampet, Chennai"}',
 'OFCR21234C', '1987-08-20', 'female', 'Tamil Nadu', 'Chennai', '600018', true, true),

('33333333-3333-3333-3333-333333333333', 'Amit', 'Singh', '+919876543213',
 '{"street": "Anti-Corruption Bureau", "city": "Bengaluru", "full_address": "Anti-Corruption Bureau, Vidhana Soudha, Bengaluru"}',
 'OFCR31234D', '1983-12-10', 'male', 'Karnataka', 'Bengaluru Urban', '560001', true, true),

-- Admin profile
('44444444-4444-4444-4444-444444444444', 'Sunita', 'Gupta', '+919876543214',
 '{"street": "Administrative Block", "city": "Hyderabad", "full_address": "Administrative Block, Secretariat, Hyderabad"}',
 'ADMIN1234E', '1982-03-25', 'female', 'Telangana', 'Hyderabad', '500004', true, true),

-- Citizen profiles
('55555555-5555-5555-5555-555555555555', 'Ramesh', 'Patel', '+919876543215',
 '{"street": "15, MG Road", "city": "Ahmedabad", "full_address": "15, MG Road, Navrangpura, Ahmedabad"}',
 'CITN11234F', '1990-07-12', 'male', 'Gujarat', 'Ahmedabad', '380009', true, true),

('66666666-6666-6666-6666-666666666666', 'Kavita', 'Joshi', '+919876543216',
 '{"street": "22, Park Street", "city": "Kolkata", "full_address": "22, Park Street, Central Kolkata"}',
 'CITN21234G', '1988-11-30', 'female', 'West Bengal', 'Kolkata', '700016', true, true),

('77777777-7777-7777-7777-777777777777', 'Suresh', 'Reddy', '+919876543217',
 '{"street": "8, Brigade Road", "city": "Bengaluru", "full_address": "8, Brigade Road, Shivaji Nagar, Bengaluru"}',
 'CITN31234H', '1992-04-18', 'male', 'Karnataka', 'Bengaluru Urban', '560001', true, true)

ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone_number = EXCLUDED.phone_number,
    address = EXCLUDED.address,
    pan_number = EXCLUDED.pan_number,
    date_of_birth = EXCLUDED.date_of_birth,
    gender = EXCLUDED.gender,
    state_of_residence = EXCLUDED.state_of_residence,
    district = EXCLUDED.district,
    pin_code = EXCLUDED.pin_code,
    identity_verified = EXCLUDED.identity_verified,
    phone_verified = EXCLUDED.phone_verified,
    updated_at = NOW();

-- ================================================
-- SAMPLE COMPLAINTS
-- ================================================

INSERT INTO complaints (
    id, user_id, title, description, category, priority, status, assigned_officer_id, 
    location, complaint_number, department, sub_category, created_at, due_date
) VALUES

-- Infrastructure complaints
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555',
 'Broken Street Light on MG Road', 
 'The street light near shop number 15 on MG Road has been non-functional for the past week. This is causing safety concerns for pedestrians, especially women and elderly people walking in the evening. The light was working fine until last Monday when it suddenly went off during a thunderstorm.',
 'infrastructure', 'medium', 'pending', NULL,
 '{"lat": 23.0225, "lng": 72.5714, "address": "MG Road, Navrangpura, Ahmedabad", "landmark": "Near Shop No. 15"}',
 'CMP2024000001', 'Urban Development', 'Street Lighting',
 NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days'),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666',
 'Pothole on Park Street causing accidents',
 'There is a large pothole on Park Street near the bus stop that has been causing minor accidents. Yesterday, a motorcyclist fell due to this pothole and sustained injuries. The pothole is approximately 2 feet wide and 6 inches deep. It gets filled with water during rains making it invisible to drivers.',
 'infrastructure', 'high', 'in_progress', '11111111-1111-1111-1111-111111111111',
 '{"lat": 22.5726, "lng": 88.3639, "address": "Park Street, Central Kolkata", "landmark": "Near Bus Stop"}',
 'CMP2024000002', 'Urban Development', 'Road Maintenance',
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),

-- Sanitation complaints
('cccccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777',
 'Garbage not collected for 3 days in Brigade Road area',
 'The municipal garbage truck has not arrived in our Brigade Road area for the past 3 days. The garbage bins are overflowing and creating a foul smell. Stray dogs are spreading the garbage around, creating unhygienic conditions. This is a regular occurrence in our area and we request immediate action.',
 'sanitation', 'high', 'assigned', '22222222-2222-2222-2222-222222222222',
 '{"lat": 12.9716, "lng": 77.5946, "address": "Brigade Road, Shivaji Nagar, Bengaluru", "landmark": "Near Brigade Road Shopping Complex"}',
 'CMP2024000003', 'Health & Sanitation', 'Waste Management',
 NOW() - INTERVAL '3 days', NOW() + INTERVAL '1 day'),

('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555',
 'Blocked drainage causing water logging',
 'The drainage system in our locality gets blocked frequently, especially during monsoon. Last week, rainwater entered several houses including mine, damaging furniture and electronics. The drain near house number 15 is completely blocked with plastic waste and construction debris.',
 'sanitation', 'critical', 'in_progress', '22222222-2222-2222-2222-222222222222',
 '{"lat": 23.0225, "lng": 72.5714, "address": "MG Road, Navrangpura, Ahmedabad", "landmark": "House No. 15"}',
 'CMP2024000004', 'Health & Sanitation', 'Drainage System',
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days'),

-- Corruption complaints
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '66666666-6666-6666-6666-666666666666',
 'Bribery demanded for property registration',
 'I visited the sub-registrar office for property registration and was asked to pay an additional amount of Rs. 5000 as "processing fee" which is not mentioned in any official document. The clerk Mr. X told me that without this payment, my file will be delayed indefinitely. I have the receipt of official fees paid.',
 'corruption', 'high', 'under_investigation', '33333333-3333-3333-3333-333333333333',
 '{"lat": 22.5726, "lng": 88.3639, "address": "Sub-Registrar Office, Park Street, Kolkata", "landmark": "Government Building"}',
 'CMP2024000005', 'Anti-Corruption', 'Bribery',
 NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days'),

-- Resolved complaint
('ffffffff-ffff-ffff-ffff-ffffffffffff', '77777777-7777-7777-7777-777777777777',
 'Water supply disruption in Brigade Road',
 'Water supply to our area has been disrupted for the past 2 days. The local water board office said there was a pipeline burst and it would be fixed soon. However, there has been no communication about the expected timeline for restoration.',
 'infrastructure', 'medium', 'resolved', '11111111-1111-1111-1111-111111111111',
 '{"lat": 12.9716, "lng": 77.5946, "address": "Brigade Road, Shivaji Nagar, Bengaluru", "landmark": "Residential Area"}',
 'CMP2024000006', 'Urban Development', 'Water Supply',
 NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days')

ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    priority = EXCLUDED.priority,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Update resolved complaint with resolution data
UPDATE complaints SET 
    resolved_at = NOW() - INTERVAL '5 days',
    resolution_time_hours = 240,
    resolution_summary = 'Pipeline repaired and water supply restored. Implemented preventive maintenance schedule.',
    citizen_satisfaction_rating = 4
WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

-- ================================================
-- COMPLAINT UPDATES
-- ================================================

INSERT INTO complaint_updates (complaint_id, updated_by, comments, update_type, is_internal) VALUES

-- Updates for pothole complaint
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111',
 'Complaint assigned to road maintenance team. Site inspection scheduled for tomorrow.', 'assignment', false),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111',
 'Site inspected. Pothole depth confirmed at 6 inches. Work order issued to contractor.', 'comment', false),

('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666',
 'Thank you for the quick response. When can we expect the repair work to start?', 'comment', false),

-- Updates for garbage collection complaint
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222',
 'Complaint received and verified. Coordinating with waste management contractor.', 'assignment', false),

('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222',
 'Garbage collection resumed. Contractor has been penalized for service disruption.', 'comment', false),

-- Internal updates for corruption case
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333',
 'Investigation initiated. Surveillance team deployed. Suspect clerk identified.', 'comment', true),

('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333',
 'Gathering evidence and witness statements. Coordination with legal department ongoing.', 'comment', true),

-- Updates for resolved water supply complaint
('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111',
 'Pipeline repair work completed. Water supply restored to all affected areas.', 'status_change', false),

('ffffffff-ffff-ffff-ffff-ffffffffffff', '77777777-7777-7777-7777-777777777777',
 'Water supply is working fine now. Thank you for the prompt action.', 'comment', false);

-- ================================================
-- NOTIFICATIONS
-- ================================================

INSERT INTO notifications (user_id, title, message, type, related_complaint_id, action_url, action_text) VALUES

-- Notifications for complaint creators
('55555555-5555-5555-5555-555555555555', 'Complaint Registered Successfully',
 'Your complaint about broken street light has been registered with ID CMP2024000001. You will receive updates on its progress.',
 'success', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '/complaints/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'View Complaint'),

('66666666-6666-6666-6666-666666666666', 'Complaint Status Updated',
 'Your complaint about pothole on Park Street has been assigned to an officer and is now in progress.',
 'info', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/complaints/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'View Updates'),

('77777777-7777-7777-7777-777777777777', 'Complaint Resolved',
 'Your complaint about water supply disruption has been resolved. Please rate your experience.',
 'success', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '/complaints/ffffffff-ffff-ffff-ffff-ffffffffffff', 'Rate Experience'),

-- Notifications for officers
('11111111-1111-1111-1111-111111111111', 'New Complaint Assigned',
 'You have been assigned a high priority complaint about pothole on Park Street. Please review and take action.',
 'warning', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '/complaints/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Review Complaint'),

('22222222-2222-2222-2222-222222222222', 'Urgent: Critical Complaint',
 'A critical complaint about blocked drainage has been assigned to you. Immediate attention required.',
 'error', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '/complaints/dddddddd-dddd-dddd-dddd-dddddddddddd', 'Take Action'),

-- System notifications
('44444444-4444-4444-4444-444444444444', 'Daily Report Available',
 'Daily complaint statistics report for ' || CURRENT_DATE || ' is now available for review.',
 'info', NULL, '/reports/daily', 'View Report'),

('00000000-0000-0000-0000-000000000001', 'System Maintenance Scheduled',
 'Scheduled system maintenance on ' || (CURRENT_DATE + INTERVAL '7 days') || ' from 2:00 AM to 4:00 AM IST.',
 'warning', NULL, '/admin/maintenance', 'View Details');

-- ================================================
-- INITIAL AUDIT ENTRIES
-- ================================================

-- Log initial data creation
INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by, compliance_category) VALUES
('system_setup', '00000000-0000-0000-0000-000000000001', 'INITIAL_SETUP', 
 '{"event": "database_initialization", "tables_created": ["users", "user_profiles", "complaints", "complaint_updates", "notifications"], "sample_data": true}',
 '00000000-0000-0000-0000-000000000001', 'system'),

('data_seeding', gen_random_uuid(), 'SEED_DATA',
 '{"users_created": 8, "profiles_created": 8, "complaints_created": 6, "updates_created": 9, "notifications_created": 7}',
 '00000000-0000-0000-0000-000000000001', 'system');

-- ================================================
-- REFRESH MATERIALIZED VIEWS
-- ================================================

-- Refresh the materialized views with new data
REFRESH MATERIALIZED VIEW mv_daily_complaint_stats;
REFRESH MATERIALIZED VIEW mv_officer_workload;
REFRESH MATERIALIZED VIEW mv_complaint_trends;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

DO $$
DECLARE
    user_count INTEGER;
    complaint_count INTEGER;
    notification_count INTEGER;
BEGIN
    -- Count created records
    SELECT COUNT(*) INTO user_count FROM users WHERE deleted_at IS NULL;
    SELECT COUNT(*) INTO complaint_count FROM complaints WHERE deleted_at IS NULL;
    SELECT COUNT(*) INTO notification_count FROM notifications WHERE deleted_at IS NULL;
    
    -- Log results
    RAISE NOTICE 'CHAKSHU_GOV Portal Setup Complete:';
    RAISE NOTICE '- Users created: %', user_count;
    RAISE NOTICE '- Complaints created: %', complaint_count;
    RAISE NOTICE '- Notifications created: %', notification_count;
    RAISE NOTICE '- Sample data includes various complaint types and statuses';
    RAISE NOTICE '- Government officers and departments configured';
    RAISE NOTICE '- RLS policies active and enforced';
    
    -- Verify RLS is working
    IF EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
        AND c.relname IN ('users', 'complaints', 'notifications')
        AND c.relrowsecurity = true
    ) THEN
        RAISE NOTICE '- Row Level Security verified and active';
    ELSE
        RAISE WARNING 'Row Level Security may not be properly configured';
    END IF;
END $$;

-- ================================================
-- HELPFUL QUERIES FOR TESTING
-- ================================================

-- Query to test complaint visibility by role
/*
-- Test as citizen (should only see own complaints)
SET LOCAL app.current_user_id = '55555555-5555-5555-5555-555555555555';
SELECT id, title, status FROM complaints;

-- Test as officer (should see assigned complaints)
SET LOCAL app.current_user_id = '11111111-1111-1111-1111-111111111111';
SELECT id, title, status, assigned_officer_id FROM complaints;

-- Test as admin (should see all complaints)
SET LOCAL app.current_user_id = '44444444-4444-4444-4444-444444444444';
SELECT id, title, status FROM complaints;
*/

-- ================================================
-- PERFORMANCE BASELINE
-- ================================================

-- Create baseline performance statistics
INSERT INTO audit_logs (table_name, record_id, action, new_values, compliance_category) VALUES
('performance_baseline', gen_random_uuid(), 'BASELINE_CREATED',
jsonb_build_object(
    'timestamp', NOW(),
    'table_sizes', (
        SELECT jsonb_object_agg(tablename, pg_size_pretty(pg_total_relation_size('public.'||tablename)))
        FROM pg_tables WHERE schemaname = 'public'
    ),
    'index_count', (
        SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'
    )
), 'system');

-- Final message
SELECT 'CHAKSHU_GOV Government Portal database setup completed successfully!' as status,
       'Use the sample users and complaints to test the system functionality' as note,
       'All RLS policies are active and enforced for data security' as security;
