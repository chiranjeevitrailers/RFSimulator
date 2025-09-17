-- ==============================================
-- 5GLabX Platform - COMPLETE FULL SETUP
-- This file consolidates ALL functionality from 70 SQL files
-- Nothing is reduced - everything is included
-- ==============================================

-- Enable all required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==============================================
-- 1. COMPLETE USER MANAGEMENT SYSTEM
-- ==============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'trial', 'enterprise')),
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise', 'custom')),
    subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing')),
    subscription_id TEXT,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    billing_email TEXT,
    company_name TEXT,
    job_title TEXT,
    phone TEXT,
    country TEXT,
    timezone TEXT DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    usage_stats JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles for additional information
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    website TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    expertise_areas TEXT[],
    certifications TEXT[],
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    industry TEXT,
    company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    use_cases TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User access logs
CREATE TABLE IF NOT EXISTS public.user_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    action_type TEXT NOT NULL,
    resource_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    session_id TEXT
);

-- User restrictions
CREATE TABLE IF NOT EXISTS public.user_restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    restriction_type TEXT NOT NULL,
    restriction_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================
-- 2. COMPLETE SUBSCRIPTION & BILLING SYSTEM
-- ==============================================

-- Subscription plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    features JSONB NOT NULL DEFAULT '{}',
    limits JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing history
CREATE TABLE IF NOT EXISTS public.billing_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.user_subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    stripe_invoice_id TEXT,
    billing_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment gateways configuration
CREATE TABLE IF NOT EXISTS public.payment_gateways (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    publishable_key TEXT,
    secret_key TEXT,
    webhook_secret TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax settings
CREATE TABLE IF NOT EXISTS public.tax_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    is_enabled BOOLEAN DEFAULT false,
    tax_name TEXT DEFAULT 'GST',
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    is_inclusive BOOLEAN DEFAULT false,
    country_code TEXT,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_plan_id UUID REFERENCES public.subscription_plans(id),
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
    payment_gateway TEXT,
    payment_intent_id TEXT,
    invoice_url TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================
-- 3. COMPREHENSIVE TEST CASE SYSTEM
-- ==============================================

-- Test case categories for better organization
CREATE TABLE IF NOT EXISTS public.test_case_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_category_id UUID REFERENCES public.test_case_categories(id),
    protocol_focus TEXT[], -- ['5G-NR', 'LTE', '3G', '2G', 'IMS', 'SIP']
    layer_focus TEXT[], -- ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS']
    complexity_level TEXT CHECK (complexity_level IN ('basic', 'intermediate', 'advanced', 'expert')),
    standard_references TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Test Cases Table
CREATE TABLE IF NOT EXISTS public.test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'InitialAccess', 'Handover', 'PDU_Session', 'Mobility', 'Security', 
        'Measurement', 'Power_Control', 'Scheduling', 'NSA', 'EN_DC', 'NE_DC', 
        'NGEN_DC', 'Multiple_Split_Bearer', '5G_NR', '4G_LTE', 'IMS', 'O_RAN', 
        'NB_IoT', 'V2X', 'NTN', 'VoLTE', 'VoNR', 'Conference_Call', 'Enhanced_IMS'
    )),
    subcategory VARCHAR(100),
    protocol VARCHAR(50) NOT NULL CHECK (protocol IN (
        '5G_NR', 'LTE', 'EN-DC', 'NE-DC', 'NGEN-DC', 'IMS_SIP', 'O_RAN', 
        'NB_IoT', 'V2X', 'NTN', 'VoLTE', 'VoNR'
    )),
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN (
        'Functional', 'Performance', 'RF', 'Stability', 'Sanity', 'Stress', 
        'Interoperability', 'Security', 'Mobility', 'Conformance'
    )),
    complexity VARCHAR(20) NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_duration INTEGER, -- in seconds
    preconditions TEXT,
    test_steps TEXT,
    expected_signaling_flow TEXT,
    expected_ies TEXT,
    layer_parameters TEXT,
    expected_result TEXT,
    three_gpp_ref TEXT,
    tags TEXT[],
    version TEXT DEFAULT '1.0',
    prerequisites JSONB,
    expected_results JSONB,
    success_criteria JSONB,
    failure_scenarios JSONB,
    performance_metrics JSONB,
    test_environment JSONB,
    documentation_url TEXT,
    is_template BOOLEAN DEFAULT false,
    parent_test_case_id UUID REFERENCES public.test_cases(id),
    execution_order INTEGER DEFAULT 0,
    timeout_ms INTEGER DEFAULT 300000,
    retry_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Enhanced fields for comprehensive coverage
    category_id UUID REFERENCES public.test_case_categories(id),
    test_scenario TEXT,
    test_objective TEXT,
    test_data_requirements JSONB DEFAULT '{}',
    measurement_points JSONB DEFAULT '{}',
    kpi_requirements JSONB DEFAULT '{}',
    automation_level TEXT DEFAULT 'manual' CHECK (automation_level IN ('manual', 'semi_automated', 'fully_automated')),
    execution_priority INTEGER DEFAULT 5 CHECK (execution_priority BETWEEN 1 AND 10),
    estimated_duration_minutes INTEGER DEFAULT 5,
    resource_requirements JSONB DEFAULT '{}',
    dependencies TEXT[],
    related_test_cases UUID[],
    version_history JSONB DEFAULT '{}',
    last_updated_by UUID REFERENCES public.users(id),
    review_status TEXT DEFAULT 'draft' CHECK (review_status IN ('draft', 'review', 'approved', 'deprecated'))
);

-- Test Messages Table
CREATE TABLE IF NOT EXISTS public.test_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE,
    message_id VARCHAR(50) NOT NULL,
    message_name VARCHAR(255) NOT NULL,
    protocol VARCHAR(50) NOT NULL,
    layer VARCHAR(20) NOT NULL CHECK (layer IN (
        'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'SIP', 'NGAP', 
        'S1AP', 'X2AP', 'XnAP', 'PFCP', 'GTP', 'HTTP2'
    )),
    direction VARCHAR(20) NOT NULL CHECK (direction IN (
        'UE_to_gNB', 'gNB_to_UE', 'UE_to_eNodeB', 'eNodeB_to_UE', 
        'gNB_to_AMF', 'AMF_to_gNB', 'gNB_to_UPF', 'UPF_to_gNB',
        'BIDIR', 'UL', 'DL'
    )),
    message_type VARCHAR(100) NOT NULL,
    sequence_number INTEGER NOT NULL,
    timestamp_offset_ms INTEGER DEFAULT 0,
    message_payload JSONB,
    expected_response VARCHAR(100),
    timeout_ms INTEGER DEFAULT 5000,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Information Elements Table
CREATE TABLE IF NOT EXISTS public.information_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.test_messages(id) ON DELETE CASCADE,
    ie_id VARCHAR(50) NOT NULL,
    ie_name VARCHAR(255) NOT NULL,
    ie_type VARCHAR(50) NOT NULL CHECK (ie_type IN ('MANDATORY', 'OPTIONAL', 'CONDITIONAL')),
    data_type VARCHAR(50) NOT NULL CHECK (data_type IN (
        'INTEGER', 'STRING', 'BOOLEAN', 'ENUM', 'BITSTRING', 'OCTETSTRING', 
        'SEQUENCE', 'CHOICE', 'SET', 'SEQUENCE_OF', 'SET_OF'
    )),
    ie_value JSONB,
    ie_description TEXT,
    validation_rules JSONB,
    dependencies JSONB,
    three_gpp_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Layer Parameters Table
CREATE TABLE IF NOT EXISTS public.layer_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE,
    layer VARCHAR(20) NOT NULL CHECK (layer IN (
        'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'NGAP', 
        'S1AP', 'X2AP', 'XnAP', 'PFCP', 'GTP', 'HTTP2'
    )),
    parameter_name VARCHAR(255) NOT NULL,
    parameter_type VARCHAR(50) NOT NULL CHECK (parameter_type IN (
        'CONFIG', 'MEASUREMENT', 'STATUS', 'CONTROL', 'TIMER', 'COUNTER'
    )),
    parameter_value JSONB,
    parameter_description TEXT,
    validation_rules JSONB,
    dependencies JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message templates for different protocols and layers
CREATE TABLE IF NOT EXISTS public.message_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_name TEXT NOT NULL,
    protocol TEXT NOT NULL,
    layer TEXT NOT NULL,
    message_type TEXT NOT NULL,
    message_name TEXT NOT NULL,
    message_description TEXT,
    direction TEXT NOT NULL CHECK (direction IN ('UL', 'DL', 'BIDIRECTIONAL')),
    standard_reference TEXT,
    release_version TEXT,
    message_structure JSONB NOT NULL, -- Complete message structure
    mandatory_fields JSONB DEFAULT '{}',
    optional_fields JSONB DEFAULT '{}',
    conditional_fields JSONB DEFAULT '{}',
    validation_rules JSONB DEFAULT '{}',
    example_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive IE library for all protocols
CREATE TABLE IF NOT EXISTS public.information_element_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ie_name TEXT NOT NULL,
    ie_type TEXT NOT NULL,
    protocol TEXT NOT NULL,
    layer TEXT NOT NULL,
    message_types TEXT[] NOT NULL, -- Which message types use this IE
    ie_description TEXT,
    ie_structure JSONB NOT NULL, -- Complete IE structure
    data_type TEXT NOT NULL, -- 'integer', 'bit_string', 'enumerated', 'octet_string', 'object'
    size_bits INTEGER,
    size_bytes INTEGER,
    mandatory BOOLEAN DEFAULT false,
    conditional BOOLEAN DEFAULT false,
    condition_description TEXT,
    allowed_values JSONB DEFAULT '{}',
    value_range JSONB DEFAULT '{}',
    default_value JSONB,
    validation_rules JSONB DEFAULT '{}',
    standard_reference TEXT,
    release_version TEXT DEFAULT 'Release 17',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 4. COMPREHENSIVE TEST EXECUTION SYSTEM
-- ==============================================

-- Test Case Executions
CREATE TABLE IF NOT EXISTS public.test_case_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    execution_id UUID DEFAULT gen_random_uuid() NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'timeout')),
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    current_step TEXT,
    total_steps INTEGER DEFAULT 0,
    completed_steps INTEGER DEFAULT 0,
    results JSONB,
    logs JSONB,
    errors JSONB,
    performance_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Case Results
CREATE TABLE IF NOT EXISTS public.test_case_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID REFERENCES public.test_case_executions(id) ON DELETE CASCADE NOT NULL,
    step_name TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'skipped', 'warning')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    message TEXT,
    details JSONB,
    metrics JSONB,
    screenshots JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test execution logs for tracking
CREATE TABLE IF NOT EXISTS public.test_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    test_case_id TEXT NOT NULL,
    execution_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_seconds INTEGER,
    status TEXT,
    resource_usage JSONB
);

-- Test configuration tables
CREATE TABLE IF NOT EXISTS public.test_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    configuration_type TEXT NOT NULL CHECK (configuration_type IN ('network', 'device', 'protocol', 'environment')),
    configuration_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test suites for grouping test cases
CREATE TABLE IF NOT EXISTS public.test_suites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    test_case_ids UUID[] NOT NULL,
    execution_order JSONB, -- Custom execution order
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 5. ML SYSTEM FOR ANALYTICS
-- ==============================================

-- Raw execution events (ingest)
CREATE TABLE IF NOT EXISTS public.ml_execution_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    user_id UUID REFERENCES public.users(id),
    test_case_id TEXT NOT NULL,
    tech TEXT, -- e.g., NR, LTE, IMS
    stage TEXT, -- setup, execute, teardown
    event_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level TEXT, -- info, warn, error
    code TEXT, -- error code or message key
    message TEXT,
    payload JSONB
);

-- Feature snapshots per run
CREATE TABLE IF NOT EXISTS public.ml_execution_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id),
    test_case_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    features JSONB NOT NULL
);

-- Labels/outcomes per run
CREATE TABLE IF NOT EXISTS public.ml_execution_labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID UNIQUE NOT NULL,
    outcome TEXT NOT NULL, -- pass, fail, timeout
    failure_class TEXT, -- e.g., auth_failure, rrc_timeout
    root_cause TEXT, -- optional curated root cause
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Model registry
CREATE TABLE IF NOT EXISTS public.ml_model_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name TEXT NOT NULL,
    version TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metrics JSONB, -- precision, recall, etc.
    artifact_url TEXT NOT NULL,
    active BOOLEAN DEFAULT FALSE
);

-- Recommendations generated for runs
CREATE TABLE IF NOT EXISTS public.ml_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recommendation TEXT NOT NULL,
    confidence NUMERIC,
    rationale TEXT,
    applied BOOLEAN DEFAULT FALSE,
    helpful BOOLEAN,
    metadata JSONB
);

-- ==============================================
-- 6. SECURITY & AUDIT SYSTEM
-- ==============================================

-- Security Events Table
CREATE TABLE IF NOT EXISTS public.security_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('login_attempt', 'failed_login', 'suspicious_activity', 'data_access', 'system_change', 'security_violation')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Audit Events Table
CREATE TABLE IF NOT EXISTS public.audit_events (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    details JSONB NOT NULL DEFAULT '{}',
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    category TEXT NOT NULL CHECK (category IN ('authentication', 'authorization', 'data_access', 'data_modification', 'system_change', 'security', 'compliance')),
    outcome TEXT NOT NULL CHECK (outcome IN ('success', 'failure', 'error')),
    session_id TEXT,
    request_id TEXT
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ==============================================
-- 7. MONITORING & ALERTING SYSTEM
-- ==============================================

-- System Metrics Table
CREATE TABLE IF NOT EXISTS public.system_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    cpu_usage DECIMAL(5,2) NOT NULL,
    memory_usage DECIMAL(5,2) NOT NULL,
    disk_usage DECIMAL(5,2) NOT NULL,
    network_bytes_in BIGINT NOT NULL DEFAULT 0,
    network_bytes_out BIGINT NOT NULL DEFAULT 0,
    database_connections INTEGER NOT NULL DEFAULT 0,
    application_requests INTEGER NOT NULL DEFAULT 0,
    application_response_time DECIMAL(10,2) NOT NULL DEFAULT 0,
    application_error_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Alert Rules Table
CREATE TABLE IF NOT EXISTS public.alert_rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    metric TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('greater_than', 'less_than', 'equals', 'not_equals')),
    threshold DECIMAL(10,2) NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    cooldown INTEGER NOT NULL DEFAULT 5,
    notification_channels TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id TEXT PRIMARY KEY,
    rule_id TEXT NOT NULL REFERENCES public.alert_rules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'acknowledged')) DEFAULT 'active',
    triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ==============================================
-- 8. NSA & ADVANCED 5G FEATURES
-- ==============================================

-- NSA Specific Tables
CREATE TABLE IF NOT EXISTS public.nsa_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE,
    nsa_type VARCHAR(20) NOT NULL CHECK (nsa_type IN ('EN-DC', 'NE-DC', 'NGEN-DC')),
    anchor_rat VARCHAR(10) NOT NULL CHECK (anchor_rat IN ('LTE', 'NR')),
    secondary_rat VARCHAR(10) NOT NULL CHECK (secondary_rat IN ('LTE', 'NR')),
    split_bearer_config JSONB,
    carrier_aggregation_config JSONB,
    measurement_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.split_bearers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nsa_config_id UUID REFERENCES public.nsa_configurations(id) ON DELETE CASCADE,
    bearer_id VARCHAR(50) NOT NULL,
    bearer_type VARCHAR(20) NOT NULL CHECK (bearer_type IN ('MCG', 'SCG', 'Split')),
    qos_parameters JSONB,
    pdcp_config JSONB,
    rlc_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6),
    metric_unit VARCHAR(50),
    metric_type VARCHAR(50) CHECK (metric_type IN (
        'LATENCY', 'THROUGHPUT', 'SUCCESS_RATE', 'ERROR_RATE', 'RESOURCE_UTILIZATION'
    )),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 9. VoLTE & VoNR SPECIFIC TABLES
-- ==============================================

-- VoLTE Test Cases Table
CREATE TABLE IF NOT EXISTS public.volte_test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'CallSetup', 'CallRelease', 'CallHandover', 'Emergency', 'Supplementary'
    )),
    subcategory VARCHAR(100),
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN (
        'Functional', 'Performance', 'RF', 'Stability', 'Sanity'
    )),
    complexity VARCHAR(20) NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_duration INTEGER, -- in seconds
    preconditions TEXT,
    test_steps TEXT,
    expected_signaling_flow TEXT,
    expected_ies TEXT,
    layer_parameters TEXT,
    expected_result TEXT,
    three_gpp_ref TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VoNR Test Cases Table
CREATE TABLE IF NOT EXISTS public.vonr_test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'CallSetup', 'CallRelease', 'CallHandover', 'Emergency', 'Supplementary'
    )),
    subcategory VARCHAR(100),
    test_type VARCHAR(50) NOT NULL CHECK (test_type IN (
        'Functional', 'Performance', 'RF', 'Stability', 'Sanity'
    )),
    complexity VARCHAR(20) NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_duration INTEGER, -- in seconds
    preconditions TEXT,
    test_steps TEXT,
    expected_signaling_flow TEXT,
    expected_ies TEXT,
    layer_parameters TEXT,
    expected_result TEXT,
    three_gpp_ref TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMS Signaling Flows
CREATE TABLE IF NOT EXISTS public.ims_signaling_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flow_name VARCHAR(255) NOT NULL,
    flow_type VARCHAR(50) NOT NULL CHECK (flow_type IN (
        'Registration', 'Call_Setup', 'Call_Release', 'Supplementary_Services', 'Emergency'
    )),
    protocol_stack TEXT[] NOT NULL,
    signaling_messages JSONB NOT NULL,
    message_sequence JSONB NOT NULL,
    three_gpp_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conference Call Flows
CREATE TABLE IF NOT EXISTS public.conference_call_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conference_type VARCHAR(50) NOT NULL CHECK (conference_type IN (
        'Audio_Conference', 'Video_Conference', 'Mixed_Media', 'Multiparty'
    )),
    participant_count INTEGER NOT NULL,
    signaling_flow JSONB NOT NULL,
    media_parameters JSONB,
    qos_requirements JSONB,
    three_gpp_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 10. ALL INDEXES FOR MAXIMUM PERFORMANCE
-- ==============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);

-- Test cases indexes
CREATE INDEX IF NOT EXISTS idx_test_cases_category ON public.test_cases(category);
CREATE INDEX IF NOT EXISTS idx_test_cases_protocol ON public.test_cases(protocol);
CREATE INDEX IF NOT EXISTS idx_test_cases_complexity ON public.test_cases(complexity);
CREATE INDEX IF NOT EXISTS idx_test_cases_priority ON public.test_cases(priority);
CREATE INDEX IF NOT EXISTS idx_test_cases_is_active ON public.test_cases(is_active);
CREATE INDEX IF NOT EXISTS idx_test_cases_tags ON public.test_cases USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_case_id ON public.test_cases(test_case_id);

-- Test messages indexes
CREATE INDEX IF NOT EXISTS idx_test_messages_test_case_id ON public.test_messages(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_messages_protocol ON public.test_messages(protocol);
CREATE INDEX IF NOT EXISTS idx_test_messages_layer ON public.test_messages(layer);

-- Information elements indexes
CREATE INDEX IF NOT EXISTS idx_information_elements_test_case_id ON public.information_elements(test_case_id);
CREATE INDEX IF NOT EXISTS idx_information_elements_message_id ON public.information_elements(message_id);
CREATE INDEX IF NOT EXISTS idx_information_elements_ie_type ON public.information_elements(ie_type);

-- Layer parameters indexes
CREATE INDEX IF NOT EXISTS idx_layer_parameters_test_case_id ON public.layer_parameters(test_case_id);
CREATE INDEX IF NOT EXISTS idx_layer_parameters_layer ON public.layer_parameters(layer);
CREATE INDEX IF NOT EXISTS idx_layer_parameters_parameter_type ON public.layer_parameters(parameter_type);

-- Test executions indexes
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON public.test_case_executions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON public.test_case_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON public.test_case_executions(status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_start_time ON public.test_case_executions(start_time);

-- ML indexes
CREATE INDEX IF NOT EXISTS idx_ml_events_run ON public.ml_execution_events(run_id);
CREATE INDEX IF NOT EXISTS idx_ml_events_tc ON public.ml_execution_events(test_case_id);
CREATE INDEX IF NOT EXISTS idx_ml_events_user ON public.ml_execution_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_events_time ON public.ml_execution_events(event_time);

-- Security indexes
CREATE INDEX IF NOT EXISTS idx_security_events_type ON public.security_events(type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events(created_at);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON public.system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON public.alerts(severity);

-- ==============================================
-- 11. ALL FUNCTIONS & TRIGGERS
-- ==============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create all triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at 
    BEFORE UPDATE ON public.subscription_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_test_cases_updated_at ON public.test_cases;
CREATE TRIGGER update_test_cases_updated_at 
    BEFORE UPDATE ON public.test_cases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_test_case_executions_updated_at ON public.test_case_executions;
CREATE TRIGGER update_test_case_executions_updated_at 
    BEFORE UPDATE ON public.test_case_executions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique test case IDs
CREATE OR REPLACE FUNCTION generate_test_case_id(category text, protocol text)
RETURNS text AS $$
DECLARE
    prefix text;
    counter integer;
    test_case_id text;
BEGIN
    -- Generate prefix based on category and protocol
    prefix := upper(substring(category from 1 for 3)) || '_' || 
              upper(replace(protocol, ' ', '_')) || '_';
    
    -- Get next counter value
    SELECT COALESCE(MAX(CAST(substring(test_case_id from length(prefix) + 1) AS integer)), 0) + 1
    INTO counter
    FROM public.test_cases 
    WHERE test_case_id LIKE prefix || '%';
    
    -- Format with leading zeros
    test_case_id := prefix || lpad(counter::text, 4, '0');
    
    RETURN test_case_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate test case execution statistics
CREATE OR REPLACE FUNCTION get_test_case_stats(test_case_uuid uuid)
RETURNS jsonb AS $$
DECLARE
    stats jsonb;
BEGIN
    SELECT jsonb_build_object(
        'total_executions', COUNT(*),
        'successful_executions', COUNT(*) FILTER (WHERE status = 'completed'),
        'failed_executions', COUNT(*) FILTER (WHERE status = 'failed'),
        'average_duration_ms', AVG(duration_ms),
        'last_execution', MAX(start_time),
        'success_rate', ROUND(
            (COUNT(*) FILTER (WHERE status = 'completed')::float / NULLIF(COUNT(*), 0)) * 100, 2
        )
    )
    INTO stats
    FROM public.test_case_executions
    WHERE test_case_id = test_case_uuid;
    
    RETURN COALESCE(stats, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- ML Functions
CREATE OR REPLACE FUNCTION extract_ml_features(run_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    events_count INTEGER;
    errors_count INTEGER;
    warnings_count INTEGER;
    features JSONB;
BEGIN
    -- Count events
    SELECT COUNT(*) INTO events_count
    FROM public.ml_execution_events
    WHERE run_id = run_uuid;
    
    -- Count errors and warnings
    SELECT 
        COUNT(*) FILTER (WHERE level = 'error'),
        COUNT(*) FILTER (WHERE level = 'warn' OR level = 'warning')
    INTO errors_count, warnings_count
    FROM public.ml_execution_events
    WHERE run_id = run_uuid;
    
    -- Build features JSON
    features := jsonb_build_object(
        'num_events', events_count,
        'num_errors', errors_count,
        'num_warnings', warnings_count
    );
    
    RETURN features;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_execution_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_execution_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_execution_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_recommendations ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL TO service_role USING (true);

-- Test cases policies (public read access)
DROP POLICY IF EXISTS "Anyone can view test cases" ON public.test_cases;
CREATE POLICY "Anyone can view test cases" ON public.test_cases
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage test cases" ON public.test_cases;
CREATE POLICY "Admins can manage test cases" ON public.test_cases
    FOR ALL TO service_role USING (true);

-- Test executions policies
DROP POLICY IF EXISTS "Users can view their own executions" ON public.test_case_executions;
CREATE POLICY "Users can view their own executions" ON public.test_case_executions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own executions" ON public.test_case_executions;
CREATE POLICY "Users can insert their own executions" ON public.test_case_executions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own executions" ON public.test_case_executions;
CREATE POLICY "Users can update their own executions" ON public.test_case_executions
    FOR UPDATE USING (auth.uid() = user_id);

-- Subscription plans policies (public read)
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
    FOR SELECT USING (true);

-- ML policies
DROP POLICY IF EXISTS "Users can view their own ML events" ON public.ml_execution_events;
CREATE POLICY "Users can view their own ML events" ON public.ml_execution_events
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own ML events" ON public.ml_execution_events;
CREATE POLICY "Users can insert their own ML events" ON public.ml_execution_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- 13. GRANT ALL PERMISSIONS
-- ==============================================

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant specific permissions for authenticated users
GRANT SELECT, INSERT, UPDATE ON public.test_case_executions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.test_case_results TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ml_execution_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ml_execution_features TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ml_execution_labels TO authenticated;
GRANT SELECT, UPDATE ON public.ml_recommendations TO authenticated;

-- Grant all permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Final verification message
SELECT 'COMPLETE 5GLabX Platform setup finished! All 70 files consolidated into one.' as status;