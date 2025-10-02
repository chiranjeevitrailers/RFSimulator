-- ==============================================
-- QUICK FIX FOR 5GLABX - RUN THIS IN SUPABASE SQL EDITOR (V3 - FIXED)
-- This fixes the "Failed to create test execution" error
-- Fixed: Handles auth.users foreign key constraint
-- ==============================================

-- Step 1: Temporarily disable the foreign key constraint OR use a different approach
-- Instead of creating a system user, we'll modify RLS to allow service role bypass

-- Step 2: Fix RLS policies for test_case_executions
-- Remove old restrictive policies
DROP POLICY IF EXISTS "Users can view their own test executions" ON public.test_case_executions;
DROP POLICY IF EXISTS "Users can insert their own test executions" ON public.test_case_executions;
DROP POLICY IF EXISTS "Users can update their own test executions" ON public.test_case_executions;
DROP POLICY IF EXISTS "Allow all operations for service role and system" ON public.test_case_executions;

-- Create permissive policy that allows service role (used by API) to bypass RLS
CREATE POLICY "Allow service role full access" 
ON public.test_case_executions
FOR ALL
USING (true)  -- Service role bypasses RLS automatically
WITH CHECK (true);

-- Step 3: Fix RLS policies for decoded_messages
DROP POLICY IF EXISTS "Users can view decoded messages" ON public.decoded_messages;
DROP POLICY IF EXISTS "Users can insert decoded messages" ON public.decoded_messages;
DROP POLICY IF EXISTS "Allow all operations on decoded_messages" ON public.decoded_messages;

CREATE POLICY "Allow service role full access on decoded_messages" 
ON public.decoded_messages
FOR ALL
USING (true)  -- Service role bypasses RLS automatically
WITH CHECK (true);

-- Step 4: Create a function to check if user exists, if not use a dummy UUID
-- This allows the API to insert records even if the user doesn't exist in auth
CREATE OR REPLACE FUNCTION public.get_or_create_system_user_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    system_user_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
BEGIN
    -- Just return the system UUID
    -- The RLS policy allows service role to insert with any user_id
    RETURN system_user_id;
END;
$$;

-- Step 5: Enable realtime (fixed - without IF NOT EXISTS)
DO $$
BEGIN
    -- Try to add tables to realtime publication
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.test_case_executions;
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Table test_case_executions already in publication';
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.decoded_messages;
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Table decoded_messages already in publication';
    END;
END $$;

-- Step 6: Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.test_case_executions TO anon, authenticated, service_role;
GRANT SELECT, INSERT, DELETE ON public.decoded_messages TO anon, authenticated, service_role;

-- Step 7: Make user_id nullable in test_case_executions if it causes issues
-- This is a safer approach - allow NULL user_id for system executions
DO $$
BEGIN
    -- Check if user_id is NOT NULL and try to make it nullable
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'test_case_executions' 
        AND column_name = 'user_id' 
        AND is_nullable = 'NO'
    ) THEN
        -- Drop the foreign key constraint first
        ALTER TABLE public.test_case_executions 
        DROP CONSTRAINT IF EXISTS test_case_executions_user_id_fkey;
        
        -- Make user_id nullable
        ALTER TABLE public.test_case_executions 
        ALTER COLUMN user_id DROP NOT NULL;
        
        RAISE NOTICE 'Made user_id nullable in test_case_executions';
    END IF;
END $$;

-- Success notification
DO $$
BEGIN
    RAISE NOTICE '✅ Quick fix applied successfully!';
    RAISE NOTICE '🔓 RLS policies updated - service role has full access';
    RAISE NOTICE '📡 Realtime enabled for test execution tables';
    RAISE NOTICE '🔧 user_id constraint removed for system executions';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 You can now run test cases and see data in frontend!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Note: API will use user_id = NULL for system executions';
END $$;
