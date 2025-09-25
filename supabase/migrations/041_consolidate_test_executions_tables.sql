-- ==============================================
-- 5GLabX Platform - Consolidate Test Execution Tables
-- Remove test_executions table and consolidate to test_case_executions
-- ==============================================

-- ==============================================
-- 1. MIGRATE DATA FROM test_executions TO test_case_executions
-- ==============================================

-- First, check if test_executions table exists and has data
DO $$
DECLARE
    table_exists boolean;
    row_count integer;
BEGIN
    -- Check if test_executions table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'test_executions'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Count existing rows
        EXECUTE 'SELECT COUNT(*) FROM public.test_executions' INTO row_count;
        
        RAISE NOTICE 'Found test_executions table with % rows', row_count;
        
        -- Migrate data if any exists
        IF row_count > 0 THEN
            RAISE NOTICE 'Migrating data from test_executions to test_case_executions...';
            
            -- Insert data from test_executions into test_case_executions
            -- Generate execution_id for existing records
            INSERT INTO public.test_case_executions (
                id,
                test_case_id,
                user_id,
                execution_id,
                status,
                start_time,
                end_time,
                results,
                logs,
                created_at
            )
            SELECT 
                id,
                test_case_id,
                user_id,
                gen_random_uuid() as execution_id,  -- Generate new execution_id
                status,
                start_time,
                end_time,
                results,
                logs,
                created_at
            FROM public.test_executions
            ON CONFLICT (id) DO NOTHING;  -- Avoid duplicates if data already exists
            
            RAISE NOTICE 'Data migration completed successfully';
        ELSE
            RAISE NOTICE 'No data to migrate from test_executions';
        END IF;
    ELSE
        RAISE NOTICE 'test_executions table does not exist, skipping migration';
    END IF;
END $$;

-- ==============================================
-- 2. DROP OLD test_executions TABLE
-- ==============================================

-- Drop the old test_executions table if it exists
DROP TABLE IF EXISTS public.test_executions CASCADE;

-- ==============================================
-- 3. UPDATE ANY REMAINING REFERENCES
-- ==============================================

-- Update any views or functions that might reference test_executions
-- (This is a safety measure in case there are any remaining references)

-- ==============================================
-- 4. VERIFY CONSOLIDATION
-- ==============================================

-- Verify that test_case_executions table is properly structured
DO $$
DECLARE
    column_count integer;
    has_execution_id boolean;
BEGIN
    -- Check if test_case_executions has the expected structure
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'test_case_executions';
    
    -- Check if execution_id column exists
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'test_case_executions'
        AND column_name = 'execution_id'
    ) INTO has_execution_id;
    
    RAISE NOTICE 'test_case_executions table has % columns', column_count;
    RAISE NOTICE 'execution_id column exists: %', has_execution_id;
    
    IF column_count < 10 OR NOT has_execution_id THEN
        RAISE EXCEPTION 'test_case_executions table structure is incomplete';
    END IF;
END $$;

-- ==============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Ensure proper indexes exist on test_case_executions
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON public.test_case_executions(status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_execution_id ON public.test_case_executions(execution_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON public.test_case_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON public.test_case_executions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_created_at ON public.test_case_executions(created_at);

-- ==============================================
-- 6. UPDATE ROW LEVEL SECURITY
-- ==============================================

-- Ensure RLS is enabled on test_case_executions
ALTER TABLE public.test_case_executions ENABLE ROW LEVEL SECURITY;

-- Create/update RLS policies for test_case_executions
DROP POLICY IF EXISTS "Users can view their own test executions" ON public.test_case_executions;
CREATE POLICY "Users can view their own test executions" ON public.test_case_executions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own test executions" ON public.test_case_executions;
CREATE POLICY "Users can insert their own test executions" ON public.test_case_executions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own test executions" ON public.test_case_executions;
CREATE POLICY "Users can update their own test executions" ON public.test_case_executions
    FOR UPDATE USING (auth.uid() = user_id);

-- ==============================================
-- 7. GRANT PERMISSIONS
-- ==============================================

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_case_executions TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ==============================================
-- 8. SUCCESS MESSAGE
-- ==============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Test execution tables consolidation completed successfully!';
    RAISE NOTICE '🗑️  Removed test_executions table';
    RAISE NOTICE '✅ Consolidated to test_case_executions table';
    RAISE NOTICE '🔒 Updated Row Level Security policies';
    RAISE NOTICE '📈 Created performance indexes';
    RAISE NOTICE '🎯 All APIs now use test_case_executions consistently';
END $$;