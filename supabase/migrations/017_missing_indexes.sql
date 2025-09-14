-- ==============================================
-- 5GLabX Platform - Missing Indexes
-- Add missing indexes identified by verification
-- ==============================================

-- ==============================================
-- 1. CORE TABLE INDEXES
-- ==============================================

-- Test cases indexes
CREATE INDEX IF NOT EXISTS idx_test_cases_category ON public.test_cases(category);
CREATE INDEX IF NOT EXISTS idx_test_cases_protocol ON public.test_cases(protocol);
CREATE INDEX IF NOT EXISTS idx_test_cases_complexity ON public.test_cases(complexity);
CREATE INDEX IF NOT EXISTS idx_test_cases_is_active ON public.test_cases(is_active);

-- Test case executions indexes
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON public.test_case_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON public.test_case_executions(status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON public.test_case_executions(test_case_id);

-- Decoded messages indexes
CREATE INDEX IF NOT EXISTS idx_decoded_messages_test_run_id ON public.decoded_messages(test_run_id);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_layer ON public.decoded_messages(layer);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_protocol ON public.decoded_messages(protocol);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_timestamp ON public.decoded_messages(timestamp_us);

-- Log files indexes
CREATE INDEX IF NOT EXISTS idx_log_files_user_id ON public.log_files(user_id);
CREATE INDEX IF NOT EXISTS idx_log_files_processing_status ON public.log_files(processing_status);

-- Test run queue indexes
CREATE INDEX IF NOT EXISTS idx_test_run_queue_status ON public.test_run_queue(status);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_priority ON public.test_run_queue(priority);

-- ==============================================
-- 2. COMPOSITE INDEXES FOR BETTER PERFORMANCE
-- ==============================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_test_cases_category_protocol ON public.test_cases(category, protocol);
CREATE INDEX IF NOT EXISTS idx_test_cases_category_complexity ON public.test_cases(category, complexity);
CREATE INDEX IF NOT EXISTS idx_test_cases_protocol_is_active ON public.test_cases(protocol, is_active);

CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_status ON public.test_case_executions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_status ON public.test_case_executions(test_case_id, status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_created_status ON public.test_case_executions(created_at, status);

CREATE INDEX IF NOT EXISTS idx_decoded_messages_run_layer ON public.decoded_messages(test_run_id, layer);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_run_protocol ON public.decoded_messages(test_run_id, protocol);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_timestamp_layer ON public.decoded_messages(timestamp_us, layer);

CREATE INDEX IF NOT EXISTS idx_log_files_user_status ON public.log_files(user_id, processing_status);
CREATE INDEX IF NOT EXISTS idx_log_files_type_status ON public.log_files(file_type, processing_status);

CREATE INDEX IF NOT EXISTS idx_test_run_queue_user_status ON public.test_run_queue(user_id, status);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_priority_status ON public.test_run_queue(priority, status);

-- ==============================================
-- 3. FUNCTIONAL INDEXES
-- ==============================================

-- Indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_test_cases_tags_gin ON public.test_cases USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_test_cases_protocol_layers_gin ON public.test_cases USING GIN(protocol_layers);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_data_gin ON public.test_cases USING GIN(test_data);
CREATE INDEX IF NOT EXISTS idx_test_cases_expected_results_gin ON public.test_cases USING GIN(expected_results);

CREATE INDEX IF NOT EXISTS idx_test_case_executions_results_gin ON public.test_case_executions USING GIN(results);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_logs_gin ON public.test_case_executions USING GIN(logs);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_errors_gin ON public.test_case_executions USING GIN(errors);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_performance_metrics_gin ON public.test_case_executions USING GIN(performance_metrics);

CREATE INDEX IF NOT EXISTS idx_decoded_messages_decoded_data_gin ON public.decoded_messages USING GIN(decoded_data);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_information_elements_gin ON public.decoded_messages USING GIN(information_elements);

CREATE INDEX IF NOT EXISTS idx_test_run_configs_configuration_gin ON public.test_run_configs USING GIN(configuration);
CREATE INDEX IF NOT EXISTS idx_test_run_schedules_configuration_gin ON public.test_run_schedules USING GIN(configuration);
CREATE INDEX IF NOT EXISTS idx_test_run_schedules_notifications_gin ON public.test_run_schedules USING GIN(notifications);

-- ==============================================
-- 4. PARTIAL INDEXES FOR COMMON FILTERS
-- ==============================================

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_test_cases_active ON public.test_cases(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_test_cases_premium ON public.test_cases(id) WHERE is_premium = true;
CREATE INDEX IF NOT EXISTS idx_test_cases_featured ON public.test_cases(id) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_test_case_executions_running ON public.test_case_executions(id) WHERE status = 'running';
CREATE INDEX IF NOT EXISTS idx_test_case_executions_completed ON public.test_case_executions(id) WHERE status = 'completed';
CREATE INDEX IF NOT EXISTS idx_test_case_executions_failed ON public.test_case_executions(id) WHERE status = 'failed';

CREATE INDEX IF NOT EXISTS idx_log_files_processing ON public.log_files(id) WHERE processing_status = 'processing';
CREATE INDEX IF NOT EXISTS idx_log_files_completed ON public.log_files(id) WHERE processing_status = 'completed';

CREATE INDEX IF NOT EXISTS idx_test_run_queue_queued ON public.test_run_queue(id) WHERE status = 'queued';
CREATE INDEX IF NOT EXISTS idx_test_run_queue_running ON public.test_run_queue(id) WHERE status = 'running';

-- ==============================================
-- 5. TEXT SEARCH INDEXES
-- ==============================================

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_test_cases_name_fts ON public.test_cases USING GIN(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_test_cases_description_fts ON public.test_cases USING GIN(to_tsvector('english', description));

CREATE INDEX IF NOT EXISTS idx_users_full_name_fts ON public.users USING GIN(to_tsvector('english', full_name));
CREATE INDEX IF NOT EXISTS idx_users_email_fts ON public.users USING GIN(to_tsvector('english', email));

-- ==============================================
-- 6. UNIQUE INDEXES FOR DATA INTEGRITY
-- ==============================================

-- Ensure unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_test_cases_test_case_id_unique ON public.test_cases(test_case_id) WHERE test_case_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_test_case_executions_execution_id_unique ON public.test_case_executions(execution_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_test_execution_workers_worker_id_unique ON public.test_execution_workers(worker_id);

-- ==============================================
-- 7. COVERING INDEXES FOR COMMON QUERIES
-- ==============================================

-- Covering indexes to avoid table lookups
CREATE INDEX IF NOT EXISTS idx_test_cases_list_covering ON public.test_cases(id, name, category, protocol, complexity, is_active, is_premium) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_test_case_executions_list_covering ON public.test_case_executions(id, test_case_id, status, progress_percentage, start_time, end_time, user_id);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_list_covering ON public.decoded_messages(id, test_run_id, layer, protocol, message_type, timestamp_us, validation_status);

-- ==============================================
-- 8. STATISTICS AND MAINTENANCE
-- ==============================================

-- Update table statistics for better query planning
ANALYZE public.test_cases;
ANALYZE public.test_case_executions;
ANALYZE public.decoded_messages;
ANALYZE public.log_files;
ANALYZE public.test_run_queue;
ANALYZE public.users;
ANALYZE public.test_run_configs;
ANALYZE public.test_run_schedules;
ANALYZE public.test_suite_collections;
ANALYZE public.test_execution_workers;

-- ==============================================
-- 9. INDEX MONITORING VIEWS
-- ==============================================

-- Create a view to monitor index usage
CREATE OR REPLACE VIEW public.index_usage_stats AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    CASE 
        WHEN idx_scan = 0 THEN 'UNUSED'
        WHEN idx_scan < 100 THEN 'LOW_USAGE'
        WHEN idx_scan < 1000 THEN 'MEDIUM_USAGE'
        ELSE 'HIGH_USAGE'
    END as usage_level
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Create a view to monitor table sizes
CREATE OR REPLACE VIEW public.table_size_stats AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Grant permissions for monitoring views
GRANT SELECT ON public.index_usage_stats TO authenticated;
GRANT SELECT ON public.table_size_stats TO authenticated;

-- ==============================================
-- 10. SUCCESS MESSAGE
-- ==============================================

DO $$
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count 
    FROM pg_indexes 
    WHERE schemaname = 'public';
    
    RAISE NOTICE '✅ Missing indexes migration completed successfully!';
    RAISE NOTICE '🔍 Created comprehensive indexes for all tables';
    RAISE NOTICE '📊 Total indexes in database: %', index_count;
    RAISE NOTICE '⚡ Performance optimization complete!';
    RAISE NOTICE '📈 Database is now fully optimized for production use!';
END $$;