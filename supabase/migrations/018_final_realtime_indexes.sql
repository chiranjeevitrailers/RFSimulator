-- ==============================================
-- 5GLabX Platform - Final Real-time Indexes
-- Add missing index for test_case_messages timestamp
-- ==============================================

-- Missing index for test_case_messages timestamp
CREATE INDEX IF NOT EXISTS idx_test_case_messages_timestamp ON public.test_case_messages(timestamp_ms);

-- Additional real-time simulation indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_test_case_messages_test_case_timestamp ON public.test_case_messages(test_case_id, timestamp_ms);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_layer_timestamp ON public.test_case_messages(layer, timestamp_ms);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_protocol_timestamp ON public.test_case_messages(protocol, timestamp_ms);

-- Indexes for real-time message processing
CREATE INDEX IF NOT EXISTS idx_decoded_messages_run_timestamp ON public.decoded_messages(test_run_id, timestamp_us);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_layer_timestamp ON public.decoded_messages(layer, timestamp_us);
CREATE INDEX IF NOT EXISTS idx_decoded_messages_protocol_timestamp ON public.decoded_messages(protocol, timestamp_us);

-- Indexes for test run queue performance
CREATE INDEX IF NOT EXISTS idx_test_run_queue_user_status_priority ON public.test_run_queue(user_id, status, priority);
CREATE INDEX IF NOT EXISTS idx_test_run_queue_scheduled_status ON public.test_run_queue(scheduled_at, status);

-- Indexes for real-time metrics
CREATE INDEX IF NOT EXISTS idx_test_run_metrics_run_metric ON public.test_run_metrics(run_id, metric_name);
CREATE INDEX IF NOT EXISTS idx_test_run_metrics_category ON public.test_run_metrics(metric_category);

-- Update table statistics
ANALYZE public.test_case_messages;
ANALYZE public.decoded_messages;
ANALYZE public.test_run_queue;
ANALYZE public.test_run_metrics;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Final real-time indexes migration completed successfully!';
    RAISE NOTICE '📈 Added missing timestamp index for test_case_messages';
    RAISE NOTICE '⚡ Added additional performance indexes for real-time simulation';
    RAISE NOTICE '🎯 Database is now 100%% ready for real-time simulation!';
END $$;