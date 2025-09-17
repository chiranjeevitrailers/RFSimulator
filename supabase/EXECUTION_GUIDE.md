# 🚀 5GLabX Platform - SQL Execution Guide

## ⚠️ **IMPORTANT: Trigger Error Fix**

You encountered this error:
```
ERROR: 42710: trigger "update_users_updated_at" for relation "users" already exists
```

This happens when SQL files are run out of order or some objects already exist in your database.

## 🛠️ **Solution Options**

### **Option 1: Quick Fix (Recommended)**
Use the fixed version that handles existing objects gracefully:

```sql
-- Run this single file instead of the original
/workspace/supabase/complete_database_setup_fixed.sql
```

**Key improvements in the fixed version:**
- Uses `DROP TRIGGER IF EXISTS` before creating triggers
- Uses `DROP POLICY IF EXISTS` before creating policies  
- Uses `CREATE OR REPLACE FUNCTION` for functions
- Uses `CREATE TABLE IF NOT EXISTS` for tables
- Handles all conflicts gracefully

### **Option 2: Clean Reset (If you want to start fresh)**
1. **First, reset the database:**
```sql
-- WARNING: This deletes ALL data!
/workspace/supabase/reset_database.sql
```

2. **Then run the setup:**
```sql
/workspace/supabase/complete_database_setup_fixed.sql
```

### **Option 3: Minimal Core Setup**
If you just want the essential tables:

```sql
-- Core schema only
/workspace/supabase/01_core_platform_schema.sql

-- ML system (optional)
/workspace/supabase/02_ml_system_schema.sql

-- Test data (optional)
/workspace/supabase/03_comprehensive_test_data.sql
/workspace/supabase/04_seed_data.sql
```

## 📋 **Complete Execution Order (All 70 Files)**

If you want to run all files systematically:

### **Phase 1: Reset & Core Setup**
```bash
# 1. Clean slate (optional)
psql -f /workspace/supabase/reset_database.sql

# 2. Core platform
psql -f /workspace/supabase/01_core_platform_schema.sql
psql -f /workspace/supabase/02_ml_system_schema.sql
```

### **Phase 2: Enhanced Schemas**
```bash
# 3. Enhanced schemas
psql -f /workspace/supabase/testing_platform_schema.sql
psql -f /workspace/supabase/enhanced_testing_platform_schema.sql
psql -f /workspace/supabase/complete_detailed_database_setup.sql
```

### **Phase 3: Migration Files (38 files)**
```bash
# Core migrations
psql -f /workspace/supabase/migrations/001_initial_schema.sql
psql -f /workspace/supabase/migrations/001_complete_platform_schema.sql
psql -f /workspace/supabase/migrations/002_test_cases_enhanced.sql
psql -f /workspace/supabase/migrations/002_test_cases_enhanced_fixed.sql

# Security & monitoring
psql -f /workspace/supabase/migrations/003_security_tables.sql
psql -f /workspace/supabase/migrations/004_monitoring_tables.sql
psql -f /workspace/supabase/migrations/005_alert_management_tables.sql
psql -f /workspace/supabase/migrations/006_backup_system_tables.sql
psql -f /workspace/supabase/migrations/007_load_testing_tables.sql
psql -f /workspace/supabase/migrations/008_deployment_system_tables.sql

# Test configuration
psql -f /workspace/supabase/migrations/010_test_configuration_tables.sql
psql -f /workspace/supabase/migrations/011_test_suites_enhancements.sql
psql -f /workspace/supabase/migrations/012_decoded_messages_schema.sql
psql -f /workspace/supabase/migrations/013_fix_missing_columns_and_improvements.sql
psql -f /workspace/supabase/migrations/014_comprehensive_seed_data_setup.sql
psql -f /workspace/supabase/migrations/015_final_database_optimization.sql
psql -f /workspace/supabase/migrations/016_missing_tables_and_functions.sql
psql -f /workspace/supabase/migrations/017_missing_indexes.sql
psql -f /workspace/supabase/migrations/018_final_realtime_indexes.sql
psql -f /workspace/supabase/migrations/019_enhanced_test_execution_flow.sql

# 1000 test cases
psql -f /workspace/supabase/migrations/020_comprehensive_1000_test_cases_database.sql
psql -f /workspace/supabase/migrations/021_comprehensive_1000_test_cases_seed_data.sql

# 3GPP compliance
psql -f /workspace/supabase/migrations/008_comprehensive_3gpp_ies.sql
psql -f /workspace/supabase/migrations/009_complete_3gpp_message_flows.sql

# Protocol-specific test cases (14 files)
psql -f /workspace/supabase/migrations/022_volte_vonr_conference_ims_flows.sql
psql -f /workspace/supabase/migrations/023_volte_vonr_conference_ims_test_cases.sql
psql -f /workspace/supabase/migrations/024_detailed_5g_nr_initial_access_test_cases.sql
psql -f /workspace/supabase/migrations/025_detailed_5g_nr_handover_test_cases.sql
psql -f /workspace/supabase/migrations/026_detailed_5g_nr_pdu_session_test_cases.sql
psql -f /workspace/supabase/migrations/027_detailed_5g_nr_mobility_test_cases.sql
psql -f /workspace/supabase/migrations/028_detailed_5g_nr_security_test_cases.sql
psql -f /workspace/supabase/migrations/029_detailed_5g_nr_measurement_test_cases.sql
psql -f /workspace/supabase/migrations/030_detailed_5g_nr_power_control_test_cases.sql
psql -f /workspace/supabase/migrations/031_detailed_5g_nr_scheduling_test_cases.sql
psql -f /workspace/supabase/migrations/032_detailed_lte_initial_access_test_cases.sql
psql -f /workspace/supabase/migrations/033_detailed_lte_handover_test_cases.sql
psql -f /workspace/supabase/migrations/034_detailed_lte_bearer_management_test_cases.sql
psql -f /workspace/supabase/migrations/035_detailed_lte_mobility_test_cases.sql
psql -f /workspace/supabase/migrations/036_detailed_lte_security_test_cases.sql
psql -f /workspace/supabase/migrations/037_detailed_lte_measurement_test_cases.sql
```

### **Phase 4: Seed Data (13 files)**
```bash
# Configuration seed data
psql -f /workspace/supabase/migrations/002_subscription_plans_seed.sql
psql -f /workspace/supabase/migrations/003_comprehensive_test_cases_seed.sql
psql -f /workspace/supabase/migrations/004_default_configurations_seed.sql
psql -f /workspace/supabase/migrations/005_documentation_tutorials_seed.sql
psql -f /workspace/supabase/migrations/006_comprehensive_1000_test_cases.sql
psql -f /workspace/supabase/migrations/007_remaining_protocols_test_cases.sql

# Main seed files
psql -f /workspace/supabase/03_comprehensive_test_data.sql
psql -f /workspace/supabase/04_seed_data.sql
psql -f /workspace/supabase/seed.sql
psql -f /workspace/supabase/seed_test_cases.sql
psql -f /workspace/supabase/seed_3gpp_compliant_test_cases.sql
psql -f /workspace/supabase/seed_5g_nr_test_cases.sql
psql -f /workspace/supabase/seed_4g_lte_test_cases.sql
psql -f /workspace/supabase/seed_detailed_test_cases.sql
psql -f /workspace/supabase/seed_ims_sip_test_cases.sql
psql -f /workspace/supabase/seed_oran_test_cases.sql
psql -f /workspace/supabase/seed_nbiot_v2x_ntn_test_cases.sql
```

## ✅ **Verification Commands**

After running the setup, verify everything works:

```sql
-- Check table count
SELECT COUNT(*) as table_count 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check test cases
SELECT COUNT(*) as test_case_count FROM test_cases;

-- Check admin user
SELECT email, role, subscription_tier 
FROM users 
WHERE role = 'admin';

-- Check RLS policies
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 🎯 **Expected Results**

After successful execution:
- **11+ core tables** created
- **1000+ test cases** with complete 3GPP compliance
- **Admin user** created (admin@5glabx.com)
- **RLS policies** properly configured
- **Performance indexes** optimized
- **ML system** ready for analytics

## 🚨 **Common Issues & Solutions**

### **Issue: "relation already exists"**
**Solution:** Use the fixed version with `IF NOT EXISTS` clauses

### **Issue: "trigger already exists"**  
**Solution:** Use the fixed version with `DROP TRIGGER IF EXISTS`

### **Issue: "policy already exists"**
**Solution:** Use the fixed version with `DROP POLICY IF EXISTS`

### **Issue: Foreign key constraint errors**
**Solution:** Run the reset script first, then the setup script

## 🚀 **Quick Start (Recommended)**

For most users, just run this:

```bash
# Option 1: Fixed version (handles conflicts)
psql -f /workspace/supabase/complete_database_setup_fixed.sql

# Option 2: If you want comprehensive data
psql -f /workspace/supabase/01_core_platform_schema.sql
psql -f /workspace/supabase/02_ml_system_schema.sql
psql -f /workspace/supabase/03_comprehensive_test_data.sql
psql -f /workspace/supabase/04_seed_data.sql
```

That's it! Your 5GLabX Platform database is ready for production! 🎉