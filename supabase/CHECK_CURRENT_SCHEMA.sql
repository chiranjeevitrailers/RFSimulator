-- ==============================================
-- Check Current Database Schema Status
-- This will show you exactly what tables you currently have
-- ==============================================

-- Check all existing tables
SELECT 
    'TABLES' as object_type,
    table_name as name,
    'table' as type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check all existing functions
SELECT 
    'FUNCTIONS' as object_type,
    routine_name as name,
    'function' as type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Check all existing views
SELECT 
    'VIEWS' as object_type,
    table_name as name,
    'view' as type
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check all RLS policies
SELECT 
    'POLICIES' as object_type,
    tablename || '.' || policyname as name,
    'policy' as type
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check all indexes
SELECT 
    'INDEXES' as object_type,
    indexname as name,
    'index' as type
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname NOT LIKE '%_pkey'  -- Exclude primary key indexes
ORDER BY indexname;

-- Check all triggers
SELECT 
    'TRIGGERS' as object_type,
    trigger_name as name,
    'trigger' as type
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Summary count
SELECT 
    'SUMMARY' as section,
    'Tables: ' || (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') ||
    ', Functions: ' || (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') ||
    ', Views: ' || (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') ||
    ', Policies: ' || (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') ||
    ', Indexes: ' || (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname NOT LIKE '%_pkey') ||
    ', Triggers: ' || (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') as summary;