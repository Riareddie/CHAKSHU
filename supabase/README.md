# CHAKSHU_GOV Government Portal Database Schema

This directory contains the complete database schema and setup for the CHAKSHU Government Portal, a comprehensive citizen complaint management system built with Supabase.

## 🏛️ **Government-Grade Database Architecture**

### **Overview**

The CHAKSHU_GOV portal database is designed with government-grade security, compliance, and audit requirements. It provides a robust foundation for citizen services, complaint management, and administrative oversight.

### **Key Features**

- ✅ Row Level Security (RLS) for data protection
- ✅ Comprehensive audit trails for compliance
- ✅ Government ID validation (Aadhaar, PAN)
- ✅ Multi-role access control (Citizen, Officer, Admin, Super Admin)
- ✅ Performance optimized with advanced indexing
- ✅ Soft delete for data retention compliance
- ✅ Real-time notifications and updates
- ✅ Materialized views for reporting

## 📋 **Database Schema**

### **Core Tables**

#### 1. **users** - Authentication & Basic Profile

```sql
- id (UUID, Primary Key)
- email (Unique, Not Null)
- role (enum: citizen, officer, admin, super_admin)
- profile_data (JSONB)
- created_at, updated_at (Timestamps)
- is_active (Boolean)
- last_login (Timestamp)
- email_verified (Boolean)
- Soft delete support
- Government compliance fields
```

#### 2. **user_profiles** - Detailed User Information

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- first_name, last_name (Text)
- phone_number (Text with validation)
- address (JSONB)
- aadhaar_number (Encrypted Text)
- pan_number (Text with format validation)
- date_of_birth (Date)
- gender (enum)
- Government-specific fields (state, district, pin_code)
- Verification status tracking
```

#### 3. **complaints** - Main Complaint Management

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- title (Text, Not Null)
- description (Text)
- category (enum: infrastructure, sanitation, corruption, cyber_fraud, other)
- priority (enum: low, medium, high, critical)
- status (enum: pending, in_progress, resolved, closed, rejected)
- assigned_officer_id (UUID, Foreign Key)
- location (JSONB with lat/lng)
- attachments (JSONB array)
- Government tracking fields
- Resolution tracking
- Escalation support
```

#### 4. **complaint_updates** - Activity Tracking

```sql
- id (UUID, Primary Key)
- complaint_id (UUID, Foreign Key)
- updated_by (UUID, Foreign Key)
- status_change (Text)
- comments (Text)
- update_type (Text)
- Audit fields (IP, User Agent)
```

#### 5. **notifications** - User Communication

```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- title, message (Text)
- type (enum: info, warning, success, error, system)
- is_read (Boolean)
- Action URL and metadata
- Delivery tracking
```

#### 6. **audit_logs** - Government Compliance

```sql
- Complete audit trail for all changes
- Government compliance categorization
- 7-year retention policy
- Security event logging
```

## 🚀 **Setup Instructions**

### **Prerequisites**

1. Supabase project created
2. Database access (preferably with `postgres` role)
3. Supabase CLI installed (optional, for easier management)

### **Migration Order**

The migrations must be run in the following order:

```bash
1. 001_create_chakshu_gov_schema.sql    # Core schema and tables
2. 002_create_rls_policies.sql          # Row Level Security policies
3. 003_create_indexes_and_optimizations.sql  # Performance optimizations
4. 004_seed_data.sql                    # Sample data (optional)
```

### **Running Migrations**

#### **Option 1: Using Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to **Database** > **SQL Editor**
3. Copy and paste each migration file content
4. Run them in order (001 → 002 → 003 → 004)

#### **Option 2: Using Supabase CLI**

```bash
# Initialize Supabase in your project
supabase init

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

#### **Option 3: Using psql (Direct Database Access)**

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[password]@[host]:5432/postgres"

# Run each migration file
\i 001_create_chakshu_gov_schema.sql
\i 002_create_rls_policies.sql
\i 003_create_indexes_and_optimizations.sql
\i 004_seed_data.sql
```

## 🔐 **Security Features**

### **Row Level Security (RLS)**

- **Citizens**: Can only access their own data and complaints
- **Officers**: Can access assigned complaints and related data
- **Admins**: Can access all complaints and user management
- **Super Admins**: Full system access including user role management

### **Data Protection**

- Government ID encryption (Aadhaar numbers)
- Secure file attachment handling
- Audit trail for all data changes
- Soft delete for compliance with data retention

### **Access Control Matrix**

| Role        | Create Complaint | View All Complaints | Assign Complaints | Manage Users | System Config |
| ----------- | ---------------- | ------------------- | ----------------- | ------------ | ------------- |
| Citizen     | ✅ Own           | ❌                  | ❌                | ❌           | ❌            |
| Officer     | ✅               | ✅ Assigned         | ✅                | ❌           | ❌            |
| Admin       | ✅               | ✅ All              | ✅                | ✅           | ❌            |
| Super Admin | ✅               | ✅ All              | ✅                | ✅           | ✅            |

## 📊 **Sample Data**

The seed data includes:

- **1 System Administrator**
- **3 Government Officers** (different departments)
- **1 Department Admin**
- **3 Sample Citizens**
- **6 Sample Complaints** (various categories and statuses)
- **Multiple Updates and Notifications**

### **Test Users**

| Role        | Email                     | Password                | Department          |
| ----------- | ------------------------- | ----------------------- | ------------------- |
| Super Admin | admin@chakshu.gov.in      | (Set via Supabase Auth) | IT Administration   |
| Officer     | officer1@chakshu.gov.in   | (Set via Supabase Auth) | Urban Development   |
| Officer     | officer2@chakshu.gov.in   | (Set via Supabase Auth) | Health & Sanitation |
| Officer     | officer3@chakshu.gov.in   | (Set via Supabase Auth) | Anti-Corruption     |
| Admin       | admin.dept@chakshu.gov.in | (Set via Supabase Auth) | Administration      |
| Citizen     | citizen1@example.com      | (Set via Supabase Auth) | -                   |

## 🎯 **Performance Optimizations**

### **Indexing Strategy**

- **Composite indexes** for common query patterns
- **Partial indexes** for filtered queries
- **GIN indexes** for JSONB columns (location, address)
- **Full-text search** indexes for complaints and profiles
- **Specialized indexes** for government reporting

### **Materialized Views**

- `mv_daily_complaint_stats` - Daily complaint statistics
- `mv_officer_workload` - Officer workload analysis
- `mv_complaint_trends` - Weekly trend analysis

### **Query Optimization**

- Table statistics for better query planning
- Index usage monitoring
- Performance baseline tracking

## 🔧 **Maintenance Functions**

### **Automated Tasks**

```sql
-- Refresh reporting views
SELECT refresh_reporting_views();

-- Update table statistics
SELECT analyze_complaint_tables();

-- Enforce data retention policies
SELECT enforce_data_retention();

-- Get index usage statistics
SELECT * FROM get_index_usage_stats();
```

### **Monitoring Queries**

```sql
-- Check table sizes
SELECT * FROM v_table_sizes;

-- Monitor index usage
SELECT * FROM v_index_usage_summary;

-- View complaint statistics
SELECT * FROM mv_daily_complaint_stats WHERE complaint_date >= CURRENT_DATE - INTERVAL '7 days';
```

## 📋 **Government Compliance**

### **Data Retention**

- **Audit logs**: 7 years (government requirement)
- **User data**: As per privacy policy
- **Complaint data**: Permanent with soft delete
- **Session data**: 30 days

### **Audit Requirements**

- All data changes logged
- User actions tracked
- Security events recorded
- Compliance categorization
- Tamper-proof audit trail

### **Privacy & Security**

- PII encryption for sensitive data
- Access control based on government roles
- Session security with device tracking
- Data minimization principles
- Right to be forgotten (GDPR compliance)

## 🚨 **Troubleshooting**

### **Common Issues**

#### **RLS Policy Errors**

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Verify user role function
SELECT get_user_role('user-uuid-here');
```

#### **Migration Errors**

- Ensure migrations are run in correct order
- Check for existing table conflicts
- Verify permissions for creating extensions

#### **Performance Issues**

```sql
-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM complaints WHERE status = 'pending';
```

### **Support**

For technical support or questions about the database schema:

1. Check the audit logs for error details
2. Review RLS policies for access issues
3. Monitor performance statistics
4. Contact system administrators

## 📝 **Version History**

- **v1.0.0** - Initial schema with core functionality
- **v1.1.0** - Added performance optimizations and indexes
- **v1.2.0** - Enhanced RLS policies and audit features
- **v1.3.0** - Added materialized views and reporting

## 🔄 **Backup & Recovery**

### **Backup Strategy**

```bash
# Full database backup
pg_dump "postgresql://postgres:[password]@[host]:5432/postgres" > chakshu_backup.sql

# Schema-only backup
pg_dump --schema-only "postgresql://postgres:[password]@[host]:5432/postgres" > chakshu_schema.sql
```

### **Recovery Process**

1. Restore schema from backup
2. Restore data with constraints
3. Rebuild indexes and materialized views
4. Verify RLS policies
5. Test system functionality

---

**Note**: This database schema is designed for government use and includes comprehensive security, audit, and compliance features. Always test in a development environment before deploying to production.
