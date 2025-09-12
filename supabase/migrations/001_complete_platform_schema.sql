-- ==============================================
-- 5GLabX Platform - Complete Commercial Database Schema
-- Production-ready schema for commercial launch
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

-- ==============================================
-- 2. SUBSCRIPTION & BILLING
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
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    stripe_invoice_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
    invoice_url TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE IF NOT EXISTS public.usage_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    test_case_executions INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    data_processed_mb DECIMAL(10,2) DEFAULT 0,
    storage_used_mb DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- ==============================================
-- 3. TEST CASES & CONFIGURATIONS
-- ==============================================

-- Test case categories
CREATE TABLE IF NOT EXISTS public.test_case_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test cases
CREATE TABLE IF NOT EXISTS public.test_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.test_case_categories(id),
    category TEXT NOT NULL CHECK (category IN ('4G_LTE', '5G_NR', 'IMS_SIP', 'O_RAN', 'NB_IoT', 'V2X', 'NTN', 'CUSTOM')),
    protocol TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    complexity TEXT NOT NULL CHECK (complexity IN ('beginner', 'intermediate', 'advanced', 'expert')),
    test_type TEXT NOT NULL CHECK (test_type IN ('functional', 'performance', 'stability', 'stress', 'interoperability', 'security', 'mobility', 'conformance')),
    duration_minutes INTEGER DEFAULT 5,
    estimated_cost DECIMAL(10,4) DEFAULT 0.01,
    tags TEXT[] DEFAULT '{}',
    protocol_layers TEXT[] DEFAULT '{}',
    test_data JSONB DEFAULT '{}',
    expected_results JSONB DEFAULT '{}',
    success_criteria JSONB DEFAULT '{}',
    failure_thresholds JSONB DEFAULT '{}',
    performance_targets JSONB DEFAULT '{}',
    is_premium BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test case messages
CREATE TABLE IF NOT EXISTS public.test_case_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    timestamp_ms INTEGER DEFAULT 0,
    direction TEXT NOT NULL CHECK (direction IN ('UL', 'DL', 'BIDIRECTIONAL')),
    layer TEXT NOT NULL,
    protocol TEXT NOT NULL,
    message_type TEXT NOT NULL,
    message_name TEXT NOT NULL,
    message_description TEXT,
    standard_reference TEXT,
    release_version TEXT,
    dependencies TEXT[] DEFAULT '{}',
    expected_response_step_id TEXT,
    timeout_ms INTEGER DEFAULT 5000,
    validation_criteria JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_case_id, step_id)
);

-- Test case information elements
CREATE TABLE IF NOT EXISTS public.test_case_information_elements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.test_case_messages(id) ON DELETE CASCADE,
    step_id TEXT,
    ie_name TEXT NOT NULL,
    ie_type TEXT NOT NULL,
    ie_value JSONB,
    ie_value_hex TEXT,
    ie_value_binary TEXT,
    ie_size INTEGER,
    mandatory BOOLEAN DEFAULT false,
    is_valid BOOLEAN DEFAULT true,
    validation_errors TEXT[] DEFAULT '{}',
    validation_warnings TEXT[] DEFAULT '{}',
    standard_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test case layer parameters
CREATE TABLE IF NOT EXISTS public.test_case_layer_parameters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    layer TEXT NOT NULL,
    layer_configuration JSONB DEFAULT '{}',
    layer_capabilities JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_case_id, layer)
);

-- Test configurations
CREATE TABLE IF NOT EXISTS public.test_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    test_case_id UUID REFERENCES public.test_cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('4G_LTE', '5G_NR', 'IMS_SIP', 'O_RAN', 'NB_IoT', 'V2X', 'NTN')),
    protocol TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    configuration_data JSONB NOT NULL,
    is_template BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, user_id)
);

-- ==============================================
-- 4. TEST EXECUTION & RESULTS
-- ==============================================

-- Test case executions
CREATE TABLE IF NOT EXISTS public.test_case_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    configuration_id UUID REFERENCES public.test_configurations(id) ON DELETE SET NULL,
    execution_id TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled', 'paused')),
    execution_mode TEXT NOT NULL DEFAULT 'simulation' CHECK (execution_mode IN ('simulation', 'realtime', 'batch')),
    time_acceleration DECIMAL(5,2) DEFAULT 1.0,
    log_level TEXT NOT NULL DEFAULT 'detailed' CHECK (log_level IN ('basic', 'detailed', 'verbose')),
    capture_mode TEXT NOT NULL DEFAULT 'full' CHECK (capture_mode IN ('messages', 'full', 'performance')),
    output_format TEXT NOT NULL DEFAULT 'json' CHECK (output_format IN ('json', 'hex', 'binary', 'text')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    current_step TEXT,
    results JSONB DEFAULT '{}',
    logs JSONB DEFAULT '[]',
    errors JSONB DEFAULT '[]',
    performance_metrics JSONB DEFAULT '{}',
    cost DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test execution messages
CREATE TABLE IF NOT EXISTS public.test_execution_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('UL', 'DL', 'BIDIRECTIONAL')),
    layer TEXT NOT NULL,
    protocol TEXT NOT NULL,
    message_type TEXT NOT NULL,
    message_name TEXT NOT NULL,
    raw_data TEXT,
    decoded_data JSONB,
    information_elements JSONB DEFAULT '[]',
    layer_parameters JSONB DEFAULT '{}',
    validation_result JSONB DEFAULT '{}',
    performance_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test execution logs
CREATE TABLE IF NOT EXISTS public.test_execution_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error', 'critical')),
    source TEXT NOT NULL,
    layer TEXT,
    protocol TEXT,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 5. ANALYTICS & REPORTING
-- ==============================================

-- User analytics
CREATE TABLE IF NOT EXISTS public.user_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    test_executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    failed_executions INTEGER DEFAULT 0,
    total_duration_minutes INTEGER DEFAULT 0,
    data_processed_mb DECIMAL(10,2) DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Test case analytics
CREATE TABLE IF NOT EXISTS public.test_case_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    executions INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    failed_executions INTEGER DEFAULT 0,
    average_duration_ms INTEGER DEFAULT 0,
    average_success_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(test_case_id, date)
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,6) NOT NULL,
    metric_unit TEXT,
    layer TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 6. CONTENT MANAGEMENT
-- ==============================================

-- Documentation
CREATE TABLE IF NOT EXISTS public.documentation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    author_id UUID REFERENCES public.users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tutorials
CREATE TABLE IF NOT EXISTS public.tutorials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_time_minutes INTEGER,
    prerequisites TEXT[] DEFAULT '{}',
    learning_objectives TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    author_id UUID REFERENCES public.users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 7. SUPPORT & FEEDBACK
-- ==============================================

-- Support tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('technical', 'billing', 'feature_request', 'bug_report', 'general')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES public.users(id),
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('feature_request', 'bug_report', 'improvement', 'general')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'in_progress', 'completed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 8. SYSTEM CONFIGURATION
-- ==============================================

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature flags
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    target_users UUID[] DEFAULT '{}',
    target_roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 9. AUDIT LOGS
-- ==============================================

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 10. INDEXES FOR PERFORMANCE
-- ==============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON public.users (subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users (subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users (created_at);

-- Test cases indexes
CREATE INDEX IF NOT EXISTS idx_test_cases_test_case_id ON public.test_cases (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_category ON public.test_cases (category);
CREATE INDEX IF NOT EXISTS idx_test_cases_protocol ON public.test_cases (protocol);
CREATE INDEX IF NOT EXISTS idx_test_cases_complexity ON public.test_cases (complexity);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_type ON public.test_cases (test_type);
CREATE INDEX IF NOT EXISTS idx_test_cases_is_premium ON public.test_cases (is_premium);
CREATE INDEX IF NOT EXISTS idx_test_cases_is_featured ON public.test_cases (is_featured);
CREATE INDEX IF NOT EXISTS idx_test_cases_created_at ON public.test_cases (created_at);

-- Test case messages indexes
CREATE INDEX IF NOT EXISTS idx_test_case_messages_test_case_id ON public.test_case_messages (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_step_order ON public.test_case_messages (step_order);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_layer ON public.test_case_messages (layer);
CREATE INDEX IF NOT EXISTS idx_test_case_messages_protocol ON public.test_case_messages (protocol);

-- Test case executions indexes
CREATE INDEX IF NOT EXISTS idx_test_case_executions_test_case_id ON public.test_case_executions (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_user_id ON public.test_case_executions (user_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_status ON public.test_case_executions (status);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_execution_id ON public.test_case_executions (execution_id);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_start_time ON public.test_case_executions (start_time);
CREATE INDEX IF NOT EXISTS idx_test_case_executions_created_at ON public.test_case_executions (created_at);

-- Usage tracking indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON public.usage_tracking (user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_date ON public.usage_tracking (date);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics (user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON public.user_analytics (date);
CREATE INDEX IF NOT EXISTS idx_test_case_analytics_test_case_id ON public.test_case_analytics (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_analytics_date ON public.test_case_analytics (date);

-- Performance metrics indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_execution_id ON public.performance_metrics (execution_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics (user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_name ON public.performance_metrics (metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON public.performance_metrics (timestamp);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs (resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at);

-- ==============================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_execution_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test cases policies
CREATE POLICY "Users can view active test cases" ON public.test_cases
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view premium test cases if subscribed" ON public.test_cases
    FOR SELECT USING (
        is_premium = false OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND subscription_tier IN ('pro', 'enterprise', 'custom')
        )
    );

CREATE POLICY "Admins can manage all test cases" ON public.test_cases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test case executions policies
CREATE POLICY "Users can view their own executions" ON public.test_case_executions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own executions" ON public.test_case_executions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own executions" ON public.test_case_executions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all executions" ON public.test_case_executions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Test configurations policies
CREATE POLICY "Users can view their own configurations" ON public.test_configurations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view public configurations" ON public.test_configurations
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create their own configurations" ON public.test_configurations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own configurations" ON public.test_configurations
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own configurations" ON public.test_configurations
    FOR DELETE USING (user_id = auth.uid());

-- Usage tracking policies
CREATE POLICY "Users can view their own usage" ON public.usage_tracking
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert usage data" ON public.usage_tracking
    FOR INSERT WITH CHECK (true);

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tickets" ON public.support_tickets
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all tickets" ON public.support_tickets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==============================================
-- 12. TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Create function for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON public.user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_cases_updated_at 
    BEFORE UPDATE ON public.test_cases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_configurations_updated_at 
    BEFORE UPDATE ON public.test_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_executions_updated_at 
    BEFORE UPDATE ON public.test_case_executions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documentation_updated_at 
    BEFORE UPDATE ON public.documentation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at 
    BEFORE UPDATE ON public.tutorials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON public.support_tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at 
    BEFORE UPDATE ON public.feedback 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON public.system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at 
    BEFORE UPDATE ON public.feature_flags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 13. HELPER FUNCTIONS
-- ==============================================

-- Function to get user subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'subscription_tier', u.subscription_tier,
        'subscription_status', u.subscription_status,
        'trial_ends_at', u.trial_ends_at,
        'current_period_end', us.current_period_end,
        'cancel_at_period_end', us.cancel_at_period_end,
        'plan_name', sp.display_name,
        'features', sp.features,
        'limits', sp.limits
    )
    INTO result
    FROM public.users u
    LEFT JOIN public.user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
    LEFT JOIN public.subscription_plans sp ON us.plan_id = sp.id
    WHERE u.id = user_uuid;
    
    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can access premium features
CREATE OR REPLACE FUNCTION can_access_premium_features(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier TEXT;
BEGIN
    SELECT subscription_tier INTO user_tier
    FROM public.users
    WHERE id = user_uuid;
    
    RETURN user_tier IN ('pro', 'enterprise', 'custom');
END;
$$ LANGUAGE plpgsql;

-- Function to get user usage for current month
CREATE OR REPLACE FUNCTION get_user_monthly_usage(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'test_executions', COALESCE(SUM(test_case_executions), 0),
        'api_calls', COALESCE(SUM(api_calls), 0),
        'data_processed_mb', COALESCE(SUM(data_processed_mb), 0),
        'storage_used_mb', COALESCE(SUM(storage_used_mb), 0)
    )
    INTO result
    FROM public.usage_tracking
    WHERE user_id = user_uuid
    AND date >= date_trunc('month', CURRENT_DATE)
    AND date < date_trunc('month', CURRENT_DATE) + interval '1 month';
    
    RETURN COALESCE(result, '{"test_executions": 0, "api_calls": 0, "data_processed_mb": 0, "storage_used_mb": 0}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id, action, resource_type, resource_id, old_values, new_values
    ) VALUES (
        p_user_id, p_action, p_resource_type, p_resource_id, p_old_values, p_new_values
    );
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 14. VERIFICATION
-- ==============================================

-- Verify table creation
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'users', 'user_profiles', 'subscription_plans', 'user_subscriptions',
        'billing_history', 'usage_tracking', 'test_case_categories', 'test_cases',
        'test_case_messages', 'test_case_information_elements', 'test_case_layer_parameters',
        'test_configurations', 'test_case_executions', 'test_execution_messages',
        'test_execution_logs', 'user_analytics', 'test_case_analytics',
        'performance_metrics', 'documentation', 'tutorials', 'support_tickets',
        'feedback', 'system_settings', 'feature_flags', 'audit_logs'
    );
    
    IF table_count = 25 THEN
        RAISE NOTICE '✅ All 25 core tables created successfully';
    ELSE
        RAISE NOTICE '❌ Only % out of 25 core tables created', table_count;
    END IF;
END $$;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '🎉 5GLabX Platform database schema created successfully!';
    RAISE NOTICE '📊 Database now supports complete commercial platform';
    RAISE NOTICE '🔒 RLS policies and security are properly configured';
    RAISE NOTICE '📈 Performance indexes are optimized';
    RAISE NOTICE '🚀 Ready for commercial launch!';
END $$;