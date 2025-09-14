-- ==============================================
-- 5GLabX Platform - Test Suites Enhancements
-- Additional tables for test suite management
-- ==============================================

-- Test run configurations
CREATE TABLE IF NOT EXISTS public.test_run_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    test_ids UUID[] NOT NULL,
    execution_mode TEXT NOT NULL DEFAULT 'simulation' CHECK (execution_mode IN ('simulation', 'realtime', 'batch')),
    configuration JSONB DEFAULT '{}',
    is_template BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test run queue for managing execution order
CREATE TABLE IF NOT EXISTS public.test_run_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    run_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    priority INTEGER DEFAULT 0,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    worker_id TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test run schedules for automated execution
CREATE TABLE IF NOT EXISTS public.test_run_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    test_ids UUID[] NOT NULL,
    cron_expression TEXT NOT NULL,
    execution_mode TEXT NOT NULL DEFAULT 'simulation' CHECK (execution_mode IN ('simulation', 'realtime', 'batch')),
    configuration JSONB DEFAULT '{}',
    notifications JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    next_run_at TIMESTAMP WITH TIME ZONE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test run artifacts (files, logs, reports)
CREATE TABLE IF NOT EXISTS public.test_run_artifacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    run_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    artifact_type TEXT NOT NULL CHECK (artifact_type IN ('log', 'report', 'trace', 'screenshot', 'video', 'data')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test suite collections (grouping of test cases)
CREATE TABLE IF NOT EXISTS public.test_suite_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    test_ids UUID[] NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test execution workers (for distributed execution)
CREATE TABLE IF NOT EXISTS public.test_execution_workers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id TEXT NOT NULL UNIQUE,
    worker_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    capabilities JSONB DEFAULT '{}',
    current_load INTEGER DEFAULT 0,
    max_load INTEGER DEFAULT 10,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test execution metrics (performance tracking)
CREATE TABLE IF NOT EXISTS public.test_execution_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    run_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,6) NOT NULL,
    metric_unit TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_run_configs_user_id ON public.test_run_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_test_run_configs_is_template ON public.test_run_configs(is_template);
CREATE INDEX IF NOT EXISTS idx_test_run_configs_is_public ON public.test_run_configs(is_public);

CREATE INDEX IF NOT EXISTS idx_test_run_queue_status ON public.test_run_queue(status);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_priority ON public.test_run_queue(priority);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_scheduled_at ON public.test_run_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_user_id ON public.test_run_queue(user_id);

CREATE INDEX IF NOT EXISTS idx_test_run_schedules_user_id ON public.test_run_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_test_run_schedules_is_active ON public.test_run_schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_test_run_schedules_next_run_at ON public.test_run_schedules(next_run_at);

CREATE INDEX IF NOT EXISTS idx_test_run_artifacts_run_id ON public.test_run_artifacts(run_id);
CREATE INDEX IF NOT EXISTS idx_test_run_artifacts_artifact_type ON public.test_run_artifacts(artifact_type);

CREATE INDEX IF NOT EXISTS idx_test_suite_collections_user_id ON public.test_suite_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_test_suite_collections_is_public ON public.test_suite_collections(is_public);
CREATE INDEX IF NOT EXISTS idx_test_suite_collections_is_featured ON public.test_suite_collections(is_featured);

CREATE INDEX IF NOT EXISTS idx_test_execution_workers_status ON public.test_execution_workers(status);
CREATE INDEX IF NOT EXISTS idx_test_execution_workers_last_heartbeat ON public.test_execution_workers(last_heartbeat);

CREATE INDEX IF NOT EXISTS idx_test_execution_metrics_run_id ON public.test_execution_metrics(run_id);
CREATE INDEX IF NOT EXISTS idx_test_execution_metrics_test_id ON public.test_execution_metrics(test_id);
CREATE INDEX IF NOT EXISTS idx_test_execution_metrics_metric_name ON public.test_execution_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_test_execution_metrics_timestamp ON public.test_execution_metrics(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE public.test_run_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_run_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_run_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_run_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_suite_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_execution_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_execution_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for test_run_configs
CREATE POLICY "Users can view their own test run configs" ON public.test_run_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test run configs" ON public.test_run_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test run configs" ON public.test_run_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test run configs" ON public.test_run_configs
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view public test run configs" ON public.test_run_configs
    FOR SELECT USING (is_public = true);

-- RLS Policies for test_run_queue
CREATE POLICY "Users can view their own queue items" ON public.test_run_queue
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queue items" ON public.test_run_queue
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own queue items" ON public.test_run_queue
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own queue items" ON public.test_run_queue
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for test_run_schedules
CREATE POLICY "Users can view their own schedules" ON public.test_run_schedules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedules" ON public.test_run_schedules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules" ON public.test_run_schedules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules" ON public.test_run_schedules
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for test_run_artifacts
CREATE POLICY "Users can view artifacts of their runs" ON public.test_run_artifacts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = test_run_artifacts.run_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert artifacts for their runs" ON public.test_run_artifacts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = test_run_artifacts.run_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for test_suite_collections
CREATE POLICY "Users can view their own collections" ON public.test_suite_collections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collections" ON public.test_suite_collections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" ON public.test_suite_collections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" ON public.test_suite_collections
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view public collections" ON public.test_suite_collections
    FOR SELECT USING (is_public = true);

-- RLS Policies for test_execution_workers (admin only)
CREATE POLICY "Admins can manage workers" ON public.test_execution_workers
    FOR ALL TO service_role USING (true);

-- RLS Policies for test_execution_metrics
CREATE POLICY "Users can view metrics of their runs" ON public.test_execution_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = test_execution_metrics.run_id 
            AND user_id = auth.uid()
        )
    );

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_test_run_configs_updated_at 
    BEFORE UPDATE ON public.test_run_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_run_schedules_updated_at 
    BEFORE UPDATE ON public.test_run_schedules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_suite_collections_updated_at 
    BEFORE UPDATE ON public.test_suite_collections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_execution_workers_updated_at 
    BEFORE UPDATE ON public.test_execution_workers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample test run configurations
INSERT INTO public.test_run_configs (name, description, user_id, test_ids, execution_mode, configuration, is_template) VALUES
('5G NR Basic Tests', 'Basic 5G NR initial access and handover tests', 'mock-user-id', 
 ARRAY(SELECT id FROM public.test_cases WHERE category = '5G_NR' LIMIT 5), 
 'simulation', 
 '{"time_acceleration": 2, "log_level": "detailed"}', 
 true),
('LTE Performance Tests', 'LTE performance and stress tests', 'mock-user-id',
 ARRAY(SELECT id FROM public.test_cases WHERE category = '4G_LTE' AND test_type = 'performance' LIMIT 3),
 'realtime',
 '{"time_acceleration": 1, "log_level": "verbose"}',
 true),
('Security Test Suite', 'Comprehensive security testing across all protocols', 'mock-user-id',
 ARRAY(SELECT id FROM public.test_cases WHERE test_type = 'security' LIMIT 10),
 'simulation',
 '{"time_acceleration": 3, "log_level": "detailed", "capture_mode": "full"}',
 true);

-- Insert some sample test suite collections
INSERT INTO public.test_suite_collections (name, description, user_id, test_ids, tags, is_public, is_featured) VALUES
('5G NR Complete Suite', 'Complete 5G NR test case collection', 'mock-user-id',
 ARRAY(SELECT id FROM public.test_cases WHERE category = '5G_NR'),
 ARRAY['5G', 'NR', 'complete', 'professional'],
 true, true),
('LTE Core Tests', 'Essential LTE test cases', 'mock-user-id',
 ARRAY(SELECT id FROM public.test_cases WHERE category = '4G_LTE' AND complexity IN ('beginner', 'intermediate')),
 ARRAY['LTE', '4G', 'core', 'essential'],
 true, false),
('Performance Benchmark', 'Performance testing across all protocols', 'mock-user-id',
 ARRAY(SELECT id FROM public.test_cases WHERE test_type = 'performance'),
 ARRAY['performance', 'benchmark', 'all-protocols'],
 true, true);

-- Insert sample test execution worker
INSERT INTO public.test_execution_workers (worker_id, worker_name, status, capabilities, max_load) VALUES
('worker-001', 'Primary Test Executor', 'active', 
 '{"protocols": ["5G_NR", "4G_LTE", "IMS_SIP"], "execution_modes": ["simulation", "realtime", "batch"]}',
 10);

-- Create a function to calculate next run time for cron expressions
CREATE OR REPLACE FUNCTION calculate_next_cron_run(cron_expr TEXT, from_time TIMESTAMP WITH TIME ZONE DEFAULT NOW())
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
    parts TEXT[];
    minute_part TEXT;
    hour_part TEXT;
    day_part TEXT;
    month_part TEXT;
    weekday_part TEXT;
    next_run TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Parse cron expression (simplified implementation)
    parts := string_to_array(cron_expr, ' ');
    
    IF array_length(parts, 1) != 5 THEN
        RAISE EXCEPTION 'Invalid cron expression: %', cron_expr;
    END IF;
    
    minute_part := parts[1];
    hour_part := parts[2];
    day_part := parts[3];
    month_part := parts[4];
    weekday_part := parts[5];
    
    -- Simplified calculation - in production, use a proper cron parser
    next_run := from_time + INTERVAL '1 day';
    
    RETURN next_run;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update next run times for active schedules
CREATE OR REPLACE FUNCTION update_schedule_next_runs()
RETURNS VOID AS $$
BEGIN
    UPDATE public.test_run_schedules 
    SET next_run_at = calculate_next_cron_run(cron_expression, COALESCE(last_run_at, NOW()))
    WHERE is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create a view for test suite statistics
CREATE OR REPLACE VIEW public.test_suite_stats AS
SELECT 
    tc.category,
    tc.test_type,
    tc.complexity,
    COUNT(*) as test_count,
    AVG(tc.duration_minutes) as avg_duration,
    COUNT(CASE WHEN tc.is_premium THEN 1 END) as premium_count,
    COUNT(CASE WHEN tc.is_featured THEN 1 END) as featured_count
FROM public.test_cases tc
WHERE tc.is_active = true
GROUP BY tc.category, tc.test_type, tc.complexity;

-- Create a view for test execution statistics
CREATE OR REPLACE VIEW public.test_execution_stats AS
SELECT 
    DATE_TRUNC('day', tce.created_at) as execution_date,
    COUNT(*) as total_runs,
    COUNT(CASE WHEN tce.status = 'completed' THEN 1 END) as completed_runs,
    COUNT(CASE WHEN tce.status = 'failed' THEN 1 END) as failed_runs,
    AVG(EXTRACT(EPOCH FROM (tce.end_time - tce.start_time))/60) as avg_duration_minutes
FROM public.test_case_executions tce
WHERE tce.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', tce.created_at)
ORDER BY execution_date DESC;

-- Grant permissions
GRANT SELECT ON public.test_suite_stats TO authenticated;
GRANT SELECT ON public.test_execution_stats TO authenticated;

-- Add comments
COMMENT ON TABLE public.test_run_configs IS 'Test run configurations for reusable test execution setups';
COMMENT ON TABLE public.test_run_queue IS 'Queue for managing test execution order and priority';
COMMENT ON TABLE public.test_run_schedules IS 'Scheduled test executions with cron expressions';
COMMENT ON TABLE public.test_run_artifacts IS 'Files and artifacts generated during test execution';
COMMENT ON TABLE public.test_suite_collections IS 'Collections of test cases for organization';
COMMENT ON TABLE public.test_execution_workers IS 'Test execution workers for distributed processing';
COMMENT ON TABLE public.test_execution_metrics IS 'Performance metrics collected during test execution';

COMMENT ON VIEW public.test_suite_stats IS 'Statistics about test cases by category, type, and complexity';
COMMENT ON VIEW public.test_execution_stats IS 'Statistics about test executions over time';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Test Suites enhancements migration completed successfully!';
    RAISE NOTICE '📊 Created 7 new tables for test suite management';
    RAISE NOTICE '🔒 Enabled Row Level Security on all new tables';
    RAISE NOTICE '📈 Created performance indexes and views';
    RAISE NOTICE '🎯 Inserted sample data for testing';
END $$;