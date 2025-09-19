-- ==============================================
-- 5GLabX Platform - Seed Data & Configurations (CLEAN VERSION)
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
) ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits;

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
) ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits;

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
) ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits;

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
) ON CONFLICT (name) DO UPDATE SET
    config = EXCLUDED.config,
    publishable_key = EXCLUDED.publishable_key;

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
) ON CONFLICT (name) DO UPDATE SET
    config = EXCLUDED.config,
    publishable_key = EXCLUDED.publishable_key;

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
) ON CONFLICT (name) DO UPDATE SET
    config = EXCLUDED.config,
    publishable_key = EXCLUDED.publishable_key;

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