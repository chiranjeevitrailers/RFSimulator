-- ==============================================
-- 5GLabX Platform - Fix Missing Columns and Improvements
-- Add missing columns and improve schema consistency
-- ==============================================

-- Add missing columns to test_case_executions table
ALTER TABLE public.test_case_executions 
ADD COLUMN IF NOT EXISTS current_test_id UUID REFERENCES public.test_cases(id) ON DELETE SET NULL;

-- Add missing columns to test_cases table for better tracking
ALTER TABLE public.test_cases 
ADD COLUMN IF NOT EXISTS test_case_id TEXT UNIQUE;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_test_case_executions_current_test_id ON public.test_case_executions(current_test_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_case_id ON public.test_cases(test_case_id);

-- Add missing columns to decoded_messages for better performance
ALTER TABLE public.decoded_messages 
ADD COLUMN IF NOT EXISTS message_size INTEGER DEFAULT 0;

-- Create additional indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_decoded_messages_source_entity ON public.decoded_messages(source_entity);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_target_entity ON public.decoded_messages(target_entity);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_entity_id ON public.decoded_messages(entity_id);

-- Add missing columns to test_case_executions for better tracking
ALTER TABLE public.test_case_executions 
ADD COLUMN IF NOT EXISTS total_steps INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_steps INTEGER DEFAULT 0;

-- Create index for better performance on test execution queries
CREATE INDEX IF NOT EXISTS idx_test_case_executions_total_steps ON public.test_case_executions(total_steps);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_completed_steps ON public.test_case_executions(completed_steps);

-- Add missing columns to log_files for better file management
ALTER TABLE public.log_files 
ADD COLUMN IF NOT EXISTS file_hash TEXT,
ADD COLUMN IF NOT EXISTS checksum TEXT,
ADD COLUMN IF NOT EXISTS upload_progress INTEGER DEFAULT 0 CHECK (upload_progress >= 0 AND upload_progress <= 100);

-- Create indexes for log files
CREATE INDEX IF NOT EXISTS idx_log_files_file_hash ON public.log_files(file_hash);
CREATE INDEX IF NOT EXISTS idx_log_files_checksum ON public.log_files(checksum);

-- Add missing columns to test_run_queue for better queue management
ALTER TABLE public.test_run_queue 
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_retries INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS last_error TEXT;

-- Create indexes for queue management
CREATE INDEX IF NOT EXISTS idx_test_run_queue_retry_count ON public.test_run_queue(retry_count);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_priority ON public.test_run_queue(priority);

-- Add missing columns to test_run_schedules for better scheduling
ALTER TABLE public.test_run_schedules 
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS max_execution_time INTEGER DEFAULT 3600, -- seconds
ADD COLUMN IF NOT EXISTS failure_threshold INTEGER DEFAULT 3;

-- Create indexes for scheduling
CREATE INDEX IF NOT EXISTS idx_test_run_schedules_timezone ON public.test_run_schedules(timezone);
CREATE INDEX IF NOT EXISTS idx_test_run_schedules_next_run_at ON public.test_run_schedules(next_run_at);

-- Add missing columns to test_run_configs for better configuration management
ALTER TABLE public.test_run_configs 
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Create indexes for configuration management
CREATE INDEX IF NOT EXISTS idx_test_run_configs_version ON public.test_run_configs(version);
CREATE INDEX IF NOT EXISTS idx_test_run_configs_is_default ON public.test_run_configs(is_default);

-- Add missing columns to test_suite_collections for better organization
ALTER TABLE public.test_suite_collections 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create indexes for collections
CREATE INDEX IF NOT EXISTS idx_test_suite_collections_category ON public.test_suite_collections(category);
CREATE INDEX IF NOT EXISTS idx_test_suite_collections_tags ON public.test_suite_collections USING GIN(tags);

-- Add missing columns to test_execution_workers for better worker management
ALTER TABLE public.test_execution_workers 
ADD COLUMN IF NOT EXISTS cpu_usage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS memory_usage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for worker management
CREATE INDEX IF NOT EXISTS idx_test_execution_workers_cpu_usage ON public.test_execution_workers(cpu_usage);
CREATE INDEX IF NOT EXISTS idx_test_execution_workers_memory_usage ON public.test_execution_workers(memory_usage);
CREATE INDEX IF NOT EXISTS idx_test_execution_workers_last_heartbeat ON public.test_execution_workers(last_heartbeat);

-- Add missing columns to test_run_artifacts for better artifact management
ALTER TABLE public.test_run_artifacts 
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS mime_type TEXT,
ADD COLUMN IF NOT EXISTS checksum TEXT;

-- Create indexes for artifacts
CREATE INDEX IF NOT EXISTS idx_test_run_artifacts_file_size ON public.test_run_artifacts(file_size);
CREATE INDEX IF NOT EXISTS idx_test_run_artifacts_mime_type ON public.test_run_artifacts(mime_type);

-- Add missing columns to test_run_metrics for better metrics tracking (only if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'test_run_metrics'
    ) THEN
        ALTER TABLE public.test_run_metrics 
        ADD COLUMN IF NOT EXISTS metric_unit TEXT,
        ADD COLUMN IF NOT EXISTS metric_category TEXT,
        ADD COLUMN IF NOT EXISTS is_threshold BOOLEAN DEFAULT false;

        -- Create indexes for metrics
        CREATE INDEX IF NOT EXISTS idx_test_run_metrics_metric_unit ON public.test_run_metrics(metric_unit);
        CREATE INDEX IF NOT EXISTS idx_test_run_metrics_metric_category ON public.test_run_metrics(metric_category);
    END IF;
END $$;

-- Add missing columns to message_flow_analysis for better flow analysis
ALTER TABLE public.message_flow_analysis 
ADD COLUMN IF NOT EXISTS flow_priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS flow_category TEXT,
ADD COLUMN IF NOT EXISTS is_critical BOOLEAN DEFAULT false;

-- Create indexes for flow analysis
CREATE INDEX IF NOT EXISTS idx_message_flow_analysis_flow_priority ON public.message_flow_analysis(flow_priority);
CREATE INDEX IF NOT EXISTS idx_message_flow_analysis_flow_category ON public.message_flow_analysis(flow_category);

-- Add missing columns to decoded_information_elements for better IE management
ALTER TABLE public.decoded_information_elements 
ADD COLUMN IF NOT EXISTS ie_category TEXT,
ADD COLUMN IF NOT EXISTS ie_priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_critical BOOLEAN DEFAULT false;

-- Create indexes for IE management
CREATE INDEX IF NOT EXISTS idx_decoded_ies_category ON public.decoded_information_elements(ie_category);
CREATE INDEX IF NOT EXISTS idx_decoded_ies_priority ON public.decoded_information_elements(ie_priority);

-- Add missing columns to decoded_layer_parameters for better parameter management
ALTER TABLE public.decoded_layer_parameters 
ADD COLUMN IF NOT EXISTS parameter_priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_critical BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS parameter_range JSONB;

-- Create indexes for parameter management
CREATE INDEX IF NOT EXISTS idx_decoded_params_priority ON public.decoded_layer_parameters(parameter_priority);
CREATE INDEX IF NOT EXISTS idx_decoded_params_critical ON public.decoded_layer_parameters(is_critical);

-- Create additional utility functions for better data management

-- Function to get test execution progress
CREATE OR REPLACE FUNCTION get_test_execution_progress(execution_uuid UUID)
RETURNS TABLE (
    execution_id UUID,
    progress_percentage DECIMAL(5,2),
    current_step TEXT,
    total_steps INTEGER,
    completed_steps INTEGER,
    estimated_completion TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tce.id,
        tce.progress_percentage,
        tce.current_step,
        tce.total_steps,
        tce.completed_steps,
        CASE 
            WHEN tce.progress_percentage > 0 AND tce.start_time IS NOT NULL THEN
                tce.start_time + INTERVAL '1 second' * (tce.duration_ms / 1000.0) * (100.0 / tce.progress_percentage)
            ELSE NULL
        END as estimated_completion
    FROM public.test_case_executions tce
    WHERE tce.id = execution_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get layer performance metrics
CREATE OR REPLACE FUNCTION get_layer_performance_metrics(test_run_uuid UUID)
RETURNS TABLE (
    layer TEXT,
    message_count BIGINT,
    avg_processing_time NUMERIC,
    error_rate NUMERIC,
    warning_rate NUMERIC,
    throughput_mbps NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dm.layer,
        COUNT(*) as message_count,
        ROUND(AVG(dm.processing_time_ms), 2) as avg_processing_time,
        ROUND((COUNT(CASE WHEN dm.validation_status = 'invalid' THEN 1 END)::NUMERIC / COUNT(*)) * 100, 2) as error_rate,
        ROUND((COUNT(CASE WHEN dm.validation_status = 'warning' THEN 1 END)::NUMERIC / COUNT(*)) * 100, 2) as warning_rate,
        ROUND(SUM(dm.message_size) / 1024.0 / 1024.0, 2) as throughput_mbps
    FROM public.decoded_messages dm
    WHERE dm.test_run_id = test_run_uuid
    GROUP BY dm.layer
    ORDER BY dm.layer;
END;
$$ LANGUAGE plpgsql;

-- Function to get test case statistics
CREATE OR REPLACE FUNCTION get_test_case_statistics()
RETURNS TABLE (
    total_test_cases BIGINT,
    active_test_cases BIGINT,
    premium_test_cases BIGINT,
    protocol_distribution JSONB,
    complexity_distribution JSONB,
    category_distribution JSONB
) AS $$
DECLARE
    protocol_data JSONB;
    complexity_data JSONB;
    category_data JSONB;
BEGIN
    -- Get protocol distribution
    SELECT jsonb_object_agg(protocol, count) INTO protocol_data
    FROM (
        SELECT protocol, COUNT(*) as count
        FROM public.test_cases
        WHERE is_active = true
        GROUP BY protocol
    ) protocol_counts;
    
    -- Get complexity distribution
    SELECT jsonb_object_agg(complexity, count) INTO complexity_data
    FROM (
        SELECT complexity, COUNT(*) as count
        FROM public.test_cases
        WHERE is_active = true
        GROUP BY complexity
    ) complexity_counts;
    
    -- Get category distribution
    SELECT jsonb_object_agg(category, count) INTO category_data
    FROM (
        SELECT category, COUNT(*) as count
        FROM public.test_cases
        WHERE is_active = true
        GROUP BY category
    ) category_counts;
    
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.test_cases) as total_test_cases,
        (SELECT COUNT(*) FROM public.test_cases WHERE is_active = true) as active_test_cases,
        (SELECT COUNT(*) FROM public.test_cases WHERE is_premium = true AND is_active = true) as premium_test_cases,
        COALESCE(protocol_data, '{}'::jsonb) as protocol_distribution,
        COALESCE(complexity_data, '{}'::jsonb) as complexity_distribution,
        COALESCE(category_data, '{}'::jsonb) as category_distribution;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old test executions
CREATE OR REPLACE FUNCTION cleanup_old_test_executions(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.test_case_executions
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    AND status IN ('completed', 'failed', 'cancelled');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get system health metrics
CREATE OR REPLACE FUNCTION get_system_health_metrics()
RETURNS TABLE (
    active_workers INTEGER,
    queued_tests INTEGER,
    running_tests INTEGER,
    completed_tests_today INTEGER,
    failed_tests_today INTEGER,
    avg_execution_time NUMERIC,
    system_load NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.test_execution_workers WHERE status = 'active') as active_workers,
        (SELECT COUNT(*) FROM public.test_run_queue WHERE status = 'queued') as queued_tests,
        (SELECT COUNT(*) FROM public.test_case_executions WHERE status = 'running') as running_tests,
        (SELECT COUNT(*) FROM public.test_case_executions WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE) as completed_tests_today,
        (SELECT COUNT(*) FROM public.test_case_executions WHERE status = 'failed' AND DATE(created_at) = CURRENT_DATE) as failed_tests_today,
        (SELECT ROUND(AVG(duration_ms), 2) FROM public.test_case_executions WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE) as avg_execution_time,
        (SELECT ROUND((COUNT(*)::NUMERIC / 1000.0) * 100, 2) FROM public.test_case_executions WHERE created_at > NOW() - INTERVAL '1 hour') as system_load;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION get_test_execution_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_layer_performance_metrics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_test_case_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_test_executions(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION get_system_health_metrics() TO authenticated;

-- Create additional views for better data access

-- View for test execution summary
CREATE OR REPLACE VIEW public.test_execution_summary AS
SELECT 
    tce.id,
    tce.execution_id,
    tce.status,
    tce.progress_percentage,
    tce.current_step,
    tce.total_steps,
    tce.completed_steps,
    tce.start_time,
    tce.end_time,
    tce.duration_ms,
    tc.name as test_case_name,
    tc.category,
    tc.protocol,
    u.email as user_email,
    u.full_name as user_name
FROM public.test_case_executions tce
JOIN public.test_cases tc ON tce.test_case_id = tc.id
JOIN public.users u ON tce.user_id = u.id;

-- View for layer performance summary
CREATE OR REPLACE VIEW public.layer_performance_summary AS
SELECT 
    dm.layer,
    COUNT(*) as message_count,
    ROUND(AVG(dm.processing_time_ms), 2) as avg_processing_time,
    ROUND(AVG(dm.message_size), 2) as avg_message_size,
    COUNT(CASE WHEN dm.validation_status = 'valid' THEN 1 END) as valid_messages,
    COUNT(CASE WHEN dm.validation_status = 'invalid' THEN 1 END) as invalid_messages,
    COUNT(CASE WHEN dm.validation_status = 'warning' THEN 1 END) as warning_messages,
    ROUND((COUNT(CASE WHEN dm.validation_status = 'valid' THEN 1 END)::NUMERIC / COUNT(*)) * 100, 2) as success_rate
FROM public.decoded_messages dm
GROUP BY dm.layer
ORDER BY dm.layer;

-- View for test case performance summary
CREATE OR REPLACE VIEW public.test_case_performance_summary AS
SELECT 
    tc.id,
    tc.test_case_id,
    tc.name,
    tc.category,
    tc.protocol,
    tc.complexity,
    COUNT(tce.id) as execution_count,
    COUNT(CASE WHEN tce.status = 'completed' THEN 1 END) as successful_executions,
    COUNT(CASE WHEN tce.status = 'failed' THEN 1 END) as failed_executions,
    ROUND(AVG(tce.duration_ms), 2) as avg_execution_time,
    ROUND((COUNT(CASE WHEN tce.status = 'completed' THEN 1 END)::NUMERIC / COUNT(tce.id)) * 100, 2) as success_rate
FROM public.test_cases tc
LEFT JOIN public.test_case_executions tce ON tc.id = tce.test_case_id
WHERE tc.is_active = true
GROUP BY tc.id, tc.test_case_id, tc.name, tc.category, tc.protocol, tc.complexity
ORDER BY execution_count DESC;

-- Grant permissions for views
GRANT SELECT ON public.test_execution_summary TO authenticated;
GRANT SELECT ON public.layer_performance_summary TO authenticated;
GRANT SELECT ON public.test_case_performance_summary TO authenticated;

-- Add comments for new columns and functions
COMMENT ON COLUMN public.test_case_executions.current_test_id IS 'Currently executing test case ID for multi-test runs';
COMMENT ON COLUMN public.test_cases.test_case_id IS 'Unique test case identifier for external references';
COMMENT ON COLUMN public.decoded_messages.message_size IS 'Size of the message in bytes';
COMMENT ON COLUMN public.log_files.file_hash IS 'SHA-256 hash of the file for integrity verification';
COMMENT ON COLUMN public.log_files.checksum IS 'MD5 checksum of the file for quick verification';

COMMENT ON FUNCTION get_test_execution_progress(UUID) IS 'Get detailed progress information for a test execution';
COMMENT ON FUNCTION get_layer_performance_metrics(UUID) IS 'Get performance metrics for all layers in a test run';
COMMENT ON FUNCTION get_test_case_statistics() IS 'Get comprehensive statistics about test cases';
COMMENT ON FUNCTION cleanup_old_test_executions(INTEGER) IS 'Clean up old test executions to maintain database performance';
COMMENT ON FUNCTION get_system_health_metrics() IS 'Get system health and performance metrics';

COMMENT ON VIEW public.test_execution_summary IS 'Summary view of test executions with user and test case information';
COMMENT ON VIEW public.layer_performance_summary IS 'Performance summary for all protocol layers';
COMMENT ON VIEW public.test_case_performance_summary IS 'Performance summary for all test cases';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Missing columns and improvements migration completed successfully!';
    RAISE NOTICE '📊 Added missing columns to all tables';
    RAISE NOTICE '🔍 Created additional indexes for better performance';
    RAISE NOTICE '⚙️ Added utility functions for data management';
    RAISE NOTICE '📈 Created summary views for better analytics';
    RAISE NOTICE '🎯 Improved schema consistency and performance';
END $$;