-- ==============================================
-- 5GLabX Platform - Subscription Plans Seed Data
-- Commercial subscription plans for platform launch
-- ==============================================

-- Insert subscription plans
INSERT INTO public.subscription_plans (
    name, display_name, description, price_monthly, price_yearly, currency,
    features, limits, is_active, is_popular, sort_order
) VALUES 
-- Free Plan
(
    'free',
    'Free',
    'Perfect for getting started with 5G protocol testing',
    0.00,
    0.00,
    'USD',
    '{
        "test_cases": ["Basic 4G/5G test cases"],
        "executions_per_month": 100,
        "data_processing": "1GB per month",
        "support": "Community support",
        "api_access": false,
        "custom_configurations": false,
        "advanced_analytics": false,
        "priority_support": false,
        "white_label": false,
        "sla": false
    }',
    '{
        "max_test_executions_per_month": 100,
        "max_data_processing_mb": 1024,
        "max_storage_mb": 100,
        "max_api_calls_per_month": 0,
        "max_concurrent_executions": 1,
        "max_test_case_duration_minutes": 5,
        "max_custom_configurations": 0,
        "max_team_members": 1
    }',
    true,
    false,
    1
),

-- Pro Plan
(
    'pro',
    'Pro',
    'Advanced features for professional 5G testing and analysis',
    99.00,
    990.00,
    'USD',
    '{
        "test_cases": ["All 4G/5G test cases", "IMS/SIP protocols", "O-RAN specifications"],
        "executions_per_month": 1000,
        "data_processing": "50GB per month",
        "support": "Email support",
        "api_access": true,
        "custom_configurations": true,
        "advanced_analytics": true,
        "priority_support": false,
        "white_label": false,
        "sla": false
    }',
    '{
        "max_test_executions_per_month": 1000,
        "max_data_processing_mb": 51200,
        "max_storage_mb": 1000,
        "max_api_calls_per_month": 10000,
        "max_concurrent_executions": 5,
        "max_test_case_duration_minutes": 30,
        "max_custom_configurations": 50,
        "max_team_members": 5
    }',
    true,
    true,
    2
),

-- Enterprise Plan
(
    'enterprise',
    'Enterprise',
    'Complete solution for enterprise 5G testing and compliance',
    299.00,
    2990.00,
    'USD',
    '{
        "test_cases": ["All test cases", "Custom test case development", "3GPP compliance validation"],
        "executions_per_month": 10000,
        "data_processing": "500GB per month",
        "support": "Priority support",
        "api_access": true,
        "custom_configurations": true,
        "advanced_analytics": true,
        "priority_support": true,
        "white_label": true,
        "sla": true
    }',
    '{
        "max_test_executions_per_month": 10000,
        "max_data_processing_mb": 512000,
        "max_storage_mb": 10000,
        "max_api_calls_per_month": 100000,
        "max_concurrent_executions": 20,
        "max_test_case_duration_minutes": 120,
        "max_custom_configurations": 500,
        "max_team_members": 50
    }',
    true,
    false,
    3
),

-- Custom Plan
(
    'custom',
    'Custom',
    'Tailored solution for large organizations with specific requirements',
    0.00,
    0.00,
    'USD',
    '{
        "test_cases": ["All test cases", "Custom test case development", "3GPP compliance validation", "Custom protocols"],
        "executions_per_month": "Unlimited",
        "data_processing": "Unlimited",
        "support": "Dedicated support",
        "api_access": true,
        "custom_configurations": true,
        "advanced_analytics": true,
        "priority_support": true,
        "white_label": true,
        "sla": true,
        "custom_features": true,
        "on_premise_deployment": true
    }',
    '{
        "max_test_executions_per_month": -1,
        "max_data_processing_mb": -1,
        "max_storage_mb": -1,
        "max_api_calls_per_month": -1,
        "max_concurrent_executions": -1,
        "max_test_case_duration_minutes": -1,
        "max_custom_configurations": -1,
        "max_team_members": -1
    }',
    true,
    false,
    4
)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits,
    is_active = EXCLUDED.is_active,
    is_popular = EXCLUDED.is_popular,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- Insert test case categories
INSERT INTO public.test_case_categories (
    name, display_name, description, icon, color, sort_order, is_active
) VALUES 
(
    '4G_LTE',
    '4G LTE',
    'Long Term Evolution (LTE) protocol testing and analysis',
    '📡',
    '#3B82F6',
    1,
    true
),
(
    '5G_NR',
    '5G NR',
    '5G New Radio (NR) protocol testing and analysis',
    '🚀',
    '#10B981',
    2,
    true
),
(
    'IMS_SIP',
    'IMS/SIP',
    'IP Multimedia Subsystem and Session Initiation Protocol testing',
    '📞',
    '#F59E0B',
    3,
    true
),
(
    'O_RAN',
    'O-RAN',
    'Open Radio Access Network specifications and testing',
    '🌐',
    '#8B5CF6',
    4,
    true
),
(
    'NB_IoT',
    'NB-IoT',
    'Narrowband Internet of Things protocol testing',
    '📱',
    '#06B6D4',
    5,
    true
),
(
    'V2X',
    'V2X',
    'Vehicle-to-Everything communication protocol testing',
    '🚗',
    '#EF4444',
    6,
    true
),
(
    'NTN',
    'NTN',
    'Non-Terrestrial Networks protocol testing',
    '🛰️',
    '#84CC16',
    7,
    true
),
(
    'CUSTOM',
    'Custom',
    'Custom protocol testing and analysis',
    '⚙️',
    '#6B7280',
    8,
    true
)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- Insert system settings
INSERT INTO public.system_settings (key, value, description, is_public) VALUES 
(
    'platform_name',
    '"5GLabX"',
    'Platform name',
    true
),
(
    'platform_version',
    '"1.0.0"',
    'Platform version',
    true
),
(
    'maintenance_mode',
    'false',
    'Maintenance mode status',
    true
),
(
    'max_file_upload_size_mb',
    '100',
    'Maximum file upload size in MB',
    false
),
(
    'default_test_timeout_minutes',
    '30',
    'Default test execution timeout in minutes',
    false
),
(
    'stripe_publishable_key',
    '""',
    'Stripe publishable key',
    false
),
(
    'stripe_secret_key',
    '""',
    'Stripe secret key',
    false
),
(
    'email_from_address',
    '"noreply@5glabx.com"',
    'Email from address',
    false
),
(
    'email_from_name',
    '"5GLabX Platform"',
    'Email from name',
    false
),
(
    'support_email',
    '"support@5glabx.com"',
    'Support email address',
    true
),
(
    'billing_email',
    '"billing@5glabx.com"',
    'Billing email address',
    true
),
(
    'terms_of_service_url',
    '"https://5glabx.com/terms"',
    'Terms of service URL',
    true
),
(
    'privacy_policy_url',
    '"https://5glabx.com/privacy"',
    'Privacy policy URL',
    true
),
(
    'documentation_url',
    '"https://docs.5glabx.com"',
    'Documentation URL',
    true
),
(
    'api_documentation_url',
    '"https://api.5glabx.com/docs"',
    'API documentation URL',
    true
)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    is_public = EXCLUDED.is_public,
    updated_at = NOW();

-- Insert feature flags
INSERT INTO public.feature_flags (name, description, is_enabled, rollout_percentage) VALUES 
(
    'advanced_analytics',
    'Advanced analytics and reporting features',
    true,
    100
),
(
    'custom_test_cases',
    'Custom test case creation and management',
    true,
    100
),
(
    'api_access',
    'API access for programmatic testing',
    true,
    100
),
(
    'white_label',
    'White label customization options',
    true,
    100
),
(
    'real_time_collaboration',
    'Real-time collaboration features',
    false,
    0
),
(
    'ai_powered_analysis',
    'AI-powered test analysis and recommendations',
    false,
    0
),
(
    'mobile_app',
    'Mobile application access',
    false,
    0
),
(
    'enterprise_sso',
    'Enterprise Single Sign-On integration',
    true,
    100
),
(
    'advanced_security',
    'Advanced security features and compliance',
    true,
    100
),
(
    'performance_optimization',
    'Performance optimization features',
    true,
    100
)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    is_enabled = EXCLUDED.is_enabled,
    rollout_percentage = EXCLUDED.rollout_percentage,
    updated_at = NOW();

-- Verification
DO $$
DECLARE
    plan_count INTEGER;
    category_count INTEGER;
    setting_count INTEGER;
    flag_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO plan_count FROM public.subscription_plans;
    SELECT COUNT(*) INTO category_count FROM public.test_case_categories;
    SELECT COUNT(*) INTO setting_count FROM public.system_settings;
    SELECT COUNT(*) INTO flag_count FROM public.feature_flags;
    
    RAISE NOTICE '✅ Subscription plans created: %', plan_count;
    RAISE NOTICE '✅ Test case categories created: %', category_count;
    RAISE NOTICE '✅ System settings created: %', setting_count;
    RAISE NOTICE '✅ Feature flags created: %', flag_count;
    
    IF plan_count >= 4 AND category_count >= 8 AND setting_count >= 15 AND flag_count >= 10 THEN
        RAISE NOTICE '🎉 All seed data created successfully!';
    ELSE
        RAISE NOTICE '❌ Some seed data may be missing';
    END IF;
END $$;