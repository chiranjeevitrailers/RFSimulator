-- ==============================================
-- 5GLabX Platform - Core Schema (Production Ready)
-- Complete commercial SaaS platform with all features
-- ==============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==============================================
-- 1. AUTHENTICATION & USER MANAGEMENT
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

-- ==============================================
-- 2. SUBSCRIPTION & BILLING SYSTEM
-- ==============================================

-- Subscription plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
    features JSONB NOT NULL DEFAULT '{}',
    limits JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
-- 3. TEST CASES & EXECUTION SYSTEM
-- ==============================================

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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- ==============================================
-- 4. ACCESS CONTROL & RESTRICTIONS
-- ==============================================

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

-- ==============================================
-- 5. INDEXES FOR PERFORMANCE
-- ==============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON public.users (subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users (subscription_status);

-- Test cases indexes
CREATE INDEX IF NOT EXISTS idx_test_cases_category ON public.test_cases (category);
CREATE INDEX IF NOT EXISTS idx_test_cases_protocol ON public.test_cases (protocol);
CREATE INDEX IF NOT EXISTS idx_test_cases_complexity ON public.test_cases (complexity);
CREATE INDEX IF NOT EXISTS idx_test_cases_priority ON public.test_cases (priority);
CREATE INDEX IF NOT EXISTS idx_test_cases_is_active ON public.test_cases (is_active);
CREATE INDEX IF NOT EXISTS idx_test_cases_tags ON public.test_cases USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_case_id ON public.test_cases (test_case_id);

-- Test messages indexes
CREATE INDEX IF NOT EXISTS idx_test_messages_test_case_id ON public.test_messages (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_messages_protocol ON public.test_messages (protocol);
CREATE INDEX IF NOT EXISTS idx_test_messages_layer ON public.test_messages (layer);

-- Information elements indexes
CREATE INDEX IF NOT EXISTS idx_information_elements_test_case_id ON public.information_elements (test_case_id);
CREATE INDEX IF NOT EXISTS idx_information_elements_message_id ON public.information_elements (message_id);
CREATE INDEX IF NOT EXISTS idx_information_elements_ie_type ON public.information_elements (ie_type);

-- Layer parameters indexes
CREATE INDEX IF NOT EXISTS idx_layer_parameters_test_case_id ON public.layer_parameters (test_case_id);
CREATE INDEX IF NOT EXISTS idx_layer_parameters_layer ON public.layer_parameters (layer);
CREATE INDEX IF NOT EXISTS idx_layer_parameters_parameter_type ON public.layer_parameters (parameter_type);

-- Test executions indexes
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON public.test_case_executions (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON public.test_case_executions (user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON public.test_case_executions (status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_start_time ON public.test_case_executions (start_time);

-- Access logs indexes
CREATE INDEX IF NOT EXISTS idx_user_access_logs_user_id ON public.user_access_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_user_access_logs_timestamp ON public.user_access_logs (timestamp);
CREATE INDEX IF NOT EXISTS idx_test_execution_logs_user_id ON public.test_execution_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_test_execution_logs_execution_time ON public.test_execution_logs (execution_time);

-- ==============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_execution_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users 
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all users" ON public.users 
    FOR ALL TO service_role USING (true);

-- Test cases policies (public read access)
CREATE POLICY "Anyone can view test cases" ON public.test_cases 
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage test cases" ON public.test_cases 
    FOR ALL TO service_role USING (true);

-- Test executions policies
CREATE POLICY "Users can view their own executions" ON public.test_case_executions 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own executions" ON public.test_case_executions 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own executions" ON public.test_case_executions 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all executions" ON public.test_case_executions 
    FOR ALL TO service_role USING (true);

-- Test results policies
CREATE POLICY "Users can view results of their executions" ON public.test_case_results 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = test_case_results.execution_id 
            AND user_id = auth.uid()
        )
    );
CREATE POLICY "Admins can manage all results" ON public.test_case_results 
    FOR ALL TO service_role USING (true);

-- Subscription plans policies (public read)
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans 
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans 
    FOR ALL TO service_role USING (true);

-- Invoices policies
CREATE POLICY "Users can view their own invoices" ON public.invoices 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all invoices" ON public.invoices 
    FOR ALL TO service_role USING (true);

-- ==============================================
-- 7. FUNCTIONS & TRIGGERS
-- ==============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at 
    BEFORE UPDATE ON public.subscription_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_gateways_updated_at 
    BEFORE UPDATE ON public.payment_gateways 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_settings_updated_at 
    BEFORE UPDATE ON public.tax_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_cases_updated_at 
    BEFORE UPDATE ON public.test_cases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- ==============================================
-- 8. GRANT PERMISSIONS
-- ==============================================

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;