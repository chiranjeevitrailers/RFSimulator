-- ==============================================
-- 5GLabX Platform - Database Reset Script
-- Use this to clean up existing database before fresh installation
-- ==============================================

-- WARNING: This will delete ALL data in the database!
-- Only run this if you want to start completely fresh

-- ==============================================
-- 1. DROP ALL POLICIES (to avoid dependency issues)
-- ==============================================

-- Drop all RLS policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename);
    END LOOP;
    RAISE NOTICE '✅ All RLS policies dropped';
END $$;

-- ==============================================
-- 2. DROP ALL TRIGGERS
-- ==============================================

-- Drop all triggers
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table 
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
        AND trigger_name NOT LIKE 'RI_%'  -- Skip foreign key triggers
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', 
            trigger_record.trigger_name, 
            trigger_record.event_object_table);
    END LOOP;
    RAISE NOTICE '✅ All triggers dropped';
END $$;

-- ==============================================
-- 3. DROP ALL FUNCTIONS
-- ==============================================

-- Drop custom functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_test_case_id(text, text) CASCADE;
DROP FUNCTION IF EXISTS get_test_case_stats(uuid) CASCADE;
DROP FUNCTION IF EXISTS cleanup_expired_sessions() CASCADE;
DROP FUNCTION IF EXISTS get_security_metrics() CASCADE;

RAISE NOTICE '✅ All functions dropped';

-- ==============================================
-- 4. DROP ALL TABLES (in reverse dependency order)
-- ==============================================

-- Drop tables in correct order to avoid foreign key constraint errors
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS alert_rules CASCADE;
DROP TABLE IF EXISTS system_metrics CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS audit_events CASCADE;
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS test_case_results CASCADE;
DROP TABLE IF EXISTS test_case_executions CASCADE;
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS test_cases CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any additional tables that might exist
DROP TABLE IF EXISTS test_case_messages CASCADE;
DROP TABLE IF EXISTS test_case_information_elements CASCADE;
DROP TABLE IF EXISTS test_case_layer_parameters CASCADE;
DROP TABLE IF EXISTS information_elements CASCADE;
DROP TABLE IF EXISTS layer_parameters CASCADE;
DROP TABLE IF EXISTS test_messages CASCADE;
DROP TABLE IF EXISTS test_execution_results CASCADE;
DROP TABLE IF EXISTS test_execution_logs CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS test_executions CASCADE;
DROP TABLE IF EXISTS execution_logs CASCADE;
DROP TABLE IF EXISTS performance_metrics CASCADE;
DROP TABLE IF EXISTS nsa_configurations CASCADE;
DROP TABLE IF EXISTS split_bearers CASCADE;
DROP TABLE IF EXISTS message_templates CASCADE;
DROP TABLE IF EXISTS information_element_library CASCADE;
DROP TABLE IF EXISTS test_case_categories CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS billing_history CASCADE;
DROP TABLE IF EXISTS payment_gateways CASCADE;
DROP TABLE IF EXISTS tax_settings CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS user_access_logs CASCADE;
DROP TABLE IF EXISTS user_restrictions CASCADE;
DROP TABLE IF EXISTS test_execution_logs CASCADE;

-- Drop ML tables
DROP TABLE IF EXISTS ml_execution_events CASCADE;
DROP TABLE IF EXISTS ml_execution_features CASCADE;
DROP TABLE IF EXISTS ml_execution_labels CASCADE;
DROP TABLE IF EXISTS ml_model_registry CASCADE;
DROP TABLE IF EXISTS ml_recommendations CASCADE;

RAISE NOTICE '✅ All tables dropped';

-- ==============================================
-- 5. DROP ALL VIEWS
-- ==============================================

-- Drop any views that might exist
DROP VIEW IF EXISTS test_case_summary CASCADE;
DROP VIEW IF EXISTS test_execution_summary CASCADE;
DROP VIEW IF EXISTS nsa_test_summary CASCADE;

RAISE NOTICE '✅ All views dropped';

-- ==============================================
-- 6. DROP ALL SEQUENCES (if any custom ones exist)
-- ==============================================

-- PostgreSQL will automatically drop sequences when tables are dropped
-- This is just to be thorough
DO $$
DECLARE
    seq_record RECORD;
BEGIN
    FOR seq_record IN 
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
        AND sequence_name NOT LIKE '%_id_seq'  -- Keep auto-generated sequences
    LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS %I CASCADE', seq_record.sequence_name);
    END LOOP;
    RAISE NOTICE '✅ Custom sequences dropped';
END $$;

-- ==============================================
-- 7. DROP ALL TYPES (if any custom ones exist)
-- ==============================================

-- Drop any custom types that might have been created
DO $$
DECLARE
    type_record RECORD;
BEGIN
    FOR type_record IN 
        SELECT typname 
        FROM pg_type 
        WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        AND typtype = 'e'  -- enum types
    LOOP
        EXECUTE format('DROP TYPE IF EXISTS %I CASCADE', type_record.typname);
    END LOOP;
    RAISE NOTICE '✅ Custom types dropped';
END $$;

-- ==============================================
-- 8. VERIFICATION
-- ==============================================

-- Verify cleanup
DO $$
DECLARE
    table_count INTEGER;
    function_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Count remaining tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public';
    
    -- Count remaining functions
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public'
    AND routine_type = 'FUNCTION';
    
    -- Count remaining policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    RAISE NOTICE '📊 Cleanup Summary:';
    RAISE NOTICE '   Tables remaining: %', table_count;
    RAISE NOTICE '   Functions remaining: %', function_count;
    RAISE NOTICE '   Policies remaining: %', policy_count;
    
    IF table_count = 0 AND function_count = 0 AND policy_count = 0 THEN
        RAISE NOTICE '✅ Database completely cleaned!';
        RAISE NOTICE '🚀 Ready for fresh installation';
    ELSE
        RAISE NOTICE '⚠️  Some objects may still exist';
    END IF;
END $$;

-- Final message
RAISE NOTICE '🎯 Database reset completed!';
RAISE NOTICE '📋 Next step: Run complete_database_setup_fixed.sql for fresh installation';