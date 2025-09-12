# 🗄️ 5GLabX Platform - Supabase SQL Deployment List

## 📋 Complete SQL Files to Run in Supabase

This document provides the complete list of SQL files that need to be executed in Supabase to set up the 5GLabX Platform database.

## 🚀 Deployment Order

Execute the SQL files in the following order to ensure proper dependencies and relationships:

### 1. **Core Schema Migration**
```sql
-- File: supabase/migrations/001_initial_schema.sql
```
**Purpose**: Creates the foundational tables and basic structure
- ✅ `users` table with roles and subscriptions
- ✅ `test_cases` table with basic test case structure
- ✅ `test_executions` table for tracking test runs
- ✅ `user_activities` table for audit logging
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Default admin user

### 2. **Enhanced Test Cases Migration**
```sql
-- File: supabase/migrations/002_test_cases_enhanced.sql
```
**Purpose**: Extends test cases with comprehensive 3GPP protocol support
- ✅ Enhanced `test_cases` table with additional fields
- ✅ `test_case_executions` table for detailed execution tracking
- ✅ `test_case_results` table for step-by-step results
- ✅ `test_case_templates` table for reusable patterns
- ✅ `test_case_libraries` table for organization
- ✅ Advanced RLS policies
- ✅ Helper functions for test case management

### 3. **Security & Audit Migration**
```sql
-- File: supabase/migrations/003_security_tables.sql
```
**Purpose**: Implements comprehensive security and audit logging
- ✅ `security_events` table for security monitoring
- ✅ `audit_events` table for compliance tracking
- ✅ `compliance_reports` table for regulatory compliance
- ✅ `blocked_ips` table for IP blocking
- ✅ `user_sessions` table for session management
- ✅ `security_policies` table for policy management
- ✅ `security_violations` table for violation tracking
- ✅ Default security policies
- ✅ Security helper functions

### 4. **Monitoring & Alerting Migration**
```sql
-- File: supabase/migrations/004_monitoring_tables.sql
```
**Purpose**: Sets up system monitoring and alerting infrastructure
- ✅ `system_metrics` table for system performance
- ✅ `alert_rules` table for alert configuration
- ✅ `alerts` table for active alerts
- ✅ `health_checks` table for service health
- ✅ `notification_channels` table for alert delivery
- ✅ Monitoring helper functions

### 5. **Alert Management Migration**
```sql
-- File: supabase/migrations/005_alert_management_tables.sql
```
**Purpose**: Advanced alert management and escalation
- ✅ `alert_templates` table for alert formatting
- ✅ `alert_escalations` table for escalation rules
- ✅ `alert_suppressions` table for alert filtering
- ✅ `alert_correlations` table for related alerts
- ✅ Alert management functions

### 6. **Backup System Migration**
```sql
-- File: supabase/migrations/006_backup_system_tables.sql
```
**Purpose**: Database backup and disaster recovery
- ✅ `backup_jobs` table for backup scheduling
- ✅ `backup_history` table for backup tracking
- ✅ `disaster_recovery_plans` table for DR planning
- ✅ `backup_verification` table for backup validation
- ✅ Backup management functions

### 7. **Load Testing Migration**
```sql
-- File: supabase/migrations/007_load_testing_tables.sql
```
**Purpose**: Load testing and performance analysis
- ✅ `load_test_scenarios` table for test scenarios
- ✅ `load_test_executions` table for test runs
- ✅ `load_test_results` table for performance data
- ✅ `performance_baselines` table for comparison
- ✅ Load testing functions

### 8. **Deployment System Migration**
```sql
-- File: supabase/migrations/008_deployment_system_tables.sql
```
**Purpose**: Deployment management and CI/CD tracking
- ✅ `deployment_pipelines` table for pipeline config
- ✅ `deployment_runs` table for deployment tracking
- ✅ `deployment_artifacts` table for artifact management
- ✅ `deployment_environments` table for environment config
- ✅ Deployment management functions

## 🌱 Data Seeding

After running the migrations, execute the seed files to populate the database with initial data:

### 9. **3GPP Compliant Test Cases**
```sql
-- File: supabase/seed_3gpp_compliant_test_cases.sql
```
**Purpose**: Seeds the database with 3GPP-compliant test cases
- ✅ 1000+ test cases with proper 3GPP IEs
- ✅ Message flows with realistic data
- ✅ Layer configurations per 3GPP standards
- ✅ Performance metrics and validation rules

### 10. **Additional Test Case Categories**
```sql
-- File: supabase/seed_4g_lte_test_cases.sql
-- File: supabase/seed_5g_nr_test_cases.sql
-- File: supabase/seed_ims_sip_test_cases.sql
-- File: supabase/seed_nbiot_v2x_ntn_test_cases.sql
-- File: supabase/seed_oran_test_cases.sql
```
**Purpose**: Category-specific test cases for different protocols

### 11. **General Test Cases**
```sql
-- File: supabase/seed_test_cases.sql
-- File: supabase/seed.sql
```
**Purpose**: General test cases and system data

## 🔧 Supabase CLI Commands

### Option 1: Using Supabase CLI (Recommended)
```bash
# Initialize Supabase project
supabase init

# Start local development
supabase start

# Apply all migrations
supabase db reset

# Apply specific migration
supabase migration up

# Seed the database
supabase db seed
```

### Option 2: Manual SQL Execution
```bash
# Connect to your Supabase project
supabase db connect

# Execute migrations in order
\i supabase/migrations/001_initial_schema.sql
\i supabase/migrations/002_test_cases_enhanced.sql
\i supabase/migrations/003_security_tables.sql
\i supabase/migrations/004_monitoring_tables.sql
\i supabase/migrations/005_alert_management_tables.sql
\i supabase/migrations/006_backup_system_tables.sql
\i supabase/migrations/007_load_testing_tables.sql
\i supabase/migrations/008_deployment_system_tables.sql

# Execute seed files
\i supabase/seed_3gpp_compliant_test_cases.sql
\i supabase/seed_4g_lte_test_cases.sql
\i supabase/seed_5g_nr_test_cases.sql
\i supabase/seed_ims_sip_test_cases.sql
\i supabase/seed_nbiot_v2x_ntn_test_cases.sql
\i supabase/seed_oran_test_cases.sql
\i supabase/seed_test_cases.sql
\i supabase/seed.sql
```

## 📊 Database Schema Overview

### Core Tables
- **users**: User management with roles and subscriptions
- **test_cases**: 3GPP-compliant test case definitions
- **test_case_executions**: Test execution tracking
- **test_case_results**: Detailed test results
- **user_activities**: User activity audit logs

### Security Tables
- **security_events**: Security event logging
- **audit_events**: Comprehensive audit trail
- **compliance_reports**: Regulatory compliance tracking
- **blocked_ips**: IP blocking management
- **user_sessions**: Session management
- **security_policies**: Security policy configuration

### Monitoring Tables
- **system_metrics**: System performance metrics
- **alert_rules**: Alert configuration
- **alerts**: Active alert management
- **health_checks**: Service health monitoring
- **notification_channels**: Alert delivery channels

### Advanced Features
- **backup_jobs**: Backup scheduling and management
- **load_test_scenarios**: Load testing configuration
- **deployment_pipelines**: CI/CD pipeline management
- **test_case_templates**: Reusable test patterns
- **test_case_libraries**: Test case organization

## 🔒 Security Features

### Row Level Security (RLS)
- ✅ All tables have RLS enabled
- ✅ User-specific data access policies
- ✅ Admin override policies
- ✅ Service role policies for system operations

### Data Protection
- ✅ Encrypted sensitive data
- ✅ Audit logging for all operations
- ✅ IP blocking capabilities
- ✅ Session management
- ✅ Compliance reporting

## 📈 Performance Optimizations

### Indexes
- ✅ Primary key indexes
- ✅ Foreign key indexes
- ✅ Query optimization indexes
- ✅ GIN indexes for JSONB fields
- ✅ Composite indexes for complex queries

### Functions
- ✅ Automated timestamp updates
- ✅ Test case statistics calculation
- ✅ Security metrics aggregation
- ✅ Audit statistics generation
- ✅ Cleanup functions for expired data

## 🚀 Post-Deployment Verification

After running all SQL files, verify the setup:

```sql
-- Check table creation
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check test case count
SELECT COUNT(*) as total_test_cases FROM test_cases;

-- Check admin user
SELECT email, role, subscription_tier FROM users WHERE role = 'admin';

-- Check security policies
SELECT name, policy_type, is_active FROM security_policies;
```

## 🔧 Environment Variables

After database setup, configure these environment variables in your application:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📚 Additional Resources

- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Row Level Security Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Database Functions**: https://supabase.com/docs/guides/database/functions

---

**🎉 Ready for Production!** Your 5GLabX Platform database is now fully configured with comprehensive security, monitoring, and 3GPP-compliant test case management.