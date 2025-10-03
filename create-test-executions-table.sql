-- Create test_executions table for 5GLabX
-- This table stores test execution records and status

CREATE TABLE IF NOT EXISTS public.test_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID,
    user_id TEXT DEFAULT 'anonymous',
    status TEXT DEFAULT 'pending',
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    results JSONB DEFAULT '{}',
    logs JSONB DEFAULT '[]',
    progress INTEGER DEFAULT 0,
    current_message TEXT,
    actual_message_count INTEGER DEFAULT 0,
    expected_message_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (but allow all operations for now)
ALTER TABLE public.test_executions ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for all operations
CREATE POLICY "Allow all operations on test_executions" 
ON public.test_executions 
FOR ALL 
USING (true);

-- Insert a sample test execution to verify the table works
INSERT INTO public.test_executions (
    test_case_id,
    user_id,
    status,
    progress,
    current_message,
    expected_message_count,
    results
) VALUES (
    '2fac4988-2313-4197-bc7e-39d3a66f23c1',
    'system',
    'completed',
    100,
    'Sample test execution for verification',
    5,
    '{"total_messages": 5, "processed_messages": 5, "success_rate": 100}'::jsonb
);

-- Verify the table was created and data inserted
SELECT 
    id,
    test_case_id,
    status,
    progress,
    current_message,
    created_at
FROM public.test_executions 
LIMIT 5;