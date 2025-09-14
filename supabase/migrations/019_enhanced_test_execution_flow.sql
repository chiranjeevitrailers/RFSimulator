-- ==============================================
-- 5GLabX Platform - Enhanced Test Execution Flow
-- Ensures proper storage of 3GPP message flows, IEs, and layer parameters
-- ==============================================

-- ==============================================
-- 1. ENHANCED TEST CASE EXECUTION TRACKING
-- ==============================================

-- Add columns to track expected vs actual message flow
ALTER TABLE public.test_case_executions 
ADD COLUMN IF NOT EXISTS expected_message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS message_flow_compliance JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS layer_analysis_results JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ie_validation_results JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS timing_analysis_results JSONB DEFAULT '{}';

-- ==============================================
-- 2. MESSAGE FLOW COMPLIANCE TRACKING
-- ==============================================

-- Table to track message flow compliance against 3GPP standards
CREATE TABLE IF NOT EXISTS public.message_flow_compliance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_run_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    test_case_id UUID NOT NULL REFERENCES public.test_cases(id) ON DELETE CASCADE,
    
    -- Flow identification
    flow_name TEXT NOT NULL, -- e.g., 'Initial Access', 'Handover', 'Call Setup'
    flow_type TEXT NOT NULL, -- e.g., 'initial_access', 'handover', 'call_setup'
    protocol TEXT NOT NULL, -- e.g., '5G-NR', 'LTE', 'IMS'
    
    -- Expected vs Actual
    expected_messages JSONB NOT NULL, -- Expected message sequence
    actual_messages JSONB NOT NULL,   -- Actual message sequence
    missing_messages JSONB DEFAULT '{}', -- Messages that were expected but not found
    unexpected_messages JSONB DEFAULT '{}', -- Messages that were found but not expected
    
    -- Compliance metrics
    compliance_score DECIMAL(5,2) DEFAULT 0.0, -- 0-100% compliance
    timing_compliance DECIMAL(5,2) DEFAULT 0.0, -- Timing compliance score
    ie_compliance DECIMAL(5,2) DEFAULT 0.0, -- IE compliance score
    layer_compliance DECIMAL(5,2) DEFAULT 0.0, -- Layer compliance score
    
    -- 3GPP standard compliance
    standard_reference TEXT, -- e.g., 'TS 38.331', 'TS 24.501'
    release_version TEXT, -- e.g., 'Release 17', 'Release 16'
    compliance_notes TEXT[] DEFAULT '{}',
    
    -- Analysis results
    analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 3. ENHANCED INFORMATION ELEMENT VALIDATION
-- ==============================================

-- Table to track IE validation against 3GPP standards
CREATE TABLE IF NOT EXISTS public.ie_validation_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_run_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES public.decoded_messages(id) ON DELETE CASCADE,
    
    -- IE identification
    ie_name TEXT NOT NULL,
    ie_type TEXT NOT NULL,
    ie_path TEXT, -- JSON path for nested IEs
    
    -- Expected vs Actual
    expected_value JSONB,
    actual_value JSONB,
    expected_presence BOOLEAN DEFAULT true,
    actual_presence BOOLEAN DEFAULT true,
    
    -- Validation results
    is_valid BOOLEAN DEFAULT true,
    validation_errors TEXT[] DEFAULT '{}',
    validation_warnings TEXT[] DEFAULT '{}',
    
    -- 3GPP compliance
    standard_reference TEXT, -- e.g., 'TS 38.331 Section 6.2.2'
    mandatory_ie BOOLEAN DEFAULT false,
    conditional_ie BOOLEAN DEFAULT false,
    condition_description TEXT,
    
    -- Value validation
    value_range JSONB, -- Min/max values for numeric IEs
    allowed_values JSONB, -- Allowed values for enumerated IEs
    format_validation TEXT, -- Format validation result
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 4. LAYER PARAMETER ANALYSIS
-- ==============================================

-- Table to track layer parameter analysis
CREATE TABLE IF NOT EXISTS public.layer_parameter_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_run_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    layer TEXT NOT NULL CHECK (layer IN ('PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS')),
    
    -- Parameter analysis
    parameter_name TEXT NOT NULL,
    parameter_category TEXT, -- e.g., 'radio', 'security', 'mobility'
    expected_value JSONB,
    actual_value JSONB,
    value_variance DECIMAL(10,4), -- Percentage variance from expected
    
    -- Performance metrics
    min_value JSONB,
    max_value JSONB,
    avg_value JSONB,
    std_deviation DECIMAL(10,4),
    
    -- Analysis results
    is_within_spec BOOLEAN DEFAULT true,
    spec_reference TEXT, -- 3GPP specification reference
    analysis_notes TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 5. TIMING ANALYSIS FOR MESSAGE FLOWS
-- ==============================================

-- Table to track timing analysis for message flows
CREATE TABLE IF NOT EXISTS public.message_timing_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_run_id UUID NOT NULL REFERENCES public.test_case_executions(id) ON DELETE CASCADE,
    flow_id TEXT NOT NULL, -- Reference to message flow
    
    -- Timing measurements
    expected_duration_ms INTEGER,
    actual_duration_ms INTEGER,
    timing_variance_ms INTEGER, -- Difference from expected
    
    -- Message timing
    message_sequence JSONB NOT NULL, -- Sequence of messages with timestamps
    inter_message_delays JSONB DEFAULT '{}', -- Delays between messages
    
    -- Timing compliance
    timing_compliance_score DECIMAL(5,2) DEFAULT 0.0, -- 0-100%
    timing_violations JSONB DEFAULT '{}', -- Timing violations found
    
    -- 3GPP timing requirements
    max_allowed_duration_ms INTEGER,
    min_required_duration_ms INTEGER,
    timing_standard_reference TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Message flow compliance indexes
CREATE INDEX IF NOT EXISTS idx_message_flow_compliance_test_run_id ON public.message_flow_compliance(test_run_id);
CREATE INDEX IF NOT EXISTS idx_message_flow_compliance_test_case_id ON public.message_flow_compliance(test_case_id);
CREATE INDEX IF NOT EXISTS idx_message_flow_compliance_flow_type ON public.message_flow_compliance(flow_type);
CREATE INDEX IF NOT EXISTS idx_message_flow_compliance_protocol ON public.message_flow_compliance(protocol);
CREATE INDEX IF NOT EXISTS idx_message_flow_compliance_score ON public.message_flow_compliance(compliance_score);

-- IE validation indexes
CREATE INDEX IF NOT EXISTS idx_ie_validation_test_run_id ON public.ie_validation_results(test_run_id);
CREATE INDEX IF NOT EXISTS idx_ie_validation_message_id ON public.ie_validation_results(message_id);
CREATE INDEX IF NOT EXISTS idx_ie_validation_ie_name ON public.ie_validation_results(ie_name);
CREATE INDEX IF NOT EXISTS idx_ie_validation_is_valid ON public.ie_validation_results(is_valid);
CREATE INDEX IF NOT EXISTS idx_ie_validation_mandatory ON public.ie_validation_results(mandatory_ie);

-- Layer parameter analysis indexes
CREATE INDEX IF NOT EXISTS idx_layer_param_analysis_test_run_id ON public.layer_parameter_analysis(test_run_id);
CREATE INDEX IF NOT EXISTS idx_layer_param_analysis_layer ON public.layer_parameter_analysis(layer);
CREATE INDEX IF NOT EXISTS idx_layer_param_analysis_parameter ON public.layer_parameter_analysis(parameter_name);
CREATE INDEX IF NOT EXISTS idx_layer_param_analysis_within_spec ON public.layer_parameter_analysis(is_within_spec);

-- Message timing analysis indexes
CREATE INDEX IF NOT EXISTS idx_message_timing_test_run_id ON public.message_timing_analysis(test_run_id);
CREATE INDEX IF NOT EXISTS idx_message_timing_flow_id ON public.message_timing_analysis(flow_id);
CREATE INDEX IF NOT EXISTS idx_message_timing_compliance ON public.message_timing_analysis(timing_compliance_score);

-- ==============================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE public.message_flow_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ie_validation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layer_parameter_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_timing_analysis ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 8. CREATE RLS POLICIES
-- ==============================================

-- RLS Policies for message_flow_compliance
CREATE POLICY "Users can view flow compliance from their test runs" ON public.message_flow_compliance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = message_flow_compliance.test_run_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for ie_validation_results
CREATE POLICY "Users can view IE validation from their test runs" ON public.ie_validation_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = ie_validation_results.test_run_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for layer_parameter_analysis
CREATE POLICY "Users can view layer analysis from their test runs" ON public.layer_parameter_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = layer_parameter_analysis.test_run_id 
            AND user_id = auth.uid()
        )
    );

-- RLS Policies for message_timing_analysis
CREATE POLICY "Users can view timing analysis from their test runs" ON public.message_timing_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.test_case_executions 
            WHERE id = message_timing_analysis.test_run_id 
            AND user_id = auth.uid()
        )
    );

-- ==============================================
-- 9. UTILITY FUNCTIONS FOR ANALYSIS
-- ==============================================

-- Function to calculate message flow compliance
CREATE OR REPLACE FUNCTION calculate_message_flow_compliance(
    p_test_run_id UUID,
    p_flow_type TEXT
) RETURNS TABLE (
    flow_name TEXT,
    compliance_score DECIMAL(5,2),
    expected_count INTEGER,
    actual_count INTEGER,
    missing_count INTEGER,
    unexpected_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mfc.flow_name,
        mfc.compliance_score,
        jsonb_array_length(mfc.expected_messages) as expected_count,
        jsonb_array_length(mfc.actual_messages) as actual_count,
        jsonb_array_length(mfc.missing_messages) as missing_count,
        jsonb_array_length(mfc.unexpected_messages) as unexpected_count
    FROM public.message_flow_compliance mfc
    WHERE mfc.test_run_id = p_test_run_id
    AND mfc.flow_type = p_flow_type;
END;
$$ LANGUAGE plpgsql;

-- Function to get IE validation summary
CREATE OR REPLACE FUNCTION get_ie_validation_summary(
    p_test_run_id UUID
) RETURNS TABLE (
    ie_name TEXT,
    total_validations INTEGER,
    valid_count INTEGER,
    invalid_count INTEGER,
    warning_count INTEGER,
    compliance_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ivr.ie_name,
        COUNT(*) as total_validations,
        COUNT(CASE WHEN ivr.is_valid = true THEN 1 END) as valid_count,
        COUNT(CASE WHEN ivr.is_valid = false THEN 1 END) as invalid_count,
        COUNT(CASE WHEN array_length(ivr.validation_warnings, 1) > 0 THEN 1 END) as warning_count,
        ROUND((COUNT(CASE WHEN ivr.is_valid = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2) as compliance_rate
    FROM public.ie_validation_results ivr
    WHERE ivr.test_run_id = p_test_run_id
    GROUP BY ivr.ie_name
    ORDER BY compliance_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get layer performance analysis
CREATE OR REPLACE FUNCTION get_layer_performance_analysis(
    p_test_run_id UUID
) RETURNS TABLE (
    layer TEXT,
    parameter_count INTEGER,
    within_spec_count INTEGER,
    out_of_spec_count INTEGER,
    avg_variance DECIMAL(10,4),
    performance_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lpa.layer,
        COUNT(*) as parameter_count,
        COUNT(CASE WHEN lpa.is_within_spec = true THEN 1 END) as within_spec_count,
        COUNT(CASE WHEN lpa.is_within_spec = false THEN 1 END) as out_of_spec_count,
        ROUND(AVG(ABS(lpa.value_variance)), 4) as avg_variance,
        ROUND((COUNT(CASE WHEN lpa.is_within_spec = true THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2) as performance_score
    FROM public.layer_parameter_analysis lpa
    WHERE lpa.test_run_id = p_test_run_id
    GROUP BY lpa.layer
    ORDER BY performance_score DESC;
END;
$$ LANGUAGE plpgsql;

-- ==============================================
-- 10. GRANT PERMISSIONS
-- ==============================================

-- Grant permissions for new functions
GRANT EXECUTE ON FUNCTION calculate_message_flow_compliance(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_ie_validation_summary(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_layer_performance_analysis(UUID) TO authenticated;

-- ==============================================
-- 11. ADD COMMENTS
-- ==============================================

COMMENT ON TABLE public.message_flow_compliance IS 'Tracks compliance of actual message flows against 3GPP expected flows';
COMMENT ON TABLE public.ie_validation_results IS 'Detailed validation results for information elements against 3GPP standards';
COMMENT ON TABLE public.layer_parameter_analysis IS 'Analysis of layer parameters against 3GPP specifications';
COMMENT ON TABLE public.message_timing_analysis IS 'Timing analysis for message flows against 3GPP timing requirements';

COMMENT ON FUNCTION calculate_message_flow_compliance(UUID, TEXT) IS 'Calculate message flow compliance metrics for a test run';
COMMENT ON FUNCTION get_ie_validation_summary(UUID) IS 'Get summary of IE validation results for a test run';
COMMENT ON FUNCTION get_layer_performance_analysis(UUID) IS 'Get layer performance analysis for a test run';

-- ==============================================
-- 12. SUCCESS MESSAGE
-- ==============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Enhanced test execution flow migration completed successfully!';
    RAISE NOTICE '📊 Added 4 new tables for comprehensive 3GPP compliance tracking';
    RAISE NOTICE '🔍 Added message flow compliance tracking';
    RAISE NOTICE '📋 Added IE validation against 3GPP standards';
    RAISE NOTICE '⚙️ Added layer parameter analysis';
    RAISE NOTICE '⏱️ Added message timing analysis';
    RAISE NOTICE '🎯 Test execution now feeds complete data to real-time simulation tool!';
END $$;