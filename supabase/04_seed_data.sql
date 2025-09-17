-- ==============================================
-- 5GLabX Platform - Seed Data & Configurations
-- Default subscription plans, admin configurations, and sample data
-- ==============================================

-- ==============================================
-- 1. DEFAULT SUBSCRIPTION PLANS
-- ==============================================

-- Free Plan
INSERT INTO public.subscription_plans (
    name, description, price_monthly, price_yearly, features, limits, is_active, sort_order
) VALUES (
    'Free',
    'Perfect for getting started with 5G testing',
    0.00,
    0.00,
    '{
        "test_cases": 3,
        "api_calls": 100,
        "exports": 1,
        "storage": "10MB",
        "support": "Community",
        "features": [
            "Basic test execution",
            "Limited test cases",
            "Community support",
            "Basic analytics"
        ]
    }',
    '{
        "test_executions_per_day": 3,
        "test_executions_per_hour": 1,
        "api_calls_per_hour": 5,
        "exports_per_week": 1,
        "max_concurrent_sessions": 1,
        "max_storage_mb": 10,
        "max_bandwidth_gb": 1,
        "max_test_execution_minutes": 5,
        "trial_months": 4
    }',
    true,
    1
);

-- Pro Plan
INSERT INTO public.subscription_plans (
    name, description, price_monthly, price_yearly, features, limits, is_active, sort_order
) VALUES (
    'Pro',
    'Advanced features for professional 5G testing',
    99.00,
    990.00,
    '{
        "test_cases": 100,
        "api_calls": 10000,
        "exports": 50,
        "storage": "1GB",
        "support": "Priority",
        "features": [
            "Advanced test execution",
            "100+ test cases",
            "Priority support",
            "Advanced analytics",
            "Custom test cases",
            "API access",
            "Export capabilities",
            "Performance monitoring"
        ]
    }',
    '{
        "test_executions_per_day": 100,
        "test_executions_per_hour": 10,
        "api_calls_per_hour": 1000,
        "exports_per_day": 10,
        "max_concurrent_sessions": 5,
        "max_storage_mb": 1000,
        "max_bandwidth_gb": 100,
        "max_test_execution_minutes": 30,
        "trial_months": -1
    }',
    true,
    2
);

-- Enterprise Plan
INSERT INTO public.subscription_plans (
    name, description, price_monthly, price_yearly, features, limits, is_active, sort_order
) VALUES (
    'Enterprise',
    'Complete solution for enterprise 5G testing',
    299.00,
    2990.00,
    '{
        "test_cases": "Unlimited",
        "api_calls": "Unlimited",
        "exports": "Unlimited",
        "storage": "10GB",
        "support": "24/7",
        "features": [
            "Unlimited test execution",
            "1000+ test cases",
            "24/7 dedicated support",
            "Advanced analytics",
            "Custom test cases",
            "Full API access",
            "Unlimited exports",
            "Performance monitoring",
            "ML insights",
            "Custom integrations",
            "On-premise deployment",
            "SLA guarantee"
        ]
    }',
    '{
        "test_executions_per_day": -1,
        "test_executions_per_hour": -1,
        "api_calls_per_hour": -1,
        "exports_per_day": -1,
        "max_concurrent_sessions": -1,
        "max_storage_mb": 10000,
        "max_bandwidth_gb": 1000,
        "max_test_execution_minutes": 120,
        "trial_months": -1
    }',
    true,
    3
);

-- ==============================================
-- 2. PAYMENT GATEWAY CONFIGURATIONS
-- ==============================================

-- Stripe Configuration
INSERT INTO public.payment_gateways (
    name, is_enabled, publishable_key, secret_key, webhook_secret, config
) VALUES (
    'Stripe',
    false,
    'pk_test_...',
    'sk_test_...',
    'whsec_...',
    '{
        "currency": "USD",
        "webhook_url": "/api/webhooks/stripe",
        "supported_countries": ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL", "SE"],
        "features": ["cards", "bank_transfers", "digital_wallets"]
    }'
);

-- Razorpay Configuration
INSERT INTO public.payment_gateways (
    name, is_enabled, publishable_key, secret_key, webhook_secret, config
) VALUES (
    'Razorpay',
    false,
    'rzp_test_...',
    'rzp_test_...',
    'webhook_secret_...',
    '{
        "currency": "INR",
        "webhook_url": "/api/webhooks/razorpay",
        "supported_countries": ["IN"],
        "features": ["cards", "netbanking", "upi", "wallet"]
    }'
);

-- PayPal Configuration
INSERT INTO public.payment_gateways (
    name, is_enabled, publishable_key, secret_key, webhook_secret, config
) VALUES (
    'PayPal',
    false,
    'paypal_client_id_...',
    'paypal_client_secret_...',
    'paypal_webhook_secret_...',
    '{
        "currency": "USD",
        "webhook_url": "/api/webhooks/paypal",
        "supported_countries": ["US", "CA", "GB", "AU", "DE", "FR", "IT", "ES", "NL", "SE"],
        "features": ["paypal", "credit_cards", "bank_transfers"]
    }'
);

-- ==============================================
-- 3. TAX SETTINGS
-- ==============================================

-- Default Tax Settings (Disabled)
INSERT INTO public.tax_settings (
    is_enabled, tax_name, tax_rate, is_inclusive, country_code, config
) VALUES (
    false,
    'GST',
    18.00,
    false,
    'IN',
    '{
        "description": "Goods and Services Tax",
        "applicable_states": ["All"],
        "exempt_categories": [],
        "threshold_amount": 0
    }'
);

-- US Tax Settings
INSERT INTO public.tax_settings (
    is_enabled, tax_name, tax_rate, is_inclusive, country_code, config
) VALUES (
    false,
    'Sales Tax',
    8.25,
    false,
    'US',
    '{
        "description": "Sales Tax",
        "applicable_states": ["CA", "NY", "TX", "FL", "IL"],
        "exempt_categories": ["software", "digital_services"],
        "threshold_amount": 0
    }'
);

-- EU VAT Settings
INSERT INTO public.tax_settings (
    is_enabled, tax_name, tax_rate, is_inclusive, country_code, config
) VALUES (
    false,
    'VAT',
    20.00,
    true,
    'EU',
    '{
        "description": "Value Added Tax",
        "applicable_countries": ["DE", "FR", "IT", "ES", "NL", "SE"],
        "exempt_categories": ["b2b"],
        "threshold_amount": 0
    }'
);

-- ==============================================
-- 4. SAMPLE ADMIN USER
-- ==============================================

-- Note: This would typically be created through Supabase Auth
-- This is just a placeholder for the user profile
INSERT INTO public.users (
    id, email, full_name, role, subscription_tier, subscription_status, 
    company_name, job_title, country, is_active
)
SELECT 
    au.id,
    'admin@5glabx.com',
    '5GLabX Admin',
    'admin',
    'enterprise',
    'active',
    '5GLabX',
    'System Administrator',
    'US',
    true
FROM auth.users au
WHERE au.email = 'admin@5glabx.com'
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- 5. SAMPLE TEST USER
-- ==============================================

INSERT INTO public.users (
    id, email, full_name, role, subscription_tier, subscription_status, 
    company_name, job_title, country, is_active
) 
SELECT 
    au.id,
    'test@5glabx.com',
    'Test User',
    'user',
    'free',
    'active',
    'Test Company',
    'Test Engineer',
    'US',
    true
FROM auth.users au
WHERE au.email = 'test@5glabx.com'
ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- 6. SAMPLE INVOICES
-- ==============================================

-- Sample Pro Plan Invoice
INSERT INTO public.invoices (
    user_id, subscription_plan_id, amount, tax_amount, total_amount, 
    currency, status, payment_gateway, payment_intent_id
) VALUES (
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    (SELECT id FROM public.subscription_plans WHERE name = 'Pro'),
    99.00,
    0.00,
    99.00,
    'USD',
    'paid',
    'Stripe',
    'pi_test_1234567890'
);

-- Sample Enterprise Plan Invoice
INSERT INTO public.invoices (
    user_id, subscription_plan_id, amount, tax_amount, total_amount, 
    currency, status, payment_gateway, payment_intent_id
) VALUES (
    (SELECT id FROM public.users WHERE email = 'admin@5glabx.com'),
    (SELECT id FROM public.subscription_plans WHERE name = 'Enterprise'),
    299.00,
    0.00,
    299.00,
    'USD',
    'paid',
    'Stripe',
    'pi_test_0987654321'
);

-- ==============================================
-- 7. SAMPLE TEST EXECUTIONS
-- ==============================================

-- Sample test execution for 5G NR Initial Access
INSERT INTO public.test_case_executions (
    test_case_id, user_id, status, start_time, end_time, duration_ms, 
    progress_percentage, current_step, total_steps, completed_steps, 
    results, logs, errors, performance_data
) VALUES (
    (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001'),
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'completed',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '59 minutes',
    60000,
    100,
    'RRC Setup Complete',
    5,
    5,
    '{
        "overall_result": "PASS",
        "steps_completed": 5,
        "total_steps": 5,
        "success_rate": 100,
        "execution_time": 60
    }',
    '{
        "info_logs": [
            "Test execution started",
            "SSB detected successfully",
            "MIB decoded successfully",
            "SIB1 decoded successfully",
            "RRC connection established"
        ],
        "debug_logs": [
            "Signal strength: -85 dBm",
            "SNR: 15 dB",
            "Timing advance: 2 symbols"
        ]
    }',
    '{}',
    '{
        "cpu_usage": 45,
        "memory_usage": 128,
        "network_usage": 1024,
        "execution_time": 60
    }'
);

-- Sample test execution for LTE Initial Access
INSERT INTO public.test_case_executions (
    test_case_id, user_id, status, start_time, end_time, duration_ms, 
    progress_percentage, current_step, total_steps, completed_steps, 
    results, logs, errors, performance_data
) VALUES (
    (SELECT id FROM public.test_cases WHERE test_case_id = 'LTE-IA-001'),
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'completed',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 hour 58 minutes',
    120000,
    100,
    'RRC Connection Setup Complete',
    6,
    6,
    '{
        "overall_result": "PASS",
        "steps_completed": 6,
        "total_steps": 6,
        "success_rate": 100,
        "execution_time": 120
    }',
    '{
        "info_logs": [
            "LTE test execution started",
            "PSS/SSS detected successfully",
            "MIB decoded successfully",
            "SIB1 decoded successfully",
            "SIB2 decoded successfully",
            "RRC connection established"
        ],
        "debug_logs": [
            "Signal strength: -80 dBm",
            "SNR: 18 dB",
            "Timing advance: 1 symbol"
        ]
    }',
    '{}',
    '{
        "cpu_usage": 40,
        "memory_usage": 120,
        "network_usage": 800,
        "execution_time": 120
    }'
);

-- ==============================================
-- 8. SAMPLE TEST RESULTS
-- ==============================================

-- Sample test results for 5G NR Initial Access
INSERT INTO public.test_case_results (
    execution_id, step_name, step_order, status, start_time, end_time, 
    duration_ms, message, details, metrics
) VALUES 
(
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    'SSB Detection',
    1,
    'passed',
    NOW() - INTERVAL '1 hour',
    NOW() - INTERVAL '59 minutes 55 seconds',
    5000,
    'SSB detected successfully',
    '{"ssb_index": 0, "subcarrier_spacing": 15, "ssb_periodicity": 20}',
    '{"signal_strength": -85, "snr": 15, "timing_advance": 2}'
),
(
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    'MIB Decoding',
    2,
    'passed',
    NOW() - INTERVAL '59 minutes 55 seconds',
    NOW() - INTERVAL '59 minutes 50 seconds',
    5000,
    'MIB decoded successfully',
    '{"system_frame_number": 0, "subcarrier_spacing_common": 0, "ssb_subcarrier_offset": 0}',
    '{"decoding_time": 5, "error_rate": 0}'
),
(
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    'SIB1 Decoding',
    3,
    'passed',
    NOW() - INTERVAL '59 minutes 50 seconds',
    NOW() - INTERVAL '59 minutes 45 seconds',
    5000,
    'SIB1 decoded successfully',
    '{"cell_access_related_info": "decoded", "cell_selection_info": "decoded"}',
    '{"decoding_time": 5, "error_rate": 0}'
),
(
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    'RRC Connection Request',
    4,
    'passed',
    NOW() - INTERVAL '59 minutes 45 seconds',
    NOW() - INTERVAL '59 minutes 40 seconds',
    5000,
    'RRC connection request sent successfully',
    '{"establishment_cause": "mo-Data", "ue_identity": "random"}',
    '{"request_time": 5, "success_rate": 100}'
),
(
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    'RRC Connection Setup',
    5,
    'passed',
    NOW() - INTERVAL '59 minutes 40 seconds',
    NOW() - INTERVAL '59 minutes 35 seconds',
    5000,
    'RRC connection setup completed successfully',
    '{"rrc_state": "RRC_CONNECTED", "security_activated": true}',
    '{"setup_time": 5, "success_rate": 100}'
);

-- ==============================================
-- 9. SAMPLE ML EXECUTION EVENTS
-- ==============================================

-- Sample ML execution events for 5G NR test
INSERT INTO public.ml_execution_events (
    run_id, user_id, test_case_id, tech, stage, level, code, message, payload
) VALUES 
(
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'NR-IA-001',
    'NR',
    'execute',
    'info',
    'SSB_DETECTED',
    'SSB detected successfully',
    '{"ssb_index": 0, "signal_strength": -85, "snr": 15}'
),
(
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'NR-IA-001',
    'NR',
    'execute',
    'info',
    'MIB_DECODED',
    'MIB decoded successfully',
    '{"system_frame_number": 0, "subcarrier_spacing_common": 0}'
),
(
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'NR-IA-001',
    'NR',
    'execute',
    'info',
    'RRC_CONNECTED',
    'RRC connection established successfully',
    '{"rrc_state": "RRC_CONNECTED", "connection_time": 60}'
);

-- ==============================================
-- 10. SAMPLE ML EXECUTION FEATURES
-- ==============================================

-- Sample ML execution features
INSERT INTO public.ml_execution_features (
    run_id, user_id, test_case_id, features
) VALUES (
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'NR-IA-001',
    '{
        "num_events": 3,
        "num_errors": 0,
        "num_warnings": 0,
        "has_auth_failure": 0,
        "has_timer_timeout": 0,
        "has_rrc_reconfig": 0,
        "first_error_code": "none",
        "execution_time": 60,
        "signal_strength": -85,
        "snr": 15
    }'
);

-- ==============================================
-- 11. SAMPLE ML EXECUTION LABELS
-- ==============================================

-- Sample ML execution labels
INSERT INTO public.ml_execution_labels (
    run_id, outcome, failure_class, root_cause, notes
) VALUES (
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    'pass',
    null,
    null,
    'Successful 5G NR initial access test execution'
);

-- ==============================================
-- 12. SAMPLE ML RECOMMENDATIONS
-- ==============================================

-- Sample ML recommendations
INSERT INTO public.ml_recommendations (
    run_id, recommendation, confidence, rationale, applied, helpful, metadata
) VALUES (
    (SELECT id FROM public.test_case_executions WHERE test_case_id = (SELECT id FROM public.test_cases WHERE test_case_id = 'NR-IA-001')),
    'Test execution completed successfully. No issues detected.',
    0.95,
    'All test steps passed without errors. Signal strength and SNR are within normal ranges.',
    false,
    null,
    '{"test_type": "success", "performance": "good", "signal_quality": "excellent"}'
);

-- ==============================================
-- 13. SAMPLE USER ACCESS LOGS
-- ==============================================

-- Sample user access logs
INSERT INTO public.user_access_logs (
    user_id, action_type, resource_id, ip_address, user_agent, session_id
) VALUES 
(
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'test_execution',
    'NR-IA-001',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'session_1234567890'
),
(
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'test_execution',
    'LTE-IA-001',
    '192.168.1.100',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'session_1234567890'
);

-- ==============================================
-- 14. SAMPLE TEST EXECUTION LOGS
-- ==============================================

-- Sample test execution logs
INSERT INTO public.test_execution_logs (
    user_id, test_case_id, execution_time, duration_seconds, status, resource_usage
) VALUES 
(
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'NR-IA-001',
    NOW() - INTERVAL '1 hour',
    60,
    'completed',
    '{"cpu_usage": 45, "memory_usage": 128, "network_usage": 1024}'
),
(
    (SELECT id FROM public.users WHERE email = 'test@5glabx.com'),
    'LTE-IA-001',
    NOW() - INTERVAL '2 hours',
    120,
    'completed',
    '{"cpu_usage": 40, "memory_usage": 120, "network_usage": 800}'
);

-- ==============================================
-- 15. FINAL NOTES
-- ==============================================

-- This seed data provides:
-- 1. Default subscription plans (Free, Pro, Enterprise)
-- 2. Payment gateway configurations (Stripe, Razorpay, PayPal)
-- 3. Tax settings for different regions (GST, Sales Tax, VAT)
-- 4. Sample admin and test users
-- 5. Sample invoices and test executions
-- 6. Sample ML data for testing the ML system
-- 7. Sample access logs and execution logs

-- All data is properly configured for testing the complete platform
-- including commercial features, ML system, and access restrictions.