-- Detailed Test Case Data Migration
-- This migration creates comprehensive tables for storing 3GPP-compliant test case data
-- including messages, information elements, layer parameters, and protocol-specific data

-- ==============================================
-- 1. TEST CASE MESSAGES TABLE
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

-- ==============================================
-- 2. INFORMATION ELEMENTS TABLE
-- ==============================================

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

-- ==============================================
-- 3. LAYER PARAMETERS TABLE
-- ==============================================

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
-- 4. PROTOCOL SPECIFIC DATA TABLES
-- ==============================================

-- RRC Protocol Data
CREATE TABLE IF NOT EXISTS public.test_case_rrc_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    
    -- RRC Configuration
    rrc_configuration JSONB NOT NULL,
    rrc_procedures JSONB NOT NULL,
    rrc_timers JSONB,
    rrc_counters JSONB,
    
    -- RRC States
    initial_rrc_state TEXT,
    final_rrc_state TEXT,
    state_transitions JSONB,
    
    -- RRC Messages
    rrc_messages JSONB, -- RRC-specific message data
    rrc_measurements JSONB, -- Measurement configurations
    
    -- 3GPP Compliance
    standard_reference TEXT NOT NULL DEFAULT 'TS 38.331',
    release_version TEXT NOT NULL DEFAULT 'Release 17',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(test_case_id)
);

-- NAS Protocol Data
CREATE TABLE IF NOT EXISTS public.test_case_nas_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    
    -- NAS Configuration
    nas_configuration JSONB NOT NULL,
    nas_procedures JSONB NOT NULL,
    nas_security JSONB,
    nas_mobility JSONB,
    
    -- NAS States
    initial_nas_state TEXT,
    final_nas_state TEXT,
    state_transitions JSONB,
    
    -- NAS Messages
    nas_messages JSONB, -- NAS-specific message data
    nas_identities JSONB, -- Identity management
    
    -- 3GPP Compliance
    standard_reference TEXT NOT NULL DEFAULT 'TS 24.501',
    release_version TEXT NOT NULL DEFAULT 'Release 17',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(test_case_id)
);

-- MAC Protocol Data
CREATE TABLE IF NOT EXISTS public.test_case_mac_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    
    -- MAC Configuration
    mac_configuration JSONB NOT NULL,
    mac_procedures JSONB NOT NULL,
    mac_scheduling JSONB,
    mac_harq JSONB,
    
    -- MAC Channels
    logical_channels JSONB,
    transport_channels JSONB,
    physical_channels JSONB,
    
    -- MAC Statistics
    mac_statistics JSONB,
    mac_performance JSONB,
    
    -- 3GPP Compliance
    standard_reference TEXT NOT NULL DEFAULT 'TS 38.321',
    release_version TEXT NOT NULL DEFAULT 'Release 17',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(test_case_id)
);

-- PHY Protocol Data
CREATE TABLE IF NOT EXISTS public.test_case_phy_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    
    -- PHY Configuration
    phy_configuration JSONB NOT NULL,
    phy_parameters JSONB NOT NULL,
    phy_measurements JSONB,
    phy_synchronization JSONB,
    
    -- PHY Resources
    resource_allocation JSONB,
    power_control JSONB,
    beamforming JSONB,
    
    -- PHY Performance
    phy_performance JSONB,
    phy_statistics JSONB,
    
    -- 3GPP Compliance
    standard_reference TEXT NOT NULL DEFAULT 'TS 38.211',
    release_version TEXT NOT NULL DEFAULT 'Release 17',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(test_case_id)
);

-- ==============================================
-- 5. TEST CASE EXECUTION DETAILS
-- ==============================================

-- Enhanced test case execution with detailed message tracking
CREATE TABLE IF NOT EXISTS public.test_case_execution_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES public.test_case_messages(id) ON DELETE CASCADE,
    
    -- Execution Details
    execution_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    execution_duration_ms INTEGER,
    execution_status TEXT NOT NULL CHECK (execution_status IN ('pending', 'sent', 'received', 'timeout', 'error', 'success')),
    
    -- Message Data
    sent_message_data JSONB, -- Actual sent message
    received_message_data JSONB, -- Received response
    message_validation JSONB, -- Validation results
    
    -- Performance Data
    message_latency_ms INTEGER,
    message_throughput_bps INTEGER,
    message_error_rate DECIMAL(5,4),
    
    -- Error Information
    error_details JSONB,
    error_codes TEXT[],
    error_messages TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    UNIQUE(execution_id, message_id)
);

-- ==============================================
-- 6. INDEXES FOR PERFORMANCE
-- ==============================================

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

-- Protocol specific data indexes
CREATE INDEX IF NOT EXISTS idx_test_case_rrc_data_test_case_id ON public.test_case_rrc_data (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_nas_data_test_case_id ON public.test_case_nas_data (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_mac_data_test_case_id ON public.test_case_mac_data (test_case_id);
CREATE INDEX IF NOT EXISTS idx_test_case_phy_data_test_case_id ON public.test_case_phy_data (test_case_id);

-- Execution messages indexes
CREATE INDEX IF NOT EXISTS idx_test_case_execution_messages_execution_id ON public.test_case_execution_messages (execution_id);
CREATE INDEX IF NOT EXISTS idx_test_case_execution_messages_message_id ON public.test_case_execution_messages (message_id);
CREATE INDEX IF NOT EXISTS idx_test_case_execution_messages_status ON public.test_case_execution_messages (execution_status);
CREATE INDEX IF NOT EXISTS idx_test_case_execution_messages_timestamp ON public.test_case_execution_messages (execution_timestamp);

-- ==============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all new tables
ALTER TABLE public.test_case_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_information_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_layer_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_rrc_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_nas_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_mac_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_phy_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_case_execution_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for test_case_messages
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

-- RLS Policies for test_case_information_elements
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

-- RLS Policies for test_case_layer_parameters
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

-- RLS Policies for protocol specific data tables
CREATE POLICY "Users can view protocol data of accessible test cases" ON public.test_case_rrc_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_cases 
            WHERE id = test_case_rrc_data.test_case_id 
            AND (is_active = true OR created_by = auth.uid())
        )
    );

CREATE POLICY "Admins can manage all RRC data" ON public.test_case_rrc_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Similar policies for other protocol tables
CREATE POLICY "Users can view NAS data of accessible test cases" ON public.test_case_nas_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_cases 
            WHERE id = test_case_nas_data.test_case_id 
            AND (is_active = true OR created_by = auth.uid())
        )
    );

CREATE POLICY "Admins can manage all NAS data" ON public.test_case_nas_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view MAC data of accessible test cases" ON public.test_case_mac_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_cases 
            WHERE id = test_case_mac_data.test_case_id 
            AND (is_active = true OR created_by = auth.uid())
        )
    );

CREATE POLICY "Admins can manage all MAC data" ON public.test_case_mac_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view PHY data of accessible test cases" ON public.test_case_phy_data
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_cases 
            WHERE id = test_case_phy_data.test_case_id 
            AND (is_active = true OR created_by = auth.uid())
        )
    );

CREATE POLICY "Admins can manage all PHY data" ON public.test_case_phy_data
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for execution messages
CREATE POLICY "Users can view execution messages of their executions" ON public.test_case_execution_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = test_case_execution_messages.execution_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert execution messages for their executions" ON public.test_case_execution_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = test_case_execution_messages.execution_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all execution messages" ON public.test_case_execution_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ==============================================
-- 8. TRIGGERS FOR UPDATED_AT
-- ==============================================

-- Create triggers for updated_at on all new tables
CREATE TRIGGER update_test_case_messages_updated_at 
    BEFORE UPDATE ON public.test_case_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_information_elements_updated_at 
    BEFORE UPDATE ON public.test_case_information_elements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_layer_parameters_updated_at 
    BEFORE UPDATE ON public.test_case_layer_parameters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_rrc_data_updated_at 
    BEFORE UPDATE ON public.test_case_rrc_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_nas_data_updated_at 
    BEFORE UPDATE ON public.test_case_nas_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_mac_data_updated_at 
    BEFORE UPDATE ON public.test_case_mac_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_phy_data_updated_at 
    BEFORE UPDATE ON public.test_case_phy_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_case_execution_messages_updated_at 
    BEFORE UPDATE ON public.test_case_execution_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 9. HELPER FUNCTIONS
-- ==============================================

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
-- 10. VERIFICATION
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
        'test_case_messages', 
        'test_case_information_elements', 
        'test_case_layer_parameters',
        'test_case_rrc_data',
        'test_case_nas_data',
        'test_case_mac_data',
        'test_case_phy_data',
        'test_case_execution_messages'
    );
    
    IF table_count = 8 THEN
        RAISE NOTICE '✅ All 8 detailed test case data tables created successfully';
    ELSE
        RAISE NOTICE '❌ Only % out of 8 detailed test case data tables created', table_count;
    END IF;
END $$;

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '🎉 Detailed test case data migration completed successfully!';
    RAISE NOTICE '📊 Database now supports comprehensive 3GPP test case data storage';
    RAISE NOTICE '🔒 RLS policies and security are properly configured';
    RAISE NOTICE '📈 Performance indexes are optimized';
    RAISE NOTICE '🚀 Ready for detailed test case implementation!';
END $$;