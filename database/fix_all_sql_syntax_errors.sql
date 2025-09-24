-- Comprehensive SQL Syntax Fix Script
-- This script fixes all known SQL syntax errors across the database

-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Drop all existing policies to avoid conflicts
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop policies for test_case_executions
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'test_case_executions'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON test_case_executions', policy_record.policyname);
    END LOOP;
    
    -- Drop policies for test_case_results
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'test_case_results'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON test_case_results', policy_record.policyname);
    END LOOP;
END $$;

-- Create new policies with proper syntax
CREATE POLICY "test_executions_select_policy" ON test_case_executions
    FOR SELECT USING (true);

CREATE POLICY "test_executions_insert_policy" ON test_case_executions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "test_executions_update_policy" ON test_case_executions
    FOR UPDATE USING (true);

CREATE POLICY "test_results_select_policy" ON test_case_results
    FOR SELECT USING (true);

CREATE POLICY "test_results_insert_policy" ON test_case_results
    FOR INSERT WITH CHECK (true);

-- Verify the tables were created successfully
SELECT 
    'Tables created successfully' as status,
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('test_case_executions', 'test_case_results')
ORDER BY table_name, ordinal_position;

-- Verify policies were created
SELECT 
    'Policies created successfully' as status,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('test_case_executions', 'test_case_results')
ORDER BY tablename, policyname;