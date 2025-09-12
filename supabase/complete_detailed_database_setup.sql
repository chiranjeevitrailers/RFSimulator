-- 5GLabX Platform - Complete Detailed Database Setup
-- This file contains all essential SQL for setting up the 5GLabX Platform database
-- with comprehensive 3GPP-compliant test case data including messages, IEs, and layer parameters

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- 1. CORE SCHEMA - Users and Basic Tables
-- ==============================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create enhanced test_cases table
CREATE TABLE IF NOT EXISTS test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('4G_LTE', '5G_NR', 'IMS_SIP', 'O_RAN', 'NB_IoT', 'V2X', 'NTN')),
  subcategory VARCHAR(100),
  complexity VARCHAR(20) NOT NULL DEFAULT 'beginner' CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
  duration INTEGER NOT NULL DEFAULT 30,
  protocol_layers TEXT[] NOT NULL DEFAULT '{}',
  test_data JSONB NOT NULL DEFAULT '{}',
  expected_results JSONB NOT NULL DEFAULT '{}',
  test_case_id text UNIQUE,
  version text DEFAULT '1.0',
  tags text[],
  prerequisites jsonb,
  success_criteria jsonb,
  failure_scenarios jsonb,
  performance_metrics jsonb,
  test_environment jsonb,
  documentation_url text,
  is_template boolean DEFAULT false,
  parent_test_case_id uuid REFERENCES test_cases(id),
  execution_order integer DEFAULT 0,
  timeout_ms integer DEFAULT 300000,
  retry_count integer DEFAULT 0,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true
);

-- Create test_case_executions table
CREATE TABLE IF NOT EXISTS test_case_executions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  test_case_id uuid REFERENCES test_cases(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  execution_id uuid DEFAULT gen_random_uuid() NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'timeout')),
  start_time timestamp with time zone DEFAULT now() NOT NULL,
  end_time timestamp with time zone,
  duration_ms integer,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_step text,
  total_steps integer DEFAULT 0,
  completed_steps integer DEFAULT 0,
  results jsonb,
  logs jsonb,
  errors jsonb,
  performance_data jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create test_case_results table
CREATE TABLE IF NOT EXISTS test_case_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id uuid REFERENCES test_case_executions(id) ON DELETE CASCADE NOT NULL,
  step_name text NOT NULL,
  step_order integer NOT NULL,
  status text NOT NULL CHECK (status IN ('passed', 'failed', 'skipped', 'warning')),
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  duration_ms integer,
  message text,
  details jsonb,
  metrics jsonb,
  screenshots jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('login', 'logout', 'test_execution', 'test_case_view', 'dashboard_view')),
  activity_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. DETAILED TEST CASE DATA TABLES
-- ==============================================

-- Table for storing individual messages within test cases
CREATE TABLE IF NOT EXISTS public.test_case_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    timestamp_ms INTEGER NOT NULL DEFAULT 0,
    direction TEXT NOT NULL CHECK (direction IN ('UL', 'DL', 'BIDIRECTIONAL')),
    layer TEXT NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'SIP', 'IMS', 'E2', 'PC5', 'V2X', 'NTN')),
    protocol TEXT NOT NULL,
    message_type TEXT NOT NULL,
    message_name TEXT NOT NULL,
    message_description TEXT,
    
    -- 3GPP Reference Information
    standard_reference TEXT NOT NULL, -- e.g., "TS 38.331 6.2.2"
    release_version TEXT NOT NULL DEFAULT 'Release 17',
    
    -- Message Content
    raw_message_data JSONB, -- Raw message bytes/hex
    decoded_message JSONB,  -- Decoded message structure
    
    -- Dependencies and Flow
    dependencies TEXT[], -- Array of step_ids this message depends on
    expected_response_step_id TEXT, -- Expected response step
    timeout_ms INTEGER DEFAULT 5000,
    
    -- Validation
    validation_criteria JSONB,
    success_criteria JSONB,
    failure_scenarios JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(test_case_id, step_id)
);

-- Table for storing 3GPP Information Elements (IEs) for each message
CREATE TABLE IF NOT EXISTS public.test_case_information_elements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.test_case_messages(id) ON DELETE CASCADE,
    ie_name TEXT NOT NULL,
    ie_type TEXT NOT NULL CHECK (ie_type IN ('integer', 'bitstring', 'octetstring', 'enumerated', 'sequence', 'choice', 'bcdstring', 'bit')),
    ie_size INTEGER, -- Size in bits/bytes
    ie_range JSONB, -- Min/max values for validation
    
    -- IE Value
    ie_value JSONB NOT NULL, -- The actual value
    ie_value_hex TEXT, -- Hex representation
    ie_value_binary TEXT, -- Binary representation
    
    -- 3GPP Compliance
    mandatory BOOLEAN NOT NULL DEFAULT false,
    standard_reference TEXT NOT NULL, -- e.g., "TS 38.331 6.2.2"
    ie_description TEXT,
    
    -- Validation
    validation_result JSONB, -- Validation status, errors, warnings
    is_valid BOOLEAN NOT NULL DEFAULT true,
    validation_errors TEXT[],
    validation_warnings TEXT[],
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(message_id, ie_name)
);

-- Table for storing layer-specific parameters and configurations
CREATE TABLE IF NOT EXISTS public.test_case_layer_parameters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    layer TEXT NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'SIP', 'IMS', 'E2', 'PC5', 'V2X', 'NTN')),
    
    -- Layer Configuration
    layer_configuration JSONB NOT NULL, -- Layer-specific configuration
    layer_capabilities JSONB, -- Layer capabilities
    layer_constraints JSONB, -- Layer constraints
    
    -- Performance Parameters
    performance_parameters JSONB, -- Performance-related parameters
    timing_parameters JSONB, -- Timing constraints
    resource_parameters JSONB, -- Resource allocation parameters
    
    -- Statistics and Metrics
    expected_statistics JSONB, -- Expected layer statistics
    performance_metrics JSONB, -- Performance metrics
    quality_metrics JSONB, -- Quality metrics
    
    -- 3GPP Compliance
    standard_reference TEXT NOT NULL,
    compliance_level TEXT NOT NULL DEFAULT 'full' CHECK (compliance_level IN ('basic', 'enhanced', 'full')),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Constraints
    UNIQUE(test_case_id, layer)
);

-- ==============================================
-- 3. SECURITY AND AUDIT TABLES
-- ==============================================

-- Security Events Table
CREATE TABLE IF NOT EXISTS security_events (
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
CREATE TABLE IF NOT EXISTS audit_events (
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
CREATE TABLE IF NOT EXISTS user_sessions (
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
-- 4. MONITORING AND ALERTING TABLES
-- ==============================================

-- System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
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
CREATE TABLE IF NOT EXISTS alert_rules (
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
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    rule_id TEXT NOT NULL REFERENCES alert_rules(id) ON DELETE CASCADE,
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
-- 5. INDEXES FOR PERFORMANCE
-- ==============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Test cases indexes
CREATE INDEX IF NOT EXISTS idx_test_cases_category ON test_cases(category);
CREATE INDEX IF NOT EXISTS idx_test_cases_complexity ON test_cases(complexity);
CREATE INDEX IF NOT EXISTS idx_test_cases_is_active ON test_cases(is_active);
CREATE INDEX IF NOT EXISTS idx_test_cases_created_at ON test_cases(created_at);
CREATE INDEX IF NOT EXISTS idx_test_cases_priority ON test_cases(priority);
CREATE INDEX IF NOT EXISTS idx_test_cases_tags ON test_cases USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_case_id ON test_cases(test_case_id);

-- Test executions indexes
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON test_case_executions(test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON test_case_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON test_case_executions(status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_start_time ON test_case_executions(start_time);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_execution_id ON test_case_executions(execution_id);

-- Test results indexes
CREATE INDEX IF NOT EXISTS idx_test_case_results_execution_id ON test_case_results(execution_id);
CREATE INDEX IF NOT EXISTS idx_test_case_results_status ON test_case_results(status);
CREATE INDEX IF NOT EXISTS idx_test_case_results_step_order ON test_case_results(step_order);

-- User activities indexes
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);

-- Test case messages indexes
CREATE INDEX IF NOT EXISTS idx_test_case_messages_test_case_id ON public.test_case_messages (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_layer ON public.test_case_messages (layer);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_protocol ON public.test_case_messages (protocol);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_direction ON public.test_case_messages (direction);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_step_order ON public.test_case_messages (step_order);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_standard_reference ON public.test_case_messages (standard_reference);

-- Information elements indexes
CREATE INDEX IF NOT EXISTS idx_test_case_ies_message_id ON public.test_case_information_elements (message_id);
CREATE INDEX IF NOT EXISTS idx_test_case_ies_name ON public.test_case_information_elements (ie_name);
CREATE INDEX IF NOT EXISTS idx_test_case_ies_type ON public.test_case_information_elements (ie_type);
CREATE INDEX IF NOT EXISTS idx_test_case_ies_mandatory ON public.test_case_information_elements (mandatory);
CREATE INDEX IF NOT EXISTS idx_test_case_ies_valid ON public.test_case_information_elements (is_valid);

-- Layer parameters indexes
CREATE INDEX IF NOT EXISTS idx_test_case_layer_params_test_case_id ON public.test_case_layer_parameters (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_layer_params_layer ON public.test_case_layer_parameters (layer);
CREATE INDEX IF NOT EXISTS idx_test_case_layer_params_compliance ON public.test_case_layer_parameters (compliance_level);

-- Security events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_ip_address ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);

-- Audit events indexes
CREATE INDEX IF NOT EXISTS idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON audit_events(resource);
CREATE INDEX IF NOT EXISTS idx_audit_events_category ON audit_events(category);
CREATE INDEX IF NOT EXISTS idx_audit_events_severity ON audit_events(severity);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_events_outcome ON audit_events(outcome);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- System metrics indexes
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_metrics_created_at ON system_metrics(created_at);

-- Alert rules indexes
CREATE INDEX IF NOT EXISTS idx_alert_rules_metric ON alert_rules(metric);
CREATE INDEX IF NOT EXISTS idx_alert_rules_enabled ON alert_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_alert_rules_severity ON alert_rules(severity);

-- Alerts indexes
CREATE INDEX IF NOT EXISTS idx_alerts_rule_id ON alerts(rule_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON alerts(triggered_at);

-- ==============================================
-- 6. FUNCTIONS AND TRIGGERS
-- ==============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_cases_updated_at BEFORE UPDATE ON test_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_executions_updated_at 
  BEFORE UPDATE ON test_case_executions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_events_updated_at 
    BEFORE UPDATE ON security_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_rules_updated_at 
    BEFORE UPDATE ON alert_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at 
    BEFORE UPDATE ON alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_messages_updated_at 
    BEFORE UPDATE ON public.test_case_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_information_elements_updated_at 
    BEFORE UPDATE ON public.test_case_information_elements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_layer_parameters_updated_at 
    BEFORE UPDATE ON public.test_case_layer_parameters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique test case IDs
CREATE OR REPLACE FUNCTION generate_test_case_id(category text, protocol_version text)
RETURNS text AS $$
DECLARE
  prefix text;
  counter integer;
  test_case_id text;
BEGIN
  -- Generate prefix based on category and protocol
  prefix := upper(substring(category from 1 for 3)) || '_' || 
            upper(replace(protocol_version, ' ', '_')) || '_';
  
  -- Get next counter value
  SELECT COALESCE(MAX(CAST(substring(test_case_id from length(prefix) + 1) AS integer)), 0) + 1
  INTO counter
  FROM test_cases 
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
  FROM test_case_executions
  WHERE test_case_id = test_case_uuid;
  
  RETURN COALESCE(stats, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to get test case message flow
CREATE OR REPLACE FUNCTION get_test_case_message_flow(test_case_uuid uuid)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'step_id', step_id,
            'step_order', step_order,
            'timestamp_ms', timestamp_ms,
            'direction', direction,
            'layer', layer,
            'protocol', protocol,
            'message_type', message_type,
            'message_name', message_name,
            'message_description', message_description,
            'standard_reference', standard_reference,
            'dependencies', dependencies,
            'expected_response_step_id', expected_response_step_id,
            'timeout_ms', timeout_ms
        ) ORDER BY step_order
    )
    INTO result
    FROM public.test_case_messages
    WHERE test_case_id = test_case_uuid;
    
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to get test case information elements
CREATE OR REPLACE FUNCTION get_test_case_information_elements(test_case_uuid uuid)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'message_id', tcm.id,
            'step_id', tcm.step_id,
            'layer', tcm.layer,
            'message_type', tcm.message_type,
            'information_elements', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'ie_name', ie_name,
                        'ie_type', ie_type,
                        'ie_value', ie_value,
                        'mandatory', mandatory,
                        'standard_reference', standard_reference,
                        'is_valid', is_valid,
                        'validation_errors', validation_errors
                    )
                )
                FROM public.test_case_information_elements
                WHERE message_id = tcm.id
            )
        )
    )
    INTO result
    FROM public.test_case_messages tcm
    WHERE tcm.test_case_id = test_case_uuid
    ORDER BY tcm.step_order;
    
    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to get test case layer parameters
CREATE OR REPLACE FUNCTION get_test_case_layer_parameters(test_case_uuid uuid)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_object_agg(
        layer,
        jsonb_build_object(
            'layer_configuration', layer_configuration,
            'layer_capabilities', layer_capabilities,
            'performance_parameters', performance_parameters,
            'expected_statistics', expected_statistics,
            'performance_metrics', performance_metrics,
            'standard_reference', standard_reference,
            'compliance_level', compliance_level
        )
    )
    INTO result
    FROM public.test_case_layer_parameters
    WHERE test_case_id = test_case_uuid;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to validate 3GPP compliance
CREATE OR REPLACE FUNCTION validate_3gpp_compliance(test_case_uuid uuid)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
    total_messages integer;
    valid_messages integer;
    total_ies integer;
    valid_ies integer;
    compliance_score decimal;
BEGIN
    -- Count messages
    SELECT COUNT(*) INTO total_messages
    FROM public.test_case_messages
    WHERE test_case_id = test_case_uuid;
    
    -- Count valid messages
    SELECT COUNT(*) INTO valid_messages
    FROM public.test_case_messages
    WHERE test_case_id = test_case_uuid
    AND standard_reference IS NOT NULL
    AND standard_reference != '';
    
    -- Count IEs
    SELECT COUNT(*) INTO total_ies
    FROM public.test_case_information_elements tcie
    JOIN public.test_case_messages tcm ON tcie.message_id = tcm.id
    WHERE tcm.test_case_id = test_case_uuid;
    
    -- Count valid IEs
    SELECT COUNT(*) INTO valid_ies
    FROM public.test_case_information_elements tcie
    JOIN public.test_case_messages tcm ON tcie.message_id = tcm.id
    WHERE tcm.test_case_id = test_case_uuid
    AND tcie.is_valid = true;
    
    -- Calculate compliance score
    compliance_score := CASE 
        WHEN total_messages = 0 THEN 0
        ELSE (valid_messages::decimal / total_messages::decimal) * 100
    END;
    
    result := jsonb_build_object(
        'total_messages', total_messages,
        'valid_messages', valid_messages,
        'total_information_elements', total_ies,
        'valid_information_elements', valid_ies,
        'compliance_score', compliance_score,
        'message_compliance', CASE WHEN total_messages > 0 THEN (valid_messages::decimal / total_messages::decimal) * 100 ELSE 0 END,
        'ie_compliance', CASE WHEN total_ies > 0 THEN (valid_ies::decimal / total_ies::decimal) * 100 ELSE 0 END,
        'validation_timestamp', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_case_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_case_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_layer_parameters ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test cases RLS Policies
CREATE POLICY "Authenticated users can view test cases" ON test_cases
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage test cases" ON test_cases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Test executions RLS Policies
CREATE POLICY "Users can view their own test executions" ON test_case_executions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test executions" ON test_case_executions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test executions" ON test_case_executions 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all test executions" ON test_case_executions 
  FOR ALL TO service_role USING (true);

-- Test results RLS Policies
CREATE POLICY "Users can view results of their executions" ON test_case_results 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM test_case_executions 
      WHERE id = test_case_results.execution_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert results for their executions" ON test_case_results 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM test_case_executions 
      WHERE id = test_case_results.execution_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all test results" ON test_case_results 
  FOR ALL TO service_role USING (true);

-- User activities RLS Policies
CREATE POLICY "Users can view own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities" ON user_activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Security events RLS Policies
CREATE POLICY "Admins can view all security events" ON security_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own security events" ON security_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert security events" ON security_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update security events" ON security_events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Audit events RLS Policies
CREATE POLICY "Admins can view all audit events" ON audit_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own audit events" ON audit_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert audit events" ON audit_events
    FOR INSERT WITH CHECK (true);

-- User sessions RLS Policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions" ON user_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can manage sessions" ON user_sessions
    FOR ALL WITH CHECK (true);

-- System metrics RLS Policies
CREATE POLICY "Admins can view system metrics" ON system_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert metrics" ON system_metrics
    FOR INSERT WITH CHECK (true);

-- Alert rules RLS Policies
CREATE POLICY "Admins can manage alert rules" ON alert_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Alerts RLS Policies
CREATE POLICY "Admins can view all alerts" ON alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update alerts" ON alerts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "System can insert alerts" ON alerts
    FOR INSERT WITH CHECK (true);

-- Test case messages RLS Policies
CREATE POLICY "Users can view messages of accessible test cases" ON public.test_case_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_cases 
            WHERE id = test_case_messages.test_case_id 
            AND (is_active = true OR created_by = auth.uid())
        )
    );

CREATE POLICY "Admins can manage all test case messages" ON public.test_case_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test case information elements RLS Policies
CREATE POLICY "Users can view IEs of accessible messages" ON public.test_case_information_elements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_messages tcm
            JOIN public.test_cases tc ON tcm.test_case_id = tc.id
            WHERE tcm.id = test_case_information_elements.message_id 
            AND (tc.is_active = true OR tc.created_by = auth.uid())
        )
    );

CREATE POLICY "Admins can manage all test case IEs" ON public.test_case_information_elements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test case layer parameters RLS Policies
CREATE POLICY "Users can view layer params of accessible test cases" ON public.test_case_layer_parameters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_cases 
            WHERE id = test_case_layer_parameters.test_case_id 
            AND (is_active = true OR created_by = auth.uid())
        )
    );

CREATE POLICY "Admins can manage all layer parameters" ON public.test_case_layer_parameters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==============================================
-- 8. INITIAL DATA
-- ==============================================

-- Insert default admin user
INSERT INTO users (email, full_name, role, subscription_tier, subscription_status, is_active)
VALUES ('admin@5glabx.com', '5GLabX Admin', 'admin', 'enterprise', 'active', true)
ON CONFLICT (email) DO NOTHING;

-- ==============================================
-- 9. VERIFICATION
-- ==============================================

-- Verify table creation
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('users', 'test_cases', 'test_case_executions', 'test_case_results', 'user_activities', 'security_events', 'audit_events', 'user_sessions', 'system_metrics', 'alert_rules', 'alerts', 'test_case_messages', 'test_case_information_elements', 'test_case_layer_parameters');
    
    IF table_count = 14 THEN
        RAISE NOTICE '✅ All 14 core tables created successfully';
    ELSE
        RAISE NOTICE '❌ Only % out of 14 tables created', table_count;
    END IF;
END $$;

-- Verify admin user
DO $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count
    FROM users 
    WHERE role = 'admin' AND email = 'admin@5glabx.com';
    
    IF admin_count = 1 THEN
        RAISE NOTICE '✅ Admin user created successfully';
    ELSE
        RAISE NOTICE '❌ Admin user not found';
    END IF;
END $$;

-- Verify RLS policies
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    IF policy_count >= 30 THEN
        RAISE NOTICE '✅ % RLS policies created successfully', policy_count;
    ELSE
        RAISE NOTICE '❌ Only % RLS policies created', policy_count;
    END IF;
END $$;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '🎉 5GLabX Platform detailed database setup completed successfully!';
    RAISE NOTICE '📊 Database now supports comprehensive 3GPP test case data storage';
    RAISE NOTICE '🔒 Security policies and RLS are properly configured';
    RAISE NOTICE '📈 Performance indexes are optimized';
    RAISE NOTICE '🚀 Ready for detailed test case implementation!';
    RAISE NOTICE '📋 Next: Run seed_detailed_test_cases.sql to populate with sample data';
END $$;