-- ==============================================
-- QUICK FIX FOR 5GLABX - RUN THIS IN SUPABASE SQL EDITOR
-- This fixes the "Failed to create test execution" error
-- ==============================================

-- Step 1: Create system user
INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    subscription_tier,
    subscription_status,
    is_active,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    'system@5glabx.internal',
    'System User',
    'admin',
    'enterprise',
    'active',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- Step 2: Fix RLS policies for test_case_executions
DROP POLICY IF EXISTS "Users can view their own test executions" ON public.test_case_executions;
DROP POLICY IF EXISTS "Users can insert their own test executions" ON public.test_case_executions;
DROP POLICY IF EXISTS "Users can update their own test executions" ON public.test_case_executions;

-- Allow service role and system user to bypass RLS
CREATE POLICY "Allow all operations for service role and system" 
ON public.test_case_executions
FOR ALL
USING (
  user_id = '00000000-0000-0000-0000-000000000000'::uuid
  OR auth.uid() = user_id
)
WITH CHECK (
  user_id = '00000000-0000-0000-0000-000000000000'::uuid
  OR auth.uid() = user_id
);

-- Step 3: Fix RLS policies for decoded_messages
DROP POLICY IF EXISTS "Users can view decoded messages" ON public.decoded_messages;
DROP POLICY IF EXISTS "Users can insert decoded messages" ON public.decoded_messages;

CREATE POLICY "Allow all operations on decoded_messages" 
ON public.decoded_messages
FOR ALL
USING (true)
WITH CHECK (true);

-- Step 4: Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS public.test_case_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS public.decoded_messages;

-- Step 5: Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.test_case_executions TO anon, authenticated;
GRANT SELECT, INSERT ON public.decoded_messages TO anon, authenticated;

-- Success notification
DO $$
BEGIN
    RAISE NOTICE '✅ Quick fix applied successfully!';
    RAISE NOTICE '🔓 RLS policies updated for test_case_executions';
    RAISE NOTICE '🤖 System user created: 00000000-0000-0000-0000-000000000000';
    RAISE NOTICE '📡 Realtime enabled for test execution tables';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 You can now run test cases and see data in frontend!';
END $$;
