-- ==============================================
-- Fix RLS policies for test_case_executions to allow service role
-- This fixes the "Failed to create test execution" error
-- ==============================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own test executions" ON public.test_case_executions;
DROP POLICY IF EXISTS "Users can insert their own test executions" ON public.test_case_executions;
DROP POLICY IF EXISTS "Users can update their own test executions" ON public.test_case_executions;

-- Create permissive policies that allow both authenticated users and service role
CREATE POLICY "Allow authenticated users to view their test executions" 
ON public.test_case_executions
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR auth.jwt()->>'role' = 'service_role'
);

CREATE POLICY "Allow authenticated users to insert test executions" 
ON public.test_case_executions
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  OR auth.jwt()->>'role' = 'service_role'
  OR user_id = '00000000-0000-0000-0000-000000000000'::uuid  -- Allow system user
);

CREATE POLICY "Allow authenticated users to update their test executions" 
ON public.test_case_executions
FOR UPDATE 
USING (
  auth.uid() = user_id 
  OR auth.jwt()->>'role' = 'service_role'
);

-- Also update decoded_messages table policies for realtime functionality
DROP POLICY IF EXISTS "Users can view decoded messages" ON public.decoded_messages;
DROP POLICY IF EXISTS "Users can insert decoded messages" ON public.decoded_messages;

CREATE POLICY "Allow viewing decoded messages" 
ON public.decoded_messages
FOR SELECT 
USING (true);  -- Allow all reads for realtime subscriptions

CREATE POLICY "Allow inserting decoded messages" 
ON public.decoded_messages
FOR INSERT 
WITH CHECK (
  auth.jwt()->>'role' = 'service_role'
  OR true  -- Allow inserts from anywhere for test execution
);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.test_case_executions TO anon, authenticated;
GRANT SELECT, INSERT ON public.decoded_messages TO anon, authenticated;

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_case_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.decoded_messages;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies updated successfully!';
    RAISE NOTICE '🔓 Service role can now create test executions';
    RAISE NOTICE '📡 Realtime enabled for test_case_executions and decoded_messages';
END $$;
