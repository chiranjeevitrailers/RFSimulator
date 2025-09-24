-- Comprehensive Database Fix for 5GLabX Data Flow
-- This script creates all missing tables and fixes data flow issues

-- Ensure required extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix test_case_executions table (critical for test execution)
CREATE TABLE IF NOT EXISTS test_case_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    execution_mode TEXT NOT NULL DEFAULT 'simulation',
    configuration JSONB DEFAULT '{}'::jsonb,
    progress INTEGER DEFAULT 0,
    current_test_id TEXT,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    error_message TEXT,
    expected_message_count INTEGER DEFAULT 0,
    actual_message_count INTEGER DEFAULT 0,
    message_flow_compliance JSONB DEFAULT '[]'::jsonb,
    layer_analysis_results JSONB DEFAULT '{}'::jsonb,
    ie_validation_results JSONB DEFAULT '{}'::jsonb,
    timing_analysis_results JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create test_case_results table
CREATE TABLE IF NOT EXISTS test_case_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    test_case_id TEXT NOT NULL,
    status TEXT NOT NULL,
    duration_seconds INTEGER,
    metrics JSONB DEFAULT '{}'::jsonb,
    errors JSONB DEFAULT '[]'::jsonb,
    warnings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create test_run_queue table for playback service
CREATE TABLE IF NOT EXISTS test_run_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued',
    priority INTEGER DEFAULT 0,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create decoded_messages table for real-time data
CREATE TABLE IF NOT EXISTS decoded_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    message_id TEXT NOT NULL,
    timestamp_us BIGINT NOT NULL,
    protocol TEXT NOT NULL,
    message_type TEXT NOT NULL,
    message_name TEXT NOT NULL,
    message_direction TEXT NOT NULL,
    layer TEXT NOT NULL,
    sublayer TEXT,
    source_entity TEXT,
    target_entity TEXT,
    decoded_data JSONB DEFAULT '{}'::jsonb,
    information_elements JSONB DEFAULT '[]'::jsonb,
    ie_count INTEGER DEFAULT 0,
    validation_status TEXT DEFAULT 'valid',
    validation_errors JSONB DEFAULT '[]'::jsonb,
    validation_warnings JSONB DEFAULT '[]'::jsonb,
    message_size INTEGER DEFAULT 0,
    processing_time_ms INTEGER DEFAULT 0,
    decoded_information_elements JSONB DEFAULT '[]'::jsonb,
    decoded_layer_parameters JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create message_flow_compliance table for analysis
CREATE TABLE IF NOT EXISTS message_flow_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    compliance_score DECIMAL(5,2) DEFAULT 100.00,
    total_expected_messages INTEGER DEFAULT 0,
    total_actual_messages INTEGER DEFAULT 0,
    missing_messages JSONB DEFAULT '[]'::jsonb,
    extra_messages JSONB DEFAULT '[]'::jsonb,
    sequence_violations JSONB DEFAULT '[]'::jsonb,
    timing_violations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ie_validation_results table
CREATE TABLE IF NOT EXISTS ie_validation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES decoded_messages(id) ON DELETE CASCADE,
    ie_name TEXT NOT NULL,
    expected_value TEXT,
    actual_value TEXT,
    validation_status TEXT DEFAULT 'pass',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create layer_parameter_analysis table
CREATE TABLE IF NOT EXISTS layer_parameter_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    layer TEXT NOT NULL,
    parameter_name TEXT NOT NULL,
    expected_value TEXT,
    actual_value TEXT,
    analysis_status TEXT DEFAULT 'pass',
    deviation_percentage DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create message_timing_analysis table
CREATE TABLE IF NOT EXISTS message_timing_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES test_case_executions(id) ON DELETE CASCADE,
    message_sequence_id TEXT,
    expected_timing_ms INTEGER,
    actual_timing_ms INTEGER,
    timing_deviation_ms INTEGER,
    timing_status TEXT DEFAULT 'within_tolerance',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON test_case_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON test_case_executions(status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON test_case_executions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_created_at ON test_case_executions(created_at);
CREATE INDEX IF NOT EXISTS idx_test_case_results_execution_id ON test_case_results(execution_id);
CREATE INDEX IF NOT EXISTS idx_test_case_results_test_case_id ON test_case_results(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_run_id ON test_run_queue(run_id);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_status ON test_run_queue(status);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_execution_id ON decoded_messages(execution_id);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_layer ON decoded_messages(layer);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_protocol ON decoded_messages(protocol);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_timestamp_us ON decoded_messages(timestamp_us);

-- Enable RLS on all tables
ALTER TABLE test_case_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_case_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_run_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE decoded_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_flow_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ie_validation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE layer_parameter_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_timing_analysis ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "executions_all_access" ON test_case_executions;
DROP POLICY IF EXISTS "results_all_access" ON test_case_results;
DROP POLICY IF EXISTS "queue_all_access" ON test_run_queue;
DROP POLICY IF EXISTS "messages_all_access" ON decoded_messages;
DROP POLICY IF EXISTS "compliance_all_access" ON message_flow_compliance;
DROP POLICY IF EXISTS "ie_validation_all_access" ON ie_validation_results;
DROP POLICY IF EXISTS "layer_analysis_all_access" ON layer_parameter_analysis;
DROP POLICY IF EXISTS "timing_analysis_all_access" ON message_timing_analysis;

-- Create comprehensive policies for all operations
CREATE POLICY "executions_all_access" ON test_case_executions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "results_all_access" ON test_case_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "queue_all_access" ON test_run_queue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "messages_all_access" ON decoded_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "compliance_all_access" ON message_flow_compliance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "ie_validation_all_access" ON ie_validation_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "layer_analysis_all_access" ON layer_parameter_analysis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "timing_analysis_all_access" ON message_timing_analysis FOR ALL USING (true) WITH CHECK (true);

-- Insert sample execution for testing
INSERT INTO test_case_executions (
    id,
    test_case_id,
    user_id,
    status,
    execution_mode,
    expected_message_count
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '2fac4988-2313-4197-bc7e-39d3a66f23c1',
    'test-user',
    'completed',
    'simulation',
    7
) ON CONFLICT (id) DO NOTHING;

-- Insert sample decoded messages for testing
INSERT INTO decoded_messages (
    execution_id,
    message_id,
    timestamp_us,
    protocol,
    message_type,
    message_name,
    message_direction,
    layer,
    decoded_data
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440000',
    'msg_001',
    1000000,
    '5G_NR',
    'RandomAccessPreamble',
    'RA Preamble',
    'UL',
    'PHY',
    '{"preamble_id": 15}'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'msg_002',
    2000000,
    '5G_NR',
    'RandomAccessResponse',
    'RA Response',
    'DL',
    'PHY',
    '{"ra_rnti": 1234}'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'msg_003',
    3000000,
    '5G_NR',
    'RRCSetupRequest',
    'RRC Setup Request',
    'UL',
    'RRC',
    '{"ue_identity": "0x12345678"}'
)
ON CONFLICT DO NOTHING;

-- Verify table creation
SELECT 'Database setup completed successfully' as status;
SELECT table_name
FROM information_schema.tables
WHERE table_name IN (
    'test_case_executions',
    'test_case_results',
    'test_run_queue',
    'decoded_messages',
    'message_flow_compliance',
    'ie_validation_results',
    'layer_parameter_analysis',
    'message_timing_analysis'
)
ORDER BY table_name;

-- Show sample data
SELECT 'Sample execution created with ID: ' || id::text as sample_data
FROM test_case_executions
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

SELECT 'Sample messages count: ' || COUNT(*)::text as sample_messages
FROM decoded_messages
WHERE execution_id = '550e8400-e29b-41d4-a716-446655440000';