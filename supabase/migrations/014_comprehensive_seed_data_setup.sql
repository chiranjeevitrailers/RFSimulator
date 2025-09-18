-- ==============================================
-- 5GLabX Platform - Comprehensive Seed Data Setup
-- Ensure all required seed data is properly configured
-- ==============================================

-- ==============================================
-- 1. TEST CASE CATEGORIES SEED DATA
-- ==============================================

-- Insert test case categories if they don't exist
INSERT INTO public.test_case_categories (name, display_name, description, icon, color, sort_order, is_active) VALUES
('5G_NR', '5G NR', '5G New Radio test cases for 3GPP Release 15+', '📡', '#3B82F6', 1, true),
('4G_LTE', '4G LTE', '4G Long Term Evolution test cases for 3GPP Release 8-14', '📶', '#10B981', 2, true),
('IMS_SIP', 'IMS/SIP', 'IP Multimedia Subsystem and Session Initiation Protocol test cases', '📞', '#8B5CF6', 3, true),
('O_RAN', 'O-RAN', 'Open Radio Access Network test cases for disaggregated RAN', '🌐', '#F59E0B', 4, true),
('NB_IoT', 'NB-IoT', 'Narrowband Internet of Things test cases for IoT connectivity', '🔗', '#06B6D4', 5, true),
('V2X', 'V2X', 'Vehicle-to-Everything communication test cases for automotive', '🚗', '#EF4444', 6, true),
('NTN', 'NTN', 'Non-Terrestrial Networks test cases for satellite communication', '🛰️', '#84CC16', 7, true),
('CUSTOM', 'Custom', 'Custom test cases for specialized scenarios', '⚙️', '#6B7280', 8, true)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- ==============================================
-- 2. SUBSCRIPTION PLANS SEED DATA
-- ==============================================

-- Insert subscription plans if they don't exist
INSERT INTO public.subscription_plans (
    name, display_name, description, price_monthly, price_yearly,
    features, limits, is_active, sort_order
) VALUES
(
    'free', 'Free Plan', 'Basic access to 5GLabX platform with limited test cases',
    0.00, 0.00,
    '["Basic test cases", "Limited executions", "Community support"]'::jsonb,
    '{"max_test_cases": 10, "max_concurrent_executions": 1, "max_storage_gb": 1}'::jsonb,
    true, 1
),
(
    'pro', 'Pro Plan', 'Professional access with advanced test cases and features',
    99.00, 990.00,
    '["All test cases", "Priority execution", "Advanced analytics", "Email support", "API access"]'::jsonb,
    '{"max_test_cases": 100, "max_concurrent_executions": 5, "max_storage_gb": 10}'::jsonb,
    true, 2
),
(
    'enterprise', 'Enterprise Plan', 'Full enterprise access with unlimited resources',
    499.00, 4990.00,
    '["Unlimited test cases", "Unlimited executions", "Custom test cases", "Dedicated support", "SLA guarantee", "On-premise deployment"]'::jsonb,
    '{"max_test_cases": -1, "max_concurrent_executions": -1, "max_storage_gb": 100}'::jsonb,
    true, 3
),
(
    'custom', 'Custom Plan', 'Tailored solution for specific enterprise needs',
    0.00, 0.00,
    '["Custom pricing", "Custom features", "Dedicated support", "Custom SLA"]'::jsonb,
    '{"max_test_cases": -1, "max_concurrent_executions": -1, "max_storage_gb": -1}'::jsonb,
    true, 4
)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    limits = EXCLUDED.limits,
    features = EXCLUDED.features,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;

-- ==============================================
-- 3. SYSTEM SETTINGS SEED DATA
-- ==============================================

-- Insert system settings if they don't exist
-- Ensure system_settings has category column
ALTER TABLE public.system_settings ADD COLUMN IF NOT EXISTS category TEXT;

INSERT INTO public.system_settings (key, value, description, category, is_public) VALUES
('platform_name', to_jsonb('5GLabX'::text), 'Platform name displayed to users', 'general', true),
('platform_version', to_jsonb('1.0.0'::text), 'Current platform version', 'general', true),
('max_file_upload_size_mb', to_jsonb(100), 'Maximum file upload size in MB', 'limits', false),
('max_concurrent_executions', to_jsonb(10), 'Maximum concurrent test executions', 'limits', false),
('default_execution_timeout_minutes', to_jsonb(30), 'Default execution timeout in minutes', 'execution', false),
('enable_analytics', to_jsonb(true), 'Enable user analytics collection', 'privacy', false),
('enable_crash_reporting', to_jsonb(true), 'Enable crash reporting', 'privacy', false),
('maintenance_mode', to_jsonb(false), 'Enable maintenance mode', 'system', true),
('registration_enabled', to_jsonb(true), 'Allow new user registrations', 'auth', true),
('email_verification_required', to_jsonb(true), 'Require email verification for new users', 'auth', false)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    is_public = EXCLUDED.is_public;

-- ==============================================
-- 4. FEATURE FLAGS SEED DATA
-- ==============================================

-- Insert feature flags if they don't exist (use target_roles TEXT[] per schema)
INSERT INTO public.feature_flags (name, description, is_enabled, rollout_percentage, target_roles) VALUES
('test_suites', 'Test Suites functionality', true, 100, '{"all"}'),
('protocol_analyzer', 'Protocol Analyzer dashboard', true, 100, '{"all"}'),
('advanced_analytics', 'Advanced analytics and reporting', true, 100, '{"pro","enterprise"}'),
('api_access', 'API access for integrations', true, 100, '{"pro","enterprise"}'),
('custom_test_cases', 'Custom test case creation', true, 100, '{"enterprise"}'),
('real_time_execution', 'Real-time test execution', true, 100, '{"all"}'),
('batch_execution', 'Batch test execution', true, 100, '{"pro","enterprise"}'),
('test_scheduling', 'Automated test scheduling', true, 100, '{"pro","enterprise"}'),
('export_functionality', 'Export test results', true, 100, '{"all"}'),
('collaboration_features', 'Team collaboration features', true, 100, '{"pro","enterprise"}')
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    is_enabled = EXCLUDED.is_enabled,
    rollout_percentage = EXCLUDED.rollout_percentage,
    target_roles = EXCLUDED.target_roles;

-- ==============================================
-- 5. DEFAULT TEST CONFIGURATIONS
-- ==============================================

-- Insert default test configurations if they don't exist
INSERT INTO public.test_configurations (
    name, description, category, protocol, version, configuration_data, 
    is_template, is_public, is_default, created_by
) VALUES
(
    'Default 5G NR Configuration',
    'Standard configuration for 5G NR test cases',
    '5G_NR', 'NR', '1.0',
    '{"time_acceleration": 1.0, "log_level": "detailed", "capture_mode": "full", "output_format": "json"}'::jsonb,
    true, true, true, (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
),
(
    'Default 4G LTE Configuration',
    'Standard configuration for 4G LTE test cases',
    '4G_LTE', 'LTE', '1.0',
    '{"time_acceleration": 1.0, "log_level": "detailed", "capture_mode": "full", "output_format": "json"}'::jsonb,
    true, true, true, (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
),
(
    'Default IMS/SIP Configuration',
    'Standard configuration for IMS/SIP test cases',
    'IMS_SIP', 'SIP', '1.0',
    '{"time_acceleration": 1.0, "log_level": "detailed", "capture_mode": "full", "output_format": "json"}'::jsonb,
    true, true, true, (SELECT id FROM public.users WHERE role = 'admin' LIMIT 1)
),
(
    'Performance Test Configuration',
    'Configuration optimized for performance testing',
    '5G_NR', 'NR', '1.0',
    '{"time_acceleration": 10.0, "log_level": "basic", "capture_mode": "performance", "output_format": "json"}'::jsonb,
    true, true, false, null
),
(
    'Debug Configuration',
    'Configuration with maximum logging for debugging',
    '5G_NR', 'NR', '1.0',
    '{"time_acceleration": 0.1, "log_level": "verbose", "capture_mode": "full", "output_format": "json"}'::jsonb,
    true, true, false, null
)
ON CONFLICT (name, user_id) DO UPDATE SET
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    protocol = EXCLUDED.protocol,
    version = EXCLUDED.version,
    configuration_data = EXCLUDED.configuration_data,
    is_template = EXCLUDED.is_template,
    is_public = EXCLUDED.is_public,
    is_default = EXCLUDED.is_default;

-- ==============================================
-- 6. DEFAULT TEST RUN CONFIGURATIONS
-- ==============================================

-- Insert default test run configurations if they don't exist
INSERT INTO public.test_run_configs (
    name, description, test_ids, execution_mode, configuration, 
    is_template, is_public, user_id
) VALUES
(
    'Quick Test Suite',
    'Fast execution of basic test cases',
    '{}'::uuid[], 'simulation',
    '{"time_acceleration": 5.0, "parallel_execution": true, "stop_on_failure": false}'::jsonb,
    true, true, null
),
(
    'Comprehensive Test Suite',
    'Complete test execution with detailed analysis',
    '{}'::uuid[], 'simulation',
    '{"time_acceleration": 1.0, "parallel_execution": false, "stop_on_failure": true, "detailed_logging": true}'::jsonb,
    true, true, null
),
(
    'Performance Test Suite',
    'Performance-focused test execution',
    '{}'::uuid[], 'simulation',
    '{"time_acceleration": 10.0, "parallel_execution": true, "performance_monitoring": true}'::jsonb,
    true, true, null
)
ON CONFLICT (name, user_id) DO UPDATE SET
    description = EXCLUDED.description,
    test_ids = EXCLUDED.test_ids,
    execution_mode = EXCLUDED.execution_mode,
    configuration = EXCLUDED.configuration,
    is_template = EXCLUDED.is_template,
    is_public = EXCLUDED.is_public;

-- ==============================================
-- 7. DEFAULT TEST SUITE COLLECTIONS
-- ==============================================

-- Insert default test suite collections if they don't exist
INSERT INTO public.test_suite_collections (
    name, description, test_ids, category, tags, is_public, user_id
) VALUES
(
    '5G NR Basic Tests',
    'Basic 5G NR test cases for initial validation',
    '{}'::uuid[], '5G_NR', '{"basic", "5g", "nr", "initial"}'::text[],
    true, null
),
(
    '4G LTE Basic Tests',
    'Basic 4G LTE test cases for initial validation',
    '{}'::uuid[], '4G_LTE', '{"basic", "4g", "lte", "initial"}'::text[],
    true, null
),
(
    'IMS/SIP Basic Tests',
    'Basic IMS/SIP test cases for voice services',
    '{}'::uuid[], 'IMS_SIP', '{"basic", "ims", "sip", "voice"}'::text[],
    true, null
),
(
    'Performance Test Suite',
    'Performance-focused test cases across all protocols',
    '{}'::uuid[], 'CUSTOM', '{"performance", "stress", "load"}'::text[],
    true, null
),
(
    'Security Test Suite',
    'Security-focused test cases for all protocols',
    '{}'::uuid[], 'CUSTOM', '{"security", "authentication", "encryption"}'::text[],
    true, null
)
ON CONFLICT (name, user_id) DO UPDATE SET
    description = EXCLUDED.description,
    test_ids = EXCLUDED.test_ids,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags,
    is_public = EXCLUDED.is_public;

-- ==============================================
-- 8. DEFAULT TEST EXECUTION WORKERS
-- ==============================================

-- Insert default test execution workers if they don't exist
INSERT INTO public.test_execution_workers (
    worker_id, name, status, capabilities, max_concurrent_tests, 
    current_load, last_heartbeat, metadata
) VALUES
(
    'worker-001', 'Primary Test Worker', 'active',
    '["5G_NR", "4G_LTE", "IMS_SIP", "O_RAN", "NB_IoT", "V2X", "NTN"]'::jsonb,
    5, 0, NOW(),
    '{"cpu_cores": 8, "memory_gb": 16, "storage_gb": 100, "location": "us-east-1"}'::jsonb
),
(
    'worker-002', 'Secondary Test Worker', 'active',
    '["5G_NR", "4G_LTE", "IMS_SIP"]'::jsonb,
    3, 0, NOW(),
    '{"cpu_cores": 4, "memory_gb": 8, "storage_gb": 50, "location": "us-west-2"}'::jsonb
),
(
    'worker-003', 'Performance Test Worker', 'active',
    '["5G_NR", "4G_LTE"]'::jsonb,
    2, 0, NOW(),
    '{"cpu_cores": 16, "memory_gb": 32, "storage_gb": 200, "location": "eu-west-1"}'::jsonb
)
ON CONFLICT (worker_id) DO UPDATE SET
    name = EXCLUDED.name,
    status = EXCLUDED.status,
    capabilities = EXCLUDED.capabilities,
    max_concurrent_tests = EXCLUDED.max_concurrent_tests,
    current_load = EXCLUDED.current_load,
    last_heartbeat = EXCLUDED.last_heartbeat,
    metadata = EXCLUDED.metadata;

-- ==============================================
-- 9. UPDATE TEST CASE IDS
-- ==============================================

-- Update test cases with proper test_case_id if they don't have one
UPDATE public.test_cases 
SET test_case_id = CASE 
    WHEN test_case_id IS NULL OR test_case_id = '' THEN
        CASE category
            WHEN '5G_NR' THEN 'NR-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')
            WHEN '4G_LTE' THEN 'LTE-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')
            WHEN 'IMS_SIP' THEN 'IMS-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')
            WHEN 'O_RAN' THEN 'ORAN-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')
            WHEN 'NB_IoT' THEN 'NBIOT-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')
            WHEN 'V2X' THEN 'V2X-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')
            WHEN 'NTN' THEN 'NTN-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')
            ELSE 'CUSTOM-' || LPAD(EXTRACT(EPOCH FROM created_at)::TEXT, 10, '0')
        END
    ELSE test_case_id
END
WHERE test_case_id IS NULL OR test_case_id = '';

-- ==============================================
-- 10. CREATE INDEXES FOR BETTER PERFORMANCE
-- ==============================================

-- Create additional indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_test_case_categories_name ON public.test_case_categories(name);
CREATE INDEX IF NOT EXISTS idx_test_case_categories_is_active ON public.test_case_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON public.subscription_plans(name);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_active ON public.subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON public.feature_flags(name);
CREATE INDEX IF NOT EXISTS idx_feature_flags_is_enabled ON public.feature_flags(is_enabled);
CREATE INDEX IF NOT EXISTS idx_test_configurations_is_default ON public.test_configurations(is_default);
CREATE INDEX IF NOT EXISTS idx_test_configurations_is_template ON public.test_configurations(is_template);
CREATE INDEX IF NOT EXISTS idx_test_run_configs_is_template ON public.test_run_configs(is_template);
CREATE INDEX IF NOT EXISTS idx_test_suite_collections_category ON public.test_suite_collections(category);
CREATE INDEX IF NOT EXISTS idx_test_execution_workers_status ON public.test_execution_workers(status);

-- ==============================================
-- 11. CREATE TRIGGERS FOR AUTOMATIC UPDATES
-- ==============================================

-- Create trigger to update test_case_id if not provided
CREATE OR REPLACE FUNCTION generate_test_case_id_if_missing()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.test_case_id IS NULL OR NEW.test_case_id = '' THEN
        NEW.test_case_id := CASE NEW.category
            WHEN '5G_NR' THEN 'NR-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')
            WHEN '4G_LTE' THEN 'LTE-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')
            WHEN 'IMS_SIP' THEN 'IMS-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')
            WHEN 'O_RAN' THEN 'ORAN-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')
            WHEN 'NB_IoT' THEN 'NBIOT-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')
            WHEN 'V2X' THEN 'V2X-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')
            WHEN 'NTN' THEN 'NTN-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')
            ELSE 'CUSTOM-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for test cases
DROP TRIGGER IF EXISTS trigger_generate_test_case_id ON public.test_cases;
CREATE TRIGGER trigger_generate_test_case_id
    BEFORE INSERT ON public.test_cases
    FOR EACH ROW
    EXECUTE FUNCTION generate_test_case_id_if_missing();

-- ==============================================
-- 12. VERIFICATION AND STATISTICS
-- ==============================================

-- Create a function to verify seed data integrity
CREATE OR REPLACE FUNCTION verify_seed_data_integrity()
RETURNS TABLE (
    category TEXT,
    count BIGINT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'test_case_categories'::TEXT,
        (SELECT COUNT(*) FROM public.test_case_categories),
        CASE WHEN (SELECT COUNT(*) FROM public.test_case_categories) >= 8 THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY
    SELECT 
        'subscription_plans'::TEXT,
        (SELECT COUNT(*) FROM public.subscription_plans),
        CASE WHEN (SELECT COUNT(*) FROM public.subscription_plans) >= 4 THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY
    SELECT 
        'system_settings'::TEXT,
        (SELECT COUNT(*) FROM public.system_settings),
        CASE WHEN (SELECT COUNT(*) FROM public.system_settings) >= 10 THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY
    SELECT 
        'feature_flags'::TEXT,
        (SELECT COUNT(*) FROM public.feature_flags),
        CASE WHEN (SELECT COUNT(*) FROM public.feature_flags) >= 10 THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY
    SELECT 
        'test_configurations'::TEXT,
        (SELECT COUNT(*) FROM public.test_configurations),
        CASE WHEN (SELECT COUNT(*) FROM public.test_configurations) >= 5 THEN 'OK' ELSE 'MISSING' END;
    
    RETURN QUERY
    SELECT 
        'test_cases'::TEXT,
        (SELECT COUNT(*) FROM public.test_cases),
        CASE WHEN (SELECT COUNT(*) FROM public.test_cases) >= 100 THEN 'OK' ELSE 'MISSING' END;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION verify_seed_data_integrity() TO authenticated;

-- ==============================================
-- 13. SUCCESS MESSAGE
-- ==============================================

DO $$
DECLARE
    category_count INTEGER;
    plan_count INTEGER;
    setting_count INTEGER;
    flag_count INTEGER;
    config_count INTEGER;
    test_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM public.test_case_categories;
    SELECT COUNT(*) INTO plan_count FROM public.subscription_plans;
    SELECT COUNT(*) INTO setting_count FROM public.system_settings;
    SELECT COUNT(*) INTO flag_count FROM public.feature_flags;
    SELECT COUNT(*) INTO config_count FROM public.test_configurations;
    SELECT COUNT(*) INTO test_count FROM public.test_cases;
    
    RAISE NOTICE '✅ Comprehensive seed data setup completed successfully!';
    RAISE NOTICE '📊 Test Case Categories: %', category_count;
    RAISE NOTICE '💳 Subscription Plans: %', plan_count;
    RAISE NOTICE '⚙️ System Settings: %', setting_count;
    RAISE NOTICE '🚩 Feature Flags: %', flag_count;
    RAISE NOTICE '🔧 Test Configurations: %', config_count;
    RAISE NOTICE '🧪 Test Cases: %', test_count;
    RAISE NOTICE '🎯 All seed data is properly configured and ready!';
END $$;