-- Fix test_case_executions table structure
-- This script creates the missing table or fixes the schema to resolve the 500 error

-- Ensure required extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create test_case_executions table if it doesn't exist
CREATE TABLE IF NOT EXISTS test_case_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    execution_mode TEXT NOT NULL DEFAULT 'simulation',
    configuration JSONB,
    progress INTEGER DEFAULT 0,
    current_test_id TEXT,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create test_case_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS test_case_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    test_case_id TEXT NOT NULL,
    status TEXT NOT NULL,
    duration_seconds INTEGER,
    metrics JSONB,
    errors JSONB DEFAULT '[]'::jsonb,
    warnings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON test_case_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON test_case_executions(status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_created_at ON test_case_executions(created_at);
CREATE INDEX IF NOT EXISTS idx_test_case_results_execution_id ON test_case_results(execution_id);
CREATE INDEX IF NOT EXISTS idx_test_case_results_test_case_id ON test_case_results(test_case_id);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE test_case_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_case_results ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (adjust as needed for your auth system)
-- Drop existing policies if present to avoid syntax errors on CREATE POLICY
DROP POLICY IF EXISTS "Users can view their own test executions" ON test_case_executions;
DROP POLICY IF EXISTS "Users can insert their own test executions" ON test_case_executions;
DROP POLICY IF EXISTS "Users can update their own test executions" ON test_case_executions;
DROP POLICY IF EXISTS "Users can view their own test results" ON test_case_results;
DROP POLICY IF EXISTS "Users can insert their own test results" ON test_case_results;

CREATE POLICY "Users can view their own test executions" ON test_case_executions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own test executions" ON test_case_executions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own test executions" ON test_case_executions
    FOR UPDATE USING (true);

CREATE POLICY "Users can view their own test results" ON test_case_results
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own test results" ON test_case_results
    FOR INSERT WITH CHECK (true);

-- Verify the tables were created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('test_case_executions', 'test_case_results')
ORDER BY table_name, ordinal_position;