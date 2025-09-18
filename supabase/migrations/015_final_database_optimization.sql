-- ==============================================
-- 5GLabX Platform - Final Database Optimization
-- Final optimizations and cleanup for production readiness
-- ==============================================

-- ==============================================
-- 1. CREATE MISSING UTILITY FUNCTIONS
-- ==============================================

-- Function to get test case execution history
CREATE OR REPLACE FUNCTION get_test_execution_history(
    user_uuid UUID,
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    execution_id UUID,
    test_case_name TEXT,
    test_case_id TEXT,
    status TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    progress_percentage DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tce.id,
        tc.name,
        tc.test_case_id,
        tce.status,
        tce.start_time,
        tce.end_time,
        tce.duration_ms,
        tce.progress_percentage
    FROM public.test_case_executions tce
    JOIN public.test_cases tc ON tce.test_case_id = tc.id
    WHERE tce.user_id = user_uuid
    ORDER BY tce.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics(user_uuid UUID)
RETURNS TABLE (
    total_executions BIGINT,
    successful_executions BIGINT,
    failed_executions BIGINT,
    total_duration_ms BIGINT,
    avg_execution_time NUMERIC,
    success_rate NUMERIC,
    last_execution TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_executions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_executions,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_executions,
        COALESCE(SUM(duration_ms), 0) as total_duration_ms,
        ROUND(AVG(duration_ms), 2) as avg_execution_time,
        ROUND(
          CASE WHEN COUNT(*) = 0 THEN 0
               ELSE (COUNT(CASE WHEN status = 'completed' THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0)) * 100
          END, 2
        ) as success_rate,
        MAX(start_time) as last_execution
    FROM public.test_case_executions
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get test case popularity
CREATE OR REPLACE FUNCTION get_test_case_popularity()
RETURNS TABLE (
    test_case_id UUID,
    test_case_name TEXT,
    category TEXT,
    protocol TEXT,
    execution_count BIGINT,
    success_rate NUMERIC,
    avg_duration NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.id,
        tc.name,
        tc.category,
        tc.protocol,
        COUNT(tce.id) as execution_count,
        ROUND(
          CASE WHEN COUNT(tce.id) = 0 THEN 0
               ELSE (COUNT(CASE WHEN tce.status = 'completed' THEN 1 END)::NUMERIC / NULLIF(COUNT(tce.id), 0)) * 100
          END, 2
        ) as success_rate,
        ROUND(AVG(tce.duration_ms), 2) as avg_duration
    FROM public.test_cases tc
    LEFT JOIN public.test_case_executions tce ON tc.id = tce.test_case_id
    WHERE tc.is_active = true
    GROUP BY tc.id, tc.name, tc.category, tc.protocol
    ORDER BY execution_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get system performance metrics
CREATE OR REPLACE FUNCTION get_system_performance_metrics(
    days_back INTEGER DEFAULT 7
)
RETURNS TABLE (
    metric_name TEXT,
    metric_value NUMERIC,
    metric_unit TEXT,
    metric_timestamp TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'total_executions'::TEXT,
        COUNT(*)::NUMERIC,
        'count'::TEXT,
        NOW()
    FROM public.test_case_executions
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
    
    UNION ALL
    
    SELECT 
        'successful_executions'::TEXT,
        COUNT(*)::NUMERIC,
        'count'::TEXT,
        NOW()
    FROM public.test_case_executions
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
    AND status = 'completed'
    
    UNION ALL
    
    SELECT 
        'failed_executions'::TEXT,
        COUNT(*)::NUMERIC,
        'count'::TEXT,
        NOW()
    FROM public.test_case_executions
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
    AND status = 'failed'
    
    UNION ALL
    
    SELECT 
        'avg_execution_time'::TEXT,
        ROUND(AVG(duration_ms), 2),
        'milliseconds'::TEXT,
        NOW()
    FROM public.test_case_executions
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
    AND status = 'completed'
    
    UNION ALL
    
    SELECT 
        'active_users'::TEXT,
        COUNT(DISTINCT user_id)::NUMERIC,
        'count'::TEXT,
        NOW()
    FROM public.test_case_executions
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 2. CREATE ADDITIONAL VIEWS
-- ==============================================

-- View for test case execution summary with user details
CREATE OR REPLACE VIEW public.test_execution_summary_detailed AS
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
    tc.test_case_id,
    tc.category,
    tc.protocol,
    tc.complexity,
    u.email as user_email,
    u.full_name as user_name,
    u.subscription_tier,
    sp.name as subscription_plan_name
FROM public.test_case_executions tce
JOIN public.test_cases tc ON tce.test_case_id = tc.id
JOIN public.users u ON tce.user_id = u.id
LEFT JOIN public.subscription_plans sp ON u.subscription_tier = sp.name;

-- View for test case performance by category
CREATE OR REPLACE VIEW public.test_case_performance_by_category AS
SELECT 
    tc.category,
    COUNT(tce.id) as total_executions,
    COUNT(CASE WHEN tce.status = 'completed' THEN 1 END) as successful_executions,
    COUNT(CASE WHEN tce.status = 'failed' THEN 1 END) as failed_executions,
    ROUND(AVG(tce.duration_ms), 2) as avg_duration_ms,
    ROUND(
      CASE WHEN COUNT(tce.id) = 0 THEN 0
           ELSE (COUNT(CASE WHEN tce.status = 'completed' THEN 1 END)::NUMERIC / NULLIF(COUNT(tce.id), 0)) * 100
      END, 2
    ) as success_rate,
    ROUND(MIN(tce.duration_ms), 2) as min_duration_ms,
    ROUND(MAX(tce.duration_ms), 2) as max_duration_ms
FROM public.test_cases tc
LEFT JOIN public.test_case_executions tce ON tc.id = tce.test_case_id
WHERE tc.is_active = true
GROUP BY tc.category
ORDER BY total_executions DESC;

-- View for user activity summary
CREATE OR REPLACE VIEW public.user_activity_summary AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.subscription_tier,
    u.created_at as user_created_at,
    u.last_login_at,
    COUNT(tce.id) as total_executions,
    COUNT(CASE WHEN tce.status = 'completed' THEN 1 END) as successful_executions,
    COUNT(CASE WHEN tce.status = 'failed' THEN 1 END) as failed_executions,
    MAX(tce.created_at) as last_execution,
    ROUND(
      CASE WHEN COUNT(tce.id) = 0 THEN 0
           ELSE (COUNT(CASE WHEN tce.status = 'completed' THEN 1 END)::NUMERIC / NULLIF(COUNT(tce.id), 0)) * 100
      END, 2
    ) as success_rate
FROM public.users u
LEFT JOIN public.test_case_executions tce ON u.id = tce.user_id
GROUP BY u.id, u.email, u.full_name, u.subscription_tier, u.created_at, u.last_login_at
ORDER BY total_executions DESC;

-- View for system health dashboard
CREATE OR REPLACE VIEW public.system_health_dashboard AS
SELECT 
    'active_users' as metric_name,
    COUNT(DISTINCT user_id) as metric_value,
    'count' as metric_unit,
    NOW() as metric_timestamp
FROM public.test_case_executions
WHERE created_at >= NOW() - INTERVAL '1 day'

UNION ALL

SELECT 
    'running_executions' as metric_name,
    COUNT(*) as metric_value,
    'count' as metric_unit,
    NOW() as metric_timestamp
FROM public.test_case_executions
WHERE status = 'running'

UNION ALL

SELECT 
    'queued_executions' as metric_name,
    COUNT(*) as metric_value,
    'count' as metric_unit,
    NOW() as metric_timestamp
FROM public.test_run_queue
WHERE status = 'queued'

UNION ALL

SELECT 
    'active_workers' as metric_name,
    COUNT(*) as metric_value,
    'count' as metric_unit,
    NOW() as metric_timestamp
FROM public.test_execution_workers
WHERE status = 'active'

UNION ALL

SELECT 
    'avg_execution_time' as metric_name,
    ROUND(AVG(duration_ms), 2) as metric_value,
    'milliseconds' as metric_unit,
    NOW() as metric_timestamp
FROM public.test_case_executions
WHERE status = 'completed'
AND created_at >= NOW() - INTERVAL '1 day';

-- ==============================================
-- 3. CREATE ADDITIONAL INDEXES FOR PERFORMANCE
-- ==============================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id_status ON public.test_case_executions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_created_at_status ON public.test_case_executions(created_at, status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_duration_ms ON public.test_case_executions(duration_ms);
CREATE INDEX IF NOT EXISTS idx_test_cases_category_protocol ON public.test_cases(category, protocol);
CREATE INDEX IF NOT EXISTS idx_test_cases_complexity_is_active ON public.test_cases(complexity, is_active);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON public.users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_test_run_id_layer ON public.decoded_messages(test_run_id, layer);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_timestamp_layer ON public.decoded_messages(timestamp_us, layer);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_status_priority ON public.test_run_queue(status, priority);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_scheduled_at ON public.test_run_queue(scheduled_at);

-- ==============================================
-- 4. CREATE MATERIALIZED VIEWS FOR ANALYTICS
-- ==============================================

-- Materialized view for daily execution statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS public.daily_execution_stats AS
SELECT 
    DATE(created_at) as execution_date,
    COUNT(*) as total_executions,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_executions,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_executions,
    COUNT(CASE WHEN status = 'running' THEN 1 END) as running_executions,
    ROUND(AVG(duration_ms), 2) as avg_duration_ms,
    ROUND(
      CASE WHEN COUNT(*) = 0 THEN 0
           ELSE (COUNT(CASE WHEN status = 'completed' THEN 1 END)::NUMERIC / NULLIF(COUNT(*), 0)) * 100
      END, 2
    ) as success_rate
FROM public.test_case_executions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY execution_date DESC;

-- Materialized view for test case popularity
CREATE MATERIALIZED VIEW IF NOT EXISTS public.test_case_popularity_stats AS
SELECT 
    tc.id,
    tc.name,
    tc.category,
    tc.protocol,
    tc.complexity,
    COUNT(tce.id) as execution_count,
    COUNT(CASE WHEN tce.status = 'completed' THEN 1 END) as successful_executions,
    ROUND((COUNT(CASE WHEN tce.status = 'completed' THEN 1 END)::NUMERIC / COUNT(tce.id)) * 100, 2) as success_rate,
    ROUND(AVG(tce.duration_ms), 2) as avg_duration_ms,
    MAX(tce.created_at) as last_execution
FROM public.test_cases tc
LEFT JOIN public.test_case_executions tce ON tc.id = tce.test_case_id
WHERE tc.is_active = true
GROUP BY tc.id, tc.name, tc.category, tc.protocol, tc.complexity
ORDER BY execution_count DESC;

-- Create indexes on materialized views
CREATE INDEX IF NOT EXISTS idx_daily_execution_stats_date ON public.daily_execution_stats(execution_date);
CREATE INDEX IF NOT EXISTS idx_test_case_popularity_stats_category ON public.test_case_popularity_stats(category);
CREATE INDEX IF NOT EXISTS idx_test_case_popularity_stats_execution_count ON public.test_case_popularity_stats(execution_count);

-- ==============================================
-- 5. CREATE REFRESH FUNCTIONS FOR MATERIALIZED VIEWS
-- ==============================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW public.daily_execution_stats;
    REFRESH MATERIALIZED VIEW public.test_case_popularity_stats;
    
    RAISE NOTICE 'Analytics views refreshed successfully';
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 6. CREATE CLEANUP FUNCTIONS
-- ==============================================

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data(
    days_to_keep INTEGER DEFAULT 90
)
RETURNS TABLE (
    table_name TEXT,
    deleted_count INTEGER
) AS $$
DECLARE
    deleted_executions INTEGER;
    deleted_messages INTEGER;
    deleted_logs INTEGER;
BEGIN
    -- Clean up old test executions
    DELETE FROM public.test_case_executions
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    AND status IN ('completed', 'failed', 'cancelled');
    
    GET DIAGNOSTICS deleted_executions = ROW_COUNT;
    
    -- Clean up old decoded messages
    DELETE FROM public.decoded_messages
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_messages = ROW_COUNT;
    
    -- Clean up old log files
    DELETE FROM public.log_files
    WHERE created_at < NOW() - INTERVAL '1 day' * days_to_keep
    AND processing_status = 'completed';
    
    GET DIAGNOSTICS deleted_logs = ROW_COUNT;
    
    RETURN QUERY
    SELECT 'test_case_executions'::TEXT, deleted_executions
    UNION ALL
    SELECT 'decoded_messages'::TEXT, deleted_messages
    UNION ALL
    SELECT 'log_files'::TEXT, deleted_logs;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 7. GRANT PERMISSIONS
-- ==============================================

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION get_test_execution_history(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_statistics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_test_case_popularity() TO authenticated;
GRANT EXECUTE ON FUNCTION get_system_performance_metrics(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_analytics_views() TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_data(INTEGER) TO service_role;

-- Grant permissions for views
GRANT SELECT ON public.test_execution_summary_detailed TO authenticated;
GRANT SELECT ON public.test_case_performance_by_category TO authenticated;
GRANT SELECT ON public.user_activity_summary TO authenticated;
GRANT SELECT ON public.system_health_dashboard TO authenticated;

-- Grant permissions for materialized views
GRANT SELECT ON public.daily_execution_stats TO authenticated;
GRANT SELECT ON public.test_case_popularity_stats TO authenticated;

-- ==============================================
-- 8. CREATE SCHEDULED JOBS (if using pg_cron)
-- ==============================================

-- Note: These require pg_cron extension to be enabled
-- Uncomment if pg_cron is available

/*
-- Schedule daily refresh of analytics views
SELECT cron.schedule('refresh-analytics-views', '0 2 * * *', 'SELECT refresh_analytics_views();');

-- Schedule weekly cleanup of old data
SELECT cron.schedule('cleanup-old-data', '0 3 * * 0', 'SELECT cleanup_old_data(90);');
*/

-- ==============================================
-- 9. FINAL OPTIMIZATION SETTINGS
-- ==============================================

-- Update table statistics for better query planning
ANALYZE public.test_cases;
ANALYZE public.test_case_executions;
ANALYZE public.decoded_messages;
ANALYZE public.users;
ANALYZE public.test_run_queue;
ANALYZE public.test_execution_workers;

-- ==============================================
-- 10. SUCCESS MESSAGE
-- ==============================================

DO $$
DECLARE
    function_count INTEGER;
    view_count INTEGER;
    materialized_view_count INTEGER;
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO function_count FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    SELECT COUNT(*) INTO view_count FROM pg_views WHERE schemaname = 'public';
    SELECT COUNT(*) INTO materialized_view_count FROM pg_matviews WHERE schemaname = 'public';
    SELECT COUNT(*) INTO index_count FROM pg_indexes WHERE schemaname = 'public';
    
    RAISE NOTICE '✅ Final database optimization completed successfully!';
    RAISE NOTICE '⚙️ Database Functions: %', function_count;
    RAISE NOTICE '👁️ Views: %', view_count;
    RAISE NOTICE '📊 Materialized Views: %', materialized_view_count;
    RAISE NOTICE '🔍 Indexes: %', index_count;
    RAISE NOTICE '🚀 Database is fully optimized and production-ready!';
END $$;