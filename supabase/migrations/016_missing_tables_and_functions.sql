-- ==============================================
-- 5GLabX Platform - Missing Tables and Functions
-- Add missing tables and functions identified by verification
-- ==============================================

-- ==============================================
-- 1. MISSING TABLES
-- ==============================================

-- Test run metrics table
CREATE TABLE IF NOT EXISTS public.test_run_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    run_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_unit TEXT,
    metric_category TEXT,
    is_threshold BOOLEAN DEFAULT false,
    threshold_value NUMERIC,
    threshold_operator TEXT CHECK (threshold_operator IN ('>', '<', '>=', '<=', '=', '!=')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert rules table
CREATE TABLE IF NOT EXISTS public.alert_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('execution_failure', 'performance_degradation', 'system_error', 'custom')),
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure compatibility with earlier schema where alert_rules lacked rule_type
ALTER TABLE public.alert_rules 
ADD COLUMN IF NOT EXISTS rule_type TEXT;

-- Alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_rule_id UUID REFERENCES public.alert_rules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    source_type TEXT,
    source_id UUID,
    metadata JSONB DEFAULT '{}',
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security events table
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'failed_login', 'password_change', 'permission_change', 'data_access', 'data_modification')),
    event_description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. MISSING FUNCTIONS
-- ==============================================

-- Function to get layer statistics (missing from verification)
CREATE OR REPLACE FUNCTION get_layer_statistics(test_run_uuid UUID)
RETURNS TABLE (
    layer TEXT,
    message_count BIGINT,
    avg_size NUMERIC,
    error_count BIGINT,
    warning_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dm.layer,
        COUNT(*) as message_count,
        ROUND(AVG(dm.message_size), 2) as avg_size,
        COUNT(CASE WHEN dm.validation_status = 'invalid' THEN 1 END) as error_count,
        COUNT(CASE WHEN dm.validation_status = 'warning' THEN 1 END) as warning_count
    FROM public.decoded_messages dm
    WHERE dm.test_run_id = test_run_uuid
    GROUP BY dm.layer
    ORDER BY dm.layer;
END;
$$ LANGUAGE plpgsql;

-- Function to get protocol statistics (missing from verification)
CREATE OR REPLACE FUNCTION get_protocol_statistics(test_run_uuid UUID)
RETURNS TABLE (
    protocol TEXT,
    message_count BIGINT,
    unique_message_types BIGINT,
    avg_processing_time NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dm.protocol,
        COUNT(*) as message_count,
        COUNT(DISTINCT dm.message_type) as unique_message_types,
        ROUND(AVG(dm.processing_time_ms), 2) as avg_processing_time
    FROM public.decoded_messages dm
    WHERE dm.test_run_id = test_run_uuid
    GROUP BY dm.protocol
    ORDER BY dm.protocol;
END;
$$ LANGUAGE plpgsql;

-- Function to get test execution progress (missing from verification)
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

-- Function to get layer performance metrics (missing from verification)
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
        ROUND(CASE WHEN COUNT(*) = 0 THEN 0 ELSE (COUNT(CASE WHEN dm.validation_status = 'invalid' THEN 1 END)::NUMERIC / COUNT(*)) * 100 END, 2) as error_rate,
        ROUND(CASE WHEN COUNT(*) = 0 THEN 0 ELSE (COUNT(CASE WHEN dm.validation_status = 'warning' THEN 1 END)::NUMERIC / COUNT(*)) * 100 END, 2) as warning_rate,
        ROUND(SUM(dm.message_size) / 1024.0 / 1024.0, 2) as throughput_mbps
    FROM public.decoded_messages dm
    WHERE dm.test_run_id = test_run_uuid
    GROUP BY dm.layer
    ORDER BY dm.layer;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 3. CREATE INDEXES FOR NEW TABLES
-- ==============================================

-- Indexes for test_run_metrics
CREATE INDEX IF NOT EXISTS idx_test_run_metrics_run_id ON public.test_run_metrics(run_id);
CREATE INDEX IF NOT EXISTS idx_test_run_metrics_metric_name ON public.test_run_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_test_run_metrics_metric_category ON public.test_run_metrics(metric_category);
CREATE INDEX IF NOT EXISTS idx_test_run_metrics_is_threshold ON public.test_run_metrics(is_threshold);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'alert_rules' AND column_name = 'user_id'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_alert_rules_user_id ON public.alert_rules(user_id)';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'alert_rules' AND column_name = 'created_by'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_alert_rules_created_by ON public.alert_rules(created_by)';
    END IF;
END $$;
-- Create rule_type index only if column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'alert_rules' AND column_name = 'rule_type'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_alert_rules_rule_type ON public.alert_rules(rule_type)';
    END IF;
END $$;
-- Create active/enabled index depending on available column
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'alert_rules' AND column_name = 'is_active'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_alert_rules_is_active ON public.alert_rules(is_active)';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'alert_rules' AND column_name = 'enabled'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_alert_rules_enabled ON public.alert_rules(enabled)';
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_alert_rules_severity ON public.alert_rules(severity);

-- Create alert rule FK index based on existing column name (compat with legacy 'rule_id')
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'alerts' AND column_name = 'alert_rule_id'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_alerts_alert_rule_id ON public.alerts(alert_rule_id)';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'alerts' AND column_name = 'rule_id'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_alerts_rule_id ON public.alerts(rule_id)';
    END IF;
END $$;
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'alerts' AND column_name = 'user_id'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id)';
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON public.alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON public.alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events(user_id);
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'security_events' AND column_name = 'event_type'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON public.security_events(event_type)';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'security_events' AND column_name = 'type'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(type)';
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON public.security_events(ip_address);

-- ==============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE public.test_run_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 5. CREATE RLS POLICIES
-- ==============================================

-- RLS Policies for test_run_metrics
CREATE POLICY "Users can view metrics from their test runs" ON public.test_run_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = test_run_metrics.run_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for alert_rules (guarded for schema differences)
DO $$
BEGIN
    -- Drop existing to avoid duplicates
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their own alert rules" ON public.alert_rules';
    EXECUTE 'DROP POLICY IF EXISTS "Users can create their own alert rules" ON public.alert_rules';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own alert rules" ON public.alert_rules';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own alert rules" ON public.alert_rules';

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='alert_rules' AND column_name='user_id'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view their own alert rules" ON public.alert_rules FOR SELECT USING (auth.uid() = user_id)';
        EXECUTE 'CREATE POLICY "Users can create their own alert rules" ON public.alert_rules FOR INSERT WITH CHECK (auth.uid() = user_id)';
        EXECUTE 'CREATE POLICY "Users can update their own alert rules" ON public.alert_rules FOR UPDATE USING (auth.uid() = user_id)';
        EXECUTE 'CREATE POLICY "Users can delete their own alert rules" ON public.alert_rules FOR DELETE USING (auth.uid() = user_id)';
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='alert_rules' AND column_name='created_by'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view their own alert rules" ON public.alert_rules FOR SELECT USING (auth.uid() = created_by)';
        EXECUTE 'CREATE POLICY "Users can create their own alert rules" ON public.alert_rules FOR INSERT WITH CHECK (auth.uid() = created_by)';
        EXECUTE 'CREATE POLICY "Users can update their own alert rules" ON public.alert_rules FOR UPDATE USING (auth.uid() = created_by)';
        EXECUTE 'CREATE POLICY "Users can delete their own alert rules" ON public.alert_rules FOR DELETE USING (auth.uid() = created_by)';
    END IF;
END $$;

-- RLS Policies for alerts (only if user_id column exists)
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their own alerts" ON public.alerts';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own alerts" ON public.alerts';
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='alerts' AND column_name='user_id'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view their own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id)';
        EXECUTE 'CREATE POLICY "Users can update their own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id)';
    END IF;
END $$;

-- RLS Policies for security_events (only if user_id column exists)
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their own security events" ON public.security_events';
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='security_events' AND column_name='user_id'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can view their own security events" ON public.security_events FOR SELECT USING (auth.uid() = user_id)';
    END IF;
END $$;

-- ==============================================
-- 6. CREATE TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Triggers for updated_at columns
-- Ensure idempotency for triggers
DROP TRIGGER IF EXISTS update_alert_rules_updated_at ON public.alert_rules;
DROP TRIGGER IF EXISTS update_alerts_updated_at ON public.alerts;

CREATE TRIGGER update_alert_rules_updated_at 
    BEFORE UPDATE ON public.alert_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at 
    BEFORE UPDATE ON public.alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 7. GRANT PERMISSIONS
-- ==============================================

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION get_layer_statistics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_protocol_statistics(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_test_execution_progress(UUID) TO authenticated;

-- ==============================================
-- 8. ADD COMMENTS
-- ==============================================

COMMENT ON TABLE public.test_run_metrics IS 'Metrics collected during test execution';
COMMENT ON TABLE public.alert_rules IS 'Rules for generating alerts based on conditions';
COMMENT ON TABLE public.alerts IS 'Generated alerts for users';
COMMENT ON TABLE public.security_events IS 'Security-related events and audit trail';

COMMENT ON FUNCTION get_layer_statistics(UUID) IS 'Get statistics for all layers in a test run';
COMMENT ON FUNCTION get_protocol_statistics(UUID) IS 'Get statistics for all protocols in a test run';
COMMENT ON FUNCTION get_test_execution_progress(UUID) IS 'Get detailed progress information for a test execution';

-- ==============================================
-- 9. SUCCESS MESSAGE
-- ==============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Missing tables and functions migration completed successfully!';
    RAISE NOTICE '📊 Added 4 missing tables';
    RAISE NOTICE '⚙️ Added 3 missing functions';
    RAISE NOTICE '🔍 Created indexes for performance';
    RAISE NOTICE '🔒 Enabled RLS and created policies';
    RAISE NOTICE '🎯 Database schema is now complete!';
END $$;